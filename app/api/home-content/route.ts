import { NextRequest, NextResponse } from 'next/server'

import { HOME_CONTENT_TABLE, createSupabaseReadClient, createSupabaseWriteClient, getSupabaseStatus } from '@/lib/supabase'
import {
  HOME_SECTION_KEYS,
  STATIC_HOME_CONTENT,
  getHomeContentSnapshot,
  normalizeHomeContent,
  type HomeContentRaw,
  type HomeSectionKey,
} from '@/lib/homeContent'

type SectionRow = {
  section_key: string
  content: unknown
  updated_at?: string | null
}

type SaveSectionBody = {
  sectionKey?: HomeSectionKey
  content?: Partial<HomeContentRaw>
}

type SyncAllBody = {
  content?: Partial<HomeContentRaw>
}

const mapSupabaseErrorMessage = (message: string): string => {
  const lower = message.toLowerCase()

  if (lower.includes('section_key') && lower.includes('schema cache')) {
    return 'Supabase table schema is outdated. Run supabase/home_content.sql to add section_key/content columns and refresh schema cache.'
  }

  if (lower.includes('on conflict') && lower.includes('section_key')) {
    return 'Supabase table is missing a unique constraint on section_key. Run supabase/home_content.sql to create it.'
  }

  return message
}

const isSectionKey = (value: string): value is HomeSectionKey => HOME_SECTION_KEYS.includes(value as HomeSectionKey)

const parseSectionContent = (value: unknown): Record<string, unknown> | null => {
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
      return null
    }
  }

  return null
}

const readSectionMap = async (): Promise<Partial<HomeContentRaw>> => {
  // Prefer service-role for server reads so DB remains the primary source even if public RLS policies are strict.
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[home-content] Supabase read client is not configured. Falling back to static content.')
    return {}
  }

  const { data, error } = await client.from(HOME_CONTENT_TABLE).select('section_key, content, updated_at')
  if (error || !Array.isArray(data)) {
    if (error) {
      console.error('[home-content] Failed reading sections from Supabase:', error.message)
    }
    return {}
  }

  const sections: Partial<HomeContentRaw> = {}

  for (const row of data as SectionRow[]) {
    const parsedContent = parseSectionContent(row.content)
    if (!isSectionKey(row.section_key) || !parsedContent) {
      continue
    }

    sections[row.section_key] = parsedContent as never
  }

  return sections
}

const readMergedContent = async () => {
  const sections = await readSectionMap()
  return {
    content: normalizeHomeContent(sections),
    sections,
  }
}

const saveSection = async (sectionKey: HomeSectionKey, content: unknown) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    console.error('[home-content] Write client missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local.')
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const { error } = await client
    .from(HOME_CONTENT_TABLE)
    .upsert({ section_key: sectionKey, content, updated_at: new Date().toISOString() }, { onConflict: 'section_key' })

  if (error) {
    console.error(`[home-content] Failed to save section ${sectionKey}:`, error.message)
    return { ok: false as const, message: mapSupabaseErrorMessage(error.message) }
  }

  return { ok: true as const }
}

const upsertAllSections = async (content: HomeContentRaw) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    console.error('[home-content] Write client missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local.')
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const rows = HOME_SECTION_KEYS.map((sectionKey) => ({
    section_key: sectionKey,
    content: content[sectionKey],
    updated_at: new Date().toISOString(),
  }))

  const { error } = await client.from(HOME_CONTENT_TABLE).upsert(rows, { onConflict: 'section_key' })
  if (error) {
    console.error('[home-content] Failed to sync all sections:', error.message)
    return { ok: false as const, message: mapSupabaseErrorMessage(error.message) }
  }

  return { ok: true as const }
}

export async function GET() {
  try {
    const { content, sections } = await readMergedContent()
    const hasRemoteContent = Object.keys(sections).length > 0

    return NextResponse.json({
      ok: true,
      source: hasRemoteContent ? 'supabase' : 'backup',
      content,
      sections,
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    console.error('[home-content] GET failed, using static fallback:', error)
    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_HOME_CONTENT,
      sections: {},
      supabase: getSupabaseStatus(),
      message: error instanceof Error ? error.message : 'Using backup content.',
    })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveSectionBody
    const sectionKey = body.sectionKey

    if (!sectionKey) {
      return NextResponse.json({ ok: false, message: 'sectionKey is required.' }, { status: 400 })
    }

    if (!isSectionKey(sectionKey)) {
      return NextResponse.json({ ok: false, message: 'Invalid section key.' }, { status: 400 })
    }

    const content = body.content?.[sectionKey]
    if (content === undefined) {
      return NextResponse.json({ ok: false, message: 'Section content is required.' }, { status: 400 })
    }

    const saveResult = await saveSection(sectionKey, content)
    if (!saveResult.ok) {
      return NextResponse.json({ ok: false, message: saveResult.message }, { status: 503 })
    }

    const fresh = await readMergedContent()
    return NextResponse.json({ ok: true, source: 'supabase', content: fresh.content, sections: fresh.sections })
  } catch (error) {
    console.error('[home-content] PUT failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to save section.',
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: string } & SyncAllBody
    if (body.action !== 'sync-all') {
      return NextResponse.json({ ok: false, message: 'Unsupported action.' }, { status: 400 })
    }

    const content = getHomeContentSnapshot(body.content)
    const result = await upsertAllSections(content)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    const fresh = await readMergedContent()
    return NextResponse.json({ ok: true, source: 'supabase', content: fresh.content, sections: fresh.sections })
  } catch (error) {
    console.error('[home-content] POST failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to sync content.',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json()) as { sectionKey?: HomeSectionKey }
    if (!body.sectionKey || !isSectionKey(body.sectionKey)) {
      return NextResponse.json({ ok: false, message: 'Valid sectionKey is required.' }, { status: 400 })
    }

    const client = createSupabaseWriteClient()
    if (!client) {
      console.error('[home-content] Write client missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local.')
      return NextResponse.json({ ok: false, message: 'Supabase service role key is required for writes.' }, { status: 503 })
    }

    const { error } = await client.from(HOME_CONTENT_TABLE).delete().eq('section_key', body.sectionKey)
    if (error) {
      console.error(`[home-content] Failed to delete section ${body.sectionKey}:`, error.message)
      return NextResponse.json({ ok: false, message: mapSupabaseErrorMessage(error.message) }, { status: 503 })
    }

    const fresh = await readMergedContent()
    return NextResponse.json({ ok: true, source: 'backup', content: fresh.content, sections: fresh.sections })
  } catch (error) {
    console.error('[home-content] DELETE failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to delete section.',
      },
      { status: 500 },
    )
  }
}