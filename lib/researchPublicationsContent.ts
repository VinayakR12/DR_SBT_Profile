import type { LucideIcon } from 'lucide-react'
import { BookOpen, Cpu, FlaskConical, Globe, Leaf, Shield } from 'lucide-react'

import { PAPERS, RESEARCH_STATS, THESIS_DETAILS, TYPES } from '@/app/Database/Researchdata'
import { HOME_CONTENT_TABLE } from '@/lib/supabase'

export const RESEARCH_PUBLICATIONS_TABLE = HOME_CONTENT_TABLE
export const RESEARCH_PUBLICATIONS_KEY = 'research_publications'

export type ResearchIconKey = 'book-open' | 'cpu' | 'flask-conical' | 'globe' | 'leaf' | 'shield'

export type ResearchPaperRaw = {
  id: number
  year: number
  month: string
  type: 'Journal' | 'Conference' | 'Review'
  title: string
  authors: string
  venue: string
  volume?: string
  issn?: string
  doi?: string
  pages?: string
  tags: string[]
  url: string
  color: string
  iconKey: ResearchIconKey
}

export type ResearchPublicationsContentRaw = {
  hero: {
    kicker: string
    titlePrefix: string
    titleEmphasis: string
    description: string
  }
  stats: {
    totalPublications: string
    journalPapers: string
    conferencePapers: string
    reviewArticles: string
  }
  filterTypes: Array<'All' | 'Journal' | 'Conference' | 'Review'>
  papers: ResearchPaperRaw[]
  thesis: {
    label: string
    title: string
    description: string
    tags: string[]
    details: Array<{ k: string; v: string }>
  }
  cta: {
    titlePrefix: string
    titleEmphasis: string
    description: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
  }
}

export type ResearchPaperHydrated = Omit<ResearchPaperRaw, 'iconKey'> & { icon: LucideIcon }

export type ResearchPublicationsContentHydrated = Omit<ResearchPublicationsContentRaw, 'papers'> & {
  papers: ResearchPaperHydrated[]
}

const ICON_MAP: Record<ResearchIconKey, LucideIcon> = {
  'book-open': BookOpen,
  cpu: Cpu,
  'flask-conical': FlaskConical,
  globe: Globe,
  leaf: Leaf,
  shield: Shield,
}

const mapIconToKey = (icon: unknown): ResearchIconKey => {
  if (icon === BookOpen) {
    return 'book-open'
  }
  if (icon === Cpu) {
    return 'cpu'
  }
  if (icon === FlaskConical) {
    return 'flask-conical'
  }
  if (icon === Globe) {
    return 'globe'
  }
  if (icon === Shield) {
    return 'shield'
  }

  return 'leaf'
}

const cloneStringArray = (value: string[] | undefined, fallback: string[]): string[] => {
  if (!Array.isArray(value)) {
    return [...fallback]
  }

  return value.map((item) => `${item}`)
}

export const RESEARCH_ICON_OPTIONS: Array<{ key: ResearchIconKey; label: string }> = [
  { key: 'leaf', label: 'Leaf' },
  { key: 'cpu', label: 'CPU' },
  { key: 'book-open', label: 'Book Open' },
  { key: 'flask-conical', label: 'Flask' },
  { key: 'globe', label: 'Globe' },
  { key: 'shield', label: 'Shield' },
]

export const RESEARCH_PUBLICATIONS_SECTION_KEYS = ['hero', 'stats', 'papers', 'thesis', 'cta'] as const
export type ResearchPublicationsSectionKey = (typeof RESEARCH_PUBLICATIONS_SECTION_KEYS)[number]

export const RESEARCH_PUBLICATIONS_SECTION_META: Record<
  ResearchPublicationsSectionKey,
  { label: string; description: string }
> = {
  hero: { label: 'Hero', description: 'Page heading and lead description.' },
  stats: { label: 'Stats', description: 'Publication KPIs in the hero bar.' },
  papers: { label: 'Papers', description: 'Filterable publication list and metadata.' },
  thesis: { label: 'Thesis', description: 'PhD thesis highlight section and detail rows.' },
  cta: { label: 'CTA', description: 'Bottom call-to-action links and copy.' },
}

