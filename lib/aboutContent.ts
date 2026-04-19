import {
  AT_A_GLANCE,
  BIO_PARAGRAPHS,
  BIO_HEADING,
  BIO_TITLE,
  EDUCATION,
  HERO_CONTENT,
  HERO_TAGS,
  MILESTONES,
  RESEARCH_AREAS,
  TYPE_COLORS,
  CTA_CONTENT,
} from '../app/Database/Aboutdata'
import { HOME_CONTENT_TABLE } from './supabase'

export const ABOUT_CONTENT_TABLE = HOME_CONTENT_TABLE
export const ABOUT_CONTENT_KEY = 'about'

export type AboutHeroContent = typeof HERO_CONTENT & {
  profileImageUrl?: string
}

export type AboutEducationItem = (typeof EDUCATION)[number]
export type AboutResearchArea = (typeof RESEARCH_AREAS)[number]
export type AboutMilestone = (typeof MILESTONES)[number]
export type AboutGlanceItem = (typeof AT_A_GLANCE)[number]

export type AboutContentRaw = {
  heroContent: AboutHeroContent
  education: AboutEducationItem[]
  researchAreas: AboutResearchArea[]
  milestones: AboutMilestone[]
  typeColors: Record<string, string>
  heroTags: Array<{ label: string }>
  atAGlance: AboutGlanceItem[]
  bioParagraphs: string[]
  bioTitle: typeof BIO_TITLE
  bioHeading: typeof BIO_HEADING
  ctaContent: typeof CTA_CONTENT
}

const copyObjects = <T extends Record<string, unknown>>(value: T[] | undefined, fallback: T[]): T[] => {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }))
  }

  return value.map((item) => ({ ...item }))
}

const copyStrings = (value: string[] | undefined, fallback: string[]): string[] => {
  if (!Array.isArray(value)) {
    return [...fallback]
  }

  return value.map((item) => `${item}`)
}

export const STATIC_ABOUT_CONTENT: AboutContentRaw = {
  heroContent: {
    ...HERO_CONTENT,
    profileImageUrl: '/Profile_pic/SBT_About.jpg',
  },
  education: EDUCATION.map((item) => ({ ...item })),
  researchAreas: RESEARCH_AREAS.map((item) => ({ ...item })),
  milestones: MILESTONES.map((item) => ({ ...item })),
  typeColors: { ...TYPE_COLORS },
  heroTags: HERO_TAGS.map((item) => ({ ...item })),
  atAGlance: AT_A_GLANCE.map((item) => ({ ...item })),
  bioParagraphs: [...BIO_PARAGRAPHS],
  bioTitle: { ...BIO_TITLE },
  bioHeading: { ...BIO_HEADING },
  ctaContent: { ...CTA_CONTENT },
}

export const normalizeAboutContent = (value?: Partial<AboutContentRaw> | null): AboutContentRaw => ({
  heroContent: {
    ...STATIC_ABOUT_CONTENT.heroContent,
    ...(value?.heroContent || {}),
    profileImageUrl: value?.heroContent?.profileImageUrl || STATIC_ABOUT_CONTENT.heroContent.profileImageUrl || '',
  },
  education: copyObjects(value?.education, STATIC_ABOUT_CONTENT.education),
  researchAreas: copyObjects(value?.researchAreas, STATIC_ABOUT_CONTENT.researchAreas),
  milestones: copyObjects(value?.milestones, STATIC_ABOUT_CONTENT.milestones),
  typeColors: {
    ...STATIC_ABOUT_CONTENT.typeColors,
    ...(value?.typeColors || {}),
  },
  heroTags: copyObjects(value?.heroTags, STATIC_ABOUT_CONTENT.heroTags),
  atAGlance: copyObjects(value?.atAGlance, STATIC_ABOUT_CONTENT.atAGlance),
  bioParagraphs: copyStrings(value?.bioParagraphs, STATIC_ABOUT_CONTENT.bioParagraphs),
  bioTitle: {
    ...STATIC_ABOUT_CONTENT.bioTitle,
    ...(value?.bioTitle || {}),
  },
  bioHeading: {
    ...STATIC_ABOUT_CONTENT.bioHeading,
    ...(value?.bioHeading || {}),
  },
  ctaContent: {
    ...STATIC_ABOUT_CONTENT.ctaContent,
    ...(value?.ctaContent || {}),
  },
})

export const getAboutContentSnapshot = (value?: Partial<AboutContentRaw> | null): AboutContentRaw => normalizeAboutContent(value)
