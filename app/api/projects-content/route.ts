import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseReadClient, createSupabaseWriteClient, getSupabaseStatus } from '@/lib/supabase'
import {
  PROJECTS_KEY,
  PROJECTS_TABLE,
  PROJECTS_SECTION_KEYS,
  STATIC_PROJECTS_CONTENT,
  getProjectsSnapshot,
  normalizeProjectsContent,
  type ProjectsContentRaw,
  type ProjectsSectionKey,
} from '@/lib/projectsContent'

type SaveBody = {
  sectionKey?: ProjectsSectionKey
  content?: Partial<ProjectsContentRaw>
}

const isSectionKey = (value: string): value is ProjectsSectionKey =>
  PROJECTS_SECTION_KEYS.includes(value as ProjectsSectionKey)

const parseContent = (value: unknown): Partial<ProjectsContentRaw> | null => {
  if (value && typeof value === 'object') {
    return value as Partial<ProjectsContentRaw>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Partial<ProjectsContentRaw>
      }
    } catch {
      return null
    }
  }

  return null
}

const readRemote = async (): Promise<{ found: boolean; data: Partial<ProjectsContentRaw> }> => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[projects] Supabase client is not configured. Falling back to static content.')
    return { found: false, data: {} }
  }

  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .select('content, updated_at')
    .eq('section_key', PROJECTS_KEY)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('[projects] Failed reading content from Supabase:', error.message)
    }
    return { found: false, data: {} }
  }

  const parsed = parseContent((data as { content?: unknown }).content) || {}
  return { found: true, data: parsed }
}

const upsertContent = async (content: ProjectsContentRaw) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const { error } = await client.from(PROJECTS_TABLE).upsert(
    {
      section_key: PROJECTS_KEY,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' },
  )

  if (error) {
    console.error('[projects] Failed to save content:', error.message)
    return { ok: false as const, message: error.message }
  }

  return { ok: true as const }
}

export async function GET() {
  try {
    const remote = await readRemote()
    const content = remote.found
      ? normalizeProjectsContent(remote.data)
      : STATIC_PROJECTS_CONTENT

    return NextResponse.json({
      ok: true,
      source: remote.found ? 'supabase' : 'backup',
      content,
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    console.error('[projects] GET failed, using static fallback:', error)
    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_PROJECTS_CONTENT,
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

    const remote = await readRemote()
    let current = normalizeProjectsContent(STATIC_PROJECTS_CONTENT)
    if (remote.found) {
      current = normalizeProjectsContent(remote.data)
    }

    const next = normalizeProjectsContent({
      ...current,
      [body.sectionKey]: sectionValue,
    })

    const result = await upsertContent(next)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next })
  } catch (error) {
    console.error('[projects] PUT failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to save projects content.',
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: string; content?: Partial<ProjectsContentRaw> }
    if (body.action !== 'sync-all') {
      return NextResponse.json({ ok: false, message: 'Unsupported action.' }, { status: 400 })
    }

    const content = getProjectsSnapshot(body.content)
    const result = await upsertContent(content)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content })
  } catch (error) {
    console.error('[projects] POST failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to sync projects content.',
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

    const { error } = await client.from(PROJECTS_TABLE).delete().eq('section_key', PROJECTS_KEY)
    if (error) {
      console.error('[projects] Failed deleting content:', error.message)
      return NextResponse.json({ ok: false, message: error.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'backup', content: STATIC_PROJECTS_CONTENT })
  } catch (error) {
    console.error('[projects] DELETE failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to delete projects content.',
      },
      { status: 500 },
    )
  }
}
