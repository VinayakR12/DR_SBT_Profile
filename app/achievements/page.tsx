// 'use client'

// // app/achievements/page.tsx  — Achievements Hub
// // Shows overview with cards linking to /achievements/awards and /achievements/certificates

// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import {
//   Award, Star, Shield, FileText, GraduationCap,
//   ArrowRight, CheckCircle2, ExternalLink, Trophy,
//   Briefcase, Building2, Calendar,
// } from 'lucide-react'

// const up = (delay = 0) => ({
//   initial: { opacity: 0, y: 24 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, margin: '-40px' },
//   transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as any },
// })
// const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
// const SI = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }

// const HIGHLIGHTS = [
//   { icon: Shield, color: '#0D1F3C', label: 'Patent', title: 'AI Crop & Weed Management System',       ref: 'App No: 202421045939 · June 2024', href: '/research/patents' },
//   { icon: Shield, color: '#2D5B8A', label: 'Patent', title: 'Intelligent Malware Evasion Prevention',  ref: 'App No: 202421069724 · Sep 2024',  href: '/research/patents' },
//   { icon: Award,  color: '#B8870A', label: 'Copyright', title: 'Plant Species & Weed CNN Software',   ref: 'Diary: 14704/2024-CO/SW · May 2024', href: '/achievements/certificates' },
//   { icon: Award,  color: '#1A6B48', label: 'Copyright', title: 'VR Solution for Online Education',    ref: 'Diary: 25004/2024-CO/SW · Dec 2024', href: '/achievements/certificates' },
//   { icon: GraduationCap, color: '#5C3A8A', label: 'Ph.D.', title: 'Doctor of Philosophy — Computer Engineering', ref: 'Pacific University, Udaipur · 2024', href: '/about' },
//   { icon: Star,   color: '#7A1A1A', label: 'Recognition', title: 'PG Recognized Teacher',             ref: 'Shivaji University, Kolhapur · 2014', href: '/achievements/awards' },
// ]

// const MILESTONES = [
//   { year: '2024', events: ['Ph.D. Awarded — Pacific University', '2 Utility Patents Filed & Published', '2 Software Copyrights Registered', '5 International Papers Published'] },
//   { year: '2023', events: ['IEEE WCONF Paper Published', 'Blockchain & NFT Research'] },
//   { year: '2022', events: ['2 Papers Published — IJRASET & Neuroquantology', 'Network Monitoring Research'] },
//   { year: '2018', events: ['Assistant Professor Approved — University of Mumbai (2nd)', 'NBA Criteria-3 Coordinator Role'] },
//   { year: '2017', events: ['Joined A. P. Shah Institute of Technology', 'PBL In-charge · III Cell Head'] },
//   { year: '2014', events: ['Assistant Professor Approved — Shivaji University', 'Head of Department — BVCOE Kolhapur'] },
//   { year: '2013', events: ['M.Tech Completed — 70% (RGTU, M.P.)', 'PG Recognized Teacher Designation'] },
//   { year: '2008', events: ['Lecturer Approved — University of Mumbai', '"NEXUS" National Event Technical Coordinator'] },
// ]

// export default function AchievementsPage() {
//   return (
//     <>
//       {/* ── HERO ── */}
//       <section style={{
//         paddingTop: 'var(--nav-h)',
//         background: 'var(--navy)',
//         position: 'relative', overflow: 'hidden',
//       }}>
//         <div style={{ position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)' }} />
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
//         <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 80% at 80% 55%, rgba(184,135,10,0.09) 0%, transparent 62%)', pointerEvents: 'none' }} />

//         <div className="W" style={{ padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>
//           <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
//             <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
//               <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
//               Achievements & Recognition
//             </p>
//             <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, color: '#F0F4F8', lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 18, maxWidth: 700 }}>
//               18 Years of{' '}
//               <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 600 }}>Academic Excellence</em>
//             </h1>
//             <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'rgba(226,232,240,0.70)', lineHeight: 1.75, maxWidth: 580, marginBottom: 36, fontWeight: 300 }}>
//               Patents, copyrights, university recognitions, and academic milestones earned across 18 years of teaching, research, and institutional leadership.
//             </p>

