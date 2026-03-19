'use client'

// app/achievements/awards/page.tsx
// Awards & Honours page for Dr. Sachin Takmare
//
// Design: Editorial broadsheet layout — NOT a typical card grid.
// Hero: full-width navy with large typographic number.
// Main section: asymmetric two-column with a "featured award" large card
// and a scrollable timeline rail.
// Bottom: recognition wall — horizontal scroll on mobile, masonry on desktop.

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, GraduationCap, Building2, Star,
  Shield, BookOpen, Users, Briefcase,
  CheckCircle2, ArrowRight, Calendar,
  Quote, Trophy, Layers, School,
  FlaskConical, Target, Globe,
} from 'lucide-react'

// ── Animation ─────────────────────────────────────────────
const up = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
})
const fromLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
})
const fromRight = (delay = 0) => ({
  initial: { opacity: 0, x: 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
})
const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }
const SI = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as any } },
}

// ── Data ─────────────────────────────────────────────────

type AwardCategory = 'Academic' | 'Research' | 'Institutional' | 'Intellectual Property' | 'Professional'

interface AwardItem {
  id: string
  category: AwardCategory
  year: string
  title: string
  body: string           // issuing body
  description: string
  icon: any
  color: string
  featured?: boolean
  tags: string[]
}

const AWARDS: AwardItem[] = [
  {
    id: 'phd',
    category: 'Academic',
    year: '2024',
    title: 'Doctor of Philosophy (Ph.D.)',
    body: 'Pacific University, Udaipur',
    description: 'Doctoral degree awarded for the thesis "Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis". The research developed a deep learning pipeline automating crop-weed identification from field imagery, resulting in 2 international publications and a filed utility patent.',
    icon: GraduationCap,
    color: '#0D1F3C',
    featured: true,
    tags: ['Doctorate', 'AI Research', 'Precision Agriculture', 'CNN'],
  },
  {
    id: 'patent-1',
    category: 'Intellectual Property',
    year: '2024',
    title: 'Utility Patent — AI Crop & Weed Management System',
    body: 'Indian Patent Office, Mumbai',
    description: 'Utility patent filed and published for an AI-driven precision farming system that classifies crops and weeds using CNNs and estimates plant density using YOLO, enabling targeted pesticide deployment. Patent Application No: 202421045939. Docket No: 56637.',
    icon: Shield,
    color: '#B8870A',
    featured: false,
    tags: ['Patent', 'AI', 'Precision Farming', 'YOLO'],
  },
  {
    id: 'patent-2',
    category: 'Intellectual Property',
    year: '2024',
    title: 'Utility Patent — Intelligent Malware Evasion Prevention',
    body: 'Indian Patent Office',
    description: 'Utility patent for an intelligent system detecting and preventing metamorphic malware using behavioural machine learning analysis. Patent Application No: 202421069724. Published October 2024.',
    icon: Shield,
    color: '#2D5B8A',
    featured: false,
    tags: ['Patent', 'Cybersecurity', 'Machine Learning'],
  },
  {
    id: 'copyright-1',
    category: 'Intellectual Property',
    year: '2024',
    title: 'Registered Copyright — Plant Species & Weed CNN Software',
    body: 'Copyright Office, Government of India',
    description: 'Software copyright for the CNN-based plant species and weed classification application developed as part of the precision agriculture research. Diary No: 14704/2024-CO/SW. Registered 7 May 2024.',
    icon: BookOpen,
    color: '#1A6B48',
    featured: false,
    tags: ['Copyright', 'Software', 'CNN', 'Agriculture'],
  },
  {
    id: 'copyright-2',
    category: 'Intellectual Property',
    year: '2024',
    title: 'Registered Copyright — VR Online Education Software',
    body: 'Copyright Office, Government of India',
    description: 'Software copyright for the Virtual Reality solution for interactive and engaging online education. Diary No: 25004/2024-CO/SW. Registered 27 December 2024.',
    icon: Globe,
    color: '#5C3A8A',
    featured: false,
    tags: ['Copyright', 'VR', 'EdTech', 'Software'],
  },
  {
    id: 'pg-teacher',
    category: 'Academic',
    year: '2014',
    title: 'PG Recognized Teacher',
    body: 'Shivaji University, Kolhapur',
    description: 'Officially recognized as a Post-Graduate teacher by Shivaji University Kolhapur, authorizing supervision of M.E. (Master of Engineering) research dissertations. A distinction awarded to faculty who demonstrate research expertise and pedagogical excellence.',
    icon: Award,
    color: '#B8870A',
    featured: false,
    tags: ['University Recognition', 'PG Teaching', 'Research Supervision'],
  },
  {
    id: 'cap-director',
    category: 'Professional',
    year: '2014',
    title: 'Appointed Assistant CAP Director',
    body: 'Shivaji University, Kolhapur',
    description: 'Appointed by Shivaji University Kolhapur as Assistant CAP (Centralised Admission Process) Director, responsible for coordinating merit-based admissions for M.E. programmes across affiliated institutions.',
    icon: Briefcase,
    color: '#1A3560',
    featured: false,
    tags: ['Appointment', 'Shivaji University', 'Admission Process'],
  },
  {
    id: 'me-examiner',
    category: 'Professional',
    year: '2014',
    title: 'External Evaluator — M.E. Dissertations',
    body: 'Shivaji University, Kolhapur',
    description: 'Appointed as External Evaluator and Examiner for M.E. (Master of Engineering) dissertation assessment under Shivaji University Kolhapur — evaluating research quality, methodology, innovation, and academic presentation.',
    icon: School,
    color: '#2D5B8A',
    featured: false,
    tags: ['External Examiner', 'M.E. Evaluation', 'Research Assessment'],
  },
  {
    id: 'nba',
    category: 'Institutional',
    year: '2023',
    title: 'NBA Criteria-3 Coordinator',
    body: 'A. P. Shah Institute of Technology, Thane',
    description: 'Led the NBA (National Board of Accreditation) Criteria-3 accreditation process — covering Research, Consultancy & Extension activities. Responsible for documentation, faculty research tracking, and student outcome mapping.',
    icon: Target,
    color: '#1A6B48',
    featured: false,
    tags: ['NBA', 'Accreditation', 'Institutional Leadership'],
  },
  {
    id: 'pbl',
    category: 'Institutional',
    year: '2017',
    title: 'PBL In-charge — Project-Based Learning',
    body: 'A. P. Shah Institute of Technology, Thane',
    description: 'Designed and led the Project-Based Learning (PBL) framework across all undergraduate semesters. Created evaluation rubrics, faculty training materials, and implemented industry-connected project themes.',
    icon: Layers,
    color: '#7A5500',
    featured: false,
    tags: ['PBL', 'Pedagogy Innovation', 'Curriculum Design'],
  },
  {
    id: 'iii-cell',
    category: 'Institutional',
    year: '2017',
    title: 'III Cell In-charge — Innovation & Incubation',
    body: 'A. P. Shah Institute of Technology, Thane',
    description: 'Headed the Innovation, Incubation & Ideation (III) Cell — mentoring student entrepreneurs, organising idea competitions, and connecting promising projects with industry incubators.',
    icon: FlaskConical,
    color: '#5C3A1A',
    featured: false,
    tags: ['Innovation', 'Incubation', 'Student Entrepreneurship'],
  },
  {
    id: 'hod',
    category: 'Institutional',
    year: '2013',
    title: 'Head of Department — CSE',
    body: "Bharati Vidyapeeth's College of Engineering, Kolhapur",
    description: "Served as Head of the Computer Science & Engineering Department from 2013–2017. Oversaw faculty management, curriculum design, timetabling, departmental budgeting, and student welfare across 4 batches.",
    icon: Building2,
    color: '#0D1F3C',
    featured: false,
    tags: ['Leadership', 'HOD', 'Department Management'],
  },
  {
    id: 'uom-approval-1',
    category: 'Professional',
    year: '2008',
    title: 'Appointed Lecturer — University of Mumbai',
    body: 'University of Mumbai',
    description: 'Appointment approved by the University of Mumbai as Lecturer in Computer Engineering Department. Official letter: CONCOL/SA/4532, dated 11 November 2008. First official university appointment.',
    icon: Award,
    color: '#1A3560',
    featured: false,
    tags: ['University of Mumbai', 'Official Appointment', 'First Approval'],
  },
  {
    id: 'nexus',
    category: 'Professional',
    year: '2010',
    title: 'Technical Coordinator — "NEXUS" National Event',
    body: 'Parshavanath College of Engineering, Thane',
    description: 'Organised and technically coordinated "NEXUS" — a National Level Technical Event — managing event planning, participant coordination, faculty involvement, and technical competitions across Computer Engineering domains.',
    icon: Trophy,
    color: '#2D5B8A',
    featured: false,
    tags: ['Event Management', 'National Level', 'Technical Coordination'],
  },
  {
    id: 'uom-approval-2',
    category: 'Professional',
    year: '2018',
    title: 'Re-Appointed Assistant Professor — University of Mumbai',
    body: 'University of Mumbai',
    description: 'Re-approved as Assistant Professor in Computer Engineering by the University of Mumbai. Letter: TAAS(CT)/ICD/2017-18/11257, dated 18 April 2018, following appointment at A. P. Shah Institute of Technology.',
    icon: Award,
    color: '#0D1F3C',
    featured: false,
    tags: ['University of Mumbai', 'Assistant Professor', 'Reappointment'],
  },
]

