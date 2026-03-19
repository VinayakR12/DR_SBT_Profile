'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink, BookOpen, Cpu, Leaf,
  Globe, Shield, GraduationCap, FlaskConical,
  ArrowRight, Search, Filter, Calendar,
  Users, Award,
} from 'lucide-react'

// ── Animation helpers ─────────────────────────────────────
const up = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as any },
})

// ── All Publications — latest first ──────────────────────
type Paper = {
  id: number
  year: number
  month: string
  type: 'Journal' | 'Conference' | 'Review'
  title: string
  authors: string
  venue: string
  volume?: string
  issn?: string
  doi?: string
  pages?: string
  tags: string[]
  url: string          // link to published source
  color: string
  icon: any
}

const PAPERS: Paper[] = [
  {
    id: 1,
    year: 2024,
    month: 'Oct',
    type: 'Journal',
    title: 'Smart Farming with YOLO: Predicting the Density of Weeds and Crops for Precision Agriculture',
    authors: 'Sachin Balawant Takmare, Mukesh Shrimali, Rahul Ambekar, Sadanand Shelgaonkar, Shivshankar Kore, Ganesh Gourshete',
    venue: 'International Journal of Environmental & Agriculture Research (IJOEAR)',
    volume: 'Volume 6, Issue 10, 2024',
    issn: 'ISSN: 2454-1850',
    pages: 'pp. 14–25',
    tags: ['YOLO', 'Precision Agriculture', 'Weed Detection', 'Deep Learning'],
    url: 'https://ijoear.com',
    color: '#1A6B48',
    icon: Leaf,
  },
  {
    id: 2,
    year: 2024,
    month: 'Aug',
    type: 'Journal',
    title: 'Transforming Farming with CNNs: Accurate Crop and Weed Classification',
    authors: 'Sachin Balawant Takmare, Mukesh Shrimali, Rahul K. Ambekar, Sagar B. Patil, Pramod A. Kharade, Kuldeep Vayadande',
    venue: 'International Journal of Intelligent Systems and Applications in Engineering (IJISAE)',
    volume: 'Volume 12, Issue 4, 2024',
    issn: 'ISSN: 2147-6799',
    pages: 'pp. 1484–1490',
    tags: ['CNN', 'Crop Classification', 'Weed Classification', 'Precision Farming'],
    url: 'https://ijisae.org',
    color: '#0D1F3C',
    icon: Leaf,
  },
  {
    id: 3,
    year: 2024,
    month: 'Aug',
    type: 'Journal',
    title: 'A Deep Learning Approach to Efficient Crop and Weed Classification for Precision Farming',
    authors: 'Sachin Balawant Takmare et al.',
    venue: 'International Journal of Computer Sciences and Engineering (IJCSE)',
    volume: 'Volume 12, Issue 6, 2024',
    issn: 'E-ISSN: 2347-2693',
    pages: 'pp. 30–43',
    tags: ['Deep Learning', 'CNN', 'Crop & Weed', 'Precision Farming'],
    url: 'https://www.ijcseonline.org',
    color: '#1A3560',
    icon: Cpu,
  },
  {
    id: 4,
    year: 2024,
    month: 'Aug',
    type: 'Journal',
    title: 'Plant Species and Weed Classification for Precision Agriculture Using CNN',
    authors: 'Sachin Balawant Takmare et al.',
    venue: 'International Journal of Research and Analytical Reviews (IJRAR)',
    volume: 'Volume 11, Issue 2, 2024',
    issn: 'E-ISSN: 2348-1269 | P-ISSN: 2349-5138',
    pages: 'pp. 239–248',
    tags: ['CNN', 'Plant Species', 'Weed Classification', 'Agriculture'],
    url: 'https://ijrar.org',
    color: '#2D5B8A',
    icon: Leaf,
  },
  {
    id: 5,
    year: 2024,
    month: 'Aug',
    type: 'Journal',
    title: 'Finite Automata Application in String Identification',
    authors: 'Sachin Balawant Takmare et al.',
    venue: 'The Indian Journal of Technical Education — Published by Indian Society for Technical Education',
    volume: 'Volume 47, Special Issue No. 1, August 2024',
    issn: 'ISSN: 0971-3034',
    tags: ['Finite Automata', 'String Theory', 'Formal Languages', 'Theory of Computation'],
    url: 'https://iste.org.in',
    color: '#5C3A1A',
    icon: BookOpen,
  },
  {
    id: 6,
    year: 2024,
    month: 'Aug',
    type: 'Journal',
    title: 'Machine Learning Models in Precision Agriculture',
    authors: 'Sachin Balawant Takmare et al.',
    venue: 'Indian Journal of Technical Education — Published by Indian Society for Technical Education',
    volume: 'Volume 47, Special Issue No. 1, August 2024',
    issn: 'ISSN: 0971-3034',
    tags: ['Machine Learning', 'Precision Agriculture', 'Smart Farming'],
    url: 'https://iste.org.in',
    color: '#1A6B48',
    icon: FlaskConical,
  },
  {
    id: 7,
    year: 2024,
    month: 'Mar',
    type: 'Conference',
    title: 'MetaCampus: Advancing Online Education with Virtual Classroom',
    authors: 'Sachin Balawant Takmare et al.',
    venue: 'IEEE — 3rd International Conference for Innovation in Technology (INOCON 2024)',
    volume: '2024',
    issn: '979-8-3503-8193-1/24',
    tags: ['Virtual Reality', 'Online Education', 'Metaverse', 'IEEE'],
    url: 'https://ieeexplore.ieee.org',
    color: '#0D1F3C',
    icon: Globe,
  },
  {
    id: 8,
    year: 2023,
    month: 'Jul',
    type: 'Conference',
    title: 'Dodging Turtis — NFT Gaming on Blockchain',
    authors: 'Sachin Balawant Takmare et al.',
    venue: 'IEEE — World Conference on Communication & Computing (WCONF 2023)',
    volume: '2023',
    issn: '979-8-3503-1120-4/23',
    tags: ['NFT', 'Blockchain', 'Gaming', 'IEEE', 'Web3'],
    url: 'https://ieeexplore.ieee.org',
    color: '#3A2A6A',
    icon: Cpu,
  },
  {
    id: 9,
    year: 2022,
    month: 'Apr',
    type: 'Journal',
    title: 'Network Monitoring and System Diagnostic Suite',
    authors: 'Parth Vora, Harvinder Singh, Royston Rodrigues, Lavleen Jain, Prof. Sachin Takmare (Project Guide)',
    venue: 'International Journal for Research in Applied Science & Engineering Technology (IJRASET)',
    volume: 'Volume 10, Issue IV, April 2022',
    issn: 'ISSN: 2321-9653 | SJ Impact Factor: 7.538',
    tags: ['Network Monitoring', 'System Diagnostics', 'Computer Networks'],
    url: 'https://www.ijraset.com',
    color: '#2D5B8A',
    icon: Globe,
  },
  {
    id: 10,
    year: 2022,
    month: '',
    type: 'Journal',
    title: 'Sickle Cell Anemia Diagnosis Using Microscopic Images',
    authors: 'Sachin Balawant Takmare et al.',
    venue: 'Neuroquantology',
    volume: 'Volume 20, Issue 17',
    issn: 'E-ISSN: 1303-5150',
    tags: ['Medical Imaging', 'Deep Learning', 'Sickle Cell Anemia', 'Diagnosis'],
    url: 'https://www.neuroquantology.com',
    color: '#7A1A1A',
    icon: FlaskConical,
  },
  {
    id: 11,
    year: 2017,
    month: 'Jun',
    type: 'Journal',
    title: 'Dynamic Analysis of Web System by Using Model-Based Testing and Process Crawler Model',
    authors: 'Nayan Mulla, Sachin B. Takmare, Pramod A. Kharade',
    venue: 'International Journal of Engineering and Computer Science (IJECS)',
    volume: 'Volume 6, Issue 6, June 2017',
    issn: 'ISSN: 2319-7242',
    doi: 'DOI: 10.18535/ijecs/v6i6.47',
    pages: 'pp. 21833–21837',
    tags: ['Web Testing', 'Model-Based Testing', 'Process Crawler', 'Dynamic Analysis'],
    url: 'https://ijecs.in',
    color: '#1A3560',
    icon: Globe,
  },
  {
    id: 12,
    year: 2017,
    month: 'Jun',
    type: 'Review',
    title: 'A Review — Dynamic Analysis of Web System by Using Model-Based Testing and Process Crawler Model',
    authors: 'Nayan Mulla, Sachin B. Takmare, Pramod A. Kharade',
    venue: 'International Journal of Engineering Research & Technology (IJERT)',
    volume: 'Volume 6, Issue 6, June 2017',
    issn: 'ISSN: 2278-0181',
    tags: ['Web Systems', 'Model-Based Testing', 'Software Engineering', 'Review'],
    url: 'https://www.ijert.org',
    color: '#0D1F3C',
    icon: BookOpen,
  },
  {
    id: 13,
    year: 2017,
    month: 'Feb',
    type: 'Review',
    title: 'Review of Existing Methods in K-means Clustering Algorithm',
    authors: 'Kavita Shiudkar, Sachin Takmare',
    venue: 'International Research Journal of Engineering and Technology (IRJET)',
    volume: 'Volume 4, Issue 2, February 2017',
    issn: 'e-ISSN: 2395-0056 | p-ISSN: 2395-0072',
    tags: ['K-means Clustering', 'Machine Learning', 'Clustering Algorithms', 'Review'],
    url: 'https://www.irjet.net',
    color: '#2D5B8A',
    icon: Cpu,
  },
  {
    id: 14,
    year: 2012,
    month: 'Nov',
    type: 'Journal',
    title: 'Voice Based Watermarking Technique for Relational Databases',
    authors: 'Sachin Balawant Takmare, Ravindra Kumar Gupta, Gajendra Singh Chandel',
    venue: 'International Journal of Scientific & Technology Research',
    volume: 'Volume 1, Issue 10, November 2012',
    issn: 'ISSN: 2277-8616',
    tags: ['Database Watermarking', 'Voice Watermark', 'Data Security', 'Relational Database'],
    url: 'https://www.ijstr.org',
    color: '#5C3A1A',
    icon: Shield,
  },
]

