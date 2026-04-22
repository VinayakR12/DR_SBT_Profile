'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CloudOff, Database, Plus, RefreshCw, Save, Shield, Sparkles, Trash2, Upload } from 'lucide-react'

import {
  STATIC_ABOUT_CONTENT,
  normalizeAboutContent,
  type AboutContentRaw,
  type AboutEducationItem,
  type AboutResearchArea,
  type AboutMilestone,
  type AboutGlanceItem,
} from '@/lib/aboutContent'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<AboutContentRaw>
  message?: string
  supabase?: {
    url?: boolean
    publicKey?: boolean
    serviceKey?: boolean
  }
}

type AboutImageApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  message?: string
  imageUrl?: string
  content?: Partial<AboutContentRaw>
}

const alertTheme = {
  success: { confirmButtonColor: '#0D1F3C', iconColor: '#1A6B48' },
  error: { confirmButtonColor: '#B8870A', iconColor: '#B8870A' },
  info: { confirmButtonColor: '#0D1F3C', iconColor: '#2D5B8A' },
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="about-editor-field-label">{children}</p>
}

function TextField({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input className="about-editor-input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className="about-editor-textarea" value={value} placeholder={placeholder} rows={rows} onChange={(event) => onChange(event.target.value)} />
}

function RepeatRow({ children }: { children: ReactNode }) {
  return <div className="about-editor-repeat-row">{children}</div>
}

function SectionHeader({
  title,
  description,
  saving,
  onSave,
}: {
  title: string
  description: string
  saving: boolean
  onSave: () => void
}) {
  return (
    <div className="about-editor-section-header">
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <button type="button" className="about-editor-btn about-editor-btn-secondary" onClick={onSave} disabled={saving}>
        <Save size={14} /> {saving ? 'Saving...' : 'Save section'}
      </button>
    </div>
  )
}

export default function AboutContentEditor() {
  const [content, setContent] = useState<AboutContentRaw>(() => normalizeAboutContent(STATIC_ABOUT_CONTENT))
  const [source, setSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [statusMessage, setStatusMessage] = useState('Loading about content...')
  const [saving, setSaving] = useState(false)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/about-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeAboutContent(payload.content || STATIC_ABOUT_CONTENT))
        setSource(payload.source || 'backup')
        setStatusMessage(payload.source === 'supabase' ? 'About content loaded from Supabase.' : payload.message || 'Backup content is active.')
      } catch {
        if (!active) {
          return
        }

        setContent(normalizeAboutContent(STATIC_ABOUT_CONTENT))
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

  const updateContent = (updater: (current: AboutContentRaw) => AboutContentRaw) => {
    setContent((current) => updater(current))
  }

  const saveContent = async (sectionLabel?: string) => {
    if (saving || savingSection) {
      return
    }

    if (sectionLabel) {
      setSavingSection(sectionLabel)
    }

    setSaving(true)
    try {
      const response = await fetch('/api/about-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[about-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save about content right now.')
        return
      }

      setContent(normalizeAboutContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage(sectionLabel ? `${sectionLabel} saved to Supabase.` : 'About content saved to Supabase.')
      await showAlert('success', 'Saved', 'About page content has been updated.')
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the about content API.')
    } finally {
      setSaving(false)
      setSavingSection(null)
    }
  }

  const restoreBackup = async () => {
    if (saving || savingSection) {
      return
    }

    const nextContent = normalizeAboutContent(STATIC_ABOUT_CONTENT)
    setContent(nextContent)
    await saveWithValue(nextContent)
  }

  const saveWithValue = async (nextContent: AboutContentRaw, sectionLabel?: string) => {
    setSaving(true)
    try {
      const response = await fetch('/api/about-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: nextContent }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[about-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save about content right now.')
        return
      }

      setContent(normalizeAboutContent(payload.content || nextContent))
      setSource(payload.source || 'supabase')
      setStatusMessage(sectionLabel ? `${sectionLabel} saved to Supabase.` : 'About content saved to Supabase.')
      await showAlert('success', 'Saved', 'About page content has been updated.')
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the about content API.')
    } finally {
      setSaving(false)
      setSavingSection(null)
    }
  }

  const confirmAndSaveContent = async (nextContent: AboutContentRaw, title: string, text: string) => {
    if (saving || savingSection) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Delete row',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B8870A',
      cancelButtonColor: '#0D1F3C',
      background: '#FFFFFF',
      color: '#0F172A',
    })

    if (!confirm.isConfirmed) {
      return
    }

    setContent(nextContent)
    await saveWithValue(nextContent)
  }

  const saveSection = async (sectionLabel: string) => {
    await saveContent(sectionLabel)
  }

  const uploadHeroImage = async (file: File) => {
    if (uploadingImage || saving) {
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/about-content/profile-image', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as AboutImageApiState
      if (!response.ok || !payload.ok || !payload.content) {
        console.error('[about-editor] Image upload failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Upload failed', payload.message || 'Unable to upload hero image.')
        return
      }

      setContent(normalizeAboutContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Hero image uploaded and saved to Supabase.')
      await showAlert('success', 'Uploaded', payload.message || 'Profile image updated successfully.')
    } catch {
      await showAlert('error', 'Upload failed', 'Unable to reach the about image API.')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeHeroImage = async () => {
    if (uploadingImage || saving) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Remove hero image?',
      text: 'This will delete the uploaded image from Supabase Storage and restore the backup image.',
      showCancelButton: true,
      confirmButtonText: 'Remove image',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B8870A',
      cancelButtonColor: '#0D1F3C',
      background: '#FFFFFF',
      color: '#0F172A',
    })

    if (!confirm.isConfirmed) {
      return
    }

    setUploadingImage(true)
    try {
      const response = await fetch('/api/about-content/profile-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      const payload = (await response.json()) as AboutImageApiState
      if (!response.ok || !payload.ok || !payload.content) {
        console.error('[about-editor] Image remove failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Remove failed', payload.message || 'Unable to remove hero image.')
        return
      }

      setContent(normalizeAboutContent(payload.content || STATIC_ABOUT_CONTENT))
      setSource(payload.source || 'backup')
      setStatusMessage('Hero image removed. Backup image is active.')
      await showAlert('success', 'Removed', payload.message || 'Profile image removed.')
    } catch {
      await showAlert('error', 'Remove failed', 'Unable to reach the about image API.')
    } finally {
      setUploadingImage(false)
    }
  }

  const deleteContent = async () => {
    if (saving) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete About override?',
      text: 'The page will fall back to the static Aboutdata.ts file.',
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
      const response = await fetch('/api/about-content', { method: 'DELETE' })
      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[about-editor] Delete failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Delete failed', payload.message || 'Unable to remove the override.')
        return
      }

      setContent(normalizeAboutContent(payload.content || STATIC_ABOUT_CONTENT))
      setSource('backup')
      setStatusMessage('About override removed. Backup content is active.')
      await showAlert('success', 'Deleted', 'The Supabase override has been removed.')
    } catch {
      await showAlert('error', 'Delete failed', 'Unable to reach the about content API.')
    } finally {
      setSaving(false)
    }
  }

  const setEducationItem = (index: number, nextItem: AboutEducationItem) => {
    updateContent((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    }))
  }

  const setResearchAreaItem = (index: number, nextItem: AboutResearchArea) => {
    updateContent((current) => ({
      ...current,
      researchAreas: current.researchAreas.map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    }))
  }

  const setMilestoneItem = (index: number, nextItem: AboutMilestone) => {
    updateContent((current) => ({
      ...current,
      milestones: current.milestones.map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    }))
  }

  const setGlanceItem = (index: number, nextItem: AboutGlanceItem) => {
    updateContent((current) => ({
      ...current,
      atAGlance: current.atAGlance.map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    }))
  }

  return (
    <div className="about-editor-shell">
      <div className="about-editor-banner">
        <div>
          <p className="about-editor-kicker">About Content Manager</p>
          <h3>Supabase first, static Aboutdata.ts always available</h3>
          <p>{statusMessage}</p>
        </div>

        <div className="about-editor-banner-actions">
          <div className={`about-editor-source about-editor-source-${source}`}>
            {source === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
            <span>{source === 'supabase' ? 'Supabase live' : 'Backup active'}</span>
          </div>
            <button type="button" className="about-editor-btn about-editor-btn-primary" onClick={() => saveContent()} disabled={saving || Boolean(savingSection)}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save all changes'}
            </button>
        </div>
      </div>

      <div className="about-editor-grid">
        <motion.div className="about-editor-card about-editor-card-callout" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="about-editor-card-kicker">
            <Shield size={13} /> Backup strategy
          </p>
          <h4>The public About page always falls back to the static file when Supabase is missing.</h4>
          <p>Deleting the override simply removes the DB row. The bundled Aboutdata.ts file remains the backup source.</p>
        </motion.div>

        <motion.div className="about-editor-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.04 }}>
          <p className="about-editor-card-kicker">
            <Sparkles size={13} /> Quick facts
          </p>
          <div className="about-editor-quick-list">
            <div><strong>{content.education.length}</strong><span>education rows</span></div>
            <div><strong>{content.researchAreas.length}</strong><span>research areas</span></div>
            <div><strong>{content.milestones.length}</strong><span>timeline rows</span></div>
            <div><strong>{content.bioParagraphs.length}</strong><span>bio paragraphs</span></div>
          </div>
        </motion.div>
      </div>

      <div className="about-editor-actions-row">
        <button type="button" className="about-editor-btn about-editor-btn-secondary" onClick={restoreBackup} disabled={saving}>
          <RefreshCw size={14} /> Restore backup
        </button>
        <button type="button" className="about-editor-btn about-editor-btn-danger" onClick={deleteContent} disabled={saving}>
          <Trash2 size={14} /> Delete from DB
        </button>
      </div>

      <div className="about-editor-sections">
        <section className="about-editor-section">
          <SectionHeader title="Hero" description="Headline, profile image and intro copy." saving={savingSection === 'Hero'} onSave={() => saveSection('Hero')} />
          <div className="about-editor-form-grid">
            <div className="about-editor-span-2">
              <FieldLabel>Profile image</FieldLabel>
              <div className="about-editor-image-row">
                <img src={content.heroContent.profileImageUrl || '/Profile_pic/SBT_About.jpg'} alt="About profile preview" className="about-editor-image-preview" />
                <div className="about-editor-image-actions">
                  <label className="about-editor-btn about-editor-btn-secondary about-editor-upload-label">
                    <Upload size={14} /> {uploadingImage ? 'Uploading...' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="about-editor-hidden-file"
                      disabled={uploadingImage || saving}
                      onChange={async (event) => {
                        const file = event.target.files?.[0]
                        event.currentTarget.value = ''
                        if (!file) {
                          return
                        }
                        await uploadHeroImage(file)
                      }}
                    />
                  </label>
                  <button type="button" className="about-editor-btn about-editor-btn-danger" onClick={removeHeroImage} disabled={uploadingImage || !content.heroContent.profileImageUrl}>
                    <Trash2 size={14} /> Remove image
                  </button>
                </div>
              </div>
            </div>
            <div><FieldLabel>First name</FieldLabel><TextField value={content.heroContent.firstName} onChange={(value) => updateContent((current) => ({ ...current, heroContent: { ...current.heroContent, firstName: value } }))} /></div>
            <div><FieldLabel>Last name</FieldLabel><TextField value={content.heroContent.lastName} onChange={(value) => updateContent((current) => ({ ...current, heroContent: { ...current.heroContent, lastName: value } }))} /></div>
            <div className="about-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.heroContent.description} rows={4} onChange={(value) => updateContent((current) => ({ ...current, heroContent: { ...current.heroContent, description: value } }))} /></div>
            <div><FieldLabel>Profile initials</FieldLabel><TextField value={content.heroContent.profileInitials} onChange={(value) => updateContent((current) => ({ ...current, heroContent: { ...current.heroContent, profileInitials: value } }))} /></div>
            <div><FieldLabel>Profile title</FieldLabel><TextField value={content.heroContent.profileTitle} onChange={(value) => updateContent((current) => ({ ...current, heroContent: { ...current.heroContent, profileTitle: value } }))} /></div>
            <div><FieldLabel>Location</FieldLabel><TextField value={content.heroContent.location} onChange={(value) => updateContent((current) => ({ ...current, heroContent: { ...current.heroContent, location: value } }))} /></div>
            <div className="about-editor-span-2"><FieldLabel>Profile image URL</FieldLabel><TextField value={content.heroContent.profileImageUrl || ''} placeholder="/Profile_pic/SBT_About.jpg or Supabase URL" onChange={(value) => updateContent((current) => ({ ...current, heroContent: { ...current.heroContent, profileImageUrl: value } }))} /></div>
          </div>
        </section>

        <section className="about-editor-section">
          <SectionHeader title="Education" description="Academic qualifications and notes." saving={savingSection === 'Education'} onSave={() => saveSection('Education')} />
          <div className="about-editor-stack">
            {content.education.map((item, index) => (
              <RepeatRow key={`${item.degree}-${index}`}>
                <div><FieldLabel>Degree</FieldLabel><TextField value={item.degree} onChange={(value) => setEducationItem(index, { ...item, degree: value })} /></div>
                <div><FieldLabel>Field</FieldLabel><TextField value={item.field} onChange={(value) => setEducationItem(index, { ...item, field: value })} /></div>
                <div><FieldLabel>University</FieldLabel><TextField value={item.uni} onChange={(value) => setEducationItem(index, { ...item, uni: value })} /></div>
                <div><FieldLabel>Year</FieldLabel><TextField value={item.year} onChange={(value) => setEducationItem(index, { ...item, year: value })} /></div>
                <div><FieldLabel>Badge</FieldLabel><TextField value={item.badge} onChange={(value) => setEducationItem(index, { ...item, badge: value })} /></div>
                <div><FieldLabel>Color</FieldLabel><TextField value={item.color} onChange={(value) => setEducationItem(index, { ...item, color: value })} /></div>
                <div className="about-editor-span-2"><FieldLabel>Note</FieldLabel><TextArea value={item.note} rows={2} onChange={(value) => setEducationItem(index, { ...item, note: value })} /></div>
                <button type="button" className="about-editor-icon-btn" title="Remove education row" aria-label="Remove education row" onClick={() => void confirmAndSaveContent({ ...content, education: content.education.filter((_, itemIndex) => itemIndex !== index) }, 'Delete this education row?', 'This will remove the row from Supabase and every page that uses it.') }>
                  <Trash2 size={14} />
                </button>
              </RepeatRow>
            ))}
            <button type="button" className="about-editor-inline-add" onClick={() => updateContent((current) => ({ ...current, education: [...current.education, { degree: '', field: '', uni: '', year: '', color: '#0D1F3C', note: '', badge: 'New', badgeGold: false }] }))}>
              <Plus size={14} /> Add education row
            </button>
          </div>
        </section>

        <section className="about-editor-section">
          <SectionHeader title="Research Areas" description="Expertise cards and color accents." saving={savingSection === 'Research Areas'} onSave={() => saveSection('Research Areas')} />
          <div className="about-editor-stack">
            {content.researchAreas.map((item, index) => (
              <RepeatRow key={`${item.label}-${index}`}>
                <div><FieldLabel>Icon key</FieldLabel><TextField value={item.I} onChange={(value) => setResearchAreaItem(index, { ...item, I: value })} /></div>
                <div><FieldLabel>Label</FieldLabel><TextField value={item.label} onChange={(value) => setResearchAreaItem(index, { ...item, label: value })} /></div>
                <div><FieldLabel>Color</FieldLabel><TextField value={item.color} onChange={(value) => setResearchAreaItem(index, { ...item, color: value })} /></div>
                <div><FieldLabel>Background</FieldLabel><TextField value={item.bg} onChange={(value) => setResearchAreaItem(index, { ...item, bg: value })} /></div>
                <button type="button" className="about-editor-icon-btn" title="Remove research area" aria-label="Remove research area" onClick={() => void confirmAndSaveContent({ ...content, researchAreas: content.researchAreas.filter((_, itemIndex) => itemIndex !== index) }, 'Delete this research area?', 'This will remove the card from Supabase and every page that uses it.') }>
                  <Trash2 size={14} />
                </button>
              </RepeatRow>
            ))}
            <button type="button" className="about-editor-inline-add" onClick={() => updateContent((current) => ({ ...current, researchAreas: [...current.researchAreas, { I: 'Brain', label: 'New Area', color: '#0D1F3C', bg: 'rgba(13,31,60,0.06)' }] }))}>
              <Plus size={14} /> Add research area
            </button>
          </div>
        </section>

        <section className="about-editor-section">
          <SectionHeader title="Milestones" description="Career timeline events." saving={savingSection === 'Milestones'} onSave={() => saveSection('Milestones')} />
          <div className="about-editor-stack">
            {content.milestones.map((item, index) => (
              <RepeatRow key={`${item.year}-${index}`}>
                <div><FieldLabel>Year</FieldLabel><TextField value={item.year} onChange={(value) => setMilestoneItem(index, { ...item, year: value })} /></div>
                <div><FieldLabel>Event</FieldLabel><TextArea value={item.event} rows={2} onChange={(value) => setMilestoneItem(index, { ...item, event: value })} /></div>
                <div><FieldLabel>Type</FieldLabel><TextField value={item.type} onChange={(value) => setMilestoneItem(index, { ...item, type: value })} /></div>
                <button type="button" className="about-editor-icon-btn" title="Remove milestone" aria-label="Remove milestone" onClick={() => void confirmAndSaveContent({ ...content, milestones: content.milestones.filter((_, itemIndex) => itemIndex !== index) }, 'Delete this milestone?', 'This will remove the milestone from Supabase and every page that uses it.') }>
                  <Trash2 size={14} />
                </button>
              </RepeatRow>
            ))}
            <button type="button" className="about-editor-inline-add" onClick={() => updateContent((current) => ({ ...current, milestones: [...current.milestones, { year: '2026', event: 'New milestone', type: 'academic' }] }))}>
              <Plus size={14} /> Add milestone
            </button>
          </div>
        </section>

        <section className="about-editor-section">
          <SectionHeader title="At a Glance" description="Quick facts shown on the page." saving={savingSection === 'At a Glance'} onSave={() => saveSection('At a Glance')} />
          <div className="about-editor-stack">
            {content.atAGlance.map((item, index) => (
              <RepeatRow key={`${item.k}-${index}`}>
                <div><FieldLabel>Label</FieldLabel><TextField value={item.k} onChange={(value) => setGlanceItem(index, { ...item, k: value })} /></div>
                <div><FieldLabel>Value</FieldLabel><TextArea value={item.v} rows={2} onChange={(value) => setGlanceItem(index, { ...item, v: value })} /></div>
                <button type="button" className="about-editor-icon-btn" title="Remove glance item" aria-label="Remove glance item" onClick={() => void confirmAndSaveContent({ ...content, atAGlance: content.atAGlance.filter((_, itemIndex) => itemIndex !== index) }, 'Delete this at-a-glance item?', 'This will remove the row from Supabase and every page that uses it.') }>
                  <Trash2 size={14} />
                </button>
              </RepeatRow>
            ))}
            <button type="button" className="about-editor-inline-add" onClick={() => updateContent((current) => ({ ...current, atAGlance: [...current.atAGlance, { k: 'New label', v: 'New value' }] }))}>
              <Plus size={14} /> Add glance item
            </button>
          </div>
        </section>

        <section className="about-editor-section">
          <SectionHeader title="Biography" description="Paragraph copy and CTA text." saving={savingSection === 'Biography'} onSave={() => saveSection('Biography')} />
          <div className="about-editor-form-grid">
            <div><FieldLabel>Title prefix</FieldLabel><TextField value={content.bioTitle.prefix} onChange={(value) => updateContent((current) => ({ ...current, bioTitle: { ...current.bioTitle, prefix: value } }))} /></div>
            <div><FieldLabel>Highlighted title</FieldLabel><TextField value={content.bioTitle.highlighted} onChange={(value) => updateContent((current) => ({ ...current, bioTitle: { ...current.bioTitle, highlighted: value } }))} /></div>
            <div><FieldLabel>Heading title</FieldLabel><TextField value={content.bioHeading.title} onChange={(value) => updateContent((current) => ({ ...current, bioHeading: { ...current.bioHeading, title: value } }))} /></div>
            <div><FieldLabel>Heading emphasis</FieldLabel><TextField value={content.bioHeading.emphasis} onChange={(value) => updateContent((current) => ({ ...current, bioHeading: { ...current.bioHeading, emphasis: value } }))} /></div>
            <div><FieldLabel>CTA title</FieldLabel><TextField value={content.ctaContent.title} onChange={(value) => updateContent((current) => ({ ...current, ctaContent: { ...current.ctaContent, title: value } }))} /></div>
            <div><FieldLabel>CTA emphasis</FieldLabel><TextField value={content.ctaContent.emphasis} onChange={(value) => updateContent((current) => ({ ...current, ctaContent: { ...current.ctaContent, emphasis: value } }))} /></div>
            <div className="about-editor-span-2"><FieldLabel>CTA description</FieldLabel><TextArea value={content.ctaContent.description} rows={3} onChange={(value) => updateContent((current) => ({ ...current, ctaContent: { ...current.ctaContent, description: value } }))} /></div>
            <div><FieldLabel>Background number</FieldLabel><TextField value={content.ctaContent.backgroundNumber} onChange={(value) => updateContent((current) => ({ ...current, ctaContent: { ...current.ctaContent, backgroundNumber: value } }))} /></div>
            <div className="about-editor-span-2">
              <FieldLabel>Bio paragraphs</FieldLabel>
              <div className="about-editor-stack">
                {content.bioParagraphs.map((paragraph, index) => (
                  <div key={index} className="about-editor-paragraph-row">
                    <TextArea value={paragraph} rows={4} onChange={(value) => updateContent((current) => ({ ...current, bioParagraphs: current.bioParagraphs.map((item, itemIndex) => (itemIndex === index ? value : item)) }))} />
                    <button type="button" className="about-editor-icon-btn" title="Remove paragraph" aria-label="Remove paragraph" onClick={() => void confirmAndSaveContent({ ...content, bioParagraphs: content.bioParagraphs.filter((_, itemIndex) => itemIndex !== index) }, 'Delete this paragraph?', 'This will remove the paragraph from Supabase and every page that uses it.') }>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" className="about-editor-inline-add" onClick={() => updateContent((current) => ({ ...current, bioParagraphs: [...current.bioParagraphs, 'New paragraph'] }))}>
                  <Plus size={14} /> Add paragraph
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .about-editor-shell { display: grid; gap: 14px; }
        .about-editor-banner { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 18px 20px; border-radius: 18px; background: linear-gradient(145deg, #0D1F3C 0%, #17365f 100%); color: #fff; }
        .about-editor-kicker { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.68); margin-bottom: 8px; }
        .about-editor-banner h3 { color: #fff; font-size: 20px; margin-bottom: 6px; }
        .about-editor-banner p { color: rgba(255,255,255,0.82); line-height: 1.6; }
        .about-editor-banner-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .about-editor-source { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
        .about-editor-source-supabase { background: rgba(26,107,72,0.16); color: #8EE0B5; }
        .about-editor-source-backup { background: rgba(184,135,10,0.16); color: var(--gold-3); }
        .about-editor-btn { border: none; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; }
        .about-editor-btn-primary { background: var(--gold); color: #0D1F3C; }
        .about-editor-btn-secondary { background: rgba(13,31,60,0.08); color: var(--navy); }
        .about-editor-btn-danger { background: rgba(184,135,10,0.1); color: #7A5500; }
        .about-editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .about-editor-card { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.08); }
        .about-editor-card-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
        .about-editor-card h4 { font-size: 18px; margin-bottom: 8px; color: var(--navy); }
        .about-editor-card p { color: var(--ink-3); line-height: 1.7; }
        .about-editor-quick-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 6px; }
        .about-editor-quick-list div { background: var(--off); border: 1px solid var(--ink-line); border-radius: 12px; padding: 12px; }
        .about-editor-quick-list strong { display: block; font-size: 22px; color: var(--navy); }
        .about-editor-quick-list span { font-size: 12px; color: var(--ink-3); }
        .about-editor-actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .about-editor-sections { display: grid; gap: 14px; }
        .about-editor-section { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.06); }
        .about-editor-section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--ink-line); }
        .about-editor-section-header h4 { font-size: 18px; color: var(--navy); margin-bottom: 5px; }
        .about-editor-section-header p { color: var(--ink-3); font-size: 13px; line-height: 1.55; }
        .about-editor-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .about-editor-stack { display: grid; gap: 10px; }
        .about-editor-repeat-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)) auto; gap: 10px; align-items: end; padding: 12px; border-radius: 14px; border: 1px solid var(--ink-line); background: var(--off); }
        .about-editor-paragraph-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: end; }
        .about-editor-field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px; }
        .about-editor-input, .about-editor-textarea { width: 100%; border: 1px solid var(--ink-line); border-radius: 10px; padding: 11px 12px; background: #fff; color: var(--ink); font-size: 13px; }
        .about-editor-textarea { resize: vertical; min-height: 44px; }
        .about-editor-inline-add, .about-editor-icon-btn { border: 1px dashed var(--gold-border); background: rgba(184,135,10,0.07); color: var(--gold); border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; justify-content: center; }
        .about-editor-icon-btn { border-style: solid; padding: 0; width: 40px; height: 40px; }
        .about-editor-span-2 { grid-column: span 2; }
        .about-editor-image-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .about-editor-image-preview { width: 88px; height: 88px; border-radius: 18px; object-fit: cover; border: 1px solid var(--ink-line); box-shadow: var(--sh1); }
        .about-editor-image-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .about-editor-upload-label { position: relative; overflow: hidden; }
        .about-editor-hidden-file { display: none; }
        @media (max-width: 980px) { .about-editor-grid, .about-editor-form-grid { grid-template-columns: 1fr; } .about-editor-span-2 { grid-column: span 1; } .about-editor-repeat-row { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 640px) { .about-editor-banner { flex-direction: column; align-items: flex-start; } .about-editor-repeat-row { grid-template-columns: 1fr; } .about-editor-paragraph-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
