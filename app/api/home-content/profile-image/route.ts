import { NextResponse } from 'next/server'

import {
  HOME_CONTENT_TABLE,
  HOME_PROFILE_IMAGES_BUCKET,
  createSupabaseWriteClient,
  getSupabaseStoragePathFromPublicUrl,
  getSupabaseStoragePublicUrl,
} from '@/lib/supabase'
import { normalizeHomeContent } from '@/lib/homeContent'

const ID_CARD_SECTION_KEY = 'idCard'
const MAX_FILE_SIZE = 5 * 1024 * 1024

const isAllowedImageType = (mimeType: string): boolean => ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)

const parseIdCardContent = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, unknown>
      }
    } catch {
      return {}
    }
  }

  return {}
}

const buildFilePath = (fileName: string): string => {
  const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() || 'jpg' : 'jpg'
  const safeExt = extension.replace(/[^a-z0-9]/g, '') || 'jpg'
  return `id-card/profile-${Date.now()}.${safeExt}`
}

const ensureProfileBucket = async (client: NonNullable<ReturnType<typeof createSupabaseWriteClient>>): Promise<string | null> => {
  const { data, error } = await client.storage.getBucket(HOME_PROFILE_IMAGES_BUCKET)

  if (!error && data) {
    return null
  }

  const createResult = await client.storage.createBucket(HOME_PROFILE_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: `${MAX_FILE_SIZE}`,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })

  if (createResult.error && !createResult.error.message.toLowerCase().includes('already exists')) {
    return createResult.error.message
  }

  return null
}

export async function POST(req: Request) {
  try {
    const client = createSupabaseWriteClient()
    if (!client) {
      return NextResponse.json({ ok: false, message: 'Supabase service role key is required for uploads.' }, { status: 503 })
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: 'Image file is required.' }, { status: 400 })
    }

    const bucketErrorMessage = await ensureProfileBucket(client)
    if (bucketErrorMessage) {
      return NextResponse.json({ ok: false, message: bucketErrorMessage }, { status: 503 })
    }

    if (!isAllowedImageType(file.type)) {
      return NextResponse.json({ ok: false, message: 'Only JPG, PNG, and WEBP files are supported.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, message: 'Image is too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const filePath = buildFilePath(file.name)
    const uploadResult = await client.storage.from(HOME_PROFILE_IMAGES_BUCKET).upload(filePath, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    })

    if (uploadResult.error) {
      const message = uploadResult.error.message.includes('Bucket not found')
        ? `Supabase bucket \"${HOME_PROFILE_IMAGES_BUCKET}\" is missing and could not be auto-created.`
        : uploadResult.error.message
      return NextResponse.json({ ok: false, message }, { status: 503 })
    }

    const imageUrl = getSupabaseStoragePublicUrl(HOME_PROFILE_IMAGES_BUCKET, filePath)

    const { data: existingRow, error: readError } = await client
      .from(HOME_CONTENT_TABLE)
      .select('content')
      .eq('section_key', ID_CARD_SECTION_KEY)
      .maybeSingle()

    if (readError) {
      return NextResponse.json({ ok: false, message: readError.message }, { status: 503 })
    }

    const normalized = normalizeHomeContent({ idCard: parseIdCardContent(existingRow?.content) as never })
    const previousImageUrl = normalized.idCard.imageUrl || ''

    const idCardContent = {
      ...normalized.idCard,
      imageUrl,
    }

    const { error: upsertError } = await client.from(HOME_CONTENT_TABLE).upsert(
      {
        section_key: ID_CARD_SECTION_KEY,
        content: idCardContent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (upsertError) {
      return NextResponse.json({ ok: false, message: upsertError.message }, { status: 503 })
    }

    const oldPath = getSupabaseStoragePathFromPublicUrl(previousImageUrl, HOME_PROFILE_IMAGES_BUCKET)
    if (oldPath && oldPath !== filePath) {
      await client.storage.from(HOME_PROFILE_IMAGES_BUCKET).remove([oldPath])
    }

    return NextResponse.json({
      ok: true,
      imageUrl,
      idCard: idCardContent,
      message: 'Profile image uploaded successfully.',
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to upload profile image.',
      },
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

    const body = (await req.json()) as { imageUrl?: string }
    const imageUrl = body.imageUrl?.trim()

    const { data: existingRow, error: readError } = await client
      .from(HOME_CONTENT_TABLE)
      .select('content')
      .eq('section_key', ID_CARD_SECTION_KEY)
      .maybeSingle()

    if (readError) {
      return NextResponse.json({ ok: false, message: readError.message }, { status: 503 })
    }

    const normalized = normalizeHomeContent({ idCard: parseIdCardContent(existingRow?.content) as never })
    const nextIdCard = {
      ...normalized.idCard,
      imageUrl: '',
    }

    const { error: upsertError } = await client.from(HOME_CONTENT_TABLE).upsert(
      {
        section_key: ID_CARD_SECTION_KEY,
        content: nextIdCard,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (upsertError) {
      return NextResponse.json({ ok: false, message: upsertError.message }, { status: 503 })
    }

    const storagePath = getSupabaseStoragePathFromPublicUrl(imageUrl || normalized.idCard.imageUrl || '', HOME_PROFILE_IMAGES_BUCKET)
    if (storagePath) {
      await client.storage.from(HOME_PROFILE_IMAGES_BUCKET).remove([storagePath])
    }

    return NextResponse.json({
      ok: true,
      idCard: nextIdCard,
      message: 'Profile image removed. Backup avatar is now active.',
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to remove profile image.',
      },
      { status: 500 },
    )
  }
}
