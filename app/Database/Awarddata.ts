import {
  GraduationCap, Shield, BookOpen, Globe,
  Award, Briefcase, School, Target, Layers,
  FlaskConical, Building2, Trophy,
} from 'lucide-react'

export type AwardCategory = 'Academic' | 'Research' | 'Institutional' | 'Intellectual Property' | 'Professional'

export interface AwardItem {
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

export const AWARDS: AwardItem[] = [
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

export const CATEGORY_COLORS: Record<AwardCategory, { bg: string; border: string; text: string; dot: string }> = {
  'Academic': { bg: 'rgba(13,31,60,0.08)', border: 'rgba(13,31,60,0.18)', text: '#0D1F3C', dot: '#0D1F3C' },
  'Research': { bg: 'rgba(26,107,72,0.08)', border: 'rgba(26,107,72,0.22)', text: '#1A5038', dot: '#1A6B48' },
  'Institutional': { bg: 'rgba(122,85,0,0.08)', border: 'rgba(122,85,0,0.20)', text: '#7A5500', dot: '#B8870A' },
  'Intellectual Property': { bg: 'rgba(184,135,10,0.09)', border: 'rgba(184,135,10,0.24)', text: '#7A5500', dot: '#B8870A' },
  'Professional': { bg: 'rgba(45,91,138,0.08)', border: 'rgba(45,91,138,0.20)', text: '#1A3560', dot: '#2D5B8A' },
}

export const CATEGORIES: AwardCategory[] = ['Academic', 'Intellectual Property', 'Institutional', 'Professional', 'Research']

export const FEATURED_AWARD = AWARDS.find(a => a.featured)!
export const REST_AWARDS = AWARDS.filter(a => !a.featured)

export const YEARS = [...new Set(AWARDS.map(a => a.year))].sort((a, b) => Number(b) - Number(a))

export const HERO_STATS = [
  { n: String(AWARDS.length), l: 'Total Honours' },
  { n: '02', l: 'Patents Filed' },
  { n: '02', l: 'Copyrights' },
  { n: '17', l: 'Years of Record' },
]

export const QUOTE = {
  text: '"Every recognition is a reflection of the students, colleagues, and institutions that made the work possible."',
  author: 'Dr. Sachin B. Takmare',
}

export const FEATURED_DETAILS = [
  { k: 'Degree', v: 'Doctor of Philosophy (Ph.D.)' },
  { k: 'Institution', v: 'Pacific University, Udaipur, Rajasthan' },
  { k: 'Year', v: '2024 — Awarded' },
  { k: 'Thesis', v: 'Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis' },
  { k: 'Method', v: 'Convolutional Neural Networks + YOLO' },
  { k: 'Outcome', v: '2 Int\'l Publications · 1 Utility Patent Filed' },
  { k: 'Prior Quals', v: 'M.Tech (70%) · B.E. (69.36%) · HSC (69.67%)' },
]