// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import {
//   ArrowRight, Mail, MapPin, ChevronDown,
//   Brain, Leaf, Microscope, School,
//   Users, BookOpen, Shield, Award,
//   CheckCircle2, ExternalLink, GraduationCap,
//   FileText, Quote, Star,
// } from 'lucide-react'

// const up = (delay = 0) => ({
//   initial: { opacity: 0, y: 28 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, margin: '-40px' },
//   transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
// })
// const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.085 } } }
// const SI = {
//   hidden: { opacity: 0, y: 22 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
// }

// const PILLARS = [
//   {
//     I: Brain, a: '#0D1F3C', b: 'var(--navy-pale)',
//     tag: 'Core Specialization',
//     title: 'Artificial Intelligence & Machine Learning',
//     desc: 'Designing CNN architectures, supervised & unsupervised models, and intelligent automation systems applied across agriculture, cybersecurity, and virtual education environments.',
//     chips: ['CNN Architecture', 'YOLO Detection', 'Supervised ML', 'Deep Learning'],
//   },
//   {
//     I: Leaf, a: '#1A6B48', b: 'rgba(26,107,72,0.08)',
//     tag: 'Ph.D. Research Domain',
//     title: 'Precision Agriculture & Smart Farming',
//     desc: 'Ph.D.-level research automating crop-weed classification from field imagery, enabling precision herbicide application and sustainable farming through AI-driven density analysis.',
//     chips: ['Crop/Weed Classification', 'Density Estimation', 'Smart Deployment', 'Sustainable AI'],
//   },
//   {
//     I: Microscope, a: '#2D5B8A', b: 'rgba(45,91,138,0.08)',
//     tag: 'Applied Research',
//     title: 'Computer Vision & Image Processing',
//     desc: 'End-to-end vision pipelines for agricultural monitoring, medical imaging (Sickle Cell Anemia diagnosis), and blockchain-based NFT gaming published in IEEE conferences.',
//     chips: ['Medical Imaging', 'Feature Extraction', 'Real-Time Analysis', 'Multi-Domain'],
//   },
//   {
//     I: School, a: '#7A5500', b: 'rgba(122,85,0,0.08)',
//     tag: 'Institutional Leadership',
//     title: 'Academic Administration & Pedagogy',
//     desc: 'NBA Criteria-3 Coordinator, PBL In-charge, III Cell Head, External Examiner, and PG-recognized teacher leading quality, innovation, and research across departments.',
//     chips: ['NBA Accreditation', 'Project-Based Learning', 'M.E. Examiner', 'Innovation Cell'],
//   },
// ]

// const TIMELINE = [
//   { y: '2025 – Present', role: 'Assistant Professor, Computer Engineering', org: 'D. Y. Patil College of Engineering & Technology', city: 'Kolhapur', note: 'Current position', current: true, c: '#0D1F3C' },
//   { y: '2017 – 2024', role: 'Assistant Professor, Computer Science & Engg.', org: 'A. P. Shah Institute of Technology', city: 'Thane', note: 'PBL In-charge · NBA Criteria-3 Coordinator · Innovation Cell', c: '#1A3560' },
//   { y: '2013 – 2017', role: 'Assistant Professor & Head of Department', org: "Bharati Vidyapeeth's College of Engineering", city: 'Kolhapur', note: 'HOD · PG Recognized Teacher (Shivaji Univ.) · Asst. CAP Director', c: '#B8870A' },
//   { y: '2007 – 2012', role: 'Lecturer & Assistant Professor', org: 'Parshavanath College of Engineering', city: 'Thane', note: 'Technical Coordinator "NEXUS" National Event · Sports In-charge', c: '#2D5B8A' },
// ]

// const PUBS = [
//   { tag: 'IJISAE 2024', c: '#0D1F3C', title: 'Transforming Farming with CNNs: Accurate Crop and Weed Classification', info: 'Vol. 12, Issue 4 · pp. 1484–1490 · ISSN 2147-6799' },
//   { tag: 'IEEE INOCON', c: '#1A6B48', title: 'MetaCampus: Advancing Online Education with Virtual Classroom', info: 'IEEE 2024 · 979-8-3503-8193-1/24' },
//   { tag: 'IJOEAR 2024', c: '#2D5B8A', title: 'Estimating Crop and Weed Density Using YOLO for Precision Agriculture', info: 'Vol. 6, Issue 10 · pp. 14–25 · ISSN 2454-1850' },
//   { tag: 'IEEE WCONF', c: '#B8870A', title: 'Dodging Turtis NFT Gaming on Blockchain', info: 'IEEE 2023 · 979-8-3503-1120-4/23' },
//   { tag: 'IJCSE 2024', c: '#5C3A1A', title: 'A Deep Learning Approach to Efficient Crop and Weed Classification', info: 'Vol. 12, Issue 6 · pp. 30–43 · E-ISSN 2347-2693' },
// ]

// export default function HomePage() {
//   const [m, setM] = useState(false)
//   useEffect(() => setM(true), [])

//   return (
//     <>
//       <section style={{
//         minHeight: '100svh',
//         display: 'flex', flexDirection: 'column',
//         background: 'var(--white)',
//         paddingTop: 'var(--nav-h)',
//         position: 'relative', overflow: 'hidden',
//       }}>
//         <div style={{
//           position: 'absolute', inset: 0, pointerEvents: 'none',
//           background: `
//             radial-gradient(ellipse 70% 60% at 95% 10%, rgba(212,168,32,0.07) 0%, transparent 55%),
//             radial-gradient(ellipse 55% 55% at 85% 35%, rgba(184,135,10,0.05) 0%, transparent 50%),
//             radial-gradient(ellipse 60% 60% at 5%  80%, rgba(45,91,138,0.06) 0%, transparent 55%),
//             radial-gradient(ellipse 40% 45% at 15% 50%, rgba(13,31,60,0.04) 0%, transparent 50%)
//           `,
//         }} />

//         <div style={{
//           position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0, height: '3px',
//           background: 'linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold-3) 50%, var(--gold) 80%, transparent 100%)',
//         }} />

//         <div className="W" style={{
//           flex: 1, display: 'flex', alignItems: 'center',
//           padding: 'clamp(44px, 8vh, 96px) clamp(18px, 5vw, 80px)',
//           position: 'relative', zIndex: 1,
//         }}>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
//             gap: 'clamp(40px, 7vw, 108px)',
//             alignItems: 'center',
//             width: '100%',
//           }} className="hg">

//             <motion.div
//               initial={{ opacity: 0, y: 36 }}
//               animate={{ opacity: m ? 1 : 0, y: m ? 0 : 36 }}
//               transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <div style={{
//                 display: 'inline-flex', alignItems: 'center', gap: 8,
//                 padding: '5px 14px 5px 8px', borderRadius: 100,
//                 border: '1px solid var(--gold-border)', background: 'var(--gold-pale)',
//                 marginBottom: 28,
//               }}>
//                 <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                   <GraduationCap size={12} color="#fff" />
//                 </span>
//                 <span style={{ fontSize: 10.5, color: 'var(--gold)' }}>Ph.D. · Computer Engineering · 18+ Years</span>
//               </div>

//               <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(50px, 8vw, 100px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.03em', color: 'var(--navy)', marginBottom: 6 }}>
//                 Dr. Sachin
//               </h1>
//               <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(50px, 8vw, 100px)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1, letterSpacing: '-0.025em', color: 'var(--gold)', marginBottom: 30 }}>
//                 Takmare
//               </h1>

//               <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'var(--ink-2)', lineHeight: 1.68, maxWidth: 510, marginBottom: 10 }}>
//                 <strong style={{ color: 'var(--navy)', fontWeight: 700 }}>Assistant Professor, Computer Science - </strong>
//                 {' '} D. Y. Patil College of Engineering & Technology, Kolhapur.
//               </p>
//               <p style={{ fontSize: 'clamp(13px, 1.15vw, 15.5px)', color: 'var(--ink-3)', lineHeight: 1.8, maxWidth: 488, marginBottom: 34, fontWeight: 300, textAlign:'justify' }}>
//                 AI & Deep Learning researcher. Ph.D. awarded 2024 for CNN-based precision farming. Author of 15 peer-reviewed journals, presenter at 7 international conferences, holder of 2 utility patents, and mentor to 70+ student projects across 18 years.
//               </p>

//               <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 32 }}>
//                 <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-3)' }}>
//                   <MapPin size={11} style={{ color: 'var(--gold)' }} /> Kolhapur, Maharashtra
//                 </span>
//                 <span style={{ width: 1, height: 12, background: 'var(--ink-line)' }} />

