'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Mail, Phone, MapPin, Send, User,
  MessageSquare, BookOpen, FlaskConical,
  GraduationCap, Briefcase, ChevronDown,
  Clock, Globe, Linkedin, ArrowRight,
} from 'lucide-react'
import {
  EMPTY_FORM,
  validateForm,
  labelStyle,
  errorStyle,
  getFieldStyle,
  showAlert,
  type FormState,
  type Errors,
} from '../Database/Contactdata'
import {
  STATIC_CONTACT_CONTENT,
  normalizeContactContent,
  type ContactContentRaw,
  type ContactInfoIconKey,
  type WelcomeTopicIconKey,
} from '@/lib/contactContent'

type ContactContentApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<ContactContentRaw>
  message?: string
}

const CONTACT_INFO_ICONS: Record<ContactInfoIconKey, typeof Mail> = {
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  globe: Globe,
}

const WELCOME_TOPIC_ICONS: Record<WelcomeTopicIconKey, typeof FlaskConical> = {
  flask: FlaskConical,
  graduation: GraduationCap,
  book: BookOpen,
  briefcase: Briefcase,
  linkedin: Linkedin,
}

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-30px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as any },
})

// ═══════════════════════════════════════════════════════════
export default function ContactPage() {
  const [contactContent, setContactContent] = useState<ContactContentRaw>(STATIC_CONTACT_CONTENT)
  const [form, setForm]       = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors]   = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string>('')
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })
  const formRef               = useRef<HTMLFormElement>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/contact-content', { cache: 'no-store' })
        const payload = (await response.json()) as ContactContentApiState

        if (!active) {
          return
        }

        setContactContent(normalizeContactContent(payload.content || STATIC_CONTACT_CONTENT))
      } catch {
        if (!active) {
          return
        }

        setContactContent(STATIC_CONTACT_CONTENT)
      }
    }

    void loadContent()

    return () => {
      active = false
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (submitMessage.type) {
      setSubmitMessage({ type: null, text: '' })
    }

    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateForm(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErr = formRef.current?.querySelector('[data-error="true"]') as HTMLElement
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setSubmitMessage({ type: 'error', text: 'Please fix the highlighted fields before sending.' })
      return
    }

    setLoading(true)
    setSubmitMessage({ type: null, text: '' })

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }

      if (res.ok) {
        setForm(EMPTY_FORM)
        setErrors({})
        setSubmitMessage({ type: 'success', text: 'Your message has been sent successfully.' })
        await showAlert(
          'success',
          'Message Sent!',
          'Thank you for reaching out. Your inquiry has been received successfully. Dr. Takmare will respond within 1–2 business days.'
        )
      } else {
        const errorText = data.error || 'Something went wrong. Please try again.'
        setSubmitMessage({ type: 'error', text: errorText })
        await showAlert('error', 'Submission Failed', errorText)
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'Could not connect to the server. Please try again.' })
      await showAlert('error', 'Network Error', 'Could not connect to the server. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = (name: string): React.CSSProperties => getFieldStyle(name, errors, focused)

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'var(--nav-h)',
        background: 'var(--navy)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Accents */}
        <div style={{ position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 80% at 80% 50%, rgba(184,135,10,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="W" style={{ padding: 'clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 2, background: 'var(--gold-3)', borderRadius: 2, display: 'inline-block' }} />
              {contactContent.hero.eyebrow}
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(34px, 5.5vw, 64px)', fontWeight: 800, color: '#F0F4F8', lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 18, maxWidth: 640 }}>
              {contactContent.hero.title}{' '}
              <em style={{ color: 'var(--gold-3)', fontStyle: 'italic', fontWeight: 600 }}>Conversation</em>
            </h1>
            <p style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'rgba(226,232,240,0.70)', lineHeight: 1.75, maxWidth: 560, fontWeight: 300 }}>
              {contactContent.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(52px, 9vh, 96px) 0 clamp(72px, 11vh, 120px)' }}>
        <div className="W">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.55fr)',
            gap: 'clamp(40px, 6vw, 80px)',
            alignItems: 'start',
          }} className="cgrid">

            {/* ══ LEFT Info panel ══ */}
            <motion.div {...up(0)} style={{ position: 'sticky', top: 'calc(var(--nav-h) + 24px)' }} className="csticky">

              {/* Contact info card */}
              <div style={{ background: 'var(--navy)', borderRadius: 14, overflow: 'hidden', marginBottom: 20, boxShadow: 'var(--sh3)' }}>
                <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold), var(--gold-3))' }} />
                <div style={{ padding: 'clamp(22px, 3vw, 32px)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-3)', marginBottom: 16 }}>Contact Information</p>

                  {contactContent.contactInfo.map(({ iconKey, label, val, href }, i) => {
                    const I = CONTACT_INFO_ICONS[iconKey] || Mail
                    return (
                    <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', padding: '11px 0', borderBottom: i < contactContent.contactInfo.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(184,135,10,0.12)', border: '1px solid rgba(184,135,10,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <I size={14} style={{ color: 'var(--gold-3)' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.40)', marginBottom: 3 }}>{label}</p>
                        {href ? (
                          <a href={href} style={{ fontSize: 13, color: '#E2E8F0', textDecoration: 'none', lineHeight: 1.4, transition: 'color 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-3)')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#E2E8F0')}>
                            {val}
                          </a>
                        ) : (
                          <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.4, margin: 0 }}>{val}</p>
                        )}
                      </div>
                    </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick contact topics */}
              <div style={{ background: 'var(--off)', border: '1px solid var(--ink-line)', borderRadius: 12, padding: 'clamp(18px, 2.5vw, 24px)' }}>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>I welcome inquiries on:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {contactContent.welcomeTopics.map(({ iconKey, title }, i) => {
                    const I = WELCOME_TOPIC_ICONS[iconKey] || FlaskConical
                    return (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <I size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <p style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{title}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* ══ RIGHT Contact form ══ */}
            <motion.div {...up(0.1)}>
              <div style={{ background: 'var(--white)', border: '1px solid var(--ink-line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--sh2)' }}>

                {/* Form header */}
                <div style={{ padding: '22px 28px', background: 'var(--off)', borderBottom: '1px solid var(--ink-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={17} style={{ color: 'var(--gold-3)' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.2 }}>Send a Message</p>
                    <p style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>All fields marked * are required</p>
                  </div>
                </div>

                {/* Form body */}
                <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ padding: 'clamp(22px, 3vw, 36px)' }}>

                  {/* Row 1 Name + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 18 }}>
                    {/* Name */}
                    <div data-error={!!errors.name}>
                      <label style={labelStyle}>
                        Full Name <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focused === 'name' ? 'var(--navy)' : 'var(--ink-4)', pointerEvents: 'none' }} />
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused('')}
                          placeholder="Dr. / Mr. / Ms. Your Name"
                          autoComplete="name"
                          style={{ ...fieldStyle('name'), paddingLeft: 36 }}
                        />
                      </div>
                      {errors.name && <p style={errorStyle}>⚠ {errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div data-error={!!errors.email}>
                      <label style={labelStyle}>
                        Email Address <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? 'var(--navy)' : 'var(--ink-4)', pointerEvents: 'none' }} />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused('')}
                          placeholder="your@email.com"
                          autoComplete="email"
                          style={{ ...fieldStyle('email'), paddingLeft: 36 }}
                        />
                      </div>
                      {errors.email && <p style={errorStyle}>⚠ {errors.email}</p>}
                    </div>
                  </div>

                  {/* Row 2 Phone + Category */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 18 }}>
                    {/* Phone */}
                    <div>
                      <label style={labelStyle}>Phone Number <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>(optional)</span></label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focused === 'phone' ? 'var(--navy)' : 'var(--ink-4)', pointerEvents: 'none' }} />
                        <input
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          onFocus={() => setFocused('phone')}
                          onBlur={() => setFocused('')}
                          placeholder="+91 XXXXX XXXXX"
                          autoComplete="tel"
                          style={{ ...fieldStyle('phone'), paddingLeft: 36 }}
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label style={labelStyle}>Inquiry Category</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          onFocus={() => setFocused('category')}
                          onBlur={() => setFocused('')}
                          style={{
                            ...fieldStyle('category'),
                            appearance: 'none',
                            paddingRight: 36,
                            cursor: 'pointer',
                            color: form.category ? '#0F172A' : '#94A3B8',
                          }}
                        >
                          <option value="" disabled>Select a category</option>
                          {contactContent.categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div data-error={!!errors.subject} style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>
                      Subject <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      onFocus={() => setFocused('subject')}
                      onBlur={() => setFocused('')}
                      placeholder="Brief subject of your message"
                      style={fieldStyle('subject')}
                    />
                    {errors.subject && <p style={errorStyle}>⚠ {errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div data-error={!!errors.message} style={{ marginBottom: 26 }}>
                    <label style={labelStyle}>
                      Message <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused('')}
                      placeholder="Please describe your inquiry in detail. Include relevant context such as your institution, research area, or specific questions..."
                      rows={6}
                      style={{
                        ...fieldStyle('message'),
                        resize: 'vertical',
                        minHeight: 140,
                        lineHeight: 1.65,
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                      {errors.message
                        ? <p style={errorStyle}>⚠ {errors.message}</p>
                        : <span />
                      }
                      <p style={{ fontSize: 11, color: form.message.length > 0 && form.message.length < 20 ? '#DC2626' : 'var(--ink-4)', marginLeft: 'auto' }}>
                        {form.message.length} chars {form.message.length < 20 ? `(${20 - form.message.length} more needed)` : ''}
                      </p>
                    </div>
                  </div>

                  {submitMessage.type ? (
                    <div
                      role="status"
                      aria-live="polite"
                      style={{
                        marginBottom: 18,
                        borderRadius: 8,
                        padding: '10px 12px',
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: submitMessage.type === 'success' ? '#14532D' : '#991B1B',
                        background: submitMessage.type === 'success' ? '#ECFDF3' : '#FEF2F2',
                        border:
                          submitMessage.type === 'success'
                            ? '1px solid rgba(20,83,45,0.25)'
                            : '1px solid rgba(153,27,27,0.2)',
                      }}
                    >
                      {submitMessage.text}
                    </div>
                  ) : null}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    style={{
                      width: '100%',
                      padding: '13px 24px',
                      borderRadius: 9,
                      border: 'none',
                      background: loading ? 'var(--navy-2)' : 'var(--navy)',
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: 'DM Sans, sans-serif',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      transition: 'background 0.18s, transform 0.18s, box-shadow 0.18s',
                      boxShadow: loading ? 'none' : '0 3px 14px rgba(13,31,60,0.22)',
                      letterSpacing: '0.01em',
                    }}
                    onMouseEnter={e => {
                      if (!loading) {
                        const el = e.currentTarget
                        el.style.background = '#1A3560'
                        el.style.transform = 'translateY(-1px)'
                        el.style.boxShadow = '0 6px 20px rgba(13,31,60,0.28)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!loading) {
                        const el = e.currentTarget
                        el.style.background = 'var(--navy)'
                        el.style.transform = 'translateY(0)'
                        el.style.boxShadow = '0 3px 14px rgba(13,31,60,0.22)'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Sending your message…
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>

                  {/* Privacy note */}
                  <p style={{ fontSize: 11.5, color: 'var(--ink-4)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                    Your information is kept private and used only to respond to your inquiry.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA row ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(48px, 8vh, 80px) 0', borderTop: '1px solid var(--ink-line)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div className="W" style={{ position: 'relative' }}>
          <motion.div {...up()}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--navy)', marginBottom: 14, lineHeight: 1.12 }}>
              Explore My <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 500 }}>Academic Work</em>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.75, fontWeight: 300 }}>
              Before reaching out, feel free to explore my research, teaching portfolio, and published patents.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <Link href="/research" className="btn-navy" style={{ padding: '11px 22px', fontSize: 13.5 }}>Research Papers <ArrowRight size={14} /></Link>
              <Link href="/about" className="btn-out" style={{ padding: '11px 22px', fontSize: 13.5 }}>About Me</Link>
                        </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* SweetAlert2 custom theme */
        .swal2-popup.swal-popup {
          border-radius: 14px !important;
          padding: 32px 28px !important;
          box-shadow: 0 20px 60px rgba(13,31,60,0.18) !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .swal2-title.swal-title {
          font-family: 'Playfair Display', serif !important;
          font-size: 22px !important;
          color: #0D1F3C !important;
          font-weight: 700 !important;
        }
        .swal2-html-container.swal-text {
          font-size: 14px !important;
          color: #64748B !important;
          line-height: 1.72 !important;
        }
        .swal2-confirm.swal-btn {
          padding: 10px 26px !important;
          border-radius: 7px !important;
          font-size: 13.5px !important;
          font-weight: 600 !important;
          font-family: 'DM Sans', sans-serif !important;
          letter-spacing: 0.01em !important;
        }

        @media (max-width: 860px) {
          .cgrid { grid-template-columns: 1fr !important; }
          .csticky { position: static !important; }
        }
        @media (max-width: 480px) {
          .W { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </>
  )
}