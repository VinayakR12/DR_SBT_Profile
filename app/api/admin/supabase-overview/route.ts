import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyAdminSession } from '@/lib/adminAuth'
import {
  ABOUT_CONTENT_KEY,
} from '@/lib/aboutContent'
import { ACHIEVEMENTS_AWARDS_KEY } from '@/lib/awardsContent'
import { ACHIEVEMENTS_CERTIFICATES_KEY } from '@/lib/certificatesContent'
import { HOME_SECTION_KEYS } from '@/lib/homeContent'
import { PROJECTS_KEY } from '@/lib/projectsContent'
import { RESEARCH_PATENTS_KEY } from '@/lib/researchPatentsContent'
import { RESEARCH_PUBLICATIONS_KEY } from '@/lib/researchPublicationsContent'
import {
  ACHIEVEMENTS_AWARDS_ASSETS_BUCKET,
  ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET,
  HOME_CONTENT_TABLE,
  HOME_PROFILE_IMAGES_BUCKET,
  PROJECTS_ASSETS_BUCKET,
  RESEARCH_PATENTS_ASSETS_BUCKET,
  TEACHING_ASSETS_BUCKET,
  createSupabaseReadClient,
  createSupabaseWriteClient,
  getSupabaseStatus,
} from '@/lib/supabase'
import { TEACHING_KEY } from '@/lib/teachingContent'

export const runtime = 'nodejs'

const ADMIN_COOKIE = 'admin_session'
const MAX_BUCKET_SCAN_PAGES = 3
const STORAGE_PAGE_SIZE = 1000
const MAX_BUCKET_SCAN_PREFIXES = 40
const STALE_DAYS_WARNING = 14
const FREE_PLAN_DEFAULTS = {
  dbQuotaMb: 500,
  storageQuotaMb: 1024,
  bandwidthQuotaGb: 5,
}

const REQUIRED_SECTION_KEYS = Array.from(
  new Set([
    ...HOME_SECTION_KEYS,
    ABOUT_CONTENT_KEY,
    RESEARCH_PUBLICATIONS_KEY,
    RESEARCH_PATENTS_KEY,
    ACHIEVEMENTS_AWARDS_KEY,
    ACHIEVEMENTS_CERTIFICATES_KEY,
    PROJECTS_KEY,
    TEACHING_KEY,
  ]),
)

const TRACKED_BUCKETS = [
  HOME_PROFILE_IMAGES_BUCKET,
  RESEARCH_PATENTS_ASSETS_BUCKET,
  ACHIEVEMENTS_AWARDS_ASSETS_BUCKET,
  ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET,
  PROJECTS_ASSETS_BUCKET,
  TEACHING_ASSETS_BUCKET,
]

type SectionRow = {
  section_key: string
  content: unknown
  updated_at?: string | null
}

type StorageItem = {
  id?: string | null
  name: string
  metadata?: {
    size?: number
  } | null
}

const bytesToMb = (bytes: number): number => Number((bytes / (1024 * 1024)).toFixed(2))
const bytesToGb = (bytes: number): number => Number((bytes / (1024 * 1024 * 1024)).toFixed(3))

const parseNumber = (value: string | undefined): number | null => {
  if (!value) {
    return null
  }

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

const parseUnknownNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

const getProjectRefFromUrl = (): string | null => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!rawUrl) {
    return null
  }

  try {
    const url = new URL(rawUrl)
    const hostParts = url.hostname.split('.')
    return hostParts[0] || null
  } catch {
    return null
  }
}

const findNumberByKeyPattern = (
  value: unknown,
  keyPattern: RegExp,
  visited = new Set<unknown>(),
): number | null => {
  if (visited.has(value)) {
    return null
  }

  if (Array.isArray(value)) {
    visited.add(value)
    for (const entry of value) {
      const found = findNumberByKeyPattern(entry, keyPattern, visited)
      if (found !== null) {
        return found
      }
    }
    return null
  }

  const record = asRecord(value)
  if (!record) {
    return null
  }

  visited.add(value)
  for (const [key, entry] of Object.entries(record)) {
    if (keyPattern.test(key)) {
      const direct = parseUnknownNumber(entry)
      if (direct !== null) {
        return direct
      }
    }

    const nested = findNumberByKeyPattern(entry, keyPattern, visited)
    if (nested !== null) {
      return nested
    }
  }

  return null
}

