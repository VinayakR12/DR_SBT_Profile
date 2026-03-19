// 'use client'

// import { motion } from 'framer-motion'
// import Link from 'next/link'
// import {
//   GraduationCap, MapPin, Mail, Phone,
//   Calendar, Languages, Heart,
//   BookOpen, Award, Briefcase, FileText,
//   ArrowRight, CheckCircle2, Globe, User,
//   Building2, Star, Shield,
// } from 'lucide-react'

// const up = (delay = 0) => ({
//   initial: { opacity: 0, y: 24 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, margin: '-40px' },
//   transition: { duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] as any },
// })
// const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
// const SI = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }

// // ── DATA ─────────────────────────────────────────────────
// const EDUCATION = [
//   {
//     degree: 'Ph.D. — Computer Engineering',
//     university: 'Pacific University, Udaipur',
//     year: '2024',
//     grade: 'Awarded',
//     color: '#0D1F3C',
//     note: 'Thesis: Precision Farming — CNN-Based System for Crop and Weed Classification and Density Analysis',
//   },
//   {
//     degree: 'M.Tech — Computer Engineering',
//     university: 'Rajiv Gandhi Technical University, M.P.',
//     year: '2013',
//     grade: '70.00%',
//     color: '#1A3560',
//     note: 'Post-graduate specialization in advanced computing and systems',
//   },
//   {
//     degree: 'B.E. — Computer Engineering',
//     university: 'Shivaji University, Kolhapur',
//     year: '2006',
//     grade: '69.36%',
//     color: '#B8870A',
//     note: 'Foundation in computer science, algorithms, and software engineering',
//   },
//   {
//     degree: 'H.S.C. (12th)',
//     university: 'Maharashtra State Board',
//     year: '2002',
//     grade: '69.67%',
//     color: '#2D5B8A',
//     note: '',
//   },
//   {
//     degree: 'S.S.C. (10th)',
//     university: 'Divisional Board, Kolhapur',
//     year: '2000',
//     grade: '71.46%',
//     color: '#4A6A8A',
//     note: '',
//   },
// ]

// const EXPERIENCE = [
//   {
//     period: '2025 – Present',
//     role: 'Assistant Professor, Computer Engineering',
//     org: 'D. Y. Patil College of Engineering & Technology',
//     city: 'Kolhapur',
//     current: true,
//     color: '#0D1F3C',
//     bullets: [
//       'Teaching undergraduate courses in Computer Science & Engineering',
//       'Continuing AI and Deep Learning research in Precision Agriculture',
//       'Guiding final year project groups',
//     ],
//   },
//   {
//     period: '2017 – 2024',
//     role: 'Assistant Professor, Computer Science & Engineering',
//     org: 'A. P. Shah Institute of Technology',
//     city: 'Thane (University of Mumbai)',
//     current: false,
//     color: '#1A3560',
//     bullets: [
//       'PBL (Project-Based Learning) In-charge — designed and led the institute-wide PBL programme',
//       'NBA Criteria-3 Coordinator — led NBA accreditation for student outcomes and research activities',
//       'III Cell (Innovation, Incubation & Ideation) In-charge — mentored student startup ideas',
//       'Guided 60+ UG project groups and 10 M.E. students over 7 years',
//       'Taught subjects including AI, ML, Computer Networks, DBMS, Theory of Computation',
//     ],
//   },
//   {
//     period: '2013 – 2017',
//     role: 'Assistant Professor & Head of Department',
//     org: "Bharati Vidyapeeth's College of Engineering",
//     city: 'Kolhapur (Shivaji University)',
//     current: false,
//     color: '#B8870A',
//     bullets: [
//       'Served as Head of the Computer Science & Engineering Department',
//       'Recognized as PG Teacher by Shivaji University Kolhapur for M.E. supervision',
//       'Appointed as Assistant CAP Director by Shivaji University',
//       'Appointed as External Evaluator and Examiner for M.E. Dissertation evaluation',
//       'Led departmental accreditation, curriculum design, and faculty coordination',
//     ],
//   },
//   {
//     period: '2007 – 2012',
//     role: 'Lecturer & Assistant Professor',
//     org: 'Parshavanath College of Engineering',
//     city: 'Thane (University of Mumbai)',
//     current: false,
//     color: '#2D5B8A',
//     bullets: [
//       'Appointment approved by University of Mumbai as Lecturer — Letter No. CONCOL/SA/4532 (Nov 2008)',
//       'Technical Coordinator of "NEXUS" — National Level Technical Event',
//       'Sports In-charge from 2008 to 2012',
//       'Built early teaching experience in Data Structures, Algorithms, and Discrete Mathematics',
//     ],
//   },
// ]

// const APPROVALS = [
//   {
//     I: Award, color: '#B8870A',
//     title: 'Lecturer — University of Mumbai',
//     detail: 'Appointment approved as Lecturer in Computer Engineering Dept.',
//     ref: 'Letter No. CONCOL/SA/4532 dated 11 Nov 2008',
//   },
//   {
//     I: Award, color: '#0D1F3C',
//     title: 'Assistant Professor — Shivaji University Kolhapur',
//     detail: 'Appointment approved as Assistant Professor in CSE Dept.',
//     ref: 'Letter No. Afi/T3/STS/F-105 dated 10 Feb 2014',
//   },
//   {
//     I: Award, color: '#1A3560',
//     title: 'Assistant Professor — University of Mumbai',
//     detail: 'Re-approved as Assistant Professor in Computer Engineering Dept.',
//     ref: 'Letter No. TAAS(CT)/ICD/2017-18/11257 dated 18 Apr 2018',
//   },
// ]

