import {
  Layers,
  Database,
  Network,
  Code2,
  Globe,
  Cpu,
  Brain,
  FlaskConical,
  Shield,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  Building2,
  Target,
  Lightbulb,
  TrendingUp,
  School,
  BookMarked,
  Star,
} from 'lucide-react'

import {
  SUBJECTS,
  INSTITUTIONS,
  ROLES_ADMIN,
  PEDAGOGY,
  CREDENTIALS,
  HERO_STATS,
  STUDENT_IMPACT_STATS,
  type SubjectFilter,
} from '@/app/Database/Teachingdata'
import { HOME_CONTENT_TABLE } from '@/lib/supabase'

type IconComponent = React.ComponentType<any>

const ICON_BY_KEY: Record<string, IconComponent> = {
  layers: Layers,
  database: Database,
  network: Network,
  code2: Code2,
  globe: Globe,
  cpu: Cpu,
  brain: Brain,
  flask: FlaskConical,
  shield: Shield,
  book: BookOpen,
  users: Users,
  graduation: GraduationCap,
  award: Award,
  building: Building2,
  target: Target,
  lightbulb: Lightbulb,
  trend: TrendingUp,
  school: School,
  bookmark: BookMarked,
  star: Star,
}

export const TEACHING_ICON_OPTIONS = [
  { key: 'layers', label: 'Layers' },
  { key: 'database', label: 'Database' },
  { key: 'network', label: 'Network' },
  { key: 'code2', label: 'Code' },
  { key: 'globe', label: 'Globe' },
  { key: 'cpu', label: 'CPU' },
  { key: 'brain', label: 'Brain' },
  { key: 'flask', label: 'Flask' },
  { key: 'shield', label: 'Shield' },
  { key: 'book', label: 'Book' },
  { key: 'users', label: 'Users' },
  { key: 'graduation', label: 'Graduation' },
  { key: 'award', label: 'Award' },
  { key: 'building', label: 'Building' },
  { key: 'target', label: 'Target' },
  { key: 'lightbulb', label: 'Lightbulb' },
  { key: 'trend', label: 'Trend' },
  { key: 'school', label: 'School' },
  { key: 'bookmark', label: 'Bookmark' },
  { key: 'star', label: 'Star' },
] as const

export type TeachingIconKey = (typeof TEACHING_ICON_OPTIONS)[number]['key']

const ICON_KEY_BY_COMPONENT = new Map<unknown, string>([
  [Layers, 'layers'],
  [Database, 'database'],
  [Network, 'network'],
  [Code2, 'code2'],
  [Globe, 'globe'],
  [Cpu, 'cpu'],
  [Brain, 'brain'],
  [FlaskConical, 'flask'],
  [Shield, 'shield'],
  [BookOpen, 'book'],
  [Users, 'users'],
  [GraduationCap, 'graduation'],
  [Award, 'award'],
  [Building2, 'building'],
  [Target, 'target'],
  [Lightbulb, 'lightbulb'],
  [TrendingUp, 'trend'],
  [School, 'school'],
  [BookMarked, 'bookmark'],
  [Star, 'star'],
])

const getIconKey = (value: unknown, fallback: string): string => {
  const resolved = ICON_KEY_BY_COMPONENT.get(value)
  return resolved || fallback
}

const getIcon = (key: string, fallback: IconComponent): IconComponent => ICON_BY_KEY[key] || fallback

