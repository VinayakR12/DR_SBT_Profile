'use client'

// app/teaching/page.tsx
// Teaching Portfolio for Dr. Sachin Takmare
// Magazine-editorial layout unique, warm, deeply personal
// Sections: hero, teaching identity, subjects grid, 
// institution-by-institution experience, roles & responsibilities,
// pedagogy principles, student impact, CTA

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Users, GraduationCap, Award,
  Brain, Globe, Shield, Cpu, Database,
  Network, Code2, FlaskConical, ArrowRight,
  CheckCircle2, Building2, Calendar, Quote,
  Layers, ChevronDown, ChevronUp, Star,
  BookMarked, Lightbulb, Target, TrendingUp,
  School,
} from 'lucide-react'

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

// ── DATA ─────────────────────────────────────────────────

const SUBJECTS = [
  // Core CS
  { icon: Layers,      name: 'Data Structures & Algorithms',       cat: 'Core CS',       color: '#0D1F3C', level: ['UG'] },
  { icon: Database,    name: 'Database Management Systems',         cat: 'Core CS',       color: '#1A3560', level: ['UG'] },
  { icon: Network,     name: 'Computer Networks',                   cat: 'Core CS',       color: '#0D1F3C', level: ['UG', 'PG'] },
  { icon: Code2,       name: 'Theory of Computation',               cat: 'Core CS',       color: '#2D5B8A', level: ['UG'] },
  { icon: Globe,       name: 'Operating Systems',                   cat: 'Core CS',       color: '#1A3560', level: ['UG'] },
  { icon: Cpu,         name: 'Computer Organization & Architecture', cat: 'Core CS',      color: '#0D1F3C', level: ['UG'] },
  // AI / ML
  { icon: Brain,       name: 'Artificial Intelligence',             cat: 'AI & ML',       color: '#1A6B48', level: ['UG', 'PG'] },
  { icon: FlaskConical,name: 'Machine Learning',                    cat: 'AI & ML',       color: '#1A6B48', level: ['UG', 'PG'] },
  { icon: Brain,       name: 'Deep Learning',                       cat: 'AI & ML',       color: '#1A5038', level: ['PG'] },
  { icon: Brain,       name: 'Computer Vision',                     cat: 'AI & ML',       color: '#1A6B48', level: ['PG'] },
  { icon: Brain,       name: 'Natural Language Processing',         cat: 'AI & ML',       color: '#1A5038', level: ['PG'] },
  // Software
  { icon: Code2,       name: 'Software Engineering',                cat: 'Software',      color: '#B8870A', level: ['UG', 'PG'] },
  { icon: Globe,       name: 'Web Technologies',                    cat: 'Software',      color: '#B8870A', level: ['UG'] },
  { icon: Code2,       name: 'Object-Oriented Programming (Java)',   cat: 'Software',      color: '#7A5500', level: ['UG'] },
  // Security
  { icon: Shield,      name: 'Cybersecurity & Ethical Hacking',     cat: 'Security',      color: '#5C3A8A', level: ['UG', 'PG'] },
  { icon: Shield,      name: 'Information & Network Security',       cat: 'Security',      color: '#3A2A6A', level: ['UG'] },
  // Research Methods
  { icon: FlaskConical,name: 'Research Methodology',                cat: 'Research',      color: '#7A1A1A', level: ['PG'] },
  { icon: Layers,      name: 'Advanced Algorithms',                  cat: 'Research',      color: '#5C1A1A', level: ['PG'] },
]