//             {/* Stats */}
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(16px, 3.5vw, 44px)' }}>
//               {[
//                 { n: '02', l: 'Patents',     s: 'Utility Filed' },
//                 { n: '02', l: 'Copyrights',  s: 'Registered IP' },
//                 { n: '06', l: 'Admin Roles', s: 'Leadership' },
//                 { n: '03', l: 'Univ. Approvals', s: 'Official' },
//               ].map((s, i) => (
//                 <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
//                   style={{ paddingRight: 'clamp(16px, 3.5vw, 44px)', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
//                   <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1 }}>{s.n}</p>
//                   <p style={{ fontSize: 12, fontWeight: 600, color: '#E2E8F0', marginTop: 4 }}>{s.l}</p>
//                   <p style={{ fontSize: 10, color: 'rgba(226,232,240,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>{s.s}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* ── TWO HUB CARDS ── */}
//       <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0' }}>
//         <div className="W">
//           <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)', textAlign: 'center' }}>
//             <p className="lbl" style={{ justifyContent: 'center', marginBottom: 14 }}>Explore Achievements</p>
//             <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
//               Browse by <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Category</em>
//             </h2>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(16px, 2.5vw, 24px)', marginBottom: 'clamp(32px, 5vh, 52px)' }}>

//             {/* Awards card */}
//             <motion.div variants={SI}>
//               <Link href="/achievements/awards" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
//                 <div style={{
//                   background: '#fff', border: '1px solid var(--ink-line)', borderRadius: 16,
//                   overflow: 'hidden', height: '100%',
//                   transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s', cursor: 'pointer',
//                 }}
//                 onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = 'var(--sh3)'; el.style.borderColor = 'rgba(13,31,60,0.25)' }}
//                 onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'var(--ink-line)' }}>
//                   <div style={{ background: 'var(--navy)', padding: 'clamp(24px, 3.5vw, 36px)', position: 'relative', overflow: 'hidden' }}>
//                     <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
//                     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--gold-3))' }} />
//                     <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(184,135,10,0.15)', border: '1px solid rgba(184,135,10,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
//                       <Trophy size={24} style={{ color: 'var(--gold-3)' }} />
//                     </div>
//                     <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 700, color: '#F0F4F8', marginBottom: 8 }}>Awards & Honours</h3>
//                     <p style={{ fontSize: 13.5, color: 'rgba(226,232,240,0.65)', lineHeight: 1.65, fontWeight: 300 }}>Ph.D. recognition, university-level honours, professional appointments, and academic milestones.</p>
//                   </div>
//                   <div style={{ padding: 'clamp(18px, 2.5vw, 26px)' }}>
//                     {[
//                       'Ph.D. Awarded — Pacific University (2024)',
//                       'PG Recognized Teacher — Shivaji University',
//                       'Assistant CAP Director — Shivaji University',
//                       'External Examiner — M.E. Dissertations',
//                       'NBA Criteria-3 Coordinator',
//                     ].map((item, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < 4 ? '1px solid var(--ink-line)' : 'none' }}>
//                         <CheckCircle2 size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
//                         <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.4 }}>{item}</p>
//                       </div>
//                     ))}
//                     <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 8, background: 'var(--navy-pale)', border: '1px solid var(--navy-glow)' }}>
//                       <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>View all awards</span>
//                       <ArrowRight size={14} style={{ color: 'var(--navy)', marginLeft: 'auto' }} />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </motion.div>