const toStringArray = (value: unknown, fallback: string[] = []): string[] => {
  if (!Array.isArray(value)) {
    return [...fallback]
  }

  return value.map((item) => `${item}`.trim()).filter(Boolean)
}

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  const parsed = Number.parseInt(`${value}`, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const TEACHING_TABLE = HOME_CONTENT_TABLE
export const TEACHING_KEY = 'teaching'

export type TeachingHeroStat = {
  n: string
  l: string
  s: string
}

export type TeachingHero = {
  kicker: string
  titleLead: string
  titleEmphasis: string
  description: string
  quote: string
  quoteAuthor: string
  stats: TeachingHeroStat[]
}

export type TeachingIdentity = {
  kicker: string
  titleLead: string
  titleEmphasis: string
  paragraph1: string
  paragraph2: string
  credentials: string[]
}

export type TeachingPedagogyItem = {
  iconKey: string
  icon: IconComponent
  title: string
  desc: string
}

export type TeachingSubjectsItem = {
  iconKey: string
  icon: IconComponent
  name: string
  cat: 'Core CS' | 'AI & ML' | 'Software' | 'Security' | 'Research'
  color: string
  level: ('UG' | 'PG')[]
}

export type TeachingInstitutionItem = {
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
  resourceLink?: string
  documentUrl?: string
}

export type TeachingAdminRoleItem = {
  iconKey: string
  icon: IconComponent
  color: string
  title: string
  desc: string
  inst: string
}

export type TeachingImpactStat = {
  iconKey: string
  icon: IconComponent
  n: string
  l: string
  s: string
}

export type TeachingSubjectsBlock = {
  kicker: string
  titleLead: string
  titleEmphasis: string
  items: TeachingSubjectsItem[]
}

export type TeachingInstitutionsBlock = {
  kicker: string
  titleLead: string
  titleEmphasis: string
  items: TeachingInstitutionItem[]
}

export type TeachingAdminBlock = {
  kicker: string
  titleLead: string
  titleEmphasis: string
  roles: TeachingAdminRoleItem[]
}

export type TeachingImpactBlock = {
  kicker: string
  titleLead: string
  titleEmphasis: string
  stats: TeachingImpactStat[]
}

export type TeachingCta = {
  titleLead: string
  titleEmphasis: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

export type TeachingContentRaw = {
  hero: TeachingHero
  identity: TeachingIdentity
  pedagogy: TeachingPedagogyItem[]
  subjects: TeachingSubjectsBlock
  institutions: TeachingInstitutionsBlock
  admin: TeachingAdminBlock
  impact: TeachingImpactBlock
  cta: TeachingCta
}

export const TEACHING_SECTION_KEYS = [
  'hero',
  'identity',
  'pedagogy',
  'subjects',
  'institutions',
  'admin',
  'impact',
  'cta',
] as const

export type TeachingSectionKey = (typeof TEACHING_SECTION_KEYS)[number]

export const TEACHING_SECTION_META: Record<TeachingSectionKey, { label: string; description: string }> = {
  hero: {
    label: 'Hero',
    description: 'Hero heading, description, quote, and top stats.',
  },
  identity: {
    label: 'Identity',
    description: 'Teaching identity copy and credentials.',
  },
  pedagogy: {
    label: 'Pedagogy',
    description: 'Pedagogical principles cards.',
  },
  subjects: {
    label: 'Subjects',
    description: 'Subject section title, filters, and subject cards.',
  },
  institutions: {
    label: 'Institutions',
    description: 'Institution timeline entries and heading.',
  },
  admin: {
    label: 'Leadership',
    description: 'Administrative role cards and heading.',
  },
  impact: {
    label: 'Impact',
    description: 'Student impact heading and stats.',
  },
  cta: {
    label: 'CTA',
    description: 'Bottom call-to-action section.',
  },
}

const normalizeHero = (value?: Partial<TeachingHero>): TeachingHero => ({
  kicker: value?.kicker || 'Teaching Portfolio',
  titleLead: value?.titleLead || '18 Years of',
  titleEmphasis: value?.titleEmphasis || 'Purposeful Teaching',
  description:
    value?.description ||
    'UGC-approved teaching across four institutions, two universities spanning foundational Computer Science to advanced AI and Machine Learning. Every classroom shaped by curiosity, rigour, and real-world relevance.',
  quote:
    value?.quote ||
    'The best engineers I have produced are not those who memorised the most they are those who learned to ask the right questions and never stopped building.',
  quoteAuthor: value?.quoteAuthor || 'Dr. Sachin B. Takmare',
  stats: Array.isArray(value?.stats)
    ? value!.stats.map((stat) => ({
        n: `${stat.n || ''}`,
        l: `${stat.l || ''}`,
        s: `${stat.s || ''}`,
      }))
    : HERO_STATS.map((stat) => ({ n: stat.n, l: stat.l, s: stat.s })),
})

const normalizeIdentity = (value?: Partial<TeachingIdentity>): TeachingIdentity => ({
  kicker: value?.kicker || 'Teaching Identity',
  titleLead: value?.titleLead || 'Professor, Researcher,',
  titleEmphasis: value?.titleEmphasis || 'Practitioner',
  paragraph1:
    value?.paragraph1 ||
    'My teaching is inseparable from my research. When I teach CNN architectures, I draw from my own Ph.D. work on crop classification. When I lecture on network security, I reference the malware evasion patent my students and I developed together. This integration theory, practice, and active research is what distinguishes my classroom.',
  paragraph2:
    value?.paragraph2 ||
    'Over 18 years across four institutions and two universities, I have taught foundational subjects like Data Structures and Computer Networks, and advanced electives including Deep Learning, Computer Vision, and Research Methodology. At every level, the goal remains the same: produce engineers who think critically and build confidently.',
  credentials: toStringArray(value?.credentials, CREDENTIALS),
})

const normalizePedagogy = (value?: Partial<TeachingPedagogyItem>[], fallback = PEDAGOGY): TeachingPedagogyItem[] => {
  if (!Array.isArray(value)) {
    return fallback.map((item) => {
      const iconKey = getIconKey(item.icon, 'target')
      return {
        iconKey,
        icon: getIcon(iconKey, Target),
        title: `${item.title || ''}`,
        desc: `${item.desc || ''}`,
      }
    })
  }

  return value.map((item) => {
    const iconKey = `${item.iconKey || ''}` || 'target'
    return {
      iconKey,
      icon: getIcon(iconKey, Target),
      title: `${item.title || ''}`,
      desc: `${item.desc || ''}`,
    }
  })
}

const normalizeSubjects = (value?: Partial<TeachingSubjectsBlock>): TeachingSubjectsBlock => {
  const items = Array.isArray(value?.items)
      ? value.items.map((item): TeachingSubjectsItem => {
        const iconKey = `${item.iconKey || ''}` || 'layers'
        return {
          iconKey,
          icon: getIcon(iconKey, Layers),
          name: `${item.name || ''}`,
          cat: (item.cat || 'Core CS') as TeachingSubjectsItem['cat'],
          color: `${item.color || '#0D1F3C'}`,
          level: Array.isArray(item.level)
            ? item.level.filter((entry): entry is 'UG' | 'PG' => entry === 'UG' || entry === 'PG')
              : ['UG'] as TeachingSubjectsItem['level'],
        }
      })
    : SUBJECTS.map((item) => {
        const iconKey = getIconKey(item.icon, 'layers')
        return {
          iconKey,
          icon: getIcon(iconKey, Layers),
          name: item.name,
          cat: item.cat,
          color: item.color,
            level: [...item.level] as TeachingSubjectsItem['level'],
        }
      })

  return {
    kicker: value?.kicker || 'Course Offerings',
    titleLead: value?.titleLead || 'Subjects I',
    titleEmphasis: value?.titleEmphasis || 'Teach & Love',
    items,
  }
}

const normalizeInstitutions = (value?: Partial<TeachingInstitutionsBlock>): TeachingInstitutionsBlock => ({
  kicker: value?.kicker || '18-Year Journey',
  titleLead: value?.titleLead || 'Experience at Every',
  titleEmphasis: value?.titleEmphasis || 'Institution',
  items: Array.isArray(value?.items)
    ? value.items.map((item, index) => ({
        id: `${item.id || `inst-${index + 1}`}`,
        period: `${item.period || ''}`,
        role: `${item.role || ''}`,
        org: `${item.org || ''}`,
        city: `${item.city || ''}`,
        univ: `${item.univ || ''}`,
        color: `${item.color || '#0D1F3C'}`,
        current: Boolean(item.current),
        roles: toStringArray(item.roles, []),
        highlight: `${item.highlight || ''}`,
        resourceLink: `${item.resourceLink || ''}`,
        documentUrl: `${item.documentUrl || ''}`,
      }))
    : INSTITUTIONS.map((item) => ({ ...item, resourceLink: '', documentUrl: '' })),
})

const normalizeAdmin = (value?: Partial<TeachingAdminBlock>): TeachingAdminBlock => ({
  kicker: value?.kicker || 'Leadership & Administration',
  titleLead: value?.titleLead || 'Academic',
  titleEmphasis: value?.titleEmphasis || 'Roles & Responsibilities',
  roles: Array.isArray(value?.roles)
    ? value.roles.map((item) => {
        const iconKey = `${item.iconKey || ''}` || 'target'
        return {
          iconKey,
          icon: getIcon(iconKey, Target),
          color: `${item.color || '#0D1F3C'}`,
          title: `${item.title || ''}`,
          desc: `${item.desc || ''}`,
          inst: `${item.inst || ''}`,
        }
      })
    : ROLES_ADMIN.map((item) => {
        const iconKey = getIconKey(item.icon, 'target')
        return {
          iconKey,
          icon: getIcon(iconKey, Target),
          color: item.color,
          title: item.title,
          desc: item.desc,
          inst: item.inst,
        }
      }),
})

const normalizeImpact = (value?: Partial<TeachingImpactBlock>): TeachingImpactBlock => ({
  kicker: value?.kicker || 'Student Impact',
  titleLead: value?.titleLead || 'Numbers That',
  titleEmphasis: value?.titleEmphasis || 'Speak',
  stats: Array.isArray(value?.stats)
    ? value.stats.map((item) => {
        const iconKey = `${item.iconKey || ''}` || 'graduation'
        return {
          iconKey,
          icon: getIcon(iconKey, GraduationCap),
          n: `${item.n || ''}`,
          l: `${item.l || ''}`,
          s: `${item.s || ''}`,
        }
      })
    : STUDENT_IMPACT_STATS.map((item) => {
        const iconKey = getIconKey(item.I, 'graduation')
        return {
          iconKey,
          icon: getIcon(iconKey, GraduationCap),
          n: item.n,
          l: item.l,
          s: item.s,
        }
      }),
})

const normalizeCta = (value?: Partial<TeachingCta>): TeachingCta => ({
  titleLead: value?.titleLead || 'Looking for a',
  titleEmphasis: value?.titleEmphasis || 'Research Guide',
  description:
    value?.description ||
    'I am open to supervising M.E. / Ph.D. research, co-authoring publications, and speaking at faculty development programmes.',
  primaryLabel: value?.primaryLabel || 'Get In Touch',
  primaryHref: value?.primaryHref || '/contact',
  secondaryLabel: value?.secondaryLabel || 'Publications',
  secondaryHref: value?.secondaryHref || '/research',
})

export const STATIC_TEACHING_CONTENT: TeachingContentRaw = {
  hero: normalizeHero(),
  identity: normalizeIdentity(),
  pedagogy: normalizePedagogy(),
  subjects: normalizeSubjects(),
  institutions: normalizeInstitutions(),
  admin: normalizeAdmin(),
  impact: normalizeImpact(),
  cta: normalizeCta(),
}

export const normalizeTeachingContent = (value?: Partial<TeachingContentRaw> | null): TeachingContentRaw => ({
  hero: normalizeHero(value?.hero),
  identity: normalizeIdentity(value?.identity),
  pedagogy: normalizePedagogy(value?.pedagogy),
  subjects: normalizeSubjects(value?.subjects),
  institutions: normalizeInstitutions(value?.institutions),
  admin: normalizeAdmin(value?.admin),
  impact: normalizeImpact(value?.impact),
  cta: normalizeCta(value?.cta),
})

export const getTeachingSnapshot = (value?: Partial<TeachingContentRaw> | null): TeachingContentRaw =>
  normalizeTeachingContent(value)

export const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  UG: { bg: 'rgba(13,31,60,0.08)', text: '#0D1F3C', border: 'rgba(13,31,60,0.18)' },
  PG: { bg: 'rgba(184,135,10,0.10)', text: '#7A5500', border: 'rgba(184,135,10,0.25)' },
}

export const SUBJECT_FILTERS: SubjectFilter[] = ['All', 'Core CS', 'AI & ML', 'Software', 'Security', 'Research']

export const getSubjectCountByCategory = (subjects: TeachingSubjectsItem[]) => {
  const counts: Record<string, number> = { All: subjects.length }
  subjects.forEach((item) => {
    counts[item.cat] = (counts[item.cat] || 0) + 1
  })
  return counts
}
