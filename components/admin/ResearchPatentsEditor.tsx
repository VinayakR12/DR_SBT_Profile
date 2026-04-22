'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, CloudOff, Database, Plus, RefreshCw, Save, Shield, Sparkles, Trash2, Upload } from 'lucide-react'

import {
  RESEARCH_PATENT_SECTION_META,
  RESEARCH_PATENT_SECTION_KEYS,
  STATIC_RESEARCH_PATENTS_CONTENT,
  createDefaultCopyright,
  createDefaultPatent,
  normalizeResearchPatentsContent,
  type CopyrightItemRaw,
  type PatentItemRaw,
  type ResearchPatentSectionKey,
  type ResearchPatentsContentRaw,
} from '@/lib/researchPatentsContent'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<ResearchPatentsContentRaw>
  message?: string
}

const alertTheme = {
  success: { confirmButtonColor: '#0D1F3C', iconColor: '#1A6B48' },
  error: { confirmButtonColor: '#B8870A', iconColor: '#B8870A' },
  info: { confirmButtonColor: '#0D1F3C', iconColor: '#2D5B8A' },
}

const joinLines = (items: string[]) => items.join('\n')
const splitLines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="pt-editor-field-label">{children}</p>
}

function TextField({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input className="pt-editor-input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className="pt-editor-textarea" value={value} placeholder={placeholder} rows={rows} onChange={(event) => onChange(event.target.value)} />
}

function HiddenFileInput({ inputId, accept, disabled, onChange }: { inputId: string; accept: string; disabled?: boolean; onChange: (file: File | null) => void }) {
  return <input id={inputId} aria-label="Upload asset" className="pt-editor-hidden-input" type="file" accept={accept} disabled={disabled} onChange={(event) => onChange(event.target.files?.[0] || null)} />
}

function SelectField<T extends string>({ value, options, onChange, ariaLabel }: { value: T; options: T[]; onChange: (value: T) => void; ariaLabel: string }) {
  return (
    <select className="pt-editor-select" value={value} onChange={(event) => onChange(event.target.value as T)} aria-label={ariaLabel}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function SectionHeader({
  sectionKey,
  saving,
  onSave,
}: {
  sectionKey: ResearchPatentSectionKey
  saving: boolean
  onSave: () => void
}) {
  const meta = RESEARCH_PATENT_SECTION_META[sectionKey]

  return (
    <div className="pt-editor-section-header">
      <div>
        <p className="pt-editor-section-kicker">{meta.label}</p>
        <h4>{meta.description}</h4>
      </div>
      <button type="button" className="pt-editor-btn pt-editor-btn-primary" onClick={onSave} disabled={saving}>
        <Save size={14} /> {saving ? 'Saving...' : 'Save section'}
      </button>
    </div>
  )
}

function SectionToggleHeader({
  sectionKey,
  expandedSection,
  onToggle,
  onSave,
  saving,
  showSave = true,
}: {
  sectionKey: ResearchPatentSectionKey
  expandedSection: ResearchPatentSectionKey | null
  onToggle: (key: ResearchPatentSectionKey) => void
  onSave: () => void
  saving: boolean
  showSave?: boolean
}) {
  const meta = RESEARCH_PATENT_SECTION_META[sectionKey]
  const open = expandedSection === sectionKey

  return (
    <div className="pt-editor-section-header pt-editor-section-header-accordion">
      <button type="button" className="pt-editor-section-toggle" onClick={() => onToggle(sectionKey)}>
        <div>
          <p className="pt-editor-section-kicker">{meta.label}</p>
          <h4>{meta.description}</h4>
        </div>
        <span className="pt-editor-toggle-icon">{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
      </button>
      {showSave ? (
        <button type="button" className="pt-editor-btn pt-editor-btn-primary" onClick={onSave} disabled={saving}>
          <Save size={14} /> {saving ? 'Saving...' : 'Save section'}
        </button>
      ) : null}
    </div>
  )
}

export default function ResearchPatentsEditor() {
  const [content, setContent] = useState<ResearchPatentsContentRaw>(() => normalizeResearchPatentsContent(STATIC_RESEARCH_PATENTS_CONTENT))
  const [source, setSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [statusMessage, setStatusMessage] = useState<string>('Loading research patents content...')
  const [savingSection, setSavingSection] = useState<ResearchPatentSectionKey | 'all' | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<ResearchPatentSectionKey | null>('hero')
  const [expandedPatentKey, setExpandedPatentKey] = useState<string | null>(null)
  const [expandedCopyrightKey, setExpandedCopyrightKey] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/research-patents-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeResearchPatentsContent(payload.content || STATIC_RESEARCH_PATENTS_CONTENT))
        setSource(payload.source || 'backup')
        setStatusMessage(payload.source === 'supabase' ? 'Research patents loaded from Supabase.' : payload.message || 'Backup content is active.')
      } catch {
        if (!active) {
          return
        }

        setContent(normalizeResearchPatentsContent(STATIC_RESEARCH_PATENTS_CONTENT))
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

  const setSection = <K extends ResearchPatentSectionKey>(sectionKey: K, nextValue: ResearchPatentsContentRaw[K]) => {
    setContent((current) => ({
      ...current,
      [sectionKey]: nextValue,
    }))
  }

  const saveSection = async <K extends ResearchPatentSectionKey>(sectionKey: K) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/research-patents-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: content[sectionKey] } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[research-patents-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeResearchPatentsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage(`${RESEARCH_PATENT_SECTION_META[sectionKey].label} section saved to Supabase.`)
      await showAlert('success', 'Saved', `${RESEARCH_PATENT_SECTION_META[sectionKey].label} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the research patents API.')
    } finally {
      setSavingSection(null)
    }
  }

  const saveSectionWithValue = async <K extends ResearchPatentSectionKey>(sectionKey: K, sectionValue: ResearchPatentsContentRaw[K]) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/research-patents-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: sectionValue } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[research-patents-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeResearchPatentsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage(`${RESEARCH_PATENT_SECTION_META[sectionKey].label} section saved to Supabase.`)
      await showAlert('success', 'Saved', `${RESEARCH_PATENT_SECTION_META[sectionKey].label} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the research patents API.')
    } finally {
      setSavingSection(null)
    }
  }

  const confirmAndSaveSectionValue = async <K extends ResearchPatentSectionKey>(sectionKey: K, sectionValue: ResearchPatentsContentRaw[K], title: string, text: string) => {
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
      [sectionKey]: sectionValue,
    }))
    await saveSectionWithValue(sectionKey, sectionValue)
  }

  const syncAll = async () => {
    if (savingSection) {
      return
    }

    setSavingSection('all')
    try {
      const response = await fetch('/api/research-patents-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-all', content }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[research-patents-editor] Sync failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Sync failed', payload.message || 'Unable to sync patents content.')
        return
      }

      setContent(normalizeResearchPatentsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('All research patents content synced to Supabase.')
      await showAlert('success', 'Synced', 'All patents content has been synced.')
    } catch {
      await showAlert('error', 'Sync failed', 'Unable to reach the research patents API.')
    } finally {
      setSavingSection(null)
    }
  }

  const restoreBackup = async () => {
    setContent(normalizeResearchPatentsContent(STATIC_RESEARCH_PATENTS_CONTENT))
    await syncAll()
  }

  const deleteOverride = async () => {
    if (savingSection) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete patents override?',
      text: 'The page will fall back to app/Database/Patentdata.ts.',
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
      const response = await fetch('/api/research-patents-content', { method: 'DELETE' })
      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[research-patents-editor] Delete failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Delete failed', payload.message || 'Unable to remove override.')
        return
      }

      setContent(normalizeResearchPatentsContent(payload.content || STATIC_RESEARCH_PATENTS_CONTENT))
      setSource('backup')
      setStatusMessage('Override deleted. Backup content is active.')
      await showAlert('success', 'Deleted', 'Patents override deleted. Backup file is active.')
    } catch {
      await showAlert('error', 'Delete failed', 'Unable to reach the research patents API.')
    } finally {
      setSavingSection(null)
    }
  }

  const updatePatent = (index: number, nextPatent: PatentItemRaw) => {
    setSection('patents', content.patents.map((item, itemIndex) => (itemIndex === index ? nextPatent : item)))
  }

  const updateCopyright = (index: number, nextItem: CopyrightItemRaw) => {
    setSection('copyrights', content.copyrights.map((item, itemIndex) => (itemIndex === index ? nextItem : item)))
  }

  const uploadAsset = async (params: {
    file: File
    entryType: 'patent' | 'copyright'
    entryId: number
    assetKind: 'asset'
  }) => {
    if (savingSection || uploadingKey) {
      return
    }

    const key = `${params.entryType}-${params.entryId}-${params.assetKind}`
    setUploadingKey(key)

    try {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('entryType', params.entryType)
      formData.append('entryId', `${params.entryId}`)
      formData.append('assetKind', params.assetKind)

      const response = await fetch('/api/research-patents-content/assets', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok || !payload.content) {
        console.error('[research-patents-editor] Upload failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Upload failed', payload.message || 'Unable to upload asset.')
        return
      }

      setContent(normalizeResearchPatentsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Asset uploaded and saved to Supabase.')
      await showAlert('success', 'Uploaded', 'Asset has been uploaded successfully.')
    } catch {
      await showAlert('error', 'Upload failed', 'Unable to reach the patents asset API.')
    } finally {
      setUploadingKey(null)
    }
  }

  const removeAsset = async (params: {
    entryType: 'patent' | 'copyright'
    entryId: number
    assetKind: 'asset'
    assetUrl: string
  }) => {
    if (savingSection || uploadingKey) {
      return
    }

    const key = `${params.entryType}-${params.entryId}-${params.assetKind}`
    setUploadingKey(key)

    try {
      const response = await fetch('/api/research-patents-content/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok || !payload.content) {
        console.error('[research-patents-editor] Remove failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Remove failed', payload.message || 'Unable to remove asset.')
        return
      }

      setContent(normalizeResearchPatentsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Asset removed from Supabase content.')
      await showAlert('success', 'Removed', 'Asset has been removed.')
    } catch {
      await showAlert('error', 'Remove failed', 'Unable to reach the patents asset API.')
    } finally {
      setUploadingKey(null)
    }
  }

  return (
    <div className="pt-editor-shell">
      <div className="pt-editor-banner">
        <div>
          <p className="pt-editor-kicker">Research Patents Manager</p>
          <h3>Supabase first, static Patentdata.ts always available</h3>
          <p>{statusMessage}</p>
        </div>

        <div className="pt-editor-banner-actions">
          <div className={`pt-editor-source pt-editor-source-${source}`}>
            {source === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
            <span>{source === 'supabase' ? 'Supabase live' : 'Backup active'}</span>
          </div>
          <button type="button" className="pt-editor-btn pt-editor-btn-primary" onClick={syncAll} disabled={savingSection === 'all'}>
            <Save size={14} /> {savingSection === 'all' ? 'Syncing...' : 'Sync all sections'}
          </button>
        </div>
      </div>

      <div className="pt-editor-grid">
        <motion.div className="pt-editor-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="pt-editor-card-kicker">
            <Shield size={13} /> Backup strategy
          </p>
          <h4>Public page falls back to TS data if DB is unavailable.</h4>
          <p>Deleting the DB override only removes remote data. The static file remains the source of truth fallback.</p>
        </motion.div>

        <motion.div className="pt-editor-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.04 }}>
          <p className="pt-editor-card-kicker">
            <Sparkles size={13} /> Quick facts
          </p>
          <div className="pt-editor-quick-list">
            <div><strong>{content.patents.length}</strong><span>patents</span></div>
            <div><strong>{content.copyrights.length}</strong><span>copyrights</span></div>
            <div><strong>{content.patents.filter((item) => item.status === 'Published').length}</strong><span>published patents</span></div>
            <div><strong>{content.copyrights.filter((item) => item.published).length}</strong><span>published copyrights</span></div>
          </div>
        </motion.div>
      </div>

      <div className="pt-editor-actions-row">
        <button type="button" className="pt-editor-btn pt-editor-btn-secondary" onClick={restoreBackup} disabled={Boolean(savingSection)}>
          <RefreshCw size={14} /> Restore backup
        </button>
        <button type="button" className="pt-editor-btn pt-editor-btn-danger" onClick={deleteOverride} disabled={Boolean(savingSection)}>
          <Trash2 size={14} /> Delete from DB
        </button>
      </div>

      <div className="pt-editor-sections">
        <section className="pt-editor-section">
          <SectionToggleHeader sectionKey="hero" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('hero')} saving={savingSection === 'hero'} />
          {expandedSection === 'hero' ? <div className="pt-editor-form-grid">
            <div><FieldLabel>Kicker</FieldLabel><TextField value={content.hero.kicker} onChange={(value) => setSection('hero', { ...content.hero, kicker: value })} /></div>
            <div><FieldLabel>Title prefix</FieldLabel><TextField value={content.hero.titlePrefix} onChange={(value) => setSection('hero', { ...content.hero, titlePrefix: value })} /></div>
            <div><FieldLabel>Title emphasis</FieldLabel><TextField value={content.hero.titleEmphasis} onChange={(value) => setSection('hero', { ...content.hero, titleEmphasis: value })} /></div>
            <div className="pt-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.hero.description} rows={4} onChange={(value) => setSection('hero', { ...content.hero, description: value })} /></div>
          </div> : null}
        </section>

        <section className="pt-editor-section">
          <SectionToggleHeader sectionKey="stats" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('stats')} saving={savingSection === 'stats'} />
          {expandedSection === 'stats' ? <div className="pt-editor-form-grid">
            <div><FieldLabel>Total patents</FieldLabel><TextField value={content.stats.totalPatents} onChange={(value) => setSection('stats', { ...content.stats, totalPatents: value })} /></div>
            <div><FieldLabel>Total copyrights</FieldLabel><TextField value={content.stats.totalCopyrights} onChange={(value) => setSection('stats', { ...content.stats, totalCopyrights: value })} /></div>
            <div><FieldLabel>Published patents</FieldLabel><TextField value={content.stats.publishedPatents} onChange={(value) => setSection('stats', { ...content.stats, publishedPatents: value })} /></div>
          </div> : null}
        </section>

        <section className="pt-editor-section">
          <SectionToggleHeader sectionKey="patentsSection" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('patentsSection')} saving={savingSection === 'patentsSection'} />
          {expandedSection === 'patentsSection' ? <div className="pt-editor-form-grid">
            <div><FieldLabel>Kicker</FieldLabel><TextField value={content.patentsSection.kicker} onChange={(value) => setSection('patentsSection', { ...content.patentsSection, kicker: value })} /></div>
            <div><FieldLabel>Title prefix</FieldLabel><TextField value={content.patentsSection.titlePrefix} onChange={(value) => setSection('patentsSection', { ...content.patentsSection, titlePrefix: value })} /></div>
            <div><FieldLabel>Title emphasis</FieldLabel><TextField value={content.patentsSection.titleEmphasis} onChange={(value) => setSection('patentsSection', { ...content.patentsSection, titleEmphasis: value })} /></div>
            <div className="pt-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.patentsSection.description} rows={3} onChange={(value) => setSection('patentsSection', { ...content.patentsSection, description: value })} /></div>
          </div> : null}
        </section>

        <section className="pt-editor-section">
          <SectionToggleHeader sectionKey="patents" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('patents')} saving={savingSection === 'patents'} showSave={false} />
          {expandedSection === 'patents' ? <div className="pt-editor-stack">
            {content.patents.map((item, index) => {
              const assetKey = `patent-${item.id}-asset`
              const patentKey = `${item.id}-${index}`
              const isOpen = expandedPatentKey === patentKey
              return (
                <div key={`${item.id}-${index}`} className="pt-editor-repeat-card">
                  <div className="pt-editor-item-head">
                    <button type="button" className="pt-editor-item-toggle" onClick={() => setExpandedPatentKey(isOpen ? null : patentKey)}>
                      <div>
                        <p className="pt-editor-item-title">Patent {index + 1}</p>
                        <p className="pt-editor-item-subtitle">{item.title || 'Untitled patent'}</p>
                      </div>
                      <span className="pt-editor-toggle-icon">{isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
                    </button>
                    <div className="pt-editor-item-actions">
                      <button type="button" className="pt-editor-btn pt-editor-btn-primary" onClick={() => saveSection('patents')} disabled={Boolean(savingSection)}>
                        <Save size={14} /> {savingSection === 'patents' ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" className="pt-editor-btn pt-editor-btn-danger" onClick={() => void confirmAndSaveSectionValue('patents', content.patents.filter((_, itemIndex) => itemIndex !== index), 'Delete this patent?', 'This will remove the patent from Supabase and every page that uses it.') }>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>

                  {isOpen ? <div className="pt-editor-repeat-grid">
                    <div><FieldLabel>Title</FieldLabel><TextField value={item.title} onChange={(value) => updatePatent(index, { ...item, title: value })} /></div>
                    <div><FieldLabel>Type</FieldLabel><SelectField value={item.type} ariaLabel="Patent type" options={['Utility', 'Design', 'Provisional']} onChange={(value) => updatePatent(index, { ...item, type: value })} /></div>
                    <div className="pt-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={item.description} rows={3} onChange={(value) => updatePatent(index, { ...item, description: value })} /></div>
                    <div><FieldLabel>Application No</FieldLabel><TextField value={item.applicationNo} onChange={(value) => updatePatent(index, { ...item, applicationNo: value })} /></div>
                    <div><FieldLabel>Reference No</FieldLabel><TextField value={item.referenceNo || ''} onChange={(value) => updatePatent(index, { ...item, referenceNo: value })} /></div>
                    <div><FieldLabel>Docket No</FieldLabel><TextField value={item.docketNo || ''} onChange={(value) => updatePatent(index, { ...item, docketNo: value })} /></div>
                    <div><FieldLabel>CRC No</FieldLabel><TextField value={item.crcNo || ''} onChange={(value) => updatePatent(index, { ...item, crcNo: value })} /></div>
                    <div><FieldLabel>Filing date</FieldLabel><TextField value={item.filingDate} onChange={(value) => updatePatent(index, { ...item, filingDate: value })} /></div>
                    <div><FieldLabel>Publication date</FieldLabel><TextField value={item.publicationDate || ''} onChange={(value) => updatePatent(index, { ...item, publicationDate: value })} /></div>
                    <div><FieldLabel>Status</FieldLabel><SelectField value={item.status} ariaLabel="Patent status" options={['Published', 'Granted', 'Pending']} onChange={(value) => updatePatent(index, { ...item, status: value })} /></div>
                    <div className="pt-editor-span-2"><FieldLabel>Tags (one per line)</FieldLabel><TextArea value={joinLines(item.tags)} rows={2} onChange={(value) => updatePatent(index, { ...item, tags: splitLines(value) })} /></div>
                    <div className="pt-editor-span-2"><FieldLabel>Social link (optional)</FieldLabel><TextField value={item.socialLink || ''} placeholder="https://linkedin.com/..." onChange={(value) => updatePatent(index, { ...item, socialLink: value })} /></div>
                    <div className="pt-editor-span-2">
                      <FieldLabel>Asset (image or PDF)</FieldLabel>
                      <div className="pt-editor-asset-row">
                        <TextField value={item.assetUrl || ''} placeholder="Asset URL" onChange={(value) => updatePatent(index, { ...item, assetUrl: value })} />
                        <label className="pt-editor-btn pt-editor-btn-secondary pt-editor-upload-label">
                          <Upload size={14} /> {uploadingKey === assetKey ? 'Uploading...' : 'Upload asset'}
                          <HiddenFileInput
                            inputId={assetKey}
                            accept="image/png,image/jpeg,image/webp,application/pdf"
                            disabled={Boolean(uploadingKey)}
                            onChange={async (file) => {
                              if (!file) {
                                return
                              }
                              await uploadAsset({ file, entryType: 'patent', entryId: item.id, assetKind: 'asset' })
                            }}
                          />
                        </label>
                        <button type="button" className="pt-editor-btn pt-editor-btn-danger" disabled={!item.assetUrl || Boolean(uploadingKey)} onClick={async () => {
                          const Swal = (await import('sweetalert2')).default
                          const confirm = await Swal.fire({
                            icon: 'warning',
                            title: 'Remove patent asset?',
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

                          await removeAsset({ entryType: 'patent', entryId: item.id, assetKind: 'asset', assetUrl: item.assetUrl || '' })
                        }}>
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div> : null}
                </div>
              )
            })}

            <button type="button" className="pt-editor-inline-add" onClick={() => setSection('patents', [...content.patents, createDefaultPatent()])}>
              <Plus size={14} /> Add patent
            </button>
          </div> : null}
        </section>

        <section className="pt-editor-section">
          <SectionToggleHeader sectionKey="copyrightsSection" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('copyrightsSection')} saving={savingSection === 'copyrightsSection'} />
          {expandedSection === 'copyrightsSection' ? <div className="pt-editor-form-grid">
            <div><FieldLabel>Kicker</FieldLabel><TextField value={content.copyrightsSection.kicker} onChange={(value) => setSection('copyrightsSection', { ...content.copyrightsSection, kicker: value })} /></div>
            <div><FieldLabel>Title prefix</FieldLabel><TextField value={content.copyrightsSection.titlePrefix} onChange={(value) => setSection('copyrightsSection', { ...content.copyrightsSection, titlePrefix: value })} /></div>
            <div><FieldLabel>Title emphasis</FieldLabel><TextField value={content.copyrightsSection.titleEmphasis} onChange={(value) => setSection('copyrightsSection', { ...content.copyrightsSection, titleEmphasis: value })} /></div>
            <div className="pt-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.copyrightsSection.description} rows={3} onChange={(value) => setSection('copyrightsSection', { ...content.copyrightsSection, description: value })} /></div>
          </div> : null}
        </section>

        <section className="pt-editor-section">
          <SectionToggleHeader sectionKey="copyrights" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('copyrights')} saving={savingSection === 'copyrights'} showSave={false} />
          {expandedSection === 'copyrights' ? <div className="pt-editor-stack">
            {content.copyrights.map((item, index) => {
              const assetKey = `copyright-${item.id}-asset`
              const copyrightKey = `${item.id}-${index}`
              const isOpen = expandedCopyrightKey === copyrightKey
              return (
                <div key={`${item.id}-${index}`} className="pt-editor-repeat-card">
                  <div className="pt-editor-item-head">
                    <button type="button" className="pt-editor-item-toggle" onClick={() => setExpandedCopyrightKey(isOpen ? null : copyrightKey)}>
                      <div>
                        <p className="pt-editor-item-title">Copyright {index + 1}</p>
                        <p className="pt-editor-item-subtitle">{item.title || 'Untitled copyright'}</p>
                      </div>
                      <span className="pt-editor-toggle-icon">{isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
                    </button>
                    <div className="pt-editor-item-actions">
                      <button type="button" className="pt-editor-btn pt-editor-btn-primary" onClick={() => saveSection('copyrights')} disabled={Boolean(savingSection)}>
                        <Save size={14} /> {savingSection === 'copyrights' ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" className="pt-editor-btn pt-editor-btn-danger" onClick={() => void confirmAndSaveSectionValue('copyrights', content.copyrights.filter((_, itemIndex) => itemIndex !== index), 'Delete this copyright?', 'This will remove the copyright from Supabase and every page that uses it.') }>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>

                  {isOpen ? <div className="pt-editor-repeat-grid">
                    <div><FieldLabel>Title</FieldLabel><TextField value={item.title} onChange={(value) => updateCopyright(index, { ...item, title: value })} /></div>
                    <div><FieldLabel>Category</FieldLabel><TextField value={item.category} onChange={(value) => updateCopyright(index, { ...item, category: value })} /></div>
                    <div><FieldLabel>Diary no</FieldLabel><TextField value={item.diaryNo} onChange={(value) => updateCopyright(index, { ...item, diaryNo: value })} /></div>
                    <div><FieldLabel>Date</FieldLabel><TextField value={item.date} onChange={(value) => updateCopyright(index, { ...item, date: value })} /></div>
                    <div><FieldLabel>Published status</FieldLabel><SelectField value={item.published ? 'Published' : 'Registered'} ariaLabel="Copyright published status" options={['Published', 'Registered']} onChange={(value) => updateCopyright(index, { ...item, published: value === 'Published' })} /></div>
                    <div className="pt-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={item.description || ''} rows={3} onChange={(value) => updateCopyright(index, { ...item, description: value })} /></div>
                    <div className="pt-editor-span-2"><FieldLabel>Social link (optional)</FieldLabel><TextField value={item.socialLink || ''} placeholder="https://x.com/..." onChange={(value) => updateCopyright(index, { ...item, socialLink: value })} /></div>
                    <div className="pt-editor-span-2">
                      <FieldLabel>Asset (image or PDF)</FieldLabel>
                      <div className="pt-editor-asset-row">
                        <TextField value={item.assetUrl || ''} placeholder="Asset URL" onChange={(value) => updateCopyright(index, { ...item, assetUrl: value })} />
                        <label className="pt-editor-btn pt-editor-btn-secondary pt-editor-upload-label">
                          <Upload size={14} /> {uploadingKey === assetKey ? 'Uploading...' : 'Upload asset'}
                          <HiddenFileInput
                            inputId={assetKey}
                            accept="image/png,image/jpeg,image/webp,application/pdf"
                            disabled={Boolean(uploadingKey)}
                            onChange={async (file) => {
                              if (!file) {
                                return
                              }
                              await uploadAsset({ file, entryType: 'copyright', entryId: item.id, assetKind: 'asset' })
                            }}
                          />
                        </label>
                        <button type="button" className="pt-editor-btn pt-editor-btn-danger" disabled={!item.assetUrl || Boolean(uploadingKey)} onClick={async () => {
                          const Swal = (await import('sweetalert2')).default
                          const confirm = await Swal.fire({
                            icon: 'warning',
                            title: 'Remove copyright asset?',
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

                          await removeAsset({ entryType: 'copyright', entryId: item.id, assetKind: 'asset', assetUrl: item.assetUrl || '' })
                        }}>
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div> : null}
                </div>
              )
            })}

            <button type="button" className="pt-editor-inline-add" onClick={() => setSection('copyrights', [...content.copyrights, createDefaultCopyright()])}>
              <Plus size={14} /> Add copyright
            </button>
          </div> : null}
        </section>

        <section className="pt-editor-section">
          <SectionToggleHeader sectionKey="cta" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('cta')} saving={savingSection === 'cta'} />
          {expandedSection === 'cta' ? <div className="pt-editor-form-grid">
            <div><FieldLabel>Title prefix</FieldLabel><TextField value={content.cta.titlePrefix} onChange={(value) => setSection('cta', { ...content.cta, titlePrefix: value })} /></div>
            <div><FieldLabel>Title emphasis</FieldLabel><TextField value={content.cta.titleEmphasis} onChange={(value) => setSection('cta', { ...content.cta, titleEmphasis: value })} /></div>
            <div className="pt-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.cta.description} rows={3} onChange={(value) => setSection('cta', { ...content.cta, description: value })} /></div>
            <div><FieldLabel>Primary label</FieldLabel><TextField value={content.cta.primaryLabel} onChange={(value) => setSection('cta', { ...content.cta, primaryLabel: value })} /></div>
            <div><FieldLabel>Primary href</FieldLabel><TextField value={content.cta.primaryHref} onChange={(value) => setSection('cta', { ...content.cta, primaryHref: value })} /></div>
            <div><FieldLabel>Secondary label</FieldLabel><TextField value={content.cta.secondaryLabel} onChange={(value) => setSection('cta', { ...content.cta, secondaryLabel: value })} /></div>
            <div><FieldLabel>Secondary href</FieldLabel><TextField value={content.cta.secondaryHref} onChange={(value) => setSection('cta', { ...content.cta, secondaryHref: value })} /></div>
          </div> : null}
        </section>
      </div>

      <style>{`
        .pt-editor-shell { display: grid; gap: 14px; }
        .pt-editor-banner { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 18px 20px; border-radius: 18px; background: linear-gradient(145deg, #0D1F3C 0%, #17365f 100%); color: #fff; }
        .pt-editor-kicker { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.68); margin-bottom: 8px; }
        .pt-editor-banner h3 { color: #fff; font-size: 20px; margin-bottom: 6px; }
        .pt-editor-banner p { color: rgba(255,255,255,0.82); line-height: 1.6; }
        .pt-editor-banner-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pt-editor-source { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
        .pt-editor-source-supabase { background: rgba(26,107,72,0.16); color: #8EE0B5; }
        .pt-editor-source-backup { background: rgba(184,135,10,0.16); color: var(--gold-3); }
        .pt-editor-btn { border: none; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; }
        .pt-editor-btn-primary { background: linear-gradient(135deg, #1A6B48 0%, #0E8E57 100%); color: #fff; border: 1px solid rgba(14,142,87,0.32); }
        .pt-editor-btn-secondary { background: rgba(13,31,60,0.08); color: var(--navy); }
        .pt-editor-btn-danger { background: linear-gradient(135deg, #B42318 0%, #D92D20 100%); color: #fff; border: 1px solid rgba(185,28,28,0.24); }
        .pt-editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .pt-editor-card { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.08); }
        .pt-editor-card-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
        .pt-editor-card h4 { font-size: 18px; margin-bottom: 8px; color: var(--navy); }
        .pt-editor-card p { color: var(--ink-3); line-height: 1.7; }
        .pt-editor-quick-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 6px; }
        .pt-editor-quick-list div { background: var(--off); border: 1px solid var(--ink-line); border-radius: 12px; padding: 12px; }
        .pt-editor-quick-list strong { display: block; font-size: 22px; color: var(--navy); }
        .pt-editor-quick-list span { font-size: 12px; color: var(--ink-3); }
        .pt-editor-actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .pt-editor-sections { display: grid; gap: 14px; }
        .pt-editor-section { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.06); }
        .pt-editor-section-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding-bottom: 12px; margin-bottom: 14px; border-bottom: 1px solid var(--ink-line); }
        .pt-editor-section-header-accordion { align-items: center; }
        .pt-editor-section-toggle { border: none; background: transparent; width: 100%; display: flex; justify-content: space-between; align-items: center; text-align: left; cursor: pointer; padding: 0; }
        .pt-editor-toggle-icon { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--ink-line); display: inline-flex; align-items: center; justify-content: center; color: var(--ink-3); }
        .pt-editor-section-kicker { font-size: 11px; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
        .pt-editor-section-header h4 { color: var(--ink-3); font-size: 14px; font-weight: 500; }
        .pt-editor-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .pt-editor-stack { display: grid; gap: 10px; }
        .pt-editor-repeat-card { border: 1px solid var(--ink-line); border-radius: 14px; padding: 12px; background: var(--off); display: grid; gap: 10px; }
        .pt-editor-repeat-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .pt-editor-item-head { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
        .pt-editor-item-toggle { border: none; background: transparent; text-align: left; padding: 0; cursor: pointer; display: flex; justify-content: space-between; gap: 10px; width: 100%; }
        .pt-editor-item-title { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
        .pt-editor-item-subtitle { color: var(--ink); font-weight: 600; font-size: 14px; line-height: 1.5; }
        .pt-editor-item-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .pt-editor-field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px; }
        .pt-editor-input, .pt-editor-textarea, .pt-editor-select { width: 100%; border: 1px solid var(--ink-line); border-radius: 10px; padding: 11px 12px; background: #fff; color: var(--ink); font-size: 13px; }
        .pt-editor-hidden-input { display: none; }
        .pt-editor-textarea { resize: vertical; min-height: 44px; }
        .pt-editor-inline-add, .pt-editor-icon-btn { border: 1px dashed var(--gold-border); background: rgba(184,135,10,0.07); color: var(--gold); border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; justify-content: center; }
        .pt-editor-icon-btn { border-style: solid; width: 40px; height: 40px; padding: 0; }
        .pt-editor-span-2 { grid-column: span 2; }
        .pt-editor-asset-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 8px; }
        .pt-editor-upload-label { position: relative; overflow: hidden; }
        @media (max-width: 980px) {
          .pt-editor-grid, .pt-editor-form-grid, .pt-editor-repeat-grid { grid-template-columns: 1fr; }
          .pt-editor-span-2 { grid-column: span 1; }
          .pt-editor-asset-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .pt-editor-banner { flex-direction: column; align-items: flex-start; }
          .pt-editor-item-head { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