//                 <span className="tag tag-gold" style={{ fontSize: 10.5 }}>Open to Collaboration</span>
//               </div>

//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//                 <Link href="/research" className="btn-navy">Explore Research <ArrowRight size={14} /></Link>
//                 <Link href="/contact" className="btn-out">Contact</Link>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.92, y: 20 }}
//               animate={{ opacity: m ? 1 : 0, scale: m ? 1 : 0.92, y: m ? 0 : 20 }}
//               transition={{ duration: 1.0, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
//               style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
//             >
//               <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
//                 <div style={{ position: 'absolute', inset: -14, borderRadius: 18, border: '1.5px solid var(--gold-border)', opacity: 0.5 }} />
//                 <div style={{ position: 'absolute', inset: -6, borderRadius: 15, border: '1px solid var(--ink-line)' }} />

//                 <div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh3)' }}>
//                   <div style={{ height: 4, background: 'linear-gradient(90deg, var(--navy) 0%, var(--navy-2) 40%, var(--gold) 100%)' }} />

//                   <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, var(--off) 0%, var(--off2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--navy-pale)', border: '3px solid var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 0 28px var(--navy-glow)' }}>
//                         <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 700, color: 'var(--navy)' }}>ST</span>
//                       </div>
//                       <p style={{ fontSize: 10.5, color: 'var(--ink-4)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Add profile.image</p>
//                     </div>
//                     <span className="tag tag-navy" style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 10.5 }}>Computer Engineering</span>
//                   </div>

//                   <div style={{ padding: '18px 20px' }}>
//                     <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 600, color: 'var(--navy)', marginBottom: 3 }}>Dr. Sachin B. Takmare</p>
//                     <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 14 }}>Ph.D. (2024) · M.Tech · B.E. · Assistant Professor</p>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
//                       {[ 'Computer Science','AI/ML', 'Deep Learning', 'NLP'].map(t => (
//                         <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
//                   style={{ position: 'absolute', top: 20, right: -22, padding: '9px 14px', borderRadius: 10, background: '#fff', border: '1px solid var(--gold-border)', boxShadow: 'var(--sh2)', textAlign: 'center', zIndex: 2 }}>
//                   <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>Ph.D.</p>
//                   <p style={{ fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>2024</p>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//       </section>

//       <section style={{ background: 'var(--navy)', padding: 'clamp(36px, 6vh, 60px) 0', position: 'relative', overflow: 'hidden' }}>
//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold-3), transparent)' }} />
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

//         <div className="W" style={{ position: 'relative' }}>
//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.10)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.10)' }}>
//             {[
//               { n: '18+', l: 'Years Teaching', s: 'UGC Approved' },
//               { n: '15', l: "Int'l Journals", s: 'Peer Reviewed' },
//               { n: '07', l: 'Conferences', s: 'International' },
//               { n: '70+', l: 'Projects Guided', s: 'UG & PG Both' },
//               { n: '02', l: 'Patents Filed', s: 'Utility Patents' },

//             ].map((s, i) => (
//               <motion.div key={i} variants={SI}
//                 style={{ padding: 'clamp(22px, 3.5vw, 36px) clamp(10px, 2vw, 18px)', textAlign: 'center', background: 'rgba(13,31,60,0.6)', cursor: 'default', transition: 'background 0.2s' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,135,10,0.12)')}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,31,60,0.6)')}>
//                 <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(34px, 4.8vw, 56px)', fontWeight: 700, lineHeight: 1, color: 'var(--gold-3)', marginBottom: 6 }}>{s.n}</p>
//                 <p style={{ fontSize: 'clamp(11px, 1vw, 13px)', fontWeight: 600, color: '#E2E8F0', marginBottom: 3 }}>{s.l}</p>
//                 <p style={{ fontSize: '9.5px', color: 'rgba(226,232,240,0.45)', letterSpacing: '0.07em' }}>{s.s}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>
// <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0', position: 'relative', overflow: 'hidden' }}>
//   {/* Subtle background */}
//   <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,135,10,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

//   <div className="W" style={{ position: 'relative' }}>
//     <motion.div {...up()} style={{ marginBottom: 'clamp(24px, 4vh, 40px)' }}>
//       <p className="lbl" style={{ marginBottom: 0 }}>Pinnacle Achievement</p>
//     </motion.div>

//     <motion.div {...up(0.1)}>
//       <div style={{
//         borderRadius: 18,
//         overflow: 'hidden',
//         border: '1.5px solid rgba(184,135,10,0.30)',
//         boxShadow: '0 20px 60px rgba(13,31,60,0.13), 0 4px 16px rgba(13,31,60,0.07)',
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
//       }}>

//         {/* Left Panel */}
//         <div style={{
//           background: '#0D1F3C',
//           padding: 'clamp(28px, 4vw, 52px)',
//           position: 'relative',
//           overflow: 'hidden',
//         }}>
//           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--gold), var(--gold-3))' }} />

//           <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
//             <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(184,135,10,0.15)', border: '1px solid rgba(184,135,10,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <GraduationCap size={24} style={{ color: 'var(--gold-3)' }} />
//             </div>
//             <div>
//               <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', display: 'block' }}>
//                 Academic
//               </span>
//               <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.45)' }}>
//                 Awarded 2024
//               </span>
//             </div>
//           </div>

//           <h2 style={{
//             fontFamily: 'Playfair Display, serif',
//             fontSize: 'clamp(24px, 3vw, 36px)',
//             fontWeight: 700,
//             color: '#F0F4F8',
//             lineHeight: 1.18,
//             marginBottom: 16,
//           }}>
//             Doctor of Philosophy (Ph.D.)
//           </h2>

//           <p style={{
//             fontSize: 14,
//             color: 'rgba(226,232,240,0.65)',
//             lineHeight: 1.78,
//             marginBottom: 24,
//           }}>
//             Doctoral degree awarded for the thesis "Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis". The research developed a deep learning pipeline automating crop-weed identification from field imagery, resulting in 2 international publications and a filed utility patent.
//           </p>

//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//             {['Doctorate', 'AI Research', 'Precision Agriculture', 'CNN'].map(t => (
//               <span key={t} style={{
//                 padding: '3px 10px',
//                 borderRadius: 100,
//                 fontSize: 11,
//                 background: 'rgba(255,255,255,0.06)',
//                 border: '1px solid rgba(255,255,255,0.12)',
//                 color: 'rgba(226,232,240,0.65)',
//               }}>
//                 {t}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div style={{ background: 'var(--off)', padding: 'clamp(28px, 4vw, 52px)' }}>
//           <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
//             Award Details
//           </p>

//           {[
//             { k: 'Degree', v: 'Doctor of Philosophy (Ph.D.)' },
//             { k: 'Institution', v: 'Pacific University, Udaipur' },
//             { k: 'Year', v: '2024 — Awarded' },
//             { k: 'Thesis', v: 'Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis' },
//             { k: 'Method', v: 'CNN + Computer Vision Pipeline' },
//             { k: 'Outcome', v: '2 International Publications · 1 Utility Patent Filed' },
//           ].map((r, i, a) => (
//             <div key={i} style={{
//               display: 'flex',
//               gap: 16,
//               padding: '12px 0',
//               borderBottom: i < a.length - 1 ? '1px solid rgba(15,23,42,0.07)' : 'none'
//             }}>
//               <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 600, minWidth: 88 }}>
//                 {r.k}
//               </span>
//               <span style={{ fontSize: 13, color: 'var(--ink)' }}>
//                 {r.v}
//               </span>
//             </div>
//           ))}

//           <div style={{ marginTop: 24 }}>
//             <Link href="/research" style={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: 7,
//               fontSize: 13.5,
//               color: 'var(--navy)',
//               fontWeight: 600,
//               textDecoration: 'none',
//               borderBottom: '2px solid var(--gold)',
//               paddingBottom: 2
//             }}>
//               View related research <ArrowRight size={13} />
//             </Link>
//           </div>
//         </div>

//       </div>
//     </motion.div>
//   </div>
// </section>
//       <section className="S" style={{ background: 'var(--white)' }}>
//         <div className="W">
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 100px)', alignItems: 'start' }}>

