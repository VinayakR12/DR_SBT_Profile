import { NextResponse } from 'next/server'

import {
  ABOUT_CONTENT_KEY,
  ABOUT_CONTENT_TABLE,
} from '@/lib/aboutContent'
import {
  HOME_PROFILE_IMAGES_BUCKET,
  createSupabaseWriteClient,
  getSupabaseStoragePathFromPublicUrl,
  getSupabaseStoragePublicUrl,
} from '@/lib/supabase'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const DEFAULT_IMAGE_PATH = '/Profile_pic/SBT_About.jpg'

const isAllowedImageType = (mimeType: string): boolean => ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)

const parseAboutContent = (value: unknown): Record<string, unknown> => {
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

const readAboutRow = async (client: NonNullable<ReturnType<typeof createSupabaseWriteClient>>) => {
  const { data, error } = await client
    .from(ABOUT_CONTENT_TABLE)
    .select('content')
    .eq('section_key', ABOUT_CONTENT_KEY)
    .maybeSingle()

  if (error) {
    return { error: error.message, content: {} as Record<string, unknown> }
  }

  const rowContent = parseAboutContent((data as { content?: unknown } | null)?.content)
  return { content: rowContent }
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

    if (!isAllowedImageType(file.type)) {
      return NextResponse.json({ ok: false, message: 'Only JPG, PNG, and WEBP files are supported.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, message: 'Image is too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const bucketError = await ensureProfileBucket(client)
    if (bucketError) {
      return NextResponse.json({ ok: false, message: bucketError }, { status: 503 })
    }

    const filePath = `about/profile-${Date.now()}.${file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || 'jpg' : 'jpg'}`
    const uploadResult = await client.storage.from(HOME_PROFILE_IMAGES_BUCKET).upload(filePath, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    })

    if (uploadResult.error) {
      return NextResponse.json({ ok: false, message: uploadResult.error.message }, { status: 503 })
    }

    const imageUrl = getSupabaseStoragePublicUrl(HOME_PROFILE_IMAGES_BUCKET, filePath)
    const { content: existing } = await readAboutRow(client)
    const heroContent = {
      ...(parseAboutContent(existing?.heroContent) as Record<string, unknown>),
      profileImageUrl: imageUrl,
    }

    const nextContent = {
      ...existing,
      heroContent,
    }

    const { error: upsertError } = await client.from(ABOUT_CONTENT_TABLE).upsert(
      {
        section_key: ABOUT_CONTENT_KEY,
        content: nextContent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (upsertError) {
      return NextResponse.json({ ok: false, message: upsertError.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, imageUrl, content: nextContent, message: 'About profile image uploaded successfully.' })
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : 'Unable to upload about profile image.' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const client = createSupabaseWriteClient()
    if (!client) {
      return NextResponse.json({ ok: false, message: 'Supabase service role key is required for uploads.' }, { status: 503 })
    }

    const { content: existing } = await readAboutRow(client)
    const existingHero = parseAboutContent(existing?.heroContent)
    const previousImageUrl = typeof existingHero.profileImageUrl === 'string' ? existingHero.profileImageUrl : ''
    const storagePath = getSupabaseStoragePathFromPublicUrl(previousImageUrl, HOME_PROFILE_IMAGES_BUCKET)

    const heroContent = {
      ...existingHero,
      profileImageUrl: DEFAULT_IMAGE_PATH,
    }

    const nextContent = {
      ...existing,
      heroContent,
    }

    const { error: upsertError } = await client.from(ABOUT_CONTENT_TABLE).upsert(
      {
        section_key: ABOUT_CONTENT_KEY,
        content: nextContent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (upsertError) {
      return NextResponse.json({ ok: false, message: upsertError.message }, { status: 503 })
    }

    if (storagePath) {
      await client.storage.from(HOME_PROFILE_IMAGES_BUCKET).remove([storagePath])
    }

    return NextResponse.json({ ok: true, content: nextContent, message: 'About profile image restored to the default image.' })
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : 'Unable to remove about profile image.' }, { status: 500 })
  }
}
