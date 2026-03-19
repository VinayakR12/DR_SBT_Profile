'use client'

// app/research/patents/page.tsx  — route: /research/patents
// Patents & Copyrights page inside the research section

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield, Award, ArrowRight, Calendar,
  Hash, FileCheck, Download, X,
  CheckCircle2, BookOpen,
} from 'lucide-react'
import { PATENTS, COPYRIGHTS } from '../../achievements/certificates/data'

const up = (d = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-20px' },
  transition: { duration: 0.62, delay: d, ease: [0.22, 1, 0.36, 1] as any },
})

const SS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Published: { bg: 'rgba(26,107,72,0.08)',  border: 'rgba(26,107,72,0.22)',  text: '#1A6B48', dot: '#1A6B48' },
  Granted:   { bg: 'rgba(184,135,10,0.10)', border: 'rgba(184,135,10,0.26)', text: '#7A5500', dot: '#B8870A' },
  Pending:   { bg: 'rgba(45,91,138,0.08)',  border: 'rgba(45,91,138,0.22)',  text: '#2D5B8A', dot: '#4A7AB8' },
}

export default function PatentsPage() {
  const [doc, setDoc]       = useState<{ file: string; title: string } | null>(null)
  const [loaded, setLoaded] = useState(false)

  const openDoc  = (file: string, title: string) => { setLoaded(false); setDoc({ file, title }) }
  const closeDoc = () => setDoc(null)

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
  <div
    style={{
      position: 'absolute',
      top: 'var(--nav-h)',
      left: 0,
      right: 0,
      height: 3,
      background:
        'linear-gradient(90deg,transparent,var(--gold-3),var(--gold),var(--gold-3),transparent)',
    }}
  />

  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
      backgroundSize: '52px 52px',
      pointerEvents: 'none',
    }}
  />

  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(ellipse 55% 70% at 50% 50%,rgba(184,135,10,0.09) 0%,transparent 60%)',
      pointerEvents: 'none',
    }}
  />

  <div
    className="W"
    style={{
      padding: 'clamp(48px,8vh,88px) clamp(18px,5vw,80px)',
      position: 'relative',
      zIndex: 1,
      textAlign: 'center', // ✅ center text
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // ✅ center horizontally
    }}
  >

    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ maxWidth: 700 }} // ✅ keeps content nicely centered
    >
      <p
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--gold-3)',
          marginBottom: 12,
        }}
      >
        Intellectual Property
      </p>

      <h1
        style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(32px,5.5vw,64px)',
          fontWeight: 800,
          color: '#F0F4F8',
          lineHeight: 1.06,
          letterSpacing: '-0.025em',
          marginBottom: 16,
        }}
      >
        Patents &{' '}
        <em
          style={{
            color: 'var(--gold-3)',
            fontStyle: 'italic',
            fontWeight: 600,
          }}
        >
          Registered IP
        </em>
      </h1>

      <p
        style={{
          fontSize: 'clamp(14px,1.4vw,17px)',
          color: 'rgba(226,232,240,0.68)',
          lineHeight: 1.75,
          marginBottom: 36,
          fontWeight: 300,
        }}
      >
        Filed utility patents and registered software copyrights resulting from
        original research in AI, Precision Agriculture, and Cybersecurity.
      </p>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // ✅ center stats
          flexWrap: 'wrap',
          gap: 'clamp(14px,3vw,36px)',
        }}
      >
        {[
          { n: PATENTS.length, l: 'Utility Patents' },
          { n: COPYRIGHTS.length, l: 'Copyrights' },
          {
            n: PATENTS.filter((p) => p.status === 'Published').length,
            l: 'Published',
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              paddingRight:
                i < 2 ? 'clamp(14px,3vw,36px)' : 0,
              borderRight:
                i < 2
                  ? '1px solid rgba(255,255,255,0.10)'
                  : 'none',
            }}
          >
            <p
              style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: 'clamp(28px,3.5vw,44px)',
                fontWeight: 700,
                color: 'var(--gold-3)',
              }}
            >
              {s.n}
            </p>
            <p
              style={{
                fontSize: 10.5,
                color: 'rgba(226,232,240,0.45)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              {s.l}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
</section>

      {/* ── PATENTS ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(52px,9vh,96px) 0' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(32px,5vh,52px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>Utility Patents</p>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              Filed &{' '}<em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Published Patents</em>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {PATENTS.map((p, i) => {
              const ss = SS[p.status] || SS.Pending
              return (
                <motion.div key={p.id} {...up(i * 0.09)}>
                  <div style={{ background: 'var(--white)', border: '1px solid var(--ink-line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--sh2)', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--sh3)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--sh2)')}>
                    <div style={{ height: 4, background: 'linear-gradient(90deg,var(--navy),var(--gold))' }} />
                    <div style={{ padding: 'clamp(24px,3.5vw,40px)' }}>

                      {/* Top row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 11, background: 'var(--navy-pale)', border: '1px solid var(--navy-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Shield size={22} style={{ color: 'var(--navy)' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>
                              {p.type} Patent · {p.filingDate.split(' ').pop()}
                            </p>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: 10.5, fontWeight: 700, background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot, display: 'inline-block' }} />{p.status}
                            </span>
                          </div>
                        </div>
                        {p.file && (
                          <button onClick={() => openDoc(p.file!, p.title)}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, border: '1.5px solid var(--navy-glow)', background: 'var(--navy-pale)', color: 'var(--navy)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.18s' }}
                            onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'var(--navy)'; el.style.color = '#fff'; el.style.borderColor = 'var(--navy)' }}
                            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--navy-pale)'; el.style.color = 'var(--navy)'; el.style.borderColor = 'var(--navy-glow)' }}>
                            <FileCheck size={13} /> View Document
                          </button>
                        )}
                      </div>

                      <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(18px,2vw,24px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.28, marginBottom: 14 }}>{p.title}</h2>
                      <p style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.8, marginBottom: 24, fontWeight: 300 }}>{p.description}</p>

                      {/* Details grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0 24px', background: 'var(--off)', borderRadius: 10, padding: 'clamp(16px,2.5vw,24px)', marginBottom: 20 }}>
                        {([
                          { I: Hash,        k: 'Application No.',  v: p.applicationNo,   mono: true  },
                          p.referenceNo ? { I: Hash,        k: 'Reference No.',    v: p.referenceNo,   mono: true  } : null,
                          p.docketNo    ? { I: Hash,        k: 'Docket No.',       v: p.docketNo,      mono: true  } : null,
                          p.crcNo       ? { I: Hash,        k: 'C.R.C. Number',    v: p.crcNo,         mono: true  } : null,
                          { I: Calendar,    k: 'Filing Date',      v: p.filingDate,      mono: false },
                          p.publicationDate ? { I: Calendar, k: 'Publication',      v: p.publicationDate, mono: false } : null,
                          { I: Shield,      k: 'Patent Type',      v: p.type,            mono: false },
                          { I: CheckCircle2,k: 'Status',           v: p.status,          mono: false },
                        ] as any[]).filter(Boolean).map((r: any, j: number) => (
                          <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--ink-line)' }}>
                            <r.I size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 2 }}>{r.k}</p>
                              <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: r.mono ? 500 : 400, fontFamily: r.mono ? 'monospace' : 'inherit' }}>{r.v}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {p.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* ── COPYRIGHTS ── */}
      <section style={{ background: 'var(--off)', padding: 'clamp(52px,9vh,96px) 0' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(32px,5vh,52px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>Software Copyrights</p>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              Registered <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Copyrights</em>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.75, marginTop: 14, maxWidth: 560, fontWeight: 300 }}>Software copyrights registered with the Copyright Office, Government of India, for original AI and VR software systems.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {COPYRIGHTS.map((c, i) => (
              <motion.div key={c.id} {...up(i * 0.08)}>
                <div style={{ background: 'var(--white)', border: '1px solid var(--ink-line)', borderRadius: 14, padding: 'clamp(22px,3vw,32px)', position: 'relative', overflow: 'hidden', boxShadow: 'var(--sh1)', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = 'var(--sh2)' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'var(--sh1)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,var(--gold),var(--gold-3))' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, gap: 10 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--gold-pale)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={21} style={{ color: 'var(--gold)' }} />
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: c.published ? 'rgba(26,107,72,0.08)' : 'rgba(100,116,139,0.08)', border: `1px solid ${c.published ? 'rgba(26,107,72,0.22)' : 'rgba(100,116,139,0.20)'}`, color: c.published ? '#1A6B48' : '#475569' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.published ? '#1A6B48' : '#475569', display: 'inline-block' }} />
                      {c.published ? 'Published' : 'Registered'}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(15px,1.5vw,18px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.35, marginBottom: 18 }}>{c.title}</h3>
                  {[['Category', c.category, false], ['Diary No.', c.diaryNo, true], ['Registered', c.date, false]].map(([k, v, mono]) => (
                    <div key={String(k)} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--ink-line)', alignItems: 'flex-start' }}>
                      <BookOpen size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 2 }}>{String(k)}</p>
                        <p style={{ fontSize: 13, color: 'var(--ink)', fontFamily: mono ? 'monospace' : 'inherit', fontWeight: mono ? 500 : 400 }}>{String(v)}</p>
                      </div>
                    </div>
                  ))}
                  {c.description && <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.68, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--ink-line)' }}>{c.description}</p>}
                  {c.file && (
                    <button onClick={() => openDoc(c.file!, c.title)}
                      style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px', borderRadius: 7, border: '1.5px solid var(--gold-border)', background: 'var(--gold-pale)', color: 'var(--gold)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.18s', width: '100%' }}
                      onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'var(--gold)'; el.style.color = '#fff' }}
                      onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--gold-pale)'; el.style.color = 'var(--gold)' }}>
                      <FileCheck size={13} /> View Certificate
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px,8vh,80px) 0', borderTop: '1px solid var(--ink-line)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,transparent,var(--gold),transparent)' }} />
        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.12, maxWidth: 560, margin: '0 auto 14px' }}>
              Explore <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Research Papers</em> & Certificates
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.75, fontWeight: 300 }}>
              View 15 international journal publications, 7 conference papers, and all academic credentials.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <Link href="/research"      className="btn-navy" style={{ padding: '11px 22px', fontSize: 13.5 }}>Research Papers <ArrowRight size={14} /></Link>
              <Link href="/certificates" className="btn-out"  style={{ padding: '11px 22px', fontSize: 13.5 }}>Certificates</Link>
              </div>
          </motion.div>
        </div>
      </section>

      {/* ── DOCUMENT MODAL ── */}
      {doc && (
        <div onClick={closeDoc}
          style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(5,10,20,0.84)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px,3vw,36px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--white)', borderRadius: 14, overflow: 'hidden', width: '100%', maxWidth: 860, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.55)' }}>
            <div style={{ padding: '14px 20px', background: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <p style={{ flex: 1, fontFamily: 'Playfair Display,serif', fontSize: 'clamp(13px,1.4vw,16px)', fontWeight: 600, color: '#F0F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</p>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <a href={doc.file} download target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
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
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Loading…</p>
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }`}</style>
    </>
  )
}