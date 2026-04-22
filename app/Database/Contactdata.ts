import {
  Mail, Phone, MapPin, Globe, FlaskConical,
  GraduationCap, BookOpen, Briefcase, Linkedin,
} from 'lucide-react'

// ── Contact Information ──
export type ContactInfo = {
  I: any
  label: string
  val: string
  href?: string
}

export const CONTACT_INFO: ContactInfo[] = [
  { I: Mail,    label: 'Email',    val: 'sachintakmare@gmail.com',    href: 'mailto:sachintakmare@gmail.com' },
  { I: Phone,   label: 'Phone',    val: '+91 9960843406',              href: 'tel:+919960843406' },
  { I: MapPin,  label: 'Location', val: 'Kolhapur, Maharashtra 416216', href: undefined },
  { I: Globe,   label: 'College',  val: 'D.Y. Patil College of Engg. & Tech., Kolhapur', href: undefined },
]

// ── Inquiry Categories ──
export const CATEGORIES: string[] = [
  'Research Collaboration',
  'Academic Partnership',
  'Student Mentorship',
  'Conference / Seminar Invitation',
  'AI / ML Consultancy',
  'Patent & IP Inquiry',
  'Media / Interview Request',
  'General Inquiry',
]

// ── Welcome Topics ──
export type WelcomeTopic = {
  I: any
  title: string
}

export const WELCOME_TOPICS: WelcomeTopic[] = [
  { I: FlaskConical, title: 'Research Collaborations & Co-authorship' },
  { I: GraduationCap, title: 'Student Mentorship & M.E. Supervision' },
  { I: BookOpen, title: 'Conference & Seminar Invitations' },
  { I: Briefcase, title: 'AI / ML Consultancy & Training' },
  { I: Linkedin, title: 'Academic & Professional Networking' },
]

// ── Hero Content ──
export const HERO_CONTENT = {
  eyebrow: 'Get In Touch',
  title: "Let's Start a Conversation",
  description: 'Whether you are a student, researcher, institution, or industry professional I am always open to meaningful conversations about AI research, academic collaboration, and education.',
}

// ── Form Types ──
export type FormState = {
  name: string
  email: string
  phone: string
  subject: string
  category: string
  message: string
}

export type Errors = Partial<Record<keyof FormState, string>>

export const EMPTY_FORM: FormState = {
  name: '', email: '', phone: '',
  subject: '', category: '', message: '',
}

// ── Validation Function ──
export function validateForm(f: FormState): Errors {
  const e: Errors = {}
  if (!f.name.trim())         e.name    = 'Full name is required'
  if (!f.email.trim())        e.email   = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
                              e.email   = 'Enter a valid email address'
  if (!f.subject.trim())      e.subject = 'Subject is required'
  if (!f.message.trim())      e.message = 'Message is required'
  else if (f.message.trim().length < 20)
                              e.message = 'Message must be at least 20 characters'
  return e
}

// ── Input Base Styles ──
export const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 8,
  border: '1.5px solid rgba(15,23,42,0.12)',
  background: '#fff',
  fontSize: 14,
  color: '#0F172A',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  transition: 'border-color 0.18s, box-shadow 0.18s',
  boxSizing: 'border-box',
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12.5,
  fontWeight: 600,
  color: '#334155',
  marginBottom: 7,
  fontFamily: 'DM Sans, sans-serif',
}

export const errorStyle: React.CSSProperties = {
  fontSize: 11.5,
  color: '#DC2626',
  marginTop: 5,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontFamily: 'DM Sans, sans-serif',
}

// ── Field Style Helper ──
export const getFieldStyle = (
  name: string,
  errors: Errors,
  focused: string
): React.CSSProperties => ({
  ...inputBase,
  borderColor: errors[name as keyof FormState]
    ? '#DC2626'
    : focused === name
    ? '#0D1F3C'
    : 'rgba(15,23,42,0.12)',
  boxShadow: focused === name && !errors[name as keyof FormState]
    ? '0 0 0 3px rgba(13,31,60,0.08)'
    : 'none',
})

// ── Alert Helper ──
export const showAlert = async (type: 'success' | 'error', title: string, text: string) => {
  const Swal = (await import('sweetalert2')).default
  await Swal.fire({
    icon: type,
    title,
    text,
    confirmButtonText: type === 'success' ? 'Great, thank you!' : 'OK',
    confirmButtonColor: type === 'success' ? '#0D1F3C' : '#B8870A',
    background: '#FFFFFF',
    color: '#0F172A',
    iconColor: type === 'success' ? '#1A6B48' : '#B8870A',
    customClass: {
      popup:   'swal-popup',
      title:   'swal-title',
      htmlContainer: 'swal-text',
      confirmButton: 'swal-btn',
    },
    showClass: {
      popup: 'animate__animated animate__fadeInDown animate__faster',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster',
    },
  })
}