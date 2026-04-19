import { NextResponse } from 'next/server'

import {
  RESEARCH_PATENTS_KEY,
  RESEARCH_PATENTS_TABLE,
  normalizeResearchPatentsContent,
  type ResearchPatentsContentRaw,
} from '@/lib/researchPatentsContent'
import {
  RESEARCH_PATENTS_ASSETS_BUCKET,
  createSupabaseWriteClient,
  getSupabaseStoragePathFromPublicUrl,
  getSupabaseStoragePublicUrl,
} from '@/lib/supabase'

type EntryType = 'patent' | 'copyright'
type AssetKind = 'asset' | 'image' | 'document'

const MAX_FILE_SIZE = 20 * 1024 * 1024

const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_DOCUMENT_MIME = ['application/pdf']
const ALLOWED_ASSET_MIME = [...ALLOWED_IMAGE_MIME, ...ALLOWED_DOCUMENT_MIME]

const parseContent = (value: unknown): Partial<ResearchPatentsContentRaw> | null => {
  if (value && typeof value === 'object') {
    return value as Partial<ResearchPatentsContentRaw>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Partial<ResearchPatentsContentRaw>
      }
    } catch {
      return null
    }
  }

  return null
}

const isEntryType = (value: string): value is EntryType => value === 'patent' || value === 'copyright'
const isAssetKind = (value: string): value is AssetKind =>
  value === 'asset' || value === 'image' || value === 'document'

const sanitizeExtension = (name: string, fallback: string): string => {
  const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() || fallback : fallback
  const safe = ext.replace(/[^a-z0-9]/g, '')
  return safe || fallback
}

const ensureBucket = async (client: NonNullable<ReturnType<typeof createSupabaseWriteClient>>): Promise<string | null> => {
  const { data, error } = await client.storage.getBucket(RESEARCH_PATENTS_ASSETS_BUCKET)
  if (!error && data) {
    return null
  }

  const createResult = await client.storage.createBucket(RESEARCH_PATENTS_ASSETS_BUCKET, {
    public: true,
    fileSizeLimit: `${MAX_FILE_SIZE}`,
    allowedMimeTypes: [...ALLOWED_ASSET_MIME],
  })

  if (createResult.error && !createResult.error.message.toLowerCase().includes('already exists')) {
    return createResult.error.message
  }

  return null
}

const updateEntryAsset = (
  content: ResearchPatentsContentRaw,
  entryType: EntryType,
  entryId: number,
  assetKind: AssetKind,
  assetUrl: string,
  legacyKind?: 'image' | 'document',
): { next: ResearchPatentsContentRaw; previousUrl: string } => {
  if (entryType === 'patent') {
    let previousUrl = ''
    const nextPatents = content.patents.map((item) => {
      if (item.id !== entryId) {
        return item
      }

      previousUrl =
        assetKind === 'asset'
          ? item.assetUrl || item.documentUrl || item.imageUrl || ''
          : assetKind === 'image'
            ? item.imageUrl || ''
            : item.documentUrl || ''

      if (assetKind === 'asset') {
        return {
          ...item,
          assetUrl,
          ...(legacyKind === 'image' ? { imageUrl: assetUrl } : {}),
          ...(legacyKind === 'document' ? { documentUrl: assetUrl } : {}),
        }
      }

      return {
        ...item,
        ...(assetKind === 'image' ? { imageUrl: assetUrl } : { documentUrl: assetUrl }),
      }
    })

    return { next: { ...content, patents: nextPatents }, previousUrl }
  }

  let previousUrl = ''
  const nextCopyrights = content.copyrights.map((item) => {
    if (item.id !== entryId) {
      return item
    }

    previousUrl =
      assetKind === 'asset'
        ? item.assetUrl || item.documentUrl || item.imageUrl || ''
        : assetKind === 'image'
          ? item.imageUrl || ''
          : item.documentUrl || ''

    if (assetKind === 'asset') {
      return {
        ...item,
        assetUrl,
        ...(legacyKind === 'image' ? { imageUrl: assetUrl } : {}),
        ...(legacyKind === 'document' ? { documentUrl: assetUrl } : {}),
      }
    }

    return {
      ...item,
      ...(assetKind === 'image' ? { imageUrl: assetUrl } : { documentUrl: assetUrl }),
    }
  })

  return { next: { ...content, copyrights: nextCopyrights }, previousUrl }
}

const clearEntryAsset = (
  content: ResearchPatentsContentRaw,
  entryType: EntryType,
  entryId: number,
  assetKind: AssetKind,
): { next: ResearchPatentsContentRaw; previousUrl: string } => {
  if (assetKind === 'asset') {
    if (entryType === 'patent') {
      let previousUrl = ''
      const nextPatents = content.patents.map((item) => {
        if (item.id !== entryId) {
          return item
        }

        previousUrl = item.assetUrl || item.documentUrl || item.imageUrl || ''
        return {
          ...item,
          assetUrl: '',
          imageUrl: '',
          documentUrl: '',
        }
      })

      return { next: { ...content, patents: nextPatents }, previousUrl }
    }

    let previousUrl = ''
    const nextCopyrights = content.copyrights.map((item) => {
      if (item.id !== entryId) {
        return item
      }

      previousUrl = item.assetUrl || item.documentUrl || item.imageUrl || ''
      return {
        ...item,
        assetUrl: '',
        imageUrl: '',
        documentUrl: '',
      }
    })

    return { next: { ...content, copyrights: nextCopyrights }, previousUrl }
  }

  return updateEntryAsset(content, entryType, entryId, assetKind, '')
}

