export const CONTACT_CONTENT_TABLE = 'home_content_sections'
export const CONTACT_CONTENT_KEY = 'contact'

export type ContactInfoIconKey = 'mail' | 'phone' | 'map-pin' | 'globe'
export type WelcomeTopicIconKey = 'flask' | 'graduation' | 'book' | 'briefcase' | 'linkedin'

export type ContactInfoItemRaw = {
  iconKey: ContactInfoIconKey
  label: string
  val: string
  href?: string
}

export type ContactWelcomeTopicRaw = {
  iconKey: WelcomeTopicIconKey
  title: string
}

export type ContactHeroRaw = {
  eyebrow: string
  title: string
  description: string
}

export type ContactContentRaw = {
  contactInfo: ContactInfoItemRaw[]
  categories: string[]
  welcomeTopics: ContactWelcomeTopicRaw[]
  hero: ContactHeroRaw
}

const DEFAULT_HERO: ContactHeroRaw = {
  eyebrow: 'Get In Touch',
  title: "Let's Start a Conversation",
  description:
    'Whether you are a student, researcher, institution, or industry professional I am always open to meaningful conversations about AI research, academic collaboration, and education.',
}

export const STATIC_CONTACT_CONTENT: ContactContentRaw = {
  contactInfo: [
    { iconKey: 'mail', label: 'Email', val: 'sachintakmare@gmail.com', href: 'mailto:sachintakmare@gmail.com' },
    { iconKey: 'phone', label: 'Phone', val: '+91 9960843406', href: 'tel:+919960843406' },
    { iconKey: 'map-pin', label: 'Location', val: 'Kolhapur, Maharashtra 416216' },
    { iconKey: 'globe', label: 'College', val: 'D.Y. Patil College of Engg. & Tech., Kolhapur' },
  ],
  categories: [
    'Research Collaboration',
    'Academic Partnership',
    'Student Mentorship',
    'Conference / Seminar Invitation',
    'AI / ML Consultancy',
    'Patent & IP Inquiry',
    'Media / Interview Request',
    'General Inquiry',
  ],
  welcomeTopics: [
    { iconKey: 'flask', title: 'Research Collaborations & Co-authorship' },
    { iconKey: 'graduation', title: 'Student Mentorship & M.E. Supervision' },
    { iconKey: 'book', title: 'Conference & Seminar Invitations' },
    { iconKey: 'briefcase', title: 'AI / ML Consultancy & Training' },
    { iconKey: 'linkedin', title: 'Academic & Professional Networking' },
  ],
  hero: DEFAULT_HERO,
}

const normalizeContactInfo = (value: unknown): ContactInfoItemRaw[] => {
  if (!Array.isArray(value)) {
    return STATIC_CONTACT_CONTENT.contactInfo
  }

  const items = value
    .map((entry): ContactInfoItemRaw | null => {
      if (!entry || typeof entry !== 'object') {
        return null
      }

      const cast = entry as Partial<ContactInfoItemRaw>
      return {
        iconKey: (cast.iconKey || 'mail') as ContactInfoIconKey,
        label: typeof cast.label === 'string' ? cast.label : '',
        val: typeof cast.val === 'string' ? cast.val : '',
        href: typeof cast.href === 'string' ? cast.href : undefined,
      }
    })
    .filter((item): item is ContactInfoItemRaw => Boolean(item && item.label && item.val))

  return items.length > 0 ? items : STATIC_CONTACT_CONTENT.contactInfo
}

const normalizeWelcomeTopics = (value: unknown): ContactWelcomeTopicRaw[] => {
  if (!Array.isArray(value)) {
    return STATIC_CONTACT_CONTENT.welcomeTopics
  }

  const items = value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null
      }

      const cast = entry as Partial<ContactWelcomeTopicRaw>
      return {
        iconKey: (cast.iconKey || 'flask') as WelcomeTopicIconKey,
        title: typeof cast.title === 'string' ? cast.title : '',
      }
    })
    .filter((item): item is ContactWelcomeTopicRaw => Boolean(item && item.title))

  return items.length > 0 ? items : STATIC_CONTACT_CONTENT.welcomeTopics
}

const normalizeCategories = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return STATIC_CONTACT_CONTENT.categories
  }

  const items = value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0)
  return items.length > 0 ? items : STATIC_CONTACT_CONTENT.categories
}

const normalizeHero = (value: unknown): ContactHeroRaw => {
  if (!value || typeof value !== 'object') {
    return DEFAULT_HERO
  }

  const cast = value as Partial<ContactHeroRaw>
  return {
    eyebrow: typeof cast.eyebrow === 'string' && cast.eyebrow.trim() ? cast.eyebrow : DEFAULT_HERO.eyebrow,
    title: typeof cast.title === 'string' && cast.title.trim() ? cast.title : DEFAULT_HERO.title,
    description:
      typeof cast.description === 'string' && cast.description.trim() ? cast.description : DEFAULT_HERO.description,
  }
}

export const normalizeContactContent = (value?: Partial<ContactContentRaw> | null): ContactContentRaw => ({
  contactInfo: normalizeContactInfo(value?.contactInfo),
  categories: normalizeCategories(value?.categories),
  welcomeTopics: normalizeWelcomeTopics(value?.welcomeTopics),
  hero: normalizeHero(value?.hero),
})

export const getContactContentSnapshot = (value?: Partial<ContactContentRaw> | null): ContactContentRaw =>
  normalizeContactContent(value || STATIC_CONTACT_CONTENT)