//             <motion.div {...up(0)}>
//               <p className="lbl" style={{ marginBottom: 18 }}>Scholar · Researcher · Mentor</p>
//               <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.12, marginBottom: 24 }}>
//                 Eighteen years shaping engineers —{' '}
//                 <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>and advancing the AI frontier.</em>
//               </h2>
//               <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.82, marginBottom: 18, fontWeight: 300 }}>
//                 From lecture halls in Thane to award-winning AI research, my career is built on one belief:{' '}
//                 <strong style={{ color: 'var(--navy)', fontWeight: 600 }}>technology must solve real problems for real people.</strong>{' '}
//                 My Ph.D. research a CNN-based precision farming system was driven by India's agricultural challenges, not academic ambition alone.
//               </p>
//               <p style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.82, marginBottom: 32, fontWeight: 300 }}>
//                 Approved as Assistant Professor by both the University of Mumbai and Shivaji University Kolhapur, I have mentored 70+ student projects and supervised 10 M.E. dissertations, while publishing 15 international research papers and filing 2 utility patents.
//               </p>
//               <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--navy)', fontWeight: 600, textDecoration: 'none', borderBottom: '2px solid var(--gold)', paddingBottom: 2 }}>
//                 Full academic profile <ArrowRight size={13} />
//               </Link>
//             </motion.div>

//             <motion.div {...up(0.1)}>
//               <div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh1)' }}>
//                 <div style={{ padding: '14px 20px', background: 'var(--off)', borderBottom: '1px solid var(--ink-line)', display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <Star size={14} style={{ color: 'var(--gold)' }} />
//                   <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>Key Credentials</p>
//                 </div>
//                 {[
//                   { t: 'Ph.D. Awarded Pacific University, 2024', d: 'Thesis: CNN-Based System for Crop & Weed Classification and Density Analysis.' },
//                   { t: 'Dual University Appointment', d: 'University of Mumbai (2008, 2018) & Shivaji University Kolhapur (2014) as Assistant Professor.' },
//                   { t: 'Patent Holder (×2)', d: 'AI Crop & Weed Management System · Intelligent Malware Evasion Prevention System.' },
//                   { t: 'Copyright Holder (×2)', d: 'Plant Species CNN Software · VR Interactive Education Software registered 2024.' },
//                   { t: 'PG Recognized Teacher', d: 'Recognized by Shivaji University Kolhapur for M.E. research supervision.' },
//                   { t: 'External Examiner M.E. Dissertations', d: 'Appointed evaluator for M.E. thesis examination by Shivaji University.' },
//                 ].map((r, i, a) => (
//                   <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 20px', borderBottom: i < a.length - 1 ? '1px solid var(--ink-line)' : 'none', transition: 'background 0.15s' }}
//                     onMouseEnter={e => (e.currentTarget.style.background = 'var(--off)')}
//                     onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
//                     <CheckCircle2 size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
//                     <div>
//                       <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 2 }}>{r.t}</p>
//                       <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.58 }}>{r.d}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <hr className="rule" />

//       <section className="S" style={{ background: 'var(--off)' }}>
//         <div className="W">
//           <motion.div {...up()} style={{ marginBottom: 'clamp(36px, 5.5vh, 56px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14 }}>
//             <div>
//               <p className="lbl" style={{ marginBottom: 14 }}>Domains of Specialization</p>
//               <h2 style={{ fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1, maxWidth: 540 }}>
//                 Four Pillars of <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Deep Expertise</em>
//               </h2>
//             </div>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(255px, 1fr))', gap: 'clamp(10px, 1.5vw, 16px)' }}>
//             {PILLARS.map((p, i) => (
//               <motion.div key={i} variants={SI} className="card"
//                 style={{ padding: 'clamp(20px, 3vw, 30px)', position: 'relative', overflow: 'hidden' }}>
//                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${p.a}, var(--gold))` }} />
//                 <div style={{ width: 46, height: 46, borderRadius: 10, background: p.b, border: `1px solid ${p.a}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 4 }}>
//                   <p.I size={21} style={{ color: p.a }} />
//                 </div>
//                 <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.a, display: 'block', marginBottom: 7 }}>{p.tag}</span>
//                 <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(16px, 1.4vw, 18.5px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.28, marginBottom: 12 }}>{p.title}</h3>
//                 <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.72, marginBottom: 16 }}>{p.desc}</p>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
//                   {p.chips.map(c => <span key={c} className="tag" style={{ fontSize: 10.5 }}>{c}</span>)}
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       <hr className="rule" />

//       <section className="S" style={{ background: 'var(--white)' }}>
//         <div className="W">
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 92px)', alignItems: 'start' }}>

//             <motion.div {...up(0)}>
//               <p className="lbl" style={{ marginBottom: 16 }}>Doctoral Research · Ph.D. 2024</p>
//               <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.14, marginBottom: 20 }}>
//                 Precision Farming Through{' '}
//                 <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Convolutional Intelligence</em>
//               </h2>
//               <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.82, marginBottom: 22, fontWeight: 300 }}>
//                 <strong style={{ color: 'var(--ink-2)', fontWeight: 500 }}>Pacific University, Udaipur Awarded 2024.</strong>{' '}
//                 The thesis confronts a real agricultural crisis: fields across India are oversprayed due to inability to distinguish crops from weeds at scale. By training CNNs on annotated field imagery and applying YOLO for plant density estimation, the system automates what was previously manual reducing herbicide use and environmental damage.
//               </p>
//               {[
//                 ['Method', 'Convolutional Neural Networks (CNN)'],
//                 ['Detection', 'YOLO-based density estimation'],
//                 ['Domain', 'Precision Agriculture, Smart Farming'],
//                 ['Impact', 'Eco-targeted, reduced pesticide use'],
//                 ['Awarded', 'Pacific University, Udaipur 2024'],
//               ].map(([k, v], i) => (
//                 <div key={i} style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--ink-line)' }}>
//                   <span style={{ fontSize: 12, color: 'var(--ink-4)', minWidth: 88, flexShrink: 0, fontWeight: 500 }}>{k}</span>
//                   <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 400 }}>{v}</span>
//                 </div>
//               ))}

//               <div style={{ marginTop: 22, padding: '14px 18px', borderRadius: 10, background: 'var(--gold-pale)', border: '1.5px solid var(--gold-border)', display: 'flex', gap: 13, alignItems: 'flex-start' }}>
//                 <Shield size={17} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
//                 <div>
//                   <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>Research led to 2 filed utility patents</p>
//                   <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>AI Crop & Weed Management (2024) · Intelligent Malware Evasion Prevention (2024)</p>
//                 </div>
//               </div>

//               <div style={{ marginTop: 24 }}>
//                 <Link href="/research" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'var(--navy)', fontWeight: 600, textDecoration: 'none', borderBottom: '2px solid var(--gold)', paddingBottom: 2 }}>
//                   View all research work <ArrowRight size={13} />
//                 </Link>
//               </div>
//             </motion.div>

//             <motion.div {...up(0.1)}>
//               <div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh2)' }}>
//                 <div style={{ padding: '14px 20px', background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <div>
//                     <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 15.5, fontWeight: 600, color: '#E2E8F0' }}>Selected Publications</p>
//                     <p style={{ fontSize: 11, color: 'rgba(226,232,240,0.55)', marginTop: 2 }}>15 international journals · 7 conferences</p>
//                   </div>
//                   <Link href="/research" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--gold-3)', fontWeight: 600, textDecoration: 'none' }}>
//                     All <ExternalLink size={10} />
//                   </Link>
//                 </div>

//                 {PUBS.map((p, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 20px', borderBottom: i < PUBS.length - 1 ? '1px solid var(--ink-line)' : 'none', transition: 'background 0.15s' }}
//                     onMouseEnter={e => (e.currentTarget.style.background = 'var(--off)')}
//                     onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
//                     <span style={{ flexShrink: 0, alignSelf: 'flex-start', padding: '3px 9px', borderRadius: 4, background: `${p.c}12`, border: `1px solid ${p.c}28`, fontSize: 9.5, color: p.c, fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{p.tag}</span>
//                     <div>
//                       <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.42, marginBottom: 3 }}>{p.title}</p>
//                       <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>{p.info}</p>
//                     </div>
//                   </div>
//                 ))}

//                 <div style={{ display: 'flex', gap: 22, padding: '14px 20px', background: 'var(--off)', flexWrap: 'wrap', borderTop: '1px solid var(--ink-line)' }}>
//                   {[['15', 'Journals'], ['07', 'Conf.'], ['02', 'Patents'], ['02', 'Copyrights']].map(([n, l]) => (
//                     <div key={l}>
//                       <p className="sn" style={{ fontSize: 26, lineHeight: 1 }}>{n}</p>
//                       <p style={{ fontSize: 9.5, color: 'var(--ink-4)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 3 }}>{l}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <hr className="rule" />

