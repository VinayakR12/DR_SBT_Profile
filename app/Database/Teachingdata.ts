import {
  Layers, Database, Network, Code2, Globe, Cpu,
  Brain, FlaskConical, Shield, BookOpen, Users,
  GraduationCap, Award, Building2, Target, Lightbulb,
  TrendingUp, School, BookMarked,Star
} from 'lucide-react'

// ── SUBJECTS DATA ──
export type Subject = {
  icon: any
  name: string
  cat: 'Core CS' | 'AI & ML' | 'Software' | 'Security' | 'Research'
  color: string
  level: ('UG' | 'PG')[]
}

export const SUBJECTS: Subject[] = [
  // Core CS
  { icon: Layers,      name: 'Data Structures & Algorithms',       cat: 'Core CS',   color: '#0D1F3C', level: ['UG'] },
  { icon: Database,    name: 'Database Management Systems',         cat: 'Core CS',   color: '#1A3560', level: ['UG'] },
  { icon: Network,     name: 'Computer Networks',                   cat: 'Core CS',   color: '#0D1F3C', level: ['UG', 'PG'] },
  { icon: Code2,       name: 'Theory of Computation',               cat: 'Core CS',   color: '#2D5B8A', level: ['UG'] },
  { icon: Globe,       name: 'Operating Systems',                   cat: 'Core CS',   color: '#1A3560', level: ['UG'] },
  { icon: Cpu,         name: 'Computer Organization & Architecture', cat: 'Core CS',  color: '#0D1F3C', level: ['UG'] },
  // AI / ML
  { icon: Brain,       name: 'Artificial Intelligence',             cat: 'AI & ML',   color: '#1A6B48', level: ['UG', 'PG'] },
  { icon: FlaskConical,name: 'Machine Learning',                    cat: 'AI & ML',   color: '#1A6B48', level: ['UG', 'PG'] },
  { icon: Brain,       name: 'Deep Learning',                       cat: 'AI & ML',   color: '#1A5038', level: ['PG'] },
  { icon: Brain,       name: 'Computer Vision',                     cat: 'AI & ML',   color: '#1A6B48', level: ['PG'] },
  { icon: Brain,       name: 'Natural Language Processing',         cat: 'AI & ML',   color: '#1A5038', level: ['PG'] },
  // Software
  { icon: Code2,       name: 'Software Engineering',                cat: 'Software',  color: '#B8870A', level: ['UG', 'PG'] },
  { icon: Globe,       name: 'Web Technologies',                    cat: 'Software',  color: '#B8870A', level: ['UG'] },
  { icon: Code2,       name: 'Object-Oriented Programming (Java)',  cat: 'Software',  color: '#7A5500', level: ['UG'] },
  // Security
  { icon: Shield,      name: 'Cybersecurity & Ethical Hacking',     cat: 'Security',  color: '#5C3A8A', level: ['UG', 'PG'] },
  { icon: Shield,      name: 'Information & Network Security',      cat: 'Security',  color: '#3A2A6A', level: ['UG'] },
  // Research Methods
  { icon: FlaskConical,name: 'Research Methodology',                cat: 'Research',  color: '#7A1A1A', level: ['PG'] },
  { icon: Layers,      name: 'Advanced Algorithms',                 cat: 'Research',  color: '#5C1A1A', level: ['PG'] },
]

// ── INSTITUTIONS DATA ──
export type Institution = {
  id: string
  period: string
  role: string
  org: string
  city: string
  univ: string
  color: string
  current: boolean
  roles: string[]
  highlight: string
}