// // ══════════════════════════════════════════════════════════
// export default function AboutPage() {
//   return (
//     <>
//       {/* ── Page Hero ── */}
//       <section style={{
//         paddingTop: 'var(--nav-h)',
//         background: 'var(--navy)',
//         position: 'relative', overflow: 'hidden',
//       }}>
//         {/* Gold top line */}
//         <div style={{ position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)' }} />
//         {/* Grid texture */}
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
//         {/* Radial glow */}
//         <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(184,135,10,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />

//         <div className="W" style={{
//           padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)',
//           position: 'relative', zIndex: 1,
//         }}>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'minmax(0,1fr) minmax(0,auto)',
//             gap: 'clamp(32px, 6vw, 80px)',
//             alignItems: 'center',
//           }} className="ahg">

//             {/* Text */}
//             <motion.div
//               initial={{ opacity: 0, x: -24 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 16 }}>
//                 About Me
//               </p>
//               <h1 style={{
//                 fontFamily: 'Playfair Display, serif',
//                 fontSize: 'clamp(36px, 5.5vw, 68px)',
//                 fontWeight: 800, color: '#F0F4F8',
//                 lineHeight: 1.06, letterSpacing: '-0.025em',
//                 marginBottom: 20,
//               }}>
//                 Dr. Sachin<br />
//                 <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 600 }}>Balawant Takmare</em>
//               </h1>

//               <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'rgba(226,232,240,0.80)', lineHeight: 1.72, maxWidth: 560, marginBottom: 28, fontWeight: 300 }}>
//                 Ph.D. in Computer Engineering · Assistant Professor with 18+ years of UGC-approved teaching experience · AI & Deep Learning Researcher · Patent Holder · Published Author
//               </p>

//               {/* Quick facts row */}
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 2vw, 24px)' }}>
//                 {[
//                   { I: MapPin,   v: 'Kolhapur, Maharashtra' },
//                   { I: Mail,     v: 'sachintakmare@gmail.com' },
//                   { I: Phone,    v: '+91 9960843406' },
//                   { I: Calendar, v: 'Born: 21 March 1985' },
//                 ].map(({ I, v }) => (
//                   <span key={v} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'rgba(226,232,240,0.60)', fontWeight: 300 }}>
//                     <I size={12} style={{ color: 'var(--gold-3)', flexShrink: 0 }} />{v}
//                   </span>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Profile card */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
//               style={{ flexShrink: 0 }}
//             >
//               <div style={{
//                 width: 'clamp(180px, 22vw, 280px)',
//                 borderRadius: 14,
//                 border: '2px solid rgba(184,135,10,0.35)',
//                 overflow: 'hidden',
//                 boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
//               }}>
//                 {/* Photo placeholder */}
//                 <div style={{
//                   aspectRatio: '3/4',
//                   background: 'linear-gradient(135deg, #1A3560 0%, #0D1F3C 100%)',
//                   display: 'flex', flexDirection: 'column',
//                   alignItems: 'center', justifyContent: 'center', gap: 12,
//                 }}>
//                   {/*
//                     REPLACE with:
//                     <img src={profile.image} alt="Dr. Sachin Takmare"
//                       style={{ width:'100%', height:'100%', objectFit:'cover' }} />
//                   */}
//                   <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(184,135,10,0.15)', border: '2px solid var(--gold-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--gold-3)' }}>ST</span>
//                   </div>
//                   <p style={{ fontSize: 10, color: 'rgba(226,232,240,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Add profile.image</p>
//                 </div>
//                 {/* Name strip */}
//                 <div style={{ padding: '14px 16px', background: 'rgba(184,135,10,0.12)', borderTop: '1px solid rgba(184,135,10,0.25)' }}>
//                   <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, fontWeight: 600, color: '#F0F4F8', lineHeight: 1.2 }}>Dr. Sachin B. Takmare</p>
//                   <p style={{ fontSize: 10, color: 'var(--gold-3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>Ph.D · AI & ML</p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* ── Biography ── */}
//       <section className="S" style={{ background: 'var(--white)' }}>
//         <div className="W">
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 96px)', alignItems: 'start' }}>

//             <motion.div {...up(0)}>
//               <p className="lbl" style={{ marginBottom: 18 }}>My Story</p>
//               <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.12, marginBottom: 24 }}>
//                 From Kolhapur to the{' '}
//                 <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Cutting Edge of AI</em>
//               </h2>
//               <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 18, fontWeight: 300 }}>
//                 Born and raised in the culturally rich town of Kogil Budruk, Kolhapur, Maharashtra, I developed an early fascination with mathematics and problem-solving that eventually led me to Computer Engineering. After completing my B.E. from Shivaji University in 2006, I began my teaching career at Parshavanath College of Engineering in Thane — a decision that would define the next two decades of my life.
//               </p>
//               <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 18, fontWeight: 300 }}>
//                 Teaching was never just a profession for me — it was a calling. I pursued my M.Tech from Rajiv Gandhi Technical University, Madhya Pradesh in 2013, sharpening my technical foundation while simultaneously growing as an educator. During four years as Head of Department at Bharati Vidyapeeth's College of Engineering, Kolhapur, I gained administrative experience and recognition as a PG Teacher by Shivaji University.
//               </p>
//               <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 18, fontWeight: 300 }}>
//                 My return to Thane in 2017 at A. P. Shah Institute of Technology marked the beginning of my most intensive research phase. Juggling a full teaching load with doctoral work, I pursued my Ph.D. at Pacific University, Udaipur — investigating how Convolutional Neural Networks could automate crop-weed classification for India's farmers. The thesis was awarded in 2024, resulting in two filed utility patents and multiple international publications.
//               </p>
//               <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.85, fontWeight: 300 }}>
//                 Today, as a faculty member at D. Y. Patil College of Engineering & Technology, Kolhapur, I continue to bridge academic rigor with real-world impact — teaching the next generation of engineers while advancing research that addresses genuine societal challenges.
//               </p>
//             </motion.div>