//       <section style={{ background: 'var(--navy)', padding: 'clamp(56px, 9vh, 92px) 0', position: 'relative', overflow: 'hidden' }}>
//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 75% 50%, rgba(184,135,10,0.07) 0%, transparent 55%), radial-gradient(circle at 25% 50%, rgba(255,255,255,0.03) 0%, transparent 55%)', pointerEvents: 'none' }} />

//         <div className="W" style={{ position: 'relative' }}>
//           <motion.div {...up()} style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vh, 52px)' }}>
//             <p className="lbl" style={{ color: 'var(--gold-3)', justifyContent: 'center', marginBottom: 14 }}>Intellectual Property</p>
//             <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 4vw, 50px)', fontWeight: 700, color: '#E2E8F0', lineHeight: 1.1 }}>
//               Patents, Copyrights &{' '}
//               <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 500 }}>Registered IP</em>
//             </h2>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(10px, 1.5vw, 16px)' }}>
//             {[
//               { I: Shield, c: 'var(--gold-3)', t: 'Patent · 2024', title: 'AI-Based Crop & Weed Management System', d: 'Application No: 202421045939 · Published', href: '/research/patents' },
//               { I: Shield, c: '#6B95D8', t: 'Patent · 2024', title: 'Intelligent Malware Evasion Prevention System', d: 'Application No: 202421069724 · Published Oct 2024', href: '/research/patents' },
//               { I: Award, c: 'var(--gold-3)', t: 'Copyright · 2024', title: 'Plant Species & Weed Classification CNN Software', d: 'Diary No: 14704/2024-CO/SW · May 2024', href: '/achievements/certificates' },
//               { I: Award, c: '#6BD8B8', t: 'Copyright · 2024', title: 'VR Solution for Interactive Online Education', d: 'Diary No: 25004/2024-CO/SW · Dec 2024', href: '/achievements/certificates' },
//             ].map((r, i) => (
//               <motion.div key={i} variants={SI}
//                 style={{ padding: 'clamp(18px, 2.5vw, 26px)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', transition: 'transform 0.2s, background 0.2s, border-color 0.2s', cursor: 'default' }}
//                 onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(184,135,10,0.10)'; el.style.borderColor = 'rgba(184,135,10,0.30)'; el.style.transform = 'translateY(-3px)' }}
//                 onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
//                   <div style={{ width: 40, height: 40, borderRadius: 9, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <r.I size={18} style={{ color: r.c }} />
//                   </div>
//                   <span style={{ fontSize: 9.5, padding: '2px 9px', borderRadius: 4, background: 'rgba(184,135,10,0.15)', border: '1px solid rgba(184,135,10,0.25)', color: 'var(--gold-3)', fontWeight: 700, letterSpacing: '0.06em' }}>{r.t}</span>
//                 </div>
//                 <p style={{ fontSize: 13.5, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.4, marginBottom: 7 }}>{r.title}</p>
//                 <p style={{ fontSize: 11, color: 'rgba(226,232,240,0.40)', marginBottom: 16 }}>{r.d}</p>
//                 <Link href={r.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--gold-3)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(212,168,32,0.35)', paddingBottom: 1 }}>
//                   View details <ArrowRight size={11} />
//                 </Link>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       <section className="S" style={{ background: 'var(--white)' }}>
//         <div className="W">
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 92px)', alignItems: 'center' }}>

//             <motion.div {...up(0)}>
//               <p className="lbl" style={{ marginBottom: 18 }}>Teaching Philosophy</p>
//               <div style={{ borderLeft: '4px solid var(--gold)', paddingLeft: 22, marginBottom: 28 }}>
//                 <Quote size={22} style={{ color: 'var(--gold)', opacity: 0.5, marginBottom: 10 }} />
//                 <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(18px, 2.2vw, 25px)', fontStyle: 'italic', fontWeight: 400, color: 'var(--navy)', lineHeight: 1.5 }}>
//                   "My goal is not to fill a student's notebook it is to ignite the curiosity that fills a career."
//                 </p>
//               </div>
//               <p style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.82, marginBottom: 28, fontWeight: 300 }}>
//                 Across 18 years and three universities, my pedagogy centres on Project-Based Learning: students design, build, fail, and iterate on real engineering challenges. Technical mastery is built through wrestling with real problems, not through passive absorption of theory. My courses in AI, Computer Networks, DBMS, and Theory of Computation consistently integrate hands-on innovation.
//               </p>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
//                 {['Data Structures', 'Computer Networks', 'DBMS', 'AI/ML', 'Deep Learning', 'Computer Vision', 'Theory of Computation'].map(s => (
//                   <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>
//                 ))}
//               </div>
//               <Link href="/teaching" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'var(--navy)', fontWeight: 600, textDecoration: 'none', borderBottom: '2px solid var(--gold)', paddingBottom: 2 }}>
//                 Full teaching portfolio <ArrowRight size={13} />
//               </Link>
//             </motion.div>

//             <motion.div {...up(0.1)}>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//                 {[
//                   { I: Users, v: '60+', l: 'UG Project Groups Guided' },
//                   { I: GraduationCap, v: '10', l: 'M.E. Students Supervised' },
//                   { I: BookOpen, v: '18+', l: 'Years in the Classroom' },
//                   { I: FileText, v: '15', l: "Int'l Publications" },
//                 ].map((s, i) => (
//                   <motion.div key={i} initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }}
//                     className="card" style={{ padding: 'clamp(18px, 3vw, 26px)', textAlign: 'center' }}>
//                     <div style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--navy-pale)', border: '1px solid var(--navy-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
//                       <s.I size={18} style={{ color: 'var(--navy)' }} />
//                     </div>
//                     <p className="sn" style={{ fontSize: 36, lineHeight: 1, marginBottom: 7 }}>{s.v}</p>
//                     <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.42 }}>{s.l}</p>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <section style={{ background: 'var(--off)', padding: 'clamp(72px, 12vh, 120px) 0', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--ink-line)' }}>
//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
//         <div style={{ position: 'absolute', top: '50%', left: -40, transform: 'translateY(-50%)', fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(80px, 18vw, 220px)', color: 'var(--navy-pale)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>AI</div>

//         <div className="W" style={{ position: 'relative', textAlign: 'center' }}>
//           <motion.div {...up()}>
//             <p className="lbl" style={{ justifyContent: 'center', marginBottom: 16 }}>Open to Collaboration</p>
//             <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5.5vw, 70px)', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.05, letterSpacing: '-0.025em', maxWidth: 800, margin: '0 auto 20px' }}>
//               Let's Build Something{' '}
//               <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 600 }}>Meaningful</em>{' '}
//               Together
//             </h2>
//             <p style={{ fontSize: 'clamp(14px, 1.3vw, 17px)', color: 'var(--ink-3)', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 44px', fontWeight: 300 }}>
//               Open to research collaborations, conference invitations, AI & ML consultancy, academic partnerships, and student mentorship in Computer Engineering.
//             </p>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
//               <Link href="/contact" className="btn-navy" style={{ padding: '13px 28px', fontSize: 14 }}>
//                 Start a Conversation <ArrowRight size={15} />
//               </Link>
//               <a href="mailto:sachintakmare@gmail.com" className="btn-out" style={{ padding: '13px 28px', fontSize: 14 }}>
//                 <Mail size={14} /> sachintakmare@gmail.com
//               </a>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       <style>{`
//         @media (max-width: 700px) { .hg { grid-template-columns: 1fr !important; } }
//         @media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }
//         @media (max-width: 440px) { .S { padding-top: 52px !important; padding-bottom: 52px !important; } }
//       `}</style>
//     </>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MapPin,
  ChevronDown,
  Brain,
  Leaf,
  Microscope,
  School,
  Users,
  BookOpen,
  Shield,
  Award,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  FileText,
  Quote,
  Star,
} from "lucide-react";

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as any },
});
const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.085 } } };
const SI = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const TIMELINE = [
  {
    y: "2025 – Present",
    role: "Assistant Professor, Computer Engineering",
    org: "D. Y. Patil College of Engineering & Technology",
    city: "Kolhapur",
    note: "Current position",
    current: true,
    c: "#0D1F3C",
  },
  {
    y: "2017 – 2024",
    role: "Assistant Professor, Computer Science & Engg.",
    org: "A. P. Shah Institute of Technology",
    city: "Thane",
    note: "PBL In-charge · NBA Criteria-3 Coordinator · Innovation Cell",
    c: "#1A3560",
  },
  {
    y: "2013 – 2017",
    role: "Assistant Professor & Head of Department",
    org: "Bharati Vidyapeeth's College of Engineering",
    city: "Kolhapur",
    note: "HOD · PG Recognized Teacher (Shivaji Univ.) · Asst. CAP Director",
    c: "#B8870A",
  },
  {
    y: "2007 – 2012",
    role: "Lecturer & Assistant Professor",
    org: "Parshavanath College of Engineering",
    city: "Thane",
    note: 'Technical Coordinator "NEXUS" National Event · Sports In-charge',
    c: "#2D5B8A",
  },
];

