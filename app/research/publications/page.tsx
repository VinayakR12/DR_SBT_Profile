'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink, BookOpen, Cpu, Leaf,
  Globe, Shield, GraduationCap, FlaskConical,
  ArrowRight, Search, Filter, Calendar,
  Users, Award, Database, CloudOff,
} from 'lucide-react'
import {
  STATIC_RESEARCH_PUBLICATIONS_CONTENT,
  hydrateResearchPublicationsContent,
  type ResearchPublicationsContentRaw,
} from '@/lib/researchPublicationsContent'

// ── Animation helpers ─────────────────────────────────────
const up = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as any },
})

type FilterType = 'All' | 'Journal' | 'Conference' | 'Review'

// Helper function to get sorted years
const getSortedYears = (filteredPapers: ReturnType<typeof hydrateResearchPublicationsContent>['papers']) => {
  const byYear: Record<number, ReturnType<typeof hydrateResearchPublicationsContent>['papers']> = {}
  filteredPapers.forEach(p => {
    if (!byYear[p.year]) byYear[p.year] = []
    byYear[p.year].push(p)
  })
  // Sort years in descending order (latest first)
  return Object.keys(byYear).map(Number).sort((a, b) => b - a)
}

// Helper to get papers by year
const getPapersByYear = (filteredPapers: ReturnType<typeof hydrateResearchPublicationsContent>['papers']) => {
  const byYear: Record<number, ReturnType<typeof hydrateResearchPublicationsContent>['papers']> = {}
  filteredPapers.forEach(p => {
    if (!byYear[p.year]) byYear[p.year] = []
    byYear[p.year].push(p)
  })
  return byYear
}

