'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Database, Plus, RefreshCw, Save, Upload, Trash2 } from 'lucide-react'

import {
  PROJECTS_SECTION_META,
  UG_ICON_OPTIONS,
  STATIC_PROJECTS_CONTENT,
  createDefaultPGProject,
  createDefaultUGDomain,
  normalizeProjectsContent,
  type ProjectsContentRaw,
  type ProjectsSectionKey,
} from '@/lib/projectsContent'
import type { PGProject as PGProjectType, UGDomain as UGDomainType } from '@/app/Database/Projectdata'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<ProjectsContentRaw>
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

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="proj-editor-field-label">{children}</p>
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
  return <input className="proj-editor-input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
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
  return <textarea className="proj-editor-textarea" value={value} placeholder={placeholder} rows={rows} onChange={(event) => onChange(event.target.value)} />
}

function ColorField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const colorValue = value?.trim() || '#0D1F3C'

  return (
    <div className="proj-editor-color-field">
      <input className="proj-editor-color-swatch" type="color" value={colorValue} aria-label="Color picker" onChange={(event) => onChange(event.target.value)} />
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
  ariaLabel: string
}) {
  return (
    <select className="proj-editor-select" value={value} onChange={(event) => onChange(event.target.value as T)} aria-label={ariaLabel}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

const joinLines = (items: string[]) => items.join('\n')
const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)

export default function ProjectsEditor() {
  const [content, setContent] = useState<ProjectsContentRaw>(() => normalizeProjectsContent(STATIC_PROJECTS_CONTENT))
  const [source, setSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [statusMessage, setStatusMessage] = useState<string>('Loading projects content...')
  const [savingSection, setSavingSection] = useState<ProjectsSectionKey | 'all' | null>(null)
  const [uploadingProjectId, setUploadingProjectId] = useState<string | null>(null)
  const [expandedPGId, setExpandedPGId] = useState<string | null>(null)
  const [expandedUGId, setExpandedUGId] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/projects-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeProjectsContent(payload.content || STATIC_PROJECTS_CONTENT))
        setSource(payload.source || 'backup')
        if (payload.supabase && payload.supabase.serviceKey === false) {
          setStatusMessage('Read is working, but save is disabled: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local.')
        } else {
          setStatusMessage(
            payload.source === 'supabase'
              ? 'Projects loaded from Supabase.'
              : payload.message || 'Backup content is active.',
          )
        }
      } catch {
        if (!active) {
          return
        }

        setContent(normalizeProjectsContent(STATIC_PROJECTS_CONTENT))
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

  const saveSection = async <K extends ProjectsSectionKey>(sectionKey: K, sectionValue: ProjectsContentRaw[K]) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/projects-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: sectionValue } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeProjectsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage(`${PROJECTS_SECTION_META[sectionKey].label} section saved to Supabase.`)
      await showAlert('success', 'Saved', `${PROJECTS_SECTION_META[sectionKey].label} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the projects API.')
    } finally {
      setSavingSection(null)
    }
  }

  const savePGProjects = async () => {
    await saveSection('pgProjects', content.pgProjects)
  }

  const saveUGDomains = async () => {
    await saveSection('ugDomains', content.ugDomains)
  }

  const syncAll = async () => {
    if (savingSection) {
      return
    }

    setSavingSection('all')
    try {
      const response = await fetch('/api/projects-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-all', content }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Sync failed', payload.message || 'Unable to sync projects content.')
        return
      }

      setContent(normalizeProjectsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('All projects content synced to Supabase.')
      await showAlert('success', 'Synced', 'All projects content has been synced.')
    } catch {
      await showAlert('error', 'Sync failed', 'Unable to reach the projects API.')
    } finally {
      setSavingSection(null)
    }
  }

  const restoreBackup = async () => {
    setContent(normalizeProjectsContent(STATIC_PROJECTS_CONTENT))
    await syncAll()
  }

  const deleteOverride = async () => {
    if (savingSection) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete projects override?',
      text: 'The page will fall back to the static Projectdata.ts file.',
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
      const response = await fetch('/api/projects-content', { method: 'DELETE' })
      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Delete failed', payload.message || 'Unable to remove the projects override.')
        return
      }

      setContent(normalizeProjectsContent(payload.content || STATIC_PROJECTS_CONTENT))
      setSource('backup')
      setStatusMessage('Projects override removed. Backup content is active.')
      await showAlert('success', 'Deleted', 'Projects now use the backup file.')
    } catch {
      await showAlert('error', 'Delete failed', 'Unable to reach the projects API.')
    } finally {
      setSavingSection(null)
    }
  }

  const updatePGProjectField = <Field extends keyof PGProjectType>(index: number, field: Field, value: PGProjectType[Field]) => {
    setContent((current) => ({
      ...current,
      pgProjects: current.pgProjects.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }))
  }

  const addPGProject = () => {
    const nextProject = createDefaultPGProject()
    setContent((current) => ({
      ...current,
      pgProjects: [nextProject, ...current.pgProjects],
    }))
    setExpandedPGId(nextProject.id)
  }

  const removePGProject = async (index: number) => {
    if (savingSection) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete project?',
      text: 'This will remove the project from Supabase and update every page that uses Projects.',
      showCancelButton: true,
      confirmButtonText: 'Delete project',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B8870A',
      cancelButtonColor: '#0D1F3C',
      background: '#FFFFFF',
      color: '#0F172A',
    })

    if (!confirm.isConfirmed) {
      return
    }

    const nextProjects = content.pgProjects.filter((_, itemIndex) => itemIndex !== index)
    setContent((current) => ({
      ...current,
      pgProjects: nextProjects,
    }))
    await saveSection('pgProjects', nextProjects)
  }

  const uploadPGProjectAsset = async (projectId: string, file: File | null) => {
    if (!file) {
      return
    }

    setUploadingProjectId(projectId)
    try {
      const formData = new FormData()
      formData.append('projectId', projectId)
      formData.append('file', file)

      const response = await fetch('/api/projects-content/assets', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as ApiState & { assetUrl?: string }
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Upload failed', payload.message || 'Unable to upload the selected file.')
        return
      }

      setContent(normalizeProjectsContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Project file uploaded and linked successfully.')
      await showAlert('success', 'Uploaded', 'Project file uploaded successfully.')
      if (fileInputRefs.current[projectId]) {
        fileInputRefs.current[projectId]!.value = ''
      }
    } catch {
      await showAlert('error', 'Upload failed', 'Unable to reach the project upload API.')
    } finally {
      setUploadingProjectId(null)
    }
  }

  const updateUGDomainField = <Field extends keyof UGDomainType>(index: number, field: Field, value: UGDomainType[Field]) => {
    setContent((current) => ({
      ...current,
      ugDomains: current.ugDomains.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }))
  }

  const addUGDomain = () => {
    const nextDomain = createDefaultUGDomain()
    setContent((current) => ({
      ...current,
      ugDomains: [nextDomain, ...current.ugDomains],
    }))
    setExpandedUGId(nextDomain.id)
  }

  const removeUGDomain = async (index: number) => {
    if (savingSection) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete domain?',
      text: 'This will remove the domain from Supabase and update every page that uses Projects.',
      showCancelButton: true,
      confirmButtonText: 'Delete domain',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#B8870A',
      cancelButtonColor: '#0D1F3C',
      background: '#FFFFFF',
      color: '#0F172A',
    })

    if (!confirm.isConfirmed) {
      return
    }

    const nextDomains = content.ugDomains.filter((_, itemIndex) => itemIndex !== index)
    setContent((current) => ({
      ...current,
      ugDomains: nextDomains,
    }))
    await saveSection('ugDomains', nextDomains)
  }

  return (
    <div className="proj-editor-shell">
      <div className="proj-editor-banner">
        <div>
          <p className="proj-editor-kicker">Projects Manager</p>
          <h3>Supabase first, static Projectdata.ts always available</h3>
          <p className="proj-editor-source">Source: {source === 'loading' ? 'loading...' : source}</p>
          <p>{statusMessage}</p>
        </div>
        <div className="proj-editor-banner-actions">
          <button type="button" className="proj-editor-btn bg-amber-100 text-[#0d1f3c]" onClick={restoreBackup} disabled={savingSection === 'all'}>
            <RefreshCw size={14} /> Restore backup
          </button>
          <button type="button" className="proj-editor-btn proj-editor-btn-danger" onClick={deleteOverride} disabled={savingSection === 'all'}>
            <Trash2 size={14} /> Delete from DB
          </button>
          <button type="button" className="proj-editor-btn proj-editor-btn-primary" onClick={syncAll} disabled={savingSection === 'all'}>
            <Database size={14} /> {savingSection === 'all' ? 'Syncing...' : 'Sync all'}
          </button>
        </div>
      </div>

      <div className="proj-editor-grid">
        <motion.section className="proj-editor-card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="proj-editor-card-head">
            <div>
              <p className="proj-editor-section-kicker">{PROJECTS_SECTION_META.pgProjects.label}</p>
              <h4>{PROJECTS_SECTION_META.pgProjects.description}</h4>
            </div>
            <div className="proj-editor-banner-actions">
              <button type="button" className="proj-editor-btn proj-editor-btn-secondary" onClick={addPGProject} disabled={savingSection !== null}>
                <Plus size={14} /> Add project
              </button>
            </div>
          </div>

          <div className="proj-editor-list">
            {content.pgProjects.map((project, index) => (
              <div key={project.id} className={`proj-editor-item ${expandedPGId === project.id ? 'proj-editor-item-open' : ''}`}>
                <button type="button" className="proj-editor-item-head proj-editor-item-toggle" onClick={() => setExpandedPGId((current) => (current === project.id ? null : project.id))}>
                  <div>
                    <p className="proj-editor-item-title">Project {index + 1}</p>
                    <p className="proj-editor-item-subtitle">{project.title || 'Untitled project'}</p>
                  </div>
                  <div className="proj-editor-item-chevron">
                    {expandedPGId === project.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                <div className={`proj-editor-item-body ${expandedPGId === project.id ? 'proj-editor-item-body-open' : ''}`}>
                <div className="proj-editor-fields proj-editor-fields-grid">
                  <label>
                    <FieldLabel>Title</FieldLabel>
                    <TextField value={project.title} onChange={(value) => updatePGProjectField(index, 'title', value)} />
                  </label>
                  <label>
                    <FieldLabel>Student / Team</FieldLabel>
                    <TextField value={project.student} onChange={(value) => updatePGProjectField(index, 'student', value)} />
                  </label>
                  <label>
                    <FieldLabel>University</FieldLabel>
                    <TextField value={project.university} onChange={(value) => updatePGProjectField(index, 'university', value)} />
                  </label>
                  <label>
                    <FieldLabel>Year</FieldLabel>
                    <TextField value={project.year} onChange={(value) => updatePGProjectField(index, 'year', value)} placeholder="2024–2025" />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Domain</FieldLabel>
                    <TextField value={project.domain} onChange={(value) => updatePGProjectField(index, 'domain', value)} />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Summary</FieldLabel>
                    <TextArea value={project.summary} onChange={(value) => updatePGProjectField(index, 'summary', value)} rows={3} />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Outcome</FieldLabel>
                    <TextArea value={project.outcome} onChange={(value) => updatePGProjectField(index, 'outcome', value)} rows={3} />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Tags, one per line</FieldLabel>
                    <TextArea value={joinLines(project.tags)} onChange={(value) => updatePGProjectField(index, 'tags', splitLines(value))} rows={3} />
                  </label>
                  <label>
                    <FieldLabel>Color (hex)</FieldLabel>
                    <ColorField value={project.color} onChange={(value) => updatePGProjectField(index, 'color', value)} />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Project link</FieldLabel>
                    <TextField value={project.link || ''} onChange={(value) => updatePGProjectField(index, 'link', value)} placeholder="https://..." />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Uploaded file URL</FieldLabel>
                    <TextField value={project.uploadUrl || ''} onChange={(value) => updatePGProjectField(index, 'uploadUrl', value)} placeholder="https://... or Supabase storage URL" />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>PDF / Image upload</FieldLabel>
                    <div className="proj-editor-upload-wrap">
                      <input
                        ref={(element) => {
                          fileInputRefs.current[project.id] = element
                        }}
                        className="proj-editor-file-input"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(event) => uploadPGProjectAsset(project.id, event.target.files?.[0] || null)}
                        disabled={uploadingProjectId === project.id || savingSection !== null}
                      />
                      <button
                        type="button"
                        className="proj-editor-btn proj-editor-btn-secondary"
                        onClick={() => fileInputRefs.current[project.id]?.click()}
                        disabled={uploadingProjectId === project.id || savingSection !== null}
                      >
                        <Upload size={14} /> {uploadingProjectId === project.id ? 'Uploading...' : 'Upload file'}
                      </button>
                    </div>
                    <p className="proj-editor-upload-help">Accepted formats: PDF, JPG, PNG, WebP. Uploading replaces the current file URL.</p>
                  </label>
                </div>
                <div className="proj-editor-item-actions">
                  <button type="button" className="proj-editor-btn proj-editor-btn-primary" onClick={savePGProjects} disabled={savingSection === 'pgProjects'}>
                    <Save size={14} /> {savingSection === 'pgProjects' ? 'Saving...' : 'Save project updates'}
                  </button>
                  <button type="button" className="proj-editor-btn proj-editor-btn-danger" onClick={() => void removePGProject(index)} disabled={savingSection !== null}>
                    <Trash2 size={14} /> Delete project
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className="proj-editor-card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="proj-editor-card-head">
            <div>
              <p className="proj-editor-section-kicker">{PROJECTS_SECTION_META.ugDomains.label}</p>
              <h4>{PROJECTS_SECTION_META.ugDomains.description}</h4>
            </div>
            <div className="proj-editor-banner-actions">
              <button type="button" className="proj-editor-btn proj-editor-btn-secondary" onClick={addUGDomain} disabled={savingSection !== null}>
                <Plus size={14} /> Add domain
              </button>
            </div>
          </div>

          <div className="proj-editor-list">
            {content.ugDomains.map((domain, index) => (
              <div key={domain.id} className={`proj-editor-item ${expandedUGId === domain.id ? 'proj-editor-item-open' : ''}`}>
                <button type="button" className="proj-editor-item-head proj-editor-item-toggle" onClick={() => setExpandedUGId((current) => (current === domain.id ? null : domain.id))}>
                  <div>
                    <p className="proj-editor-item-title">Domain {index + 1}</p>
                    <p className="proj-editor-item-subtitle">{domain.domain || 'Untitled domain'}</p>
                  </div>
                  <div className="proj-editor-item-chevron">
                    {expandedUGId === domain.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                <div className={`proj-editor-item-body ${expandedUGId === domain.id ? 'proj-editor-item-body-open' : ''}`}>
                <div className="proj-editor-fields proj-editor-fields-grid">
                  <label className="proj-editor-span-2">
                    <FieldLabel>Domain name</FieldLabel>
                    <TextField value={domain.domain} onChange={(value) => updateUGDomainField(index, 'domain', value)} />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Description</FieldLabel>
                    <TextArea value={domain.description} onChange={(value) => updateUGDomainField(index, 'description', value)} rows={3} />
                  </label>
                  <label>
                    <FieldLabel>Color (hex)</FieldLabel>
                    <ColorField value={domain.color} onChange={(value) => updateUGDomainField(index, 'color', value)} />
                  </label>
                  <label>
                    <FieldLabel>Icon</FieldLabel>
                    <SelectField
                      value={(domain.iconKey || 'brain') as (typeof UG_ICON_OPTIONS)[number]['value']}
                      options={UG_ICON_OPTIONS.map((option) => option.value)}
                      onChange={(value) => updateUGDomainField(index, 'iconKey', value)}
                      ariaLabel="Choose UG domain icon"
                    />
                  </label>
                  <label>
                    <FieldLabel>Background (rgba)</FieldLabel>
                    <TextField value={domain.bg} onChange={(value) => updateUGDomainField(index, 'bg', value)} placeholder="rgba(13,31,60,0.07)" />
                  </label>
                  <label>
                    <FieldLabel>Total Groups</FieldLabel>
                    <TextField type="number" value={domain.totalGroups} onChange={(value) => updateUGDomainField(index, 'totalGroups', Number.parseInt(value, 10) || 0)} />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Highlights, one per line</FieldLabel>
                    <TextArea value={joinLines(domain.highlights)} onChange={(value) => updateUGDomainField(index, 'highlights', splitLines(value))} rows={3} />
                  </label>
                  <label className="proj-editor-span-2">
                    <FieldLabel>Technologies, one per line</FieldLabel>
                    <TextArea value={joinLines(domain.technologies)} onChange={(value) => updateUGDomainField(index, 'technologies', splitLines(value))} rows={3} />
                  </label>
                </div>
                <div className="proj-editor-item-actions">
                  <button type="button" className="proj-editor-btn proj-editor-btn-primary" onClick={saveUGDomains} disabled={savingSection === 'ugDomains'}>
                    <Save size={14} /> {savingSection === 'ugDomains' ? 'Saving...' : 'Save domain updates'}
                  </button>
                  <button type="button" className="proj-editor-btn proj-editor-btn-danger" onClick={() => void removeUGDomain(index)} disabled={savingSection !== null}>
                    <Trash2 size={14} /> Delete domain
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <style>{`
        .proj-editor-shell {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .proj-editor-banner {
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

        .proj-editor-kicker {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255,255,255,0.72);
          margin-bottom: 8px;
        }

        .proj-editor-banner h3 {
          margin: 0;
        }

        .proj-editor-banner p:last-child {
          margin-top: 8px;
          color: rgba(255,255,255,0.82);
          line-height: 1.65;
        }

        .proj-editor-source {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.62);
          font-weight: 700;
        }

        .proj-editor-banner-actions,
        .proj-editor-item-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .proj-editor-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .proj-editor-card {
          border-radius: 18px;
          border: 1px solid var(--ink-line);
          background: #fff;
          padding: 18px;
          box-shadow: 0 10px 26px rgba(13,31,60,0.08);
        }

        .proj-editor-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 14px;
        }

        .proj-editor-section-kicker {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 6px;
        }

        .proj-editor-card h4 {
          color: var(--ink-3);
          font-size: 13px;
          line-height: 1.6;
          font-weight: 500;
          max-width: 720px;
          margin: 0;
        }

        .proj-editor-fields {
          display: grid;
          gap: 12px;
        }

        .proj-editor-fields-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 14px;
        }

        .proj-editor-span-2 {
          grid-column: span 2;
        }

        .proj-editor-list {
          display: grid;
          gap: 14px;
        }

        .proj-editor-item {
          border-radius: 16px;
          border: 1px solid var(--ink-line);
          background: linear-gradient(180deg, #fff, #FBFCFE);
          overflow: hidden;
        }

        .proj-editor-item-open {
          border-color: rgba(184,135,10,0.34);
          box-shadow: 0 12px 24px rgba(13,31,60,0.09);
        }

        .proj-editor-item-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          padding: 14px;
          margin-bottom: 0;
        }

        .proj-editor-item-toggle {
          width: 100%;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .proj-editor-item-toggle:hover {
          background: rgba(184,135,10,0.06);
        }

        .proj-editor-item-chevron {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid var(--ink-line);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-3);
          flex-shrink: 0;
        }

        .proj-editor-item-body {
          display: none;
          padding: 0 14px 14px;
          border-top: 1px solid rgba(13,31,60,0.08);
          background: linear-gradient(180deg, rgba(184,135,10,0.04) 0%, rgba(255,255,255,1) 100%);
        }

        .proj-editor-item-body-open {
          display: block;
        }

        .proj-editor-item-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 4px;
        }

        .proj-editor-item-subtitle {
          font-size: 14px;
          color: var(--ink);
          line-height: 1.5;
          font-weight: 600;
          margin: 0;
        }

        .proj-editor-field-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink-4);
          margin-bottom: 6px;
        }

        .proj-editor-input,
        .proj-editor-textarea,
        .proj-editor-select {
          width: 100%;
          border: 1px solid var(--ink-line);
          border-radius: 10px;
          padding: 10px 12px;
          background: #fff;
          color: var(--ink);
          font: inherit;
          outline: none;
        }

        .proj-editor-upload-wrap {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .proj-editor-file-input {
          display: none;
        }

        .proj-editor-upload-help {
          margin-top: 6px;
          font-size: 11px;
          color: var(--ink-4);
          line-height: 1.5;
        }

        .proj-editor-textarea {
          resize: vertical;
          min-height: 92px;
        }

        .proj-editor-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          border: 1px solid transparent;
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .proj-editor-btn-primary {
          background: linear-gradient(135deg, #1A6B48 0%, #0E8E57 100%);
          color: #fff;
          border-color: rgba(14,142,87,0.32);
          box-shadow: 0 8px 20px rgba(26,107,72,0.18);
        }

        .proj-editor-btn-secondary {
          background: rgba(13,31,60);
          color: white;
          border-color: rgba(13,31,60);
        }

        .proj-editor-btn-danger {
          background: linear-gradient(135deg, #B42318 0%, #D92D20 100%);
          color: #fff;
          border-color: rgba(185,28,28,0.24);
          box-shadow: 0 8px 18px rgba(185,28,28,0.14);
        }

        .proj-editor-btn:disabled {
          opacity: 0.58;
          cursor: not-allowed;
        }

        .proj-editor-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.02);
        }

        .proj-editor-color-field {
          display: grid;
          grid-template-columns: 54px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
        }

        .proj-editor-color-swatch {
          width: 54px;
          height: 46px;
          border-radius: 12px;
          border: 1px solid var(--ink-line);
          background: #fff;
          padding: 3px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .proj-editor-banner,
          .proj-editor-card-head,
          .proj-editor-item-head,
          .proj-editor-item-actions {
            flex-direction: column;
          }

          .proj-editor-fields-grid,
          .proj-editor-span-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  )
}