//             {/* Personal details card */}
//             <motion.div {...up(0.1)}>
//               <div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--sh2)' }}>
//                 {/* Header */}
//                 <div style={{ padding: '14px 20px', background: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <User size={15} style={{ color: 'var(--gold-3)' }} />
//                   <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>Personal Details</p>
//                 </div>

//                 {[
//                   { I: Calendar,   k: 'Date of Birth',  v: '21st March, 1985' },
//                   { I: User,       k: 'Gender',         v: 'Male' },
//                   { I: Heart,      k: 'Marital Status', v: 'Married' },
//                   { I: Globe,      k: 'Nationality',    v: 'Indian' },
//                   { I: Star,       k: 'Religion / Caste', v: 'Hindu — Maratha' },
//                   { I: Languages,  k: 'Languages',      v: 'Marathi, Hindi, English' },
//                   { I: MapPin,     k: 'Permanent Address', v: 'At/p Kogil Budruk, Tal. Karveer, Dist. Kolhapur, Maharashtra — 416216' },
//                 ].map((r, i, a) => (
//                   <div key={i} style={{
//                     display: 'flex', gap: 14, padding: '12px 20px',
//                     borderBottom: i < a.length - 1 ? '1px solid var(--ink-line)' : 'none',
//                     alignItems: 'flex-start',
//                     transition: 'background 0.15s',
//                   }}
//                   onMouseEnter={e => (e.currentTarget.style.background = 'var(--off)')}
//                   onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
//                     <r.I size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
//                     <div style={{ flex: 1 }}>
//                       <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 2 }}>{r.k}</p>
//                       <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 400, lineHeight: 1.5 }}>{r.v}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <hr className="rule" />

//       {/* ── Education ── */}
//       <section className="S" style={{ background: 'var(--off)' }}>
//         <div className="W">
//           <motion.div {...up()} style={{ marginBottom: 'clamp(36px, 5.5vh, 56px)' }}>
//             <p className="lbl" style={{ marginBottom: 14 }}>Academic Qualifications</p>
//             <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
//               Education & <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Degrees</em>
//             </h2>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//             {EDUCATION.map((e, i) => (
//               <motion.div key={i} variants={SI}
//                 style={{
//                   display: 'flex', gap: 'clamp(14px, 3vw, 28px)',
//                   alignItems: 'flex-start', flexWrap: 'wrap',
//                   padding: 'clamp(16px, 2.5vw, 22px) clamp(16px, 2.5vw, 24px)',
//                   borderRadius: 12,
//                   background: 'var(--white)',
//                   border: '1px solid var(--ink-line)',
//                   transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
//                   cursor: 'default',
//                 }}
//                 onMouseEnter={el => { const t = el.currentTarget as HTMLElement; t.style.borderColor = `${e.color}40`; t.style.boxShadow = 'var(--sh2)'; t.style.transform = 'translateX(5px)' }}
//                 onMouseLeave={el => { const t = el.currentTarget as HTMLElement; t.style.borderColor = 'var(--ink-line)'; t.style.boxShadow = 'none'; t.style.transform = 'translateX(0)' }}
//               >
//                 {/* Year badge */}
//                 <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 56 }}>
//                   <div style={{ padding: '5px 10px', borderRadius: 6, background: `${e.color}12`, border: `1px solid ${e.color}25`, display: 'inline-block' }}>
//                     <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 700, color: e.color, lineHeight: 1 }}>{e.year}</p>
//                   </div>
//                 </div>

//                 {/* Main info */}
//                 <div style={{ flex: 1, minWidth: 200 }}>
//                   <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>{e.degree}</p>
//                   <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginBottom: e.note ? 6 : 0 }}>{e.university}</p>
//                   {e.note && <p style={{ fontSize: 12, color: 'var(--ink-4)', lineHeight: 1.55 }}>{e.note}</p>}
//                 </div>

//                 {/* Grade */}
//                 <div style={{ flexShrink: 0, textAlign: 'right' }}>
//                   <span style={{
//                     padding: '4px 12px', borderRadius: 100,
//                     fontSize: 12, fontWeight: 700,
//                     background: e.grade === 'Awarded' ? 'var(--gold-pale)' : 'var(--navy-pale)',
//                     border: `1px solid ${e.grade === 'Awarded' ? 'var(--gold-border)' : 'var(--navy-glow)'}`,
//                     color: e.grade === 'Awarded' ? 'var(--gold)' : 'var(--navy)',
//                   }}>
//                     {e.grade}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       <hr className="rule" />

//       {/* ── Work Experience ── */}
//       <section className="S" style={{ background: 'var(--white)' }}>
//         <div className="W">
//           <motion.div {...up()} style={{ marginBottom: 'clamp(36px, 5.5vh, 56px)' }}>
//             <p className="lbl" style={{ marginBottom: 14 }}>Professional Experience</p>
//             <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
//               18 Years, <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Four Institutions</em>
//             </h2>
//           </motion.div>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
//             {EXPERIENCE.map((e, i) => (
//               <motion.div key={i} {...up(i * 0.07)}>
//                 <div className="card" style={{ overflow: 'hidden', boxShadow: e.current ? 'var(--sh2)' : 'var(--sh1)' }}>
//                   {/* Top accent */}
//                   <div style={{ height: 3, background: `linear-gradient(90deg, ${e.color}, var(--gold))` }} />
//                   <div style={{ padding: 'clamp(20px, 3vw, 30px)' }}>

