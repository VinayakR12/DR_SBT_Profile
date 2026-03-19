'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Mail, Phone, MapPin, GraduationCap,
  ChevronRight, Award, Shield, FlaskConical, BookOpen,
} from 'lucide-react'

const PAGES = [
  { href: '/',              l: 'Home' },
  { href: '/about',         l: 'About' },
  { href: '/research',      l: 'Research & Work' },
  { href: '/achievements',  l: 'Achievements' },
  { href: '/projects',      l: 'Projects' },
  { href: '/teaching',      l: 'Teaching' },
  { href: '/contact',       l: 'Contact' },
]

const RECORDS = [
  { href: '/achievements/awards',       l: 'Awards & Honours',  I: Award },
  { href: '/achievements/certificates', l: 'Certificates',      I: FlaskConical },
  { href: '/research/patents',          l: 'Patents & IP',      I: Shield },
  { href: '/research/publications',     l: 'Publications',      I: BookOpen },
]

const STATS: [string, string][] = [
  ['15', "Int'l Journals"],
  ['07', 'Conferences'],
  ['02', 'Patents'],
  ['02', 'Copyrights'],
]

const lk: React.CSSProperties = {
  color: 'rgba(226,232,240,0.55)',
  fontSize: 12.5,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 0',
  transition: 'color 0.15s',
}
const hov = {
  onMouseEnter: (e: any) => (e.currentTarget.style.color = '#E2E8F0'),
  onMouseLeave: (e: any) => (e.currentTarget.style.color = 'rgba(226,232,240,0.55)'),
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>

      {/* Gold top line */}
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)',
      }} />

      {/* PhD watermark */}
      <div style={{
        position: 'absolute', bottom: -16, right: -10,
        fontFamily: 'Playfair Display, serif', fontWeight: 800,
        fontSize: 'clamp(70px, 12vw, 160px)', color: 'rgba(184,135,10,0.06)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>PhD</div>

      {/* ── Main content ── */}
      <div className="W" style={{
        paddingTop: 'clamp(48px, 7vh, 72px)',
        paddingBottom: 0,
        position: 'relative',
      }}>

        {/* ════════════════════════════════════════
            DESKTOP LAYOUT  (≥ 640px)
            4-column grid original design kept
        ════════════════════════════════════════ */}
        <div className="ft-desktop" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
          gap: 'clamp(28px, 4vw, 52px)',
          marginBottom: 'clamp(36px, 5vh, 52px)',
        }}>

          {/* Col 1 Brand */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-3) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GraduationCap size={18} color="var(--navy)" strokeWidth={2.2} />
              </div>
              <div>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.2 }}>Dr. Sachin B. Takmare</p>
                <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--gold-3)', marginTop: 2 }}>Ph.D · AI & ML Expert</p>
              </div>
            </Link>
            <p style={{ fontSize: 12.5, color: 'rgba(226,232,240,0.50)', lineHeight: 1.75, marginBottom: 18, fontWeight: 300, maxWidth: 240 }}>
              Assistant Professor with 18+ years of UGC-approved experience. Researcher in AI, Deep Learning & Precision Agriculture.
            </p>
            <a href="mailto:sachintakmare@gmail.com" style={lk} {...hov}>
              <Mail size={11} style={{ color: 'var(--gold-3)', flexShrink: 0 }} />sachintakmare@gmail.com
            </a>
            <a href="tel:+919960843406" style={lk} {...hov}>
              <Phone size={11} style={{ color: 'var(--gold-3)', flexShrink: 0 }} />+91 9960843406
            </a>
            <span style={{ ...lk, cursor: 'default' }}>
              <MapPin size={11} style={{ color: 'var(--gold-3)', flexShrink: 0 }} />Kolhapur, Maharashtra
            </span>
          </motion.div>

          {/* Col 2 Navigation */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.07 }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 16 }}>Navigation</p>
            {PAGES.map(p => (
              <Link key={p.href} href={p.href} style={lk} {...hov}>
                <ChevronRight size={10} style={{ color: 'var(--gold)', flexShrink: 0 }} />{p.l}
              </Link>
            ))}
          </motion.div>

          {/* Col 3 Academic Records */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.12 }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 16 }}>Academic Records</p>
            {RECORDS.map(r => (
              <Link key={r.href} href={r.href} style={lk} {...hov}>
                <r.I size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />{r.l}
              </Link>
            ))}
          </motion.div>

          {/* Col 4 Research Output */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.18 }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 16 }}>Research Output</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {STATS.map(([v, l]) => (
                <div key={l} style={{ padding: '11px 10px', borderRadius: 8, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1, marginBottom: 4 }}>{v}</p>
                  <p style={{ fontSize: 9.5, color: 'rgba(226,232,240,0.40)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</p>
                </div>
              ))}
            </div>
          
          </motion.div>
        </div>

   
        <div className="ft-mobile" style={{ display: 'none', marginBottom: 'clamp(28px, 5vh, 44px)' }}>

          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
            style={{ marginBottom: 28 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-3) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GraduationCap size={16} color="var(--navy)" strokeWidth={2.2} />
              </div>
              <div>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 13.5, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.2 }}>Dr. Sachin B. Takmare</p>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--gold-3)', marginTop: 2 }}>Ph.D · AI & ML Expert</p>
              </div>
            </Link>
            <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.48)', lineHeight: 1.7, marginBottom: 12, fontWeight: 300 }}>
              Assistant Professor with 18+ years of UGC-approved experience. Researcher in AI, Deep Learning & Precision Agriculture.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <a href="mailto:sachintakmare@gmail.com" style={{ ...lk, fontSize: 12 }} {...hov}>
                <Mail size={10} style={{ color: 'var(--gold-3)', flexShrink: 0 }} />sachintakmare@gmail.com
              </a>
              <a href="tel:+919960843406" style={{ ...lk, fontSize: 12 }} {...hov}>
                <Phone size={10} style={{ color: 'var(--gold-3)', flexShrink: 0 }} />+91 9960843406
              </a>
              <span style={{ ...lk, fontSize: 12, cursor: 'default' }}>
                <MapPin size={10} style={{ color: 'var(--gold-3)', flexShrink: 0 }} />Kolhapur, Maharashtra
              </span>
            </div>
          </motion.div>

          {/* Nav | Academic Records 2 columns always */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.07 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 24,
              paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}>
            {/* Navigation */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 12 }}>Navigation</p>
              {PAGES.map(p => (
                <Link key={p.href} href={p.href}
                  style={{ color: 'rgba(226,232,240,0.55)', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(226,232,240,0.55)')}>
                  <ChevronRight size={9} style={{ color: 'var(--gold)', flexShrink: 0 }} />{p.l}
                </Link>
              ))}
            </div>

            {/* Academic Records */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 12 }}>Academic Records</p>
              {RECORDS.map(r => (
                <Link key={r.href} href={r.href}
                  style={{ color: 'rgba(226,232,240,0.55)', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(226,232,240,0.55)')}>
                  <r.I size={10} style={{ color: 'var(--gold)', flexShrink: 0 }} />{r.l}
                </Link>
              ))}
            </div>
          </motion.div>

        
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.14 }}
            style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 12 }}>Research Output</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {STATS.map(([v, l]) => (
                <div key={l} style={{ padding: '10px 8px', borderRadius: 8, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1, marginBottom: 4 }}>{v}</p>
                  <p style={{ fontSize: 9, color: 'rgba(226,232,240,0.40)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: 'clamp(14px, 2.5vh, 22px) 0',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'center',
          gap: 6,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.28)', fontWeight: 300 }}>
            © {new Date().getFullYear()} Dr. Sachin Balawant Takmare. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Responsive switch ── */}
      <style>{`
        @media (min-width: 640px) {
          .ft-desktop { display: grid !important; }
          .ft-mobile  { display: none  !important; }
        }
        @media (max-width: 639px) {
          .ft-desktop { display: none  !important; }
          .ft-mobile  { display: block !important; }
        }
      `}</style>
    </footer>
  )
}