import type { PGProject, UGDomain } from '@/app/Database/Projectdata'
import { PG_PROJECTS, UG_DOMAINS, FILTER_TABS, MENTORSHIP_STEPS } from '@/app/Database/Projectdata'
import type { FilterTab } from '@/app/Database/Projectdata'
import { Brain, Microscope, Globe, Shield, Cpu, Layers } from 'lucide-react'
import { HOME_CONTENT_TABLE } from '@/lib/supabase'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  'ug-ai': Brain,
  'ug-cv': Microscope,
  'ug-web': Globe,
  'ug-sec': Shield,
  'ug-iot': Cpu,
  'ug-data': Layers,
}

const ICON_KEY_BY_ID: Record<string, string> = {
  'ug-ai': 'brain',
  'ug-cv': 'microscope',
  'ug-web': 'globe',
  'ug-sec': 'shield',
  'ug-iot': 'cpu',
  'ug-data': 'layers',
}

const ICON_COMPONENT_BY_KEY: Record<string, React.ComponentType<{ size?: number }>> = {
  brain: Brain,
  microscope: Microscope,
  globe: Globe,
  shield: Shield,
  cpu: Cpu,
  layers: Layers,
}

export const UG_ICON_OPTIONS = [
  { label: 'Brain / AI', value: 'brain' },
  { label: 'Microscope / CV', value: 'microscope' },
  { label: 'Globe / Web', value: 'globe' },
  { label: 'Shield / Security', value: 'shield' },
  { label: 'CPU / IoT', value: 'cpu' },
  { label: 'Layers / Data', value: 'layers' },
] as const

export type UGIconKey = (typeof UG_ICON_OPTIONS)[number]['value']

const getIconForKey = (key?: string | null): React.ComponentType<{ size?: number }> | null => {
  if (!key) return null
  return ICON_COMPONENT_BY_KEY[key] || null
}

const getIconKeyForDomain = (id?: string | null, iconKey?: string | null): string | undefined => {
  if (iconKey && ICON_COMPONENT_BY_KEY[iconKey]) {
    return iconKey
  }

  if (!id) {
    return undefined
  }

  return ICON_KEY_BY_ID[id]
}

export const PROJECTS_TABLE = HOME_CONTENT_TABLE
export const PROJECTS_KEY = 'projects'
export { FILTER_TABS, MENTORSHIP_STEPS }
export type { FilterTab }

export type ProjectsContentRaw = {
  pgProjects: PGProject[]
  ugDomains: UGDomain[]
}

export const PROJECTS_SECTION_KEYS = ['pgProjects', 'ugDomains'] as const
export type ProjectsSectionKey = (typeof PROJECTS_SECTION_KEYS)[number]

export const PROJECTS_SECTION_META: Record<
  ProjectsSectionKey,
  { label: string; description: string }
> = {
  pgProjects: {
    label: 'PG Projects',
    description: 'M.E. dissertations, PhD research, and postgraduate projects with outcomes and publications.',
  },
  ugDomains: {
    label: 'UG Domains',
    description: 'Undergraduate project domains, categories, highlights, and technologies.',
  },
}

const toStringArray = (value: unknown, fallback: string[] = []): string[] => {
  if (!Array.isArray(value)) {
    return [...fallback]
  }
  return value.map((item) => `${item}`)
}

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  const parsed = Number.parseInt(`${value}`, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizePGProject = (item: Partial<PGProject> | undefined, index: number): PGProject => ({
  id: item?.id || `pg-${index + 1}`,
  title: item?.title || '',
  student: item?.student || '',
  university: item?.university || '',
  year: item?.year || new Date().getFullYear().toString(),
  domain: item?.domain || '',
  summary: item?.summary || '',
  outcome: item?.outcome || '',
  tags: toStringArray(item?.tags, []),
  color: item?.color || '#0D1F3C',
  link: item?.link || '',
  uploadUrl: item?.uploadUrl || '',
})

const normalizeUGDomain = (item: Partial<UGDomain> | undefined, index: number): UGDomain => {
  const id = item?.id || `ug-${index + 1}`
  const iconKey = getIconKeyForDomain(id, item?.iconKey)
  return {
    id,
    iconKey,
    icon: getIconForKey(iconKey),
    domain: item?.domain || '',
    color: item?.color || '#0D1F3C',
    bg: item?.bg || 'rgba(13,31,60,0.07)',
    description: item?.description || '',
    totalGroups: toNumber(item?.totalGroups, 0),
    highlights: toStringArray(item?.highlights, []),
    technologies: toStringArray(item?.technologies, []),
  }
}

export const STATIC_PROJECTS_CONTENT: ProjectsContentRaw = {
  pgProjects: PG_PROJECTS.map((item, index) => normalizePGProject(item, index)),
  ugDomains: UG_DOMAINS.map((item, index) => normalizeUGDomain(item, index)),
}

export const normalizeProjectsContent = (
  value?: Partial<ProjectsContentRaw> | null,
): ProjectsContentRaw => ({
  pgProjects: Array.isArray(value?.pgProjects)
    ? value.pgProjects.map((item, index) => normalizePGProject(item, index))
    : STATIC_PROJECTS_CONTENT.pgProjects.map((item, index) => normalizePGProject(item, index)),
  ugDomains: Array.isArray(value?.ugDomains)
    ? value.ugDomains.map((item, index) => normalizeUGDomain(item, index))
    : STATIC_PROJECTS_CONTENT.ugDomains.map((item, index) => normalizeUGDomain(item, index)),
})

export const getProjectsSnapshot = (
  value?: Partial<ProjectsContentRaw> | null,
): ProjectsContentRaw => normalizeProjectsContent(value)

export const createDefaultPGProject = (): PGProject => ({
  id: `pg-${Date.now()}`,
  title: 'New project title',
  student: 'Student name or team',
  university: 'University name',
  year: new Date().getFullYear().toString(),
  domain: 'AI & Precision Agriculture',
  summary: 'Brief project summary and objectives.',
  outcome: 'Project results, publications, or patents.',
  tags: ['New'],
  color: '#0D1F3C',
  link: '',
  uploadUrl: '',
})

export const createDefaultUGDomain = (): UGDomain => {
  const newId = `ug-${Date.now()}`
  const iconKey = getIconKeyForDomain(newId, 'brain') || 'brain'
  return {
    id: newId,
    iconKey,
    icon: getIconForKey(iconKey) || Brain,
    domain: 'New domain',
    color: '#0D1F3C',
    bg: 'rgba(13,31,60,0.07)',
    description: 'Domain description.',
    totalGroups: 0,
    highlights: [],
    technologies: [],
  }
}
