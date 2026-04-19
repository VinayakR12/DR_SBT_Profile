import type { LucideIcon } from 'lucide-react'
import { Award, BookOpen, Brain, FileText, GraduationCap, Leaf, Microscope, School, Shield, Users } from 'lucide-react'

import {
  ABOUT,
  CTA,
  CREDENTIALS,
  EXPERTISE,
  HERO,
  ID_CARD,
  IP_ITEMS,
  PHD,
  PUBLICATIONS,
  STATS,
  TEACHING,
} from "../app/Database/Homedata"

export type HomeIconKey =
  | 'brain'
  | 'leaf'
  | 'microscope'
  | 'school'
  | 'book-open'
  | 'file-text'
  | 'users'
  | 'graduation-cap'
  | 'shield'
  | 'award'

export type HomeBadge = { label: string; color: string }
export type HomeStat = { n: string; l: string; s: string }
export type HomeDetail = { k: string; v: string }
export type HomeExpertiseItem = {
  label: string
  color: string
  bg: string
  border: string
  sub: string
  iconKey: HomeIconKey
}
export type HomeTeachingStat = { iconKey: HomeIconKey; v: string; l: string }
export type HomeIpItem = {
  iconKey: HomeIconKey
  iconColor: string
  tag: string
  title: string
  detail: string
  href: string
}

export type HomeContentRaw = {
  hero: typeof HERO
  idCard: {
    name: string
    initials: string
    degree: string
    field: string
    thesis: string
    tagline: string
    imageUrl?: string
    skills: string[]
    badges: HomeBadge[]
  }
  stats: HomeStat[]
  phd: {
    label: string
    degree: string
    awardedYear: string
    institution: string
    thesis: string
    description: string
    tags: string[]
    details: HomeDetail[]
    cta: string
  }
  about: typeof ABOUT
  credentials: typeof CREDENTIALS
  expertise: HomeExpertiseItem[]
  publications: typeof PUBLICATIONS
  ipItems: HomeIpItem[]
  teaching: {
    quote: string
    body: string
    subjects: string[]
    cta: string
    stats: HomeTeachingStat[]
  }
  cta: typeof CTA
}

export type HomeContentHydrated = {
  hero: HomeContentRaw['hero']
  idCard: HomeContentRaw['idCard']
  stats: HomeStat[]
  phd: HomeContentRaw['phd']
  about: HomeContentRaw['about']
  credentials: HomeContentRaw['credentials']
  expertise: Array<Omit<HomeExpertiseItem, 'iconKey'> & { icon: LucideIcon }>
  publications: HomeContentRaw['publications']
  ipItems: HomeIpItem[]
  teaching: {
    quote: string
    body: string
    subjects: string[]
    cta: string
    stats: Array<Omit<HomeTeachingStat, 'iconKey'> & { icon: LucideIcon }>
  }
  cta: HomeContentRaw['cta']
}

const ICON_MAP: Record<HomeIconKey, LucideIcon> = {
  brain: Brain,
  leaf: Leaf,
  microscope: Microscope,
  school: School,
  'book-open': BookOpen,
  'file-text': FileText,
  users: Users,
  'graduation-cap': GraduationCap,
  shield: Shield,
  award: Award,
}

export const HOME_ICON_OPTIONS: Array<{ key: HomeIconKey; label: string }> = [
  { key: 'brain', label: 'Brain' },
  { key: 'leaf', label: 'Leaf' },
  { key: 'microscope', label: 'Microscope' },
  { key: 'school', label: 'School' },
  { key: 'book-open', label: 'Book Open' },
  { key: 'file-text', label: 'File Text' },
  { key: 'users', label: 'Users' },
  { key: 'graduation-cap', label: 'Graduation Cap' },
  { key: 'shield', label: 'Shield' },
  { key: 'award', label: 'Award' },
]

const EXPERTISE_ICON_KEYS: HomeIconKey[] = ['brain', 'leaf', 'microscope', 'book-open', 'file-text', 'school']
const TEACHING_ICON_KEYS: HomeIconKey[] = ['users', 'graduation-cap', 'book-open', 'file-text']

export const HOME_SECTION_KEYS = [
  'hero',
  'idCard',
  'stats',
  'phd',
  'about',
  'credentials',
  'expertise',
  'publications',
  'ipItems',
  'teaching',
  'cta',
] as const

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number]