const TYPES = ['All', 'Journal', 'Conference', 'Review'] as const
type FilterType = typeof TYPES[number]

// ═══════════════════════════════════════════════════════════
export default function ResearchPage() {
  const [filter, setFilter] = useState<FilterType>('All')
  const [search, setSearch] = useState('')

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

  // Group by year
  const byYear: Record<number, Paper[]> = {}
  filtered.forEach(p => {
    if (!byYear[p.year]) byYear[p.year] = []
    byYear[p.year].push(p)
  })
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  const counts = {
    journal: PAPERS.filter(p => p.type === 'Journal').length,
    conference: PAPERS.filter(p => p.type === 'Conference').length,
    review: PAPERS.filter(p => p.type === 'Review').length,
  }

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
        Over 18 years of research spanning Artificial Intelligence, Machine
        Learning, Precision Agriculture, Computer Vision, and Software
        Engineering. Published in IEEE, Scopus-indexed, and UGC-approved journals worldwide.
      </p>

      {/* CENTERED STATS */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 40px)',
        }}
      >
        {[
          { n: PAPERS.length, l: 'Total Publications' },
          { n: counts.journal, l: 'Journal Papers' },
          { n: counts.conference, l: 'Conference Papers' },
          { n: counts.review, l: 'Review Articles' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
            style={{
              textAlign: 'center',
              padding: '0 16px',
              borderRight:
                i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none',
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
              {s.n}
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
              {s.l}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
</section>      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--ink-line)', position: 'sticky', top: 'var(--nav-h)', zIndex: 100, boxShadow: '0 2px 12px rgba(13,31,60,0.05)' }}>
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
                onMouseEnter={e => { if (filter !== t) { const el = e.currentTarget; el.style.borderColor = 'var(--navy)'; el.style.color = 'var(--navy)' }}}
                onMouseLeave={e => { if (filter !== t) { const el = e.currentTarget; el.style.borderColor = 'var(--ink-line)'; el.style.color = 'var(--ink-3)' }}}>
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

      {/* ── PAPERS LIST — grouped by year ── */}
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
                    Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis
                  </h2>

                  <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.65)', lineHeight: 1.78, marginBottom: 20, fontWeight: 300 }}>
                    Doctoral thesis submitted to Pacific University, Udaipur (2024). Developed a Convolutional Neural Network system that automates crop-weed classification from field imagery and employs YOLO-based density estimation for precision herbicide deployment — reducing chemical overuse and improving agricultural sustainability.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['CNN', 'YOLO', 'Precision Agriculture', 'Deep Learning', 'Computer Vision', 'PhD Research'].map(t => (
                      <span key={t} style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10.5, fontWeight: 500, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(226,232,240,0.70)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right key details */}
              <div style={{ padding: 'clamp(28px, 4vw, 48px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 18 }}>Thesis Details</p>
                {[
                  { k: 'University',  v: 'Pacific University, Udaipur' },
                  { k: 'Awarded',     v: '2024' },
                  { k: 'Domain',      v: 'AI · Machine Learning · Precision Agriculture' },
                  { k: 'Method',      v: 'Convolutional Neural Networks (CNN)' },
                  { k: 'Detection',   v: 'YOLO-based density estimation' },
                  { k: 'Patent',      v: 'Application No: 202421045939 (Published)' },
                  { k: 'Copyright',   v: 'Diary No: 14704/2024-CO/SW' },
                ].map((r, i, a) => (
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
            <Award size={28} style={{ color: 'var(--gold)', margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.12, maxWidth: 640, margin: '0 auto 16px' }}>
              Interested in <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Collaboration</em> or Citation?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.78, maxWidth: 520, margin: '0 auto 36px', fontWeight: 300 }}>
              For research collaborations, paper citations, co-authorship opportunities, or academic partnerships — reach out directly.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <Link href="/contact" className="btn-navy" style={{ padding: '12px 26px', fontSize: 14 }}>
                Collaborate on Research <ArrowRight size={14} />
              </Link>
              <Link href="/patents" className="btn-out" style={{ padding: '12px 26px', fontSize: 14 }}>
                View Patents <ArrowRight size={14} />
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