export const STATIC_RESEARCH_PUBLICATIONS_CONTENT: ResearchPublicationsContentRaw = {
  hero: {
    kicker: 'Research & Publications',
    titlePrefix: 'Academic Research &',
    titleEmphasis: 'Published Work',
    description:
      'Over 18 years of research spanning Artificial Intelligence, Machine Learning, Precision Agriculture, Computer Vision, and Software Engineering. Published in IEEE, Scopus-indexed, and UGC-approved journals worldwide.',
  },
  stats: {
    totalPublications: `${RESEARCH_STATS.totalPublications}`,
    journalPapers: `${RESEARCH_STATS.journalPapers}`,
    conferencePapers: `${RESEARCH_STATS.conferencePapers}`,
    reviewArticles: `${RESEARCH_STATS.reviewArticles}`,
  },
  filterTypes: [...TYPES],
  papers: PAPERS.map((paper) => ({
    id: paper.id,
    year: paper.year,
    month: paper.month || '',
    type: paper.type,
    title: paper.title,
    authors: paper.authors,
    venue: paper.venue,
    volume: paper.volume || '',
    issn: paper.issn || '',
    doi: paper.doi || '',
    pages: paper.pages || '',
    tags: [...paper.tags],
    url: paper.url,
    color: paper.color,
    iconKey: mapIconToKey(paper.icon),
  })),
  thesis: {
    label: 'Ph.D. Thesis — Awarded 2024',
    title: THESIS_DETAILS.title,
    description: THESIS_DETAILS.description,
    tags: [...THESIS_DETAILS.tags],
    details: THESIS_DETAILS.details.map((item) => ({ ...item })),
  },
  cta: {
    titlePrefix: 'Interested in',
    titleEmphasis: 'Collaboration',
    description:
      'For research collaborations, paper citations, co-authorship opportunities, or academic partnerships — reach out directly.',
    primaryLabel: 'Collaborate on Research',
    primaryHref: '/contact',
    secondaryLabel: 'View Patents',
    secondaryHref: '/patents',
  },
}

export const normalizeResearchPublicationsContent = (
  value?: Partial<ResearchPublicationsContentRaw> | null,
): ResearchPublicationsContentRaw => ({
  hero: {
    ...STATIC_RESEARCH_PUBLICATIONS_CONTENT.hero,
    ...(value?.hero || {}),
  },
  stats: {
    ...STATIC_RESEARCH_PUBLICATIONS_CONTENT.stats,
    ...(value?.stats || {}),
  },
  filterTypes: Array.isArray(value?.filterTypes) && value?.filterTypes.length
    ? (value.filterTypes as Array<'All' | 'Journal' | 'Conference' | 'Review'>)
    : [...STATIC_RESEARCH_PUBLICATIONS_CONTENT.filterTypes],
  papers: Array.isArray(value?.papers)
    ? value.papers.map((paper, index) => ({
        id: Number.isFinite(Number(paper.id)) ? Number(paper.id) : index + 1,
        year: Number.isFinite(Number(paper.year)) ? Number(paper.year) : new Date().getFullYear(),
        month: paper.month || '',
        type: paper.type || 'Journal',
        title: paper.title || '',
        authors: paper.authors || '',
        venue: paper.venue || '',
        volume: paper.volume || '',
        issn: paper.issn || '',
        doi: paper.doi || '',
        pages: paper.pages || '',
        tags: cloneStringArray(paper.tags, []),
        url: paper.url || '',
        color: paper.color || '#0D1F3C',
        iconKey: paper.iconKey || 'leaf',
      }))
    : STATIC_RESEARCH_PUBLICATIONS_CONTENT.papers.map((paper) => ({ ...paper, tags: [...paper.tags] })),
  thesis: {
    ...STATIC_RESEARCH_PUBLICATIONS_CONTENT.thesis,
    ...(value?.thesis || {}),
    tags: cloneStringArray(value?.thesis?.tags, STATIC_RESEARCH_PUBLICATIONS_CONTENT.thesis.tags),
    details: Array.isArray(value?.thesis?.details)
      ? value.thesis.details.map((detail) => ({ k: detail.k || '', v: detail.v || '' }))
      : STATIC_RESEARCH_PUBLICATIONS_CONTENT.thesis.details.map((detail) => ({ ...detail })),
  },
  cta: {
    ...STATIC_RESEARCH_PUBLICATIONS_CONTENT.cta,
    ...(value?.cta || {}),
  },
})

export const hydrateResearchPublicationsContent = (
  value?: Partial<ResearchPublicationsContentRaw> | null,
): ResearchPublicationsContentHydrated => {
  const raw = normalizeResearchPublicationsContent(value)

  return {
    ...raw,
    papers: raw.papers.map((paper) => ({
      ...paper,
      icon: ICON_MAP[paper.iconKey] || Leaf,
    })),
  }
}

export const getResearchPublicationsSnapshot = (
  value?: Partial<ResearchPublicationsContentRaw> | null,
): ResearchPublicationsContentRaw => normalizeResearchPublicationsContent(value)

export const createDefaultResearchPaper = (): ResearchPaperRaw => ({
  id: Date.now(),
  year: new Date().getFullYear(),
  month: '',
  type: 'Journal',
  title: 'New publication title',
  authors: 'Author 1, Author 2',
  venue: 'Journal or Conference name',
  volume: '',
  issn: '',
  doi: '',
  pages: '',
  tags: ['AI'],
  url: 'https://example.com',
  color: '#0D1F3C',
  iconKey: 'leaf',
})

export const createDefaultThesisDetail = (): { k: string; v: string } => ({
  k: 'Key',
  v: 'Value',
})