export const INSTITUTIONS: Institution[] = [
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

// ── ADMIN ROLES ──
export type AdminRole = {
  icon: any
  color: string
  title: string
  desc: string
  inst: string
}

export const ROLES_ADMIN: AdminRole[] = [
  { icon: Target,    color: '#0D1F3C', title: 'NBA Criteria-3 Coordinator', desc: 'Led the preparation and documentation for NBA accreditation under Criteria 3 Research, Consultancy & Extension. Managed student research output tracking and faculty contribution mapping.', inst: 'A. P. Shah Institute of Technology' },
  { icon: Lightbulb, color: '#B8870A', title: 'PBL In-charge',              desc: 'Designed and implemented the Project-Based Learning framework across all semesters. Created evaluation rubrics, mentored faculty on PBL pedagogy, and tracked project outcomes for NBA.', inst: 'A. P. Shah Institute of Technology' },
  { icon: TrendingUp,color: '#1A6B48', title: 'III Cell In-charge',          desc: 'Led the Innovation, Incubation & Ideation Cell supporting student startup ideas, organising innovation challenges, and connecting students with industry mentors.', inst: 'A. P. Shah Institute of Technology' },
  { icon: School,    color: '#2D5B8A', title: 'Head of Department',          desc: 'Managed the CSE Department at Bharati Vidyapeeth overseeing faculty recruitment, curriculum design, timetabling, student grievances, and departmental accreditation activities.', inst: "Bharati Vidyapeeth's College of Engineering" },
  { icon: GraduationCap, color: '#5C3A8A', title: 'Assistant CAP Director', desc: 'Appointed by Shivaji University as Assistant CAP (Centralised Admission Process) Director coordinating merit-based admissions for M.E. programmes.', inst: 'Shivaji University, Kolhapur' },
  { icon: Award,     color: '#7A1A1A', title: 'External Examiner M.E.',   desc: 'Appointed as External Evaluator and Examiner for M.E. Dissertation evaluation under Shivaji University Kolhapur assessed research quality, methodology, and presentation.', inst: 'Shivaji University, Kolhapur' },
]

// ── PEDAGOGY ──
export type Pedagogy = {
  icon: any
  title: string
  desc: string
}

export const PEDAGOGY: Pedagogy[] = [
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

// ── CREDENTIALS ──
export const CREDENTIALS = [
  'Approved by University of Mumbai as Lecturer (Nov 2008)',
  'Approved as Assistant Professor Shivaji University (Feb 2014)',
  'Approved as Assistant Professor University of Mumbai (Apr 2018)',
  'PG Recognized Teacher Shivaji University Kolhapur',
]

// ── HERO STATS ──
export const HERO_STATS = [
  { n: '18+', l: 'Years', s: 'UGC Approved' },
  { n: '4',   l: 'Institutions', s: 'Mumbai & Shivaji Univ.' },
  { n: '18+', l: 'Subjects', s: 'UG & PG Level' },
]

// ── STUDENT IMPACT STATS ──
export const STUDENT_IMPACT_STATS = [
  { I: GraduationCap, n: '18+', l: 'Years',         s: 'UGC Approved' },
  { I: Users,         n: '60+', l: 'UG Groups',     s: 'Projects Mentored' },
  { I: BookOpen,      n: '10',  l: 'M.E. Students', s: 'Dissertations Guided' },
  { I: Award,         n: '5+',  l: 'Published',     s: 'Student Research' },
  { I: Building2,     n: '4',   l: 'Institutions',  s: 'Mumbai & Kolhapur' },
  { I: Star,          n: '6',   l: 'Admin Roles',   s: 'Leadership' },
]

// ── SUBJECT FILTERS ──
export type SubjectFilter = 'All' | 'Core CS' | 'AI & ML' | 'Software' | 'Security' | 'Research'
export const SUBJ_FILTERS: SubjectFilter[] = ['All', 'Core CS', 'AI & ML', 'Software', 'Security', 'Research']

// ── LEVEL COLORS ──
export const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  UG: { bg: 'rgba(13,31,60,0.08)',   text: '#0D1F3C',  border: 'rgba(13,31,60,0.18)' },
  PG: { bg: 'rgba(184,135,10,0.10)', text: '#7A5500',  border: 'rgba(184,135,10,0.25)' },
}

// ── GET UNIQUE SUBJECT CATEGORIES ──
export const getUniqueCategories = () => {
  return [...new Set(SUBJECTS.map(s => s.cat))]
}

// ── GET SUBJECT COUNT BY CATEGORY ──
export const getSubjectCountByCategory = () => {
  const counts: Record<string, number> = { All: SUBJECTS.length }
  SUBJECTS.forEach(s => {
    counts[s.cat] = (counts[s.cat] || 0) + 1
  })
  return counts
}

// ── GET SUBJECTS BY LEVEL ──
export const getSubjectsByLevel = (level: 'UG' | 'PG') => {
  return SUBJECTS.filter(s => s.level.includes(level))
}