import type { CertCategory, CertType, Certificate } from '@/app/Database/Certificatedata'
import { CERTIFICATES as STATIC_CERTIFICATES, CAT_COLOR } from '@/app/Database/Certificatedata'
import { HOME_CONTENT_TABLE } from '@/lib/supabase'

export const ACHIEVEMENTS_CERTIFICATES_TABLE = HOME_CONTENT_TABLE
export const ACHIEVEMENTS_CERTIFICATES_KEY = 'achievements_certificates'

export const CERTIFICATE_CATEGORIES: CertCategory[] = [
  'University Approval',
  'Academic Achievement',
  'Professional Development',
  'Workshop & Training',
  'Award & Recognition',
  'Conference',
  'Online Course',
  'Other',
]

export const CERTIFICATE_TYPE_OPTIONS: CertType[] = ['image', 'pdf']

export type CertificateItemRaw = Certificate & {
  link?: string
}

export type CertificatesContentRaw = {
  hero: {
    eyebrow: string
    title: string
    subtitle: string
  }
  certificates: CertificateItemRaw[]
}

export const CERTIFICATES_SECTION_KEYS = ['hero', 'certificates'] as const
export type CertificatesSectionKey = (typeof CERTIFICATES_SECTION_KEYS)[number]

export const CERTIFICATES_SECTION_META: Record<
  CertificatesSectionKey,
  { label: string; description: string }
> = {
  hero: {
    label: 'Hero',
    description: 'Hero eyebrow, heading and supporting copy shown on the certificates page.',
  },
  certificates: {
    label: 'Certificates',
    description: 'Certificate cards, file paths, optional external links, and tags.',
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

const normalizeCategory = (value: unknown): CertCategory => {
  if (
    value === 'University Approval' ||
    value === 'Academic Achievement' ||
    value === 'Professional Development' ||
    value === 'Workshop & Training' ||
    value === 'Award & Recognition' ||
    value === 'Conference' ||
    value === 'Online Course' ||
    value === 'Other'
  ) {
    return value
  }

  return 'Other'
}

const normalizeType = (value: unknown): CertType => (value === 'image' || value === 'pdf' ? value : 'pdf')

const normalizeCertificate = (item: Partial<CertificateItemRaw> | undefined, index: number): CertificateItemRaw => ({
  id: item?.id || `certificate-${index + 1}`,
  title: item?.title || '',
  issuer: item?.issuer || '',
  date: item?.date || '',
  year: toNumber(item?.year, new Date().getFullYear()),
  category: normalizeCategory(item?.category),
  description: item?.description || '',
  file: item?.file || '',
  type: normalizeType(item?.type),
  tags: toStringArray(item?.tags, []),
  credentialId: item?.credentialId || '',
  link: item?.link || '',
})

export const STATIC_CERTIFICATES_CONTENT: CertificatesContentRaw = {
  hero: {
    eyebrow: 'Certificates & Recognitions',
    title: 'Academic Credentials',
    subtitle:
      'A verified record of academic qualifications, professional recognitions, and institutional certifications spanning 18+ years of dedicated academic service.',
  },
  certificates: STATIC_CERTIFICATES.map((item) => ({
    ...item,
    link: item.link || '',
  })),
}

export const normalizeCertificatesContent = (
  value?: Partial<CertificatesContentRaw> | null,
): CertificatesContentRaw => ({
  hero: {
    eyebrow: value?.hero?.eyebrow || STATIC_CERTIFICATES_CONTENT.hero.eyebrow,
    title: value?.hero?.title || STATIC_CERTIFICATES_CONTENT.hero.title,
    subtitle: value?.hero?.subtitle || STATIC_CERTIFICATES_CONTENT.hero.subtitle,
  },
  certificates: Array.isArray(value?.certificates)
    ? value.certificates.map((item, index) => normalizeCertificate(item, index))
    : STATIC_CERTIFICATES_CONTENT.certificates.map((item, index) => normalizeCertificate(item, index)),
})

export const getCertificatesSnapshot = (
  value?: Partial<CertificatesContentRaw> | null,
): CertificatesContentRaw => normalizeCertificatesContent(value)

export const createDefaultCertificate = (): CertificateItemRaw => ({
  id: `certificate-${Date.now()}`,
  title: 'New certificate title',
  issuer: 'Issuing body',
  date: '2024',
  year: new Date().getFullYear(),
  category: 'Other',
  description: 'Short description of the certificate or credential.',
  file: '',
  type: 'pdf',
  tags: ['Credential'],
  credentialId: '',
  link: '',
})
