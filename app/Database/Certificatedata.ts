// lib/certificates-data.ts
// ─────────────────────────────────────────────────────────────
//  Central data file for ALL certificates, patents, copyrights
//  of Dr. Sachin Balawant Takmare.
//
//  HOW TO ADD A NEW CERTIFICATE:
//  1. Add a new object to CERTIFICATES array below
//  2. Set `file` to the path inside /public/
//     e.g. '/certificates/my-cert.pdf' or '/certificates/my-cert.jpg'
//  3. Set `type` to 'image' for JPG/PNG, or 'pdf' for PDF
//  4. Save — it appears on the page automatically
// ─────────────────────────────────────────────────────────────

export type CertType = 'image' | 'pdf'

export type CertCategory =
  | 'University Approval'
  | 'Academic Achievement'
  | 'Professional Development'
  | 'Workshop & Training'
  | 'Award & Recognition'
  | 'Conference'
  | 'Online Course'
  | 'Other'

export type Certificate = {
  id: string
  title: string
  issuer: string
  date: string
  year: number
  category: CertCategory
  description?: string
  file: string       // path in /public — e.g. '/certificates/cert.jpg'
  type: CertType
  tags?: string[]
  credentialId?: string
  link?: string
}

export type Patent = {
  id: string
  title: string
  applicationNo: string
  referenceNo?: string
  docketNo?: string
  crcNo?: string
  filingDate: string
  publicationDate?: string
  status: 'Published' | 'Granted' | 'Pending'
  type: 'Utility' | 'Design' | 'Process'
  description: string
  tags: string[]
  file?: string
  certType?: CertType
}

export type Copyright = {
  id: string
  title: string
  category: string
  diaryNo: string
  date: string
  year: number
  published: boolean
  description?: string
  file?: string
  certType?: CertType
}

// ── Category badge colors ─────────────────────────────────────
export const CAT_COLOR: Record<CertCategory, { bg: string; border: string; text: string }> = {
  'University Approval':      { bg: 'rgba(13,31,60,0.07)',    border: 'rgba(13,31,60,0.18)',    text: '#0D1F3C' },
  'Academic Achievement':     { bg: 'rgba(184,135,10,0.09)',  border: 'rgba(184,135,10,0.24)',  text: '#7A5500' },
  'Professional Development': { bg: 'rgba(26,107,72,0.08)',   border: 'rgba(26,107,72,0.22)',   text: '#1A6B48' },
  'Workshop & Training':      { bg: 'rgba(45,91,138,0.08)',   border: 'rgba(45,91,138,0.22)',   text: '#2D5B8A' },
  'Award & Recognition':      { bg: 'rgba(184,135,10,0.12)',  border: 'rgba(184,135,10,0.30)',  text: '#B8870A' },
  'Conference':               { bg: 'rgba(60,40,100,0.08)',   border: 'rgba(60,40,100,0.22)',   text: '#3C2864' },
  'Online Course':            { bg: 'rgba(30,70,110,0.08)',   border: 'rgba(30,70,110,0.22)',   text: '#1E466E' },
  'Other':                    { bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.20)', text: '#475569' },
}