//             {/* Certificates card */}
//             <motion.div variants={SI}>
//               <Link href="/achievements/certificates" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
//                 <div style={{
//                   background: '#fff', border: '1px solid var(--ink-line)', borderRadius: 16,
//                   overflow: 'hidden', height: '100%',
//                   transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s', cursor: 'pointer',
//                 }}
//                 onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = 'var(--sh3)'; el.style.borderColor = 'rgba(184,135,10,0.35)' }}
//                 onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'var(--ink-line)' }}>
//                   <div style={{ background: 'linear-gradient(135deg, #7A5500 0%, #B8870A 100%)', padding: 'clamp(24px, 3.5vw, 36px)', position: 'relative', overflow: 'hidden' }}>
//                     <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
//                     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.3)' }} />
//                     <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
//                       <Briefcase size={24} style={{ color: '#fff' }} />
//                     </div>
//                     <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>Certificates</h3>
//                     <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.70)', lineHeight: 1.65, fontWeight: 300 }}>Official certificates, copyrights, training credentials and professional development documentation.</p>
//                   </div>
//                   <div style={{ padding: 'clamp(18px, 2.5vw, 26px)' }}>
//                     {[
//                       { icon: Award,  label: 'Copyright — Plant Species CNN',        ref: 'Diary: 14704/2024-CO/SW' },
//                       { icon: Award,  label: 'Copyright — VR Education Software',    ref: 'Diary: 25004/2024-CO/SW' },
//                       { icon: Briefcase, label: 'University Approval — UoM (2008)', ref: 'Letter: CONCOL/SA/4532' },
//                       { icon: Briefcase, label: 'University Approval — SU (2014)',  ref: 'Letter: Afi/T3/STS/F-105' },
//                       { icon: Briefcase, label: 'University Approval — UoM (2018)', ref: 'Letter: TAAS(CT)/ICD/2017-18' },
//                     ].map((item, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--ink-line)' : 'none' }}>
//                         <item.icon size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
//                         <div>
//                           <p style={{ fontSize: 12.5, color: 'var(--navy)', fontWeight: 500, lineHeight: 1.3, marginBottom: 1 }}>{item.label}</p>
//                           <p style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{item.ref}</p>
//                         </div>
//                       </div>
//                     ))}
//                     <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 8, background: 'var(--gold-pale)', border: '1px solid var(--gold-border)' }}>
//                       <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>View all certificates</span>
//                       <ArrowRight size={14} style={{ color: 'var(--gold)', marginLeft: 'auto' }} />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* ── ALL HIGHLIGHTS GRID ── */}
//       <section style={{ background: 'var(--off)', padding: 'clamp(44px, 7vh, 72px) 0', borderTop: '1px solid var(--ink-line)' }}>
//         <div className="W">
//           <motion.div {...up()} style={{ marginBottom: 'clamp(24px, 4vh, 36px)' }}>
//             <p className="lbl" style={{ marginBottom: 12 }}>All Highlights</p>
//             <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
//               Key <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Milestones</em>
//             </h2>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(260px, 44%, 480px), 1fr))', gap: 'clamp(10px, 1.5vw, 16px)' }}>
//             {HIGHLIGHTS.map((h, i) => (
//               <motion.div key={i} variants={SI}>
//                 <Link href={h.href} style={{ textDecoration: 'none', display: 'block' }}>
//                   <div style={{
//                     display: 'flex', gap: 14, alignItems: 'flex-start',
//                     padding: 'clamp(14px, 2vw, 20px)',
//                     borderRadius: 10, border: '1px solid var(--ink-line)', background: '#fff',
//                     transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
//                   }}
//                   onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = `${h.color}40`; el.style.boxShadow = 'var(--sh2)'; el.style.transform = 'translateY(-2px)' }}
//                   onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--ink-line)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}>
//                     <div style={{ width: 40, height: 40, borderRadius: 10, background: `${h.color}10`, border: `1px solid ${h.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                       <h.icon size={18} style={{ color: h.color }} />
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
//                         <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: h.color, background: `${h.color}10`, border: `1px solid ${h.color}22`, padding: '2px 7px', borderRadius: 4 }}>{h.label}</span>
//                       </div>
//                       <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.35, marginBottom: 4 }}>{h.title}</p>
//                       <p style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{h.ref}</p>
//                     </div>
//                     <ExternalLink size={13} style={{ color: 'var(--ink-4)', flexShrink: 0 }} />
//                   </div>
//                 </Link>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* ── TIMELINE ── */}
//       <section style={{ background: 'var(--white)', padding: 'clamp(44px, 7vh, 72px) 0', borderTop: '1px solid var(--ink-line)' }}>
//         <div className="W">
//           <motion.div {...up()} style={{ marginBottom: 'clamp(24px, 4vh, 40px)' }}>
//             <p className="lbl" style={{ marginBottom: 12 }}>Academic Timeline</p>
//             <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
//               Career <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Milestones</em> — Year by Year
//             </h2>
//           </motion.div>

//           <div style={{ position: 'relative', paddingLeft: 'clamp(20px, 4vw, 36px)' }}>
//             <div style={{ position: 'absolute', left: 'clamp(5px, 1.5vw, 12px)', top: 6, bottom: 6, width: 2, background: 'linear-gradient(180deg, var(--gold) 0%, rgba(184,135,10,0.15) 100%)', borderRadius: 2 }} />

//             {MILESTONES.map((m, i) => (
//               <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.55 }}
//                 style={{ display: 'flex', gap: 'clamp(14px, 2.5vw, 24px)', marginBottom: 'clamp(12px, 2vh, 18px)', position: 'relative' }}>
//                 {/* Dot */}
//                 <div style={{ position: 'absolute', left: `calc(-clamp(20px, 4vw, 36px) + clamp(5px, 1.5vw, 12px) - 6px)`, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, borderRadius: '50%', background: i === 0 ? 'var(--gold)' : 'var(--navy-3)', boxShadow: i === 0 ? '0 0 0 3px rgba(184,135,10,0.2)' : 'none', zIndex: 1 }} />

