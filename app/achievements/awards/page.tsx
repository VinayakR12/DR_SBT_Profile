'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, GraduationCap, Building2, Star,
  ArrowRight, Calendar,
  Quote, Trophy, FileCheck, ExternalLink,
  Download, X, Database, CloudOff,
} from 'lucide-react'
import {
  AWARD_CATEGORIES,
  CATEGORY_COLORS,
  STATIC_ACHIEVEMENTS_AWARDS_CONTENT,
  hydrateAchievementsAwardsContent,
  normalizeAchievementsAwardsContent,
  type AwardItemHydrated,
  type AwardsContentRaw,
} from '@/lib/awardsContent'

// ── Animation ─────────────────────────────────────────────
const up = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
})

const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }
const SI = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as any } },
}

type AwardCategory = AwardItemHydrated['category']

type ApiState = {
  source?: 'supabase' | 'backup'
  content?: Partial<AwardsContentRaw>
  message?: string
}

// Helper functions
const catCount = (cat: AwardCategory | 'All', restAwards: AwardItemHydrated[]) =>
  cat === 'All' ? restAwards.length : restAwards.filter(a => a.category === cat).length

export default function AwardsPage() {
  const [content, setContent] = useState(() => normalizeAchievementsAwardsContent(STATIC_ACHIEVEMENTS_AWARDS_CONTENT))
  const [contentSource, setContentSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [activeCategory, setActiveCategory] = useState<AwardCategory | 'All'>('All')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [doc, setDoc] = useState<{ file: string; title: string } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/achievements-awards-content', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`achievements-awards-content API returned ${response.status}`)
        }

        const payload = (await response.json()) as ApiState
        if (!active) {
          return
        }

        setContent(normalizeAchievementsAwardsContent(payload.content || STATIC_ACHIEVEMENTS_AWARDS_CONTENT))
        setContentSource(payload.source || 'backup')

        if (payload.source !== 'supabase' && payload.message) {
          console.error('[achievements-awards-page] Falling back to static backup:', payload.message)
        }
      } catch (error) {
        if (!active) {
          return
        }

        console.error('[achievements-awards-page] Failed loading DB content. Rendering static fallback.', error)
        setContent(normalizeAchievementsAwardsContent(STATIC_ACHIEVEMENTS_AWARDS_CONTENT))
        setContentSource('backup')
      }
    }

    loadContent()

    return () => {
      active = false
    }
  }, [])

  const awards = useMemo(() => hydrateAchievementsAwardsContent(content).awards, [content])
  const featuredAward = useMemo(() => awards.find((award) => award.featured) || awards[0], [awards])
  const restAwards = useMemo(
    () => awards.filter((award) => award.id !== featuredAward?.id),
    [awards, featuredAward],
  )

  const categories = AWARD_CATEGORIES
  const years = useMemo(
    () => [...new Set(awards.map((award) => award.year))].sort((a, b) => Number(b) - Number(a)),
    [awards],
  )
  const heroStats = useMemo(() => {
    const patents = awards.filter(
      (award) => award.category === 'Intellectual Property' && award.title.toLowerCase().includes('patent'),
    ).length
    const copyrights = awards.filter(
      (award) => award.category === 'Intellectual Property' && award.title.toLowerCase().includes('copyright'),
    ).length
    const yearCount = new Set(awards.map((award) => award.year)).size

    return [
      { n: `${awards.length}`, l: 'Total Honours' },
      { n: `${patents}`.padStart(2, '0'), l: 'Patents Filed' },
      { n: `${copyrights}`.padStart(2, '0'), l: 'Copyrights' },
      { n: `${yearCount}`.padStart(2, '0'), l: 'Years of Record' },
    ]
  }, [awards])

  const openDoc = (file: string, title: string) => {
    setLoaded(false)
    setDoc({ file, title })
  }

  const closeDoc = () => setDoc(null)

  const filtered = activeCategory === 'All'
    ? restAwards
    : restAwards.filter(a => a.category === activeCategory)

  const filteredByYear: Record<string, AwardItemHydrated[]> = {}
  filtered.forEach(a => {
    if (!filteredByYear[a.year]) filteredByYear[a.year] = []
    filteredByYear[a.year].push(a)
  })
  const sortedYears = Object.keys(filteredByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <>
      <style>
    {`
      .custom-scroll::-webkit-scrollbar {
        height: 8px;
      }
      .custom-scroll::-webkit-scrollbar-track {
        background: #1e3a8a;
      }
      .custom-scroll::-webkit-scrollbar-thumb {
        background: #3b82f6;
        border-radius: 6px;
      }
      .custom-scroll {
        scrollbar-color: #3b82f6 #1e3a8a;
      }
    `}
  </style>
      {/* ══════════════════════════════════
          HERO — Editorial typographic
      ══════════════════════════════════ */}
      <section style={{
        paddingTop: 'var(--nav-h)',
        background: 'var(--navy)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gold top stripe */}
        <div style={{ position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)' }} />

        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        {/* Large decorative number — editorial */}
        <div style={{
          position: 'absolute', right: '-20px', top: '50%',
          transform: 'translateY(-55%)',
          fontFamily: 'Playfair Display, serif',
          fontWeight: 800,
          fontSize: 'clamp(140px, 24vw, 320px)',
          lineHeight: 1,
          color: 'rgba(184,135,10,0.07)',
          userSelect: 'none', pointerEvents: 'none',
          letterSpacing: '-0.06em',
        }}>
          {awards.length}
        </div>

        <div className="W" style={{ padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 12.5 }}>
              <Link href="/achievements" style={{ color: 'rgba(226,232,240,0.50)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-3)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(226,232,240,0.50)')}>
                Achievements
              </Link>
              <span style={{ color: 'rgba(226,232,240,0.25)' }}>/</span>
              <span style={{ color: 'var(--gold-3)', fontWeight: 600 }}>Awards & Honours</span>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(36px, 6vw, 80px)', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 2, background: 'var(--gold-3)', display: 'inline-block', borderRadius: 2 }} />
                Awards & Honours
              </p>

              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(38px, 6.5vw, 78px)',
                fontWeight: 800,
                color: '#F0F4F8',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                marginBottom: 20,
              }}>
                Academic{' '}
                <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 600, display: 'block' }}>Recognition</em>
              </h1>

              <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'rgba(226,232,240,0.68)', lineHeight: 1.78, maxWidth: 520, fontWeight: 300, marginBottom: 32 }}>
                Spanning 18 years — from the first university appointment in 2008 to the doctoral award in 2024 — a record of academic achievement, institutional leadership, and intellectual contribution.
              </p>

              {/* Inline stat row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(14px, 3vw, 36px)', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {heroStats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.07 }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1 }}>{s.n}</p>
                    <p style={{ fontSize: 11, color: 'rgba(226,232,240,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.l}</p>
                  </motion.div>
                ))}
              </div>

              <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: contentSource === 'supabase' ? 'rgba(26,107,72,0.18)' : 'rgba(184,135,10,0.2)', color: contentSource === 'supabase' ? '#8EE0B5' : '#F7D080', fontSize: 11, fontWeight: 700 }}>
                {contentSource === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
                {contentSource === 'supabase' ? 'Live' : 'Backup'}
              </div>
            </motion.div>

            {/* Right — pull quote */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Quote box */}
              <div style={{ padding: 'clamp(20px, 3vw, 32px)', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,135,10,0.25)', borderLeft: '4px solid var(--gold-3)' }}>
                <Quote size={20} style={{ color: 'var(--gold-3)', opacity: 0.5, marginBottom: 12 }} />
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(16px, 1.9vw, 21px)', fontStyle: 'italic', fontWeight: 400, color: '#E8EBF0', lineHeight: 1.55 }}>
                  {content.quote.text}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.45)', marginTop: 14 }}>— {content.quote.author}</p>
              </div>

              {/* Category pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {categories.map(cat => (
                  <span key={cat} style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11.5, fontWeight: 500, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(226,232,240,0.60)' }}>
                    {cat}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURED — PhD as marquee award
      ══════════════════════════════════ */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,135,10,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()} style={{ marginBottom: 'clamp(24px, 4vh, 40px)' }}>
            <p className="lbl" style={{ marginBottom: 0 }}>Pinnacle Achievement</p>
          </motion.div>

          <motion.div {...up(0.1)}>
            <div style={{
              borderRadius: 18,
              overflow: 'hidden',
              border: '1.5px solid rgba(184,135,10,0.30)',
              boxShadow: '0 20px 60px rgba(13,31,60,0.13), 0 4px 16px rgba(13,31,60,0.07)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}>
              {/* Left — dark panel */}
              <div style={{
                background: 'var(--navy)',
                padding: 'clamp(28px, 4vw, 52px)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--gold), var(--gold-3))' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(184,135,10,0.15)', border: '1px solid rgba(184,135,10,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={24} style={{ color: 'var(--gold-3)' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', display: 'block', marginBottom: 2 }}>Pinnacle Academic Honour</span>
                    <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.45)' }}>Awarded 2024</span>
                  </div>
                </div>

                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.18, marginBottom: 16, position: 'relative', zIndex: 1 }}>
                  Doctor of Philosophy<br />
                  <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 500 }}>Computer Engineering</em>
                </h2>

                <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.65)', lineHeight: 1.78, marginBottom: 24, fontWeight: 300, position: 'relative', zIndex: 1 }}>
                  {featuredAward?.description || ''}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, position: 'relative', zIndex: 1 }}>
                  {(featuredAward?.tags || []).map(t => (
                    <span key={t} style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(226,232,240,0.65)', fontWeight: 500 }}>{t}</span>
                  ))}
                </div>

                {(featuredAward?.assetUrl || featuredAward?.socialLink) && (
                  <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8, position: 'relative', zIndex: 1 }}>
                    {!!featuredAward?.assetUrl && (
                      <button
                        type="button"
                        onClick={() => openDoc(featuredAward.assetUrl || '', featuredAward.title)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.06)', color: '#E2E8F0', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                      >
                        <FileCheck size={13} /> View Asset
                      </button>
                    )}
                    {!!featuredAward?.socialLink && (
                      <a
                        href={featuredAward.socialLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(184,135,10,0.30)', background: 'rgba(184,135,10,0.12)', color: 'var(--gold-3)', fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}
                      >
                        <ExternalLink size={13} /> Social Link
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Right — details panel */}
              <div style={{ background: 'var(--off)', padding: 'clamp(28px, 4vw, 52px)', display: 'flex', flexDirection: 'column', gap: 0 }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>Award Details</p>

                {content.featured.details.map((r, i, a) => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: i < a.length - 1 ? '1px solid rgba(15,23,42,0.07)' : 'none' }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 600, minWidth: 88, flexShrink: 0, paddingTop: 1 }}>{r.k}</span>
                    <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 400, lineHeight: 1.5 }}>{r.v}</span>
                  </div>
                ))}

                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                    {content.featured.tags.map(t => (
                      <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>
                    ))}
                  </div>
                  <Link href="/research" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'var(--navy)', fontWeight: 600, textDecoration: 'none', borderBottom: '2px solid var(--gold)', paddingBottom: 2 }}>
                    View related research <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FILTER TABS
      ══════════════════════════════════ */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid var(--ink-line)',
        borderBottom: '1px solid var(--ink-line)',
        position: 'sticky', top: 'var(--nav-h)', zIndex: 100,
        boxShadow: '0 2px 12px rgba(13,31,60,0.05)',
      }}>
        <div className="W" style={{ padding: '0 clamp(18px, 5vw, 80px)', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {(['All', ...categories] as (AwardCategory | 'All')[]).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: '14px clamp(12px, 2vw, 18px)',
                background: 'transparent', border: 'none',
                borderBottom: activeCategory === cat ? '2.5px solid var(--gold)' : '2.5px solid transparent',
                color: activeCategory === cat ? 'var(--navy)' : 'var(--ink-4)',
                fontWeight: activeCategory === cat ? 700 : 400,
                fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: -1,
                transition: 'color 0.18s, border-color 0.18s',
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
              {cat}
              <span style={{
                fontSize: 10.5, fontWeight: 700, minWidth: 18, textAlign: 'center',
                padding: '1px 6px', borderRadius: 100,
                background: activeCategory === cat ? 'var(--gold-pale)' : 'var(--off)',
                border: `1px solid ${activeCategory === cat ? 'var(--gold-border)' : 'var(--ink-line)'}`,
                color: activeCategory === cat ? 'var(--gold)' : 'var(--ink-4)',
              }}>
                {catCount(cat, restAwards)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          AWARDS — Year-grouped timeline
      ══════════════════════════════════ */}
      <section style={{ background: 'var(--white)', padding: 'clamp(44px, 7vh, 72px) 0 clamp(60px, 10vh, 100px)' }}>
        <div className="W">
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              {sortedYears.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <Trophy size={32} style={{ color: 'var(--ink-4)', margin: '0 auto 14px', display: 'block' }} />
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--ink-3)' }}>No items in this category</p>
                </div>
              ) : sortedYears.map((year, yi) => (
                <div key={year} style={{ marginBottom: 'clamp(40px, 6vh, 64px)' }}>

                  {/* Year heading */}
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: yi * 0.04, duration: 0.55 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'clamp(18px, 3vh, 28px)' }}>
                    <div style={{ flexShrink: 0, padding: '6px 16px', borderRadius: 8, background: 'var(--navy)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Calendar size={13} style={{ color: 'var(--gold-3)' }} />
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#F0F4F8', lineHeight: 1 }}>{year}</span>
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--ink-line), transparent)' }} />
                    <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 500, flexShrink: 0 }}>{filteredByYear[year].length} item{filteredByYear[year].length > 1 ? 's' : ''}</span>
                  </motion.div>

                  {/* Two-column grid */}
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(270px, 46%, 520px), 1fr))', gap: 'clamp(12px, 2vw, 18px)' }}>
                    {filteredByYear[year].map((award) => {
                      const catStyle = CATEGORY_COLORS[award.category]
                      const isExpanded = expanded === award.id
                      return (
                        <motion.div key={award.id} variants={SI}>
                          <div style={{
                            background: '#fff',
                            border: '1px solid var(--ink-line)',
                            borderRadius: 13,
                            overflow: 'hidden',
                            boxShadow: isExpanded ? 'var(--sh2)' : 'var(--sh1)',
                            borderColor: isExpanded ? `${award.color}45` : 'var(--ink-line)',
                            transition: 'border-color 0.22s, box-shadow 0.22s',
                          }}>
                            {/* Color bar */}
                            <div style={{ height: 3, background: `linear-gradient(90deg, ${award.color}, var(--gold-3))` }} />

                            {/* Card header — always visible */}
                            <button
                              onClick={() => setExpanded(isExpanded ? null : award.id)}
                              style={{
                                width: '100%', display: 'flex', gap: 14, alignItems: 'flex-start',
                                padding: 'clamp(16px, 2.5vw, 22px)',
                                background: 'transparent', border: 'none',
                                cursor: 'pointer', textAlign: 'left',
                                fontFamily: 'DM Sans, sans-serif',
                              }}
                            >
                              {/* Icon */}
                              <div style={{
                                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                                background: `${award.color}10`,
                                border: `1px solid ${award.color}25`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <award.icon size={19} style={{ color: award.color }} />
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Category badge */}
                                <span style={{
                                  display: 'inline-block', marginBottom: 7,
                                  fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                                  padding: '2px 9px', borderRadius: 4,
                                  background: catStyle.bg, border: `1px solid ${catStyle.border}`,
                                  color: catStyle.text,
                                }}>
                                  {award.category}
                                </span>

                                <h3 style={{
                                  fontFamily: 'Playfair Display, serif',
                                  fontSize: 'clamp(14.5px, 1.4vw, 17px)',
                                  fontWeight: 600, color: 'var(--navy)',
                                  lineHeight: 1.32, marginBottom: 6,
                                }}>
                                  {award.title}
                                </h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <Building2 size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                  <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.3 }}>{award.body}</p>
                                </div>
                              </div>

                              {/* Expand indicator */}
                              <motion.div
                                animate={{ rotate: isExpanded ? 45 : 0 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                  width: 24, height: 24, borderRadius: 6,
                                  background: isExpanded ? 'var(--navy-pale)' : 'var(--off)',
                                  border: '1px solid var(--ink-line)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0, color: isExpanded ? 'var(--navy)' : 'var(--ink-4)',
                                  fontSize: 14, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
                                }}
                              >
                                +
                              </motion.div>
                            </button>

                            {/* Expandable detail */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <div style={{
                                    padding: '0 clamp(16px, 2.5vw, 22px) clamp(18px, 3vw, 26px)',
                                    paddingLeft: 'calc(clamp(16px, 2.5vw, 22px) + 42px + 14px)',
                                  }}>
                                    <div style={{ height: 1, background: 'var(--ink-line)', marginBottom: 16 }} />
                                    <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.78, marginBottom: 14, fontWeight: 300 }}>
                                      {award.description}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                      {award.tags.map(t => (
                                        <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>
                                      ))}
                                    </div>

                                    {(award.assetUrl || award.socialLink) && (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                        {!!award.assetUrl && (
                                          <button
                                            type="button"
                                            onClick={() => openDoc(award.assetUrl || '', award.title)}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--navy-glow)', background: 'var(--navy-pale)', color: 'var(--navy)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                                          >
                                            <FileCheck size={13} /> View Asset
                                          </button>
                                        )}
                                        {!!award.socialLink && (
                                          <a
                                            href={award.socialLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: '1.5px solid rgba(45,91,138,0.26)', background: 'rgba(45,91,138,0.08)', color: '#2D5B8A', fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}
                                          >
                                            <ExternalLink size={13} /> Social Link
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
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════
          COMPACT TIMELINE STRIP
      ══════════════════════════════════ */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(44px, 7vh, 72px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold-3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(184,135,10,0.07) 0%, transparent 55%)', pointerEvents: 'none' }} />

        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()} style={{ marginBottom: 'clamp(24px, 4vh, 40px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 20, height: 2, background: 'var(--gold-3)', display: 'inline-block', borderRadius: 2 }} />
                Full Timeline
              </p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.1 }}>
                Every Achievement, <em style={{ color: 'var(--gold-3)', fontStyle: 'italic' }}>Chronologically</em>
              </h2>
            </div>
          </motion.div>

          {/* Horizontal scrollable timeline on mobile, grid on desktop */}
          <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
            <div style={{
              display: 'flex',
              gap: 0,
              minWidth: 'fit-content',
              position: 'relative',
            }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 1, background: 'rgba(184,135,10,0.25)' }} />

              {years.slice().reverse().map((year, i) => {
                const yearAwards = awards.filter(a => a.year === year)
                return (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 clamp(12px, 2vw, 20px)', flex: '0 0 auto' }}
                  >
                    {/* Dot */}
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: yearAwards.some(a => a.featured)
                        ? 'linear-gradient(135deg, var(--gold), var(--gold-3))'
                        : 'rgba(255,255,255,0.08)',
                      border: yearAwards.some(a => a.featured)
                        ? '2px solid rgba(212,168,32,0.5)'
                        : '1px solid rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 12, zIndex: 1, position: 'relative',
                      boxShadow: yearAwards.some(a => a.featured) ? '0 0 20px rgba(184,135,10,0.4)' : 'none',
                    }}>
                      {yearAwards.some(a => a.featured)
                        ? <Star size={16} style={{ color: 'var(--navy)' }} fill="var(--navy)" />
                        : <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(226,232,240,0.60)' }}>{yearAwards.length}</span>
                      }
                    </div>

                    {/* Year label */}
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: yearAwards.some(a => a.featured) ? 'var(--gold-3)' : '#E2E8F0', lineHeight: 1, marginBottom: 10 }}>
                      {year}
                    </p>

                    {/* Event pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', maxWidth: 160 }}>
                      {yearAwards.slice(0, 2).map(a => (
                        <span key={a.id} style={{
                          fontSize: 10.5, padding: '3px 10px', borderRadius: 100, textAlign: 'center',
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                          color: 'rgba(226,232,240,0.60)',
                          whiteSpace: 'nowrap', maxWidth: 148, overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {a.title.split('—')[0].split(':')[0].trim().slice(0, 28)}{a.title.length > 28 ? '…' : ''}
                        </span>
                      ))}
                      {yearAwards.length > 2 && (
                        <span style={{ fontSize: 10, color: 'rgba(226,232,240,0.35)' }}>+{yearAwards.length - 2} more</span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA
      ══════════════════════════════════ */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0', borderTop: '1px solid var(--ink-line)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(80px, 16vw, 200px)', color: 'var(--navy-pale)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>{years.length}</div>

        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
            <Award size={26} style={{ color: 'var(--gold)', margin: '0 auto 14px', display: 'block' }} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1, marginBottom: 14, maxWidth: 600, margin: '0 auto 14px' }}>
              Explore All Academic Work &{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Research</em>
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 480, margin: '0 auto 30px', lineHeight: 1.75, fontWeight: 300 }}>
              The awards reflect the research. Dive into published papers, patents, and the teaching legacy behind these achievements.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <Link href="/research" className="btn-navy" style={{ padding: '12px 24px', fontSize: 14 }}>Research Papers <ArrowRight size={14} /></Link>
              <Link href="/research/patents" className="btn-out" style={{ padding: '12px 24px', fontSize: 14 }}>Patents & IP</Link>
              <Link href="/achievements/certificates" className="btn-out" style={{ padding: '12px 24px', fontSize: 14 }}>Certificates</Link>
              <Link href="/contact" className="btn-out" style={{ padding: '12px 24px', fontSize: 14 }}>Contact</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {doc && (
        <div onClick={closeDoc}
          style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(5,10,20,0.84)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px,3vw,36px)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--white)', borderRadius: 14, overflow: 'hidden', width: '100%', maxWidth: 860, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.55)' }}
          >
            <div style={{ padding: '14px 20px', background: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <p style={{ flex: 1, fontFamily: 'Playfair Display,serif', fontSize: 'clamp(13px,1.4vw,16px)', fontWeight: 600, color: '#F0F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</p>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <a href={doc.file} download target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                  style={{ width: 32, height: 32, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(184,135,10,0.15)', border: '1px solid rgba(184,135,10,0.30)', color: 'var(--gold-3)', textDecoration: 'none' }}>
                  <Download size={13} />
                </a>
                <button onClick={closeDoc}
                  style={{ width: 32, height: 32, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#E2E8F0', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', background: '#080D18', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360, position: 'relative' }}>
              {!loaded && (
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: 'var(--gold-3)', animation: 'spin 0.7s linear infinite' }} />
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Loading...</p>
                </div>
              )}
              {/\.(jpg|jpeg|png|webp)$/i.test(doc.file) ? (
                <img src={doc.file} alt={doc.title} onLoad={() => setLoaded(true)}
                  style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', display: loaded ? 'block' : 'none', padding: 20 }} />
              ) : (
                <iframe src={`${doc.file}#toolbar=1`} onLoad={() => setLoaded(true)}
                  style={{ width: '100%', minHeight: 500, border: 'none', display: loaded ? 'block' : 'none' }} title={doc.title} />
              )}
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .W { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </>
  )
}