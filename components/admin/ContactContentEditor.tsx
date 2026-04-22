'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CloudOff, Database, Plus, RefreshCw, Save, Shield, Sparkles, Trash2 } from 'lucide-react'

import {
  STATIC_CONTACT_CONTENT,
  normalizeContactContent,
  type ContactContentRaw,
  type ContactInfoIconKey,
  type WelcomeTopicIconKey,
} from '@/lib/contactContent'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<ContactContentRaw>
  message?: string
  supabase?: {
    url?: boolean
    publicKey?: boolean
    serviceKey?: boolean
  }
}

const CONTACT_INFO_ICON_OPTIONS: Array<{ key: ContactInfoIconKey; label: string }> = [
  { key: 'mail', label: 'Mail' },
  { key: 'phone', label: 'Phone' },
  { key: 'map-pin', label: 'Map Pin' },
  { key: 'globe', label: 'Globe' },
]

const WELCOME_TOPIC_ICON_OPTIONS: Array<{ key: WelcomeTopicIconKey; label: string }> = [
  { key: 'flask', label: 'Flask' },
  { key: 'graduation', label: 'Graduation' },
  { key: 'book', label: 'Book' },
  { key: 'briefcase', label: 'Briefcase' },
  { key: 'linkedin', label: 'LinkedIn' },
]

const alertTheme = {
  success: { confirmButtonColor: '#0D1F3C', iconColor: '#1A6B48' },
  error: { confirmButtonColor: '#B8870A', iconColor: '#B8870A' },
  info: { confirmButtonColor: '#0D1F3C', iconColor: '#2D5B8A' },
}

const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="contact-editor-field-label">{children}</p>
}