//                 <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1, padding: 'clamp(12px, 2vw, 16px)', borderRadius: 9, background: 'var(--off)', border: '1px solid var(--ink-line)', flexWrap: 'wrap' }}>
//                   <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: i === 0 ? 'var(--gold)' : 'var(--navy)', lineHeight: 1, flexShrink: 0, minWidth: 44 }}>{m.year}</span>
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                     {m.events.map((ev, ei) => (
//                       <span key={ei} style={{ fontSize: 12.5, padding: '3px 10px', borderRadius: 100, background: '#fff', border: '1px solid var(--ink-line)', color: 'var(--ink-2)' }}>{ev}</span>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section style={{ background: 'var(--off)', padding: 'clamp(44px, 7vh, 72px) 0', borderTop: '1px solid var(--ink-line)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
//         <div className="W" style={{ position: 'relative' }}>
//           <motion.div {...up()}>
//             <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
//               Learn More About My <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Work</em>
//             </h2>
//             <p style={{ fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.75, fontWeight: 300 }}>
//               Explore the full research portfolio, detailed patents, and teaching history.
//             </p>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
//               <Link href="/research"               className="btn-navy" style={{ padding: '11px 22px', fontSize: 13.5 }}>Research <ArrowRight size={14} /></Link>
//               <Link href="/achievements/awards"    className="btn-out"  style={{ padding: '11px 22px', fontSize: 13.5 }}>Awards</Link>
//               <Link href="/achievements/certificates" className="btn-out" style={{ padding: '11px 22px', fontSize: 13.5 }}>Certificates</Link>
//               <Link href="/contact"                className="btn-out"  style={{ padding: '11px 22px', fontSize: 13.5 }}>Contact</Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       <style>{`@media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }`}</style>
//     </>
//   )
// }

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Trophy, Shield, Award, GraduationCap, Star,
  Briefcase, ArrowRight, CheckCircle2, Building2,
  Calendar, FileText,
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
  { icon: GraduationCap, label: 'Ph.D. & Degrees',          color: '#0D1F3C', count: '3 qualifications' },
  { icon: Shield,        label: 'Patents & IP',              color: '#2D5B8A', count: '4 registrations'  },
  { icon: Trophy,        label: 'Awards & Honours',          color: '#B8870A', count: '5 recognitions'   },
  { icon: Briefcase,     label: 'University Approvals',      color: '#1A6B48', count: '3 approvals'      },
  { icon: Building2,     label: 'Admin & Leadership Roles',  color: '#5C3A8A', count: '6 roles'          },
]

const NAV_CARDS = [
  {
    href: '/achievements/awards',
    icon: Trophy,
    label: 'Awards & Honours',
    desc: 'Ph.D. recognition, university-level honours, PG teacher designations, professional appointments, and academic milestones earned over 18 years.',
    stats: [['05', 'Awards'], ['03', 'Approvals']],
    accent: 'var(--navy)',
    cta: 'Browse all awards',
    ctaColor: 'var(--navy)',
    ctaBg: 'var(--navy-pale)',
    ctaBorder: 'var(--navy-glow)',
  },
  {
    href: '/achievements/certificates',
    icon: Award,
    label: 'Certificates & IP',
    desc: '2 utility patents filed with the Indian Patent Office and 2 software copyrights registered with the Government of India — all from 2024.',
    stats: [['02', 'Copyrights'], ['02', 'Patents']],
    accent: '#B8870A',
    cta: 'View certificates & IP',
    ctaColor: 'var(--gold)',
    ctaBg: 'var(--gold-pale)',
    ctaBorder: 'var(--gold-border)',
  },
]

export default function AchievementsPage() {
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
        {/* top gradient line */}
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

        {/* radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 80% at 80% 55%, rgba(184,135,10,0.08) 0%, transparent 62%)',
            pointerEvents: 'none',
          }}
        />

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
              maxWidth: 700,
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
              Achievements & Recognition
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
                marginInline: 'auto',
              }}
            >
              Awards, Patents &{' '}
              <em
                style={{
                  color: 'var(--gold-3)',
                  fontStyle: 'italic',
                  fontWeight: 600,
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
                fontWeight: 300,
              }}
            >
              18 years of academic excellence — 2 utility patents, 2 registered
              copyrights, a Ph.D., and university recognitions across three institutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── NAVIGATION CARDS ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 4.5vh, 44px)' }}>
            <p className="lbl" style={{ marginBottom: 12 }}>Explore</p>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(24px, 3.5vw, 42px)',
                fontWeight: 700,
                color: 'var(--navy)',
                lineHeight: 1.1,
              }}
            >
              Achievement{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>
                Sections
              </em>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ST}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(14px, 2.5vw, 22px)',
            }}
          >
            {NAV_CARDS.map((card) => (
              <motion.div key={card.href} variants={SI}>
                <Link href={card.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid var(--ink-line)',
                      borderRadius: 14,
                      overflow: 'hidden',
                      height: '100%',
                      transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.transform = 'translateY(-4px)'
                      el.style.boxShadow = 'var(--sh3)'
                      el.style.borderColor = `${card.accent}40`
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.transform = 'translateY(0)'
                      el.style.boxShadow = 'none'
                      el.style.borderColor = 'var(--ink-line)'
                    }}
                  >
                    <div
                      style={{
                        height: 3,
                        background: `linear-gradient(90deg, ${card.accent}, var(--gold-3))`,
                      }}
                    />
                    <div style={{ padding: 'clamp(22px, 3vw, 32px)' }}>
                      {/* Icon + label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 10,
                            background: `${card.accent}10`,
                            border: `1px solid ${card.accent}22`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <card.icon size={21} style={{ color: card.accent }} />
                        </div>
                        <h3
                          style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 'clamp(18px, 2vw, 22px)',
                            fontWeight: 700,
                            color: 'var(--navy)',
                          }}
                        >
                          {card.label}
                        </h3>
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: 13.5,
                          color: 'var(--ink-3)',
                          lineHeight: 1.72,
                          marginBottom: 20,
                          fontWeight: 300,
                        }}
                      >
                        {card.desc}
                      </p>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                        {card.stats.map(([n, l]) => (
                          <div
                            key={l}
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: 8,
                              background: 'var(--off)',
                              border: '1px solid var(--ink-line)',
                              textAlign: 'center',
                            }}
                          >
                            <p
                              style={{
                                fontFamily: 'Playfair Display, serif',
                                fontSize: 24,
                                fontWeight: 700,
                                color: 'var(--navy)',
                                lineHeight: 1,
                              }}
                            >
                              {n}
                            </p>
                            <p
                              style={{
                                fontSize: 10,
                                color: 'var(--ink-4)',
                                letterSpacing: '0.07em',
                                textTransform: 'uppercase',
                                marginTop: 4,
                              }}
                            >
                              {l}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 14px',
                          borderRadius: 7,
                          background: card.ctaBg,
                          border: `1px solid ${card.ctaBorder}`,
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600, color: card.ctaColor }}>
                          {card.cta}
                        </span>
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

      {/* ── ACHIEVEMENT DOMAINS ── */}
      <section
        style={{
          background: 'var(--off)',
          padding: 'clamp(44px, 7vh, 72px) 0',
          borderTop: '1px solid var(--ink-line)',
        }}
      >
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(24px, 4vh, 36px)' }}>
            <p className="lbl" style={{ marginBottom: 12 }}>Coverage</p>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(22px, 3vw, 36px)',
                fontWeight: 700,
                color: 'var(--navy)',
                lineHeight: 1.1,
              }}
            >
              Achievement{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>
                Domains
              </em>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ST}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 'clamp(8px, 1.5vw, 12px)',
            }}
          >
            {DOMAINS.map((d, i) => (
              <motion.div
                key={i}
                variants={SI}
                style={{
                  background: '#fff',
                  border: '1px solid var(--ink-line)',
                  borderRadius: 9,
                  padding: '13px 15px',
                  display: 'flex',
                  gap: 11,
                  alignItems: 'center',
                  transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = `${d.color}35`
                  el.style.boxShadow = 'var(--sh1)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--ink-line)'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: `${d.color}09`,
                    border: `1px solid ${d.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <d.icon size={15} style={{ color: d.color }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--navy)',
                      lineHeight: 1.3,
                      marginBottom: 2,
                    }}
                  >
                    {d.label}
                  </p>
                  <p style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{d.count}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: 'var(--off)',
          padding: 'clamp(44px, 7vh, 72px) 0',
          borderTop: '1px solid var(--ink-line)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          }}
        />
        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(22px, 3vw, 36px)',
                fontWeight: 700,
                color: 'var(--navy)',
                marginBottom: 12,
              }}
            >
              Interested in{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>
                Academic Collaboration?
              </em>
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'var(--ink-3)',
                maxWidth: 460,
                margin: '0 auto 26px',
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Open to joint research, co-authorship, and academic partnerships in AI,
              precision agriculture, and computer vision.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <Link
                href="/achievements/awards"
                className="btn-navy"
                style={{ padding: '10px 22px', fontSize: 13.5 }}
              >
                All Awards <ArrowRight size={13} />
              </Link>
              <Link
                href="/achievements/certificates"
                className="btn-out"
                style={{ padding: '10px 22px', fontSize: 13.5 }}
              >
                Certificates & IP
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`@media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }`}</style>
    </>
  )
}