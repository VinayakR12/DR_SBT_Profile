'use client'

// app/projects/page.tsx  (or link from /research/projects)
// Research-lab style projects page for Dr. Sachin Takmare
// Shows UG + PG student projects grouped by domain, with stats and visual flair

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, Leaf, Globe, Shield, GraduationCap,
  Users, BookOpen, Layers, ArrowRight,
  ChevronDown, ChevronUp, ExternalLink,
  Brain, Microscope, Code2, FlaskConical,
  Award, Calendar, Building2, Star,
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any } },
}

// ── DATA ─────────────────────────────────────────────────

type PGProject = {
  id: string
  title: string
  student: string
  university: string
  year: string
  domain: string
  summary: string
  outcome: string
  tags: string[]
  color: string
}

type UGDomain = {
  id: string
  icon: any
  domain: string
  color: string
  bg: string
  description: string
  totalGroups: number
  highlights: string[]
  technologies: string[]
}

const PG_PROJECTS: PGProject[] = [
  {
    id: 'pg-01',
    title: 'Precision Farming: CNN-Based Crop and Weed Classification System',
    student: 'Research Scholar (Ph.D. Level)',
    university: 'Pacific University, Udaipur',
    year: '2020–2024',
    domain: 'AI & Precision Agriculture',
    summary: 'Developed a full CNN-based pipeline for classifying crops and weed species from field images and estimating plant density using YOLO. The system enables targeted, eco-friendly herbicide deployment at scale.',
    outcome: 'Resulted in Ph.D. award (2024), 2 international journal publications, and 1 filed utility patent (Application No: 202421045939).',
    tags: ['CNN', 'YOLO', 'Precision Agriculture', 'Deep Learning', 'PhD'],
    color: '#1A6B48',
  },
  {
    id: 'pg-02',
    title: 'Dynamic Analysis of Web Systems Using Model-Based Testing and Process Crawler',
    student: 'Mrs. Nayan Mulla',
    university: "Bharati Vidyapeeth's College of Engineering, Kolhapur (Shivaji University)",
    year: '2016–2017',
    domain: 'Software Engineering & Testing',
    summary: 'Designed a model-based testing framework with a process crawler model for dynamic web system analysis, improving test coverage and defect detection in complex web applications.',
    outcome: 'Published in IJECS (Vol. 6, Issue 6, 2017) and IJERT (Vol. 6, Issue 6, 2017). DOI: 10.18535/ijecs/v6i6.47.',
    tags: ['Model-Based Testing', 'Web Analysis', 'Process Crawler', 'Dynamic Testing'],
    color: '#1A3560',
  },
  {
    id: 'pg-03',
    title: 'Review and Analysis of K-means Clustering Algorithm Variations',
    student: 'Ms. Kavita Shiudkar',
    university: "Bharati Vidyapeeth's College of Engineering, Kolhapur (Shivaji University)",
    year: '2016–2017',
    domain: 'Machine Learning & Data Mining',
    summary: 'Comprehensive review and comparative analysis of existing K-means clustering methods, evaluating convergence behavior, initialization strategies, and performance across datasets.',
    outcome: 'Published in IRJET (Vol. 4, Issue 2, February 2017). e-ISSN: 2395-0056.',
    tags: ['K-means', 'Clustering', 'Machine Learning', 'Data Mining'],
    color: '#2D5B8A',
  },
  {
    id: 'pg-04',
    title: 'Sickle Cell Anemia Diagnosis Using Microscopic Image Analysis',
    student: 'M.E. Research Scholar',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2021–2022',
    domain: 'Medical Imaging & Deep Learning',
    summary: 'Developed an automated diagnostic system using deep learning to classify sickle cell anemia from microscopic blood smear images, enabling faster and more accessible screening in resource-limited settings.',
    outcome: 'Published in Neuroquantology (Vol. 20, Issue 17). E-ISSN: 1303-5150.',
    tags: ['Medical Imaging', 'Sickle Cell Anemia', 'Deep Learning', 'Healthcare AI'],
    color: '#7A1A1A',
  },
  {
    id: 'pg-05',
    title: 'MetaCampus: Virtual Reality Platform for Online Education',
    student: 'M.E. Project Group',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2023–2024',
    domain: 'EdTech & Virtual Reality',
    summary: 'Built an immersive virtual classroom platform using metaverse technologies enabling interactive, real-time online education with spatial audio, virtual whiteboards, and student engagement tracking.',
    outcome: 'Published at IEEE INOCON 2024. Copyright registered (Diary No: 25004/2024-CO/SW).',
    tags: ['Virtual Reality', 'Online Education', 'Metaverse', 'IEEE'],
    color: '#5C3A8A',
  },
  {
    id: 'pg-06',
    title: 'Intelligent Malware Metamorphosis and Evasion Prevention System',
    student: 'M.E. Research Scholar',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2023–2024',
    domain: 'Cybersecurity & AI',
    summary: 'Designed an AI-based system that detects and prevents metamorphic malware by analyzing behavioural patterns, code transformations, and evasion techniques, outperforming signature-based methods.',
    outcome: 'Resulted in a filed utility patent (Application No: 202421069724, Published Oct 2024).',
    tags: ['Malware Detection', 'Cybersecurity', 'AI', 'Behavioural Analysis'],
    color: '#0D1F3C',
  },
  {
    id: 'pg-07',
    title: 'NFT Gaming on Blockchain: Dodging Turtis',
    student: 'M.E. Project Group',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2022–2023',
    domain: 'Blockchain & Game Development',
    summary: 'Developed a blockchain-integrated NFT-based game where in-game assets are tokenized as NFTs, enabling true digital ownership. Smart contracts manage game logic and asset transfers.',
    outcome: 'Published at IEEE WCONF 2023. ISBN: 979-8-3503-1120-4/23.',
    tags: ['NFT', 'Blockchain', 'Gaming', 'Smart Contracts', 'IEEE'],
    color: '#3A2A6A',
  },
  {
    id: 'pg-08',
    title: 'Network Monitoring and System Diagnostic Suite',
    student: 'Parth Vora, Harvinder Singh, Royston Rodrigues, Lavleen Jain',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2021–2022',
    domain: 'Computer Networks & Systems',
    summary: 'Built a comprehensive network monitoring dashboard providing real-time diagnostics, anomaly detection, traffic analysis, and system health reporting for enterprise network infrastructure.',
    outcome: 'Published in IJRASET (Vol. 10, Issue IV, April 2022). ISSN: 2321-9653.',
    tags: ['Network Monitoring', 'System Diagnostics', 'Real-Time Analysis', 'Computer Networks'],
    color: '#2D5B8A',
  },
  {
    id: 'pg-09',
    title: 'Voice-Based Watermarking Technique for Relational Databases',
    student: 'Research Collaboration',
    university: 'Parshavanath College of Engineering, Thane (University of Mumbai)',
    year: '2011–2012',
    domain: 'Data Security & Watermarking',
    summary: 'Proposed a novel watermarking technique for relational databases using voice signals as embedded watermarks. The detection algorithm works without access to the original data, making it robust against malicious attacks.',
    outcome: 'Published in International Journal of Scientific & Technology Research (Vol. 1, Issue 10, Nov 2012). ISSN: 2277-8616.',
    tags: ['Watermarking', 'Database Security', 'Voice Signal', 'Relational Database'],
    color: '#5C3A1A',
  },
  {
    id: 'pg-10',
    title: 'Smart Farming with YOLO: Crop and Weed Density Prediction',
    student: 'Research Collaboration',
    university: 'D. Y. Patil College of Engineering & Technology, Kolhapur',
    year: '2024–2025',
    domain: 'AI & Precision Agriculture',
    summary: 'Extended the PhD research to build a deployable field system using YOLO for real-time crop and weed density estimation. Integrates with drone imagery for large-scale farm monitoring.',
    outcome: 'Published in IJOEAR (Vol. 6, Issue 10, 2024). ISSN: 2454-1850.',
    tags: ['YOLO', 'Smart Farming', 'Drone Imagery', 'Real-Time AI'],
    color: '#1A6B48',
  },
]

