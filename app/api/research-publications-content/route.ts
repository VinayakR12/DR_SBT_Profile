import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseReadClient, createSupabaseWriteClient, getSupabaseStatus } from '@/lib/supabase'
import {
  RESEARCH_PUBLICATIONS_KEY,
  RESEARCH_PUBLICATIONS_SECTION_KEYS,
  RESEARCH_PUBLICATIONS_TABLE,
  STATIC_RESEARCH_PUBLICATIONS_CONTENT,
  getResearchPublicationsSnapshot,
  normalizeResearchPublicationsContent,
  type ResearchPublicationsContentRaw,
  type ResearchPublicationsSectionKey,
} from '@/lib/researchPublicationsContent'

type SaveBody = {
  sectionKey?: ResearchPublicationsSectionKey
  content?: Partial<ResearchPublicationsContentRaw>
}

const isSectionKey = (value: string): value is ResearchPublicationsSectionKey =>
  RESEARCH_PUBLICATIONS_SECTION_KEYS.includes(value as ResearchPublicationsSectionKey)

const parseContent = (value: unknown): Partial<ResearchPublicationsContentRaw> | null => {
  if (value && typeof value === 'object') {
    return value as Partial<ResearchPublicationsContentRaw>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Partial<ResearchPublicationsContentRaw>
      }
    } catch {
      return null
    }
  }

  return null
}

const readRemote = async (): Promise<Partial<ResearchPublicationsContentRaw>> => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[research-publications] Supabase client is not configured. Falling back to static content.')
    return {}
  }

  const { data, error } = await client
    .from(RESEARCH_PUBLICATIONS_TABLE)
    .select('content, updated_at')
    .eq('section_key', RESEARCH_PUBLICATIONS_KEY)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('[research-publications] Failed reading content from Supabase:', error.message)
    }
    return {}
  }

  return parseContent((data as { content?: unknown }).content) || {}
}

const upsertContent = async (content: ResearchPublicationsContentRaw) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const { error } = await client.from(RESEARCH_PUBLICATIONS_TABLE).upsert(
    {
      section_key: RESEARCH_PUBLICATIONS_KEY,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' },
  )

  if (error) {
    console.error('[research-publications] Failed to save content:', error.message)
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
      content: normalizeResearchPublicationsContent(remote),
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    console.error('[research-publications] GET failed, using static fallback:', error)
    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_RESEARCH_PUBLICATIONS_CONTENT,
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

    const current = normalizeResearchPublicationsContent(await readRemote())
    const next = normalizeResearchPublicationsContent({
      ...current,
      [body.sectionKey]: sectionValue,
    })

    const result = await upsertContent(next)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next })
  } catch (error) {
    console.error('[research-publications] PUT failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to save research publications content.',
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: string; content?: Partial<ResearchPublicationsContentRaw> }
    if (body.action !== 'sync-all') {
      return NextResponse.json({ ok: false, message: 'Unsupported action.' }, { status: 400 })
    }

    const content = getResearchPublicationsSnapshot(body.content)
    const result = await upsertContent(content)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content })
  } catch (error) {
    console.error('[research-publications] POST failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to sync research publications content.',
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

    const { error } = await client.from(RESEARCH_PUBLICATIONS_TABLE).delete().eq('section_key', RESEARCH_PUBLICATIONS_KEY)
    if (error) {
      console.error('[research-publications] Failed deleting content:', error.message)
      return NextResponse.json({ ok: false, message: error.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'backup', content: STATIC_RESEARCH_PUBLICATIONS_CONTENT })
  } catch (error) {
    console.error('[research-publications] DELETE failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to delete research publications content.',
      },
      { status: 500 },
    )
  }
}