const INSTITUTIONS = [
  {
    id: 'dyp',
    period: '2025 – Present',
    role: 'Assistant Professor, Computer Engineering',
    org: 'D. Y. Patil College of Engineering & Technology',
    city: 'Kolhapur',
    univ: 'Shivaji University',
    color: '#0D1F3C',
    current: true,
    roles: [
      'Teaching undergraduate Computer Engineering subjects',
      'Active research in AI and Precision Agriculture',
      'Guiding final-year capstone project groups',
    ],
    highlight: 'Continuing PhD research work and doctoral teaching',
  },
  {
    id: 'apshah',
    period: '2017 – 2024',
    role: 'Assistant Professor, CSE',
    org: 'A. P. Shah Institute of Technology',
    city: 'Thane',
    univ: 'University of Mumbai',
    color: '#1A3560',
    current: false,
    roles: [
      'PBL (Project-Based Learning) In-charge designed and led institute-wide PBL programme',
      'III Cell (Innovation, Incubation & Ideation) In-charge mentored student entrepreneurship',
      'NBA Criteria-3 Coordinator led accreditation for research & student outcomes',
      'Sports Coordinator organised inter-college and intra-college sports events',
      'Guided 60+ UG project groups and supervised 8 M.E. dissertations resulting in publications',
    ],
    highlight: '7-year tenure with 60+ UG groups and 8 M.E. students most productive research phase',
  },
  {
    id: 'bvcoe',
    period: '2013 – 2017',
    role: 'Assistant Professor & Head of Department',
    org: "Bharati Vidyapeeth's College of Engineering",
    city: 'Kolhapur',
    univ: 'Shivaji University',
    color: '#B8870A',
    current: false,
    roles: [
      'Head of the Computer Science & Engineering Department led faculty of 12 members',
      'PG Recognized Teacher recognized by Shivaji University for M.E. research supervision',
      'Appointed as Assistant CAP Director by Shivaji University Kolhapur',
      'External Evaluator and Examiner for M.E. Dissertation examination',
      'Supervised 2 M.E. students through research methodology and dissertation to completion',
    ],
    highlight: 'Rose to Head of Department led curriculum, accreditation, and faculty development',
  },
  {
    id: 'parshu',
    period: '2007 – 2012',
    role: 'Lecturer & Assistant Professor',
    org: 'Parshavanath College of Engineering',
    city: 'Thane',
    univ: 'University of Mumbai',
    color: '#2D5B8A',
    current: false,
    roles: [
      'Appointment approved by University of Mumbai (Letter: CONCOL/SA/4532, Nov 2008)',
      'Technical Coordinator of "NEXUS" National Level Technical Event',
      'Sports In-charge from 2008 to 2012 managed inter-college tournaments',
      'Core teaching in Data Structures, Algorithms, Discrete Mathematics, Digital Systems',
    ],
    highlight: '5-year foundation built teaching identity and classroom presence',
  },
]

const ROLES_ADMIN = [
  { icon: Target,    color: '#0D1F3C', title: 'NBA Criteria-3 Coordinator', desc: 'Led the preparation and documentation for NBA accreditation under Criteria 3 Research, Consultancy & Extension. Managed student research output tracking and faculty contribution mapping.', inst: 'A. P. Shah Institute of Technology' },
  { icon: Lightbulb, color: '#B8870A', title: 'PBL In-charge',              desc: 'Designed and implemented the Project-Based Learning framework across all semesters. Created evaluation rubrics, mentored faculty on PBL pedagogy, and tracked project outcomes for NBA.', inst: 'A. P. Shah Institute of Technology' },
  { icon: TrendingUp,color: '#1A6B48', title: 'III Cell In-charge',          desc: 'Led the Innovation, Incubation & Ideation Cell supporting student startup ideas, organising innovation challenges, and connecting students with industry mentors.', inst: 'A. P. Shah Institute of Technology' },
  { icon: School,    color: '#2D5B8A', title: 'Head of Department',          desc: 'Managed the CSE Department at Bharati Vidyapeeth overseeing faculty recruitment, curriculum design, timetabling, student grievances, and departmental accreditation activities.', inst: "Bharati Vidyapeeth's College of Engineering" },
  { icon: GraduationCap, color: '#5C3A8A', title: 'Assistant CAP Director', desc: 'Appointed by Shivaji University as Assistant CAP (Centralised Admission Process) Director coordinating merit-based admissions for M.E. programmes.', inst: 'Shivaji University, Kolhapur' },
  { icon: Award,     color: '#7A1A1A', title: 'External Examiner M.E.',   desc: 'Appointed as External Evaluator and Examiner for M.E. Dissertation evaluation under Shivaji University Kolhapur assessed research quality, methodology, and presentation.', inst: 'Shivaji University, Kolhapur' },
]

const PEDAGOGY = [
  {
    icon: Target,
    title: 'Problem-First Learning',
    desc: 'Every concept is introduced through a real-world problem it solves. Students learn why before how building intrinsic motivation and deeper retention.',
  },
  {
    icon: Layers,
    title: 'Project-Based Learning',
    desc: 'Classroom theory is immediately applied in projects. Students build, fail, debug, and redesign developing engineering judgment that no lecture can convey.',
  },
  {
    icon: BookMarked,
    title: 'Research-Integrated Teaching',
    desc: 'Current research papers, industry case studies, and my own published work are woven into course content connecting students to the cutting edge.',
  },
  {
    icon: Users,
    title: 'Collaborative Mentorship',
    desc: 'Office hours, WhatsApp groups, shared repositories, and peer review sessions create a continuous mentorship environment beyond the formal lecture.',
  },
]