//                     {/* Header */}
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
//                       <div>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
//                           <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 11, background: `${e.color}12`, border: `1px solid ${e.color}28`, color: e.color, fontWeight: 700 }}>{e.period}</span>
//                           {e.current && <span className="tag tag-gold" style={{ fontSize: 10.5 }}>Current</span>}
//                         </div>
//                         <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>{e.role}</h3>
//                         <p style={{ fontSize: 13.5, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
//                           <Building2 size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
//                           {e.org}
//                         </p>
//                         <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
//                           <MapPin size={11} style={{ color: 'var(--ink-4)', flexShrink: 0 }} />
//                           {e.city}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Bullet points */}
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 7, paddingLeft: 4 }}>
//                       {e.bullets.map((b, j) => (
//                         <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
//                           <CheckCircle2 size={13} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
//                           <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>{b}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <hr className="rule" />

//       {/* ── University Approvals ── */}
//       <section className="S" style={{ background: 'var(--off)' }}>
//         <div className="W">
//           <motion.div {...up()} style={{ marginBottom: 'clamp(32px, 5vh, 52px)' }}>
//             <p className="lbl" style={{ marginBottom: 14 }}>Official Appointments</p>
//             <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.12 }}>
//               University <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Approvals</em>
//             </h2>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 'clamp(10px, 1.5vw, 16px)' }}>
//             {APPROVALS.map((a, i) => (
//               <motion.div key={i} variants={SI} className="card" style={{ padding: 'clamp(18px, 2.5vw, 26px)', boxShadow: 'var(--sh1)' }}>
//                 <div style={{ width: 42, height: 42, borderRadius: 10, background: `${a.color}10`, border: `1px solid ${a.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
//                   <a.I size={19} style={{ color: a.color }} />
//                 </div>
//                 <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 8 }}>{a.title}</h3>
//                 <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: 10 }}>{a.detail}</p>
//                 <p style={{ fontSize: 11, color: 'var(--ink-4)', fontStyle: 'italic' }}>{a.ref}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       <hr className="rule" />

//       {/* ── Research & Teaching Numbers ── */}
//       <section style={{ background: 'var(--navy)', padding: 'clamp(48px, 8vh, 80px) 0', position: 'relative', overflow: 'hidden' }}>
//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold-3), transparent)' }} />
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(184,135,10,0.07) 0%, transparent 55%)', pointerEvents: 'none' }} />

//         <div className="W" style={{ position: 'relative' }}>
//           <motion.div {...up()} style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4.5vh, 48px)' }}>
//             <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 12 }}>Research & Mentorship</p>
//             <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: '#F0F4F8' }}>
//               Numbers That <em style={{ color: 'var(--gold-3)', fontStyle: 'italic' }}>Speak</em>
//             </h2>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
//             {[
//               { n: '18+', l: 'Years Teaching',    s: 'UGC Approved' },
//               { n: '15',  l: "Int'l Journals",    s: 'Published' },
//               { n: '07',  l: 'Conferences',        s: 'International' },
//               { n: '60+', l: 'UG Projects',        s: 'Groups Guided' },
//               { n: '10',  l: 'M.E. Students',      s: 'Supervised' },
//               { n: '02',  l: 'Patents',             s: 'Utility Filed' },
//               { n: '02',  l: 'Copyrights',          s: 'Registered' },
//               { n: '03',  l: 'Universities',        s: 'Affiliated' },
//             ].map((s, i) => (
//               <motion.div key={i} variants={SI}
//                 style={{ padding: 'clamp(18px, 3vw, 28px) clamp(8px, 1.5vw, 14px)', textAlign: 'center', background: 'rgba(13,31,60,0.5)', cursor: 'default', transition: 'background 0.2s' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,135,10,0.10)')}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,31,60,0.5)')}>
//                 <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1, color: 'var(--gold-3)', marginBottom: 5 }}>{s.n}</p>
//                 <p style={{ fontSize: 'clamp(10px, 0.9vw, 12px)', fontWeight: 600, color: '#E2E8F0', marginBottom: 2 }}>{s.l}</p>
//                 <p style={{ fontSize: '9px', color: 'rgba(226,232,240,0.42)', letterSpacing: '0.07em' }}>{s.s}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* ── Philosophy ── */}
//       <section className="S" style={{ background: 'var(--white)' }}>
//         <div className="W">
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 96px)', alignItems: 'start' }}>

//             <motion.div {...up(0)}>
//               <p className="lbl" style={{ marginBottom: 18 }}>Research Philosophy</p>
//               <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.15, marginBottom: 22 }}>
//                 Research That <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Serves Society</em>
//               </h2>
//               <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 18, fontWeight: 300 }}>
//                 I believe the measure of good research is not the citations it earns but the problems it solves. My Ph.D. work on precision farming was motivated by a simple observation: India's smallholder farmers lose billions annually to improper herbicide use because they cannot tell crops from weeds at scale. That is a real, solvable problem.
//               </p>
//               <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 18, fontWeight: 300 }}>
//                 Every research question I pursue asks: who benefits from the answer? Whether it is a sickle cell anemia diagnostic tool that reaches rural clinics, a virtual classroom that extends quality education beyond physical boundaries, or a malware detection system that protects institutions — the motivation is always impact, not novelty alone.
//               </p>
//               <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.85, fontWeight: 300 }}>
//                 I also believe strongly that a professor's greatest research contribution is the students they produce. The 10 M.E. scholars I have supervised and the 60+ project groups I have mentored are, in many ways, my most enduring research output.
//               </p>
//             </motion.div>

