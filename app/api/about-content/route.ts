import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseReadClient, createSupabaseWriteClient, getSupabaseStatus } from '@/lib/supabase'
import {
  ABOUT_CONTENT_KEY,
  ABOUT_CONTENT_TABLE,
  STATIC_ABOUT_CONTENT,
  getAboutContentSnapshot,
  normalizeAboutContent,
  type AboutContentRaw,
} from '@/lib/aboutContent'

type AboutContentBody = {
  content?: Partial<AboutContentRaw>
}

const parseContent = (value: unknown): Partial<AboutContentRaw> | null => {
  if (value && typeof value === 'object') {
    return value as Partial<AboutContentRaw>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Partial<AboutContentRaw>
      }
    } catch {
      return null
    }
  }

  return null
}

const readAboutContent = async (): Promise<Partial<AboutContentRaw>> => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[about-content] Supabase client is not configured. Falling back to static content.')
    return {}
  }

  const { data, error } = await client
    .from(ABOUT_CONTENT_TABLE)
    .select('content, updated_at')
    .eq('section_key', ABOUT_CONTENT_KEY)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('[about-content] Failed reading content from Supabase:', error.message)
    }
    return {}
  }

  return parseContent((data as { content?: unknown }).content) || {}
}

const saveAboutContent = async (content: AboutContentRaw) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    console.error('[about-content] Write client missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local.')
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const { error } = await client.from(ABOUT_CONTENT_TABLE).upsert(
    {
      section_key: ABOUT_CONTENT_KEY,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' },
  )

  if (error) {
    console.error('[about-content] Failed to save content:', error.message)
    return { ok: false as const, message: error.message }
  }

  return { ok: true as const }
}

export async function GET() {
  try {
    const remote = await readAboutContent()
    const hasRemoteContent = Object.keys(remote).length > 0

    return NextResponse.json({
      ok: true,
      source: hasRemoteContent ? 'supabase' : 'backup',
      content: normalizeAboutContent(remote),
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    console.error('[about-content] GET failed, using static fallback:', error)
    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_ABOUT_CONTENT,
      supabase: getSupabaseStatus(),
      message: error instanceof Error ? error.message : 'Using backup content.',
    })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as AboutContentBody
    const content = getAboutContentSnapshot(body.content)
    const result = await saveAboutContent(content)

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content })
  } catch (error) {
    console.error('[about-content] PUT failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to save about content.',
      },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    const client = createSupabaseWriteClient()
    if (!client) {
      return NextResponse.json({ ok: false, message: 'Supabase service role key is required for writes.' }, { status: 503 })
    }

    const { error } = await client.from(ABOUT_CONTENT_TABLE).delete().eq('section_key', ABOUT_CONTENT_KEY)
    if (error) {
      console.error('[about-content] Failed to delete content:', error.message)
      return NextResponse.json({ ok: false, message: error.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'backup', content: STATIC_ABOUT_CONTENT })
  } catch (error) {
    console.error('[about-content] DELETE failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to delete about content.',
      },
      { status: 500 },
    )
  }
}