type SubjectFilter = 'All' | 'Core CS' | 'AI & ML' | 'Software' | 'Security' | 'Research'
const SUBJ_FILTERS: SubjectFilter[] = ['All', 'Core CS', 'AI & ML', 'Software', 'Security', 'Research']

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  UG: { bg: 'rgba(13,31,60,0.08)',   text: '#0D1F3C',  border: 'rgba(13,31,60,0.18)' },
  PG: { bg: 'rgba(184,135,10,0.10)', text: '#7A5500',  border: 'rgba(184,135,10,0.25)' },
}

// ═════════════════════════════════════════════════════════
export default function TeachingPage() {
  const [subjFilter, setSubjFilter] = useState<SubjectFilter>('All')
  const [openInst, setOpenInst] = useState<string | null>('apshah')

  const filteredSubjects = subjFilter === 'All'
    ? SUBJECTS
    : SUBJECTS.filter(s => s.cat === subjFilter)

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

        <div className="W" style={{ padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
                Teaching Portfolio
              </p>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 6vw, 70px)', fontWeight: 800, color: '#F0F4F8', lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 18, maxWidth: 640 }}>
                18 Years of{' '}
                <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 600 }}>Purposeful Teaching</em>
              </h1>
              <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'rgba(226,232,240,0.70)', lineHeight: 1.75, maxWidth: 560, marginBottom: 32, fontWeight: 300 }}>
                UGC-approved teaching across four institutions, two universities spanning foundational Computer Science to advanced AI and Machine Learning. Every classroom shaped by curiosity, rigour, and real-world relevance.
              </p>

              {/* Quick stats */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px, 3.5vw, 44px)' }}>
                {[
                  { n: '18+', l: 'Years', s: 'UGC Approved' },
                  { n: '4',   l: 'Institutions', s: 'Mumbai & Shivaji Univ.' },
                  { n: '18+', l: 'Subjects', s: 'UG & PG Level' },
                  
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1 }}>{s.n}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#E2E8F0', marginTop: 3 }}>{s.l}</p>
                    <p style={{ fontSize: 9.5, color: 'rgba(226,232,240,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 1 }}>{s.s}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Editorial pull quote */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: 24, position: 'relative' }}>
                <Quote size={28} style={{ color: 'var(--gold)', opacity: 0.4, marginBottom: 14 }} />
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(18px, 2.2vw, 26px)', fontStyle: 'italic', fontWeight: 400, color: '#F0F4F8', lineHeight: 1.5, marginBottom: 18 }}>
                  "The best engineers I have produced are not those who memorised the most they are those who learned to ask the right questions and never stopped building."
                </p>
                <p style={{ fontSize: 12.5, color: 'rgba(226,232,240,0.55)' }}>
                  Dr. Sachin B. Takmare
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEACHING IDENTITY ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(52px, 9vh, 88px) 0' }}>
        <div className="W">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 96px)', alignItems: 'start', textAlign:'justify'}}>
            <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 18 }}>Teaching Identity</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.12, marginBottom: 22 ,  textAlign:'left'}}>
                Professor, Researcher,{' '}
                <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Practitioner</em>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 16, fontWeight: 300 }}>
                My teaching is inseparable from my research. When I teach CNN architectures, I draw from my own Ph.D. work on crop classification. When I lecture on network security, I reference the malware evasion patent my students and I developed together. This integration theory, practice, and active research is what distinguishes my classroom.
              </p>
              <p style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>
                Over 18 years across four institutions and two universities, I have taught foundational subjects like Data Structures and Computer Networks, and advanced electives including Deep Learning, Computer Vision, and Research Methodology. At every level, the goal remains the same: produce engineers who think critically and build confidently.
              </p>

              {/* Credentials strip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  'Approved by University of Mumbai as Lecturer (Nov 2008)',
                  'Approved as Assistant Professor Shivaji University (Feb 2014)',
                  'Approved as Assistant Professor University of Mumbai (Apr 2018)',
                  'PG Recognized Teacher Shivaji University Kolhapur',
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
                    <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>{c}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pedagogy cards */}
            <motion.div {...up(0.1)}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 16 }}>Pedagogical Principles</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PEDAGOGY.map((p, i) => (
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


      {/* ── INSTITUTION TIMELINE accordion ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(52px, 9vh, 88px) 0', borderTop: '1px solid var(--ink-line)' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>18-Year Journey</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              Experience at Every <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Institution</em>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {INSTITUTIONS.map((inst, i) => {
              const isOpen = openInst === inst.id
              return (
                <motion.div key={inst.id} {...up(i * 0.07)}>
                  <div style={{
                    background: '#fff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 13, overflow: 'hidden',
                    boxShadow: isOpen ? 'var(--sh2)' : 'var(--sh1)',
                    borderColor: isOpen ? `${inst.color}40` : 'rgba(15,23,42,0.08)',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}>
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${inst.color}, var(--gold))` }} />

                    {/* Accordion header */}
                    <button onClick={() => setOpenInst(isOpen ? null : inst.id)}
                      style={{ width: '100%', display: 'flex', gap: 16, alignItems: 'center', padding: 'clamp(16px, 2.5vw, 22px) clamp(16px, 2.5vw, 24px)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif' }}>

                      {/* Year badge */}
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

                    {/* Expandable */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 clamp(16px, 2.5vw, 24px) clamp(20px, 3vw, 28px)', paddingLeft: 'calc(clamp(16px, 2.5vw, 24px) + 80px + 16px)' }}>
                            <div style={{ height: 1, background: 'var(--ink-line)', marginBottom: 18 }} />

                            {/* Highlight */}
                            <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'var(--gold-pale)', border: '1px solid var(--gold-border)', marginBottom: 16 }}>
                              <Star size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} fill="var(--gold)" />
                              <p style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500, lineHeight: 1.55 }}>{inst.highlight}</p>
                            </div>

                            {/* Roles */}
                            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 10 }}>Roles & Responsibilities</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {inst.roles.map((r, ri) => (
                                <div key={ri} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                  <CheckCircle2 size={13} style={{ color: inst.color, flexShrink: 0, marginTop: 3 }} />
                                  <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>{r}</p>
                                </div>
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
      </section>

      {/* ── ADMINISTRATIVE ROLES ── */}
      <section style={{ background: 'var(--off)', padding: 'clamp(52px, 9vh, 88px) 0', borderTop: '1px solid var(--ink-line)' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>Leadership & Administration</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              Academic <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Roles & Responsibilities</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(260px, 44%, 480px), 1fr))', gap: 'clamp(12px, 2vw, 18px)' }}>
            {ROLES_ADMIN.map((r, i) => (
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
              Student Impact
              <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.1 }}>
              Numbers That <em style={{ color: 'var(--gold-3)', fontStyle: 'italic' }}>Speak</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { I: GraduationCap, n: '18+', l: 'Years',         s: 'UGC Approved' },
              { I: Users,         n: '60+', l: 'UG Groups',     s: 'Projects Mentored' },
              { I: BookOpen,      n: '10',  l: 'M.E. Students', s: 'Dissertations Guided' },
              { I: Award,         n: '5+',  l: 'Published',     s: 'Student Research' },
              { I: Building2,     n: '4',   l: 'Institutions',  s: 'Mumbai & Kolhapur' },
              { I: Star,          n: '6',   l: 'Admin Roles',   s: 'Leadership' },
            ].map((s, i) => (
              <motion.div key={i} variants={SI}
                style={{ padding: 'clamp(18px, 3vw, 28px) clamp(8px, 1.5vw, 14px)', textAlign: 'center', background: 'rgba(13,31,60,0.5)', cursor: 'default', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,135,10,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,31,60,0.5)')}>
                <s.I size={18} style={{ color: 'rgba(226,232,240,0.35)', margin: '0 auto 8px', display: 'block' }} />
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
              Looking for a <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Research Guide</em> or Collaborator?
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 500, margin: '0 auto 30px', lineHeight: 1.75, fontWeight: 300 }}>
              I am open to supervising M.E. / Ph.D. research, co-authoring publications, and speaking at faculty development programmes.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <Link href="/contact"  className="btn-navy" style={{ padding: '12px 26px', fontSize: 14 }}>Get In Touch <ArrowRight size={14} /></Link>
                        <Link href="/research" className="btn-out"  style={{ padding: '12px 26px', fontSize: 14 }}>Publications</Link>
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