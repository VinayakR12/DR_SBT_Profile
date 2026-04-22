import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseReadClient, createSupabaseWriteClient, getSupabaseStatus } from '@/lib/supabase'
import {
  CONTACT_CONTENT_KEY,
  CONTACT_CONTENT_TABLE,
  STATIC_CONTACT_CONTENT,
  getContactContentSnapshot,
  normalizeContactContent,
  type ContactContentRaw,
} from '@/lib/contactContent'

type ContactContentBody = {
  content?: Partial<ContactContentRaw>
}

const parseContent = (value: unknown): Partial<ContactContentRaw> | null => {
  if (value && typeof value === 'object') {
    return value as Partial<ContactContentRaw>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Partial<ContactContentRaw>
      }
    } catch {
      return null
    }
  }

  return null
}

const readContactContent = async (): Promise<{ found: boolean; data: Partial<ContactContentRaw> }> => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[contact-content] Supabase client is not configured. Falling back to static content.')
    return { found: false, data: {} }
  }

  const { data, error } = await client
    .from(CONTACT_CONTENT_TABLE)
    .select('content, updated_at')
    .eq('section_key', CONTACT_CONTENT_KEY)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('[contact-content] Failed reading content from Supabase:', error.message)
    }
    return { found: false, data: {} }
  }

  const parsed = parseContent((data as { content?: unknown }).content) || {}
  const hasPayload = Object.keys(parsed).length > 0

  return { found: hasPayload, data: parsed }
}

const saveContactContent = async (content: ContactContentRaw) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    console.error('[contact-content] Write client missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local.')
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const { error } = await client.from(CONTACT_CONTENT_TABLE).upsert(
    {
      section_key: CONTACT_CONTENT_KEY,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' },
  )

  if (error) {
    console.error('[contact-content] Failed to save content:', error.message)
    return { ok: false as const, message: error.message }
  }

  return { ok: true as const }
}

export async function GET() {
  try {
    const remote = await readContactContent()
    if (remote.found) {
      return NextResponse.json({
        ok: true,
        source: 'supabase',
        content: normalizeContactContent(remote.data),
        supabase: getSupabaseStatus(),
      })
    }

    const seedResult = await saveContactContent(STATIC_CONTACT_CONTENT)
    if (seedResult.ok) {
      return NextResponse.json({
        ok: true,
        source: 'supabase',
        content: STATIC_CONTACT_CONTENT,
        supabase: getSupabaseStatus(),
        message: 'Contact content was seeded from backup into Supabase.',
      })
    }

    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_CONTACT_CONTENT,
      supabase: getSupabaseStatus(),
      message: seedResult.message || 'Supabase is unavailable. Rendering backup contact content.',
    })
  } catch (error) {
    console.error('[contact-content] GET failed, using static fallback:', error)
    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_CONTACT_CONTENT,
      supabase: getSupabaseStatus(),
      message: error instanceof Error ? error.message : 'Using backup content.',
    })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactContentBody
    const content = getContactContentSnapshot(body.content)
    const result = await saveContactContent(content)

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content })
  } catch (error) {
    console.error('[contact-content] PUT failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to save contact content.',
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

    const { error } = await client.from(CONTACT_CONTENT_TABLE).delete().eq('section_key', CONTACT_CONTENT_KEY)
    if (error) {
      console.error('[contact-content] Failed to delete content:', error.message)
      return NextResponse.json({ ok: false, message: error.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'backup', content: STATIC_CONTACT_CONTENT })
  } catch (error) {
    console.error('[contact-content] DELETE failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to delete contact content.',
      },
      { status: 500 },
    )
  }
}