const UG_DOMAINS: UGDomain[] = [
  {
    id: 'ug-ai',
    icon: Brain,
    domain: 'Artificial Intelligence & Machine Learning',
    color: '#0D1F3C',
    bg: 'rgba(13,31,60,0.07)',
    description: 'Projects involving supervised/unsupervised learning, neural networks, NLP, and intelligent automation systems built using Python, TensorFlow, and PyTorch.',
    totalGroups: 18,
    highlights: [
      'Sentiment analysis for social media data',
      'Chatbot development using transformer models',
      'Fraud detection using anomaly detection',
      'Handwritten digit recognition systems',
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'NLP'],
  },
  {
    id: 'ug-cv',
    icon: Microscope,
    domain: 'Computer Vision & Image Processing',
    color: '#1A6B48',
    bg: 'rgba(26,107,72,0.07)',
    description: 'Image classification, object detection, face recognition, and medical image analysis projects leveraging CNN architectures and OpenCV.',
    totalGroups: 12,
    highlights: [
      'Face attendance system using OpenCV',
      'Plant disease detection from leaf images',
      'Real-time object detection for surveillance',
      'X-ray image classification for diagnostics',
    ],
    technologies: ['OpenCV', 'CNN', 'YOLO', 'ResNet', 'VGG', 'Python'],
  },
  {
    id: 'ug-web',
    icon: Globe,
    domain: 'Web & Mobile Application Development',
    color: '#2D5B8A',
    bg: 'rgba(45,91,138,0.07)',
    description: 'Full-stack web apps, mobile applications, and cloud-integrated platforms built using modern frameworks for real-world problem domains.',
    totalGroups: 14,
    highlights: [
      'E-commerce platforms with payment gateways',
      'Hospital management information systems',
      'Student examination portals',
      'Job portal with ML-based matching',
    ],
    technologies: ['React', 'Node.js', 'Next.js', 'Flutter', 'Firebase', 'MongoDB'],
  },
  {
    id: 'ug-sec',
    icon: Shield,
    domain: 'Cybersecurity & Network Systems',
    color: '#5C3A8A',
    bg: 'rgba(92,58,138,0.07)',
    description: 'Network security tools, intrusion detection systems, encryption implementations, and cybersecurity analysis frameworks.',
    totalGroups: 8,
    highlights: [
      'Network intrusion detection using ML',
      'Password strength analyser and manager',
      'Secure file transfer with AES encryption',
      'Phishing website detection system',
    ],
    technologies: ['Python', 'Wireshark', 'Nmap', 'AES', 'RSA', 'Firewall'],
  },
  {
    id: 'ug-iot',
    icon: Cpu,
    domain: 'IoT & Embedded Systems',
    color: '#B8870A',
    bg: 'rgba(184,135,10,0.07)',
    description: 'Smart sensors, IoT dashboards, Arduino/Raspberry Pi projects, and real-time monitoring systems for agriculture, healthcare, and smart homes.',
    totalGroups: 5,
    highlights: [
      'Smart irrigation system with soil sensors',
      'Home automation using Raspberry Pi',
      'Air quality monitoring dashboard',
      'Patient health monitoring wearable',
    ],
    technologies: ['Arduino', 'Raspberry Pi', 'MQTT', 'Node-RED', 'AWS IoT', 'Python'],
  },
  {
    id: 'ug-data',
    icon: Layers,
    domain: 'Data Science & Analytics',
    color: '#7A1A1A',
    bg: 'rgba(122,26,26,0.07)',
    description: 'Big data analysis, data visualization, business intelligence dashboards, and predictive analytics projects using Python and BI tools.',
    totalGroups: 3,
    highlights: [
      'Student performance prediction system',
      'COVID-19 data analysis and visualization',
      'Stock market trend prediction',
    ],
    technologies: ['Python', 'Pandas', 'Matplotlib', 'Tableau', 'Power BI', 'SQL'],
  },
]

