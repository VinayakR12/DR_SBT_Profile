import { COPYRIGHTS, PATENTS, PATENT_STATS } from '@/app/Database/Patentdata'
import { HOME_CONTENT_TABLE } from '@/lib/supabase'

export const RESEARCH_PATENTS_TABLE = HOME_CONTENT_TABLE
export const RESEARCH_PATENTS_KEY = 'research_patents'

export type PatentType = 'Utility' | 'Design' | 'Provisional'
export type PatentStatus = 'Published' | 'Granted' | 'Pending'

export type PatentItemRaw = {
  id: number
  type: PatentType
  title: string
  description: string
  applicationNo: string
  referenceNo?: string
  docketNo?: string
  crcNo?: string
  filingDate: string
  publicationDate?: string
  status: PatentStatus
  tags: string[]
  assetUrl?: string
  socialLink?: string
  imageUrl?: string
  documentUrl?: string
}

export type CopyrightItemRaw = {
  id: number
  title: string
  category: string
  diaryNo: string
  date: string
  published: boolean
  description?: string
  assetUrl?: string
  socialLink?: string
  imageUrl?: string
  documentUrl?: string
}

export type ResearchPatentsContentRaw = {
  hero: {
    kicker: string
    titlePrefix: string
    titleEmphasis: string
    description: string
  }
  stats: {
    totalPatents: string
    totalCopyrights: string
    publishedPatents: string
  }
  patentsSection: {
    kicker: string
    titlePrefix: string
    titleEmphasis: string
    description: string
  }
  patents: PatentItemRaw[]
  copyrightsSection: {
    kicker: string
    titlePrefix: string
    titleEmphasis: string
    description: string
  }
  copyrights: CopyrightItemRaw[]
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

export const RESEARCH_PATENT_SECTION_KEYS = [
  'hero',
  'stats',
  'patentsSection',
  'patents',
  'copyrightsSection',
  'copyrights',
  'cta',
] as const

export type ResearchPatentSectionKey = (typeof RESEARCH_PATENT_SECTION_KEYS)[number]

export const RESEARCH_PATENT_SECTION_META: Record<ResearchPatentSectionKey, { label: string; description: string }> = {
  hero: { label: 'Hero', description: 'Page heading and intro summary.' },
  stats: { label: 'Stats', description: 'Hero KPI counters.' },
  patentsSection: { label: 'Patents Heading', description: 'Heading shown before the patents list.' },
  patents: { label: 'Patents', description: 'Patent cards and metadata rows.' },
  copyrightsSection: { label: 'Copyright Heading', description: 'Heading shown before copyrights list.' },
  copyrights: { label: 'Copyrights', description: 'Copyright cards and metadata rows.' },
  cta: { label: 'CTA', description: 'Bottom call-to-action links and copy.' },
}

const toStringArray = (value: unknown, fallback: string[] = []): string[] => {
  if (!Array.isArray(value)) {
    return [...fallback]
  }

  return value.map((item) => `${item}`)
}

const normalizePatentStatus = (value: unknown): PatentStatus => {
  if (value === 'Published' || value === 'Granted' || value === 'Pending') {
    return value
  }

  return 'Pending'
}

const normalizePatentType = (value: unknown): PatentType => {
  if (value === 'Utility' || value === 'Design' || value === 'Provisional') {
    return value
  }

  return 'Utility'
}

const normalizePatentItem = (value: Partial<PatentItemRaw> | undefined, index: number): PatentItemRaw => ({
  id: Number.isFinite(Number(value?.id)) ? Number(value?.id) : index + 1,
  type: normalizePatentType(value?.type),
  title: value?.title || '',
  description: value?.description || '',
  applicationNo: value?.applicationNo || '',
  referenceNo: value?.referenceNo || '',
  docketNo: value?.docketNo || '',
  crcNo: value?.crcNo || '',
  filingDate: value?.filingDate || '',
  publicationDate: value?.publicationDate || '',
  status: normalizePatentStatus(value?.status),
  tags: toStringArray(value?.tags, []),
  assetUrl: value?.assetUrl || value?.documentUrl || value?.imageUrl || '',
  socialLink: value?.socialLink || '',
  imageUrl: value?.imageUrl || '',
  documentUrl: value?.documentUrl || '',
})

const normalizeCopyrightItem = (value: Partial<CopyrightItemRaw> | undefined, index: number): CopyrightItemRaw => ({
  id: Number.isFinite(Number(value?.id)) ? Number(value?.id) : index + 1,
  title: value?.title || '',
  category: value?.category || '',
  diaryNo: value?.diaryNo || '',
  date: value?.date || '',
  published: Boolean(value?.published),
  description: value?.description || '',
  assetUrl: value?.assetUrl || value?.documentUrl || value?.imageUrl || '',
  socialLink: value?.socialLink || '',
  imageUrl: value?.imageUrl || '',
  documentUrl: value?.documentUrl || '',
})

export const STATIC_RESEARCH_PATENTS_CONTENT: ResearchPatentsContentRaw = {
  hero: {
    kicker: 'Intellectual Property',
    titlePrefix: 'Patents &',
    titleEmphasis: 'Registered IP',
    description:
      'Filed utility patents and registered software copyrights resulting from original research in AI, Precision Agriculture, and Cybersecurity.',
  },
  stats: {
    totalPatents: `${PATENT_STATS.totalPatents}`,
    totalCopyrights: `${PATENT_STATS.totalCopyrights}`,
    publishedPatents: `${PATENT_STATS.publishedPatents}`,
  },
  patentsSection: {
    kicker: 'Utility Patents',
    titlePrefix: 'Filed &',
    titleEmphasis: 'Published Patents',
    description: '',
  },
  patents: PATENTS.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    applicationNo: item.applicationNo,
    referenceNo: item.referenceNo || '',
    docketNo: item.docketNo || '',
    crcNo: item.crcNo || '',
    filingDate: item.filingDate,
    publicationDate: item.publicationDate || '',
    status: item.status,
    tags: [...item.tags],
    assetUrl: item.file || '',
    socialLink: '',
    imageUrl: '',
    documentUrl: item.file || '',
  })),
  copyrightsSection: {
    kicker: 'Software Copyrights',
    titlePrefix: 'Registered',
    titleEmphasis: 'Copyrights',
    description:
      'Software copyrights registered with the Copyright Office, Government of India, for original AI and VR software systems.',
  },
  copyrights: COPYRIGHTS.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    diaryNo: item.diaryNo,
    date: item.date,
    published: item.published,
    description: item.description || '',
    assetUrl: item.file || '',
    socialLink: '',
    imageUrl: '',
    documentUrl: item.file || '',
  })),
  cta: {
    titlePrefix: 'Explore',
    titleEmphasis: 'Research Papers',
    description: 'View research publications, patents, and academic credentials from one place.',
    primaryLabel: 'Research Papers',
    primaryHref: '/research/publications',
    secondaryLabel: 'Certificates',
    secondaryHref: '/achievements/certificates',
  },
}

