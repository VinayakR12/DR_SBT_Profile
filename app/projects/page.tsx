'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, Leaf, Globe, Shield, GraduationCap,
  Users, BookOpen, Layers, ArrowRight,
  ChevronDown, ChevronUp, ExternalLink,
  Brain, Microscope, Code2, FlaskConical, FileText,
  Award, Calendar, Building2, Star, Database, CloudOff,
} from 'lucide-react'
import {
  STATIC_PROJECTS_CONTENT,
  normalizeProjectsContent,
  type ProjectsContentRaw,
} from '@/lib/projectsContent'
import { PROJECTS_KPIS, FILTER_TABS, MENTORSHIP_STEPS } from '../Database/Projectdata'
import type { FilterTab } from '@/app/Database/Projectdata'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<ProjectsContentRaw>
  message?: string
}

// ── helpers ───────────────────────────────────────────────
const up = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as any },
})
const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const SI = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any } },
}

export default function ProjectsPage() {
  const [content, setContent] = useState(() => normalizeProjectsContent(STATIC_PROJECTS_CONTENT))
  const [contentSource, setContentSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [contentNotice, setContentNotice] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const [expandedPG, setExpandedPG] = useState<string | null>(null)
  const [expandedUG, setExpandedUG] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/projects-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeProjectsContent(payload.content || STATIC_PROJECTS_CONTENT))
        setContentSource(payload.source || 'backup')

        if (payload.source !== 'supabase') {
          setContentNotice(payload.message || 'Supabase is unavailable. Rendering the backup content file instead.')
          if (payload.message) {
            console.error('[projects-page] Falling back to static backup:', payload.message)
          }
        } else {
          setContentNotice(null)
        }
      } catch {
        if (!active) {
          return
        }

        setContent(normalizeProjectsContent(STATIC_PROJECTS_CONTENT))
        setContentSource('backup')
        setContentNotice('Supabase is unavailable. Rendering the backup content file instead.')
      }
    }

    loadContent()

    return () => {
      active = false
    }
  }, [])

  const pgProjectsByYear = Object.groupBy(content.pgProjects, p => p.year.split('–')[0])
  const pgYears = Object.keys(pgProjectsByYear).sort((a, b) => Number(b) - Number(a))
  const hasLiveData = contentSource === 'supabase'

  return (
    <>
      {/* ── HERO ── */}
<section
  style={{
    paddingTop: 'var(--nav-h)',
    background: 'var(--navy)',
    position: 'relative',
    overflow: 'hidden',
  }}
>
  {/* Top gradient line */}
  <div
    style={{
      position: 'absolute',
      top: 'var(--nav-h)',
      left: 0,
      right: 0,
      height: 3,
      background:
        'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)',
    }}
  />

  {/* Grid background */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      backgroundSize: '52px 52px',
      pointerEvents: 'none',
    }}
  />

  {/* Radial glow */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(ellipse 65% 80% at 85% 55%, rgba(184,135,10,0.09) 0%, transparent 60%)',
      pointerEvents: 'none',
    }}
  />

  {/* Watermark */}
  <div
    style={{
      position: 'absolute',
      right: -30,
      bottom: -20,
      fontFamily: 'Playfair Display, serif',
      fontWeight: 800,
      fontSize: 'clamp(80px, 16vw, 200px)',
      color: 'rgba(255,255,255,0.03)',
      lineHeight: 1,
      userSelect: 'none',
      pointerEvents: 'none',
      letterSpacing: '-0.04em',
    }}
  >
    {PROJECTS_KPIS.totalUGGroups + PROJECTS_KPIS.totalPGProjects}+
  </div>

  <div
    style={{
      position: 'absolute',
      top: 'calc(var(--nav-h) + 18px)',
      right: 'clamp(16px, 4vw, 48px)',
      zIndex: 2,
      padding: '8px 12px',
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.16)',
      background: hasLiveData ? 'rgba(5,150,105,0.16)' : 'rgba(217,119,6,0.18)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}
  >
    {hasLiveData ? <Database size={13} /> : <CloudOff size={13} />}
    {hasLiveData ? 'Live rendering' : 'Backup rendering'}
  </div>

  {/* Main Wrapper */}
  <div
    className="W"
    style={{
      padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)',
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: 800,
        width: '100%',
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--gold-3)',
          marginBottom: 14,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{
            width: 22,
            height: 2,
            background: 'var(--gold-3)',
            borderRadius: 2,
            display: 'inline-block',
          }}
        />
        Projects & Mentorship
      </p>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(36px, 6vw, 70px)',
          fontWeight: 800,
          color: '#F0F4F8',
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
          marginBottom: 18,
          marginInline: 'auto',
          maxWidth: 700,
        }}
      >
        Shaping Engineers Through{' '}
        <em
          style={{
            color: 'var(--gold-3)',
            fontStyle: 'italic',
            fontWeight: 600,
          }}
        >
          Research & Innovation
        </em>
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: 'clamp(14px, 1.4vw, 17px)',
          color: 'rgba(226,232,240,0.70)',
          lineHeight: 1.75,
          marginBottom: 36,
          fontWeight: 300,
          marginInline: 'auto',
          maxWidth: 600,
        }}
      >
        Over {PROJECTS_KPIS.totalUGGroups + PROJECTS_KPIS.totalPGProjects}{' '}
        student projects guided across 18 years — from undergraduate capstone
        projects to M.E. dissertations that resulted in patents, international
        publications, and IEEE conference papers.
      </p>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          maxWidth: 560,
          gap: '1px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          margin: '0 auto',
        }}
      >
        {[
          {
            n: PROJECTS_KPIS.totalPGProjects,
            l: 'M.E. / PG',
            s: 'Dissertations',
          },
          {
            n: PROJECTS_KPIS.totalUGGroups,
            l: 'UG Groups',
            s: 'Capstone Projects',
          },
          {
            n: PROJECTS_KPIS.totalDomains,
            l: 'Domains',
            s: 'Specializations',
          },
          {
            n: PROJECTS_KPIS.publishedStudentResearch,
            l: 'Published',
            s: 'Student Research',
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            style={{
              padding:
                'clamp(16px, 2.5vw, 24px) clamp(10px, 1.5vw, 16px)',
              textAlign: 'center',
              background: 'rgba(13,31,60,0.5)',
            }}
          >
            <p
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(26px, 3vw, 38px)',
                fontWeight: 700,
                color: 'var(--gold-3)',
                lineHeight: 1,
              }}
            >
              {s.n}
            </p>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#E2E8F0',
                marginTop: 4,
              }}
            >
              {s.l}
            </p>
            <p
              style={{
                fontSize: 9.5,
                color: 'rgba(226,232,240,0.45)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              {s.s}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>

  {/* Content Source Indicator & Notice */}
  <div style={{ background: '#fff', borderBottom: '1px solid var(--ink-line)', padding: '16px clamp(18px, 5vw, 80px)' }}>
    <div className="W" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {contentSource === 'supabase' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#059669', fontWeight: 600 }}>
            <Database size={14} /> Live from Supabase
          </div>
        ) : contentSource === 'backup' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#D97706', fontWeight: 600 }}>
            <CloudOff size={14} /> Backup content active
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
            Loading...
          </div>
        )}
      </div>
      {contentNotice && (
        <p style={{ fontSize: 12, color: '#666', margin: 0, maxWidth: 600 }}>
          {contentNotice}
        </p>
      )}
    </div>
  </div>
