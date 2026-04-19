import type { LucideIcon } from 'lucide-react'
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  FlaskConical,
  Globe,
  GraduationCap,
  Layers,
  School,
  Shield,
  Target,
  Trophy,
} from 'lucide-react'

import { AWARDS, FEATURED_DETAILS, QUOTE } from '@/app/Database/Awarddata'
import { HOME_CONTENT_TABLE } from '@/lib/supabase'

export const ACHIEVEMENTS_AWARDS_TABLE = HOME_CONTENT_TABLE
export const ACHIEVEMENTS_AWARDS_KEY = 'achievements_awards'

export type AwardCategory =
  | 'Academic'
  | 'Research'
  | 'Institutional'
  | 'Intellectual Property'
  | 'Professional'

export type AwardIconKey =
  | 'award'
  | 'book-open'
  | 'briefcase'
  | 'building-2'
  | 'flask-conical'
  | 'globe'
  | 'graduation-cap'
  | 'layers'
  | 'school'
  | 'shield'
  | 'target'
  | 'trophy'

export type AwardItemRaw = {
  id: string
  category: AwardCategory
  year: string
  title: string
  body: string
  description: string
  iconKey: AwardIconKey
  color: string
  featured?: boolean
  tags: string[]
  assetUrl?: string
  socialLink?: string
}

export type AwardsContentRaw = {
  quote: {
    text: string
    author: string
  }
  featured: {
    details: Array<{ k: string; v: string }>
    tags: string[]
  }
  awards: AwardItemRaw[]
}

export type AwardItemHydrated = Omit<AwardItemRaw, 'iconKey'> & { icon: LucideIcon }

export const CATEGORY_COLORS: Record<
  AwardCategory,
  { bg: string; border: string; text: string; dot: string }
> = {
  Academic: {
    bg: 'rgba(13,31,60,0.08)',
    border: 'rgba(13,31,60,0.18)',
    text: '#0D1F3C',
    dot: '#0D1F3C',
  },
  Research: {
    bg: 'rgba(26,107,72,0.08)',
    border: 'rgba(26,107,72,0.22)',
    text: '#1A5038',
    dot: '#1A6B48',
  },
  Institutional: {
    bg: 'rgba(122,85,0,0.08)',
    border: 'rgba(122,85,0,0.20)',
    text: '#7A5500',
    dot: '#B8870A',
  },
  'Intellectual Property': {
    bg: 'rgba(184,135,10,0.09)',
    border: 'rgba(184,135,10,0.24)',
    text: '#7A5500',
    dot: '#B8870A',
  },
  Professional: {
    bg: 'rgba(45,91,138,0.08)',
    border: 'rgba(45,91,138,0.20)',
    text: '#1A3560',
    dot: '#2D5B8A',
  },
}

const ICON_MAP: Record<AwardIconKey, LucideIcon> = {
  award: Award,
  'book-open': BookOpen,
  briefcase: Briefcase,
  'building-2': Building2,
  'flask-conical': FlaskConical,
  globe: Globe,
  'graduation-cap': GraduationCap,
  layers: Layers,
  school: School,
  shield: Shield,
  target: Target,
  trophy: Trophy,
}

export const AWARD_ICON_OPTIONS: Array<{ key: AwardIconKey; label: string }> = [
  { key: 'award', label: 'Award' },
  { key: 'book-open', label: 'Book Open' },
  { key: 'briefcase', label: 'Briefcase' },
  { key: 'building-2', label: 'Building 2' },
  { key: 'flask-conical', label: 'Flask' },
  { key: 'globe', label: 'Globe' },
  { key: 'graduation-cap', label: 'Graduation Cap' },
  { key: 'layers', label: 'Layers' },
  { key: 'school', label: 'School' },
  { key: 'shield', label: 'Shield' },
  { key: 'target', label: 'Target' },
  { key: 'trophy', label: 'Trophy' },
]

export const AWARD_CATEGORIES: AwardCategory[] = [
  'Academic',
  'Intellectual Property',
  'Institutional',
  'Professional',
  'Research',
]

const mapIconToKey = (icon: unknown): AwardIconKey => {
  if (icon === Award) return 'award'
  if (icon === BookOpen) return 'book-open'
  if (icon === Briefcase) return 'briefcase'
  if (icon === Building2) return 'building-2'
  if (icon === FlaskConical) return 'flask-conical'
  if (icon === Globe) return 'globe'
  if (icon === GraduationCap) return 'graduation-cap'
  if (icon === Layers) return 'layers'
  if (icon === School) return 'school'
  if (icon === Shield) return 'shield'
  if (icon === Target) return 'target'
  if (icon === Trophy) return 'trophy'
  return 'award'
}

const toStringArray = (value: unknown, fallback: string[] = []): string[] => {
  if (!Array.isArray(value)) {
    return [...fallback]
  }

  return value.map((item) => `${item}`)
}

