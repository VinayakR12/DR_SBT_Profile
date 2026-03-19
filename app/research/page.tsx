'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText, Shield, Brain, Leaf, Microscope,
  Globe, ArrowRight, Award, FlaskConical,
  GraduationCap,
} from 'lucide-react'

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as any },
})
const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const SI = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.52 } } }

const DOMAINS = [
  { icon: Brain,        label: 'Artificial Intelligence & ML', color: '#0D1F3C', count: '8 papers'  },
  { icon: Leaf,         label: 'Precision Agriculture',        color: '#1A6B48', count: '6 papers'  },
  { icon: Microscope,   label: 'Computer Vision',              color: '#2D5B8A', count: '4 papers'  },
  { icon: Globe,        label: 'EdTech & Blockchain',          color: '#5C3A8A', count: '2 papers'  },
  { icon: Shield,       label: 'Cybersecurity',                color: '#B8870A', count: '2 papers'  },
  ]

const NAV_CARDS = [
  {
    href: '/research/publications',
    icon: FileText,
    label: 'Publications',
    desc: '15 international journals and 7 conference papers spanning AI, precision agriculture, computer vision, cybersecurity, and education technology.',
    stats: [['15', 'Journals'], ['07', 'Conferences']],
    accent: 'var(--navy)',
    cta: 'Browse all publications',
    ctaColor: 'var(--navy)',
    ctaBg: 'var(--navy-pale)',
    ctaBorder: 'var(--navy-glow)',
  },
  {
    href: '/research/patents',
    icon: Shield,
    label: 'Patents & IP',
    desc: '2 utility patents filed with the Indian Patent Office and 2 software copyrights registered with the Government of India all from 2024 research.',
    stats: [['02', 'Patents'], ['02', 'Copyrights']],
    accent: '#B8870A',
    cta: 'View patents & copyrights',
    ctaColor: 'var(--gold)',
    ctaBg: 'var(--gold-pale)',
    ctaBorder: 'var(--gold-border)',
  },
]

export default function ResearchPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
  style={{
    paddingTop: 'var(--nav-h)',
    background: 'var(--navy)',
    position: 'relative',
    overflow: 'hidden'
  }}
>
  {/* top gradient line */}
  <div
    style={{
      position: 'absolute',
      top: 'var(--nav-h)',
      left: 0,
      right: 0,
      height: 3,
      background:
        'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)'
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
      pointerEvents: 'none'
    }}
  />

  {/* radial glow */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(ellipse 60% 80% at 80% 55%, rgba(184,135,10,0.08) 0%, transparent 62%)',
      pointerEvents: 'none'
    }}
  />

  <div
    className="W"
    style={{
      padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)',
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      justifyContent: 'center'
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        textAlign: 'center',
        maxWidth: 700,
        margin: '0 auto'
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
          gap: 10
        }}
      >
        <span
          style={{
            width: 22,
            height: 2,
            background: 'var(--gold-3)',
            borderRadius: 2,
            display: 'inline-block'
          }}
        />
        Research & Scholarship
      </p>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(36px, 6vw, 66px)',
          fontWeight: 800,
          color: '#F0F4F8',
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
          marginBottom: 18,
          marginInline: 'auto'
        }}
      >
        Publications, Patents &{' '}
        <em
          style={{
            color: 'var(--gold-3)',
            fontStyle: 'italic',
            fontWeight: 600
          }}
        >
          Intellectual Property
        </em>
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: 'clamp(14px, 1.4vw, 16.5px)',
          color: 'rgba(226,232,240,0.68)',
          lineHeight: 1.78,
          maxWidth: 560,
          margin: '0 auto',
          marginBottom: 36,
          fontWeight: 300
        }}
      >
        Applied research in Artificial Intelligence, Deep Learning, and Precision
        Agriculture 15 international journals, 7 conference papers, and 2
        filed utility patents.
      </p>
    </motion.div>
  </div>
</section>

      {/* ── NAVIGATION CARDS ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 4.5vh, 44px)' }}>
            <p className="lbl" style={{ marginBottom: 12 }}>Explore</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              Research <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Sections</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(14px, 2.5vw, 22px)' }}>
            {NAV_CARDS.map((card) => (
              <motion.div key={card.href} variants={SI}>
                <Link href={card.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div style={{
                    background: '#fff', border: '1px solid var(--ink-line)', borderRadius: 14,
                    overflow: 'hidden', height: '100%',
                    transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = 'var(--sh3)'; el.style.borderColor = `${card.accent}40` }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'var(--ink-line)' }}>
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${card.accent}, var(--gold-3))` }} />
                    <div style={{ padding: 'clamp(22px, 3vw, 32px)' }}>
                      {/* Icon + label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 46, height: 46, borderRadius: 10, background: `${card.accent}10`, border: `1px solid ${card.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <card.icon size={21} style={{ color: card.accent }} />
                        </div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(18px, 2vw, 22px)', fontWeight: 700, color: 'var(--navy)' }}>{card.label}</h3>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.72, marginBottom: 20, fontWeight: 300 }}>{card.desc}</p>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                        {card.stats.map(([n, l]) => (
                          <div key={l} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: 'var(--off)', border: '1px solid var(--ink-line)', textAlign: 'center' }}>
                            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>{n}</p>
                            <p style={{ fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 4 }}>{l}</p>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 7, background: card.ctaBg, border: `1px solid ${card.ctaBorder}` }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: card.ctaColor }}>{card.cta}</span>
                        <ArrowRight size={13} style={{ color: card.ctaColor, marginLeft: 'auto' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── RESEARCH DOMAINS ── */}
      <section style={{ background: 'var(--off)', padding: 'clamp(44px, 7vh, 72px) 0', borderTop: '1px solid var(--ink-line)' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(24px, 4vh, 36px)' }}>
            <p className="lbl" style={{ marginBottom: 12 }}>Coverage</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              Research <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Domains</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'clamp(8px, 1.5vw, 12px)' }}>
            {DOMAINS.map((d, i) => (
              <motion.div key={i} variants={SI}
                style={{
                  background: '#fff', border: '1px solid var(--ink-line)', borderRadius: 9,
                  padding: '13px 15px', display: 'flex', gap: 11, alignItems: 'center',
                  transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${d.color}35`; el.style.boxShadow = 'var(--sh1)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--ink-line)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${d.color}09`, border: `1px solid ${d.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <d.icon size={15} style={{ color: d.color }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 2 }}>{d.label}</p>
                  <p style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{d.count}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      
      {/* ── CTA ── */}
      <section style={{ background: 'var(--off)', padding: 'clamp(44px, 7vh, 72px) 0', borderTop: '1px solid var(--ink-line)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
              Interested in <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Research Collaboration?</em>
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', maxWidth: 460, margin: '0 auto 26px', lineHeight: 1.75, fontWeight: 300 }}>
              Open to co-authorship, joint research proposals, and academic partnerships in AI, precision agriculture, and computer vision.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <Link href="/research/publications" className="btn-navy" style={{ padding: '10px 22px', fontSize: 13.5 }}>All Publications <ArrowRight size={13} /></Link>
              <Link href="/research/patents"      className="btn-out"  style={{ padding: '10px 22px', fontSize: 13.5 }}>Patents & IP</Link>
                          </div>
          </motion.div>
        </div>
      </section>

      <style>{`@media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }`}</style>
    </>
  )
}