'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Database, Plus, RefreshCw, Save, Trash2, Upload } from 'lucide-react'

import {
  TEACHING_ICON_OPTIONS,
  getTeachingSnapshot,
  type TeachingAdminRoleItem,
  type TeachingContentRaw,
  type TeachingImpactStat,
  type TeachingInstitutionItem,
  type TeachingPedagogyItem,
  type TeachingSectionKey,
  type TeachingSubjectsItem,
} from '@/lib/teachingContent'

type ApiResponse = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  message?: string
  content?: Partial<TeachingContentRaw>
}

const iconOptions = TEACHING_ICON_OPTIONS.map((item) => item.key)

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="teach-editor-field-label">{children}</p>
}

function TextField({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return <input className="teach-editor-input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
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
  return <textarea className="teach-editor-textarea" value={value} placeholder={placeholder} rows={rows} onChange={(event) => onChange(event.target.value)} />
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
  ariaLabel: string
}) {
  return (
    <select className="teach-editor-select" value={value} onChange={(event) => onChange(event.target.value as T)} aria-label={ariaLabel}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function ColorField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const colorValue = value?.trim() || '#0D1F3C'

  return (
    <div className="teach-editor-color-field">
      <input className="teach-editor-color-swatch" type="color" value={colorValue} aria-label="Color picker" onChange={(event) => onChange(event.target.value)} />
      <TextField value={value} onChange={onChange} placeholder="#0D1F3C" />
    </div>
  )
}

function SectionCard({
  sectionKey,
  title,
  subtitle,
  expandedSection,
  onToggle,
  children,
}: {
  sectionKey: TeachingSectionKey
  title: string
  subtitle: string
  expandedSection: TeachingSectionKey | null
  onToggle: (sectionKey: TeachingSectionKey) => void
  children: ReactNode
}) {
  const isOpen = expandedSection === sectionKey

  return (
    <motion.section className={`teach-editor-card ${isOpen ? 'teach-editor-card-open' : ''}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <button type="button" className="teach-editor-card-head" onClick={() => onToggle(sectionKey)}>
        <div>
          <p className="teach-editor-section-kicker">{title}</p>
          <h4>{subtitle}</h4>
        </div>
        <span className="teach-editor-card-chevron">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      {isOpen ? <div className="teach-editor-card-body">{children}</div> : null}
    </motion.section>
  )
}

const parseCsv = (value: string): string[] =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

const toCsv = (values?: string[] | null) => (Array.isArray(values) ? values.join(', ') : '')

export default function TeachingEditor() {
  const [content, setContent] = useState<TeachingContentRaw>(() => getTeachingSnapshot())
  const [source, setSource] = useState<'supabase' | 'backup'>('backup')
  const [status, setStatus] = useState('Loading teaching content...')
  const [busyKey, setBusyKey] = useState<string | null>('load')
  const [expandedSection, setExpandedSection] = useState<TeachingSectionKey | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const disabled = Boolean(busyKey)

  const loadContent = async () => {
    setBusyKey('load')
    try {
      const res = await fetch('/api/teaching-content', { cache: 'no-store' })
      const data = (await res.json()) as ApiResponse

      if (!res.ok || !data.ok || !data.content) {
        throw new Error(data.message || 'Failed to load teaching content.')
      }

      setContent(getTeachingSnapshot(data.content))
      setSource(data.source || 'backup')
      setStatus(`Loaded from ${data.source || 'backup'}.`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to load teaching content.')
    } finally {
      setBusyKey(null)
    }
  }

  useEffect(() => {
    void loadContent()
  }, [])

  const saveSection = async (sectionKey: TeachingSectionKey, sectionValue?: TeachingContentRaw[TeachingSectionKey]) => {
    setBusyKey(sectionKey)
    setStatus(`Saving ${sectionKey}...`)
    try {
      const res = await fetch('/api/teaching-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: sectionValue ?? content[sectionKey] } }),
      })
      const data = (await res.json()) as ApiResponse
      if (!res.ok || !data.ok || !data.content) {
        throw new Error(data.message || `Failed to save ${sectionKey}.`)
      }

      setContent(getTeachingSnapshot(data.content))
      setSource(data.source || 'backup')
      setStatus(`${sectionKey} saved successfully.`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : `Unable to save ${sectionKey}.`)
    } finally {
      setBusyKey(null)
    }
  }

  const syncAll = async () => {
    setBusyKey('sync-all')
    setStatus('Syncing all sections...')
    try {
      const res = await fetch('/api/teaching-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-all', content }),
      })
      const data = (await res.json()) as ApiResponse
      if (!res.ok || !data.ok || !data.content) {
        throw new Error(data.message || 'Unable to sync all sections.')
      }

      setContent(getTeachingSnapshot(data.content))
      setSource(data.source || 'backup')
      setStatus('All sections synced successfully.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to sync all sections.')
    } finally {
      setBusyKey(null)
    }
  }

  const restoreBackup = async () => {
    setBusyKey('restore')
    setStatus('Restoring backup content...')
    try {
      const res = await fetch('/api/teaching-content', { method: 'DELETE' })
      const data = (await res.json()) as ApiResponse
      if (!res.ok || !data.ok || !data.content) {
        throw new Error(data.message || 'Unable to restore backup content.')
      }

      setContent(getTeachingSnapshot(data.content))
      setSource('backup')
      setStatus('Backup restored.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to restore backup content.')
    } finally {
      setBusyKey(null)
    }
  }

  const confirmDelete = async (title: string, text: string) => {
    const Swal = (await import('sweetalert2')).default
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B8870A',
      cancelButtonColor: '#0D1F3C',
      background: '#FFFFFF',
      color: '#0F172A',
    })

    return result.isConfirmed
  }

  const deletePedagogyItem = async (index: number) => {
    if (busyKey) {
      return
    }

    const confirmed = await confirmDelete('Delete pedagogy card?', 'This will remove the card from Supabase and the public page.')
    if (!confirmed) {
      return
    }

    const next = content.pedagogy.filter((_, itemIndex) => itemIndex !== index)
    setContent((current) => ({
      ...current,
      pedagogy: next,
    }))
    await saveSection('pedagogy', next)
  }

  const deleteSubjectItem = async (index: number) => {
    if (busyKey) {
      return
    }

    const confirmed = await confirmDelete('Delete subject?', 'This will remove the subject from Supabase and the public page.')
    if (!confirmed) {
      return
    }

    const nextItems = content.subjects.items.filter((_, itemIndex) => itemIndex !== index)
    const next = { ...content.subjects, items: nextItems }
    setContent((current) => ({
      ...current,
      subjects: next,
    }))
    await saveSection('subjects', next)
  }

  const deleteInstitutionItem = async (institutionId: string) => {
    if (busyKey) {
      return
    }

    const confirmed = await confirmDelete('Delete institution?', 'This will remove the institution from Supabase and the public page.')
    if (!confirmed) {
      return
    }

    const nextItems = content.institutions.items.filter((item) => item.id !== institutionId)
    const next = { ...content.institutions, items: nextItems }
    setContent((current) => ({
      ...current,
      institutions: next,
    }))
    await saveSection('institutions', next)
  }

  const deleteAdminRole = async (index: number) => {
    if (busyKey) {
      return
    }

    const confirmed = await confirmDelete('Delete role?', 'This will remove the role from Supabase and the public page.')
    if (!confirmed) {
      return
    }

    const nextRoles = content.admin.roles.filter((_, itemIndex) => itemIndex !== index)
    const next = { ...content.admin, roles: nextRoles }
    setContent((current) => ({
      ...current,
      admin: next,
    }))
    await saveSection('admin', next)
  }

  const deleteImpactStat = async (index: number) => {
    if (busyKey) {
      return
    }

    const confirmed = await confirmDelete('Delete impact stat?', 'This will remove the stat from Supabase and the public page.')
    if (!confirmed) {
      return
    }

    const nextStats = content.impact.stats.filter((_, itemIndex) => itemIndex !== index)
    const next = { ...content.impact, stats: nextStats }
    setContent((current) => ({
      ...current,
      impact: next,
    }))
    await saveSection('impact', next)
  }

  const deleteOverride = async () => {
    if (busyKey) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete teaching override?',
      text: 'The page will fall back to the static Teaching data file. ',
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

    setBusyKey('delete')
    setStatus('Deleting teaching override...')
    try {
      const res = await fetch('/api/teaching-content', { method: 'DELETE' })
      const data = (await res.json()) as ApiResponse
      if (!res.ok || !data.ok || !data.content) {
        throw new Error(data.message || 'Unable to delete teaching content.')
      }

      setContent(getTeachingSnapshot(data.content))
      setSource('backup')
      setStatus('Teaching override deleted. Backup content is active.')
      await Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Teaching now uses the backup file.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0D1F3C',
        background: '#FFFFFF',
        color: '#0F172A',
      })
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to delete teaching content.')
    } finally {
      setBusyKey(null)
    }
  }

  const uploadInstitutionDocument = async (institutionId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('institutionId', institutionId)

    setBusyKey(`upload-${institutionId}`)
    setStatus('Uploading teaching document...')

    try {
      const res = await fetch('/api/teaching-content/assets', { method: 'POST', body: formData })
      const data = (await res.json()) as ApiResponse
      if (!res.ok || !data.ok || !data.content) {
        throw new Error(data.message || 'Unable to upload teaching document.')
      }

      setContent(getTeachingSnapshot(data.content))
      setSource(data.source || 'backup')
      setStatus(data.message || 'Document uploaded successfully.')
      if (fileInputRefs.current[institutionId]) {
        fileInputRefs.current[institutionId]!.value = ''
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to upload teaching document.')
    } finally {
      setBusyKey(null)
    }
  }

  const updatePedagogyItem = (index: number, patch: Partial<TeachingPedagogyItem>) => {
    setContent((prev) => ({
      ...prev,
      pedagogy: prev.pedagogy.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  const updateSubjectItem = (index: number, patch: Partial<TeachingSubjectsItem>) => {
    setContent((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        items: prev.subjects.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }))
  }

  const updateInstitutionItem = (id: string, patch: Partial<TeachingInstitutionItem>) => {
    setContent((prev) => ({
      ...prev,
      institutions: {
        ...prev.institutions,
        items: prev.institutions.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      },
    }))
  }

  const updateAdminRole = (index: number, patch: Partial<TeachingAdminRoleItem>) => {
    setContent((prev) => ({
      ...prev,
      admin: {
        ...prev.admin,
        roles: prev.admin.roles.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }))
  }

  const updateImpactStat = (index: number, patch: Partial<TeachingImpactStat>) => {
    setContent((prev) => ({
      ...prev,
      impact: {
        ...prev.impact,
        stats: prev.impact.stats.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }))
  }

  const toggleSection = (sectionKey: TeachingSectionKey) => {
    setExpandedSection((current) => (current === sectionKey ? null : sectionKey))
  }

  return (
    <div className="teach-editor-shell">
      <div className="teach-editor-banner">
        <div>
          <p className="teach-editor-kicker">Teaching Manager</p>
          <h3>Supabase first, teaching backup content always available</h3>
          <p className="teach-editor-source">Source: {source}</p>
          <p>{status}</p>
        </div>
        <div className="teach-editor-banner-actions">

          <button type="button" disabled={disabled} onClick={() => void restoreBackup()} className="teach-editor-btn bg-amber-200 text-[#0d1f3c]">
            <RefreshCw size={14} /> Restore backup
          </button>
          <button type="button" disabled={disabled} onClick={() => void deleteOverride()} className="teach-editor-btn teach-editor-btn-danger">
            <Trash2 size={14} /> Delete from DB
          </button>
          <button type="button" disabled={disabled} onClick={() => void syncAll()} className="teach-editor-btn teach-editor-btn-primary">
            <Database size={14} /> {busyKey === 'sync-all' ? 'Syncing...' : 'Sync all'}
          </button>
        </div>
      </div>

      <div className="teach-editor-grid">
        <SectionCard sectionKey="hero" title="Hero" subtitle="Headline, quote and opening details" expandedSection={expandedSection} onToggle={toggleSection}>
          <div className="teach-editor-fields teach-editor-fields-grid">
            <label><FieldLabel>Kicker</FieldLabel><TextField value={content.hero.kicker} onChange={(value) => setContent((p) => ({ ...p, hero: { ...p.hero, kicker: value } }))} /></label>
            <label><FieldLabel>Title lead</FieldLabel><TextField value={content.hero.titleLead} onChange={(value) => setContent((p) => ({ ...p, hero: { ...p.hero, titleLead: value } }))} /></label>
            <label><FieldLabel>Title emphasis</FieldLabel><TextField value={content.hero.titleEmphasis} onChange={(value) => setContent((p) => ({ ...p, hero: { ...p.hero, titleEmphasis: value } }))} /></label>
            <label className="teach-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.hero.description} onChange={(value) => setContent((p) => ({ ...p, hero: { ...p.hero, description: value } }))} rows={4} /></label>
            <label className="teach-editor-span-2"><FieldLabel>Quote</FieldLabel><TextArea value={content.hero.quote} onChange={(value) => setContent((p) => ({ ...p, hero: { ...p.hero, quote: value } }))} rows={3} /></label>
            <label><FieldLabel>Quote author</FieldLabel><TextField value={content.hero.quoteAuthor} onChange={(value) => setContent((p) => ({ ...p, hero: { ...p.hero, quoteAuthor: value } }))} /></label>
          </div>
          <div className="teach-editor-actions-row">
            <button type="button" className="teach-editor-btn teach-editor-btn-primary" onClick={() => void saveSection('hero')} disabled={disabled}>
              <Save size={14} /> {busyKey === 'hero' ? 'Saving...' : 'Save hero'}
            </button>
          </div>
        </SectionCard>

        <SectionCard sectionKey="identity" title="Identity" subtitle="Intro paragraphs and credentials" expandedSection={expandedSection} onToggle={toggleSection}>
          <div className="teach-editor-fields teach-editor-fields-grid">
            <label><FieldLabel>Kicker</FieldLabel><TextField value={content.identity.kicker} onChange={(value) => setContent((p) => ({ ...p, identity: { ...p.identity, kicker: value } }))} /></label>
            <label><FieldLabel>Title lead</FieldLabel><TextField value={content.identity.titleLead} onChange={(value) => setContent((p) => ({ ...p, identity: { ...p.identity, titleLead: value } }))} /></label>
            <label><FieldLabel>Title emphasis</FieldLabel><TextField value={content.identity.titleEmphasis} onChange={(value) => setContent((p) => ({ ...p, identity: { ...p.identity, titleEmphasis: value } }))} /></label>
            <label className="teach-editor-span-2"><FieldLabel>Paragraph 1</FieldLabel><TextArea value={content.identity.paragraph1} onChange={(value) => setContent((p) => ({ ...p, identity: { ...p.identity, paragraph1: value } }))} rows={4} /></label>
            <label className="teach-editor-span-2"><FieldLabel>Paragraph 2</FieldLabel><TextArea value={content.identity.paragraph2} onChange={(value) => setContent((p) => ({ ...p, identity: { ...p.identity, paragraph2: value } }))} rows={4} /></label>
            <label className="teach-editor-span-2"><FieldLabel>Credentials (comma separated)</FieldLabel><TextField value={toCsv(content.identity.credentials)} onChange={(value) => setContent((p) => ({ ...p, identity: { ...p.identity, credentials: parseCsv(value) } }))} /></label>
          </div>
          <div className="teach-editor-actions-row">
            <button type="button" className="teach-editor-btn teach-editor-btn-primary" onClick={() => void saveSection('identity')} disabled={disabled}>
              <Save size={14} /> {busyKey === 'identity' ? 'Saving...' : 'Save identity'}
            </button>
          </div>
        </SectionCard>

        <SectionCard sectionKey="pedagogy" title="Pedagogy" subtitle="Teaching approach cards" expandedSection={expandedSection} onToggle={toggleSection}>
          <div className="teach-editor-list">
            {content.pedagogy.map((item, index) => (
              <div key={`ped-${index}`} className="teach-editor-item">
                <div className="teach-editor-fields teach-editor-fields-grid">
                  <label><FieldLabel>Icon</FieldLabel><SelectField value={item.iconKey} options={iconOptions} onChange={(value) => updatePedagogyItem(index, { iconKey: value })} ariaLabel="Pedagogy icon" /></label>
                  <label><FieldLabel>Title</FieldLabel><TextField value={item.title} onChange={(value) => updatePedagogyItem(index, { title: value })} /></label>
                  <label className="teach-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={item.desc} onChange={(value) => updatePedagogyItem(index, { desc: value })} rows={3} /></label>
                </div>
                <div className="teach-editor-item-actions">
                  <button type="button" className="teach-editor-btn teach-editor-btn-primary" onClick={() => void saveSection('pedagogy')} disabled={disabled}>
                    <Save size={14} /> {busyKey === 'pedagogy' ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="teach-editor-btn teach-editor-btn-danger" onClick={() => void deletePedagogyItem(index)}>
                    <Trash2 size={14} /> Delete card
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="teach-editor-actions-row">
            <button type="button" className="teach-editor-btn teach-editor-btn-secondary" onClick={() => setContent((prev) => ({ ...prev, pedagogy: [...prev.pedagogy, { iconKey: 'target', icon: prev.pedagogy[0]?.icon, title: '', desc: '' }] }))}>
              <Plus size={14} /> Add card
            </button>
          </div>
        </SectionCard>

        <SectionCard sectionKey="subjects" title="Subjects" subtitle="Subjects, levels and tags" expandedSection={expandedSection} onToggle={toggleSection}>
          <div className="teach-editor-fields teach-editor-fields-grid">
            <label><FieldLabel>Kicker</FieldLabel><TextField value={content.subjects.kicker} onChange={(value) => setContent((p) => ({ ...p, subjects: { ...p.subjects, kicker: value } }))} /></label>
            <label><FieldLabel>Title lead</FieldLabel><TextField value={content.subjects.titleLead} onChange={(value) => setContent((p) => ({ ...p, subjects: { ...p.subjects, titleLead: value } }))} /></label>
            <label><FieldLabel>Title emphasis</FieldLabel><TextField value={content.subjects.titleEmphasis} onChange={(value) => setContent((p) => ({ ...p, subjects: { ...p.subjects, titleEmphasis: value } }))} /></label>
          </div>
          <div className="teach-editor-list">
            {content.subjects.items.map((item, index) => {
              const levelValues = Array.isArray(item.level) ? item.level : []
              return (
                <div key={`sub-${index}`} className="teach-editor-item">
                  <div className="teach-editor-fields teach-editor-fields-grid">
                    <label><FieldLabel>Subject name</FieldLabel><TextField value={item.name} onChange={(value) => updateSubjectItem(index, { name: value })} /></label>
                    <label><FieldLabel>Category</FieldLabel><TextField value={item.cat} onChange={(value) => updateSubjectItem(index, { cat: value as TeachingSubjectsItem['cat'] })} /></label>
                    <label><FieldLabel>Icon</FieldLabel><SelectField value={item.iconKey} options={iconOptions} onChange={(value) => updateSubjectItem(index, { iconKey: value })} ariaLabel="Subject icon" /></label>
                    <label><FieldLabel>Color</FieldLabel><ColorField value={item.color} onChange={(value) => updateSubjectItem(index, { color: value })} /></label>
                    <div className="teach-editor-span-2 teach-editor-checkbox-row">
                      <label><input type="checkbox" checked={levelValues.includes('UG')} onChange={(event) => updateSubjectItem(index, { level: event.target.checked ? Array.from(new Set([...levelValues, 'UG'])) : levelValues.filter((entry) => entry !== 'UG') })} /> UG</label>
                      <label><input type="checkbox" checked={levelValues.includes('PG')} onChange={(event) => updateSubjectItem(index, { level: event.target.checked ? Array.from(new Set([...levelValues, 'PG'])) : levelValues.filter((entry) => entry !== 'PG') })} /> PG</label>
                    </div>
                  </div>
                  <div className="teach-editor-item-actions">
                    <button type="button" className="teach-editor-btn teach-editor-btn-primary" onClick={() => void saveSection('subjects')} disabled={disabled}>
                      <Save size={14} /> {busyKey === 'subjects' ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" className="teach-editor-btn teach-editor-btn-danger" onClick={() => void deleteSubjectItem(index)}>
                      <Trash2 size={14} /> Delete subject
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="teach-editor-actions-row">
            <button
              type="button"
              className="teach-editor-btn teach-editor-btn-secondary"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  subjects: {
                    ...prev.subjects,
                    items: [...prev.subjects.items, { iconKey: 'book', icon: prev.subjects.items[0]?.icon, name: '', cat: 'Core CS', color: '#0D1F3C', level: ['UG'] }],
                  },
                }))
              }
            >
              <Plus size={14} /> Add subject
            </button>
          </div>
        </SectionCard>

        <SectionCard sectionKey="institutions" title="Institutions" subtitle="Roles, highlights and document uploads" expandedSection={expandedSection} onToggle={toggleSection}>
          <div className="teach-editor-fields teach-editor-fields-grid">
            <label><FieldLabel>Kicker</FieldLabel><TextField value={content.institutions.kicker} onChange={(value) => setContent((p) => ({ ...p, institutions: { ...p.institutions, kicker: value } }))} /></label>
            <label><FieldLabel>Title lead</FieldLabel><TextField value={content.institutions.titleLead} onChange={(value) => setContent((p) => ({ ...p, institutions: { ...p.institutions, titleLead: value } }))} /></label>
            <label><FieldLabel>Title emphasis</FieldLabel><TextField value={content.institutions.titleEmphasis} onChange={(value) => setContent((p) => ({ ...p, institutions: { ...p.institutions, titleEmphasis: value } }))} /></label>
          </div>
          <div className="teach-editor-list">
            {content.institutions.items.map((item) => (
              <div key={item.id} className="teach-editor-item">
                <div className="teach-editor-fields teach-editor-fields-grid">
                  <label><FieldLabel>Period</FieldLabel><TextField value={item.period} onChange={(value) => updateInstitutionItem(item.id, { period: value })} /></label>
                  <label><FieldLabel>Role</FieldLabel><TextField value={item.role} onChange={(value) => updateInstitutionItem(item.id, { role: value })} /></label>
                  <label><FieldLabel>Organization</FieldLabel><TextField value={item.org} onChange={(value) => updateInstitutionItem(item.id, { org: value })} /></label>
                  <label><FieldLabel>City</FieldLabel><TextField value={item.city} onChange={(value) => updateInstitutionItem(item.id, { city: value })} /></label>
                  <label><FieldLabel>University</FieldLabel><TextField value={item.univ} onChange={(value) => updateInstitutionItem(item.id, { univ: value })} /></label>
                  <label><FieldLabel>Color</FieldLabel><ColorField value={item.color} onChange={(value) => updateInstitutionItem(item.id, { color: value })} /></label>
                  <label className="teach-editor-span-2"><FieldLabel>Highlight</FieldLabel><TextArea value={item.highlight} onChange={(value) => updateInstitutionItem(item.id, { highlight: value })} rows={3} /></label>
                  <label className="teach-editor-span-2"><FieldLabel>Role tags (comma separated)</FieldLabel><TextArea value={toCsv(item.roles)} onChange={(value) => updateInstitutionItem(item.id, { roles: parseCsv(value) })} rows={2} /></label>
                  <label className="teach-editor-span-2"><FieldLabel>External resource link</FieldLabel><TextField value={item.resourceLink || ''} onChange={(value) => updateInstitutionItem(item.id, { resourceLink: value })} placeholder="https://..." /></label>
                  <label className="teach-editor-span-2">
                    <FieldLabel>Document upload</FieldLabel>
                    <div className="teach-editor-upload-wrap">
                      <input
                        ref={(element) => {
                          fileInputRefs.current[item.id] = element
                        }}
                        type="file"
                        className="teach-editor-file-input"
                        accept="application/pdf,image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) {
                            void uploadInstitutionDocument(item.id, file)
                          }
                        }}
                        disabled={disabled}
                      />
                      <button type="button" className="teach-editor-btn teach-editor-btn-secondary" onClick={() => fileInputRefs.current[item.id]?.click()} disabled={disabled}>
                        <Upload size={14} /> Upload document
                      </button>
                      {item.documentUrl ? (
                        <a href={item.documentUrl} target="_blank" rel="noreferrer" className="teach-editor-link-btn">
                          View document
                        </a>
                      ) : null}
                    </div>
                  </label>
                </div>
                <div className="teach-editor-item-actions">
                  <button type="button" className="teach-editor-btn teach-editor-btn-primary" onClick={() => void saveSection('institutions')} disabled={disabled}>
                    <Save size={14} /> {busyKey === 'institutions' ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="teach-editor-btn teach-editor-btn-danger"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        institutions: {
                          ...prev.institutions,
                          items: prev.institutions.items.filter((entry) => entry.id !== item.id),
                        },
                      }))
                    }
                  >
                    <Trash2 size={14} /> Delete institution
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="teach-editor-actions-row">
            <button
              type="button"
              className="teach-editor-btn teach-editor-btn-secondary"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  institutions: {
                    ...prev.institutions,
                    items: [
                      ...prev.institutions.items,
                      {
                        id: `inst-${Date.now()}`,
                        period: '',
                        role: '',
                        org: '',
                        city: '',
                        univ: '',
                        color: '#0D1F3C',
                        current: false,
                        roles: [],
                        highlight: '',
                        resourceLink: '',
                        documentUrl: '',
                      },
                    ],
                  },
                }))
              }
            >
              <Plus size={14} /> Add institution
            </button>
          </div>
        </SectionCard>

        <SectionCard sectionKey="admin" title="Leadership" subtitle="Administrative roles and responsibilities" expandedSection={expandedSection} onToggle={toggleSection}>
          <div className="teach-editor-fields teach-editor-fields-grid">
            <label><FieldLabel>Kicker</FieldLabel><TextField value={content.admin.kicker} onChange={(value) => setContent((p) => ({ ...p, admin: { ...p.admin, kicker: value } }))} /></label>
            <label><FieldLabel>Title lead</FieldLabel><TextField value={content.admin.titleLead} onChange={(value) => setContent((p) => ({ ...p, admin: { ...p.admin, titleLead: value } }))} /></label>
            <label><FieldLabel>Title emphasis</FieldLabel><TextField value={content.admin.titleEmphasis} onChange={(value) => setContent((p) => ({ ...p, admin: { ...p.admin, titleEmphasis: value } }))} /></label>
          </div>
          <div className="teach-editor-list">
            {content.admin.roles.map((role, index) => (
              <div key={`admin-${index}`} className="teach-editor-item">
                <div className="teach-editor-fields teach-editor-fields-grid">
                  <label><FieldLabel>Title</FieldLabel><TextField value={role.title} onChange={(value) => updateAdminRole(index, { title: value })} /></label>
                  <label><FieldLabel>Institution</FieldLabel><TextField value={role.inst} onChange={(value) => updateAdminRole(index, { inst: value })} /></label>
                  <label><FieldLabel>Icon</FieldLabel><SelectField value={role.iconKey} options={iconOptions} onChange={(value) => updateAdminRole(index, { iconKey: value })} ariaLabel="Leadership icon" /></label>
                  <label><FieldLabel>Color</FieldLabel><ColorField value={role.color} onChange={(value) => updateAdminRole(index, { color: value })} /></label>
                  <label className="teach-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={role.desc} onChange={(value) => updateAdminRole(index, { desc: value })} rows={3} /></label>
                </div>
                <div className="teach-editor-item-actions">
                  <button type="button" className="teach-editor-btn teach-editor-btn-primary" onClick={() => void saveSection('admin')} disabled={disabled}>
                    <Save size={14} /> {busyKey === 'admin' ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="teach-editor-btn teach-editor-btn-danger" onClick={() => void deleteAdminRole(index)}>
                    <Trash2 size={14} /> Delete role
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="teach-editor-actions-row">
            <button
              type="button"
              className="teach-editor-btn teach-editor-btn-secondary"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  admin: {
                    ...prev.admin,
                    roles: [...prev.admin.roles, { iconKey: 'target', icon: prev.admin.roles[0]?.icon, color: '#0D1F3C', title: '', desc: '', inst: '' }],
                  },
                }))
              }
            >
              <Plus size={14} /> Add role
            </button>
          </div>
        </SectionCard>

        <SectionCard sectionKey="impact" title="Impact" subtitle="Stats and outcomes" expandedSection={expandedSection} onToggle={toggleSection}>
          <div className="teach-editor-fields teach-editor-fields-grid">
            <label><FieldLabel>Kicker</FieldLabel><TextField value={content.impact.kicker} onChange={(value) => setContent((p) => ({ ...p, impact: { ...p.impact, kicker: value } }))} /></label>
            <label><FieldLabel>Title lead</FieldLabel><TextField value={content.impact.titleLead} onChange={(value) => setContent((p) => ({ ...p, impact: { ...p.impact, titleLead: value } }))} /></label>
            <label><FieldLabel>Title emphasis</FieldLabel><TextField value={content.impact.titleEmphasis} onChange={(value) => setContent((p) => ({ ...p, impact: { ...p.impact, titleEmphasis: value } }))} /></label>
          </div>
          <div className="teach-editor-list">
            {content.impact.stats.map((item, index) => (
              <div key={`impact-${index}`} className="teach-editor-item">
                <div className="teach-editor-fields teach-editor-fields-grid">
                  <label><FieldLabel>Number</FieldLabel><TextField value={item.n} onChange={(value) => updateImpactStat(index, { n: value })} /></label>
                  <label><FieldLabel>Label</FieldLabel><TextField value={item.l} onChange={(value) => updateImpactStat(index, { l: value })} /></label>
                  <label><FieldLabel>Icon</FieldLabel><SelectField value={item.iconKey} options={iconOptions} onChange={(value) => updateImpactStat(index, { iconKey: value })} ariaLabel="Impact icon" /></label>
                  <label><FieldLabel>Small text</FieldLabel><TextField value={item.s} onChange={(value) => updateImpactStat(index, { s: value })} /></label>
                </div>
                <div className="teach-editor-item-actions">
                  <button type="button" className="teach-editor-btn teach-editor-btn-primary" onClick={() => void saveSection('impact')} disabled={disabled}>
                    <Save size={14} /> {busyKey === 'impact' ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="teach-editor-btn teach-editor-btn-danger" onClick={() => void deleteImpactStat(index)}>
                    <Trash2 size={14} /> Delete stat
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="teach-editor-actions-row">
            <button
              type="button"
              className="teach-editor-btn teach-editor-btn-secondary"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  impact: { ...prev.impact, stats: [...prev.impact.stats, { iconKey: 'star', icon: prev.impact.stats[0]?.icon, n: '', l: '', s: '' }] },
                }))
              }
            >
              <Plus size={14} /> Add stat
            </button>
          </div>
        </SectionCard>

        <SectionCard sectionKey="cta" title="CTA" subtitle="Action labels and links" expandedSection={expandedSection} onToggle={toggleSection}>
          <div className="teach-editor-fields teach-editor-fields-grid">
            <label><FieldLabel>Title lead</FieldLabel><TextField value={content.cta.titleLead} onChange={(value) => setContent((p) => ({ ...p, cta: { ...p.cta, titleLead: value } }))} /></label>
            <label><FieldLabel>Title emphasis</FieldLabel><TextField value={content.cta.titleEmphasis} onChange={(value) => setContent((p) => ({ ...p, cta: { ...p.cta, titleEmphasis: value } }))} /></label>
            <label className="teach-editor-span-2"><FieldLabel>Description</FieldLabel><TextArea value={content.cta.description} onChange={(value) => setContent((p) => ({ ...p, cta: { ...p.cta, description: value } }))} rows={3} /></label>
            <label><FieldLabel>Primary label</FieldLabel><TextField value={content.cta.primaryLabel} onChange={(value) => setContent((p) => ({ ...p, cta: { ...p.cta, primaryLabel: value } }))} /></label>
            <label><FieldLabel>Primary href</FieldLabel><TextField value={content.cta.primaryHref} onChange={(value) => setContent((p) => ({ ...p, cta: { ...p.cta, primaryHref: value } }))} /></label>
            <label><FieldLabel>Secondary label</FieldLabel><TextField value={content.cta.secondaryLabel} onChange={(value) => setContent((p) => ({ ...p, cta: { ...p.cta, secondaryLabel: value } }))} /></label>
            <label><FieldLabel>Secondary href</FieldLabel><TextField value={content.cta.secondaryHref} onChange={(value) => setContent((p) => ({ ...p, cta: { ...p.cta, secondaryHref: value } }))} /></label>
          </div>
          <div className="teach-editor-actions-row">
            <button type="button" className="teach-editor-btn teach-editor-btn-primary" onClick={() => void saveSection('cta')} disabled={disabled}>
              <Save size={14} /> {busyKey === 'cta' ? 'Saving...' : 'Save CTA'}
            </button>
          </div>
        </SectionCard>
      </div>

      <style>{`
        .teach-editor-shell {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .teach-editor-banner {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid rgba(13,31,60,0.12);
          background: linear-gradient(135deg, rgba(13,31,60,0.95), rgba(22,51,94,0.96));
          color: #fff;
          box-shadow: 0 14px 30px rgba(13,31,60,0.12);
        }

        .teach-editor-kicker {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255,255,255,0.72);
          margin-bottom: 8px;
        }

        .teach-editor-banner h3 {
          margin: 0;
        }

        .teach-editor-banner p:last-child {
          margin-top: 8px;
          color: rgba(255,255,255,0.82);
          line-height: 1.65;
        }

        .teach-editor-source {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.62);
          font-weight: 700;
        }

        .teach-editor-banner-actions,
        .teach-editor-actions-row,
        .teach-editor-item-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .teach-editor-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .teach-editor-card {
          border-radius: 18px;
          border: 1px solid var(--ink-line);
          background: #fff;
          box-shadow: 0 10px 26px rgba(13,31,60,0.08);
          overflow: hidden;
        }

        .teach-editor-card-open {
          border-color: rgba(184,135,10,0.32);
          box-shadow: 0 12px 28px rgba(13,31,60,0.10);
        }

        .teach-editor-card-head {
          width: 100%;
          border: none;
          background: linear-gradient(180deg, #fff, #FBFCFE);
          padding: 16px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          cursor: pointer;
        }

        .teach-editor-card-head:hover {
          background: rgba(184,135,10,0.06);
        }

        .teach-editor-section-kicker {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 6px;
        }

        .teach-editor-card h4 {
          color: var(--ink-3);
          font-size: 13px;
          line-height: 1.6;
          font-weight: 500;
          margin: 0;
        }

        .teach-editor-card-chevron {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid var(--ink-line);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-3);
          background: #fff;
          flex-shrink: 0;
        }

        .teach-editor-card-body {
          border-top: 1px solid rgba(13,31,60,0.08);
          background: linear-gradient(180deg, rgba(184,135,10,0.03), #fff);
          padding: 14px 18px 18px;
          display: grid;
          gap: 12px;
        }

        .teach-editor-fields {
          display: grid;
          gap: 12px;
        }

        .teach-editor-fields-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .teach-editor-span-2 {
          grid-column: span 2;
        }

        .teach-editor-list {
          display: grid;
          gap: 12px;
        }

        .teach-editor-item {
          border-radius: 14px;
          border: 1px solid var(--ink-line);
          background: linear-gradient(180deg, #fff, #FBFCFE);
          padding: 12px;
          display: grid;
          gap: 10px;
        }

        .teach-editor-field-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink-4);
          margin-bottom: 6px;
        }

        .teach-editor-input,
        .teach-editor-textarea,
        .teach-editor-select {
          width: 100%;
          border: 1px solid var(--ink-line);
          border-radius: 10px;
          padding: 10px 12px;
          background: #fff;
          color: var(--ink);
          font: inherit;
          outline: none;
        }

        .teach-editor-textarea {
          resize: vertical;
          min-height: 88px;
        }

        .teach-editor-btn,
        .teach-editor-link-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          border: 1px solid transparent;
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .teach-editor-btn-primary {
          background: linear-gradient(135deg, #1A6B48 0%, #0E8E57 100%);
          color: #fff;
          border-color: rgba(14,142,87,0.32);
          box-shadow: 0 8px 20px rgba(26,107,72,0.18);
        }

        .teach-editor-btn-secondary,
        .teach-editor-link-btn {
          background: rgba(13,31,60,0.07);
          color: var(--navy);
          border-color: rgba(13,31,60,0.16);
        }

        .teach-editor-btn-danger {
          background: linear-gradient(135deg, #B42318 0%, #D92D20 100%);
          color: #fff;
          border-color: rgba(185,28,28,0.24);
          box-shadow: 0 8px 18px rgba(185,28,28,0.14);
        }

        .teach-editor-btn:disabled {
          opacity: 0.58;
          cursor: not-allowed;
        }

        .teach-editor-btn:hover:not(:disabled),
        .teach-editor-link-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.02);
        }

        .teach-editor-color-field {
          display: grid;
          grid-template-columns: 54px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
        }

        .teach-editor-color-swatch {
          width: 54px;
          height: 46px;
          border-radius: 12px;
          border: 1px solid var(--ink-line);
          background: #fff;
          padding: 3px;
          cursor: pointer;
        }

        .teach-editor-upload-wrap {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .teach-editor-file-input {
          display: none;
        }

        .teach-editor-checkbox-row {
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        .teach-editor-checkbox-row label {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          font-size: 13px;
          color: var(--ink);
        }

        @media (max-width: 900px) {
          .teach-editor-banner {
            flex-direction: column;
          }

          .teach-editor-fields-grid,
          .teach-editor-span-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  )
}
