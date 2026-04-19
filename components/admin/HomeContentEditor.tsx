'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CloudOff,
  CopyPlus,
  Database,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react'

import {
  HOME_ICON_OPTIONS,
  HOME_SECTION_KEYS,
  HOME_SECTION_META,
  STATIC_HOME_CONTENT,
  createDefaultCredential,
  createDefaultExpertiseItem,
  createDefaultIpItem,
  createDefaultPublication,
  createDefaultStat,
  createDefaultTeachingStat,
  normalizeHomeContent,
  type HomeContentRaw,
  type HomeIconKey,
  type HomeSectionKey,
} from '@/lib/homeContent'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<HomeContentRaw>
  message?: string
  supabase?: {
    url?: boolean
    publicKey?: boolean
    serviceKey?: boolean
  }
}

type ProfileImageApiState = {
  ok?: boolean
  message?: string
  imageUrl?: string
  idCard?: HomeContentRaw['idCard']
}

const SECTION_ORDER = HOME_SECTION_KEYS

const alertTheme = {
  success: { confirmButtonColor: '#0D1F3C', iconColor: '#1A6B48' },
  error: { confirmButtonColor: '#B8870A', iconColor: '#B8870A' },
  info: { confirmButtonColor: '#0D1F3C', iconColor: '#2D5B8A' },
}

const joinLines = (items: string[]) => items.join('\n')
const splitLines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)

const getSectionKeyLabel = (sectionKey: HomeSectionKey) => HOME_SECTION_META[sectionKey].label

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="home-editor-field-label">{children}</p>
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
  return <input className="home-editor-input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} />
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
  return <textarea className="home-editor-textarea" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} />
}