// ══════════════════════════════════════════════════════════════
//  CERTIFICATES — SORTED by year (descending) then alphabetically
// ══════════════════════════════════════════════════════════════
export const CERTIFICATES: Certificate[] = [
  {
    id: 'cert-nptel-llm',
    title: 'NPTEL — Large Language Models (LLM)',
    issuer: 'NPTEL (IIT)',
    date: '2024',
    year: 2024,
    category: 'Online Course',
    description: 'Successfully completed NPTEL course on Large Language Models (LLMs), covering fundamentals of transformer architectures, NLP, and generative AI systems.',
    file: '/certificate/LLMNPTEL.pdf',
    type: 'pdf',
    tags: ['NPTEL', 'LLM', 'AI', 'NLP', 'Deep Learning'],
  },
  {
    id: 'cert-fdp-ai',
    title: 'Faculty Development Program — Unlock The Power of AI in Education and Research',
    issuer: 'D Y Patil College of Engineering and Technology, Kolhapur',
    date: '2024',
    year: 2024,
    category: 'Professional Development',
    description: 'Awarded for active participation in a two-week online Faculty Development Program focused on AI applications in education and research.',
    file: '/certificate/fpd1.pdf',
    type: 'pdf',
    tags: ['FDP', 'AI', 'Education', 'Research', 'Faculty Development'],
  },
  {
    id: 'cert-nptel-python',
    title: 'NPTEL — Python for Data Science',
    issuer: 'NPTEL (IIT)',
    date: '2024',
    year: 2024,
    category: 'Online Course',
    description: 'Completed NPTEL certification in Python, covering programming fundamentals, data handling, and applications in data science and AI.',
    file: '/certificate/pythonNPTEL.pdf',
    type: 'pdf',
    tags: ['Python', 'NPTEL', 'Programming', 'Data Science'],
  },
  {
    id: 'cert-copyright-2',
    title: 'Copyright Registration — VR Interactive Online Education',
    issuer: 'Copyright Office, Government of India',
    date: 'December 2024',
    year: 2024,
    category: 'Award & Recognition',
    description: 'Registered copyright for computer software: "A Virtual Reality Solution for Interactive and Engaging Online Education." Diary No: 25004/2024-CO/SW.',
    file: '/certificates/copyright-vr-education.jpg',
    type: 'image',
    tags: ['Copyright', 'VR', 'Education Software', 'IP'],
  },
  {
    id: 'cert-copyright-1',
    title: 'Copyright Registration — Plant Species & Weed Classification (CNN)',
    issuer: 'Copyright Office, Government of India',
    date: 'May 2024',
    year: 2024,
    category: 'Award & Recognition',
    description: 'Registered copyright for computer software: "Plant Species and Weed Classification for Precision Agriculture using CNN." Diary No: 14704/2024-CO/SW.',
    file: '/certificates/copyright-plant-cnn.jpg',
    type: 'image',
    tags: ['Copyright', 'CNN', 'Software IP', 'Precision Agriculture'],
  },
  {
    id: 'cert-mumbai-ap-2018',
    title: 'University Approval — Assistant Professor, University of Mumbai',
    issuer: 'University of Mumbai',
    date: 'April 2018',
    year: 2018,
    category: 'University Approval',
    description: 'Appointment approved as Assistant Professor in Computer Engineering Dept. Letter No. TAAS(CT)/ICD/2017-18/11257 dated 18-04-2018.',
    file: '/certificates/approval-mumbai-2018.jpg',
    type: 'image',
    tags: ['University of Mumbai', 'Assistant Professor', 'Appointment Letter'],
  },
  {
    id: 'cert-cap-director',
    title: 'Appointment as Assistant CAP Director',
    issuer: 'Shivaji University, Kolhapur',
    date: '2014',
    year: 2014,
    category: 'University Approval',
    description: 'Appointed as Assistant CAP Director by Shivaji University Kolhapur.',
    file: '/certificates/cap-director.jpg',
    type: 'image',
    tags: ['CAP Director', 'Shivaji University', 'Administration'],
  },
  {
    id: 'cert-me-examiner',
    title: 'External Examiner — M.E. Dissertation Evaluation',
    issuer: 'Shivaji University, Kolhapur',
    date: '2014',
    year: 2014,
    category: 'University Approval',
    description: 'Appointed as External Evaluator and Examiner for M.E. Dissertation evaluation by Shivaji University Kolhapur.',
    file: '/certificates/me-examiner.jpg',
    type: 'image',
    tags: ['Examiner', 'M.E. Dissertation', 'External Evaluator'],
  },
  {
    id: 'cert-pg-teacher',
    title: 'PG Recognized Teacher — Shivaji University Kolhapur',
    issuer: 'Shivaji University, Kolhapur',
    date: '2014',
    year: 2014,
    category: 'University Approval',
    description: 'Recognized as PG Teacher by Shivaji University Kolhapur, authorizing supervision of M.E. dissertation research students.',
    file: '/certificates/pg-teacher.jpg',
    type: 'image',
    tags: ['PG Teacher', 'Shivaji University', 'M.E. Supervision'],
  },
  {
    id: 'cert-shivaji-ap-2014',
    title: 'University Approval — Assistant Professor, Shivaji University',
    issuer: 'Shivaji University, Kolhapur',
    date: 'February 2014',
    year: 2014,
    category: 'University Approval',
    description: 'Appointment approved as Assistant Professor in CSE Dept. Letter No. Afi/T3/STS/F-105 dated 10 Feb 2014.',
    file: '/certificates/approval-shivaji-2014.jpg',
    type: 'image',
    tags: ['Shivaji University', 'Assistant Professor', 'Appointment Letter'],
  },
  {
    id: 'cert-mumbai-lecturer-2008',
    title: 'University Approval — Lecturer, University of Mumbai',
    issuer: 'University of Mumbai',
    date: 'November 2008',
    year: 2008,
    category: 'University Approval',
    description: 'Appointment approved as Lecturer in Computer Engineering Department. Letter No. CONCOL/SA/4532 dated 11 Nov 2008.',
    file: '/certificates/approval-mumbai-2008.jpg',
    type: 'image',
    tags: ['University of Mumbai', 'Lecturer', 'Appointment Letter'],
  },
]

