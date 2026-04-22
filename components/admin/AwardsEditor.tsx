'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, CloudOff, Database, Plus, RefreshCw, Save, Shield, Sparkles, Trash2, Upload } from 'lucide-react'

import {
  ACHIEVEMENTS_AWARDS_SECTION_META,
  AWARD_CATEGORIES,
  AWARD_ICON_OPTIONS,
  STATIC_ACHIEVEMENTS_AWARDS_CONTENT,
  createDefaultAward,
  normalizeAchievementsAwardsContent,
  type AchievementsAwardsSectionKey,
  type AwardCategory,
  type AwardIconKey,
  type AwardItemRaw,
  type AwardsContentRaw,
} from '@/lib/awardsContent'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<AwardsContentRaw>
  message?: string
  supabase?: {
    url?: boolean
    publicKey?: boolean
    serviceKey?: boolean
  }
}

const alertTheme = {
  success: { confirmButtonColor: '#0D1F3C', iconColor: '#1A6B48' },
  error: { confirmButtonColor: '#B8870A', iconColor: '#B8870A' },
}

const joinLines = (items: string[]) => items.join('\n')
const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="aw-editor-field-label">{children}</p>
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
      className="aw-editor-input"
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
      className="aw-editor-textarea"
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

  function ColorField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const colorValue = value?.trim() || '#0D1F3C'

    return (
      <div className="aw-editor-color-field">
        <input className="aw-editor-color-swatch" type="color" value={colorValue} aria-label="Color picker" onChange={(event) => onChange(event.target.value)} />
        <TextField value={value} onChange={onChange} placeholder="#0D1F3C" />
      </div>
    )
  }

