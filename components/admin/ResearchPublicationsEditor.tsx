'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, CloudOff, Database, Plus, RefreshCw, Save, Shield, Sparkles, Trash2 } from 'lucide-react'

import {
  RESEARCH_ICON_OPTIONS,
  RESEARCH_PUBLICATIONS_SECTION_KEYS,
  RESEARCH_PUBLICATIONS_SECTION_META,
  STATIC_RESEARCH_PUBLICATIONS_CONTENT,
  createDefaultResearchPaper,
  createDefaultThesisDetail,
  normalizeResearchPublicationsContent,
  type ResearchIconKey,
  type ResearchPaperRaw,
  type ResearchPublicationsContentRaw,
  type ResearchPublicationsSectionKey,
} from '@/lib/researchPublicationsContent'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<ResearchPublicationsContentRaw>
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
  info: { confirmButtonColor: '#0D1F3C', iconColor: '#2D5B8A' },
}

const joinLines = (items: string[]) => items.join('\n')
const splitLines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="rp-editor-field-label">{children}</p>
}

function TextField({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input className="rp-editor-input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className="rp-editor-textarea" value={value} placeholder={placeholder} rows={rows} onChange={(event) => onChange(event.target.value)} />
}

function ColorField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const colorValue = value?.trim() || '#0D1F3C'

  return (
    <div className="rp-editor-color-field">
      <input className="rp-editor-color-swatch" type="color" value={colorValue} aria-label="Color picker" onChange={(event) => onChange(event.target.value)} />
      <TextField value={value} onChange={onChange} placeholder="#0D1F3C" />
    </div>
  )
}