export const HOME_SECTION_META: Record<HomeSectionKey, { label: string; description: string }> = {
  hero: { label: 'Hero', description: 'Top banner, call-to-action and first impression copy.' },
  idCard: { label: 'ID Card', description: 'Profile card, skills and recognition badges.' },
  stats: { label: 'Stats', description: 'KPI strip shown below the hero.' },
  phd: { label: 'PhD', description: 'Doctoral achievement block and supporting details.' },
  about: { label: 'About', description: 'Biography and long-form introduction.' },
  credentials: { label: 'Credentials', description: 'Academic milestones and recognition bullets.' },
  expertise: { label: 'Expertise', description: 'Subject-area cards with icons and descriptions.' },
  publications: { label: 'Publications', description: 'Selected publication list and metadata.' },
  ipItems: { label: 'IP Items', description: 'Patents and copyright entries.' },
  teaching: { label: 'Teaching', description: 'Teaching philosophy, subjects and metrics.' },
  cta: { label: 'CTA', description: 'Final collaboration block and contact links.' },
}

const baseExpertise = EXPERTISE.map((item, index) => ({
  label: item.label,
  color: item.color,
  bg: item.bg,
  border: item.border,
  sub: item.sub,
  iconKey: EXPERTISE_ICON_KEYS[index] || 'brain',
})) satisfies HomeExpertiseItem[]

const baseTeachingStats = TEACHING.stats.map((item, index) => ({
  v: item.v,
  l: item.l,
  iconKey: TEACHING_ICON_KEYS[index] || 'users',
})) satisfies HomeTeachingStat[]

const copyStrings = (value: string[] | undefined, fallback: string[]): string[] => {
  if (!Array.isArray(value)) {
    return [...fallback]
  }

  return value.map((item) => `${item}`)
}

const copyObjects = <T extends Record<string, unknown>>(value: T[] | undefined, fallback: T[]): T[] => {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }))
  }

  return value.map((item) => ({ ...item }))
}

const copyExpertise = (value: HomeExpertiseItem[] | undefined): HomeExpertiseItem[] => {
  if (!Array.isArray(value)) {
    return baseExpertise.map((item) => ({ ...item }))
  }

  return value.map((item, index) => ({
    label: item.label,
    color: item.color,
    bg: item.bg,
    border: item.border,
    sub: item.sub,
    iconKey: item.iconKey || EXPERTISE_ICON_KEYS[index] || 'brain',
  }))
}

const copyTeachingStats = (value: HomeTeachingStat[] | undefined): HomeTeachingStat[] => {
  if (!Array.isArray(value)) {
    return baseTeachingStats.map((item) => ({ ...item }))
  }

  return value.map((item, index) => ({
    v: item.v,
    l: item.l,
    iconKey: item.iconKey || TEACHING_ICON_KEYS[index] || 'users',
  }))
}

export const STATIC_HOME_CONTENT: HomeContentRaw = {
  hero: HERO,
  idCard: {
    name: ID_CARD.name,
    initials: ID_CARD.initials,
    degree: ID_CARD.degree,
    field: ID_CARD.field,
    thesis: ID_CARD.thesis,
    tagline: ID_CARD.tagline,
    imageUrl: '',
    skills: [...ID_CARD.skills],
    badges: ID_CARD.badges.map((badge) => ({ ...badge })),
  },
  stats: STATS.map((stat) => ({ ...stat })),
  phd: {
    label: PHD.label,
    degree: PHD.degree,
    awardedYear: PHD.awardedYear,
    institution: PHD.institution,
    thesis: PHD.thesis,
    description: PHD.description,
    tags: [...PHD.tags],
    details: PHD.details.map((detail) => ({ ...detail })),
    cta: PHD.cta,
  },
  about: ABOUT,
  credentials: CREDENTIALS.map((item) => ({ ...item })),
  expertise: baseExpertise,
  publications: PUBLICATIONS.map((item) => ({ ...item })),
  ipItems: IP_ITEMS.map((item) => ({ ...item })),
  teaching: {
    quote: TEACHING.quote,
    body: TEACHING.body,
    subjects: [...TEACHING.subjects],
    cta: TEACHING.cta,
    stats: baseTeachingStats,
  },
  cta: CTA,
}

