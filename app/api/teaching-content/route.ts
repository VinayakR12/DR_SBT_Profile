import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseReadClient, createSupabaseWriteClient, getSupabaseStatus } from '@/lib/supabase'
import {
  TEACHING_KEY,
  TEACHING_TABLE,
  TEACHING_SECTION_KEYS,
  STATIC_TEACHING_CONTENT,
  getTeachingSnapshot,
  normalizeTeachingContent,
  type TeachingContentRaw,
  type TeachingSectionKey,
} from '@/lib/teachingContent'

type SaveBody = {
  sectionKey?: TeachingSectionKey
  content?: Partial<TeachingContentRaw>
}

const isSectionKey = (value: string): value is TeachingSectionKey =>
  TEACHING_SECTION_KEYS.includes(value as TeachingSectionKey)

const parseContent = (value: unknown): Partial<TeachingContentRaw> | null => {
  if (value && typeof value === 'object') {
    return value as Partial<TeachingContentRaw>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Partial<TeachingContentRaw>
      }
    } catch {
      return null
    }
  }

  return null
}

const readRemote = async (): Promise<Partial<TeachingContentRaw>> => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[teaching] Supabase client is not configured. Falling back to static content.')
    return {}
  }

  const { data, error } = await client
    .from(TEACHING_TABLE)
    .select('content, updated_at')
    .eq('section_key', TEACHING_KEY)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('[teaching] Failed reading content from Supabase:', error.message)
    }
    return {}
  }

  return parseContent((data as { content?: unknown }).content) || {}
}

const upsertContent = async (content: TeachingContentRaw) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const { error } = await client.from(TEACHING_TABLE).upsert(
    {
      section_key: TEACHING_KEY,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' },
  )

  if (error) {
    console.error('[teaching] Failed to save content:', error.message)
    return { ok: false as const, message: error.message }
  }

  return { ok: true as const }
}

export async function GET() {
  try {
    const remote = await readRemote()
    const hasRemote = Object.keys(remote).length > 0

    return NextResponse.json({
      ok: true,
      source: hasRemote ? 'supabase' : 'backup',
      content: normalizeTeachingContent(remote),
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    console.error('[teaching] GET failed, using static fallback:', error)
    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_TEACHING_CONTENT,
      supabase: getSupabaseStatus(),
      message: error instanceof Error ? error.message : 'Using backup content.',
    })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveBody

    if (!body.sectionKey || !isSectionKey(body.sectionKey)) {
      return NextResponse.json({ ok: false, message: 'Valid sectionKey is required.' }, { status: 400 })
    }

    const sectionValue = body.content?.[body.sectionKey]
    if (sectionValue === undefined) {
      return NextResponse.json({ ok: false, message: 'Section content is required.' }, { status: 400 })
    }

    const current = normalizeTeachingContent(await readRemote())
    const next = normalizeTeachingContent({
      ...current,
      [body.sectionKey]: sectionValue,
    })

    const result = await upsertContent(next)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next })
  } catch (error) {
    console.error('[teaching] PUT failed:', error)
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Unable to save teaching content.' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: string; content?: Partial<TeachingContentRaw> }
    if (body.action !== 'sync-all') {
      return NextResponse.json({ ok: false, message: 'Unsupported action.' }, { status: 400 })
    }

    const content = getTeachingSnapshot(body.content)
    const result = await upsertContent(content)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content })
  } catch (error) {
    console.error('[teaching] POST failed:', error)
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Unable to sync teaching content.' },
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

    const { error } = await client.from(TEACHING_TABLE).delete().eq('section_key', TEACHING_KEY)
    if (error) {
      console.error('[teaching] Failed deleting content:', error.message)
      return NextResponse.json({ ok: false, message: error.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'backup', content: STATIC_TEACHING_CONTENT })
  } catch (error) {
    console.error('[teaching] DELETE failed:', error)
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Unable to delete teaching content.' },
      { status: 500 },
    )
  }
}