</section>

      {/* ── TAB BAR ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--ink-line)', position: 'sticky', top: 'var(--nav-h)', zIndex: 100, boxShadow: '0 2px 12px rgba(13,31,60,0.05)' }}>
        <div className="W" style={{ padding: '0 clamp(18px, 5vw, 80px)', display: 'flex', gap: 0 }}>
          {FILTER_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 20px', background: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--navy)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--navy)' : 'var(--ink-4)',
                fontWeight: activeTab === tab ? 700 : 400,
                fontSize: 13.5, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                whiteSpace: 'nowrap', marginBottom: -1,
                transition: 'color 0.18s, border-color 0.18s',
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── PG PROJECTS ── */}
      <AnimatePresence>
        {(activeTab === 'All' || activeTab === 'PG Dissertations') && (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0' }}
          >
            <div className="W">
              <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--navy-pale)', border: '1px solid var(--navy-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={19} style={{ color: 'var(--navy)' }} />
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
                    Post-Graduate <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Dissertations</em>
                  </h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 640, fontWeight: 300 }}>
                  {PROJECTS_KPIS.totalPGProjects} M.E. students guided to completion. Each dissertation represents original research that advanced knowledge in AI, cybersecurity, web engineering, and healthcare informatics — many resulting in international publications and patents.
                </p>
              </motion.div>

              {pgYears.map((year, yi) => (
                <div key={year} style={{ marginBottom: 'clamp(32px, 5vh, 48px)' }}>
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: yi * 0.05, duration: 0.5 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}
                  >
                    <Calendar size={14} style={{ color: 'var(--gold)' }} />
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--navy)' }}>{year}</h3>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--ink-line), transparent)' }} />
                    <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{pgProjectsByYear[year]?.length || 0} projects</span>
                  </motion.div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {pgProjectsByYear[year]?.map((p, i) => {
                      const isOpen = expandedPG === p.id
                      return (
                        <motion.div key={p.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.55 }}>
                          <div style={{
                            background: '#fff', border: '1px solid rgba(15,23,42,0.08)',
                            borderRadius: 12, overflow: 'hidden',
                            boxShadow: isOpen ? 'var(--sh2)' : 'var(--sh1)',
                            transition: 'box-shadow 0.2s, border-color 0.2s',
                            borderColor: isOpen ? `${p.color}40` : 'rgba(15,23,42,0.08)',
                          }}>
                            <div style={{ height: 3, background: `linear-gradient(90deg, ${p.color}, var(--gold))` }} />

                            <button
                              onClick={() => setExpandedPG(isOpen ? null : p.id)}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                                padding: 'clamp(16px, 2.5vw, 22px) clamp(16px, 2.5vw, 24px)',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                textAlign: 'left', fontFamily: 'DM Sans, sans-serif',
                              }}
                            >
                              <div style={{ width: 38, height: 38, borderRadius: 9, background: `${p.color}10`, border: `1px solid ${p.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: p.color, lineHeight: 1 }}>{i + 1}</p>
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.color, background: `${p.color}10`, border: `1px solid ${p.color}28`, padding: '2px 8px', borderRadius: 4 }}>{p.domain}</span>
                                  <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{p.year}</span>
                                </div>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(14.5px, 1.4vw, 17px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.35 }}>
                                  {p.title}
                                </h3>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                {p.student && (
                                  <span style={{ fontSize: 12, color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <Users size={11} /> {p.student.split(',')[0]}
                                  </span>
                                )}
                                <div style={{ width: 28, height: 28, borderRadius: 7, background: isOpen ? 'var(--navy-pale)' : 'var(--off)', border: '1px solid var(--ink-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOpen ? 'var(--navy)' : 'var(--ink-4)', transition: 'all 0.18s' }}>
                                  {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                </div>
                              </div>
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <div style={{ padding: '0 clamp(16px, 2.5vw, 24px) clamp(20px, 3vw, 28px)', paddingLeft: 'calc(clamp(16px, 2.5vw, 24px) + 38px + 16px)' }}>
                                    <div style={{ height: 1, background: 'var(--ink-line)', marginBottom: 18 }} />

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                                      {p.student && (
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                          <Users size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
                                          <div>
                                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 2 }}>Student / Scholar</p>
                                            <p style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{p.student}</p>
                                          </div>
                                        </div>
                                      )}
                                      {p.university && (
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                          <Building2 size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
                                          <div>
                                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 2 }}>Institution</p>
                                            <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.4 }}>{p.university}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.78, marginBottom: 14, fontWeight: 300 }}>{p.summary}</p>

                                    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'rgba(26,107,72,0.06)', border: '1px solid rgba(26,107,72,0.18)', marginBottom: 16 }}>
                                      <Award size={14} style={{ color: '#1A6B48', flexShrink: 0, marginTop: 2 }} />
                                      <div>
                                        <p style={{ fontSize: 10.5, fontWeight: 700, color: '#1A5038', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Research Outcome</p>
                                        <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{p.outcome}</p>
                                      </div>
                                    </div>

                                    {(p.link || p.uploadUrl) && (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                                        {p.link && (
                                          <a href={p.link} target="_blank" rel="noreferrer" className="btn-out" style={{ padding: '10px 16px', fontSize: 13 }}>
                                            <ExternalLink size={14} /> View link
                                          </a>
                                        )}
                                        {p.uploadUrl && (
                                          <a href={p.uploadUrl} target="_blank" rel="noreferrer" className="btn-navy" style={{ padding: '10px 16px', fontSize: 13 }}>
                                            <FileText size={14} /> Open upload
                                          </a>
                                        )}
                                      </div>
                                    )}

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                      {p.tags.map(t => (
                                        <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {activeTab === 'All' && <div style={{ height: 1, background: 'var(--ink-line)' }} />}

      {/* ── UG PROJECTS ── */}
      <AnimatePresence>
        {(activeTab === 'All' || activeTab === 'UG Projects') && (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'var(--off)', padding: 'clamp(48px, 8vh, 80px) 0' }}
          >
            <div className="W">
              <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gold-pale)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code2 size={19} style={{ color: 'var(--gold)' }} />
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
                    Undergraduate <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Project Groups</em>
                  </h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 640, fontWeight: 300 }}>
                  {PROJECTS_KPIS.totalUGGroups} UG project groups guided across {PROJECTS_KPIS.totalDomains} technical domains. Each group received mentorship from problem definition through design, development, testing, and final presentation.
                </p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 44%, 500px), 1fr))', gap: 'clamp(14px, 2vw, 22px)' }}>
                {content.ugDomains.map(d => {
                  const isOpen = expandedUG === d.id
                  const DomainIcon = d.icon || Brain
                  return (
                    <motion.div key={d.id} variants={SI}>
                      <div style={{
                        background: 'linear-gradient(180deg, #fff 0%, #FBFCFE 100%)',
                        border: '1px solid rgba(15,23,42,0.08)',
                        borderRadius: 16,
                        overflow: 'hidden',
                        height: '100%',
                        boxShadow: isOpen ? '0 18px 44px rgba(13,31,60,0.14)' : 'var(--sh1)',
                        borderColor: isOpen ? `${d.color}40` : 'rgba(15,23,42,0.08)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                        transform: isOpen ? 'translateY(-2px)' : 'translateY(0)',
                      }}>
                        <div style={{ height: 4, background: `linear-gradient(90deg, ${d.color}, var(--gold), ${d.color})` }} />

                        <div style={{ padding: 'clamp(18px, 2.5vw, 26px)' }}>
                          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: d.bg, border: `1px solid ${d.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `inset 0 0 0 1px ${d.color}10` }}>
                              <DomainIcon size={20} style={{ color: d.color }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: d.color, background: `${d.color}10`, border: `1px solid ${d.color}28`, padding: '2px 8px', borderRadius: 4 }}>UG Domain</span>
                                <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{d.totalGroups} groups</span>
                              </div>
                              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(15px, 1.4vw, 17px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 5 }}>{d.domain}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: d.color, lineHeight: 1 }}>{d.totalGroups}+</span>
                                <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 500 }}>project groups</span>
                              </div>
                            </div>
                          </div>

                          {d.description && <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.72, marginBottom: 14 }}>{d.description}</p>}

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                            {d.technologies.map(t => (
                              <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>
                            ))}
                          </div>

                          <button
                            onClick={() => setExpandedUG(isOpen ? null : d.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              fontSize: 12, fontWeight: 600, color: d.color,
                              background: d.bg, border: `1px solid ${d.color}22`,
                              borderRadius: 6, padding: '6px 12px', cursor: 'pointer',
                              fontFamily: 'DM Sans, sans-serif',
                              transition: 'background 0.18s',
                            }}
                          >
                            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            {isOpen ? 'Hide project highlights' : 'Show project highlights'}
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--ink-line)' }}>
                                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 10 }}>Sample Projects</p>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {d.highlights.map((h, idx) => (
                                      <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: d.color, flexShrink: 0, marginTop: 6 }} />
                                        <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{h}</p>
                                      </div>
                                    ))}
                                  </div>
                                  {d.technologies.length > 0 && (
                                    <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                      {d.technologies.slice(0, 4).map((item) => (
                                        <span key={item} style={{ fontSize: 10, padding: '4px 8px', borderRadius: 999, background: 'rgba(13,31,60,0.05)', color: 'var(--ink-3)', border: '1px solid var(--ink-line)' }}>{item}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── MENTORSHIP PHILOSOPHY ── */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(52px, 9vh, 88px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold-3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(184,135,10,0.07) 0%, transparent 55%), radial-gradient(circle at 20% 50%, rgba(255,255,255,0.02) 0%, transparent 55%)', pointerEvents: 'none' }} />

        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(40px, 7vw, 80px)', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
                Mentorship Approach
              </p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.12, marginBottom: 20 }}>
                Every Project is a{' '}
                <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 500 }}>Research Experience</em>
              </h2>
              <p style={{ fontSize: 14.5, color: 'rgba(226,232,240,0.68)', lineHeight: 1.82, fontWeight: 300 }}>
                I guide students not just to build a working system, but to understand the problem deeply, survey existing literature, design a rigorous methodology, and communicate findings professionally. The result is engineers who think like researchers — and researchers who can build.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MENTORSHIP_STEPS.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1, flexShrink: 0, minWidth: 32 }}>{s.step}</span>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#E2E8F0', marginBottom: 4 }}>{s.title}</p>
                    <p style={{ fontSize: 12.5, color: 'rgba(226,232,240,0.55)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0', borderTop: '1px solid var(--ink-line)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
            <FlaskConical size={26} style={{ color: 'var(--gold)', margin: '0 auto 14px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
              Want to Collaborate on a <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Research Project?</em>
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 480, margin: '0 auto 30px', lineHeight: 1.75, fontWeight: 300 }}>
              I am open to supervising M.E. dissertations, co-authoring research, and guiding institutional capstone projects in AI, ML, and Computer Vision.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <Link href="/contact" className="btn-navy" style={{ padding: '12px 26px', fontSize: 14 }}>Discuss a Project <ArrowRight size={14} /></Link>
              <Link href="/research" className="btn-out" style={{ padding: '12px 26px', fontSize: 14 }}>View Publications</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 480px) {
          .W { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </>
  )
}