// Sort certificates: by year (descending), then by title (alphabetical)
CERTIFICATES.sort((a, b) => {
  if (a.year !== b.year) {
    return b.year - a.year // Latest year first
  }
  return a.title.localeCompare(b.title) // Alphabetical within same year
})

// ── Dynamic KPIs ─────────────────────────────────────────────
export const CERTIFICATE_KPIS = {
  totalCertificates: CERTIFICATES.length,
  uniqueCategories: new Set(CERTIFICATES.map(c => c.category)).size,
  certificatesSince2020: CERTIFICATES.filter(c => c.year >= 2020).length,
}

// ── Category counts (dynamic) ────────────────────────────────
export const getCategoryCounts = () => {
  const counts: Record<string, number> = { All: CERTIFICATES.length }
  CERTIFICATES.forEach(cert => {
    counts[cert.category] = (counts[cert.category] || 0) + 1
  })
  return counts
}

// ── Year range (dynamic) ─────────────────────────────────────
export const getYearRange = () => {
  const years = CERTIFICATES.map(c => c.year)
  return {
    min: Math.min(...years),
    max: Math.max(...years),
  }
}

// ── Group certificates by year (for year-wise display) ───────
export const getCertificatesByYear = () => {
  const grouped: Record<number, Certificate[]> = {}
  CERTIFICATES.forEach(cert => {
    if (!grouped[cert.year]) {
      grouped[cert.year] = []
    }
    grouped[cert.year].push(cert)
  })
  // Sort years descending
  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)
    .reduce((acc, year) => {
      acc[year] = grouped[year]
      return acc
    }, {} as Record<number, Certificate[]>)
}

// ══════════════════════════════════════════════════════════════
//  PATENTS
// ══════════════════════════════════════════════════════════════
export const PATENTS: Patent[] = [
  {
    id: 'patent-precision-farming',
    title: 'Precision Farming: AI-Based System for Crop and Weed Management and Density Analysis',
    applicationNo: 'E-12/2767/2024/MUM',
    referenceNo: '202421045939',
    docketNo: '56637',
    crcNo: '27869',
    filingDate: '14 June 2024',
    publicationDate: 'Published',
    status: 'Published',
    type: 'Utility',
    description: 'An AI-driven precision farming system that uses Convolutional Neural Networks (CNN) and YOLO-based density estimation to classify crops and weeds from field imagery in real time. Enables targeted herbicide application, reducing overuse of chemicals and its environmental impact while improving crop yield and farm profitability.',
    tags: ['CNN', 'YOLO', 'Precision Agriculture', 'Crop & Weed', 'AI', 'Machine Learning', 'Computer Vision'],
    file: '/patent/Patent1.jpg',
    certType: 'image',
  },
  {
    id: 'patent-malware',
    title: 'Intelligent Malware Metamorphosis and Evasion Prevention System',
    applicationNo: '202421069724',
    filingDate: '15 September 2024',
    publicationDate: '18 October 2024',
    status: 'Published',
    type: 'Utility',
    description: 'An intelligent cybersecurity system that identifies and prevents metamorphic malware from evading traditional antivirus and detection mechanisms. Combines behavioral pattern analysis, heuristic detection, and AI-based anomaly recognition to intercept evasion strategies in real time across diverse system environments.',
    tags: ['Cybersecurity', 'Malware Detection', 'AI', 'Metamorphic Malware', 'Evasion Prevention', 'Security'],
    file: '/patent/Patent2.jpg',
    certType: 'image',
  },
]

// ══════════════════════════════════════════════════════════════
//  COPYRIGHTS
// ══════════════════════════════════════════════════════════════
export const COPYRIGHTS: Copyright[] = [
  {
    id: 'copy-plant-cnn',
    title: 'Plant Species and Weed Classification for Precision Agriculture using CNN',
    category: 'Computer Software',
    diaryNo: '14704/2024-CO/SW',
    date: '7 May 2024',
    year: 2024,
    published: true,
    description: 'Software copyright for the CNN-based plant species and weed classification system developed as part of Ph.D. research in precision agriculture.',
    file: '/certificates/copyright-plant-cnn.jpg',
    certType: 'image',
  },
  {
    id: 'copy-vr-education',
    title: 'A Virtual Reality Solution for Interactive and Engaging Online Education',
    category: 'Computer Software',
    diaryNo: '25004/2024-CO/SW',
    date: '27 December 2024',
    year: 2024,
    published: true,
    description: 'Software copyright for the VR-based virtual classroom system enabling immersive, interactive online education experiences.',
    file: '/patent/copyright2.pdf',
    certType: 'pdf',
  },
]

// Export all categories for filter
export const ALL_CATEGORIES = ['All', ...Array.from(new Set(CERTIFICATES.map(c => c.category)))]