export const normalizeHomeContent = (value?: Partial<HomeContentRaw> | null): HomeContentRaw => ({
  hero: { ...STATIC_HOME_CONTENT.hero, ...(value?.hero || {}) },
  idCard: {
    ...STATIC_HOME_CONTENT.idCard,
    ...(value?.idCard || {}),
    imageUrl: value?.idCard?.imageUrl || STATIC_HOME_CONTENT.idCard.imageUrl || '',
    skills: copyStrings(value?.idCard?.skills, STATIC_HOME_CONTENT.idCard.skills),
    badges: copyObjects(value?.idCard?.badges, STATIC_HOME_CONTENT.idCard.badges),
  },
  stats: copyObjects(value?.stats, STATIC_HOME_CONTENT.stats),
  phd: {
    ...STATIC_HOME_CONTENT.phd,
    ...(value?.phd || {}),
    tags: copyStrings(value?.phd?.tags, STATIC_HOME_CONTENT.phd.tags),
    details: copyObjects(value?.phd?.details, STATIC_HOME_CONTENT.phd.details),
  },
  about: { ...STATIC_HOME_CONTENT.about, ...(value?.about || {}) },
  credentials: copyObjects(value?.credentials, STATIC_HOME_CONTENT.credentials),
  expertise: copyExpertise(value?.expertise),
  publications: copyObjects(value?.publications, STATIC_HOME_CONTENT.publications),
  ipItems: copyObjects(value?.ipItems, STATIC_HOME_CONTENT.ipItems),
  teaching: {
    quote: value?.teaching?.quote || STATIC_HOME_CONTENT.teaching.quote,
    body: value?.teaching?.body || STATIC_HOME_CONTENT.teaching.body,
    subjects: copyStrings(value?.teaching?.subjects, STATIC_HOME_CONTENT.teaching.subjects),
    cta: value?.teaching?.cta || STATIC_HOME_CONTENT.teaching.cta,
    stats: copyTeachingStats(value?.teaching?.stats),
  },
  cta: {
    ...STATIC_HOME_CONTENT.cta,
    ...(value?.cta || {}),
    btnPrimary: {
      ...STATIC_HOME_CONTENT.cta.btnPrimary,
      ...(value?.cta?.btnPrimary || {}),
    },
    btnSecondary: {
      ...STATIC_HOME_CONTENT.cta.btnSecondary,
      ...(value?.cta?.btnSecondary || {}),
    },
  },
})

export const hydrateHomeContent = (value?: Partial<HomeContentRaw> | null): HomeContentHydrated => {
  const raw = normalizeHomeContent(value)

  return {
    hero: raw.hero,
    idCard: raw.idCard,
    stats: raw.stats,
    phd: raw.phd,
    about: raw.about,
    credentials: raw.credentials,
    expertise: raw.expertise.map((item) => ({
      label: item.label,
      color: item.color,
      bg: item.bg,
      border: item.border,
      sub: item.sub,
      icon: ICON_MAP[item.iconKey] || Brain,
    })),
    publications: raw.publications,
    ipItems: raw.ipItems,
    teaching: {
      quote: raw.teaching.quote,
      body: raw.teaching.body,
      subjects: raw.teaching.subjects,
      cta: raw.teaching.cta,
      stats: raw.teaching.stats.map((item) => ({
        v: item.v,
        l: item.l,
        icon: ICON_MAP[item.iconKey] || Users,
      })),
    },
    cta: raw.cta,
  }
}

export const createDefaultExpertiseItem = (): HomeExpertiseItem => ({
  label: 'New Expertise',
  color: '#0D1F3C',
  bg: 'rgba(13,31,60,0.07)',
  border: 'rgba(13,31,60,0.16)',
  sub: 'Short description',
  iconKey: 'brain',
})

export const createDefaultTeachingStat = (): HomeTeachingStat => ({
  iconKey: 'users',
  v: '0',
  l: 'Metric label',
})

export const createDefaultStat = (): HomeStat => ({ n: '0', l: 'Metric', s: 'Description' })

export const createDefaultCredential = (): HomeContentRaw['credentials'][number] => ({
  t: 'New Credential',
  d: 'Describe the credential here.',
})

export const createDefaultPublication = (): HomeContentRaw['publications'][number] => ({
  tag: '2026',
  color: '#0D1F3C',
  title: 'New Publication',
  info: 'Publication details',
})

export const createDefaultIpItem = (): HomeContentRaw['ipItems'][number] => ({
  iconKey: 'shield',
  iconColor: '#B8870A',
  tag: 'Patent · 2026',
  title: 'New IP Item',
  detail: 'IP details',
  href: '/research/patents',
})

export const getHomeContentSnapshot = (value?: Partial<HomeContentRaw> | null): HomeContentRaw => normalizeHomeContent(value)