type ManagementSnapshot = {
  available: boolean
  reason: string | null
  planName: string | null
  region: string | null
  dbQuotaMb: number | null
  storageQuotaMb: number | null
  bandwidthQuotaGb: number | null
  dbUsedMb: number | null
  storageUsedMb: number | null
  bandwidthUsedGb: number | null
}

const getSupabaseManagementSnapshot = async (): Promise<ManagementSnapshot> => {
  const token = process.env.SUPABASE_MANAGEMENT_API_TOKEN?.trim() || process.env.SUPABASE_ACCESS_TOKEN?.trim() || ''
  if (!token) {
    return {
      available: false,
      reason: 'Set SUPABASE_MANAGEMENT_API_TOKEN to fetch live plan metadata from Supabase Management API.',
      planName: null,
      region: null,
      dbQuotaMb: null,
      storageQuotaMb: null,
      bandwidthQuotaGb: null,
      dbUsedMb: null,
      storageUsedMb: null,
      bandwidthUsedGb: null,
    }
  }

  const projectRef = getProjectRefFromUrl()
  if (!projectRef) {
    return {
      available: false,
      reason: 'Unable to derive project ref from NEXT_PUBLIC_SUPABASE_URL.',
      planName: null,
      region: null,
      dbQuotaMb: null,
      storageQuotaMb: null,
      bandwidthQuotaGb: null,
      dbUsedMb: null,
      storageUsedMb: null,
      bandwidthUsedGb: null,
    }
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  let projectPayload: unknown = null
  let usagePayload: unknown = null

  try {
    const projectResponse = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
      headers,
      cache: 'no-store',
    })

    if (!projectResponse.ok) {
      return {
        available: false,
        reason: `Supabase Management API project lookup failed (${projectResponse.status}).`,
        planName: null,
        region: null,
        dbQuotaMb: null,
        storageQuotaMb: null,
        bandwidthQuotaGb: null,
        dbUsedMb: null,
        storageUsedMb: null,
        bandwidthUsedGb: null,
      }
    }

    projectPayload = await projectResponse.json()
  } catch {
    return {
      available: false,
      reason: 'Unable to reach Supabase Management API for project metadata.',
      planName: null,
      region: null,
      dbQuotaMb: null,
      storageQuotaMb: null,
      bandwidthQuotaGb: null,
      dbUsedMb: null,
      storageUsedMb: null,
      bandwidthUsedGb: null,
    }
  }

  try {
    const usageResponse = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/usage`, {
      headers,
      cache: 'no-store',
    })

    if (usageResponse.ok) {
      usagePayload = await usageResponse.json()
    }
  } catch {
    // Ignore usage fetch failure and continue with project metadata.
  }

  const project = asRecord(projectPayload)

  const planName =
    (typeof project?.subscription_tier === 'string' && project.subscription_tier) ||
    (typeof project?.plan === 'string' && project.plan) ||
    (typeof project?.compute_size === 'string' && project.compute_size) ||
    null

  const region =
    (typeof project?.region === 'string' && project.region) ||
    (typeof project?.location === 'string' && project.location) ||
    null

  const dbQuotaBytes =
    findNumberByKeyPattern(usagePayload, /db.*(quota|max|limit).*bytes|database.*(quota|max|limit).*bytes/i)
  const dbUsedBytes =
    findNumberByKeyPattern(usagePayload, /db.*(used|size).*bytes|database.*(used|size).*bytes/i)
  const storageQuotaBytes =
    findNumberByKeyPattern(usagePayload, /storage.*(quota|max|limit).*bytes/i)
  const storageUsedBytes =
    findNumberByKeyPattern(usagePayload, /storage.*(used|size).*bytes/i)
  const bandwidthQuotaBytes =
    findNumberByKeyPattern(usagePayload, /(egress|bandwidth).*(quota|max|limit).*bytes/i)
  const bandwidthUsedBytes =
    findNumberByKeyPattern(usagePayload, /(egress|bandwidth).*(used|size).*bytes/i)

  return {
    available: true,
    reason: null,
    planName,
    region,
    dbQuotaMb: dbQuotaBytes !== null ? bytesToMb(dbQuotaBytes) : null,
    storageQuotaMb: storageQuotaBytes !== null ? bytesToMb(storageQuotaBytes) : null,
    bandwidthQuotaGb: bandwidthQuotaBytes !== null ? bytesToGb(bandwidthQuotaBytes) : null,
    dbUsedMb: dbUsedBytes !== null ? bytesToMb(dbUsedBytes) : null,
    storageUsedMb: storageUsedBytes !== null ? bytesToMb(storageUsedBytes) : null,
    bandwidthUsedGb: bandwidthUsedBytes !== null ? bytesToGb(bandwidthUsedBytes) : null,
  }
}

const getPlanDetails = () => {
  const dbQuotaMb = parseNumber(process.env.SUPABASE_DB_QUOTA_MB)
  const storageQuotaMb = parseNumber(process.env.SUPABASE_STORAGE_QUOTA_MB)
  const bandwidthQuotaGb = parseNumber(process.env.SUPABASE_BANDWIDTH_QUOTA_GB)
  const planName = process.env.SUPABASE_PLAN_NAME?.trim()
  const region = process.env.SUPABASE_PROJECT_REGION?.trim()
  const assumeFreePlan = process.env.SUPABASE_ASSUME_FREE_PLAN?.trim().toLowerCase() !== 'false'
  const planNameLower = (planName || '').toLowerCase()
  const isFreePlan = planNameLower.includes('free') || (!planName && assumeFreePlan)

  const effectiveDbQuotaMb = dbQuotaMb ?? (isFreePlan ? FREE_PLAN_DEFAULTS.dbQuotaMb : null)
  const effectiveStorageQuotaMb = storageQuotaMb ?? (isFreePlan ? FREE_PLAN_DEFAULTS.storageQuotaMb : null)
  const effectiveBandwidthQuotaGb = bandwidthQuotaGb ?? (isFreePlan ? FREE_PLAN_DEFAULTS.bandwidthQuotaGb : null)

  const quotaSource: 'configured' | 'free-default' | 'unknown' =
    dbQuotaMb !== null || storageQuotaMb !== null || bandwidthQuotaGb !== null
      ? 'configured'
      : isFreePlan
        ? 'free-default'
        : 'unknown'

  return {
    name: planName || (isFreePlan ? 'Free plan (assumed defaults)' : 'Supabase (plan metadata not configured)'),
    dbQuotaMb: effectiveDbQuotaMb,
    storageQuotaMb: effectiveStorageQuotaMb,
    bandwidthQuotaGb: effectiveBandwidthQuotaGb,
    region: region || 'Unknown region',
    quotaSource,
    configured: {
      planName: Boolean(planName),
      region: Boolean(region),
      dbQuota: dbQuotaMb !== null,
      storageQuota: storageQuotaMb !== null,
      bandwidthQuota: bandwidthQuotaGb !== null,
    },
  }
}

const getUsagePercent = (used: number, quota: number | null): number | null => {
  if (!quota || quota <= 0) {
    return null
  }

  return Number(((used / quota) * 100).toFixed(1))
}

const listBucketUsage = async (bucketName: string) => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    return {
      name: bucketName,
      reachable: false,
      files: 0,
      sizeBytes: 0,
      truncated: false,
      scannedPrefixes: 0,
      error: 'Supabase client is not configured.',
    }
  }

  let files = 0
  let sizeBytes = 0
  let truncated = false
  let scannedPrefixes = 0
  const prefixQueue: string[] = ['']
  const seenPrefixes = new Set<string>()

  while (prefixQueue.length > 0) {
    const currentPrefix = prefixQueue.shift() || ''
    if (seenPrefixes.has(currentPrefix)) {
      continue
    }

    seenPrefixes.add(currentPrefix)
    scannedPrefixes += 1

    for (let page = 0; page < MAX_BUCKET_SCAN_PAGES; page += 1) {
      const { data, error } = await client.storage.from(bucketName).list(currentPrefix, {
        limit: STORAGE_PAGE_SIZE,
        offset: page * STORAGE_PAGE_SIZE,
        sortBy: { column: 'name', order: 'asc' },
      })

      if (error) {
        return {
          name: bucketName,
          reachable: false,
          files: 0,
          sizeBytes: 0,
          truncated: false,
          scannedPrefixes,
          error: error.message,
        }
      }

      const items = (data || []) as StorageItem[]
      for (const item of items) {
        const size = item.metadata?.size
        if (typeof size === 'number' && Number.isFinite(size) && size >= 0) {
          files += 1
          sizeBytes += size
          continue
        }

        const nextPrefix = currentPrefix ? `${currentPrefix}/${item.name}` : item.name
        if (nextPrefix && !seenPrefixes.has(nextPrefix) && scannedPrefixes + prefixQueue.length < MAX_BUCKET_SCAN_PREFIXES) {
          prefixQueue.push(nextPrefix)
        }
      }

      if (items.length < STORAGE_PAGE_SIZE) {
        break
      }

      if (page === MAX_BUCKET_SCAN_PAGES - 1) {
        truncated = true
      }
    }

    if (scannedPrefixes >= MAX_BUCKET_SCAN_PREFIXES) {
      truncated = true
      break
    }
  }

  return {
    name: bucketName,
    reachable: true,
    files,
    sizeBytes,
    truncated,
    scannedPrefixes,
    error: '',
  }
}

export async function GET() {
  const startedAt = Date.now()

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
  }

  const session = await verifyAdminSession(token)
  if (!session) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
  }

  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    return NextResponse.json({ ok: false, message: 'Supabase client is not configured.', supabase: getSupabaseStatus() }, { status: 503 })
  }

  const { data, error } = await client
    .from(HOME_CONTENT_TABLE)
    .select('section_key, content, updated_at')
    .order('section_key', { ascending: true })

  if (error) {
    return NextResponse.json({ ok: false, message: error.message, supabase: getSupabaseStatus() }, { status: 503 })
  }

  const rows = (Array.isArray(data) ? data : []) as SectionRow[]
  const sectionKeys = new Set(rows.map((row) => row.section_key))
  const missingSectionKeys = REQUIRED_SECTION_KEYS.filter((key) => !sectionKeys.has(key))

  const nowMs = Date.now()
  const staleThresholdMs = STALE_DAYS_WARNING * 24 * 60 * 60 * 1000

  const staleSections = rows
    .filter((row) => row.updated_at)
    .map((row) => ({
      key: row.section_key,
      updatedAt: row.updated_at as string,
      ageDays: Math.floor((nowMs - new Date(row.updated_at as string).getTime()) / (24 * 60 * 60 * 1000)),
    }))
    .filter((entry) => Number.isFinite(entry.ageDays) && entry.ageDays >= STALE_DAYS_WARNING)
    .sort((a, b) => b.ageDays - a.ageDays)

  const contentSizeBytes = rows.reduce((total, row) => {
    try {
      return total + Buffer.byteLength(JSON.stringify(row.content || {}), 'utf8')
    } catch {
      return total
    }
  }, 0)

  const bucketUsage = await Promise.all(TRACKED_BUCKETS.map((bucketName) => listBucketUsage(bucketName)))
  const storageFiles = bucketUsage.reduce((total, bucket) => total + bucket.files, 0)
  const storageBytes = bucketUsage.reduce((total, bucket) => total + bucket.sizeBytes, 0)
  const unreachableBuckets = bucketUsage.filter((bucket) => !bucket.reachable)

  const expectedRows = REQUIRED_SECTION_KEYS.length
  const coveragePercent = expectedRows > 0 ? Number(((rows.length / expectedRows) * 100).toFixed(1)) : 0

  const envPlan = getPlanDetails()
  const management = await getSupabaseManagementSnapshot()

  const plan = {
    ...envPlan,
    name: management.planName || envPlan.name,
    region: management.region || envPlan.region,
    dbQuotaMb: management.dbQuotaMb ?? envPlan.dbQuotaMb,
    storageQuotaMb: management.storageQuotaMb ?? envPlan.storageQuotaMb,
    bandwidthQuotaGb: management.bandwidthQuotaGb ?? envPlan.bandwidthQuotaGb,
    quotaSource: management.available ? ('management-api' as const) : envPlan.quotaSource,
  }

  const dbUsedMb = management.dbUsedMb ?? bytesToMb(contentSizeBytes)
  const storageUsedMb = management.storageUsedMb ?? bytesToMb(storageBytes)
  const storageUsedGb = Number((storageUsedMb / 1024).toFixed(3))
  const bandwidthUsedGb = management.bandwidthUsedGb
  const latencyMs = Date.now() - startedAt
  const dbRemainingMb = plan.dbQuotaMb ? Number(Math.max(plan.dbQuotaMb - dbUsedMb, 0).toFixed(2)) : null
  const storageRemainingMb = plan.storageQuotaMb ? Number(Math.max(plan.storageQuotaMb - storageUsedMb, 0).toFixed(2)) : null
  const bandwidthRemainingGb =
    plan.bandwidthQuotaGb !== null
      ? Number(Math.max(plan.bandwidthQuotaGb - (bandwidthUsedGb || 0), 0).toFixed(3))
      : null

  const rules = [
    {
      id: 'credentials',
      title: 'Supabase credentials configured',
      status:
        getSupabaseStatus().url && getSupabaseStatus().publicKey && getSupabaseStatus().serviceKey
          ? 'pass'
          : 'fail',
      detail: 'URL, publishable key, and service role key should all be configured for production.',
    },
    {
      id: 'section-coverage',
      title: 'Required content keys present',
      status: missingSectionKeys.length === 0 ? 'pass' : 'warn',
      detail:
        missingSectionKeys.length === 0
          ? 'All required section keys are present in the content table.'
          : `${missingSectionKeys.length} key(s) missing: ${missingSectionKeys.join(', ')}`,
    },
    {
      id: 'content-freshness',
      title: 'Content freshness',
      status: staleSections.length === 0 ? 'pass' : 'warn',
      detail:
        staleSections.length === 0
          ? `No content key is older than ${STALE_DAYS_WARNING} days.`
          : `${staleSections.length} key(s) have not been updated in ${STALE_DAYS_WARNING}+ days.`,
    },
    {
      id: 'storage-availability',
      title: 'Storage buckets accessible',
      status: unreachableBuckets.length === 0 ? 'pass' : 'warn',
      detail:
        unreachableBuckets.length === 0
          ? 'All tracked storage buckets are reachable.'
          : `${unreachableBuckets.length} bucket(s) are unreachable: ${unreachableBuckets.map((item) => item.name).join(', ')}`,
    },
  ]

  return NextResponse.json(
    {
      ok: true,
      generatedAt: new Date().toISOString(),
      request: {
        latencyMs,
        checkedAt: new Date().toISOString(),
      },
      summary: {
        rowsPresent: rows.length,
        rowsExpected: expectedRows,
        coveragePercent,
        missingCount: missingSectionKeys.length,
        staleCount: staleSections.length,
        dbUsedMb,
        storageFiles,
        storageUsedMb,
      },
      plan: {
        ...plan,
        usage: {
          db: {
            usedMb: dbUsedMb,
            quotaMb: plan.dbQuotaMb,
            percent: getUsagePercent(dbUsedMb, plan.dbQuotaMb),
            remainingMb: dbRemainingMb,
          },
          storage: {
            usedMb: storageUsedMb,
            usedGb: storageUsedGb,
            quotaMb: plan.storageQuotaMb,
            percent: getUsagePercent(storageUsedMb, plan.storageQuotaMb),
            remainingMb: storageRemainingMb,
          },
          bandwidth: {
            usedGb: bandwidthUsedGb,
            quotaGb: plan.bandwidthQuotaGb,
            percent:
              bandwidthUsedGb !== null && plan.bandwidthQuotaGb !== null
                ? getUsagePercent(bandwidthUsedGb, plan.bandwidthQuotaGb)
                : null,
            remainingGb: bandwidthRemainingGb,
            note:
              management.bandwidthUsedGb === null
                ? 'Bandwidth usage is not exposed by the current API response; configure SUPABASE_BANDWIDTH_QUOTA_GB for quota tracking.'
                : 'Bandwidth usage fetched from Supabase Management API.',
          },
        },
      },
      diagnostics: {
        notes: [
          management.available ? null : management.reason,
          plan.quotaSource === 'free-default'
            ? 'Using assumed Supabase free-plan quotas (500 MB DB, 1 GB Storage, 5 GB bandwidth). Set SUPABASE_PLAN_NAME and SUPABASE_*_QUOTA env vars for exact values.'
            : null,
          plan.configured.planName ? null : 'Set SUPABASE_PLAN_NAME to display your exact plan tier label.',
          plan.configured.region ? null : 'Set SUPABASE_PROJECT_REGION to show region in overview.',
          plan.configured.dbQuota ? null : 'Set SUPABASE_DB_QUOTA_MB to track DB utilization against quota.',
          plan.configured.storageQuota ? null : 'Set SUPABASE_STORAGE_QUOTA_MB to track storage utilization against quota.',
          plan.configured.bandwidthQuota ? null : 'Set SUPABASE_BANDWIDTH_QUOTA_GB to track bandwidth utilization against quota.',
        ].filter(Boolean),
      },
      sections: {
        missing: missingSectionKeys,
        stale: staleSections,
        recent: rows
          .filter((row) => row.updated_at)
          .map((row) => ({ key: row.section_key, updatedAt: row.updated_at }))
          .sort((a, b) => new Date(`${b.updatedAt}`).getTime() - new Date(`${a.updatedAt}`).getTime())
          .slice(0, 12),
      },
      storage: bucketUsage.map((bucket) => ({
        ...bucket,
        sizeMb: bytesToMb(bucket.sizeBytes),
      })),
      rules,
      supabase: getSupabaseStatus(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}