const PUBS = [
  {
    tag: "IJISAE 2024",
    c: "#0D1F3C",
    title:
      "Transforming Farming with CNNs: Accurate Crop and Weed Classification",
    info: "Vol. 12, Issue 4 · pp. 1484–1490 · ISSN 2147-6799",
  },
  {
    tag: "IEEE INOCON",
    c: "#1A6B48",
    title: "MetaCampus: Advancing Online Education with Virtual Classroom",
    info: "IEEE 2024 · 979-8-3503-8193-1/24",
  },
  {
    tag: "IJOEAR 2024",
    c: "#2D5B8A",
    title:
      "Estimating Crop and Weed Density Using YOLO for Precision Agriculture",
    info: "Vol. 6, Issue 10 · pp. 14–25 · ISSN 2454-1850",
  },
  {
    tag: "IEEE WCONF",
    c: "#B8870A",
    title: "Dodging Turtis NFT Gaming on Blockchain",
    info: "IEEE 2023 · 979-8-3503-1120-4/23",
  },
  {
    tag: "IJCSE 2024",
    c: "#5C3A1A",
    title: "A Deep Learning Approach to Efficient Crop and Weed Classification",
    info: "Vol. 12, Issue 6 · pp. 30–43 · E-ISSN 2347-2693",
  },
];

const EXPERTISE = [
  { label: "Deep Learning", color: "#0D1F3C" },
  { label: "NLP", color: "#1A6B48" },
  { label: "AI & ML", color: "#2D5B8A" },
  { label: "Data Science", color: "#7A5500" },
  { label: "Computer Vision", color: "#5C3A8A" },
  { label: "Core CS Concepts", color: "#1A3560" },
];