export const normalizeResearchPatentsContent = (
  value?: Partial<ResearchPatentsContentRaw> | null,
): ResearchPatentsContentRaw => ({
  hero: {
    ...STATIC_RESEARCH_PATENTS_CONTENT.hero,
    ...(value?.hero || {}),
  },
  stats: {
    ...STATIC_RESEARCH_PATENTS_CONTENT.stats,
    ...(value?.stats || {}),
  },
  patentsSection: {
    ...STATIC_RESEARCH_PATENTS_CONTENT.patentsSection,
    ...(value?.patentsSection || {}),
  },
  patents: Array.isArray(value?.patents)
    ? value.patents.map((item, index) => normalizePatentItem({ ...item, documentUrl: item.documentUrl || (item as { file?: string }).file || '' }, index))
    : STATIC_RESEARCH_PATENTS_CONTENT.patents.map((item, index) => normalizePatentItem(item, index)),
  copyrightsSection: {
    ...STATIC_RESEARCH_PATENTS_CONTENT.copyrightsSection,
    ...(value?.copyrightsSection || {}),
  },
  copyrights: Array.isArray(value?.copyrights)
    ? value.copyrights.map((item, index) => normalizeCopyrightItem({ ...item, documentUrl: item.documentUrl || (item as { file?: string }).file || '' }, index))
    : STATIC_RESEARCH_PATENTS_CONTENT.copyrights.map((item, index) => normalizeCopyrightItem(item, index)),
  cta: {
    ...STATIC_RESEARCH_PATENTS_CONTENT.cta,
    ...(value?.cta || {}),
  },
})

export const getResearchPatentsSnapshot = (
  value?: Partial<ResearchPatentsContentRaw> | null,
): ResearchPatentsContentRaw => normalizeResearchPatentsContent(value)

export const createDefaultPatent = (): PatentItemRaw => ({
  id: Date.now(),
  type: 'Utility',
  title: 'New patent title',
  description: 'Patent description',
  applicationNo: '',
  referenceNo: '',
  docketNo: '',
  crcNo: '',
  filingDate: '',
  publicationDate: '',
  status: 'Pending',
  tags: ['AI'],
  assetUrl: '',
  socialLink: '',
  imageUrl: '',
  documentUrl: '',
})

export const createDefaultCopyright = (): CopyrightItemRaw => ({
  id: Date.now(),
  title: 'New copyright title',
  category: 'Computer Software',
  diaryNo: '',
  date: '',
  published: false,
  description: '',
  assetUrl: '',
  socialLink: '',
  imageUrl: '',
  documentUrl: '',
})

export const PATENT_STATUS_STYLES: Record<PatentStatus, { bg: string; border: string; text: string; dot: string }> = {
  Published: {
    bg: 'rgba(26,107,72,0.08)',
    border: 'rgba(26,107,72,0.22)',
    text: '#1A6B48',
    dot: '#1A6B48',
  },
  Granted: {
    bg: 'rgba(184,135,10,0.10)',
    border: 'rgba(184,135,10,0.26)',
    text: '#7A5500',
    dot: '#B8870A',
  },
  Pending: {
    bg: 'rgba(45,91,138,0.08)',
    border: 'rgba(45,91,138,0.22)',
    text: '#2D5B8A',
    dot: '#4A7AB8',
  },
}
