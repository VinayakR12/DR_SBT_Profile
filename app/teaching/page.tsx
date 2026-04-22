'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Users, Award,
  ArrowRight, CheckCircle2, Building2, Quote,
  ChevronDown, ChevronUp, Database, CloudOff, Star,
} from 'lucide-react'
import {
  STATIC_TEACHING_CONTENT,
  LEVEL_COLORS,
  SUBJECT_FILTERS,
  getSubjectCountByCategory,
  normalizeTeachingContent,
  type TeachingContentRaw,
} from '@/lib/teachingContent'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<TeachingContentRaw>
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
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any } },
}

export default function TeachingPage() {
  const [content, setContent] = useState<TeachingContentRaw>(() => normalizeTeachingContent(STATIC_TEACHING_CONTENT))
  const [contentSource, setContentSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [contentNotice, setContentNotice] = useState<string | null>(null)
  const [subjFilter, setSubjFilter] = useState<string>('All')
  const [openInst, setOpenInst] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/teaching-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        const nextContent = normalizeTeachingContent(payload.content || STATIC_TEACHING_CONTENT)
        setContent(nextContent)
        setContentSource(payload.source || 'backup')
        setOpenInst(nextContent.institutions.items[0]?.id || null)

        if (payload.source !== 'supabase') {
          setContentNotice(payload.message || 'Supabase is unavailable. Rendering backup teaching content.')
        } else {
          setContentNotice(null)
        }
      } catch {
        if (!active) {
          return
        }

        const fallback = normalizeTeachingContent(STATIC_TEACHING_CONTENT)
        setContent(fallback)
        setContentSource('backup')
        setOpenInst(fallback.institutions.items[0]?.id || null)
        setContentNotice('Supabase is unavailable. Rendering backup teaching content.')
      }
    }

    loadContent()

    return () => {
      active = false
    }
  }, [])

  const subjectFilters = useMemo(() => {
    const categories = Array.from(new Set(content.subjects.items.map((item) => item.cat)))
    const preferred = SUBJECT_FILTERS.filter((entry) => entry === 'All' || categories.includes(entry))
    const extras = categories.filter((entry) => !preferred.includes(entry))
    return [...preferred, ...extras]
  }, [content.subjects.items])

  const filteredSubjects = subjFilter === 'All'
    ? content.subjects.items
    : content.subjects.items.filter((subject) => subject.cat === subjFilter)

  const subjectCounts = getSubjectCountByCategory(content.subjects.items)
  const hasLiveData = contentSource === 'supabase'

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'var(--nav-h)',
        background: 'var(--navy)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 82% 55%, rgba(184,135,10,0.09) 0%, transparent 62%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 'calc(var(--nav-h) + 18px)', right: 'clamp(16px, 4vw, 48px)', zIndex: 2, padding: '8px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.16)', background: hasLiveData ? 'rgba(5,150,105,0.16)' : 'rgba(217,119,6,0.18)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
          {hasLiveData ? <Database size={13} /> : <CloudOff size={13} />}
          {hasLiveData ? 'Live' : 'Backup'}
        </div>

        <div className="W" style={{ padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
                {content.hero.kicker}
              </p>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 6vw, 70px)', fontWeight: 800, color: '#F0F4F8', lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 18, maxWidth: 640 }}>
                {content.hero.titleLead}{' '}
                <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 600 }}>{content.hero.titleEmphasis}</em>
              </h1>
              <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'rgba(226,232,240,0.70)', lineHeight: 1.75, maxWidth: 560, marginBottom: 32, fontWeight: 300 }}>
                {content.hero.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px, 3.5vw, 44px)' }}>
                {content.hero.stats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1 }}>{s.n}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#E2E8F0', marginTop: 3 }}>{s.l}</p>
                    <p style={{ fontSize: 9.5, color: 'rgba(226,232,240,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 1 }}>{s.s}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: 24, position: 'relative' }}>
                <Quote size={28} style={{ color: 'var(--gold)', opacity: 0.4, marginBottom: 14 }} />
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(18px, 2.2vw, 26px)', fontStyle: 'italic', fontWeight: 400, color: '#F0F4F8', lineHeight: 1.5, marginBottom: 18 }}>
                  "{content.hero.quote}"
                </p>
                <p style={{ fontSize: 12.5, color: 'rgba(226,232,240,0.55)' }}>
                  {content.hero.quoteAuthor}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {contentNotice ? (
        <div style={{ background: '#fff', borderBottom: '1px solid var(--ink-line)', padding: '14px clamp(18px, 5vw, 80px)' }}>
          <div className="W" style={{ fontSize: 12, color: '#666' }}>{contentNotice}</div>
        </div>
      ) : null}

      {/* ── TEACHING IDENTITY ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(52px, 9vh, 88px) 0' }}>
        <div className="W">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 96px)', alignItems: 'start', textAlign: 'justify' }}>
            <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 18 }}>{content.identity.kicker}</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.12, marginBottom: 22, textAlign: 'left' }}>
                {content.identity.titleLead}{' '}
                <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>{content.identity.titleEmphasis}</em>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 16, fontWeight: 300 }}>
                {content.identity.paragraph1}
              </p>
              <p style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>
                {content.identity.paragraph2}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {content.identity.credentials.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
                    <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>{c}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...up(0.1)}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 16 }}>Pedagogical Principles</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {content.pedagogy.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                    style={{ display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 10, background: 'var(--off)', border: '1px solid var(--ink-line)', transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s' }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--navy-glow)'; el.style.boxShadow = 'var(--sh2)'; el.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--ink-line)'; el.style.boxShadow = 'none'; el.style.transform = 'translateX(0)' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--navy-pale)', border: '1px solid var(--navy-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <p.icon size={17} style={{ color: 'var(--navy)' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 5 }}>{p.title}</p>
                      <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.65 }}>{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SUBJECTS GRID ── */}
      <section style={{ background: 'var(--off)', padding: 'clamp(52px, 9vh, 88px) 0', borderTop: '1px solid var(--ink-line)' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>{content.subjects.kicker}</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              {content.subjects.titleLead}{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>{content.subjects.titleEmphasis}</em>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {subjectFilters.map(cat => (
              <button
                key={cat}
                onClick={() => setSubjFilter(cat)}
                style={{
                  padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${subjFilter === cat ? 'var(--navy)' : 'var(--ink-line)'}`,
                  background: subjFilter === cat ? 'var(--navy)' : 'transparent',
                  color: subjFilter === cat ? '#fff' : 'var(--ink-3)',
                  cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {cat} <span style={{ fontSize: 10, marginLeft: 4 }}>({subjectCounts[cat] || 0})</span>
              </button>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 28%, 260px), 1fr))', gap: 'clamp(10px, 1.5vw, 14px)' }}>
            {filteredSubjects.map((s, i) => (
              <motion.div key={i} variants={SI}>
                <div style={{
                  background: '#fff', border: `1px solid ${s.color}20`, borderRadius: 10, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12, transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = 'var(--sh2)' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: `${s.color}10`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <s.icon size={14} style={{ color: s.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3 }}>{s.name}</p>
                    <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                      {s.level.map(lvl => (
                        <span key={lvl} style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: LEVEL_COLORS[lvl].bg, color: LEVEL_COLORS[lvl].text, border: `1px solid ${LEVEL_COLORS[lvl].border}` }}>
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INSTITUTION TIMELINE accordion ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(52px, 9vh, 88px) 0', borderTop: '1px solid var(--ink-line)' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>{content.institutions.kicker}</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              {content.institutions.titleLead} <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>{content.institutions.titleEmphasis}</em>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {content.institutions.items.map((inst, i) => {
              const isOpen = openInst === inst.id
              const hasResource = Boolean((inst.resourceLink || '').trim())
              const hasDocument = Boolean((inst.documentUrl || '').trim())
              return (
                <motion.div key={inst.id} {...up(i * 0.07)}>
                  <div style={{
                    background: '#fff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 13, overflow: 'hidden',
                    boxShadow: isOpen ? 'var(--sh2)' : 'var(--sh1)',
                    borderColor: isOpen ? `${inst.color}40` : 'rgba(15,23,42,0.08)',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}>
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${inst.color}, var(--gold))` }} />

                    <button onClick={() => setOpenInst(isOpen ? null : inst.id)}
                      style={{ width: '100%', display: 'flex', gap: 16, alignItems: 'center', padding: 'clamp(16px, 2.5vw, 22px) clamp(16px, 2.5vw, 24px)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif' }}>
                      <div style={{ flexShrink: 0, minWidth: 80, textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 6, background: `${inst.color}10`, border: `1px solid ${inst.color}28`, fontSize: 11, fontWeight: 700, color: inst.color }}>{inst.period}</span>
                        {inst.current && <span style={{ display: 'block', marginTop: 4, fontSize: 9.5, fontWeight: 700, color: '#1A6B48', letterSpacing: '0.08em', textTransform: 'uppercase' }}>▸ Current</span>}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 4 }}>{inst.role}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Building2 size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{inst.org}</span>
                          <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>· {inst.city} · {inst.univ}</span>
                        </div>
                      </div>

                      <div style={{ width: 30, height: 30, borderRadius: 8, background: isOpen ? 'var(--navy-pale)' : 'var(--off)', border: '1px solid var(--ink-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: isOpen ? 'var(--navy)' : 'var(--ink-4)', transition: 'all 0.18s' }}>
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 clamp(16px, 2.5vw, 24px) clamp(20px, 3vw, 28px)', paddingLeft: 'calc(clamp(16px, 2.5vw, 24px) + 80px + 16px)' }}>
                            <div style={{ height: 1, background: 'var(--ink-line)', marginBottom: 18 }} />

                            <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'var(--gold-pale)', border: '1px solid var(--gold-border)', marginBottom: 16 }}>
                              <Star size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} fill="var(--gold)" />
                              <p style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500, lineHeight: 1.55 }}>{inst.highlight}</p>
                            </div>

                            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 10 }}>Roles & Responsibilities</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {inst.roles.map((r, ri) => (
                                <div key={ri} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                  <CheckCircle2 size={13} style={{ color: inst.color, flexShrink: 0, marginTop: 3 }} />
                                  <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>{r}</p>
                                </div>
                              ))}
                            </div>

                            {(hasResource || hasDocument) && (
                              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                                {hasResource && (
                                  <a
                                    href={inst.resourceLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      padding: '8px 12px',
                                      borderRadius: 8,
                                      border: '1px solid var(--ink-line)',
                                      background: '#fff',
                                      color: 'var(--navy)',
                                      fontSize: 12,
                                      fontWeight: 600,
                                      textDecoration: 'none',
                                    }}
                                  >
                                    View Link
                                  </a>
                                )}
                                {hasDocument && (
                                  <a
                                    href={inst.documentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      padding: '8px 12px',
                                      borderRadius: 8,
                                      border: '1px solid var(--navy)',
                                      background: 'var(--navy)',
                                      color: '#fff',
                                      fontSize: 12,
                                      fontWeight: 600,
                                      textDecoration: 'none',
                                    }}
                                  >
                                    View Doc
                                  </a>
                                )}
                              </div>
                            )}
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
      </section>

      {/* ── ADMINISTRATIVE ROLES ── */}
      <section style={{ background: 'var(--off)', padding: 'clamp(52px, 9vh, 88px) 0', borderTop: '1px solid var(--ink-line)' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>{content.admin.kicker}</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              {content.admin.titleLead} <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>{content.admin.titleEmphasis}</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(260px, 44%, 480px), 1fr))', gap: 'clamp(12px, 2vw, 18px)' }}>
            {content.admin.roles.map((r, i) => (
              <motion.div key={i} variants={SI}
                style={{ background: '#fff', border: '1px solid var(--ink-line)', borderRadius: 12, padding: 'clamp(18px, 2.5vw, 24px)', display: 'flex', gap: 14, alignItems: 'flex-start', transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = `${r.color}40`; el.style.boxShadow = 'var(--sh2)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--ink-line)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${r.color}10`, border: `1px solid ${r.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <r.icon size={19} style={{ color: r.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', marginBottom: 4, lineHeight: 1.3 }}>{r.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, marginBottom: 8 }}>{r.inst}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.68, fontWeight: 300 }}>{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STUDENT IMPACT BAND ── */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(44px, 7vh, 72px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold-3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 60% 50%, rgba(184,135,10,0.07) 0%, transparent 55%)', pointerEvents: 'none' }} />

        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()} style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vh, 40px)' }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
              {content.impact.kicker}
              <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.1 }}>
              {content.impact.titleLead} <em style={{ color: 'var(--gold-3)', fontStyle: 'italic' }}>{content.impact.titleEmphasis}</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {content.impact.stats.map((s, i) => (
              <motion.div key={i} variants={SI}
                style={{ padding: 'clamp(18px, 3vw, 28px) clamp(8px, 1.5vw, 14px)', textAlign: 'center', background: 'rgba(13,31,60,0.5)', cursor: 'default', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,135,10,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,31,60,0.5)')}>
                <s.icon size={18} style={{ color: 'rgba(226,232,240,0.35)', margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1, marginBottom: 4 }}>{s.n}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#E2E8F0', marginBottom: 2 }}>{s.l}</p>
                <p style={{ fontSize: 9.5, color: 'rgba(226,232,240,0.42)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.s}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0', borderTop: '1px solid var(--ink-line)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
            <BookOpen size={26} style={{ color: 'var(--gold)', margin: '0 auto 14px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
              {content.cta.titleLead} <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{content.cta.titleEmphasis}</em>
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 500, margin: '0 auto 30px', lineHeight: 1.75, fontWeight: 300 }}>
              {content.cta.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <Link href={content.cta.primaryHref} className="btn-navy" style={{ padding: '12px 26px', fontSize: 14 }}>{content.cta.primaryLabel} <ArrowRight size={14} /></Link>
              <Link href={content.cta.secondaryHref} className="btn-out" style={{ padding: '12px 26px', fontSize: 14 }}>{content.cta.secondaryLabel}</Link>
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