const FILTER_TABS = ['All', 'PG Dissertations', 'UG Projects'] as const
type FilterTab = typeof FILTER_TABS[number]

// ═════════════════════════════════════════════════════════
export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const [expandedPG, setExpandedPG] = useState<string | null>(null)
  const [expandedUG, setExpandedUG] = useState<string | null>(null)

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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 80% at 85% 55%, rgba(184,135,10,0.09) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* Large watermark */}
        <div style={{ position: 'absolute', right: -30, bottom: -20, fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 'clamp(80px, 16vw, 200px)', color: 'rgba(255,255,255,0.03)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>70+</div>

        <div className="W" style={{ padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
              Projects & Mentorship
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 6vw, 70px)', fontWeight: 800, color: '#F0F4F8', lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 18, maxWidth: 700 }}>
              Shaping Engineers Through{' '}
              <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 600 }}>Research & Innovation</em>
            </h1>
            <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'rgba(226,232,240,0.70)', lineHeight: 1.75, maxWidth: 600, marginBottom: 36, fontWeight: 300 }}>
              Over 70 student projects guided across 18 years — from undergraduate capstone projects to M.E. dissertations that resulted in patents, international publications, and IEEE conference papers.
            </p>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', maxWidth: 560, gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { n: '10',  l: 'M.E. / PG', s: 'Dissertations' },
                { n: '60+', l: 'UG Groups', s: 'Capstone Projects' },
                { n: '6',   l: 'Domains',   s: 'Specializations' },
                { n: '5',   l: 'Published', s: 'Student Research' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                  style={{ padding: 'clamp(16px, 2.5vw, 24px) clamp(10px, 1.5vw, 16px)', textAlign: 'center', background: 'rgba(13,31,60,0.5)' }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1 }}>{s.n}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#E2E8F0', marginTop: 4 }}>{s.l}</p>
                  <p style={{ fontSize: 9.5, color: 'rgba(226,232,240,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{s.s}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TAB BAR ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--ink-line)', position: 'sticky', top: 'var(--nav-h)', zIndex: 100, boxShadow: '0 2px 12px rgba(13,31,60,0.05)' }}>
        <div className="W" style={{ padding: '0 clamp(18px, 5vw, 80px)', display: 'flex', gap: 0 }}>
          {FILTER_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 20px', background: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--navy)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--navy)' : 'var(--ink-4)',
                fontWeight: activeTab === tab ? 700 : 400,
                fontSize: 13.5, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                whiteSpace: 'nowrap', marginBottom: -1,
                transition: 'color 0.18s, border-color 0.18s',
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── PG PROJECTS ── */}
      <AnimatePresence>
        {(activeTab === 'All' || activeTab === 'PG Dissertations') && (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0' }}
          >
            <div className="W">
              <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--navy-pale)', border: '1px solid var(--navy-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={19} style={{ color: 'var(--navy)' }} />
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
                    Post-Graduate <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Dissertations</em>
                  </h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 640, fontWeight: 300 }}>
                  10 M.E. students guided to completion. Each dissertation represents original research that advanced knowledge in AI, cybersecurity, web engineering, and healthcare informatics — many resulting in international publications and patents.
                </p>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PG_PROJECTS.map((p, i) => {
                  const isOpen = expandedPG === p.id
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.55 }}>
                      <div style={{
                        background: '#fff', border: '1px solid rgba(15,23,42,0.08)',
                        borderRadius: 12, overflow: 'hidden',
                        boxShadow: isOpen ? 'var(--sh2)' : 'var(--sh1)',
                        transition: 'box-shadow 0.2s, border-color 0.2s',
                        borderColor: isOpen ? `${p.color}40` : 'rgba(15,23,42,0.08)',
                      }}>
                        {/* Color bar */}
                        <div style={{ height: 3, background: `linear-gradient(90deg, ${p.color}, var(--gold))` }} />

                        {/* Header — always visible */}
                        <button
                          onClick={() => setExpandedPG(isOpen ? null : p.id)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                            padding: 'clamp(16px, 2.5vw, 22px) clamp(16px, 2.5vw, 24px)',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            textAlign: 'left', fontFamily: 'DM Sans, sans-serif',
                          }}
                        >
                          {/* Index */}
                          <div style={{ width: 38, height: 38, borderRadius: 9, background: `${p.color}10`, border: `1px solid ${p.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: p.color, lineHeight: 1 }}>{i + 1}</p>
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.color, background: `${p.color}10`, border: `1px solid ${p.color}28`, padding: '2px 8px', borderRadius: 4 }}>{p.domain}</span>
                              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{p.year}</span>
                            </div>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(14.5px, 1.4vw, 17px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.35 }}>
                              {p.title}
                            </h3>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            <span style={{ fontSize: 12, color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Users size={11} /> {p.student.split(',')[0]}
                            </span>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: isOpen ? 'var(--navy-pale)' : 'var(--off)', border: '1px solid var(--ink-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOpen ? 'var(--navy)' : 'var(--ink-4)', transition: 'all 0.18s' }}>
                              {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </div>
                          </div>
                        </button>

                        {/* Expandable detail */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ padding: '0 clamp(16px, 2.5vw, 24px) clamp(20px, 3vw, 28px)', paddingLeft: 'calc(clamp(16px, 2.5vw, 24px) + 38px + 16px)' }}>
                                <div style={{ height: 1, background: 'var(--ink-line)', marginBottom: 18 }} />

                                {/* Student + university */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <Users size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
                                    <div>
                                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 2 }}>Student / Scholar</p>
                                      <p style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{p.student}</p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <Building2 size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }} />
                                    <div>
                                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 2 }}>Institution</p>
                                      <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.4 }}>{p.university}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Summary */}
                                <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.78, marginBottom: 14, fontWeight: 300 }}>{p.summary}</p>

                                {/* Outcome */}
                                <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'rgba(26,107,72,0.06)', border: '1px solid rgba(26,107,72,0.18)', marginBottom: 16 }}>
                                  <Award size={14} style={{ color: '#1A6B48', flexShrink: 0, marginTop: 2 }} />
                                  <div>
                                    <p style={{ fontSize: 10.5, fontWeight: 700, color: '#1A5038', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Research Outcome</p>
                                    <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{p.outcome}</p>
                                  </div>
                                </div>

                                {/* Tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                  {p.tags.map(t => (
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
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {activeTab === 'All' && <div style={{ height: 1, background: 'var(--ink-line)' }} />}

      {/* ── UG PROJECTS ── */}
      <AnimatePresence>
        {(activeTab === 'All' || activeTab === 'UG Projects') && (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'var(--off)', padding: 'clamp(48px, 8vh, 80px) 0' }}
          >
            <div className="W">
              <motion.div {...up()} style={{ marginBottom: 'clamp(28px, 5vh, 44px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gold-pale)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code2 size={19} style={{ color: 'var(--gold)' }} />
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
                    Undergraduate <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Project Groups</em>
                  </h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 640, fontWeight: 300 }}>
                  60+ UG project groups guided across 6 technical domains. Each group received mentorship from problem definition through design, development, testing, and final presentation.
                </p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ST}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 44%, 500px), 1fr))', gap: 'clamp(14px, 2vw, 22px)' }}>
                {UG_DOMAINS.map(d => {
                  const isOpen = expandedUG === d.id
                  return (
                    <motion.div key={d.id} variants={SI}>
                      <div style={{
                        background: '#fff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 13,
                        overflow: 'hidden', height: '100%',
                        boxShadow: isOpen ? 'var(--sh2)' : 'var(--sh1)',
                        borderColor: isOpen ? `${d.color}40` : 'rgba(15,23,42,0.08)',
                        transition: 'box-shadow 0.2s, border-color 0.2s',
                      }}>
                        <div style={{ height: 3, background: `linear-gradient(90deg, ${d.color}, var(--gold))` }} />

                        <div style={{ padding: 'clamp(18px, 2.5vw, 26px)' }}>
                          {/* Domain header */}
                          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: d.bg, border: `1px solid ${d.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <d.icon size={20} style={{ color: d.color }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(15px, 1.4vw, 17px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 5 }}>{d.domain}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: d.color, lineHeight: 1 }}>{d.totalGroups}+</span>
                                <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 500 }}>project groups</span>
                              </div>
                            </div>
                          </div>

                          <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.72, marginBottom: 14 }}>{d.description}</p>

                          {/* Tech chips */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                            {d.technologies.map(t => (
                              <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>
                            ))}
                          </div>

                          {/* Expand button */}
                          <button
                            onClick={() => setExpandedUG(isOpen ? null : d.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              fontSize: 12, fontWeight: 600, color: d.color,
                              background: d.bg, border: `1px solid ${d.color}22`,
                              borderRadius: 6, padding: '6px 12px', cursor: 'pointer',
                              fontFamily: 'DM Sans, sans-serif',
                              transition: 'background 0.18s',
                            }}
                          >
                            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            {isOpen ? 'Hide project highlights' : 'Show project highlights'}
                          </button>

                          {/* Highlights */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--ink-line)' }}>
                                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 10 }}>Sample Projects</p>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {d.highlights.map((h, i) => (
                                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: d.color, flexShrink: 0, marginTop: 6 }} />
                                        <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{h}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── MENTORSHIP PHILOSOPHY ── */}
      <section style={{ background: 'var(--navy)', padding: 'clamp(52px, 9vh, 88px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold-3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(184,135,10,0.07) 0%, transparent 55%), radial-gradient(circle at 20% 50%, rgba(255,255,255,0.02) 0%, transparent 55%)', pointerEvents: 'none' }} />

        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(40px, 7vw, 80px)', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
                Mentorship Approach
              </p>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.12, marginBottom: 20 }}>
                Every Project is a{' '}
                <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 500 }}>Research Experience</em>
              </h2>
              <p style={{ fontSize: 14.5, color: 'rgba(226,232,240,0.68)', lineHeight: 1.82, fontWeight: 300 }}>
                I guide students not just to build a working system, but to understand the problem deeply, survey existing literature, design a rigorous methodology, and communicate findings professionally. The result is engineers who think like researchers — and researchers who can build.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { step: '01', title: 'Problem Identification', desc: 'Students identify real-world gaps with literature support and clear problem statements.' },
                { step: '02', title: 'Research Methodology', desc: 'Guided design of experiments, dataset collection, and architectural decisions.' },
                { step: '03', title: 'Build & Iterate',       desc: 'Hands-on development with regular review cycles and iterative refinement.' },
                { step: '04', title: 'Document & Publish',    desc: 'Quality work is submitted to journals and conferences — real academic output.' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--gold-3)', lineHeight: 1, flexShrink: 0, minWidth: 32 }}>{s.step}</span>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#E2E8F0', marginBottom: 4 }}>{s.title}</p>
                    <p style={{ fontSize: 12.5, color: 'rgba(226,232,240,0.55)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0', borderTop: '1px solid var(--ink-line)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
            <FlaskConical size={26} style={{ color: 'var(--gold)', margin: '0 auto 14px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
              Want to Collaborate on a <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Research Project?</em>
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 480, margin: '0 auto 30px', lineHeight: 1.75, fontWeight: 300 }}>
              I am open to supervising M.E. dissertations, co-authoring research, and guiding institutional capstone projects in AI, ML, and Computer Vision.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <Link href="/contact"  className="btn-navy" style={{ padding: '12px 26px', fontSize: 14 }}>Discuss a Project <ArrowRight size={14} /></Link>
              <Link href="/research" className="btn-out"  style={{ padding: '12px 26px', fontSize: 14 }}>View Publications</Link>
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