function TextField({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      className="contact-editor-input"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      className="contact-editor-textarea"
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default function ContactContentEditor() {
  const [content, setContent] = useState<ContactContentRaw>(() => normalizeContactContent(STATIC_CONTACT_CONTENT))
  const [source, setSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [statusMessage, setStatusMessage] = useState('Loading contact content...')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/contact-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeContactContent(payload.content || STATIC_CONTACT_CONTENT))
        setSource(payload.source || 'backup')
        setStatusMessage(payload.source === 'supabase' ? 'Contact content loaded from Supabase.' : payload.message || 'Backup content is active.')
      } catch {
        if (!active) {
          return
        }

        setContent(normalizeContactContent(STATIC_CONTACT_CONTENT))
        setSource('backup')
        setStatusMessage('Backup content is active.')
      }
    }

    void loadContent()

    return () => {
      active = false
    }
  }, [])

  const showAlert = async (type: 'success' | 'error' | 'info', title: string, text: string) => {
    const Swal = (await import('sweetalert2')).default
    const theme = alertTheme[type]
    await Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: theme.confirmButtonColor,
      background: '#FFFFFF',
      color: '#0F172A',
      iconColor: theme.iconColor,
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        htmlContainer: 'swal-text',
        confirmButton: 'swal-btn',
      },
    })
  }

  const confirmAction = async (title: string, text: string, confirmButtonText = 'Delete') => {
    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B8870A',
      cancelButtonColor: '#0D1F3C',
      background: '#FFFFFF',
      color: '#0F172A',
    })

    return confirm.isConfirmed
  }

  const saveContent = async (nextValue?: ContactContentRaw, statusOverride?: string) => {
    if (saving) {
      return
    }

    const payloadValue = nextValue || content

    setSaving(true)
    try {
      const response = await fetch('/api/contact-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: payloadValue }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[contact-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save contact content right now.')
        return
      }

      setContent(normalizeContactContent(payload.content || payloadValue))
      setSource(payload.source || 'supabase')
      setStatusMessage(statusOverride || 'Contact content saved to Supabase.')
      await showAlert('success', 'Saved', 'Contact page content has been updated.')
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the contact content API.')
    } finally {
      setSaving(false)
    }
  }

  const restoreBackup = async () => {
    const restored = normalizeContactContent(STATIC_CONTACT_CONTENT)
    setContent(restored)
    await saveContent(restored, 'Backup contact content restored to Supabase.')
  }

  const saveSection = async (sectionLabel: string) => {
    await saveContent(content, `${sectionLabel} saved to Supabase.`)
  }

  const deleteContactInfoRow = async (index: number) => {
    if (saving) {
      return
    }

    const isConfirmed = await confirmAction(
      'Delete contact row?',
      'This will remove the contact item from Supabase and public Contact page.',
      'Delete row',
    )

    if (!isConfirmed) {
      return
    }

    const next = normalizeContactContent({
      ...content,
      contactInfo: content.contactInfo.filter((_, entryIndex) => entryIndex !== index),
    })

    setContent(next)
    await saveContent(next, 'Contact info section updated in Supabase.')
  }

  const deleteWelcomeTopicRow = async (index: number) => {
    if (saving) {
      return
    }

    const isConfirmed = await confirmAction(
      'Delete welcome topic?',
      'This will remove the topic from Supabase and public Contact page.',
      'Delete row',
    )

    if (!isConfirmed) {
      return
    }

    const next = normalizeContactContent({
      ...content,
      welcomeTopics: content.welcomeTopics.filter((_, entryIndex) => entryIndex !== index),
    })

    setContent(next)
    await saveContent(next, 'Welcome topics section updated in Supabase.')
  }

  const deleteContent = async () => {
    if (saving) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete Contact override?',
      text: 'The page will fall back to Contactdata.ts backup content.',
      showCancelButton: true,
      confirmButtonText: 'Delete override',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B8870A',
      cancelButtonColor: '#0D1F3C',
      background: '#FFFFFF',
      color: '#0F172A',
    })

    if (!confirm.isConfirmed) {
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/contact-content', { method: 'DELETE' })
      const payload = (await response.json()) as ApiState

      if (!response.ok || !payload.ok) {
        console.error('[contact-editor] Delete failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Delete failed', payload.message || 'Unable to remove contact override.')
        return
      }

      setContent(normalizeContactContent(payload.content || STATIC_CONTACT_CONTENT))
      setSource('backup')
      setStatusMessage('Contact override removed. Backup content is active.')
      await showAlert('success', 'Deleted', 'The Supabase contact override has been removed.')
    } catch {
      await showAlert('error', 'Delete failed', 'Unable to reach the contact content API.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="contact-editor-shell">
      <div className="contact-editor-banner">
        <div>
          <p className="contact-editor-kicker">Contact Content Manager</p>
          <h3>Supabase first, TS backup always available</h3>
          <p>{statusMessage}</p>
        </div>

        <div className="contact-editor-banner-actions">
          <div className={`contact-editor-source contact-editor-source-${source}`}>
            {source === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
            <span>{source === 'supabase' ? 'Supabase live' : 'Backup active'}</span>
          </div>
          <button type="button" className="contact-editor-btn contact-editor-btn-primary" onClick={() => saveContent()} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save all changes'}
          </button>
        </div>
      </div>

      <div className="contact-editor-grid">
        <motion.div className="contact-editor-card contact-editor-card-callout" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="contact-editor-card-kicker">
            <Shield size={13} /> Backup strategy
          </p>
          <h4>If Supabase is unavailable, Contact page still renders from TS backup.</h4>
          <p>Deleting the override removes only the DB row. Backup content remains safe and available.</p>
        </motion.div>

        <motion.div className="contact-editor-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.04 }}>
          <p className="contact-editor-card-kicker">
            <Sparkles size={13} /> Quick facts
          </p>
          <div className="contact-editor-quick-list">
            <div><strong>{content.contactInfo.length}</strong><span>contact rows</span></div>
            <div><strong>{content.categories.length}</strong><span>categories</span></div>
            <div><strong>{content.welcomeTopics.length}</strong><span>welcome topics</span></div>
          </div>
        </motion.div>
      </div>

      <div className="contact-editor-actions-row">
        <button type="button" className="contact-editor-btn contact-editor-btn-secondary" onClick={restoreBackup} disabled={saving}>
          <RefreshCw size={14} /> Restore backup
        </button>
        <button type="button" className="contact-editor-btn contact-editor-btn-danger" onClick={deleteContent} disabled={saving}>
          <Trash2 size={14} /> Delete from DB
        </button>
      </div>

      <section className="contact-editor-section">
        <div className="contact-editor-section-header">
          <div>
            <h4>Hero</h4>
            <p>Top headline and intro copy for Contact page.</p>
          </div>
          <button type="button" className="contact-editor-btn contact-editor-btn-secondary" onClick={() => saveSection('Hero')} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Hero'}
          </button>
        </div>

        <div className="contact-editor-form-grid">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <TextField value={content.hero.eyebrow} onChange={(value) => setContent((current) => ({ ...current, hero: { ...current.hero, eyebrow: value } }))} />
          </div>
          <div>
            <FieldLabel>Title</FieldLabel>
            <TextField value={content.hero.title} onChange={(value) => setContent((current) => ({ ...current, hero: { ...current.hero, title: value } }))} />
          </div>
          <div className="contact-editor-span-2">
            <FieldLabel>Description</FieldLabel>
            <TextArea value={content.hero.description} rows={4} onChange={(value) => setContent((current) => ({ ...current, hero: { ...current.hero, description: value } }))} />
          </div>
        </div>
      </section>

      <section className="contact-editor-section">
        <div className="contact-editor-section-header">
          <div>
            <h4>Contact Info</h4>
            <p>Card list rendered in left panel of Contact page.</p>
          </div>
          <button type="button" className="contact-editor-btn contact-editor-btn-secondary" onClick={() => saveSection('Contact info')} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Contact Info'}
          </button>
        </div>

        <div className="contact-editor-stack">
          {content.contactInfo.map((item, index) => (
            <div key={`${item.label}-${index}`} className="contact-editor-repeat-row">
              <div>
                <FieldLabel>Icon</FieldLabel>
                <select
                  className="contact-editor-select"
                  aria-label="Contact info icon"
                  value={item.iconKey}
                  onChange={(event) => {
                    const iconKey = event.target.value as ContactInfoIconKey
                    setContent((current) => ({
                      ...current,
                      contactInfo: current.contactInfo.map((entry, entryIndex) => (entryIndex === index ? { ...entry, iconKey } : entry)),
                    }))
                  }}
                >
                  {CONTACT_INFO_ICON_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Label</FieldLabel>
                <TextField value={item.label} onChange={(value) => setContent((current) => ({ ...current, contactInfo: current.contactInfo.map((entry, entryIndex) => (entryIndex === index ? { ...entry, label: value } : entry)) }))} />
              </div>
              <div>
                <FieldLabel>Value</FieldLabel>
                <TextField value={item.val} onChange={(value) => setContent((current) => ({ ...current, contactInfo: current.contactInfo.map((entry, entryIndex) => (entryIndex === index ? { ...entry, val: value } : entry)) }))} />
              </div>
              <div>
                <FieldLabel>Href (optional)</FieldLabel>
                <TextField value={item.href || ''} placeholder="mailto: / tel: / https://" onChange={(value) => setContent((current) => ({ ...current, contactInfo: current.contactInfo.map((entry, entryIndex) => (entryIndex === index ? { ...entry, href: value || undefined } : entry)) }))} />
              </div>
              <button
                type="button"
                className="contact-editor-icon-btn"
                title="Remove contact row"
                aria-label="Remove contact row"
                onClick={() => void deleteContactInfoRow(index)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="contact-editor-inline-add"
            onClick={() => {
              setContent((current) => ({
                ...current,
                contactInfo: [
                  ...current.contactInfo,
                  { iconKey: 'mail', label: 'New label', val: 'New value' },
                ],
              }))
            }}
          >
            <Plus size={14} /> Add contact row
          </button>
        </div>
      </section>

      <section className="contact-editor-section">
        <div className="contact-editor-section-header">
          <div>
            <h4>Categories</h4>
            <p>Dropdown options used in inquiry category select.</p>
          </div>
          <button type="button" className="contact-editor-btn contact-editor-btn-secondary" onClick={() => saveSection('Categories')} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Categories'}
          </button>
        </div>

        <FieldLabel>One category per line</FieldLabel>
        <TextArea
          value={content.categories.join('\n')}
          rows={8}
          onChange={(value) => {
            const categories = splitLines(value)
            setContent((current) => ({ ...current, categories: categories.length > 0 ? categories : current.categories }))
          }}
        />
      </section>

      <section className="contact-editor-section">
        <div className="contact-editor-section-header">
          <div>
            <h4>Welcome Topics</h4>
            <p>Quick topic bullets shown below contact info.</p>
          </div>
          <button type="button" className="contact-editor-btn contact-editor-btn-secondary" onClick={() => saveSection('Welcome topics')} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Topics'}
          </button>
        </div>

        <div className="contact-editor-stack">
          {content.welcomeTopics.map((item, index) => (
            <div key={`${item.title}-${index}`} className="contact-editor-repeat-row contact-editor-repeat-row-compact">
              <div>
                <FieldLabel>Icon</FieldLabel>
                <select
                  className="contact-editor-select"
                  aria-label="Welcome topic icon"
                  value={item.iconKey}
                  onChange={(event) => {
                    const iconKey = event.target.value as WelcomeTopicIconKey
                    setContent((current) => ({
                      ...current,
                      welcomeTopics: current.welcomeTopics.map((entry, entryIndex) => (entryIndex === index ? { ...entry, iconKey } : entry)),
                    }))
                  }}
                >
                  {WELCOME_TOPIC_ICON_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextField value={item.title} onChange={(value) => setContent((current) => ({ ...current, welcomeTopics: current.welcomeTopics.map((entry, entryIndex) => (entryIndex === index ? { ...entry, title: value } : entry)) }))} />
              </div>
              <button
                type="button"
                className="contact-editor-icon-btn"
                title="Remove welcome topic"
                aria-label="Remove welcome topic"
                onClick={() => void deleteWelcomeTopicRow(index)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="contact-editor-inline-add"
            onClick={() => {
              setContent((current) => ({
                ...current,
                welcomeTopics: [...current.welcomeTopics, { iconKey: 'flask', title: 'New topic' }],
              }))
            }}
          >
            <Plus size={14} /> Add topic
          </button>
        </div>
      </section>

      <style>{`
        .contact-editor-shell { display: grid; gap: 14px; }
        .contact-editor-banner { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 18px 20px; border-radius: 18px; background: linear-gradient(145deg, #0D1F3C 0%, #17365f 100%); color: #fff; }
        .contact-editor-kicker { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.68); margin-bottom: 8px; }
        .contact-editor-banner h3 { color: #fff; font-size: 20px; margin-bottom: 6px; }
        .contact-editor-banner p { color: rgba(255,255,255,0.82); line-height: 1.6; }
        .contact-editor-banner-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .contact-editor-source { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
        .contact-editor-source-supabase { background: rgba(26,107,72,0.16); color: #8EE0B5; }
        .contact-editor-source-backup, .contact-editor-source-loading { background: rgba(184,135,10,0.16); color: var(--gold-3); }
        .contact-editor-btn { border: none; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; }
        .contact-editor-btn-primary { background: var(--gold); color: #0D1F3C; }
        .contact-editor-btn-secondary { background: rgba(13,31,60,0.08); color: var(--navy); }
        .contact-editor-btn-danger { background: rgba(184,135,10,0.1); color: #7A5500; }
        .contact-editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .contact-editor-card { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.08); }
        .contact-editor-card-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
        .contact-editor-card h4 { font-size: 18px; margin-bottom: 8px; color: var(--navy); }
        .contact-editor-card p { color: var(--ink-3); line-height: 1.7; }
        .contact-editor-quick-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 6px; }
        .contact-editor-quick-list div { background: var(--off); border: 1px solid var(--ink-line); border-radius: 12px; padding: 12px; }
        .contact-editor-quick-list strong { display: block; font-size: 22px; color: var(--navy); }
        .contact-editor-quick-list span { font-size: 12px; color: var(--ink-3); }
        .contact-editor-actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .contact-editor-section { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.06); }
        .contact-editor-section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--ink-line); }
        .contact-editor-section-header h4 { font-size: 18px; color: var(--navy); margin-bottom: 5px; }
        .contact-editor-section-header p { color: var(--ink-3); font-size: 13px; line-height: 1.55; }
        .contact-editor-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .contact-editor-stack { display: grid; gap: 10px; }
        .contact-editor-repeat-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)) auto; gap: 10px; align-items: end; padding: 12px; border-radius: 14px; border: 1px solid var(--ink-line); background: var(--off); }
        .contact-editor-repeat-row-compact { grid-template-columns: minmax(0, 220px) minmax(0, 1fr) auto; }
        .contact-editor-field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px; }
        .contact-editor-input, .contact-editor-select, .contact-editor-textarea { width: 100%; border: 1px solid var(--ink-line); border-radius: 10px; padding: 11px 12px; background: #fff; color: var(--ink); font-size: 13px; }
        .contact-editor-textarea { resize: vertical; min-height: 44px; }
        .contact-editor-inline-add, .contact-editor-icon-btn { border: 1px dashed var(--gold-border); background: rgba(184,135,10,0.07); color: var(--gold); border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; justify-content: center; }
        .contact-editor-icon-btn { border-style: solid; padding: 0; width: 40px; height: 40px; }
        .contact-editor-span-2 { grid-column: span 2; }
        @media (max-width: 980px) { .contact-editor-grid, .contact-editor-form-grid { grid-template-columns: 1fr; } .contact-editor-span-2 { grid-column: span 1; } .contact-editor-repeat-row { grid-template-columns: repeat(2, minmax(0, 1fr)); } .contact-editor-repeat-row-compact { grid-template-columns: 1fr; } .contact-editor-quick-list { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .contact-editor-banner { flex-direction: column; align-items: flex-start; } .contact-editor-repeat-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