function IconSelect({ value, onChange }: { value: HomeIconKey; onChange: (value: HomeIconKey) => void }) {
  return (
    <select className="home-editor-select" value={value} onChange={(event) => onChange(event.target.value as HomeIconKey)} aria-label="Icon selector">
      {HOME_ICON_OPTIONS.map((option) => (
        <option key={option.key} value={option.key}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function SectionActions({
  saving,
  onSave,
  onRestore,
  onDelete,
}: {
  saving: boolean
  onSave: () => void
  onRestore: () => void
  onDelete: () => void
}) {
  return (
    <div className="home-editor-actions">
      <button type="button" className="home-editor-btn home-editor-btn-primary" onClick={onSave} disabled={saving}>
        <Save size={14} /> {saving ? 'Saving...' : 'Save section'}
      </button>
      <button type="button" className="home-editor-btn home-editor-btn-secondary" onClick={onRestore} disabled={saving}>
        <RefreshCw size={14} /> Restore backup
      </button>
      <button type="button" className="home-editor-btn home-editor-btn-danger" onClick={onDelete} disabled={saving}>
        <Trash2 size={14} /> Delete from DB
      </button>
    </div>
  )
}

export default function HomeContentEditor() {
  const [content, setContent] = useState<HomeContentRaw>(STATIC_HOME_CONTENT)
  const [source, setSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [statusMessage, setStatusMessage] = useState<string>('Loading content...')
  const [savingSection, setSavingSection] = useState<HomeSectionKey | 'all' | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/home-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeHomeContent(payload.content || STATIC_HOME_CONTENT))
        setSource(payload.source || 'backup')
        if (payload.supabase && payload.supabase.serviceKey === false) {
          setStatusMessage('Read is working, but save is disabled: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local.')
        } else {
          setStatusMessage(payload.source === 'supabase' ? 'Supabase content loaded successfully.' : payload.message || 'Backup content is active.')
        }
      } catch {
        if (!active) {
          return
        }

        setContent(STATIC_HOME_CONTENT)
        setSource('backup')
        setStatusMessage('Backup content is active.')
      }
    }

    loadContent()

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

  const setSection = <K extends HomeSectionKey>(sectionKey: K, nextValue: HomeContentRaw[K]) => {
    setContent((previous) => ({
      ...previous,
      [sectionKey]: nextValue,
    }))
  }

  const updateSection = <K extends HomeSectionKey>(sectionKey: K, updater: (value: HomeContentRaw[K]) => HomeContentRaw[K]) => {
    setContent((previous) => ({
      ...previous,
      [sectionKey]: updater(previous[sectionKey]),
    }))
  }

  const saveSection = async <K extends HomeSectionKey>(sectionKey: K) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/home-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: content[sectionKey] } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[home-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeHomeContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Section saved to Supabase.')
      await showAlert('success', 'Saved', `${getSectionKeyLabel(sectionKey)} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the content API.')
    } finally {
      setSavingSection(null)
    }
  }

  const restoreSection = async <K extends HomeSectionKey>(sectionKey: K) => {
    const nextValue = STATIC_HOME_CONTENT[sectionKey]
    setSection(sectionKey, nextValue)
    await saveSectionWithValue(sectionKey, nextValue)
  }

  const saveSectionWithValue = async <K extends HomeSectionKey>(sectionKey: K, sectionValue: HomeContentRaw[K]) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/home-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: sectionValue } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[home-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeHomeContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Section saved to Supabase.')
      await showAlert('success', 'Saved', `${getSectionKeyLabel(sectionKey)} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the content API.')
    } finally {
      setSavingSection(null)
    }
  }

  const saveCurrentSection = async <K extends HomeSectionKey>(sectionKey: K) => {
    await saveSectionWithValue(sectionKey, content[sectionKey])
  }

  const deleteSection = async <K extends HomeSectionKey>(sectionKey: K) => {
    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: `Delete ${getSectionKeyLabel(sectionKey)} from Supabase?`,
      text: 'The public page will fall back to the backup file for this section.',
      showCancelButton: true,
      confirmButtonText: 'Delete remote override',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B8870A',
      cancelButtonColor: '#0D1F3C',
      background: '#FFFFFF',
      color: '#0F172A',
    })

    if (!confirm.isConfirmed) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/home-content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[home-editor] Delete failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Delete failed', payload.message || 'Unable to remove the section override.')
        return
      }

      setContent(normalizeHomeContent(payload.content || STATIC_HOME_CONTENT))
      setSource('backup')
      setStatusMessage('Remote override removed. Backup content is active.')
      await showAlert('success', 'Deleted', `${getSectionKeyLabel(sectionKey)} now uses the backup file.`)
    } catch {
      await showAlert('error', 'Delete failed', 'Unable to reach the content API.')
    } finally {
      setSavingSection(null)
    }
  }

  const syncAll = async () => {
    if (savingSection) {
      return
    }

    setSavingSection('all')
    try {
      const response = await fetch('/api/home-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-all', content }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[home-editor] Sync failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Sync failed', payload.message || 'Unable to sync the full home content.')
        return
      }

      setContent(normalizeHomeContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('All sections synced to Supabase.')
      await showAlert('success', 'Synced', 'The full home content has been uploaded to Supabase.')
    } catch {
      await showAlert('error', 'Sync failed', 'Unable to reach the content API.')
    } finally {
      setSavingSection(null)
    }
  }

  const uploadIdCardImage = async (file: File) => {
    if (uploadingImage || savingSection) {
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/home-content/profile-image', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as ProfileImageApiState
      if (!response.ok || !payload.ok || !payload.idCard) {
        console.error('[home-editor] Image upload failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Upload failed', payload.message || 'Unable to upload profile image.')
        return
      }

      setSection('idCard', payload.idCard)
      setSource('supabase')
      setStatusMessage('Profile image uploaded and saved to Supabase.')
      await showAlert('success', 'Uploaded', payload.message || 'Profile image updated successfully.')
    } catch {
      await showAlert('error', 'Upload failed', 'Unable to reach the profile image API.')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeIdCardImage = async () => {
    if (uploadingImage || savingSection) {
      return
    }

    setUploadingImage(true)
    try {
      const response = await fetch('/api/home-content/profile-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: content.idCard.imageUrl || '' }),
      })

      const payload = (await response.json()) as ProfileImageApiState
      if (!response.ok || !payload.ok || !payload.idCard) {
        console.error('[home-editor] Image remove failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Remove failed', payload.message || 'Unable to remove profile image.')
        return
      }

      setSection('idCard', payload.idCard)
      setSource('supabase')
      setStatusMessage('Profile image removed. Local backup image is active.')
      await showAlert('success', 'Removed', payload.message || 'Profile image removed.')
    } catch {
      await showAlert('error', 'Remove failed', 'Unable to reach the profile image API.')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="home-editor-shell">
      <div className="home-editor-banner">
        <div>
          <p className="home-editor-banner-kicker">Home Content Manager</p>
          <h3>Supabase first, backup file always available</h3>
          <p>{statusMessage}</p>
        </div>

        <div className="home-editor-banner-actions">
          <div className={`home-editor-source home-editor-source-${source}`}>
            {source === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
            <span>{source === 'supabase' ? 'Supabase live' : 'Backup active'}</span>
          </div>
          <button type="button" className="home-editor-btn home-editor-btn-primary" onClick={syncAll} disabled={savingSection === 'all'}>
            <CopyPlus size={14} /> {savingSection === 'all' ? 'Uploading...' : 'Sync all sections'}
          </button>
        </div>
      </div>

      <div className="home-editor-grid">
        <motion.div className="home-editor-card home-editor-card-callout" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="home-editor-card-kicker">
            <Shield size={13} /> Backup strategy
          </p>
          <h4>Public home page always falls back to the static `.ts` file.</h4>
          <p>Deleting a section row only removes the Supabase override. The website renders from the bundled content when the DB is missing, offline, or incomplete.</p>
        </motion.div>

        <motion.div className="home-editor-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.04 }}>
          <p className="home-editor-card-kicker">
            <Sparkles size={13} /> Quick facts
          </p>
          <div className="home-editor-quick-list">
            <div><strong>{SECTION_ORDER.length}</strong><span>sections tracked</span></div>
            <div><strong>{content.stats.length}</strong><span>hero metrics</span></div>
            <div><strong>{content.publications.length}</strong><span>publications</span></div>
            <div><strong>{content.expertise.length}</strong><span>expertise cards</span></div>
          </div>
        </motion.div>
      </div>

      <div className="home-editor-sections">
        {SECTION_ORDER.map((sectionKey, index) => (
          <motion.details key={sectionKey} className="home-editor-section" open={index < 2} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: index * 0.02 }}>
            <summary className="home-editor-section-summary">
              <div>
                <p className="home-editor-section-kicker">{HOME_SECTION_META[sectionKey].label}</p>
                <h4>{HOME_SECTION_META[sectionKey].description}</h4>
              </div>
              <div className="home-editor-section-meta">
                <span>{sectionKey}</span>
              </div>
            </summary>

            <div className="home-editor-section-body">
              {sectionKey === 'hero' && (
                <div className="home-editor-form-grid">
                  <div>
                    <FieldLabel>Badge</FieldLabel>
                    <TextField value={content.hero.badge} onChange={(value) => setSection('hero', { ...content.hero, badge: value })} />
                  </div>
                  <div>
                    <FieldLabel>Role</FieldLabel>
                    <TextField value={content.hero.role} onChange={(value) => setSection('hero', { ...content.hero, role: value })} />
                  </div>
                  <div>
                    <FieldLabel>First name</FieldLabel>
                    <TextField value={content.hero.firstName} onChange={(value) => setSection('hero', { ...content.hero, firstName: value })} />
                  </div>
                  <div>
                    <FieldLabel>Last name</FieldLabel>
                    <TextField value={content.hero.lastName} onChange={(value) => setSection('hero', { ...content.hero, lastName: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Tagline</FieldLabel>
                    <TextArea value={content.hero.tagline} onChange={(value) => setSection('hero', { ...content.hero, tagline: value })} rows={4} />
                  </div>
                  <div>
                    <FieldLabel>Location</FieldLabel>
                    <TextField value={content.hero.location} onChange={(value) => setSection('hero', { ...content.hero, location: value })} />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <TextField value={content.hero.email} onChange={(value) => setSection('hero', { ...content.hero, email: value })} type="email" />
                  </div>
                  <div>
                    <FieldLabel>Research CTA</FieldLabel>
                    <TextField value={content.hero.ctaResearch} onChange={(value) => setSection('hero', { ...content.hero, ctaResearch: value })} />
                  </div>
                  <div>
                    <FieldLabel>Contact CTA</FieldLabel>
                    <TextField value={content.hero.ctaContact} onChange={(value) => setSection('hero', { ...content.hero, ctaContact: value })} />
                  </div>
                </div>
              )}

              {sectionKey === 'idCard' && (
                <div className="home-editor-form-grid">
                  <div className="home-editor-span-2">
                    <FieldLabel>Profile image (Supabase Storage)</FieldLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <img
                        src={content.idCard.imageUrl || '/Profile_pic/SBT_Profile.jpg'}
                        alt="Profile preview"
                        style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(13,31,60,0.12)' }}
                      />
                      <label className="home-editor-btn home-editor-btn-secondary" style={{ cursor: uploadingImage ? 'not-allowed' : 'pointer', opacity: uploadingImage ? 0.65 : 1 }}>
                        {uploadingImage ? 'Uploading...' : 'Upload image'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          style={{ display: 'none' }}
                          disabled={uploadingImage || Boolean(savingSection)}
                          onChange={async (event) => {
                            const file = event.target.files?.[0]
                            event.currentTarget.value = ''
                            if (!file) {
                              return
                            }
                            await uploadIdCardImage(file)
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="home-editor-btn home-editor-btn-danger"
                        onClick={removeIdCardImage}
                        disabled={uploadingImage || !content.idCard.imageUrl}
                      >
                        {uploadingImage ? 'Working...' : 'Remove uploaded image'}
                      </button>
                    </div>
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Image URL</FieldLabel>
                    <TextField value={content.idCard.imageUrl || ''} onChange={(value) => setSection('idCard', { ...content.idCard, imageUrl: value })} placeholder="https://..." />
                  </div>
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <TextField value={content.idCard.name} onChange={(value) => setSection('idCard', { ...content.idCard, name: value })} />
                  </div>
                  <div>
                    <FieldLabel>Initials</FieldLabel>
                    <TextField value={content.idCard.initials} onChange={(value) => setSection('idCard', { ...content.idCard, initials: value })} />
                  </div>
                  <div>
                    <FieldLabel>Degree</FieldLabel>
                    <TextField value={content.idCard.degree} onChange={(value) => setSection('idCard', { ...content.idCard, degree: value })} />
                  </div>
                  <div>
                    <FieldLabel>Field</FieldLabel>
                    <TextField value={content.idCard.field} onChange={(value) => setSection('idCard', { ...content.idCard, field: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Thesis</FieldLabel>
                    <TextArea value={content.idCard.thesis} onChange={(value) => setSection('idCard', { ...content.idCard, thesis: value })} rows={3} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Tagline</FieldLabel>
                    <TextField value={content.idCard.tagline} onChange={(value) => setSection('idCard', { ...content.idCard, tagline: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Skills</FieldLabel>
                    <TextArea value={joinLines(content.idCard.skills)} onChange={(value) => setSection('idCard', { ...content.idCard, skills: splitLines(value) })} rows={4} />
                  </div>
                </div>
              )}

              {sectionKey === 'stats' && (
                <div className="home-editor-stack">
                  {content.stats.map((stat, index) => (
                    <div key={`${stat.l}-${index}`} className="home-editor-repeat-row">
                      <div>
                        <FieldLabel>Value</FieldLabel>
                        <TextField value={stat.n} onChange={(value) => updateSection('stats', (items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, n: value } : item)))} />
                      </div>
                      <div>
                        <FieldLabel>Label</FieldLabel>
                        <TextField value={stat.l} onChange={(value) => updateSection('stats', (items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, l: value } : item)))} />
                      </div>
                      <div>
                        <FieldLabel>Subtext</FieldLabel>
                        <TextField value={stat.s} onChange={(value) => updateSection('stats', (items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, s: value } : item)))} />
                      </div>
                      <button type="button" className="home-editor-icon-btn" aria-label="Remove stat row" title="Remove stat row" onClick={() => updateSection('stats', (items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <button type="button" className="home-editor-inline-add" onClick={() => updateSection('stats', (items) => [...items, createDefaultStat()])}>
                    <Plus size={14} /> Add stat
                  </button>
                </div>
              )}

              {sectionKey === 'phd' && (
                <div className="home-editor-form-grid">
                  <div>
                    <FieldLabel>Label</FieldLabel>
                    <TextField value={content.phd.label} onChange={(value) => setSection('phd', { ...content.phd, label: value })} />
                  </div>
                  <div>
                    <FieldLabel>Degree</FieldLabel>
                    <TextField value={content.phd.degree} onChange={(value) => setSection('phd', { ...content.phd, degree: value })} />
                  </div>
                  <div>
                    <FieldLabel>Awarded year</FieldLabel>
                    <TextField value={content.phd.awardedYear} onChange={(value) => setSection('phd', { ...content.phd, awardedYear: value })} />
                  </div>
                  <div>
                    <FieldLabel>Institution</FieldLabel>
                    <TextField value={content.phd.institution} onChange={(value) => setSection('phd', { ...content.phd, institution: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Thesis</FieldLabel>
                    <TextArea value={content.phd.thesis} onChange={(value) => setSection('phd', { ...content.phd, thesis: value })} rows={3} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Description</FieldLabel>
                    <TextArea value={content.phd.description} onChange={(value) => setSection('phd', { ...content.phd, description: value })} rows={4} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Tags</FieldLabel>
                    <TextArea value={joinLines(content.phd.tags)} onChange={(value) => setSection('phd', { ...content.phd, tags: splitLines(value) })} rows={3} />
                  </div>
                </div>
              )}

              {sectionKey === 'about' && (
                <div className="home-editor-form-grid">
                  <div>
                    <FieldLabel>Label</FieldLabel>
                    <TextField value={content.about.label} onChange={(value) => setSection('about', { ...content.about, label: value })} />
                  </div>
                  <div>
                    <FieldLabel>CTA</FieldLabel>
                    <TextField value={content.about.cta} onChange={(value) => setSection('about', { ...content.about, cta: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Heading</FieldLabel>
                    <TextField value={content.about.heading} onChange={(value) => setSection('about', { ...content.about, heading: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Italic heading</FieldLabel>
                    <TextField value={content.about.headingItalic} onChange={(value) => setSection('about', { ...content.about, headingItalic: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Body 1</FieldLabel>
                    <TextArea value={content.about.body1} onChange={(value) => setSection('about', { ...content.about, body1: value })} rows={4} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Body 2</FieldLabel>
                    <TextArea value={content.about.body2} onChange={(value) => setSection('about', { ...content.about, body2: value })} rows={4} />
                  </div>
                </div>
              )}

              {sectionKey === 'credentials' && (
                <div className="home-editor-stack">
                  {content.credentials.map((credential, index) => (
                    <div key={`${credential.t}-${index}`} className="home-editor-repeat-row home-editor-repeat-row-wide">
                      <div>
                        <FieldLabel>Title</FieldLabel>
                        <TextField value={credential.t} onChange={(value) => updateSection('credentials', (items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, t: value } : item)))} />
                      </div>
                      <div>
                        <FieldLabel>Description</FieldLabel>
                        <TextArea value={credential.d} onChange={(value) => updateSection('credentials', (items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, d: value } : item)))} rows={3} />
                      </div>
                      <button type="button" className="home-editor-icon-btn" aria-label="Remove credential row" title="Remove credential row" onClick={() => updateSection('credentials', (items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <button type="button" className="home-editor-inline-add" onClick={() => updateSection('credentials', (items) => [...items, createDefaultCredential()])}>
                    <Plus size={14} /> Add credential
                  </button>
                </div>
              )}

              {sectionKey === 'expertise' && (
                <div className="home-editor-stack">
                  {content.expertise.map((item, index) => (
                    <div key={`${item.label}-${index}`} className="home-editor-repeat-grid">
                      <div>
                        <FieldLabel>Label</FieldLabel>
                        <TextField value={item.label} onChange={(value) => updateSection('expertise', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, label: value } : entry)))} />
                      </div>
                      <div>
                        <FieldLabel>Icon</FieldLabel>
                        <IconSelect value={item.iconKey} onChange={(value) => updateSection('expertise', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, iconKey: value } : entry)))} />
                      </div>
                      <div>
                        <FieldLabel>Color</FieldLabel>
                        <TextField value={item.color} onChange={(value) => updateSection('expertise', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, color: value } : entry)))} />
                      </div>
                      <div>
                        <FieldLabel>Background</FieldLabel>
                        <TextField value={item.bg} onChange={(value) => updateSection('expertise', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, bg: value } : entry)))} />
                      </div>
                      <div>
                        <FieldLabel>Border</FieldLabel>
                        <TextField value={item.border} onChange={(value) => updateSection('expertise', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, border: value } : entry)))} />
                      </div>
                      <div>
                        <FieldLabel>Support text</FieldLabel>
                        <TextArea value={item.sub} onChange={(value) => updateSection('expertise', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, sub: value } : entry)))} rows={3} />
                      </div>
                      <button type="button" className="home-editor-icon-btn home-editor-icon-btn-right" aria-label="Remove expertise row" title="Remove expertise row" onClick={() => updateSection('expertise', (items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <button type="button" className="home-editor-inline-add" onClick={() => updateSection('expertise', (items) => [...items, createDefaultExpertiseItem()])}>
                    <Plus size={14} /> Add expertise
                  </button>
                </div>
              )}

              {sectionKey === 'publications' && (
                <div className="home-editor-stack">
                  {content.publications.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="home-editor-repeat-row home-editor-repeat-row-wide">
                      <div>
                        <FieldLabel>Tag</FieldLabel>
                        <TextField value={item.tag} onChange={(value) => updateSection('publications', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, tag: value } : entry)))} />
                      </div>
                      <div>
                        <FieldLabel>Color</FieldLabel>
                        <TextField value={item.color} onChange={(value) => updateSection('publications', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, color: value } : entry)))} />
                      </div>
                      <div className="home-editor-span-2">
                        <FieldLabel>Title</FieldLabel>
                        <TextField value={item.title} onChange={(value) => updateSection('publications', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, title: value } : entry)))} />
                      </div>
                      <div className="home-editor-span-2">
                        <FieldLabel>Info</FieldLabel>
                        <TextArea value={item.info} onChange={(value) => updateSection('publications', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, info: value } : entry)))} rows={3} />
                      </div>
                      <button type="button" className="home-editor-icon-btn" aria-label="Remove publication row" title="Remove publication row" onClick={() => updateSection('publications', (items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <button type="button" className="home-editor-inline-add" onClick={() => updateSection('publications', (items) => [...items, createDefaultPublication()])}>
                    <Plus size={14} /> Add publication
                  </button>
                </div>
              )}

              {sectionKey === 'ipItems' && (
                <div className="home-editor-stack">
                  {content.ipItems.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="home-editor-repeat-grid">
                      <div>
                        <FieldLabel>Tag</FieldLabel>
                        <TextField value={item.tag} onChange={(value) => updateSection('ipItems', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, tag: value } : entry)))} />
                      </div>
                      <div>
                        <FieldLabel>Icon</FieldLabel>
                        <IconSelect value={item.iconKey} onChange={(value) => updateSection('ipItems', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, iconKey: value } : entry)))} />
                      </div>
                      <div>
                        <FieldLabel>Color</FieldLabel>
                        <TextField value={item.iconColor} onChange={(value) => updateSection('ipItems', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, iconColor: value } : entry)))} />
                      </div>
                      <div className="home-editor-span-2">
                        <FieldLabel>Title</FieldLabel>
                        <TextField value={item.title} onChange={(value) => updateSection('ipItems', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, title: value } : entry)))} />
                      </div>
                      <div className="home-editor-span-2">
                        <FieldLabel>Detail</FieldLabel>
                        <TextArea value={item.detail} onChange={(value) => updateSection('ipItems', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, detail: value } : entry)))} rows={3} />
                      </div>
                      <div className="home-editor-span-2">
                        <FieldLabel>Link</FieldLabel>
                        <TextField value={item.href} onChange={(value) => updateSection('ipItems', (items) => items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, href: value } : entry)))} />
                      </div>
                      <button type="button" className="home-editor-icon-btn home-editor-icon-btn-right" aria-label="Remove IP row" title="Remove IP row" onClick={() => updateSection('ipItems', (items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <button type="button" className="home-editor-inline-add" onClick={() => updateSection('ipItems', (items) => [...items, createDefaultIpItem()])}>
                    <Plus size={14} /> Add IP item
                  </button>
                </div>
              )}

              {sectionKey === 'teaching' && (
                <div className="home-editor-form-grid">
                  <div className="home-editor-span-2">
                    <FieldLabel>Quote</FieldLabel>
                    <TextArea value={content.teaching.quote} onChange={(value) => setSection('teaching', { ...content.teaching, quote: value })} rows={3} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Body</FieldLabel>
                    <TextArea value={content.teaching.body} onChange={(value) => setSection('teaching', { ...content.teaching, body: value })} rows={4} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Subjects</FieldLabel>
                    <TextArea value={joinLines(content.teaching.subjects)} onChange={(value) => setSection('teaching', { ...content.teaching, subjects: splitLines(value) })} rows={4} />
                  </div>
                  <div>
                    <FieldLabel>CTA</FieldLabel>
                    <TextField value={content.teaching.cta} onChange={(value) => setSection('teaching', { ...content.teaching, cta: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Teaching stats</FieldLabel>
                    <div className="home-editor-stack">
                      {content.teaching.stats.map((item, index) => (
                        <div key={`${item.l}-${index}`} className="home-editor-repeat-grid">
                          <div>
                            <FieldLabel>Icon</FieldLabel>
                            <IconSelect value={item.iconKey} onChange={(value) => updateSection('teaching', (section) => ({ ...section, stats: section.stats.map((entry, itemIndex) => (itemIndex === index ? { ...entry, iconKey: value } : entry)) }))} />
                          </div>
                          <div>
                            <FieldLabel>Value</FieldLabel>
                            <TextField value={item.v} onChange={(value) => updateSection('teaching', (section) => ({ ...section, stats: section.stats.map((entry, itemIndex) => (itemIndex === index ? { ...entry, v: value } : entry)) }))} />
                          </div>
                          <div>
                            <FieldLabel>Label</FieldLabel>
                            <TextField value={item.l} onChange={(value) => updateSection('teaching', (section) => ({ ...section, stats: section.stats.map((entry, itemIndex) => (itemIndex === index ? { ...entry, l: value } : entry)) }))} />
                          </div>
                          <button type="button" className="home-editor-icon-btn home-editor-icon-btn-right" aria-label="Remove teaching stat row" title="Remove teaching stat row" onClick={() => updateSection('teaching', (section) => ({ ...section, stats: section.stats.filter((_, itemIndex) => itemIndex !== index) }))}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}

                      <button type="button" className="home-editor-inline-add" onClick={() => updateSection('teaching', (section) => ({ ...section, stats: [...section.stats, createDefaultTeachingStat()] }))}>
                        <Plus size={14} /> Add teaching stat
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {sectionKey === 'cta' && (
                <div className="home-editor-form-grid">
                  <div>
                    <FieldLabel>Label</FieldLabel>
                    <TextField value={content.cta.label} onChange={(value) => setSection('cta', { ...content.cta, label: value })} />
                  </div>
                  <div>
                    <FieldLabel>Primary label</FieldLabel>
                    <TextField value={content.cta.btnPrimary.label} onChange={(value) => setSection('cta', { ...content.cta, btnPrimary: { ...content.cta.btnPrimary, label: value } })} />
                  </div>
                  <div>
                    <FieldLabel>Primary href</FieldLabel>
                    <TextField value={content.cta.btnPrimary.href} onChange={(value) => setSection('cta', { ...content.cta, btnPrimary: { ...content.cta.btnPrimary, href: value } })} />
                  </div>
                  <div>
                    <FieldLabel>Secondary label</FieldLabel>
                    <TextField value={content.cta.btnSecondary.label} onChange={(value) => setSection('cta', { ...content.cta, btnSecondary: { ...content.cta.btnSecondary, label: value } })} />
                  </div>
                  <div>
                    <FieldLabel>Secondary href</FieldLabel>
                    <TextField value={content.cta.btnSecondary.href} onChange={(value) => setSection('cta', { ...content.cta, btnSecondary: { ...content.cta.btnSecondary, href: value } })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Heading</FieldLabel>
                    <TextField value={content.cta.heading} onChange={(value) => setSection('cta', { ...content.cta, heading: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Italic heading</FieldLabel>
                    <TextField value={content.cta.headingItalic} onChange={(value) => setSection('cta', { ...content.cta, headingItalic: value })} />
                  </div>
                  <div className="home-editor-span-2">
                    <FieldLabel>Body</FieldLabel>
                    <TextArea value={content.cta.body} onChange={(value) => setSection('cta', { ...content.cta, body: value })} rows={4} />
                  </div>
                </div>
              )}

              {sectionKey === 'stats' || sectionKey === 'credentials' || sectionKey === 'expertise' || sectionKey === 'publications' || sectionKey === 'ipItems' || sectionKey === 'teaching' ? null : null}

              <SectionActions
                saving={savingSection === sectionKey}
                onSave={() => saveCurrentSection(sectionKey)}
                onRestore={() => restoreSection(sectionKey)}
                onDelete={() => deleteSection(sectionKey)}
              />

              {(sectionKey === 'stats' || sectionKey === 'credentials' || sectionKey === 'expertise' || sectionKey === 'publications' || sectionKey === 'ipItems' || sectionKey === 'teaching') && (
                <div className="home-editor-note">
                  <AlertTriangle size={13} /> Changes are saved per section. Array rows can be added or removed before saving.
                </div>
              )}
            </div>
          </motion.details>
        ))}
      </div>

      <style>{`
        .home-editor-shell {
          display: grid;
          gap: 16px;
        }

        .home-editor-banner,
        .home-editor-card,
        .home-editor-section {
          border-radius: 18px;
          border: 1px solid var(--ink-line);
          background: #fff;
          box-shadow: 0 12px 30px rgba(13,31,60,0.08);
        }

        .home-editor-banner {
          padding: 16px 18px;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: center;
        }

        .home-editor-banner-kicker,
        .home-editor-card-kicker,
        .home-editor-section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--gold);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .home-editor-banner h3 {
          font-size: 22px;
          margin-bottom: 5px;
        }

        .home-editor-banner p,
        .home-editor-card p {
          color: var(--ink-3);
          line-height: 1.7;
        }

        .home-editor-banner-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .home-editor-source {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .home-editor-source-supabase {
          color: #1A6B48;
          background: rgba(26,107,72,0.08);
          border: 1px solid rgba(26,107,72,0.20);
        }

        .home-editor-source-backup {
          color: #7A5500;
          background: rgba(184,135,10,0.08);
          border: 1px solid rgba(184,135,10,0.20);
        }

        .home-editor-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .home-editor-card {
          padding: 16px;
        }

        .home-editor-card-callout {
          background: linear-gradient(180deg, #fff 0%, #f9fbff 100%);
        }

        .home-editor-quick-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .home-editor-quick-list div {
          border-radius: 12px;
          background: var(--off);
          border: 1px solid var(--ink-line);
          padding: 12px;
        }

        .home-editor-quick-list strong {
          display: block;
          font-size: 20px;
          color: var(--navy);
          margin-bottom: 2px;
        }

        .home-editor-quick-list span {
          font-size: 12px;
          color: var(--ink-3);
        }

        .home-editor-sections {
          display: grid;
          gap: 12px;
        }

        .home-editor-section {
          overflow: hidden;
        }

        .home-editor-section summary {
          list-style: none;
          cursor: pointer;
        }

        .home-editor-section summary::-webkit-details-marker {
          display: none;
        }

        .home-editor-section-summary {
          padding: 16px 18px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          background: linear-gradient(180deg, #fff 0%, #fbfdff 100%);
          border-bottom: 1px solid var(--ink-line);
        }

        .home-editor-section-summary h4 {
          font-size: 18px;
          margin-bottom: 3px;
        }

        .home-editor-section-meta {
          border-radius: 999px;
          padding: 7px 10px;
          background: var(--gold-pale);
          border: 1px solid var(--gold-border);
          color: var(--gold);
          font-size: 11px;
          font-weight: 700;
        }

        .home-editor-section-body {
          padding: 16px 18px 18px;
          display: grid;
          gap: 14px;
        }

        .home-editor-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .home-editor-span-2 {
          grid-column: span 2;
        }

        .home-editor-stack {
          display: grid;
          gap: 10px;
        }

        .home-editor-repeat-row,
        .home-editor-repeat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
          gap: 10px;
          align-items: end;
          padding: 12px;
          border-radius: 14px;
          background: var(--off);
          border: 1px solid var(--ink-line);
        }

        .home-editor-repeat-row-wide {
          grid-template-columns: 1fr 1fr auto;
        }

        .home-editor-repeat-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) repeat(2, minmax(0, 1fr)) auto;
        }

        .home-editor-field-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--ink-4);
          margin-bottom: 6px;
        }

        .home-editor-input,
        .home-editor-textarea {
          width: 100%;
          border-radius: 12px;
          border: 1px solid var(--ink-line);
          background: #fff;
          color: var(--ink);
          padding: 10px 12px;
          font-size: 13px;
          outline: none;
        }

        .home-editor-textarea {
          resize: vertical;
          min-height: 92px;
        }

        .home-editor-select {
          width: 100%;
          border-radius: 12px;
          border: 1px solid var(--ink-line);
          background: #fff;
          color: var(--ink);
          padding: 10px 12px;
          font-size: 13px;
          outline: none;
        }

        .home-editor-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .home-editor-btn,
        .home-editor-inline-add,
        .home-editor-icon-btn {
          border-radius: 10px;
          border: 1px solid transparent;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
          text-decoration: none;
        }

        .home-editor-btn-primary {
          background: var(--navy);
          border-color: var(--navy);
          color: #fff;
        }

        .home-editor-btn-secondary {
          background: #fff;
          border-color: var(--ink-line);
          color: var(--ink);
        }

        .home-editor-btn-danger {
          background: rgba(186,35,35,0.06);
          border-color: rgba(186,35,35,0.18);
          color: #8A1E1E;
        }

        .home-editor-inline-add {
          width: fit-content;
          background: var(--gold-pale);
          border-color: var(--gold-border);
          color: var(--gold);
        }

        .home-editor-icon-btn {
          width: 42px;
          height: 42px;
          padding: 0;
          background: #fff;
          border-color: var(--ink-line);
          color: var(--ink-3);
        }

        .home-editor-icon-btn-right {
          margin-left: auto;
        }

        .home-editor-note {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(184,135,10,0.08);
          border: 1px solid rgba(184,135,10,0.18);
          color: #7A5500;
          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 1120px) {
          .home-editor-grid,
          .home-editor-form-grid {
            grid-template-columns: 1fr;
          }

          .home-editor-span-2 {
            grid-column: auto;
          }

          .home-editor-repeat-row,
          .home-editor-repeat-grid,
          .home-editor-repeat-row-wide {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}