function SelectField<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T
  options: T[]
  onChange: (value: T) => void
  ariaLabel?: string
}) {
  return (
    <select className="aw-editor-select" value={value} onChange={(event) => onChange(event.target.value as T)} aria-label={ariaLabel || 'Select option'}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export default function AwardsEditor() {
  const [content, setContent] = useState<AwardsContentRaw>(() =>
    normalizeAchievementsAwardsContent(STATIC_ACHIEVEMENTS_AWARDS_CONTENT),
  )
  const [source, setSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [statusMessage, setStatusMessage] = useState<string>('Loading awards content...')
  const [savingSection, setSavingSection] = useState<AchievementsAwardsSectionKey | 'all' | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<AchievementsAwardsSectionKey | null>('quote')
  const [expandedAwardId, setExpandedAwardId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/achievements-awards-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeAchievementsAwardsContent(payload.content || STATIC_ACHIEVEMENTS_AWARDS_CONTENT))
        setSource(payload.source || 'backup')
        if (payload.supabase && payload.supabase.serviceKey === false) {
          setStatusMessage('Read is working, but save is disabled: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local.')
        } else {
          setStatusMessage(
            payload.source === 'supabase' ? 'Awards loaded from Supabase.' : payload.message || 'Backup content is active.',
          )
        }
      } catch {
        if (!active) {
          return
        }

        setContent(normalizeAchievementsAwardsContent(STATIC_ACHIEVEMENTS_AWARDS_CONTENT))
        setSource('backup')
        setStatusMessage('Backup content is active.')
      }
    }

    loadContent()

    return () => {
      active = false
    }
  }, [])

  const showAlert = async (type: 'success' | 'error', title: string, text: string) => {
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

  const saveSection = async <K extends AchievementsAwardsSectionKey>(sectionKey: K, sectionValue: AwardsContentRaw[K]) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/achievements-awards-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: sectionValue } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeAchievementsAwardsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage(`${ACHIEVEMENTS_AWARDS_SECTION_META[sectionKey].label} section saved to Supabase.`)
      await showAlert('success', 'Saved', `${ACHIEVEMENTS_AWARDS_SECTION_META[sectionKey].label} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the awards API.')
    } finally {
      setSavingSection(null)
    }
  }

  const saveAwards = async () => {
    await saveSection('awards', content.awards)
  }

  const saveAwardItem = async () => {
    await saveSection('awards', content.awards)
  }

  const saveQuote = async () => {
    await saveSection('quote', content.quote)
  }

  const saveFeatured = async () => {
    await saveSection('featured', content.featured)
  }

  const confirmAndSaveAwardsSection = async <K extends keyof AwardsContentRaw>(sectionKey: K, nextValue: AwardsContentRaw[K], title: string, text: string) => {
    if (savingSection) {
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

    setContent((current) => ({
      ...current,
      [sectionKey]: nextValue,
    }))
    await saveSection(sectionKey, nextValue)
  }

  const syncAll = async () => {
    if (savingSection) {
      return
    }

    setSavingSection('all')
    try {
      const response = await fetch('/api/achievements-awards-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-all', content }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Sync failed', payload.message || 'Unable to sync awards content.')
        return
      }

      setContent(normalizeAchievementsAwardsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('All awards content synced to Supabase.')
      await showAlert('success', 'Synced', 'All awards content has been synced.')
    } catch {
      await showAlert('error', 'Sync failed', 'Unable to reach the awards API.')
    } finally {
      setSavingSection(null)
    }
  }

  const restoreBackup = async () => {
    setContent(normalizeAchievementsAwardsContent(STATIC_ACHIEVEMENTS_AWARDS_CONTENT))
    await syncAll()
  }

  const deleteOverride = async () => {
    if (savingSection) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete awards override?',
      text: 'The page will fall back to app/Database/Awarddata.ts.',
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

    setSavingSection('all')
    try {
      const response = await fetch('/api/achievements-awards-content', { method: 'DELETE' })
      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Delete failed', payload.message || 'Unable to remove override.')
        return
      }

      setContent(normalizeAchievementsAwardsContent(payload.content || STATIC_ACHIEVEMENTS_AWARDS_CONTENT))
      setSource('backup')
      setStatusMessage('Override deleted. Backup content is active.')
      await showAlert('success', 'Deleted', 'Awards override deleted. Backup file is active.')
    } catch {
      await showAlert('error', 'Delete failed', 'Unable to reach the awards API.')
    } finally {
      setSavingSection(null)
    }
  }

  const updateAward = (index: number, nextAward: AwardItemRaw) => {
    setContent((current) => ({
      ...current,
      awards: current.awards.map((item, itemIndex) => (itemIndex === index ? nextAward : item)),
    }))
  }

  const updateFeaturedDetail = (index: number, key: 'k' | 'v', value: string) => {
    setContent((current) => ({
      ...current,
      featured: {
        ...current.featured,
        details: current.featured.details.map((item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [key]: value,
              }
            : item,
        ),
      },
    }))
  }

  const addFeaturedDetail = () => {
    setContent((current) => ({
      ...current,
      featured: {
        ...current.featured,
        details: [...current.featured.details, { k: 'New detail', v: '' }],
      },
    }))
  }

  const removeFeaturedDetail = (index: number) => {
    setContent((current) => ({
      ...current,
      featured: {
        ...current.featured,
        details: current.featured.details.filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  const uploadAsset = async (params: { file: File; awardId: string }) => {
    if (savingSection || uploadingKey) {
      return
    }

    const key = `${params.awardId}-asset`
    setUploadingKey(key)

    try {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('awardId', params.awardId)

      const response = await fetch('/api/achievements-awards-content/assets', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok || !payload.content) {
        await showAlert('error', 'Upload failed', payload.message || 'Unable to upload asset.')
        return
      }

      setContent(normalizeAchievementsAwardsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Asset uploaded and saved to Supabase.')
      await showAlert('success', 'Uploaded', 'Asset has been uploaded successfully.')
    } catch {
      await showAlert('error', 'Upload failed', 'Unable to reach the awards asset API.')
    } finally {
      setUploadingKey(null)
    }
  }

  const removeAsset = async (params: { awardId: string; assetUrl: string }) => {
    if (savingSection || uploadingKey) {
      return
    }

    const key = `${params.awardId}-asset`
    setUploadingKey(key)

    try {
      const response = await fetch('/api/achievements-awards-content/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok || !payload.content) {
        await showAlert('error', 'Remove failed', payload.message || 'Unable to remove asset.')
        return
      }

      setContent(normalizeAchievementsAwardsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Asset removed from Supabase content.')
      await showAlert('success', 'Removed', 'Asset has been removed.')
    } catch {
      await showAlert('error', 'Remove failed', 'Unable to reach the awards asset API.')
    } finally {
      setUploadingKey(null)
    }
  }

  return (
    <div className="aw-editor-shell">
      <div className="aw-editor-banner">
        <div>
          <p className="aw-editor-kicker">Awards Manager</p>
          <h3>Supabase first, static Awarddata.ts always available</h3>
          <p>{statusMessage}</p>
        </div>

        <div className="aw-editor-banner-actions">
          <div className={`aw-editor-source aw-editor-source-${source}`}>
            {source === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
            <span>{source === 'supabase' ? 'Supabase live' : 'Backup active'}</span>
          </div>
          <button
            type="button"
            className="aw-editor-btn aw-editor-btn-primary"
            onClick={syncAll}
            disabled={savingSection === 'all'}
          >
            <Save size={14} /> {savingSection === 'all' ? 'Syncing...' : 'Sync all'}
          </button>
        </div>
      </div>

      <div className="aw-editor-grid">
        <motion.div
          className="aw-editor-card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="aw-editor-card-kicker">
            <Shield size={13} /> Backup strategy
          </p>
          <h4>Public page falls back to TS data if DB is unavailable.</h4>
          <p>Deleting the DB override only removes remote data. Static file remains fallback source.</p>
        </motion.div>

        <motion.div
          className="aw-editor-card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.04 }}
        >
          <p className="aw-editor-card-kicker">
            <Sparkles size={13} /> Quick facts
          </p>
          <div className="aw-editor-quick-list">
            <div>
              <strong>{content.awards.length}</strong>
              <span>awards</span>
            </div>
            <div>
              <strong>{content.awards.filter((item) => item.featured).length}</strong>
              <span>featured</span>
            </div>
            <div>
              <strong>{content.awards.filter((item) => item.assetUrl).length}</strong>
              <span>assets</span>
            </div>
            <div>
              <strong>{content.awards.filter((item) => item.socialLink).length}</strong>
              <span>social links</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="aw-editor-repeat-card">
        <div className="aw-editor-section-head aw-editor-section-head-accordion">
          <div>
            <button type="button" className="aw-editor-section-toggle" onClick={() => setExpandedSection(expandedSection === 'quote' ? null : 'quote')}>
              <p className="aw-editor-card-kicker">
              <Sparkles size={13} /> {ACHIEVEMENTS_AWARDS_SECTION_META.quote.label}
              </p>
              <p className="aw-editor-section-note">{ACHIEVEMENTS_AWARDS_SECTION_META.quote.description}</p>
              <span className="aw-editor-toggle-icon">{expandedSection === 'quote' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
            </button>
          </div>
          <button
            type="button"
            className="aw-editor-btn aw-editor-btn-secondary"
            onClick={saveQuote}
            disabled={Boolean(savingSection)}
          >
            <Save size={14} /> {savingSection === 'quote' ? 'Saving...' : 'Save quote section'}
          </button>
        </div>

        {expandedSection === 'quote' ? <div className="aw-editor-repeat-grid">
          <div className="aw-editor-span-2">
            <FieldLabel>Quote text</FieldLabel>
            <TextArea
              rows={4}
              value={content.quote.text}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  quote: {
                    ...current.quote,
                    text: value,
                  },
                }))
              }
            />
          </div>
          <div>
            <FieldLabel>Author</FieldLabel>
            <TextField
              value={content.quote.author}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  quote: {
                    ...current.quote,
                    author: value,
                  },
                }))
              }
            />
          </div>
        </div> : null}
      </div>

      <div className="aw-editor-repeat-card">
        <div className="aw-editor-section-head aw-editor-section-head-accordion">
          <div>
            <button type="button" className="aw-editor-section-toggle" onClick={() => setExpandedSection(expandedSection === 'featured' ? null : 'featured')}>
              <p className="aw-editor-card-kicker">
              <Sparkles size={13} /> {ACHIEVEMENTS_AWARDS_SECTION_META.featured.label}
              </p>
              <p className="aw-editor-section-note">{ACHIEVEMENTS_AWARDS_SECTION_META.featured.description}</p>
              <span className="aw-editor-toggle-icon">{expandedSection === 'featured' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
            </button>
          </div>
          <button
            type="button"
            className="aw-editor-btn aw-editor-btn-secondary"
            onClick={saveFeatured}
            disabled={Boolean(savingSection)}
          >
            <Save size={14} /> {savingSection === 'featured' ? 'Saving...' : 'Save featured section'}
          </button>
        </div>

        {expandedSection === 'featured' ? <div className="aw-editor-stack">
          {content.featured.details.map((item, index) => (
            <div key={`featured-detail-${index}`} className="aw-editor-repeat-card">
              <div className="aw-editor-repeat-grid">
                <div>
                  <FieldLabel>Label</FieldLabel>
                  <TextField value={item.k} onChange={(value) => updateFeaturedDetail(index, 'k', value)} />
                </div>
                <div>
                  <FieldLabel>Value</FieldLabel>
                  <TextField value={item.v} onChange={(value) => updateFeaturedDetail(index, 'v', value)} />
                </div>
              </div>
              <button
                type="button"
                className="aw-editor-icon-btn"
                title="Remove featured detail"
                aria-label="Remove featured detail"
                onClick={() => void confirmAndSaveAwardsSection('featured', { ...content.featured, details: content.featured.details.filter((_, itemIndex) => itemIndex !== index) }, 'Delete this featured detail?', 'This will remove the detail from Supabase and every page that uses it.')}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button type="button" className="aw-editor-inline-add" onClick={addFeaturedDetail}>
            <Plus size={14} /> Add featured detail
          </button>

          <div>
            <FieldLabel>Featured tags (one per line)</FieldLabel>
            <TextArea
              rows={3}
              value={joinLines(content.featured.tags)}
              onChange={(value) =>
                setContent((current) => ({
                  ...current,
                  featured: {
                    ...current.featured,
                    tags: splitLines(value),
                  },
                }))
              }
            />
          </div>
        </div> : null}
      </div>

      <div className="aw-editor-actions-row">
        <button
          type="button"
          className="aw-editor-btn aw-editor-btn-secondary"
          onClick={restoreBackup}
          disabled={Boolean(savingSection)}
        >
          <RefreshCw size={14} /> Restore backup
        </button>
        <button
          type="button"
          className="aw-editor-btn aw-editor-btn-danger"
          onClick={deleteOverride}
          disabled={Boolean(savingSection)}
        >
          <Trash2 size={14} /> Delete from DB
        </button>
      </div>

      <div className="aw-editor-stack">
        <div className="aw-editor-section-head aw-editor-section-head-accordion">
          <div>
            <button type="button" className="aw-editor-section-toggle" onClick={() => setExpandedSection(expandedSection === 'awards' ? null : 'awards')}>
              <p className="aw-editor-card-kicker">
              <Sparkles size={13} /> {ACHIEVEMENTS_AWARDS_SECTION_META.awards.label}
              </p>
              <p className="aw-editor-section-note">{ACHIEVEMENTS_AWARDS_SECTION_META.awards.description}</p>
              <span className="aw-editor-toggle-icon">{expandedSection === 'awards' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
            </button>
          </div>
        </div>

        {expandedSection === 'awards' ? <>
        {content.awards.map((item, index) => {
          const assetKey = `${item.id}-asset`
          const isOpen = expandedAwardId === item.id
          return (
            <div key={`${item.id}-${index}`} className="aw-editor-repeat-card">
              <div className="aw-editor-item-head">
                <button type="button" className="aw-editor-item-toggle" onClick={() => setExpandedAwardId(isOpen ? null : item.id)}>
                  <div>
                    <p className="aw-editor-item-title">Award {index + 1}</p>
                    <p className="aw-editor-item-subtitle">{item.title || 'Untitled award'}</p>
                  </div>
                  <span className="aw-editor-toggle-icon">{isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
                </button>
                <div className="aw-editor-item-actions">
                  <button
                    type="button"
                    className="aw-editor-btn aw-editor-btn-primary"
                    onClick={saveAwardItem}
                    disabled={Boolean(savingSection)}
                  >
                    <Save size={14} /> {savingSection === 'awards' ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="aw-editor-btn aw-editor-btn-danger" onClick={() => void confirmAndSaveAwardsSection('awards', content.awards.filter((_, itemIndex) => itemIndex !== index), 'Delete this award?', 'This will remove the award from Supabase and every page that uses it.') }>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              {isOpen ? <div className="aw-editor-repeat-grid">
                <div>
                  <FieldLabel>Title</FieldLabel>
                  <TextField value={item.title} onChange={(value) => updateAward(index, { ...item, title: value })} />
                </div>
                <div>
                  <FieldLabel>Issuing body</FieldLabel>
                  <TextField value={item.body} onChange={(value) => updateAward(index, { ...item, body: value })} />
                </div>
                <div>
                  <FieldLabel>Category</FieldLabel>
                  <SelectField
                    value={item.category}
                    options={AWARD_CATEGORIES}
                    ariaLabel="Award category"
                    onChange={(value) => updateAward(index, { ...item, category: value as AwardCategory })}
                  />
                </div>
                <div>
                  <FieldLabel>Year</FieldLabel>
                  <TextField value={item.year} onChange={(value) => updateAward(index, { ...item, year: value })} />
                </div>
                <div>
                  <FieldLabel>Icon</FieldLabel>
                  <select
                    className="aw-editor-select"
                    value={item.iconKey}
                    aria-label="Award icon"
                    onChange={(event) =>
                      updateAward(index, { ...item, iconKey: event.target.value as AwardIconKey })
                    }
                  >
                    {AWARD_ICON_OPTIONS.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Color</FieldLabel>
                  <ColorField value={item.color} onChange={(value) => updateAward(index, { ...item, color: value })} />
                </div>
                <div>
                  <FieldLabel>Featured</FieldLabel>
                  <SelectField
                    value={item.featured ? 'Yes' : 'No'}
                    options={['Yes', 'No']}
                    ariaLabel="Featured flag"
                    onChange={(value) => updateAward(index, { ...item, featured: value === 'Yes' })}
                  />
                </div>
                <div className="aw-editor-span-2">
                  <FieldLabel>Description</FieldLabel>
                  <TextArea
                    value={item.description}
                    rows={4}
                    onChange={(value) => updateAward(index, { ...item, description: value })}
                  />
                </div>
                <div className="aw-editor-span-2">
                  <FieldLabel>Tags (one per line)</FieldLabel>
                  <TextArea
                    value={joinLines(item.tags)}
                    rows={3}
                    onChange={(value) => updateAward(index, { ...item, tags: splitLines(value) })}
                  />
                </div>
                <div className="aw-editor-span-2">
                  <FieldLabel>Social link (optional)</FieldLabel>
                  <TextField
                    value={item.socialLink || ''}
                    placeholder="https://linkedin.com/..."
                    onChange={(value) => updateAward(index, { ...item, socialLink: value })}
                  />
                </div>
                <div className="aw-editor-span-2">
                  <FieldLabel>Asset (image or PDF)</FieldLabel>
                  <div className="aw-editor-asset-row">
                    <TextField
                      value={item.assetUrl || ''}
                      placeholder="Asset URL"
                      onChange={(value) => updateAward(index, { ...item, assetUrl: value })}
                    />
                    <label className="aw-editor-btn aw-editor-btn-secondary aw-editor-upload-label">
                      <Upload size={14} /> {uploadingKey === assetKey ? 'Uploading...' : 'Upload asset'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        aria-label="Upload award asset"
                        className="aw-editor-hidden-file"
                        disabled={Boolean(uploadingKey)}
                        onChange={async (event) => {
                          const file = event.target.files?.[0]
                          event.currentTarget.value = ''
                          if (!file) {
                            return
                          }
                          await uploadAsset({ file, awardId: item.id })
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="aw-editor-btn aw-editor-btn-danger"
                      disabled={!item.assetUrl || Boolean(uploadingKey)}
                      onClick={async () => {
                        const Swal = (await import('sweetalert2')).default
                        const confirm = await Swal.fire({
                          icon: 'warning',
                          title: 'Remove award asset?',
                          text: 'The uploaded file will be removed from Supabase Storage.',
                          showCancelButton: true,
                          confirmButtonText: 'Remove asset',
                          cancelButtonText: 'Cancel',
                          confirmButtonColor: '#B8870A',
                          cancelButtonColor: '#0D1F3C',
                          background: '#FFFFFF',
                          color: '#0F172A',
                        })

                        if (!confirm.isConfirmed) {
                          return
                        }

                        await removeAsset({ awardId: item.id, assetUrl: item.assetUrl || '' })
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div> : null}
            </div>
          )
        })}

        <button
          type="button"
          className="aw-editor-inline-add"
          onClick={() => setContent((current) => ({ ...current, awards: [...current.awards, createDefaultAward()] }))}
        >
          <Plus size={14} /> Add award
        </button>
        </> : null}
      </div>

      <style>{`
        .aw-editor-shell { display: grid; gap: 14px; }
        .aw-editor-banner { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 18px 20px; border-radius: 18px; background: linear-gradient(145deg, #0D1F3C 0%, #17365f 100%); color: #fff; }
        .aw-editor-kicker { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.68); margin-bottom: 8px; }
        .aw-editor-banner h3 { color: #fff; font-size: 20px; margin-bottom: 6px; }
        .aw-editor-banner p { color: rgba(255,255,255,0.82); line-height: 1.6; }
        .aw-editor-banner-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .aw-editor-source { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
        .aw-editor-source-supabase { background: rgba(26,107,72,0.16); color: #8EE0B5; }
        .aw-editor-source-backup { background: rgba(184,135,10,0.16); color: var(--gold-3); }
        .aw-editor-btn { border: none; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; }
        .aw-editor-btn-primary { background: linear-gradient(135deg, #1A6B48 0%, #0E8E57 100%); color: #fff; border: 1px solid rgba(14,142,87,0.32); }
        .aw-editor-btn-secondary { background: rgba(13,31,60,0.08); color: var(--navy); }
        .aw-editor-btn-danger { background: linear-gradient(135deg, #B42318 0%, #D92D20 100%); color: #fff; border: 1px solid rgba(185,28,28,0.24); }
        .aw-editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .aw-editor-card { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.08); }
        .aw-editor-card-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
        .aw-editor-card h4 { font-size: 18px; margin-bottom: 8px; color: var(--navy); }
        .aw-editor-card p { color: var(--ink-3); line-height: 1.7; }
        .aw-editor-quick-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 6px; }
        .aw-editor-quick-list div { background: var(--off); border: 1px solid var(--ink-line); border-radius: 12px; padding: 12px; }
        .aw-editor-quick-list strong { display: block; font-size: 22px; color: var(--navy); }
        .aw-editor-quick-list span { font-size: 12px; color: var(--ink-3); }
        .aw-editor-actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .aw-editor-stack { display: grid; gap: 10px; }
        .aw-editor-section-head { display: flex; justify-content: space-between; gap: 10px; align-items: center; flex-wrap: wrap; }
        .aw-editor-section-head-accordion { align-items: flex-start; }
        .aw-editor-section-toggle { border: none; background: transparent; text-align: left; padding: 0; cursor: pointer; display: grid; gap: 2px; }
        .aw-editor-toggle-icon { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--ink-line); display: inline-flex; align-items: center; justify-content: center; color: var(--ink-3); margin-top: 4px; }
        .aw-editor-section-note { color: var(--ink-3); font-size: 12px; line-height: 1.5; }
        .aw-editor-repeat-card { border: 1px solid var(--ink-line); border-radius: 14px; padding: 12px; background: var(--off); display: grid; gap: 10px; }
        .aw-editor-repeat-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .aw-editor-item-head { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
        .aw-editor-item-toggle { border: none; background: transparent; text-align: left; padding: 0; cursor: pointer; display: flex; justify-content: space-between; gap: 10px; width: 100%; }
        .aw-editor-item-title { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
        .aw-editor-item-subtitle { color: var(--ink); font-weight: 600; font-size: 14px; line-height: 1.5; }
        .aw-editor-item-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .aw-editor-field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px; }
        .aw-editor-input, .aw-editor-textarea, .aw-editor-select { width: 100%; border: 1px solid var(--ink-line); border-radius: 10px; padding: 11px 12px; background: #fff; color: var(--ink); font-size: 13px; }
        .aw-editor-textarea { resize: vertical; min-height: 44px; }
        .aw-editor-color-field { display: grid; grid-template-columns: 54px minmax(0, 1fr); gap: 10px; align-items: center; }
        .aw-editor-color-swatch { width: 54px; height: 46px; border-radius: 12px; border: 1px solid var(--ink-line); background: #fff; padding: 3px; cursor: pointer; }
        .aw-editor-inline-add, .aw-editor-icon-btn { border: 1px dashed var(--gold-border); background: rgba(184,135,10,0.07); color: var(--gold); border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; justify-content: center; }
        .aw-editor-icon-btn { border-style: solid; width: 40px; height: 40px; padding: 0; }
        .aw-editor-span-2 { grid-column: span 2; }
        .aw-editor-asset-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 8px; }
        .aw-editor-upload-label { position: relative; overflow: hidden; }
        .aw-editor-hidden-file { display: none; }
        @media (max-width: 980px) {
          .aw-editor-grid, .aw-editor-repeat-grid { grid-template-columns: 1fr; }
          .aw-editor-span-2 { grid-column: span 1; }
          .aw-editor-asset-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .aw-editor-banner { flex-direction: column; align-items: flex-start; }
          .aw-editor-item-head { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