export default function ResearchPage() {
  const [content, setContent] = useState(() => hydrateResearchPublicationsContent(STATIC_RESEARCH_PUBLICATIONS_CONTENT))
  const [contentSource, setContentSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [filter, setFilter] = useState<FilterType>('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/research-publications-content', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`research-publications-content API returned ${response.status}`)
        }

        const payload = (await response.json()) as {
          source?: 'supabase' | 'backup'
          content?: Partial<ResearchPublicationsContentRaw>
          message?: string
        }

        if (!active) {
          return
        }

        setContent(hydrateResearchPublicationsContent(payload.content || STATIC_RESEARCH_PUBLICATIONS_CONTENT))
        setContentSource(payload.source || 'backup')

        if (payload.source !== 'supabase' && payload.message) {
          console.error('[research-publications-page] Falling back to static backup:', payload.message)
        }
      } catch (error) {
        if (!active) {
          return
        }

        console.error('[research-publications-page] Failed loading DB content. Rendering static fallback.', error)
        setContent(hydrateResearchPublicationsContent(STATIC_RESEARCH_PUBLICATIONS_CONTENT))
        setContentSource('backup')
      }
    }

    loadContent()

    return () => {
      active = false
    }
  }, [])

  const HERO = content.hero
  const STATS = content.stats
  const PAPERS = content.papers
  const THESIS_DETAILS = content.thesis
  const TYPES = content.filterTypes
  const CTA = content.cta

  const filtered = PAPERS.filter(p => {
    const matchType = filter === 'All' || p.type === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q) ||
      p.venue.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    return matchType && matchSearch
  })

  // Sort papers within each year by month (latest first)
  const monthOrder: Record<string, number> = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  }

  const byYear = getPapersByYear(filtered)
  // Sort papers within each year by month
  Object.keys(byYear).forEach(year => {
    byYear[parseInt(year)].sort((a, b) => {
      if (!a.month && !b.month) return 0
      if (!a.month) return 1
      if (!b.month) return -1
      return monthOrder[b.month] - monthOrder[a.month]
    })
  })
  
  const years = getSortedYears(filtered)

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
        {/* top gradient */}
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

        {/* grid bg */}
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

        {/* glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 65% 70% at 75% 50%, rgba(184,135,10,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* CENTER WRAPPER */}
        <div
          className="W"
          style={{
            padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: 'center',
              maxWidth: 760,
              margin: '0 auto',
            }}
          >
            {/* Top label */}
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
              Research & Publications
            </p>

            {/* Heading */}
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 800,
                color: '#F0F4F8',
                lineHeight: 1.06,
                letterSpacing: '-0.025em',
                marginBottom: 20,
                marginInline: 'auto',
              }}
            >
              Academic Research &{' '}
              <em
                style={{
                  color: 'var(--gold-3)',
                  fontStyle: 'italic',
                  fontWeight: 600,
                }}
              >
                Published Work
              </em>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: 'clamp(14px, 1.4vw, 17px)',
                color: 'rgba(226,232,240,0.70)',
                lineHeight: 1.75,
                maxWidth: 620,
                margin: '0 auto',
                marginBottom: 36,
                fontWeight: 300,
              }}
            >
              {HERO.description}
            </p>

            {contentSource !== 'loading' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: contentSource === 'supabase' ? 'rgba(26,107,72,0.16)' : 'rgba(184,135,10,0.14)', color: contentSource === 'supabase' ? '#8EE0B5' : 'var(--gold-3)', fontSize: 11, fontWeight: 700, letterSpacing: '0.02em', marginBottom: 20, width: 'fit-content', marginInline: 'auto' }}>
                {contentSource === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
                <span>{contentSource === 'supabase' ? 'Live from Supabase' : 'Backup content active'}</span>
              </div>
            )}

            {/* CENTERED STATS - DYNAMIC */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'clamp(16px, 3vw, 40px)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  textAlign: 'center',
                  padding: '0 16px',
                  borderRight: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(28px, 3.5vw, 44px)',
                    fontWeight: 700,
                    color: 'var(--gold-3)',
                    lineHeight: 1,
                  }}
                >
                  {STATS.totalPublications}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: 'rgba(226,232,240,0.50)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  Total Publications
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.5 }}
                style={{
                  textAlign: 'center',
                  padding: '0 16px',
                  borderRight: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(28px, 3.5vw, 44px)',
                    fontWeight: 700,
                    color: 'var(--gold-3)',
                    lineHeight: 1,
                  }}
                >
                  {STATS.journalPapers}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: 'rgba(226,232,240,0.50)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  Journal Papers
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.5 }}
                style={{
                  textAlign: 'center',
                  padding: '0 16px',
                  borderRight: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(28px, 3.5vw, 44px)',
                    fontWeight: 700,
                    color: 'var(--gold-3)',
                    lineHeight: 1,
                  }}
                >
                  {STATS.conferencePapers}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: 'rgba(226,232,240,0.50)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  Conference Papers
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.5 }}
                style={{
                  textAlign: 'center',
                  padding: '0 16px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(28px, 3.5vw, 44px)',
                    fontWeight: 700,
                    color: 'var(--gold-3)',
                    lineHeight: 1,
                  }}
                >
                  {STATS.reviewArticles}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: 'rgba(226,232,240,0.50)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  Review Articles
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--ink-line)', position: 'sticky', top: 'var(--nav-h)', zIndex: 100, boxShadow: '0 2px 12px rgba(13,31,60,0.05)' }}>
        <div className="W" style={{ padding: '14px clamp(18px, 5vw, 80px)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Filter size={13} style={{ color: 'var(--ink-4)' }} />
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{
                  padding: '6px 14px', borderRadius: 100, fontSize: 12.5, fontWeight: 600,
                  border: `1.5px solid ${filter === t ? 'var(--navy)' : 'var(--ink-line)'}`,
                  background: filter === t ? 'var(--navy)' : 'transparent',
                  color: filter === t ? '#fff' : 'var(--ink-3)',
                  cursor: 'pointer', transition: 'all 0.18s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onMouseEnter={e => { if (filter !== t) { const el = e.currentTarget; el.style.borderColor = 'var(--navy)'; el.style.color = 'var(--navy)' } }}
                onMouseLeave={e => { if (filter !== t) { const el = e.currentTarget; el.style.borderColor = 'var(--ink-line)'; el.style.color = 'var(--ink-3)' } }}>
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--off)', border: '1.5px solid var(--ink-line)', borderRadius: 8, padding: '7px 12px', minWidth: 200 }}>
            <Search size={13} style={{ color: 'var(--ink-4)', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title, author, keyword…"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif', width: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* ── PAPERS LIST — grouped by year (sorted descending) ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 7vh, 80px) 0 clamp(64px, 10vh, 112px)' }}>
        <div className="W">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--ink-3)' }}>No papers match your search.</p>
              <button onClick={() => { setFilter('All'); setSearch('') }} style={{ marginTop: 16, padding: '9px 20px', borderRadius: 7, background: 'var(--navy)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
                Clear filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={filter + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {years.map((year, yi) => (
                  <div key={year} style={{ marginBottom: 'clamp(40px, 6vh, 64px)' }}>
                    {/* Year heading */}
                    <motion.div {...up(yi * 0.04)}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Calendar size={15} style={{ color: 'var(--gold)' }} />
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>{year}</h2>
                        <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'var(--gold-pale)', border: '1px solid var(--gold-border)', color: 'var(--gold)' }}>
                          {byYear[year].length} paper{byYear[year].length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div style={{ flex: 1, height: 1, background: 'var(--ink-line)' }} />
                    </motion.div>

                    {/* Papers */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {byYear[year].map((p, pi) => (
                        <motion.div key={p.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-30px' }}
                          transition={{ duration: 0.55, delay: pi * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', display: 'block' }}
                          >
                            <div
                              style={{
                                background: 'var(--white)',
                                border: '1px solid var(--ink-line)',
                                borderRadius: 12,
                                padding: 'clamp(18px, 2.5vw, 26px)',
                                display: 'flex',
                                gap: 'clamp(14px, 2.5vw, 24px)',
                                alignItems: 'flex-start',
                                cursor: 'pointer',
                                transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
                                position: 'relative',
                                overflow: 'hidden',
                              }}
                              onMouseEnter={e => {
                                const el = e.currentTarget
                                el.style.transform = 'translateY(-3px)'
                                el.style.boxShadow = 'var(--sh3)'
                                el.style.borderColor = `${p.color}45`
                              }}
                              onMouseLeave={e => {
                                const el = e.currentTarget
                                el.style.transform = 'translateY(0)'
                                el.style.boxShadow = 'none'
                                el.style.borderColor = 'var(--ink-line)'
                              }}
                            >
                              {/* Left color bar */}
                              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${p.color}, var(--gold))`, borderRadius: '12px 0 0 12px' }} />

                              {/* Icon */}
                              <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: `${p.color}10`, border: `1px solid ${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                <p.icon size={20} style={{ color: p.color }} />
                              </div>

                              {/* Content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Top row: type badge + month + external link */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9, flexWrap: 'wrap' }}>
                                  <span style={{
                                    padding: '2px 9px', borderRadius: 4, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                    background: `${p.color}10`, border: `1px solid ${p.color}28`, color: p.color,
                                  }}>{p.type}</span>
                                  {p.month && (
                                    <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 500 }}>{p.month} {p.year}</span>
                                  )}
                                  {p.doi && (
                                    <span style={{ fontSize: 10.5, color: 'var(--ink-4)', fontStyle: 'italic' }}>{p.doi}</span>
                                  )}
                                  <ExternalLink size={11} style={{ color: 'var(--ink-4)', marginLeft: 'auto', flexShrink: 0 }} />
                                </div>

                                {/* Title */}
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(15px, 1.5vw, 17.5px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.38, marginBottom: 8 }}>
                                  {p.title}
                                </h3>

                                {/* Authors */}
                                <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 8 }}>
                                  <Users size={11} style={{ display: 'inline', marginRight: 5, color: 'var(--gold)' }} />
                                  {p.authors}
                                </p>

                                {/* Venue + volume */}
                                <p style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500, lineHeight: 1.5, marginBottom: 4 }}>
                                  <BookOpen size={11} style={{ display: 'inline', marginRight: 5, color: p.color }} />
                                  {p.venue}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                                  {p.volume && <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.volume}</span>}
                                  {p.issn && <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{p.issn}</span>}
                                  {p.pages && <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{p.pages}</span>}
                                </div>

                                {/* Tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                  {p.tags.map(t => (
                                    <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── PhD THESIS highlight ── */}
      <section style={{ background: 'var(--off)', padding: 'clamp(52px, 8vh, 88px) 0', borderTop: '1px solid var(--ink-line)' }}>
        <div className="W">
          <motion.div {...up()}>
            <div style={{ background: 'var(--navy)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--sh3)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {/* Left content */}
              <div style={{ padding: 'clamp(28px, 4vw, 48px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--gold-3))' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 9, background: 'rgba(184,135,10,0.15)', border: '1px solid rgba(184,135,10,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GraduationCap size={19} style={{ color: 'var(--gold-3)' }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)' }}>Ph.D. Thesis — Awarded 2024</span>
                  </div>

                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.2, marginBottom: 16 }}>
                    {THESIS_DETAILS.title}
                  </h2>

                  <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.65)', lineHeight: 1.78, marginBottom: 20, fontWeight: 300 }}>
                    {THESIS_DETAILS.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {THESIS_DETAILS.tags.map(t => (
                      <span key={t} style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10.5, fontWeight: 500, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(226,232,240,0.70)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right key details */}
              <div style={{ padding: 'clamp(28px, 4vw, 48px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 18 }}>Thesis Details</p>
                {THESIS_DETAILS.details.map((r, i, a) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: i < a.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(226,232,240,0.40)', minWidth: 80, flexShrink: 0 }}>{r.k}</span>
                    <span style={{ fontSize: 12.5, color: '#E2E8F0', fontWeight: 400 }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(52px, 9vh, 96px) 0', textAlign: 'center', borderTop: '1px solid var(--ink-line)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(80px, 16vw, 200px)', color: 'var(--navy-pale)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>AI</div>

        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
                      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.12, maxWidth: 640, margin: '0 auto 16px' }}>
                      {CTA.titlePrefix} <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{CTA.titleEmphasis}</em> or Citation?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.78, maxWidth: 520, margin: '0 auto 36px', fontWeight: 300 }}>
                      {CTA.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                      <Link href={CTA.primaryHref} className="btn-navy" style={{ padding: '12px 26px', fontSize: 14 }}>
                        {CTA.primaryLabel} <ArrowRight size={14} />
              </Link>
                      <Link href={CTA.secondaryHref} className="btn-out" style={{ padding: '12px 26px', fontSize: 14 }}>
                        {CTA.secondaryLabel} <ArrowRight size={14} />
              </Link>
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