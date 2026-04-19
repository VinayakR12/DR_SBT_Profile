import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseReadClient, createSupabaseWriteClient, getSupabaseStatus } from '@/lib/supabase'
import {
  ACHIEVEMENTS_CERTIFICATES_KEY,
  ACHIEVEMENTS_CERTIFICATES_TABLE,
  CERTIFICATES_SECTION_KEYS,
  STATIC_CERTIFICATES_CONTENT,
  getCertificatesSnapshot,
  normalizeCertificatesContent,
  type CertificatesContentRaw,
  type CertificatesSectionKey,
} from '@/lib/certificatesContent'

type SaveBody = {
  sectionKey?: CertificatesSectionKey
  content?: Partial<CertificatesContentRaw>
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

const isSectionKey = (value: string): value is CertificatesSectionKey =>
  CERTIFICATES_SECTION_KEYS.includes(value as CertificatesSectionKey)

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

const readRemote = async (): Promise<Partial<CertificatesContentRaw>> => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[achievements-certificates] Supabase client is not configured. Falling back to static content.')
    return {}
  }

  const { data, error } = await client
    .from(ACHIEVEMENTS_CERTIFICATES_TABLE)
    .select('content, updated_at')
    .eq('section_key', ACHIEVEMENTS_CERTIFICATES_KEY)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('[achievements-certificates] Failed reading content from Supabase:', error.message)
    }
    return {}
  }

  return parseContent((data as { content?: unknown }).content) || {}
}

const upsertContent = async (content: CertificatesContentRaw) => {
  const client = createSupabaseWriteClient()
  if (!client) {
    return { ok: false as const, message: 'Supabase service role key is required for writes.' }
  }

  const { error } = await client.from(ACHIEVEMENTS_CERTIFICATES_TABLE).upsert(
    {
      section_key: ACHIEVEMENTS_CERTIFICATES_KEY,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' },
  )

  if (error) {
    console.error('[achievements-certificates] Failed to save content:', error.message)
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
      content: normalizeCertificatesContent(remote),
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    console.error('[achievements-certificates] GET failed, using static fallback:', error)
    return NextResponse.json({
      ok: true,
      source: 'backup',
      content: STATIC_CERTIFICATES_CONTENT,
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

    const current = normalizeCertificatesContent(await readRemote())
    const next = normalizeCertificatesContent({
      ...current,
      [body.sectionKey]: sectionValue,
    })

    const result = await upsertContent(next)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next })
  } catch (error) {
    console.error('[achievements-certificates] PUT failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to save certificates content.',
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: string; content?: Partial<CertificatesContentRaw> }
    if (body.action !== 'sync-all') {
      return NextResponse.json({ ok: false, message: 'Unsupported action.' }, { status: 400 })
    }

    const content = getCertificatesSnapshot(body.content)
    const result = await upsertContent(content)
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'supabase', content })
  } catch (error) {
    console.error('[achievements-certificates] POST failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to sync certificates content.',
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

    const { error } = await client.from(ACHIEVEMENTS_CERTIFICATES_TABLE).delete().eq('section_key', ACHIEVEMENTS_CERTIFICATES_KEY)
    if (error) {
      console.error('[achievements-certificates] Failed deleting content:', error.message)
      return NextResponse.json({ ok: false, message: mapSupabaseErrorMessage(error.message) }, { status: 503 })
    }

    return NextResponse.json({ ok: true, source: 'backup', content: STATIC_CERTIFICATES_CONTENT })
  } catch (error) {
    console.error('[achievements-certificates] DELETE failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to delete certificates content.',
      },
      { status: 500 },
    )
  }
}