//             <motion.div {...up(0.1)}>
//               <p className="lbl" style={{ marginBottom: 18 }}>Teaching Philosophy</p>
//               <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.15, marginBottom: 22 }}>
//                 Learning by <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Doing</em>
//               </h2>
//               <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 18, fontWeight: 300 }}>
//                 After 18 years in classrooms across three universities, I have arrived at a conviction: <strong style={{ color: 'var(--navy)', fontWeight: 600 }}>a lecture is the beginning of learning, not the end of it.</strong> Students absorb theory best when it is immediately tested against a real challenge — when they have to make it work, fix it when it breaks, and explain why it failed.
//               </p>
//               <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.85, marginBottom: 24, fontWeight: 300 }}>
//                 This is why I championed Project-Based Learning at A. P. Shah Institute of Technology and why every course I teach is structured around doing. AI is not a spectator sport — it requires training data, debugging intuition, and iterative refinement. I bring students into that process as early as possible.
//               </p>

//               {/* Values chips */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                 {[
//                   'Project-Based Learning as the primary pedagogy',
//                   'Integrating real datasets into every AI/ML course',
//                   'Student-led innovation through III Cell activities',
//                   'Bridging theory and industry practice consistently',
//                   'Continuous mentorship beyond the classroom',
//                 ].map((v, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
//                     <CheckCircle2 size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
//                     <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>{v}</p>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <hr className="rule" />

//       {/* ── Projects guided summary ── */}
//       <section className="S" style={{ background: 'var(--off)' }}>
//         <div className="W">
//           <motion.div {...up()} style={{ marginBottom: 'clamp(32px, 5vh, 52px)', textAlign: 'center' }}>
//             <p className="lbl" style={{ justifyContent: 'center', marginBottom: 14 }}>Mentorship Record</p>
//             <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)' }}>
//               Guiding the Next Generation of <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Engineers</em>
//             </h2>
//           </motion.div>

//           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
//             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(10px, 1.5vw, 16px)' }}>
//             {[
//               { I: BookOpen,    n: '60+',  l: 'UG Project Groups Guided', d: 'Final year undergraduate engineering projects across AI, Web, Networking, and Embedded Systems domains.' },
//               { I: GraduationCap, n: '10', l: 'M.E. Students Supervised', d: 'Post-graduate research dissertations guided to completion as PG-recognized teacher under Shivaji University.' },
//               { I: Briefcase,   n: '18+',  l: 'Years in Academia',        d: 'Continuous UGC-approved teaching experience across University of Mumbai and Shivaji University Kolhapur.' },
//               { I: FileText,    n: '15',   l: "Int'l Journal Publications", d: 'Peer-reviewed research papers published in international journals and IEEE conference proceedings.' },
//             ].map((c, i) => (
//               <motion.div key={i} variants={SI} className="card" style={{ padding: 'clamp(20px, 3vw, 28px)', textAlign: 'center', boxShadow: 'var(--sh1)' }}>
//                 <div style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--navy-pale)', border: '1px solid var(--navy-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
//                   <c.I size={20} style={{ color: 'var(--navy)' }} />
//                 </div>
//                 <p className="sn" style={{ fontSize: 38, lineHeight: 1, marginBottom: 8, color: 'var(--navy)' }}>{c.n}</p>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>{c.l}</p>
//                 <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.65 }}>{c.d}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section style={{ background: 'var(--white)', padding: 'clamp(64px, 10vh, 108px) 0', borderTop: '1px solid var(--ink-line)', position: 'relative', overflow: 'hidden' }}>
//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
//         <div style={{ position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(80px, 16vw, 200px)', color: 'var(--navy-pale)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>AI</div>

//         <div className="W" style={{ position: 'relative', textAlign: 'center' }}>
//           <motion.div {...up()}>
//             <p className="lbl" style={{ justifyContent: 'center', marginBottom: 16 }}>Let's Connect</p>
//             <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4.5vw, 56px)', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 18px' }}>
//               Interested in Research,{' '}
//               <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 600 }}>Collaboration</em>{' '}
//               or Mentorship?
//             </h2>
//             <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: 'var(--ink-3)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px', fontWeight: 300 }}>
//               Whether you are a student, researcher, institution, or industry professional — I welcome conversations about AI research, academic collaboration, and professional development.
//             </p>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
//               <Link href="/contact" className="btn-navy" style={{ padding: '12px 28px', fontSize: 14 }}>
//                 Get In Touch <ArrowRight size={14} />
//               </Link>
//               <Link href="/research" className="btn-out" style={{ padding: '12px 28px', fontSize: 14 }}>
//                 View Research <ArrowRight size={14} />
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       <style>{`
//         @media (max-width: 680px) { .ahg { grid-template-columns: 1fr !important; } }
//         @media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }
//       `}</style>
//     </>
//   )
// }



'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  GraduationCap, MapPin, ArrowRight,
  FlaskConical, BookOpen, Shield,
  Brain, Leaf, Microscope, CheckCircle2,
} from 'lucide-react'

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as any },
})
const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const SI = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.52 } } }

const EDUCATION = [
  {
    degree: 'Ph.D.',
    field: 'Computer Engineering',
    uni: 'Pacific University, Udaipur',
    year: '2024',
    color: '#0D1F3C',
    note: 'Thesis: Precision Farming — CNN-Based System for Crop and Weed Classification and Density Analysis',
    badge: 'Awarded',
    badgeGold: true,
  },
  {
    degree: 'M.Tech.',
    field: 'Computer Engineering',
    uni: 'Rajiv Gandhi Technical University, Bhopal, M.P.',
    year: '2013',
    color: '#1A3560',
    note: '',
    badge: '2013',
    badgeGold: false,
  },
  {
    degree: 'B.E.',
    field: 'Computer Engineering',
    uni: 'Shivaji University, Kolhapur',
    year: '2006',
    color: '#B8870A',
    note: '',
    badge: '2006',
    badgeGold: false,
  },
]