const toDetailRows = (
  value: unknown,
  fallback: Array<{ k: string; v: string }> = [],
): Array<{ k: string; v: string }> => {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }))
  }

  return value.map((item, index) => {
    const row = item && typeof item === 'object' ? (item as { k?: unknown; v?: unknown }) : {}
    return {
      k: typeof row.k === 'string' ? row.k : `Detail ${index + 1}`,
      v: typeof row.v === 'string' ? row.v : '',
    }
  })
}

const normalizeCategory = (value: unknown): AwardCategory => {
  if (
    value === 'Academic' ||
    value === 'Research' ||
    value === 'Institutional' ||
    value === 'Intellectual Property' ||
    value === 'Professional'
  ) {
    return value
  }

  return 'Academic'
}

const normalizeItem = (item: Partial<AwardItemRaw> | undefined, index: number): AwardItemRaw => ({
  id: item?.id || `award-${index + 1}`,
  category: normalizeCategory(item?.category),
  year: item?.year || '',
  title: item?.title || '',
  body: item?.body || '',
  description: item?.description || '',
  iconKey: item?.iconKey || 'award',
  color: item?.color || '#0D1F3C',
  featured: Boolean(item?.featured),
  tags: toStringArray(item?.tags, []),
  assetUrl: item?.assetUrl || '',
  socialLink: item?.socialLink || '',
})

export const STATIC_ACHIEVEMENTS_AWARDS_CONTENT: AwardsContentRaw = {
  quote: {
    text: QUOTE.text,
    author: QUOTE.author,
  },
  featured: {
    details: FEATURED_DETAILS.map((item) => ({ ...item })),
    tags: ['Research', 'AI / ML', 'Deep Learning', 'Computer Vision', 'Agriculture'],
  },
  awards: AWARDS.map((item) => ({
    id: item.id,
    category: item.category,
    year: item.year,
    title: item.title,
    body: item.body,
    description: item.description,
    iconKey: mapIconToKey(item.icon),
    color: item.color,
    featured: Boolean(item.featured),
    tags: [...item.tags],
    assetUrl: '',
    socialLink: '',
  })),
}

export const normalizeAchievementsAwardsContent = (
  value?: Partial<AwardsContentRaw> | null,
): AwardsContentRaw => ({
  quote: {
    text: value?.quote?.text || STATIC_ACHIEVEMENTS_AWARDS_CONTENT.quote.text,
    author: value?.quote?.author || STATIC_ACHIEVEMENTS_AWARDS_CONTENT.quote.author,
  },
  featured: {
    details: toDetailRows(value?.featured?.details, STATIC_ACHIEVEMENTS_AWARDS_CONTENT.featured.details),
    tags: toStringArray(value?.featured?.tags, STATIC_ACHIEVEMENTS_AWARDS_CONTENT.featured.tags),
  },
  awards: Array.isArray(value?.awards)
    ? value.awards.map((item, index) => normalizeItem(item, index))
    : STATIC_ACHIEVEMENTS_AWARDS_CONTENT.awards.map((item, index) => normalizeItem(item, index)),
})

export const hydrateAchievementsAwardsContent = (
  value?: Partial<AwardsContentRaw> | null,
): { awards: AwardItemHydrated[] } => {
  const raw = normalizeAchievementsAwardsContent(value)

  return {
    awards: raw.awards.map((item) => ({
      ...item,
      icon: ICON_MAP[item.iconKey] || Award,
    })),
  }
}

export const createDefaultAward = (): AwardItemRaw => ({
  id: `award-${Date.now()}`,
  category: 'Academic',
  year: `${new Date().getFullYear()}`,
  title: 'New award title',
  body: 'Issuing body',
  description: 'Award description',
  iconKey: 'award',
  color: '#0D1F3C',
  featured: false,
  tags: ['Recognition'],
  assetUrl: '',
  socialLink: '',
})

export const ACHIEVEMENTS_AWARDS_SECTION_KEYS = ['quote', 'featured', 'awards'] as const
export type AchievementsAwardsSectionKey = (typeof ACHIEVEMENTS_AWARDS_SECTION_KEYS)[number]

export const ACHIEVEMENTS_AWARDS_SECTION_META: Record<
  AchievementsAwardsSectionKey,
  { label: string; description: string }
> = {
  quote: {
    label: 'Quote',
    description: 'Hero quote text and author shown on the awards page.',
  },
  featured: {
    label: 'Featured Details',
    description: 'Featured award details table and supporting tags.',
  },
  awards: {
    label: 'Awards',
    description: 'Awards list, asset upload and optional social links.',
  },
}

export const getAchievementsAwardsSnapshot = (
  value?: Partial<AwardsContentRaw> | null,
): AwardsContentRaw => normalizeAchievementsAwardsContent(value)