const CATEGORY_COLORS: Record<AwardCategory, { bg: string; border: string; text: string; dot: string }> = {
  'Academic':               { bg: 'rgba(13,31,60,0.08)',    border: 'rgba(13,31,60,0.18)',    text: '#0D1F3C',  dot: '#0D1F3C' },
  'Research':               { bg: 'rgba(26,107,72,0.08)',   border: 'rgba(26,107,72,0.22)',   text: '#1A5038',  dot: '#1A6B48' },
  'Institutional':          { bg: 'rgba(122,85,0,0.08)',    border: 'rgba(122,85,0,0.20)',    text: '#7A5500',  dot: '#B8870A' },
  'Intellectual Property':  { bg: 'rgba(184,135,10,0.09)',  border: 'rgba(184,135,10,0.24)', text: '#7A5500',  dot: '#B8870A' },
  'Professional':           { bg: 'rgba(45,91,138,0.08)',   border: 'rgba(45,91,138,0.20)',  text: '#1A3560',  dot: '#2D5B8A' },
}

const CATEGORIES: AwardCategory[] = ['Academic', 'Intellectual Property', 'Institutional', 'Professional', 'Research']

const featured = AWARDS.find(a => a.featured)!
const rest = AWARDS.filter(a => !a.featured)

// Years for timeline
const YEARS = [...new Set(AWARDS.map(a => a.year))].sort((a, b) => Number(b) - Number(a))