const RESEARCH_AREAS = [
  { I: Brain,        label: 'Artificial Intelligence & ML',  color: '#0D1F3C', bg: 'rgba(13,31,60,0.06)'   },
  { I: Leaf,         label: 'Data Science',         color: '#1A6B48', bg: 'rgba(26,107,72,0.06)'  },
  { I: Microscope,   label: 'Computer Vision',               color: '#2D5B8A', bg: 'rgba(45,91,138,0.06)'  },
  { I: Shield,       label: 'Computer Science',            color: '#5C3A8A', bg: 'rgba(92,58,138,0.06)'  },
  { I: BookOpen,     label: 'Natural Language Processing',   color: '#7A5500', bg: 'rgba(122,85,0,0.06)'   },
  { I: FlaskConical, label: 'EdTech & Virtual Learning',     color: '#1A3560', bg: 'rgba(26,53,96,0.06)'   },
]

const MILESTONES = [
  { year: '2025', event: 'Joined D. Y. Patil College of Engineering & Technology, Kolhapur',  type: 'academic' },
  { year: '2024', event: 'Ph.D. awarded — Pacific University, Udaipur',                        type: 'academic' },
  { year: '2024', event: '2 utility patents filed — Indian Patent Office',                     type: 'ip'       },
  { year: '2024', event: '2 software copyrights registered — Government of India',             type: 'ip'       },
  { year: '2024', event: '5 research papers published — IJISAE, IJOEAR, IJCSE, IJRAR, ISTE', type: 'research' },
  { year: '2023', event: 'IEEE WCONF publication — NFT Gaming on Blockchain',                  type: 'research' },
  { year: '2022', event: 'Research on Sickle Cell Anemia diagnosis — Neuroquantology journal', type: 'research' },
  { year: '2018', event: 'Re-approved as Assistant Professor — University of Mumbai',          type: 'academic' },
  { year: '2017', event: 'Joined A. P. Shah Institute of Technology, Thane',                  type: 'academic' },
  { year: '2014', event: 'PG Recognized Teacher — Shivaji University, Kolhapur',              type: 'academic' },
  { year: '2013', event: 'Appointed Head of Department — Bharati Vidyapeeth COE, Kolhapur',   type: 'academic' },
  { year: '2013', event: 'M.Tech completed — Rajiv Gandhi Technical University',              type: 'academic' },
  { year: '2008', event: 'Approved as Lecturer — University of Mumbai',                       type: 'academic' },
  { year: '2007', event: 'Teaching career began — Parshavanath College of Engineering, Thane', type: 'academic' },
]

