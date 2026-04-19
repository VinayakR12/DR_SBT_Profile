import { NextResponse } from 'next/server'

import {
  ACHIEVEMENTS_CERTIFICATES_KEY,
  ACHIEVEMENTS_CERTIFICATES_TABLE,
  normalizeCertificatesContent,
  type CertificatesContentRaw,
} from '@/lib/certificatesContent'
import {
  ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET,
  createSupabaseWriteClient,
  getSupabaseStoragePathFromPublicUrl,
  getSupabaseStoragePublicUrl,
} from '@/lib/supabase'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_DOCUMENT_MIME = ['application/pdf']
const ALLOWED_ASSET_MIME = [...ALLOWED_IMAGE_MIME, ...ALLOWED_DOCUMENT_MIME]

const parseContent = (value: unknown): Partial<CertificatesContentRaw> | null => {
  if (value && typeof value === 'object') {
    return value as Partial<CertificatesContentRaw>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Partial<CertificatesContentRaw>
      }
    } catch {
      return null
    }
  }

  return null
}

const sanitizeExtension = (name: string, fallback: string): string => {
  const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() || fallback : fallback
  const safe = ext.replace(/[^a-z0-9]/g, '')
  return safe || fallback
}

const ensureBucket = async (client: NonNullable<ReturnType<typeof createSupabaseWriteClient>>): Promise<string | null> => {
  const { data, error } = await client.storage.getBucket(ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET)
  if (!error && data) {
    return null
  }

  const createResult = await client.storage.createBucket(ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET, {
    public: true,
    fileSizeLimit: `${MAX_FILE_SIZE}`,
    allowedMimeTypes: [...ALLOWED_ASSET_MIME],
  })

  if (createResult.error && !createResult.error.message.toLowerCase().includes('already exists')) {
    return createResult.error.message
  }

  return null
}

const readRow = async (client: NonNullable<ReturnType<typeof createSupabaseWriteClient>>) => {
  const { data, error } = await client
    .from(ACHIEVEMENTS_CERTIFICATES_TABLE)
    .select('content')
    .eq('section_key', ACHIEVEMENTS_CERTIFICATES_KEY)
    .maybeSingle()

  if (error) {
    return { error: error.message, content: normalizeCertificatesContent() }
  }

  return { content: normalizeCertificatesContent(parseContent((data as { content?: unknown } | null)?.content) || {}) }
}

export async function POST(req: Request) {
  try {
    const client = createSupabaseWriteClient()
    if (!client) {
      return NextResponse.json({ ok: false, message: 'Supabase service role key is required for uploads.' }, { status: 503 })
    }

    const formData = await req.formData()
    const file = formData.get('file')
    const certificateId = `${formData.get('certificateId') || ''}`

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: 'File is required.' }, { status: 400 })
    }

    if (!certificateId) {
      return NextResponse.json({ ok: false, message: 'certificateId is required.' }, { status: 400 })
    }

    if (!ALLOWED_ASSET_MIME.includes(file.type)) {
      return NextResponse.json({ ok: false, message: 'Only image or PDF is allowed.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, message: 'File is too large. Maximum size is 20MB.' }, { status: 400 })
    }

    const bucketError = await ensureBucket(client)
    if (bucketError) {
      return NextResponse.json({ ok: false, message: bucketError }, { status: 503 })
    }

    const extension = sanitizeExtension(file.name, ALLOWED_IMAGE_MIME.includes(file.type) ? 'jpg' : 'pdf')
    const path = `achievements-certificates/${certificateId}/asset-${Date.now()}.${extension}`

    const uploadResult = await client.storage.from(ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET).upload(path, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    })

    if (uploadResult.error) {
      return NextResponse.json({ ok: false, message: uploadResult.error.message }, { status: 503 })
    }

    const assetUrl = getSupabaseStoragePublicUrl(ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET, path)
    const { error: readError, content } = await readRow(client)
    if (readError) {
      return NextResponse.json({ ok: false, message: readError }, { status: 503 })
    }

    let previousUrl = ''
    const next = {
      ...content,
      certificates: content.certificates.map((certificate) => {
        if (certificate.id !== certificateId) {
          return certificate
        }

        previousUrl = certificate.file || ''
        return {
          ...certificate,
          file: assetUrl,
          type: ALLOWED_IMAGE_MIME.includes(file.type) ? 'image' : 'pdf',
        }
      }),
    }

    const { error: upsertError } = await client.from(ACHIEVEMENTS_CERTIFICATES_TABLE).upsert(
      {
        section_key: ACHIEVEMENTS_CERTIFICATES_KEY,
        content: next,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (upsertError) {
      return NextResponse.json({ ok: false, message: upsertError.message }, { status: 503 })
    }

    const previousPath = getSupabaseStoragePathFromPublicUrl(previousUrl, ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET)
    if (previousPath && previousPath !== path) {
      await client.storage.from(ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET).remove([previousPath])
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next, assetUrl, message: 'Asset uploaded successfully.' })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Unable to upload certificate asset.' },
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
      certificateId?: string
      assetUrl?: string
    }

    if (!body.certificateId) {
      return NextResponse.json({ ok: false, message: 'certificateId is required.' }, { status: 400 })
    }

    const { error: readError, content } = await readRow(client)
    if (readError) {
      return NextResponse.json({ ok: false, message: readError }, { status: 503 })
    }

    let previousUrl = ''
    const next = {
      ...content,
      certificates: content.certificates.map((certificate) => {
        if (certificate.id !== body.certificateId) {
          return certificate
        }

        previousUrl = certificate.file || ''
        return {
          ...certificate,
          file: '',
        }
      }),
    }

    const { error: upsertError } = await client.from(ACHIEVEMENTS_CERTIFICATES_TABLE).upsert(
      {
        section_key: ACHIEVEMENTS_CERTIFICATES_KEY,
        content: next,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (upsertError) {
      return NextResponse.json({ ok: false, message: upsertError.message }, { status: 503 })
    }

    const removeUrl = body.assetUrl || previousUrl
    const storagePath = getSupabaseStoragePathFromPublicUrl(removeUrl, ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET)
    if (storagePath) {
      await client.storage.from(ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET).remove([storagePath])
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next, message: 'Asset removed successfully.' })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Unable to remove certificate asset.' },
      { status: 500 },
    )
  }
}
