import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseReadClient, createSupabaseWriteClient, getSupabaseStatus } from '@/lib/supabase'
import {
  ACHIEVEMENTS_AWARDS_KEY,
  ACHIEVEMENTS_AWARDS_SECTION_KEYS,
  ACHIEVEMENTS_AWARDS_TABLE,
  STATIC_ACHIEVEMENTS_AWARDS_CONTENT,
  getAchievementsAwardsSnapshot,
  normalizeAchievementsAwardsContent,
  type AchievementsAwardsSectionKey,
  type AwardsContentRaw,
} from '@/lib/awardsContent'

type SaveBody = {
  sectionKey?: AchievementsAwardsSectionKey
  content?: Partial<AwardsContentRaw>
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

const isSectionKey = (value: string): value is AchievementsAwardsSectionKey =>
  ACHIEVEMENTS_AWARDS_SECTION_KEYS.includes(value as AchievementsAwardsSectionKey)

const parseContent = (value: unknown): Partial<AwardsContentRaw> | null => {
  if (value && typeof value === 'object') {
    return value as Partial<AwardsContentRaw>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      if (parsed && typeof parsed === 'object') {
        return parsed as Partial<AwardsContentRaw>
      }
    } catch {
      return null
    }
  }

  return null
}

const readRemote = async (): Promise<Partial<AwardsContentRaw>> => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[achievements-awards] Supabase client is not configured. Falling back to static content.')
    return {}
  }

  const { data, error } = await client
    .from(ACHIEVEMENTS_AWARDS_TABLE)
    .select('content, updated_at')
    .eq('section_key', ACHIEVEMENTS_AWARDS_KEY)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('[achievements-awards] Failed reading content from Supabase:', error.message)
    }
    return {}
  }

  return parseContent((data as { content?: unknown }).content) || {}
}

const upsertContent = async (content: AwardsContentRaw) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const { error } = await client.from(ACHIEVEMENTS_AWARDS_TABLE).upsert(
    {
      section_key: ACHIEVEMENTS_AWARDS_KEY,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' },
  )

  if (error) {
    console.error('[achievements-awards] Failed to save content:', error.message)
    return { ok: false as const, message: mapSupabaseErrorMessage(error.message) }
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
      content: normalizeAchievementsAwardsContent(remote),
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    console.error('[achievements-awards] GET failed, using static fallback:', error)
    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_ACHIEVEMENTS_AWARDS_CONTENT,
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

    const current = normalizeAchievementsAwardsContent(await readRemote())
    const next = normalizeAchievementsAwardsContent({
      ...current,
      [body.sectionKey]: sectionValue,
    })

    const result = await upsertContent(next)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next })
  } catch (error) {
    console.error('[achievements-awards] PUT failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to save awards content.',
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: string; content?: Partial<AwardsContentRaw> }
    if (body.action !== 'sync-all') {
      return NextResponse.json({ ok: false, message: 'Unsupported action.' }, { status: 400 })
    }

    const content = getAchievementsAwardsSnapshot(body.content)
    const result = await upsertContent(content)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content })
  } catch (error) {
    console.error('[achievements-awards] POST failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to sync awards content.',
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

    const { error } = await client.from(ACHIEVEMENTS_AWARDS_TABLE).delete().eq('section_key', ACHIEVEMENTS_AWARDS_KEY)
    if (error) {
      console.error('[achievements-awards] Failed deleting content:', error.message)
      return NextResponse.json({ ok: false, message: error.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'backup', content: STATIC_ACHIEVEMENTS_AWARDS_CONTENT })
  } catch (error) {
    console.error('[achievements-awards] DELETE failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to delete awards content.',
      },
      { status: 500 },
    )
  }
}