const TYPE_COLORS: Record<string, string> = {
  academic: '#0D1F3C',
  ip:       '#B8870A',
  research: '#1A6B48',
}

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ paddingTop: 'var(--nav-h)', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 70% at 85% 50%, rgba(184,135,10,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)' }} />

        <div className="W" style={{ padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>

            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
                About
              </p>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 800, color: '#F0F4F8', lineHeight: 1.0, letterSpacing: '-0.025em', marginBottom: 6 }}>
                Dr. Sachin
              </h1>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 500, fontStyle: 'italic', color: 'var(--gold-3)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 26 }}>
                Balawant Takmare
              </h1>

              <p style={{ fontSize: 'clamp(14px, 1.4vw, 16.5px)', color: 'rgba(226,232,240,0.72)', lineHeight: 1.78, maxWidth: 520, marginBottom: 28, fontWeight: 300 }}>
                Assistant Professor, Computer Engineering. Ph.D. from Pacific University, Udaipur (2024). Researcher in Artificial Intelligence and Deep Learning. 18 years of UGC-approved teaching experience across three universities.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30 }}>
                {[
                  { label: 'Ph.D. · 2024' },
                  { label: 'AI & Deep Learning' },
                  { label: '15 Research Papers' },
                  { label: '2 Utility Patents' },
                  { label: 'Kolhapur, Maharashtra' },
                ].map(t => (
                  <span key={t.label} style={{ fontSize: 11.5, fontWeight: 500, padding: '4px 12px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(226,232,240,0.65)' }}>
                    {t.label}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Link href="/research" className="btn-navy" style={{ padding: '10px 22px', fontSize: 13.5 }}>Research Work <ArrowRight size={14} /></Link>
                            </div>
            </motion.div>

            {/* Profile card */}
            <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 'clamp(200px, 26vw, 300px)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -10, borderRadius: 18, border: '1px solid rgba(184,135,10,0.18)' }} />
                <div style={{ position: 'absolute', inset: -4, borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }} />

                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid rgba(184,135,10,0.32)', boxShadow: '0 24px 64px rgba(0,0,0,0.38)' }}>
                  <div style={{ height: 4, background: 'linear-gradient(90deg, var(--gold), var(--gold-3))' }} />
                  <div style={{ aspectRatio: '3/4', background: 'linear-gradient(155deg, #1A3560, #0D1F3C)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    {/* Replace with: <img src={profile.image} alt="Dr. Sachin Takmare" style={{width:'100%',height:'100%',objectFit:'cover'}} /> */}
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(184,135,10,0.12)', border: '2px solid rgba(184,135,10,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--gold-3)' }}>ST</span>
                    </div>
                    <p style={{ fontSize: 9.5, color: 'rgba(226,232,240,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Add profile photo</p>
                  </div>
                  <div style={{ padding: '14px 16px', background: 'rgba(184,135,10,0.09)', borderTop: '1px solid rgba(184,135,10,0.20)' }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 14.5, fontWeight: 600, color: '#F0F4F8', lineHeight: 1.2 }}>Dr. Sachin B. Takmare</p>
                    <p style={{ fontSize: 10, color: 'var(--gold-3)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>Ph.D. · AI & ML</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, fontSize: 11, color: 'rgba(226,232,240,0.48)' }}>
                      <MapPin size={10} style={{ color: 'var(--gold-3)', flexShrink: 0 }} />
                      Kolhapur, Maharashtra
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BIOGRAPHY ── */}
      <section className="S" style={{ background: 'var(--white)' }}>
        <div className="W">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 96px)', alignItems: 'start' }}>

           <motion.div {...up(0)}>
  <p className="lbl" style={{ marginBottom: 16 }}>Background</p>

  <h2
    style={{
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(26px, 3.5vw, 44px)',
      fontWeight: 700,
      color: 'var(--navy)',
      lineHeight: 1.12,
      marginBottom: 24,
    }}
  >
    Educator, Researcher,{' '}
    <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>
      Engineer
    </em>
  </h2>

  <p
    style={{
      fontSize: 14.5,
      color: 'var(--ink-2)',
      lineHeight: 1.88,
      marginBottom: 16,
      fontWeight: 300,
      textAlign: 'justify',
    }}
  >
    I am an Assistant Professor in Computer Engineering at D. Y. Patil College
    of Engineering & Technology, Kolhapur. I hold a Ph.D. from Pacific
    University, Udaipur (2024), along with an M.Tech. from Rajiv Gandhi Technical
    University and a B.E. in Computer Engineering from Shivaji University,
    Kolhapur.
  </p>

  <p
    style={{
      fontSize: 14.5,
      color: 'var(--ink-2)',
      lineHeight: 1.88,
      marginBottom: 16,
      fontWeight: 300,
      textAlign: 'justify',
    }}
  >
    With over 18 years of UGC-approved teaching experience across institutions
    affiliated with the University of Mumbai and Shivaji University, I have
    taught a wide range of undergraduate and postgraduate subjects in Computer
    Science and Engineering. My teaching spans from foundational areas such as
    Data Structures and Computer Networks to advanced domains including
    Artificial Intelligence, Deep Learning, and Computer Vision.
  </p>

  <p
    style={{
      fontSize: 14.5,
      color: 'var(--ink-2)',
      lineHeight: 1.88,
      fontWeight: 300,
      textAlign: 'justify',
    }}
  >
    My research focuses on developing intelligent systems that solve real-world
    challenges. During my doctoral work, I developed a Convolutional Neural
    Network-based system for automated crop and weed identification, which led
    to multiple peer-reviewed publications and the filing of two utility
    patents. Additionally, I have contributed to research in areas such as
    medical image analysis, cybersecurity, blockchain applications, and virtual
    education platforms, aiming to bridge the gap between theoretical concepts
    and practical implementation.
  </p>
</motion.div>
            {/* Right — key facts */}
            <motion.div {...up(0.1)}>
              <div style={{ border: '1px solid var(--ink-line)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--sh1)' }}>
                {/* Header */}
                <div style={{ padding: '14px 20px', background: 'var(--off)', borderBottom: '1px solid var(--ink-line)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <GraduationCap size={15} style={{ color: 'var(--gold)' }} />
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>At a Glance</p>
                </div>
                {[
                  { k: 'Current Position',    v: 'Assistant Professor, Computer Engineering' },
                  { k: 'Institution',         v: 'D. Y. Patil College of Engineering & Technology, Kolhapur' },
                  { k: 'Doctoral Degree',     v: 'Ph.D. — Pacific University, Udaipur (2024)' },
                  { k: 'Research Focus',      v: 'AI, Deep Learning, Precision Agriculture, Computer Vision' },
                  { k: 'Teaching Experience', v: '18+ Years — UGC Approved' },
                  { k: 'Publications',        v: '15 International Journals · 7 Conferences' },
                  { k: 'Intellectual Property', v: '2 Utility Patents · 2 Registered Copyrights' },
                  { k: 'Location',            v: 'Kolhapur, Maharashtra, India' },
                ].map((r, i, a) => (
                  <div key={i} style={{
                    display: 'flex', gap: 14, padding: '11px 20px',
                    borderBottom: i < a.length - 1 ? '1px solid var(--ink-line)' : 'none',
                    alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--off)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <CheckCircle2 size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 2 }}>{r.k}</p>
                      <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>{r.v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* ── EDUCATION ── */}
      <section className="S" style={{ background: 'var(--off)' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(32px, 5vh, 48px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>Academic Qualifications</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              Education &{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Degrees</em>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {EDUCATION.map((e, i) => (
              <motion.div key={i} variants={SI}
                style={{
                  display: 'flex', gap: 'clamp(14px, 2.5vw, 24px)', alignItems: 'flex-start', flexWrap: 'wrap',
                  padding: 'clamp(16px, 2.5vw, 22px) clamp(16px, 2.5vw, 22px)',
                  borderRadius: 10, background: '#fff',
                  border: '1px solid var(--ink-line)',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={el => { const t = el.currentTarget as HTMLElement; t.style.borderColor = `${e.color}38`; t.style.boxShadow = 'var(--sh2)'; t.style.transform = 'translateX(4px)' }}
                onMouseLeave={el => { const t = el.currentTarget as HTMLElement; t.style.borderColor = 'var(--ink-line)'; t.style.boxShadow = 'none'; t.style.transform = 'translateX(0)' }}
              >
                {/* Accent bar */}
                <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: `linear-gradient(180deg, ${e.color}, var(--gold))`, minHeight: 48, flexShrink: 0 }} />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 10px', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(16px, 1.6vw, 19px)', fontWeight: 700, color: e.color }}>{e.degree}</span>
                    <span style={{ fontSize: 13.5, color: 'var(--ink-3)', fontWeight: 400 }}>{e.field}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500, marginBottom: e.note ? 5 : 0 }}>{e.uni}</p>
                  {e.note && <p style={{ fontSize: 12, color: 'var(--ink-4)', lineHeight: 1.55, fontStyle: 'italic' }}>{e.note}</p>}
                </div>

                {/* Badge */}
                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11.5, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
                    background: e.badgeGold ? 'var(--gold-pale)' : `${e.color}10`,
                    border: `1px solid ${e.badgeGold ? 'var(--gold-border)' : `${e.color}22`}`,
                    color: e.badgeGold ? 'var(--gold)' : e.color,
                  }}>
                    {e.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <hr className="rule" />

      {/* ── RESEARCH AREAS ── */}
      <section className="S" style={{ background: 'var(--white)' }}>
        <div className="W">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 7vw, 80px)', alignItems: 'start' }}>

            <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 14 }}>Research Interests</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1, marginBottom: 20 }}>
                Areas of{' '}
                <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Specialisation</em>
              </h2>
              <p style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.82, marginBottom: 16, fontWeight: 300 }}>
                Research work spans six interconnected areas, each with published output: peer-reviewed journals, IEEE conference papers, and filed intellectual property. The unifying interest is the application of deep learning and computer vision to real-world classification and diagnostic problems across agriculture, healthcare, security, and education.
              </p>
              <Link href="/research" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'var(--navy)', fontWeight: 600, textDecoration: 'none', borderBottom: '2px solid var(--gold)', paddingBottom: 2 }}>
                View all publications <ArrowRight size={13} />
              </Link>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {RESEARCH_AREAS.map((r) => (
                  <motion.div key={r.label} variants={SI}
                    style={{
                      display: 'flex', gap: 11, alignItems: 'center',
                      padding: '13px 14px', borderRadius: 9, background: '#fff',
                      border: `1px solid ${r.color}18`,
                      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = 'var(--sh1)'; el.style.borderColor = `${r.color}38` }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = `${r.color}18` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 7, background: r.bg, border: `1px solid ${r.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <r.I size={14} style={{ color: r.color }} />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3 }}>{r.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* ── CAREER MILESTONES ── */}
      <section className="S" style={{ background: 'var(--off)' }}>
        <div className="W">
          <motion.div {...up()} style={{ marginBottom: 'clamp(32px, 5vh, 48px)' }}>
            <p className="lbl" style={{ marginBottom: 14 }}>Career Timeline</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>
              Key Milestones{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>2007 – 2025</em>
            </h2>
          </motion.div>

          <div style={{ position: 'relative', paddingLeft: 'clamp(28px, 4vw, 44px)' }}>
            {/* Rail */}
            <div style={{ position: 'absolute', left: 'clamp(8px, 2vw, 14px)', top: 6, bottom: 6, width: 2, borderRadius: 2, background: 'linear-gradient(180deg, var(--gold) 0%, var(--navy) 65%, rgba(13,31,60,0.10) 100%)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MILESTONES.map((m, i) => {
                const c = TYPE_COLORS[m.type]
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.52 }}
                    style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'center' }}>
                    {/* Dot */}
                    <div style={{ position: 'absolute', left: `calc(-1 * clamp(28px, 4vw, 44px) + clamp(8px, 2vw, 14px) - 5px)`, width: 11, height: 11, borderRadius: '50%', background: c, boxShadow: `0 0 0 3px var(--off), 0 0 0 4px ${c}35`, zIndex: 1 }} />

                    {/* Card */}
                    <div style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                      padding: '11px 16px', borderRadius: 8,
                      background: '#fff', border: '1px solid var(--ink-line)',
                      transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${c}35`; el.style.boxShadow = 'var(--sh1)'; el.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--ink-line)'; el.style.boxShadow = 'none'; el.style.transform = 'translateX(0)' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 4, background: `${c}10`, border: `1px solid ${c}22`, color: c, flexShrink: 0 }}>{m.year}</span>
                      <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}>{m.event}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(60px, 10vh, 100px) 0', borderTop: '1px solid var(--ink-line)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(80px, 16vw, 200px)', color: 'var(--navy-pale)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>18</div>

        <div className="W" style={{ position: 'relative', textAlign: 'center' }}>
          <motion.div {...up()}>
            <p className="lbl" style={{ justifyContent: 'center', marginBottom: 16 }}>Connect</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 4vw, 52px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1, maxWidth: 640, margin: '0 auto 16px' }}>
              Open to Research, Collaboration{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>& Mentorship</em>
            </h2>
            <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: 'var(--ink-3)', lineHeight: 1.8, maxWidth: 500, margin: '0 auto 36px', fontWeight: 300 }}>
              Available for research collaborations, academic consultancy, conference presentations, and M.E. / Ph.D. supervision in Computer Engineering.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <Link href="/contact"      className="btn-navy" style={{ padding: '11px 26px', fontSize: 13.5 }}>Get In Touch <ArrowRight size={14} /></Link>
              <Link href="/research"     className="btn-out"  style={{ padding: '11px 26px', fontSize: 13.5 }}>Research</Link>
              <Link href="/achievements" className="btn-out"  style={{ padding: '11px 26px', fontSize: 13.5 }}>Achievements</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }
      `}</style>
    </>
  )
}