'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import HomeContentEditor from '@/components/admin/HomeContentEditor'
import AboutContentEditor from '@/components/admin/AboutContentEditor'
import ResearchPublicationsEditor from '@/components/admin/ResearchPublicationsEditor'
import ResearchPatentsEditor from '@/components/admin/ResearchPatentsEditor'
import AwardsEditor from '@/components/admin/AwardsEditor'
import CertificatesEditor from '@/components/admin/CertificatesEditor'
import ProjectsEditor from '@/components/admin/ProjectsEditor'
import TeachingEditor from '@/components/admin/TeachingEditor'
import {
  Activity,
  AlertTriangle,
  Bell,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock3,
  ChevronRight,
  Database,
  FileText,
  FlaskConical,
  HardDrive,
  Home,
  LayoutDashboard,
  LogOut,
  Medal,
  MessageSquare,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  User,
} from 'lucide-react'

type SectionId =
  | 'overview'
  | 'home'
  | 'about'
  | 'research-publications'
  | 'research-patents'
  | 'achievements-awards'
  | 'achievements-certificates'
  | 'projects'
  | 'teaching'
  | 'contact'

type MenuItem = {
  id: SectionId
  label: string
  route: string
  icon: React.ComponentType<{ size?: number }>
  category: 'Primary' | 'Research' | 'Achievements' | 'Operations'
  summary: string
}

type RuleStatus = 'pass' | 'warn' | 'fail'

type SupabaseOverview = {
  generatedAt: string
  request: {
    latencyMs: number
    checkedAt: string
  }
  summary: {
    rowsPresent: number
    rowsExpected: number
    coveragePercent: number
    missingCount: number
    staleCount: number
    dbUsedMb: number
    storageFiles: number
    storageUsedMb: number
  }
  plan: {
    name: string
    dbQuotaMb: number | null
    storageQuotaMb: number | null
    bandwidthQuotaGb: number | null
    region: string
    quotaSource: 'configured' | 'free-default' | 'unknown' | 'management-api'
    usage: {
      db: { usedMb: number; quotaMb: number | null; percent: number | null; remainingMb: number | null }
      storage: { usedMb: number; usedGb: number; quotaMb: number | null; percent: number | null; remainingMb: number | null }
      bandwidth: { usedGb: number | null; quotaGb: number | null; percent: number | null; remainingGb: number | null; note: string }
    }
  }
  sections: {
    missing: string[]
    stale: Array<{ key: string; updatedAt: string; ageDays: number }>
    recent: Array<{ key: string; updatedAt: string | null | undefined }>
  }
  storage: Array<{
    name: string
    reachable: boolean
    files: number
    sizeBytes: number
    sizeMb: number
    truncated: boolean
    scannedPrefixes: number
    error: string
  }>
  diagnostics?: {
    notes?: string[]
  }
  rules: Array<{ id: string; title: string; status: RuleStatus; detail: string }>
  supabase: {
    url: boolean
    publicKey: boolean
    serviceKey: boolean
  }
}

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return 'Not available'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Not available'
  }

  return parsed.toLocaleString()
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value)

const formatPercent = (value: number | null) => {
  if (value === null || !Number.isFinite(value)) {
    return 'N/A'
  }
  return `${value}%`
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    route: '/admin',
    icon: LayoutDashboard,
    category: 'Primary',
    summary: 'Executive summary, quick actions and notifications.',
  },
  {
    id: 'home',
    label: 'Home',
    route: '/',
    icon: Home,
    category: 'Primary',
    summary: 'Hero section, highlights and first-impression content.',
  },
  {
    id: 'about',
    label: 'About',
    route: '/about',
    icon: User,
    category: 'Primary',
    summary: 'Profile details, biography and background narrative.',
  },
  {
    id: 'research-publications',
    label: 'Research Publications',
    route: '/research/publications',
    icon: FileText,
    category: 'Research',
    summary: 'Journal papers, conference work and publication history.',
  },
  {
    id: 'research-patents',
    label: 'Research Patents',
    route: '/research/patents',
    icon: Shield,
    category: 'Research',
    summary: 'Patents and intellectual property management panel.',
  },
  {
    id: 'achievements-awards',
    label: 'Awards & Honors',
    route: '/achievements/awards',
    icon: Star,
    category: 'Achievements',
    summary: 'Recognition, awards and milestone achievements.',
  },
  {
    id: 'achievements-certificates',
    label: 'Certificates',
    route: '/achievements/certificates',
    icon: Medal,
    category: 'Achievements',
    summary: 'Certification records and credential documentation.',
  },
  {
    id: 'projects',
    label: 'Projects',
    route: '/projects',
    icon: Trophy,
    category: 'Primary',
    summary: 'Project portfolio and technical implementations.',
  },
  {
    id: 'teaching',
    label: 'Teaching',
    route: '/teaching',
    icon: BookOpen,
    category: 'Primary',
    summary: 'Teaching roles, mentoring and curriculum activities.',
  },
  {
    id: 'contact',
    label: 'Contact',
    route: '/contact',
    icon: MessageSquare,
    category: 'Operations',
    summary: 'Communication settings and inbound query flow.',
  },
]