function SelectField<T extends string>({ value, options, onChange, ariaLabel }: { value: T; options: T[]; onChange: (value: T) => void; ariaLabel: string }) {
  return (
    <select className="rp-editor-select" value={value} onChange={(event) => onChange(event.target.value as T)} aria-label={ariaLabel}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function IconSelect({ value, onChange, ariaLabel }: { value: ResearchIconKey; onChange: (value: ResearchIconKey) => void; ariaLabel: string }) {
  return (
    <select className="rp-editor-select" value={value} onChange={(event) => onChange(event.target.value as ResearchIconKey)} aria-label={ariaLabel}>
      {RESEARCH_ICON_OPTIONS.map((option) => (
        <option key={option.key} value={option.key}>
          {option.label}
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
  sectionKey: ResearchPublicationsSectionKey
  saving: boolean
  onSave: () => void
}) {
  const meta = RESEARCH_PUBLICATIONS_SECTION_META[sectionKey]

  return (
    <div className="rp-editor-section-header">
      <div>
        <p className="rp-editor-section-kicker">{meta.label}</p>
        <h4>{meta.description}</h4>
      </div>
      <button type="button" className="rp-editor-btn rp-editor-btn-primary" onClick={onSave} disabled={saving}>
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
  sectionKey: ResearchPublicationsSectionKey
  expandedSection: ResearchPublicationsSectionKey | null
  onToggle: (key: ResearchPublicationsSectionKey) => void
  onSave: () => void
  saving: boolean
  showSave?: boolean
}) {
  const meta = RESEARCH_PUBLICATIONS_SECTION_META[sectionKey]
  const open = expandedSection === sectionKey

  return (
    <div className="rp-editor-section-header rp-editor-section-header-accordion">
      <button type="button" className="rp-editor-section-toggle" onClick={() => onToggle(sectionKey)}>
        <div>
          <p className="rp-editor-section-kicker">{meta.label}</p>
          <h4>{meta.description}</h4>
        </div>
        <span className="rp-editor-toggle-icon">{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
      </button>
      {showSave ? (
        <button type="button" className="rp-editor-btn rp-editor-btn-primary" onClick={onSave} disabled={saving}>
          <Save size={14} /> {saving ? 'Saving...' : 'Save section'}
        </button>
      ) : null}
    </div>
  )
}

export default function ResearchPublicationsEditor() {
  const [content, setContent] = useState<ResearchPublicationsContentRaw>(() => normalizeResearchPublicationsContent(STATIC_RESEARCH_PUBLICATIONS_CONTENT))
  const [source, setSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [statusMessage, setStatusMessage] = useState<string>('Loading research publications content...')
  const [savingSection, setSavingSection] = useState<ResearchPublicationsSectionKey | 'all' | null>(null)
  const [expandedSection, setExpandedSection] = useState<ResearchPublicationsSectionKey | null>('hero')
  const [expandedPaperKey, setExpandedPaperKey] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/research-publications-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeResearchPublicationsContent(payload.content || STATIC_RESEARCH_PUBLICATIONS_CONTENT))
        setSource(payload.source || 'backup')
        setStatusMessage(payload.source === 'supabase' ? 'Research publications loaded from Supabase.' : payload.message || 'Backup content is active.')
      } catch {
        if (!active) {
          return
        }

        setContent(normalizeResearchPublicationsContent(STATIC_RESEARCH_PUBLICATIONS_CONTENT))
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

  const setSection = <K extends ResearchPublicationsSectionKey>(sectionKey: K, nextValue: ResearchPublicationsContentRaw[K]) => {
    setContent((current) => ({
      ...current,
      [sectionKey]: nextValue,
    }))
  }

  const saveSection = async <K extends ResearchPublicationsSectionKey>(sectionKey: K) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/research-publications-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: content[sectionKey] } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[research-publications-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeResearchPublicationsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage(`${RESEARCH_PUBLICATIONS_SECTION_META[sectionKey].label} section saved to Supabase.`)
      await showAlert('success', 'Saved', `${RESEARCH_PUBLICATIONS_SECTION_META[sectionKey].label} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the research publications API.')
    } finally {
      setSavingSection(null)
    }
  }

  const saveSectionWithValue = async <K extends ResearchPublicationsSectionKey>(sectionKey: K, sectionValue: ResearchPublicationsContentRaw[K]) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/research-publications-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: sectionValue } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[research-publications-editor] Save failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeResearchPublicationsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage(`${RESEARCH_PUBLICATIONS_SECTION_META[sectionKey].label} section saved to Supabase.`)
      await showAlert('success', 'Saved', `${RESEARCH_PUBLICATIONS_SECTION_META[sectionKey].label} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the research publications API.')
    } finally {
      setSavingSection(null)
    }
  }

  const confirmAndSaveSectionValue = async <K extends ResearchPublicationsSectionKey>(sectionKey: K, sectionValue: ResearchPublicationsContentRaw[K], title: string, text: string) => {
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
      const response = await fetch('/api/research-publications-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-all', content }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[research-publications-editor] Sync failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Sync failed', payload.message || 'Unable to sync publications content.')
        return
      }

      setContent(normalizeResearchPublicationsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('All research publications content synced to Supabase.')
      await showAlert('success', 'Synced', 'All publication content has been synced.')
    } catch {
      await showAlert('error', 'Sync failed', 'Unable to reach the research publications API.')
    } finally {
      setSavingSection(null)
    }
  }

  const restoreBackup = async () => {
    setContent(normalizeResearchPublicationsContent(STATIC_RESEARCH_PUBLICATIONS_CONTENT))
    await syncAll()
  }

  const deleteOverride = async () => {
    if (savingSection) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete publications override?',
      text: 'The page will fall back to app/Database/Researchdata.ts.',
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
      const response = await fetch('/api/research-publications-content', { method: 'DELETE' })
      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        console.error('[research-publications-editor] Delete failed:', payload.message || 'Unknown error')
        await showAlert('error', 'Delete failed', payload.message || 'Unable to remove override.')
        return
      }

      setContent(normalizeResearchPublicationsContent(payload.content || STATIC_RESEARCH_PUBLICATIONS_CONTENT))
      setSource('backup')
      setStatusMessage('Override deleted. Backup content is active.')
      await showAlert('success', 'Deleted', 'Publications override deleted. Backup file is active.')
    } catch {
      await showAlert('error', 'Delete failed', 'Unable to reach the research publications API.')
    } finally {
      setSavingSection(null)
    }
  }

  const updatePaper = (index: number, nextPaper: ResearchPaperRaw) => {
    setSection('papers', content.papers.map((paper, paperIndex) => (paperIndex === index ? nextPaper : paper)))
  }

  return (
    <div className="rp-editor-shell">
      <div className="rp-editor-banner">
        <div>
          <p className="rp-editor-kicker">Research Publications Manager</p>
          <h3>Supabase first, static Researchdata.ts always available</h3>
          <p>{statusMessage}</p>
        </div>

        <div className="rp-editor-banner-actions">
          <div className={`rp-editor-source rp-editor-source-${source}`}>
            {source === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
            <span>{source === 'supabase' ? 'Supabase live' : 'Backup active'}</span>
          </div>
          <button type="button" className="rp-editor-btn rp-editor-btn-primary" onClick={syncAll} disabled={savingSection === 'all'}>
            <Save size={14} /> {savingSection === 'all' ? 'Syncing...' : 'Sync all sections'}
          </button>
        </div>
      </div>

      <div className="rp-editor-grid">
        <motion.div className="rp-editor-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="rp-editor-card-kicker">
            <Shield size={13} /> Backup strategy
          </p>
          <h4>Public page falls back to TS data if DB is unavailable.</h4>
          <p>Deleting the DB override only removes remote data. The static file remains the source of truth fallback.</p>
        </motion.div>

        <motion.div className="rp-editor-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.04 }}>
          <p className="rp-editor-card-kicker">
            <Sparkles size={13} /> Quick facts
          </p>
          <div className="rp-editor-quick-list">
            <div><strong>{content.papers.length}</strong><span>papers</span></div>
            <div><strong>{content.thesis.details.length}</strong><span>thesis details</span></div>
            <div><strong>{content.thesis.tags.length}</strong><span>thesis tags</span></div>
            <div><strong>{content.filterTypes.length}</strong><span>filter tabs</span></div>
          </div>
        </motion.div>
      </div>

      <div className="rp-editor-actions-row">
        <button type="button" className="rp-editor-btn rp-editor-btn-secondary" onClick={restoreBackup} disabled={Boolean(savingSection)}>
          <RefreshCw size={14} /> Restore backup
        </button>
        <button type="button" className="rp-editor-btn rp-editor-btn-danger" onClick={deleteOverride} disabled={Boolean(savingSection)}>
          <Trash2 size={14} /> Delete from DB
        </button>
      </div>

      <div className="rp-editor-sections">
        <section className="rp-editor-section">
          <SectionToggleHeader sectionKey="hero" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('hero')} saving={savingSection === 'hero'} />
          {expandedSection === 'hero' ? <div className="rp-editor-form-grid">
            <div><FieldLabel>Kicker</FieldLabel><TextField value={content.hero.kicker} onChange={(value) => setSection('hero', { ...content.hero, kicker: value })} /></div>
            <div><FieldLabel>Title prefix</FieldLabel><TextField value={content.hero.titlePrefix} onChange={(value) => setSection('hero', { ...content.hero, titlePrefix: value })} /></div>
            <div><FieldLabel>Title emphasis</FieldLabel><TextField value={content.hero.titleEmphasis} onChange={(value) => setSection('hero', { ...content.hero, titleEmphasis: value })} /></div>
            <div className="rp-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.hero.description} rows={4} onChange={(value) => setSection('hero', { ...content.hero, description: value })} /></div>
          </div> : null}
        </section>

        <section className="rp-editor-section">
          <SectionToggleHeader sectionKey="stats" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('stats')} saving={savingSection === 'stats'} />
          {expandedSection === 'stats' ? <div className="rp-editor-form-grid">
            <div><FieldLabel>Total publications</FieldLabel><TextField value={content.stats.totalPublications} onChange={(value) => setSection('stats', { ...content.stats, totalPublications: value })} /></div>
            <div><FieldLabel>Journal papers</FieldLabel><TextField value={content.stats.journalPapers} onChange={(value) => setSection('stats', { ...content.stats, journalPapers: value })} /></div>
            <div><FieldLabel>Conference papers</FieldLabel><TextField value={content.stats.conferencePapers} onChange={(value) => setSection('stats', { ...content.stats, conferencePapers: value })} /></div>
            <div><FieldLabel>Review articles</FieldLabel><TextField value={content.stats.reviewArticles} onChange={(value) => setSection('stats', { ...content.stats, reviewArticles: value })} /></div>
          </div> : null}
        </section>

        <section className="rp-editor-section">
          <SectionToggleHeader sectionKey="papers" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('papers')} saving={savingSection === 'papers'} showSave={false} />
          {expandedSection === 'papers' ? <div className="rp-editor-stack">
            {content.papers.map((paper, index) => {
              const paperKey = `${paper.id}-${index}`
              const isOpen = expandedPaperKey === paperKey
              return (
                <div key={paperKey} className="rp-editor-repeat-card">
                  <div className="rp-editor-item-head">
                    <button type="button" className="rp-editor-item-toggle" onClick={() => setExpandedPaperKey(isOpen ? null : paperKey)}>
                      <div>
                        <p className="rp-editor-item-title">Paper {index + 1}</p>
                        <p className="rp-editor-item-subtitle">{paper.title || 'Untitled paper'}</p>
                      </div>
                      <span className="rp-editor-toggle-icon">{isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
                    </button>
                    <div className="rp-editor-item-actions">
                      <button type="button" className="rp-editor-btn rp-editor-btn-primary" onClick={() => saveSection('papers')} disabled={Boolean(savingSection)}>
                        <Save size={14} /> {savingSection === 'papers' ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" className="rp-editor-btn rp-editor-btn-danger" onClick={() => void confirmAndSaveSectionValue('papers', content.papers.filter((_, paperIndex) => paperIndex !== index), 'Delete this paper?', 'This will remove the paper from Supabase and every page that uses it.') }>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>

                  {isOpen ? <div className="rp-editor-repeat-grid">
                    <div><FieldLabel>Title</FieldLabel><TextField value={paper.title} onChange={(value) => updatePaper(index, { ...paper, title: value })} /></div>
                    <div><FieldLabel>Authors</FieldLabel><TextField value={paper.authors} onChange={(value) => updatePaper(index, { ...paper, authors: value })} /></div>
                    <div><FieldLabel>Venue</FieldLabel><TextField value={paper.venue} onChange={(value) => updatePaper(index, { ...paper, venue: value })} /></div>
                    <div><FieldLabel>URL</FieldLabel><TextField value={paper.url} onChange={(value) => updatePaper(index, { ...paper, url: value })} /></div>
                    <div><FieldLabel>Type</FieldLabel><SelectField value={paper.type} ariaLabel="Publication type" options={['Journal', 'Conference', 'Review']} onChange={(value) => updatePaper(index, { ...paper, type: value })} /></div>
                    <div><FieldLabel>Year</FieldLabel><TextField value={`${paper.year}`} onChange={(value) => updatePaper(index, { ...paper, year: Number(value) || paper.year })} /></div>
                    <div><FieldLabel>Month</FieldLabel><TextField value={paper.month} onChange={(value) => updatePaper(index, { ...paper, month: value })} /></div>
                    <div><FieldLabel>Icon</FieldLabel><IconSelect value={paper.iconKey} ariaLabel="Publication icon" onChange={(value) => updatePaper(index, { ...paper, iconKey: value })} /></div>
                    <div><FieldLabel>Color</FieldLabel><ColorField value={paper.color} onChange={(value) => updatePaper(index, { ...paper, color: value })} /></div>
                    <div><FieldLabel>Volume</FieldLabel><TextField value={paper.volume || ''} onChange={(value) => updatePaper(index, { ...paper, volume: value })} /></div>
                    <div><FieldLabel>ISSN</FieldLabel><TextField value={paper.issn || ''} onChange={(value) => updatePaper(index, { ...paper, issn: value })} /></div>
                    <div><FieldLabel>DOI</FieldLabel><TextField value={paper.doi || ''} onChange={(value) => updatePaper(index, { ...paper, doi: value })} /></div>
                    <div><FieldLabel>Pages</FieldLabel><TextField value={paper.pages || ''} onChange={(value) => updatePaper(index, { ...paper, pages: value })} /></div>
                    <div className="rp-editor-span-2"><FieldLabel>Tags (one per line)</FieldLabel><TextArea value={joinLines(paper.tags)} rows={3} onChange={(value) => updatePaper(index, { ...paper, tags: splitLines(value) })} /></div>
                  </div> : null}
                </div>
              )
            })}

            <button type="button" className="rp-editor-inline-add" onClick={() => setSection('papers', [...content.papers, createDefaultResearchPaper()])}>
              <Plus size={14} /> Add publication
            </button>
          </div> : null}
        </section>

        <section className="rp-editor-section">
          <SectionToggleHeader sectionKey="thesis" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('thesis')} saving={savingSection === 'thesis'} />
          {expandedSection === 'thesis' ? <>
          <div className="rp-editor-form-grid">
            <div><FieldLabel>Label</FieldLabel><TextField value={content.thesis.label} onChange={(value) => setSection('thesis', { ...content.thesis, label: value })} /></div>
            <div className="rp-editor-span-2"><FieldLabel>Title</FieldLabel><TextArea value={content.thesis.title} rows={2} onChange={(value) => setSection('thesis', { ...content.thesis, title: value })} /></div>
            <div className="rp-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.thesis.description} rows={4} onChange={(value) => setSection('thesis', { ...content.thesis, description: value })} /></div>
            <div className="rp-editor-span-2"><FieldLabel>Tags (one per line)</FieldLabel><TextArea value={joinLines(content.thesis.tags)} rows={3} onChange={(value) => setSection('thesis', { ...content.thesis, tags: splitLines(value) })} /></div>
          </div>

          <div className="rp-editor-stack rp-editor-stack-spaced">
            {content.thesis.details.map((detail, index) => (
              <div key={`${detail.k}-${index}`} className="rp-editor-repeat-row">
                <div><FieldLabel>Key</FieldLabel><TextField value={detail.k} onChange={(value) => setSection('thesis', { ...content.thesis, details: content.thesis.details.map((item, itemIndex) => (itemIndex === index ? { ...item, k: value } : item)) })} /></div>
                <div><FieldLabel>Value</FieldLabel><TextField value={detail.v} onChange={(value) => setSection('thesis', { ...content.thesis, details: content.thesis.details.map((item, itemIndex) => (itemIndex === index ? { ...item, v: value } : item)) })} /></div>
                <button type="button" className="rp-editor-icon-btn" title="Remove thesis detail" aria-label="Remove thesis detail" onClick={() => void confirmAndSaveSectionValue('thesis', { ...content.thesis, details: content.thesis.details.filter((_, itemIndex) => itemIndex !== index) }, 'Delete this thesis detail?', 'This will remove the detail from Supabase and every page that uses it.') }>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="rp-editor-inline-add" onClick={() => setSection('thesis', { ...content.thesis, details: [...content.thesis.details, createDefaultThesisDetail()] })}>
              <Plus size={14} /> Add thesis detail
            </button>
          </div>
          </> : null}
        </section>

        <section className="rp-editor-section">
          <SectionToggleHeader sectionKey="cta" expandedSection={expandedSection} onToggle={setExpandedSection} onSave={() => saveSection('cta')} saving={savingSection === 'cta'} />
          {expandedSection === 'cta' ? <div className="rp-editor-form-grid">
            <div><FieldLabel>Title prefix</FieldLabel><TextField value={content.cta.titlePrefix} onChange={(value) => setSection('cta', { ...content.cta, titlePrefix: value })} /></div>
            <div><FieldLabel>Title emphasis</FieldLabel><TextField value={content.cta.titleEmphasis} onChange={(value) => setSection('cta', { ...content.cta, titleEmphasis: value })} /></div>
            <div className="rp-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.cta.description} rows={3} onChange={(value) => setSection('cta', { ...content.cta, description: value })} /></div>
            <div><FieldLabel>Primary label</FieldLabel><TextField value={content.cta.primaryLabel} onChange={(value) => setSection('cta', { ...content.cta, primaryLabel: value })} /></div>
            <div><FieldLabel>Primary href</FieldLabel><TextField value={content.cta.primaryHref} onChange={(value) => setSection('cta', { ...content.cta, primaryHref: value })} /></div>
            <div><FieldLabel>Secondary label</FieldLabel><TextField value={content.cta.secondaryLabel} onChange={(value) => setSection('cta', { ...content.cta, secondaryLabel: value })} /></div>
            <div><FieldLabel>Secondary href</FieldLabel><TextField value={content.cta.secondaryHref} onChange={(value) => setSection('cta', { ...content.cta, secondaryHref: value })} /></div>
          </div> : null}
        </section>
      </div>

      <style>{`
        .rp-editor-shell { display: grid; gap: 14px; }
        .rp-editor-banner { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 18px 20px; border-radius: 18px; background: linear-gradient(145deg, #0D1F3C 0%, #17365f 100%); color: #fff; }
        .rp-editor-kicker { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.68); margin-bottom: 8px; }
        .rp-editor-banner h3 { color: #fff; font-size: 20px; margin-bottom: 6px; }
        .rp-editor-banner p { color: rgba(255,255,255,0.82); line-height: 1.6; }
        .rp-editor-banner-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .rp-editor-source { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
        .rp-editor-source-supabase { background: rgba(26,107,72,0.16); color: #8EE0B5; }
        .rp-editor-source-backup { background: rgba(184,135,10,0.16); color: var(--gold-3); }
        .rp-editor-btn { border: none; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; }
        .rp-editor-btn-primary { background: linear-gradient(135deg, #1A6B48 0%, #0E8E57 100%); color: #fff; border: 1px solid rgba(14,142,87,0.32); }
        .rp-editor-btn-secondary { background: rgba(13,31,60,0.08); color: var(--navy); }
        .rp-editor-btn-danger { background: linear-gradient(135deg, #B42318 0%, #D92D20 100%); color: #fff; border: 1px solid rgba(185,28,28,0.24); }
        .rp-editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .rp-editor-card { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.08); }
        .rp-editor-card-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
        .rp-editor-card h4 { font-size: 18px; margin-bottom: 8px; color: var(--navy); }
        .rp-editor-card p { color: var(--ink-3); line-height: 1.7; }
        .rp-editor-quick-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 6px; }
        .rp-editor-quick-list div { background: var(--off); border: 1px solid var(--ink-line); border-radius: 12px; padding: 12px; }
        .rp-editor-quick-list strong { display: block; font-size: 22px; color: var(--navy); }
        .rp-editor-quick-list span { font-size: 12px; color: var(--ink-3); }
        .rp-editor-actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .rp-editor-sections { display: grid; gap: 14px; }
        .rp-editor-section { background: #fff; border: 1px solid var(--ink-line); border-radius: 18px; padding: 16px; box-shadow: 0 14px 30px rgba(13,31,60,0.06); }
        .rp-editor-section-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding-bottom: 12px; margin-bottom: 14px; border-bottom: 1px solid var(--ink-line); }
        .rp-editor-section-header-accordion { align-items: center; }
        .rp-editor-section-toggle { border: none; background: transparent; width: 100%; display: flex; justify-content: space-between; align-items: center; text-align: left; cursor: pointer; padding: 0; }
        .rp-editor-toggle-icon { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--ink-line); display: inline-flex; align-items: center; justify-content: center; color: var(--ink-3); }
        .rp-editor-section-kicker { font-size: 11px; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
        .rp-editor-section-header h4 { color: var(--ink-3); font-size: 14px; font-weight: 500; }
        .rp-editor-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .rp-editor-stack { display: grid; gap: 10px; }
        .rp-editor-repeat-card { border: 1px solid var(--ink-line); border-radius: 14px; padding: 12px; background: var(--off); display: grid; gap: 10px; }
        .rp-editor-repeat-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .rp-editor-repeat-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; gap: 10px; align-items: end; padding: 12px; border-radius: 14px; border: 1px solid var(--ink-line); background: var(--off); }
        .rp-editor-item-head { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
        .rp-editor-item-toggle { border: none; background: transparent; text-align: left; cursor: pointer; padding: 0; display: flex; justify-content: space-between; gap: 10px; width: 100%; }
        .rp-editor-item-title { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
        .rp-editor-item-subtitle { color: var(--ink); font-weight: 600; font-size: 14px; line-height: 1.5; }
        .rp-editor-item-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .rp-editor-field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px; }
        .rp-editor-input, .rp-editor-textarea, .rp-editor-select { width: 100%; border: 1px solid var(--ink-line); border-radius: 10px; padding: 11px 12px; background: #fff; color: var(--ink); font-size: 13px; }
        .rp-editor-color-field { display: grid; grid-template-columns: 54px minmax(0, 1fr); gap: 10px; align-items: center; }
        .rp-editor-color-swatch { width: 54px; height: 46px; border-radius: 12px; border: 1px solid var(--ink-line); background: #fff; padding: 3px; cursor: pointer; }
        .rp-editor-stack-spaced { margin-top: 12px; }
        .rp-editor-textarea { resize: vertical; min-height: 44px; }
        .rp-editor-inline-add, .rp-editor-icon-btn { border: 1px dashed var(--gold-border); background: rgba(184,135,10,0.07); color: var(--gold); border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; justify-content: center; }
        .rp-editor-icon-btn { border-style: solid; width: 40px; height: 40px; padding: 0; }
        .rp-editor-span-2 { grid-column: span 2; }
        @media (max-width: 980px) {
          .rp-editor-grid, .rp-editor-form-grid, .rp-editor-repeat-grid { grid-template-columns: 1fr; }
          .rp-editor-span-2 { grid-column: span 1; }
        }
        @media (max-width: 640px) {
          .rp-editor-banner { flex-direction: column; align-items: flex-start; }
          .rp-editor-repeat-row { grid-template-columns: 1fr; }
          .rp-editor-item-head { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