// ═════════════════════════════════════════════════════════
export default function AwardsPage() {
  const [activeCategory, setActiveCategory] = useState<AwardCategory | 'All'>('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = activeCategory === 'All'
    ? rest
    : rest.filter(a => a.category === activeCategory)

  const filteredByYear: Record<string, AwardItem[]> = {}
  filtered.forEach(a => {
    if (!filteredByYear[a.year]) filteredByYear[a.year] = []
    filteredByYear[a.year].push(a)
  })
  const sortedYears = Object.keys(filteredByYear).sort((a, b) => Number(b) - Number(a))

  const catCount = (cat: AwardCategory | 'All') =>
    cat === 'All' ? rest.length : rest.filter(a => a.category === cat).length

  return (
    <>
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
          {AWARDS.length}
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
                {[
                  { n: String(AWARDS.length), l: 'Total Honours' },
                  { n: '02', l: 'Patents Filed' },
                  { n: '02', l: 'Copyrights' },
                  { n: '17', l: 'Years of Record' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.07 }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1 }}>{s.n}</p>
                    <p style={{ fontSize: 11, color: 'rgba(226,232,240,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.l}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — pull quote */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Quote box */}
              <div style={{ padding: 'clamp(20px, 3vw, 32px)', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,135,10,0.25)', borderLeft: '4px solid var(--gold-3)' }}>
                <Quote size={20} style={{ color: 'var(--gold-3)', opacity: 0.5, marginBottom: 12 }} />
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(16px, 1.9vw, 21px)', fontStyle: 'italic', fontWeight: 400, color: '#E8EBF0', lineHeight: 1.55 }}>
                  "Every recognition is a reflection of the students, colleagues, and institutions that made the work possible."
                </p>
                <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.45)', marginTop: 14 }}>— Dr. Sachin B. Takmare</p>
              </div>

              {/* Category pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {CATEGORIES.map(cat => (
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
        {/* Subtle background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,135,10,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()} style={{ marginBottom: 'clamp(24px, 4vh, 40px)' }}>
            <p className="lbl" style={{ marginBottom: 0 }}>Pinnacle Achievement</p>
          </motion.div>

          {/* Featured card — full width asymmetric */}
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

                {/* Icon + category */}
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
                  {featured.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, position: 'relative', zIndex: 1 }}>
                  {featured.tags.map(t => (
                    <span key={t} style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(226,232,240,0.65)', fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Right — details panel */}
              <div style={{ background: 'var(--off)', padding: 'clamp(28px, 4vw, 52px)', display: 'flex', flexDirection: 'column', gap: 0 }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>Award Details</p>

                {[
                  { k: 'Degree',      v: 'Doctor of Philosophy (Ph.D.)' },
                  { k: 'Institution', v: 'Pacific University, Udaipur, Rajasthan' },
                  { k: 'Year',        v: '2024 — Awarded' },
                  { k: 'Thesis',      v: 'Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis' },
                  { k: 'Method',      v: 'Convolutional Neural Networks + YOLO' },
                  { k: 'Outcome',     v: '2 Int\'l Publications · 1 Utility Patent Filed' },
                  { k: 'Prior Quals', v: 'M.Tech (70%) · B.E. (69.36%) · HSC (69.67%)' },
                ].map((r, i, a) => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: i < a.length - 1 ? '1px solid rgba(15,23,42,0.07)' : 'none' }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 600, minWidth: 88, flexShrink: 0, paddingTop: 1 }}>{r.k}</span>
                    <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 400, lineHeight: 1.5 }}>{r.v}</span>
                  </div>
                ))}

                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                    {['Research', 'AI / ML', 'Deep Learning', 'Computer Vision', 'Agriculture'].map(t => (
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
          {(['All', ...CATEGORIES] as (AwardCategory | 'All')[]).map(cat => (
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
                {catCount(cat)}
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

              {YEARS.slice().reverse().map((year, i) => {
                const yearAwards = AWARDS.filter(a => a.year === year)
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
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(80px, 16vw, 200px)', color: 'var(--navy-pale)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>18</div>

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
              <Link href="/research"               className="btn-navy" style={{ padding: '12px 24px', fontSize: 14 }}>Research Papers <ArrowRight size={14} /></Link>
              <Link href="/research/patents"       className="btn-out"  style={{ padding: '12px 24px', fontSize: 14 }}>Patents & IP</Link>
              <Link href="/achievements/certificates" className="btn-out" style={{ padding: '12px 24px', fontSize: 14 }}>Certificates</Link>
              <Link href="/contact"                className="btn-out"  style={{ padding: '12px 24px', fontSize: 14 }}>Contact</Link>
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