const readRow = async (client: NonNullable<ReturnType<typeof createSupabaseWriteClient>>) => {
  const { data, error } = await client
    .from(RESEARCH_PATENTS_TABLE)
    .select('content')
    .eq('section_key', RESEARCH_PATENTS_KEY)
    .maybeSingle()

  if (error) {
    return { error: error.message, content: normalizeResearchPatentsContent() }
  }

  return { content: normalizeResearchPatentsContent(parseContent((data as { content?: unknown } | null)?.content) || {}) }
}

export async function POST(req: Request) {
  try {
    const client = createSupabaseWriteClient()
    if (!client) {
      return NextResponse.json({ ok: false, message: 'Supabase service role key is required for uploads.' }, { status: 503 })
    }

    const formData = await req.formData()
    const file = formData.get('file')
    const entryTypeRaw = `${formData.get('entryType') || ''}`
    const assetKindRaw = `${formData.get('assetKind') || 'asset'}`
    const entryIdRaw = Number(formData.get('entryId'))

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: 'File is required.' }, { status: 400 })
    }

    if (!isEntryType(entryTypeRaw) || !isAssetKind(assetKindRaw) || !Number.isFinite(entryIdRaw)) {
      return NextResponse.json({ ok: false, message: 'entryType, entryId and assetKind are required.' }, { status: 400 })
    }

    const allowedTypes = assetKindRaw === 'asset'
      ? ALLOWED_ASSET_MIME
      : assetKindRaw === 'image'
        ? ALLOWED_IMAGE_MIME
        : ALLOWED_DOCUMENT_MIME
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ ok: false, message: `Invalid ${assetKindRaw} type.` }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, message: 'File is too large. Maximum size is 20MB.' }, { status: 400 })
    }

    const bucketError = await ensureBucket(client)
    if (bucketError) {
      return NextResponse.json({ ok: false, message: bucketError }, { status: 503 })
    }

    const extension = sanitizeExtension(file.name, assetKindRaw === 'image' ? 'jpg' : 'pdf')
    const path = `research-patents/${entryTypeRaw}/${entryIdRaw}/${assetKindRaw}-${Date.now()}.${extension}`

    const uploadResult = await client.storage.from(RESEARCH_PATENTS_ASSETS_BUCKET).upload(path, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    })

    if (uploadResult.error) {
      return NextResponse.json({ ok: false, message: uploadResult.error.message }, { status: 503 })
    }

    const assetUrl = getSupabaseStoragePublicUrl(RESEARCH_PATENTS_ASSETS_BUCKET, path)
    const { error: readError, content } = await readRow(client)
    if (readError) {
      return NextResponse.json({ ok: false, message: readError }, { status: 503 })
    }

    const legacyKind: 'image' | 'document' = ALLOWED_IMAGE_MIME.includes(file.type) ? 'image' : 'document'
    const { next, previousUrl } = updateEntryAsset(content, entryTypeRaw, entryIdRaw, assetKindRaw, assetUrl, legacyKind)
    const { error: upsertError } = await client.from(RESEARCH_PATENTS_TABLE).upsert(
      {
        section_key: RESEARCH_PATENTS_KEY,
        content: next,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (upsertError) {
      return NextResponse.json({ ok: false, message: upsertError.message }, { status: 503 })
    }

    const previousPath = getSupabaseStoragePathFromPublicUrl(previousUrl, RESEARCH_PATENTS_ASSETS_BUCKET)
    if (previousPath && previousPath !== path) {
      await client.storage.from(RESEARCH_PATENTS_ASSETS_BUCKET).remove([previousPath])
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next, assetUrl, message: 'Asset uploaded successfully.' })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Unable to upload patent asset.' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const client = createSupabaseWriteClient()
    if (!client) {
      return NextResponse.json({ ok: false, message: 'Supabase service role key is required for uploads.' }, { status: 503 })
    }

    const body = (await req.json()) as {
      entryType?: EntryType
      entryId?: number
      assetKind?: AssetKind
      assetUrl?: string
    }

    if (!body.entryType || !body.assetKind || !Number.isFinite(Number(body.entryId))) {
      return NextResponse.json({ ok: false, message: 'entryType, entryId and assetKind are required.' }, { status: 400 })
    }

    if (!isEntryType(body.entryType) || !isAssetKind(body.assetKind)) {
      return NextResponse.json({ ok: false, message: 'Invalid entryType or assetKind.' }, { status: 400 })
    }

    const { error: readError, content } = await readRow(client)
    if (readError) {
      return NextResponse.json({ ok: false, message: readError }, { status: 503 })
    }

    const { next, previousUrl } = clearEntryAsset(content, body.entryType, Number(body.entryId), body.assetKind)
    const { error: upsertError } = await client.from(RESEARCH_PATENTS_TABLE).upsert(
      {
        section_key: RESEARCH_PATENTS_KEY,
        content: next,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (upsertError) {
      return NextResponse.json({ ok: false, message: upsertError.message }, { status: 503 })
    }

    const removeUrl = body.assetUrl || previousUrl
    const storagePath = getSupabaseStoragePathFromPublicUrl(removeUrl, RESEARCH_PATENTS_ASSETS_BUCKET)
    if (storagePath) {
      await client.storage.from(RESEARCH_PATENTS_ASSETS_BUCKET).remove([storagePath])
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next, message: 'Asset removed successfully.' })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Unable to remove patent asset.' },
      { status: 500 },
    )
  }
}