export default function AdminPage() {
  const router = useRouter()
  const [active, setActive] = useState<SectionId>('overview')
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [overview, setOverview] = useState<SupabaseOverview | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(false)
  const [overviewError, setOverviewError] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const groups = new Map<string, MenuItem[]>()
    for (const item of MENU_ITEMS) {
      const list = groups.get(item.category) || []
      list.push(item)
      groups.set(item.category, list)
    }
    return Array.from(groups.entries())
  }, [])

  const activeItem = useMemo(
    () => MENU_ITEMS.find((item) => item.id === active) || MENU_ITEMS[0],
    [active],
  )

  const fetchOverview = async () => {
    setOverviewLoading(true)
    setOverviewError(null)

    try {
      const response = await fetch('/api/admin/supabase-overview', { cache: 'no-store' })
      const payload = (await response.json()) as { ok?: boolean; message?: string } & Partial<SupabaseOverview>

      if (!response.ok || !payload.ok) {
        setOverviewError(payload.message || 'Unable to load live Supabase overview.')
        return
      }

      setOverview(payload as SupabaseOverview)
    } catch {
      setOverviewError('Unable to reach the Supabase overview endpoint right now.')
    } finally {
      setOverviewLoading(false)
    }
  }

  useEffect(() => {
    if (active !== 'overview') {
      return
    }

    fetchOverview()
    const intervalId = window.setInterval(fetchOverview, 60000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [active])

  const dashboardMetrics = useMemo(
    () => [
      {
        label: 'Section Coverage',
        value: overview ? `${overview.summary.coveragePercent}%` : '--',
        detail: overview
          ? `${overview.summary.rowsPresent}/${overview.summary.rowsExpected} keys present`
          : 'Checking Supabase table coverage',
      },
      {
        label: 'DB Content Size',
        value: overview ? `${overview.summary.dbUsedMb.toFixed(2)} MB` : '--',
        detail: 'Computed from live JSON content rows',
      },
      {
        label: 'Storage Files',
        value: overview ? formatNumber(overview.summary.storageFiles) : '--',
        detail: overview ? `${overview.summary.storageUsedMb.toFixed(2)} MB in tracked buckets` : 'Scanning tracked buckets',
      },
      {
        label: 'API Latency',
        value: overview ? `${overview.request.latencyMs} ms` : '--',
        detail: 'Latest admin overview request duration',
      },
    ],
    [overview],
  )

  const healthChip = useMemo(() => {
    if (overviewError) {
      return { label: 'Overview endpoint issue', healthy: false }
    }

    if (!overview) {
      return { label: 'Loading Supabase status', healthy: true }
    }

    const hasFailureRule = overview.rules.some((rule) => rule.status === 'fail')
    if (hasFailureRule) {
      return { label: 'Action required on Supabase rules', healthy: false }
    }

    const hasWarningRule = overview.rules.some((rule) => rule.status === 'warn')
    if (hasWarningRule) {
      return { label: 'Supabase running with warnings', healthy: true }
    }

    return { label: 'Supabase checks passing', healthy: true }
  }, [overview, overviewError])

  const onLogout = async () => {
    if (logoutLoading) {
      return
    }

    setLogoutLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin-shell-inner">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <p className="admin-brand-kicker">Corporate Control</p>
            <h1>Admin Dashboard</h1>
            <p>Manage content sections with a structured workflow.</p>
          </div>

          <div className="admin-nav-wrap">
            {grouped.map(([label, items]) => (
              <div key={label} className="admin-nav-group">
                <p className="admin-nav-title">{label}</p>
                <div className="admin-nav-list">
                  {items.map((item) => {
                    const Icon = item.icon
                    const activeItemClass = item.id === active
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`admin-nav-item ${activeItemClass ? 'admin-nav-item-active' : ''}`}
                        onClick={() => setActive(item.id)}
                      >
                        <span className="admin-nav-item-icon">
                          <Icon size={14} />
                        </span>
                        <span className="admin-nav-item-text">{item.label}</span>
                        <ChevronRight size={12} className="admin-nav-item-chevron" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="admin-logout" onClick={onLogout}>
            <LogOut size={15} /> {logoutLoading ? 'Signing out...' : 'Logout'}
          </button>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <p className="admin-topbar-kicker">Control Center</p>
              <h2>{activeItem.label}</h2>
              <p>{activeItem.summary}</p>
            </div>
            <div className={`admin-topbar-chip ${healthChip.healthy ? '' : 'admin-topbar-chip-danger'}`}>
              <Bell size={14} /> {healthChip.label}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.section
              key={activeItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="admin-panel"
            >
              {activeItem.id === 'overview' ? (
                <>
                  <div className="admin-grid-metrics">
                    {dashboardMetrics.map((metric) => (
                      <div key={metric.label} className="admin-metric-card">
                        <p className="admin-metric-label">{metric.label}</p>
                        <p className="admin-metric-value">{metric.value}</p>
                        <p className="admin-metric-detail">{metric.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="admin-grid-content">
                    <div className="admin-card">
                      <p className="admin-card-kicker">
                        <Database size={13} /> Supabase Plan & Usage
                      </p>
                      <h3>{overview?.plan.name || 'Loading plan details...'}</h3>
                      <p className="admin-plan-subtitle">Region: {overview?.plan.region || 'Not available'}</p>

                      {overview?.plan.quotaSource === 'free-default' && (
                        <div className="admin-overview-alert admin-overview-alert-spaced admin-overview-alert-success">
                          <CheckCircle2 size={14} /> Free-plan quota defaults are active for usage tracking.
                        </div>
                      )}

                      {overview && (overview.diagnostics?.notes?.length || 0) > 0 && (
                        <div className="admin-overview-alert admin-overview-alert-spaced">
                          <AlertTriangle size={14} /> {overview.diagnostics?.notes?.[0]}
                        </div>
                      )}

                      <div className="admin-usage-stack">
                        <div className="admin-usage-row">
                          <div className="admin-usage-head">
                            <span><HardDrive size={13} /> Database</span>
                            <span>
                              {overview ? `${overview.plan.usage.db.usedMb.toFixed(2)} MB / ${overview.plan.usage.db.quotaMb ?? 'N/A'} MB` : 'Loading...'}
                            </span>
                          </div>
                          <div className="admin-usage-bar">
                            <span style={{ width: `${Math.min(overview?.plan.usage.db.percent || 0, 100)}%` }} />
                          </div>
                          <p className="admin-usage-caption">Utilization: {overview ? formatPercent(overview.plan.usage.db.percent) : 'N/A'}</p>
                          <p className="admin-usage-caption">
                            Remaining: {overview
                              ? overview.plan.usage.db.remainingMb === null
                                ? 'N/A'
                                : `${overview.plan.usage.db.remainingMb.toFixed(2)} MB`
                              : 'N/A'}
                          </p>
                        </div>

                        <div className="admin-usage-row">
                          <div className="admin-usage-head">
                            <span><Activity size={13} /> Storage</span>
                            <span>
                              {overview ? `${overview.plan.usage.storage.usedMb.toFixed(2)} MB / ${overview.plan.usage.storage.quotaMb ?? 'N/A'} MB` : 'Loading...'}
                            </span>
                          </div>
                          <div className="admin-usage-bar">
                            <span style={{ width: `${Math.min(overview?.plan.usage.storage.percent || 0, 100)}%` }} />
                          </div>
                          <p className="admin-usage-caption">Utilization: {overview ? formatPercent(overview.plan.usage.storage.percent) : 'N/A'}</p>
                          <p className="admin-usage-caption">
                            Remaining: {overview
                              ? overview.plan.usage.storage.remainingMb === null
                                ? 'N/A'
                                : `${overview.plan.usage.storage.remainingMb.toFixed(2)} MB`
                              : 'N/A'}
                          </p>
                        </div>

                        <div className="admin-usage-row">
                          <div className="admin-usage-head">
                            <span><Clock3 size={13} /> Request & Refresh</span>
                            <span>{overview ? `${overview.request.latencyMs} ms` : 'Loading...'}</span>
                          </div>
                          <p className="admin-usage-caption">
                            Last sync: {overview ? formatDateTime(overview.generatedAt) : 'Loading'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="admin-card">
                      <p className="admin-card-kicker">
                        <ShieldCheck size={13} /> Production Rules
                      </p>
                      <h3>Security & operations checklist</h3>

                      {overviewError && (
                        <div className="admin-overview-alert admin-overview-alert-error">
                          <AlertTriangle size={14} /> {overviewError}
                        </div>
                      )}

                      <div className="admin-rules-list">
                        {(overview?.rules || []).map((rule) => (
                          <div key={rule.id} className={`admin-rule-item admin-rule-${rule.status}`}>
                            <p className="admin-rule-title">
                              {rule.status === 'pass' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />} {rule.title}
                            </p>
                            <p className="admin-rule-detail">{rule.detail}</p>
                          </div>
                        ))}

                        {!overview && !overviewError && (
                          <div className="admin-overview-alert">
                            <Sparkles size={14} /> Loading live rules from Supabase...
                          </div>
                        )}
                      </div>

                      <div className="admin-overview-actions">
                        <button type="button" className="admin-btn-secondary" onClick={fetchOverview} disabled={overviewLoading}>
                          <RefreshCw size={14} className={overviewLoading ? 'admin-spin' : ''} /> {overviewLoading ? 'Refreshing...' : 'Refresh now'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="admin-grid-content">
                    <div className="admin-card">
                      <p className="admin-card-kicker">
                        <Briefcase size={13} /> Supabase Section Coverage
                      </p>
                      <h3>Missing and stale sections</h3>
                      <p>
                        Missing keys: {overview ? overview.sections.missing.length : '--'} | Stale keys: {overview ? overview.sections.stale.length : '--'}
                      </p>

                      {overview && overview.sections.missing.length > 0 && (
                        <div className="admin-token-list">
                          {overview.sections.missing.map((key) => (
                            <span key={key} className="admin-token admin-token-danger">{key}</span>
                          ))}
                        </div>
                      )}

                      {overview && overview.sections.stale.length > 0 && (
                        <div className="admin-stale-list">
                          {overview.sections.stale.slice(0, 8).map((entry) => (
                            <p key={`${entry.key}-${entry.updatedAt}`}>
                              <strong>{entry.key}</strong> - {entry.ageDays} days old (updated {formatDateTime(entry.updatedAt)})
                            </p>
                          ))}
                        </div>
                      )}

                      {overview && overview.sections.missing.length === 0 && overview.sections.stale.length === 0 && (
                        <div className="admin-overview-alert admin-overview-alert-success">
                          <CheckCircle2 size={14} /> All tracked sections are present and fresh.
                        </div>
                      )}
                    </div>

                    <div className="admin-card">
                      <p className="admin-card-kicker">
                        <HardDrive size={13} /> Storage Buckets
                      </p>
                      <h3>Bucket health and usage</h3>
                      <div className="admin-storage-list">
                        {(overview?.storage || []).map((bucket) => (
                          <div key={bucket.name} className="admin-storage-item">
                            <div>
                              <p className="admin-storage-title">{bucket.name}</p>
                              <p className="admin-storage-meta">
                                {bucket.reachable
                                  ? `${formatNumber(bucket.files)} files - ${bucket.sizeMb.toFixed(2)} MB${bucket.truncated ? ' (partial scan)' : ''}`
                                  : `Unavailable - ${bucket.error || 'Unknown error'}`}
                              </p>
                            </div>
                            <span className={`admin-storage-state ${bucket.reachable ? 'admin-storage-state-ok' : 'admin-storage-state-bad'}`}>
                              {bucket.reachable ? 'OK' : 'Issue'}
                            </span>
                          </div>
                        ))}
                        {!overview && !overviewError && <p className="admin-storage-meta">Loading bucket usage...</p>}
                      </div>
                    </div>
                  </div>

                  <div className="admin-grid-content">
                    <div className="admin-card">
                      <p className="admin-card-kicker">
                        <Sparkles size={13} /> Quick Access
                      </p>
                      <h3>Open public pages directly</h3>
                      <div className="admin-quick-links">
                        {MENU_ITEMS.filter((item) => item.id !== 'overview').map((item) => (
                          <Link key={item.id} href={item.route} className="admin-quick-link">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                activeItem.id === 'home' ? (
                  <HomeContentEditor />
                ) : activeItem.id === 'about' ? (
                  <AboutContentEditor />
                ) : activeItem.id === 'research-publications' ? (
                  <ResearchPublicationsEditor />
                ) : activeItem.id === 'research-patents' ? (
                  <ResearchPatentsEditor />
                ) : activeItem.id === 'achievements-awards' ? (
                  <AwardsEditor />
                ) : activeItem.id === 'achievements-certificates' ? (
                  <CertificatesEditor />
                ) : activeItem.id === 'projects' ? (
                  <ProjectsEditor />
                ) : activeItem.id === 'teaching' ? (
                  <TeachingEditor />
                ) : (
                  <div className="admin-detail-card">
                    <div className="admin-detail-head">
                      <div className="admin-detail-icon">
                        <activeItem.icon size={18} />
                      </div>
                      <div>
                        <p className="admin-detail-kicker">Content Workspace</p>
                        <h3>{activeItem.label}</h3>
                      </div>
                    </div>

                    <p className="admin-detail-copy">
                      This section is mapped and ready for CRUD integration. You can now add forms, editors, upload blocks and data actions for this page.
                    </p>

                    <div className="admin-detail-actions">
                      <Link href={activeItem.route} className="admin-btn-primary">
                        Open Public Page
                      </Link>
                      <button type="button" className="admin-btn-secondary" onClick={() => setActive('overview')}>
                        Back to Overview
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.section>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        .admin-shell {
          min-height: calc(100vh - var(--nav-h));
          padding: 84px 20px 66px;
          background:
            radial-gradient(circle at 8% 16%, rgba(13,31,60,0.08), transparent 26%),
            radial-gradient(circle at 92% 10%, rgba(184,135,10,0.12), transparent 24%),
            linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 58%, #FFFDF8 100%);
        }

        .admin-shell-inner {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 18px;
        }

        .admin-sidebar {
          background: #fff;
          border: 1px solid var(--ink-line);
          border-radius: 24px;
          padding: 18px;
          box-shadow: 0 16px 38px rgba(13,31,60,0.11);
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 136px);
          position: sticky;
          top: 88px;
        }

        .admin-brand {
          padding: 12px;
          border-radius: 16px;
          background: linear-gradient(145deg, #0D1F3C 0%, #16335E 100%);
          color: #fff;
          margin-bottom: 14px;
        }

        .admin-brand-kicker {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 700;
          color: rgba(255,255,255,0.74);
          margin-bottom: 7px;
        }

        .admin-brand h1 {
          font-size: 20px;
          margin-bottom: 8px;
          color: #fff;
        }

        .admin-brand p {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.88);
        }

        .admin-nav-wrap {
          flex: 1;
          overflow: auto;
          padding-right: 2px;
        }

        .admin-nav-group {
          margin-bottom: 14px;
        }

        .admin-nav-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-4);
          margin-bottom: 8px;
          padding: 0 10px;
        }

        .admin-nav-list {
          display: grid;
          gap: 6px;
        }

        .admin-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          border: 1px solid transparent;
          background: transparent;
          border-radius: 11px;
          padding: 9px 10px;
          color: var(--ink-3);
          cursor: pointer;
          transition: all 0.16s;
        }

        .admin-nav-item:hover {
          background: var(--off);
          border-color: var(--ink-line);
          color: var(--ink);
        }

        .admin-nav-item-active {
          background: linear-gradient(135deg, rgba(184,135,10,0.14) 0%, rgba(184,135,10,0.05) 100%);
          border-color: rgba(184,135,10,0.28);
          color: var(--gold);
        }

        .admin-nav-item-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid var(--ink-line);
          background: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .admin-nav-item-active .admin-nav-item-icon {
          background: rgba(184,135,10,0.14);
          border-color: rgba(184,135,10,0.34);
        }

        .admin-nav-item-text {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.2;
          flex: 1;
        }

        .admin-nav-item-chevron {
          opacity: 0.55;
        }

        .admin-logout {
          margin-top: 8px;
          border: 1px solid rgba(186,35,35,0.2);
          background: rgba(186,35,35,0.06);
          color: #8A1E1E;
          border-radius: 10px;
          padding: 10px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
        }

        .admin-main {
          background: #fff;
          border: 1px solid var(--ink-line);
          border-radius: 24px;
          box-shadow: 0 16px 38px rgba(13,31,60,0.10);
          padding: 22px;
        }

        .admin-topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--ink-line);
        }

        .admin-topbar-kicker {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--gold);
          margin-bottom: 8px;
        }

        .admin-topbar h2 {
          font-size: clamp(24px, 3.4vw, 34px);
          margin-bottom: 6px;
        }

        .admin-topbar p {
          color: var(--ink-3);
          line-height: 1.7;
        }

        .admin-topbar-chip {
          border-radius: 999px;
          border: 1px solid rgba(16,129,73,0.24);
          background: rgba(16,129,73,0.08);
          color: #0E6940;
          font-size: 12px;
          font-weight: 700;
          padding: 7px 12px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .admin-topbar-chip-danger {
          border-color: rgba(172,48,48,0.25);
          background: rgba(172,48,48,0.08);
          color: #8E2323;
        }

        .admin-panel {
          display: grid;
          gap: 14px;
        }

        .admin-grid-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .admin-metric-card {
          border-radius: 14px;
          border: 1px solid var(--ink-line);
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%);
          padding: 12px;
        }

        .admin-metric-label {
          color: var(--ink-4);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .admin-metric-value {
          font-size: 22px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 5px;
        }

        .admin-metric-detail {
          font-size: 12px;
          color: var(--ink-3);
        }

        .admin-grid-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .admin-card {
          border-radius: 16px;
          border: 1px solid var(--ink-line);
          background: #fff;
          padding: 16px;
        }

        .admin-card-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--gold);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 10px;
          margin-bottom: 10px;
        }

        .admin-card h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }

        .admin-card p {
          color: var(--ink-3);
          line-height: 1.7;
        }

        .admin-plan-subtitle {
          font-size: 12px;
          margin-bottom: 10px;
        }

        .admin-usage-stack {
          display: grid;
          gap: 10px;
          margin-top: 8px;
        }

        .admin-usage-row {
          border: 1px solid var(--ink-line);
          border-radius: 12px;
          padding: 10px;
          background: #FDFEFF;
        }

        .admin-usage-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          color: var(--ink);
          font-size: 12px;
          font-weight: 700;
        }

        .admin-usage-head span:first-child {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .admin-usage-bar {
          width: 100%;
          height: 7px;
          border-radius: 999px;
          background: #EEF2F8;
          overflow: hidden;
          border: 1px solid #E2E8F2;
          margin-bottom: 6px;
        }

        .admin-usage-bar span {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #B8870A 0%, #0D1F3C 100%);
          transition: width 0.35s ease;
        }

        .admin-usage-caption {
          font-size: 11px;
          color: var(--ink-4);
        }

        .admin-overview-actions {
          margin-top: 12px;
        }

        .admin-overview-alert {
          margin-top: 10px;
          border: 1px solid var(--ink-line);
          border-radius: 10px;
          background: #FAFBFF;
          color: var(--ink-3);
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          gap: 6px;
          align-items: center;
        }

        .admin-overview-alert-spaced {
          margin-bottom: 12px;
        }

        .admin-overview-alert-success {
          border-color: rgba(16,129,73,0.2);
          background: rgba(16,129,73,0.08);
          color: #0E6940;
        }

        .admin-overview-alert-error {
          border-color: rgba(172,48,48,0.25);
          background: rgba(172,48,48,0.08);
          color: #8E2323;
        }

        .admin-rules-list {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .admin-rule-item {
          border: 1px solid var(--ink-line);
          border-radius: 11px;
          padding: 9px 10px;
          background: #FCFDFF;
        }

        .admin-rule-pass {
          border-color: rgba(16,129,73,0.2);
          background: rgba(16,129,73,0.05);
        }

        .admin-rule-warn {
          border-color: rgba(184,135,10,0.25);
          background: rgba(184,135,10,0.07);
        }

        .admin-rule-fail {
          border-color: rgba(172,48,48,0.25);
          background: rgba(172,48,48,0.08);
        }

        .admin-rule-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }

        .admin-rule-detail {
          font-size: 12px;
          color: var(--ink-3);
          line-height: 1.5;
        }

        .admin-token-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 10px;
        }

        .admin-token {
          display: inline-flex;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .admin-token-danger {
          background: rgba(172,48,48,0.09);
          color: #8E2323;
          border: 1px solid rgba(172,48,48,0.24);
        }

        .admin-stale-list {
          display: grid;
          gap: 6px;
          margin-top: 10px;
        }

        .admin-stale-list p {
          margin: 0;
          font-size: 12px;
          color: var(--ink-3);
          line-height: 1.5;
        }

        .admin-storage-list {
          display: grid;
          gap: 8px;
          margin-top: 10px;
        }

        .admin-storage-item {
          border: 1px solid var(--ink-line);
          border-radius: 11px;
          background: #FCFDFF;
          padding: 9px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .admin-storage-title {
          margin: 0 0 4px;
          font-size: 12px;
          font-weight: 700;
          color: var(--ink);
        }

        .admin-storage-meta {
          margin: 0;
          font-size: 11px;
          color: var(--ink-4);
          line-height: 1.45;
        }

        .admin-storage-state {
          border-radius: 999px;
          padding: 4px 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .admin-storage-state-ok {
          color: #0E6940;
          border: 1px solid rgba(16,129,73,0.24);
          background: rgba(16,129,73,0.08);
        }

        .admin-storage-state-bad {
          color: #8E2323;
          border: 1px solid rgba(172,48,48,0.24);
          background: rgba(172,48,48,0.08);
        }

        .admin-spin {
          animation: admin-spin 0.9s linear infinite;
        }

        @keyframes admin-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .admin-quick-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .admin-quick-link {
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 12px;
          font-weight: 700;
          color: var(--navy);
          background: var(--off);
          border: 1px solid var(--ink-line);
          text-decoration: none;
          transition: all 0.16s;
        }

        .admin-quick-link:hover {
          background: var(--gold-pale);
          border-color: var(--gold-border);
          color: var(--gold);
        }

        .admin-detail-card {
          border-radius: 16px;
          border: 1px solid var(--ink-line);
          padding: 18px;
          background: #fff;
        }

        .admin-detail-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .admin-detail-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          background: var(--gold-pale);
          border: 1px solid var(--gold-border);
          flex-shrink: 0;
        }

        .admin-detail-kicker {
          color: var(--ink-4);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .admin-detail-head h3 {
          font-size: 24px;
        }

        .admin-detail-copy {
          color: var(--ink-3);
          line-height: 1.75;
          margin-bottom: 14px;
          max-width: 760px;
        }

        .admin-detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .admin-btn-primary,
        .admin-btn-secondary {
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid transparent;
          text-decoration: none;
          cursor: pointer;
        }

        .admin-btn-primary {
          background: var(--navy);
          border-color: var(--navy);
          color: #fff;
        }

        .admin-btn-secondary {
          background: #fff;
          border-color: var(--ink-line);
          color: var(--ink);
        }

        @media (max-width: 1160px) {
          .admin-shell-inner {
            grid-template-columns: 1fr;
          }

          .admin-sidebar {
            position: static;
            max-height: unset;
          }
        }

        @media (max-width: 920px) {
          .admin-grid-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .admin-grid-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .admin-grid-metrics {
            grid-template-columns: 1fr;
          }

          .admin-main {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}