export default function HomePage() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);

  return (
    <>
      <section
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          background: "var(--white)",
          paddingTop: "var(--nav-h)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `
            radial-gradient(ellipse 70% 60% at 95% 10%, rgba(212,168,32,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 55% 55% at 85% 35%, rgba(184,135,10,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 60% 60% at 5%  80%, rgba(45,91,138,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 45% at 15% 50%, rgba(13,31,60,0.04) 0%, transparent 50%)
          `,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "var(--nav-h)",
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold-3) 50%, var(--gold) 80%, transparent 100%)",
          }}
        />

        <div
          className="W"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "clamp(44px, 8vh, 96px) clamp(18px, 5vw, 80px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 0.85fr)",
              gap: "clamp(40px, 7vw, 108px)",
              alignItems: "center",
              width: "100%",
            }}
            className="hg"
          >
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: m ? 1 : 0, y: m ? 0 : 36 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 14px 5px 8px",
                  borderRadius: 100,
                  border: "1px solid var(--gold-border)",
                  background: "var(--gold-pale)",
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <GraduationCap size={12} color="#fff" />
                </span>
                <span style={{ fontSize: 10.5, color: "var(--gold)" }}>
                  Ph.D. · Computer Engineering · 18+ Years
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "clamp(50px, 8vw, 100px)",
                  fontWeight: 800,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "var(--navy)",
                  marginBottom: 6,
                }}
              >
                Dr. Sachin
              </h1>
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "clamp(50px, 8vw, 100px)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  color: "var(--gold)",
                  marginBottom: 30,
                }}
              >
                Takmare
              </h1>

              <p
                style={{
                  fontSize: "clamp(15px, 1.5vw, 18px)",
                  color: "var(--ink-2)",
                  lineHeight: 1.68,
                  maxWidth: 510,
                  marginBottom: 10,
                }}
              >
                <strong style={{ color: "var(--navy)", fontWeight: 700 }}>
                  Assistant Professor, Computer Science -{" "}
                </strong>{" "}
                D. Y. Patil College of Engineering & Technology, Kolhapur.
              </p>
              <p
                style={{
                  fontSize: "clamp(13px, 1.15vw, 15.5px)",
                  color: "var(--ink-3)",
                  lineHeight: 1.8,
                  maxWidth: 488,
                  marginBottom: 24,
                  fontWeight: 300,
                  textAlign: "justify",
                }}
              >
                AI & Deep Learning researcher. Ph.D. awarded 2024 for CNN-based
                precision farming. Author of 15 peer-reviewed journals,
                presenter at 7 international conferences, holder of 2 utility
                patents, and mentor to 70+ student projects across 18 years.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: "var(--ink-3)",
                  }}
                >
                  <MapPin size={11} style={{ color: "var(--gold)" }} />{" "}
                  Kolhapur, Maharashtra
                </span>
                <span
                  style={{
                    width: 1,
                    height: 12,
                    background: "var(--ink-line)",
                  }}
                />
                <span className="tag tag-gold" style={{ fontSize: 10.5 }}>
                  Open to Collaboration
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <Link href="/research" className="btn-navy">
                  Explore Research <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-out">
                  Contact
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{
                opacity: m ? 1 : 0,
                scale: m ? 1 : 0.92,
                y: m ? 0 : 20,
              }}
              transition={{
                duration: 1.0,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{ width: "100%", maxWidth: 400, position: "relative" }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -14,
                    borderRadius: 18,
                    border: "1.5px solid var(--gold-border)",
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: -6,
                    borderRadius: 15,
                    border: "1px solid var(--ink-line)",
                  }}
                />

                <div
                  className="card"
                  style={{ overflow: "hidden", boxShadow: "var(--sh3)" }}
                >
                  <div
                    style={{
                      height: 4,
                      background:
                        "linear-gradient(90deg, var(--navy) 0%, var(--navy-2) 40%, var(--gold) 100%)",
                    }}
                  />

                  <div
                    style={{
                      aspectRatio: "4/3",
                      background:
                        "linear-gradient(135deg, var(--off) 0%, var(--off2) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: 96,
                          height: 96,
                          borderRadius: "50%",
                          background: "var(--navy-pale)",
                          border: "3px solid var(--navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 10px",
                          boxShadow: "0 0 28px var(--navy-glow)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Playfair Display, serif",
                            fontSize: 34,
                            fontWeight: 700,
                            color: "var(--navy)",
                          }}
                        >
                          ST
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 10.5,
                          color: "var(--ink-4)",
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                        }}
                      >
                        Add profile.image
                      </p>
                    </div>
                    <span
                      className="tag tag-navy"
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: 14,
                        fontSize: 10.5,
                      }}
                    >
                      Computer Engineering
                    </span>
                  </div>

                  <div style={{ padding: "18px 20px" }}>
                    <p
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: 19,
                        fontWeight: 600,
                        color: "var(--navy)",
                        marginBottom: 3,
                      }}
                    >
                      Dr. Sachin B. Takmare
                    </p>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "var(--ink-3)",
                        marginBottom: 14,
                      }}
                    >
                      Ph.D. (2024) · M.Tech · B.E. · Assistant Professor
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {[
                        "Computer Science",
                        "AI/ML",
                        "Deep Learning",
                        "NLP",
                      ].map((t) => (
                        <span
                          key={t}
                          className="tag"
                          style={{ fontSize: 10.5 }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: -22,
                    padding: "9px 14px",
                    borderRadius: 10,
                    background: "#fff",
                    border: "1px solid var(--gold-border)",
                    boxShadow: "var(--sh2)",
                    textAlign: "center",
                    zIndex: 2,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  >
                    Ph.D.
                  </p>
                  <p
                    style={{
                      fontSize: 9,
                      color: "var(--ink-4)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: 3,
                    }}
                  >
                    2024
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: "var(--navy)",
          padding: "clamp(36px, 6vh, 60px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, var(--gold-3), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />

        <div className="W" style={{ position: "relative" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ST}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.10)",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {[
              { n: "18+", l: "Years Teaching", s: "UGC Approved" },
              { n: "15", l: "Int'l Journals", s: "Peer Reviewed" },
              { n: "07", l: "Conferences", s: "International" },
              { n: "70+", l: "Projects Guided", s: "UG & PG Both" },
              { n: "02", l: "Patents Filed", s: "Utility Patents" },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={SI}
                style={{
                  padding: "clamp(22px, 3.5vw, 36px) clamp(10px, 2vw, 18px)",
                  textAlign: "center",
                  background: "rgba(13,31,60,0.6)",
                  cursor: "default",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(184,135,10,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(13,31,60,0.6)")
                }
              >
                <p
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "clamp(34px, 4.8vw, 56px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "var(--gold-3)",
                    marginBottom: 6,
                  }}
                >
                  {s.n}
                </p>
                <p
                  style={{
                    fontSize: "clamp(11px, 1vw, 13px)",
                    fontWeight: 600,
                    color: "#E2E8F0",
                    marginBottom: 3,
                  }}
                >
                  {s.l}
                </p>
                <p
                  style={{
                    fontSize: "9.5px",
                    color: "rgba(226,232,240,0.45)",
                    letterSpacing: "0.07em",
                  }}
                >
                  {s.s}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        style={{
          background: "var(--white)",
          padding: "clamp(48px, 8vh, 80px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,135,10,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="W" style={{ position: "relative" }}>
          <motion.div
            {...up()}
            style={{ marginBottom: "clamp(24px, 4vh, 40px)" }}
          >
            <p className="lbl" style={{ marginBottom: 0 }}>
              Pinnacle Achievement
            </p>
          </motion.div>
          <motion.div {...up(0.1)}>
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: "1.5px solid rgba(184,135,10,0.30)",
                boxShadow:
                  "0 20px 60px rgba(13,31,60,0.13), 0 4px 16px rgba(13,31,60,0.07)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}
            >
              <div
                style={{
                  background: "#0D1F3C",
                  padding: "clamp(28px, 4vw, 52px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background:
                      "linear-gradient(90deg, var(--gold), var(--gold-3))",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      background: "rgba(184,135,10,0.15)",
                      border: "1px solid rgba(184,135,10,0.30)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GraduationCap
                      size={24}
                      style={{ color: "var(--gold-3)" }}
                    />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--gold-3)",
                        display: "block",
                      }}
                    >
                      Academic
                    </span>
                    <span
                      style={{ fontSize: 11, color: "rgba(226,232,240,0.45)" }}
                    >
                      Awarded 2024
                    </span>
                  </div>
                </div>
                <h2
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 700,
                    color: "#F0F4F8",
                    lineHeight: 1.18,
                    marginBottom: 16,
                  }}
                >
                  Doctor of Philosophy (Ph.D.)
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(226,232,240,0.65)",
                    lineHeight: 1.78,
                    marginBottom: 24,
                  }}
                >
                  Doctoral degree awarded for the thesis "Precision Farming:
                  CNN-Based System for Crop and Weed Classification and Density
                  Analysis". The research developed a deep learning pipeline
                  automating crop-weed identification from field imagery,
                  resulting in 2 international publications and a filed utility
                  patent.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    "Doctorate",
                    "AI Research",
                    "Precision Agriculture",
                    "CNN",
                  ].map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 100,
                        fontSize: 11,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(226,232,240,0.65)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "var(--off)",
                  padding: "clamp(28px, 4vw, 52px)",
                }}
              >
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: 20,
                  }}
                >
                  Award Details
                </p>
                {[
                  { k: "Degree", v: "Doctor of Philosophy (Ph.D.)" },
                  { k: "Institution", v: "Pacific University, Udaipur" },
                  { k: "Year", v: "2024 — Awarded" },
                  {
                    k: "Thesis",
                    v: "Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis",
                  },
                  { k: "Method", v: "CNN + Computer Vision Pipeline" },
                  {
                    k: "Outcome",
                    v: "2 International Publications · 1 Utility Patent Filed",
                  },
                ].map((r, i, a) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "12px 0",
                      borderBottom:
                        i < a.length - 1
                          ? "1px solid rgba(15,23,42,0.07)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--ink-4)",
                        fontWeight: 600,
                        minWidth: 88,
                      }}
                    >
                      {r.k}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--ink)" }}>
                      {r.v}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 24 }}>
                  <Link
                    href="/research"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      fontSize: 13.5,
                      color: "var(--navy)",
                      fontWeight: 600,
                      textDecoration: "none",
                      borderBottom: "2px solid var(--gold)",
                      paddingBottom: 2,
                    }}
                  >
                    View related research <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="S" style={{ background: "var(--white)" }}>
        <div className="W">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(40px, 7vw, 100px)",
              alignItems: "start",
            }}
          >
            <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 18 }}>
                Scholar · Researcher · Mentor
              </p>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 52px)",
                  fontWeight: 700,
                  color: "var(--navy)",
                  lineHeight: 1.12,
                  marginBottom: 24,
                }}
              >
                Eighteen years shaping engineers —{" "}
                <em
                  style={{
                    color: "var(--gold)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  and advancing the AI frontier.
                </em>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--ink-2)",
                  lineHeight: 1.82,
                  marginBottom: 18,
                  fontWeight: 300,
                }}
              >
                From lecture halls in Thane to award-winning AI research, my
                career is built on one belief:{" "}
                <strong style={{ color: "var(--navy)", fontWeight: 600 }}>
                  technology must solve real problems for real people.
                </strong>{" "}
                My Ph.D. research a CNN-based precision farming system was
                driven by India's agricultural challenges, not academic ambition
                alone.
              </p>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--ink-3)",
                  lineHeight: 1.82,
                  marginBottom: 32,
                  fontWeight: 300,
                }}
              >
                Approved as Assistant Professor by both the University of Mumbai
                and Shivaji University Kolhapur, I have mentored 70+ student
                projects and supervised 10 M.E. dissertations, while publishing
                15 international research papers and filing 2 utility patents.
              </p>
              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13.5,
                  color: "var(--navy)",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "2px solid var(--gold)",
                  paddingBottom: 2,
                }}
              >
                Full academic profile <ArrowRight size={13} />
              </Link>
            </motion.div>
            <motion.div {...up(0.1)}>
              <div
                className="card"
                style={{ overflow: "hidden", boxShadow: "var(--sh1)" }}
              >
                <div
                  style={{
                    padding: "14px 20px",
                    background: "var(--off)",
                    borderBottom: "1px solid var(--ink-line)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Star size={14} style={{ color: "var(--gold)" }} />
                  <p
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--navy)",
                    }}
                  >
                    Key Credentials
                  </p>
                </div>
                {[
                  {
                    t: "Ph.D. Awarded Pacific University, 2024",
                    d: "Thesis: CNN-Based System for Crop & Weed Classification and Density Analysis.",
                  },
                  {
                    t: "Dual University Appointment",
                    d: "University of Mumbai (2008, 2018) & Shivaji University Kolhapur (2014) as Assistant Professor.",
                  },
                  {
                    t: "Patent Holder (×2)",
                    d: "AI Crop & Weed Management System · Intelligent Malware Evasion Prevention System.",
                  },
                  {
                    t: "Copyright Holder (×2)",
                    d: "Plant Species CNN Software · VR Interactive Education Software registered 2024.",
                  },
                  {
                    t: "PG Recognized Teacher",
                    d: "Recognized by Shivaji University Kolhapur for M.E. research supervision.",
                  },
                  {
                    t: "External Examiner M.E. Dissertations",
                    d: "Appointed evaluator for M.E. thesis examination by Shivaji University.",
                  },
                ].map((r, i, a) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "13px 20px",
                      borderBottom:
                        i < a.length - 1 ? "1px solid var(--ink-line)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--off)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <CheckCircle2
                      size={14}
                      style={{
                        color: "var(--gold)",
                        flexShrink: 0,
                        marginTop: 3,
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--navy)",
                          marginBottom: 2,
                        }}
                      >
                        {r.t}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--ink-3)",
                          lineHeight: 1.58,
                        }}
                      >
                        {r.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="S" style={{ background: "var(--off)" }}>
        <div className="W">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(32px, 6vw, 80px)",
              alignItems: "center",
            }}
          >
            {/* Left — heading + description */}
            <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 14 }}>
                Domains of Specialization
              </p>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 50px)",
                  fontWeight: 700,
                  color: "var(--navy)",
                  lineHeight: 1.1,
                  marginBottom: 18,
                }}
              >
                Areas of{" "}
                <em
                  style={{
                    color: "var(--gold)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  Deep Expertise
                </em>
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--ink-3)",
                  lineHeight: 1.78,
                  marginBottom: 28,
                  fontWeight: 300,
                }}
              >
                Research and teaching spanning the full spectrum of modern
                Computer Science — from foundational theory to cutting-edge deep
                learning, applied across agriculture, healthcare, cybersecurity,
                and education.
              </p>
              <Link
                href="/teaching"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13.5,
                  color: "var(--navy)",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "2px solid var(--gold)",
                  paddingBottom: 2,
                }}
              >
                View teaching portfolio <ArrowRight size={13} />
              </Link>
            </motion.div>

            {/* Right — expertise grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={ST}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  {
                    label: "Deep Learning",
                    color: "#0D1F3C",
                    bg: "var(--navy-pale)",
                    border: "var(--navy-glow)",
                    sub: "CNN · RNN · Transformers",
                    I: Brain,
                  },
                  {
                    label: "AI & ML",
                    color: "#1A6B48",
                    bg: "rgba(26,107,72,0.08)",
                    border: "rgba(26,107,72,0.20)",
                    sub: "Supervised · Unsupervised · Reinforcement",
                    I: Leaf,
                  },
                  {
                    label: "Computer Vision",
                    color: "#2D5B8A",
                    bg: "rgba(45,91,138,0.08)",
                    border: "rgba(45,91,138,0.20)",
                    sub: "YOLO · CNN Pipelines · Image Classification",
                    I: Microscope,
                  },
                  {
                    label: "NLP",
                    color: "#5C3A8A",
                    bg: "rgba(92,58,138,0.07)",
                    border: "rgba(92,58,138,0.18)",
                    sub: "Language Models · Text Analysis · Semantics",
                    I: BookOpen,
                  },
                  {
                    label: "Data Science",
                    color: "#7A5500",
                    bg: "rgba(122,85,0,0.07)",
                    border: "rgba(122,85,0,0.18)",
                    sub: "Analytics · Visualisation · Statistical Modelling",
                    I: FileText,
                  },
                  {
                    label: "Core CS Concepts",
                    color: "#1A3560",
                    bg: "rgba(26,53,96,0.07)",
                    border: "rgba(26,53,96,0.18)",
                    sub: "DS & Algo · OS · Networks · DBMS · TOC",
                    I: School,
                  },
                ].map((ex, i) => (
                  <motion.div
                    key={ex.label}
                    variants={SI}
                    style={{
                      padding: "clamp(14px, 2vw, 18px)",
                      borderRadius: 11,
                      background: "#fff",
                      border: `1px solid ${ex.border}`,
                      transition:
                        "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-3px)";
                      el.style.boxShadow = "var(--sh2)";
                      el.style.borderColor = `${ex.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(0)";
                      el.style.boxShadow = "none";
                      el.style.borderColor = ex.border;
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: ex.bg,
                        border: `1px solid ${ex.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 10,
                      }}
                    >
                      <ex.I size={16} style={{ color: ex.color }} />
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: ex.color,
                        marginBottom: 4,
                        lineHeight: 1.2,
                      }}
                    >
                      {ex.label}
                    </p>
                    <p
                      style={{
                        fontSize: 10.5,
                        color: "var(--ink-4)",
                        lineHeight: 1.55,
                      }}
                    >
                      {ex.sub}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="S" style={{ background: "var(--white)" }}>
        <div className="W">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(40px, 7vw, 92px)",
              alignItems: "start",
            }}
          >
            {/* <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 16 }}>Doctoral Research · Ph.D. 2024</p>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.14, marginBottom: 20 }}>
                Precision Farming Through{' '}
                <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Convolutional Intelligence</em>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.82, marginBottom: 22, fontWeight: 300 }}>
                <strong style={{ color: 'var(--ink-2)', fontWeight: 500 }}>Pacific University, Udaipur Awarded 2024.</strong>{' '}
                The thesis confronts a real agricultural crisis: fields across India are oversprayed due to inability to distinguish crops from weeds at scale. By training CNNs on annotated field imagery and applying YOLO for plant density estimation, the system automates what was previously manual reducing herbicide use and environmental damage.
              </p>
              {[
                ['Method',   'Convolutional Neural Networks (CNN)'],
                ['Detection','YOLO-based density estimation'],
                ['Domain',   'Precision Agriculture, Smart Farming'],
                ['Impact',   'Eco-targeted, reduced pesticide use'],
                ['Awarded',  'Pacific University, Udaipur 2024'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--ink-line)' }}>
                  <span style={{ fontSize: 12, color: 'var(--ink-4)', minWidth: 88, flexShrink: 0, fontWeight: 500 }}>{k}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 400 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 22, padding: '14px 18px', borderRadius: 10, background: 'var(--gold-pale)', border: '1.5px solid var(--gold-border)', display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                <Shield size={17} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>Research led to 2 filed utility patents</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>AI Crop & Weed Management (2024) · Intelligent Malware Evasion Prevention (2024)</p>
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <Link href="/research" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'var(--navy)', fontWeight: 600, textDecoration: 'none', borderBottom: '2px solid var(--gold)', paddingBottom: 2 }}>
                  View all research work <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div> */}
            <motion.div {...up(0)}>
              {/* Label */}
              <p className="lbl" style={{ marginBottom: 16 }}>
                Research Overview
              </p>

              {/* Title */}
              <h2
                style={{
                  fontSize: "clamp(26px, 3.5vw, 44px)",
                  fontWeight: 700,
                  color: "var(--navy)",
                  lineHeight: 1.14,
                  marginBottom: 20,
                }}
              >
                Advancing Intelligent Systems Through{" "}
                <em
                  style={{
                    color: "var(--gold)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  Applied Artificial Intelligence
                </em>
              </h2>

              {/* Description */}
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ink-3)",
                  lineHeight: 1.82,
                  marginBottom: 22,
                  fontWeight: 300,
                }}
              >
                The research focuses on designing scalable and efficient
                AI-driven systems that solve real-world problems through
                data-centric approaches. It combines deep learning, computer
                vision, and intelligent automation to build models capable of
                understanding complex patterns, enabling smarter decision-making
                across domains.
              </p>

              {/* Key Areas */}
              {[
                ["Core Area", "Artificial Intelligence & Machine Learning"],
                [
                  "Tech Stack",
                  "Deep Learning, Computer Vision, Neural Networks",
                ],
                ["Approach", "Data-driven modeling & intelligent automation"],
                ["Applications", "Smart systems, analytics, and optimization"],
                ["Focus", "Scalability, accuracy, and real-world usability"],
              ].map(([k, v], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "9px 0",
                    borderBottom: "1px solid var(--ink-line)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--ink-4)",
                      minWidth: 110,
                      flexShrink: 0,
                      fontWeight: 500,
                    }}
                  >
                    {k}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--ink)",
                      fontWeight: 400,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}

              {/* Highlight Box */}
              <div
                style={{
                  marginTop: 22,
                  padding: "14px 18px",
                  borderRadius: 10,
                  background: "var(--off)",
                  border: "1.5px solid var(--ink-line)",
                  display: "flex",
                  gap: 13,
                  alignItems: "flex-start",
                }}
              >
                <Shield
                  size={17}
                  style={{ color: "var(--navy)", flexShrink: 0, marginTop: 2 }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "var(--navy)",
                      marginBottom: 4,
                    }}
                  >
                    Research Direction
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--ink-2)",
                      lineHeight: 1.6,
                    }}
                  >
                    Focused on developing intelligent models that bridge the gap
                    between theoretical AI concepts and practical real-world
                    applications with measurable impact.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: 24 }}>
                <Link
                  href="/research"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 13.5,
                    color: "var(--navy)",
                    fontWeight: 600,
                    textDecoration: "none",
                    borderBottom: "2px solid var(--gold)",
                    paddingBottom: 2,
                  }}
                >
                  View detailed research work <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
            <motion.div {...up(0.1)}>
              <div
                className="card"
                style={{ overflow: "hidden", boxShadow: "var(--sh2)" }}
              >
                <div
                  style={{
                    padding: "14px 20px",
                    background: "var(--navy)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: 15.5,
                        fontWeight: 600,
                        color: "#E2E8F0",
                      }}
                    >
                      Selected Publications
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(226,232,240,0.55)",
                        marginTop: 2,
                      }}
                    >
                      15 international journals · 7 conferences
                    </p>
                  </div>
                  <Link
                    href="/research"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "var(--gold-3)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    All <ExternalLink size={10} />
                  </Link>
                </div>
                {PUBS.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "13px 20px",
                      borderBottom:
                        i < PUBS.length - 1
                          ? "1px solid var(--ink-line)"
                          : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--off)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        alignSelf: "flex-start",
                        padding: "3px 9px",
                        borderRadius: 4,
                        background: `${p.c}12`,
                        border: `1px solid ${p.c}28`,
                        fontSize: 9.5,
                        color: p.c,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.tag}
                    </span>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--navy)",
                          lineHeight: 1.42,
                          marginBottom: 3,
                        }}
                      >
                        {p.title}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--ink-4)" }}>
                        {p.info}
                      </p>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    gap: 22,
                    padding: "14px 20px",
                    background: "var(--off)",
                    flexWrap: "wrap",
                    borderTop: "1px solid var(--ink-line)",
                  }}
                >
                  {[
                    ["15", "Journals"],
                    ["07", "Conf."],
                    ["02", "Patents"],
                    ["02", "Copyrights"],
                  ].map(([n, l]) => (
                    <div key={l}>
                      <p className="sn" style={{ fontSize: 26, lineHeight: 1 }}>
                        {n}
                      </p>
                      <p
                        style={{
                          fontSize: 9.5,
                          color: "var(--ink-4)",
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          marginTop: 3,
                        }}
                      >
                        {l}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section
        style={{
          background: "var(--navy)",
          padding: "clamp(56px, 9vh, 92px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 75% 50%, rgba(184,135,10,0.07) 0%, transparent 55%), radial-gradient(circle at 25% 50%, rgba(255,255,255,0.03) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div className="W" style={{ position: "relative" }}>
          <motion.div
            {...up()}
            style={{
              textAlign: "center",
              marginBottom: "clamp(32px, 5vh, 52px)",
            }}
          >
            <p
              className="lbl"
              style={{
                color: "var(--gold-3)",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              Intellectual Property
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(26px, 4vw, 50px)",
                fontWeight: 700,
                color: "#E2E8F0",
                lineHeight: 1.1,
              }}
            >
              Patents, Copyrights &{" "}
              <em
                style={{
                  color: "var(--gold-3)",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                Registered IP
              </em>
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ST}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "clamp(10px, 1.5vw, 16px)",
            }}
          >
            {[
              {
                I: Shield,
                c: "var(--gold-3)",
                t: "Patent · 2024",
                title: "AI-Based Crop & Weed Management System",
                d: "Application No: 202421045939 · Published",
                href: "/research/patents",
              },
              {
                I: Shield,
                c: "#6B95D8",
                t: "Patent · 2024",
                title: "Intelligent Malware Evasion Prevention System",
                d: "Application No: 202421069724 · Published Oct 2024",
                href: "/research/patents",
              },
              {
                I: Award,
                c: "var(--gold-3)",
                t: "Copyright · 2024",
                title: "Plant Species & Weed Classification CNN Software",
                d: "Diary No: 14704/2024-CO/SW · May 2024",
                href: "/achievements/certificates",
              },
              {
                I: Award,
                c: "#6BD8B8",
                t: "Copyright · 2024",
                title: "VR Solution for Interactive Online Education",
                d: "Diary No: 25004/2024-CO/SW · Dec 2024",
                href: "/achievements/certificates",
              },
            ].map((r, i) => (
              <motion.div
                key={i}
                variants={SI}
                style={{
                  padding: "clamp(18px, 2.5vw, 26px)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  transition:
                    "transform 0.2s, background 0.2s, border-color 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(184,135,10,0.10)";
                  el.style.borderColor = "rgba(184,135,10,0.30)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <r.I size={18} style={{ color: r.c }} />
                  </div>
                  <span
                    style={{
                      fontSize: 9.5,
                      padding: "2px 9px",
                      borderRadius: 4,
                      background: "rgba(184,135,10,0.15)",
                      border: "1px solid rgba(184,135,10,0.25)",
                      color: "var(--gold-3)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {r.t}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#E2E8F0",
                    lineHeight: 1.4,
                    marginBottom: 7,
                  }}
                >
                  {r.title}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(226,232,240,0.40)",
                    marginBottom: 16,
                  }}
                >
                  {r.d}
                </p>
                <Link
                  href={r.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: "var(--gold-3)",
                    fontWeight: 600,
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(212,168,32,0.35)",
                    paddingBottom: 1,
                  }}
                >
                  View details <ArrowRight size={11} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="S" style={{ background: "var(--white)" }}>
        <div className="W">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(40px, 7vw, 92px)",
              alignItems: "center",
            }}
          >
            <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 18 }}>
                Teaching Philosophy
              </p>
              <div
                style={{
                  borderLeft: "4px solid var(--gold)",
                  paddingLeft: 22,
                  marginBottom: 28,
                }}
              >
                <Quote
                  size={22}
                  style={{
                    color: "var(--gold)",
                    opacity: 0.5,
                    marginBottom: 10,
                  }}
                />
                <p
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "clamp(18px, 2.2vw, 25px)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--navy)",
                    lineHeight: 1.5,
                  }}
                >
                  "My goal is not to fill a student's notebook it is to ignite
                  the curiosity that fills a career."
                </p>
              </div>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--ink-3)",
                  lineHeight: 1.82,
                  marginBottom: 28,
                  fontWeight: 300,
                }}
              >
                Across 18 years and three universities, my pedagogy centres on
                Project-Based Learning: students design, build, fail, and
                iterate on real engineering challenges. Technical mastery is
                built through wrestling with real problems, not through passive
                absorption of theory. My courses in AI, Computer Networks, DBMS,
                and Theory of Computation consistently integrate hands-on
                innovation.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 28,
                }}
              >
                {[
                  "Data Structures",
                  "Computer Networks",
                  "DBMS",
                  "AI/ML",
                  "Deep Learning",
                  "Computer Vision",
                  "Theory of Computation",
                ].map((s) => (
                  <span key={s} className="tag" style={{ fontSize: 11 }}>
                    {s}
                  </span>
                ))}
              </div>
              <Link
                href="/teaching"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13.5,
                  color: "var(--navy)",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "2px solid var(--gold)",
                  paddingBottom: 2,
                }}
              >
                Full teaching portfolio <ArrowRight size={13} />
              </Link>
            </motion.div>
            <motion.div {...up(0.1)}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  { I: Users, v: "60+", l: "UG Project Groups Guided" },
                  { I: GraduationCap, v: "10", l: "M.E. Students Supervised" },
                  { I: BookOpen, v: "18+", l: "Years in the Classroom" },
                  { I: FileText, v: "15", l: "Int'l Publications" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.09 }}
                    className="card"
                    style={{
                      padding: "clamp(18px, 3vw, 26px)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 9,
                        background: "var(--navy-pale)",
                        border: "1px solid var(--navy-glow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <s.I size={18} style={{ color: "var(--navy)" }} />
                    </div>
                    <p
                      className="sn"
                      style={{ fontSize: 36, lineHeight: 1, marginBottom: 7 }}
                    >
                      {s.v}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--ink-3)",
                        lineHeight: 1.42,
                      }}
                    >
                      {s.l}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: "var(--off)",
          padding: "clamp(72px, 12vh, 120px) 0",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid var(--ink-line)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: -40,
            transform: "translateY(-50%)",
            fontFamily: "Playfair Display, serif",
            fontWeight: 800,
            fontSize: "clamp(80px, 18vw, 220px)",
            color: "var(--navy-pale)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.04em",
          }}
        >
          AI
        </div>
        <div
          className="W"
          style={{ position: "relative", textAlign: "center" }}
        >
          <motion.div {...up()}>
            <p
              className="lbl"
              style={{ justifyContent: "center", marginBottom: 16 }}
            >
              Open to Collaboration
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(32px, 5.5vw, 70px)",
                fontWeight: 800,
                color: "var(--navy)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                maxWidth: 800,
                margin: "0 auto 20px",
              }}
            >
              Let's Build Something{" "}
              <em
                style={{
                  color: "var(--gold)",
                  fontStyle: "italic",
                  fontWeight: 600,
                }}
              >
                Meaningful
              </em>{" "}
              Together
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 1.3vw, 17px)",
                color: "var(--ink-3)",
                lineHeight: 1.8,
                maxWidth: 560,
                margin: "0 auto 44px",
                fontWeight: 300,
              }}
            >
              Open to research collaborations, conference invitations, AI & ML
              consultancy, academic partnerships, and student mentorship in
              Computer Engineering.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <Link
                href="/contact"
                className="btn-navy"
                style={{ padding: "13px 28px", fontSize: 14 }}
              >
                Start a Conversation <ArrowRight size={15} />
              </Link>
              <a
                href="mailto:sachintakmare@gmail.com"
                className="btn-out"
                style={{ padding: "13px 28px", fontSize: 14 }}
              >
                <Mail size={14} /> sachintakmare@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) { .hg { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }
        @media (max-width: 440px) { .S { padding-top: 52px !important; padding-bottom: 52px !important; } }
      `}</style>
    </>
  );
}
