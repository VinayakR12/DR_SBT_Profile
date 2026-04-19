'use client'

import { useEffect, useState, type CSSProperties } from 'react'

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

const fieldStyle: CSSProperties = {
  width: '100%',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
}

const textareaStyle: CSSProperties = {
  ...fieldStyle,
  minHeight: 90,
  resize: 'vertical',
}

const cardStyle: CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 16,
  background: '#fff',
}

const rowStyle: CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 12,
  background: '#f9fafb',
}

const buttonBase: CSSProperties = {
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  cursor: 'pointer',
}

const secondaryButton: CSSProperties = {
  ...buttonBase,
  border: '1px solid #d1d5db',
  background: '#fff',
  color: '#111827',
}

const primaryButton = (busy: boolean): CSSProperties => ({
  ...buttonBase,
  border: 'none',
  background: busy ? '#93c5fd' : '#2563eb',
  color: '#fff',
  cursor: busy ? 'not-allowed' : 'pointer',
})

const sectionKeys: TeachingSectionKey[] = ['hero', 'identity', 'pedagogy', 'subjects', 'institutions', 'admin', 'impact', 'cta']

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

  const saveSection = async (sectionKey: TeachingSectionKey) => {
    setBusyKey(sectionKey)
    setStatus(`Saving ${sectionKey}...`)
    try {
      const res = await fetch('/api/teaching-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: content[sectionKey] } }),
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

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#111827' }}>Teaching Content Manager</div>
          <div style={{ marginTop: 4, fontSize: 13, color: '#4b5563' }}>
            Source: <strong>{source}</strong>. Fill forms and save section-wise.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" disabled={disabled} onClick={() => void loadContent()} style={secondaryButton}>
            Reload
          </button>
          <button type="button" disabled={disabled} onClick={() => void restoreBackup()} style={secondaryButton}>
            Restore Backup
          </button>
          <button type="button" disabled={disabled} onClick={() => void syncAll()} style={primaryButton(busyKey === 'sync-all')}>
            Sync All
          </button>
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#1f2937' }}>{status}</div>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Hero</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input style={fieldStyle} value={content.hero.kicker} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, kicker: e.target.value } }))} placeholder="Kicker" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.hero.titleLead} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, titleLead: e.target.value } }))} placeholder="Title lead" />
            <input style={fieldStyle} value={content.hero.titleEmphasis} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, titleEmphasis: e.target.value } }))} placeholder="Title emphasis" />
          </div>
          <textarea style={textareaStyle} value={content.hero.description} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, description: e.target.value } }))} placeholder="Description" />
          <textarea style={textareaStyle} value={content.hero.quote} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, quote: e.target.value } }))} placeholder="Quote" />
          <input style={fieldStyle} value={content.hero.quoteAuthor} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, quoteAuthor: e.target.value } }))} placeholder="Quote author" />
          <button type="button" disabled={disabled} onClick={() => void saveSection('hero')} style={primaryButton(busyKey === 'hero')}>
            Save Hero
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Identity</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input style={fieldStyle} value={content.identity.kicker} onChange={(e) => setContent((p) => ({ ...p, identity: { ...p.identity, kicker: e.target.value } }))} placeholder="Kicker" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.identity.titleLead} onChange={(e) => setContent((p) => ({ ...p, identity: { ...p.identity, titleLead: e.target.value } }))} placeholder="Title lead" />
            <input style={fieldStyle} value={content.identity.titleEmphasis} onChange={(e) => setContent((p) => ({ ...p, identity: { ...p.identity, titleEmphasis: e.target.value } }))} placeholder="Title emphasis" />
          </div>
          <textarea style={textareaStyle} value={content.identity.paragraph1} onChange={(e) => setContent((p) => ({ ...p, identity: { ...p.identity, paragraph1: e.target.value } }))} placeholder="Paragraph 1" />
          <textarea style={textareaStyle} value={content.identity.paragraph2} onChange={(e) => setContent((p) => ({ ...p, identity: { ...p.identity, paragraph2: e.target.value } }))} placeholder="Paragraph 2" />
          <input style={fieldStyle} value={toCsv(content.identity.credentials)} onChange={(e) => setContent((p) => ({ ...p, identity: { ...p.identity, credentials: parseCsv(e.target.value) } }))} placeholder="Credentials (comma separated)" />
          <button type="button" disabled={disabled} onClick={() => void saveSection('identity')} style={primaryButton(busyKey === 'identity')}>
            Save Identity
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Pedagogy</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {content.pedagogy.map((item, index) => (
            <div key={`ped-${index}`} style={rowStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <select style={fieldStyle} value={item.iconKey} onChange={(e) => updatePedagogyItem(index, { iconKey: e.target.value })}>
                  {iconOptions.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <input style={fieldStyle} value={item.title} onChange={(e) => updatePedagogyItem(index, { title: e.target.value })} placeholder="Title" />
              </div>
              <textarea style={{ ...textareaStyle, marginTop: 8 }} value={item.desc} onChange={(e) => updatePedagogyItem(index, { desc: e.target.value })} placeholder="Description" />
              <button type="button" onClick={() => setContent((prev) => ({ ...prev, pedagogy: prev.pedagogy.filter((_, i) => i !== index) }))} style={{ ...secondaryButton, marginTop: 8 }}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setContent((prev) => ({ ...prev, pedagogy: [...prev.pedagogy, { iconKey: 'target', icon: prev.pedagogy[0]?.icon, title: '', desc: '' }] }))}
            style={secondaryButton}
          >
            Add Pedagogy Card
          </button>
          <button type="button" disabled={disabled} onClick={() => void saveSection('pedagogy')} style={primaryButton(busyKey === 'pedagogy')}>
            Save Pedagogy
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Subjects</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input style={fieldStyle} value={content.subjects.kicker} onChange={(e) => setContent((p) => ({ ...p, subjects: { ...p.subjects, kicker: e.target.value } }))} placeholder="Kicker" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.subjects.titleLead} onChange={(e) => setContent((p) => ({ ...p, subjects: { ...p.subjects, titleLead: e.target.value } }))} placeholder="Title lead" />
            <input style={fieldStyle} value={content.subjects.titleEmphasis} onChange={(e) => setContent((p) => ({ ...p, subjects: { ...p.subjects, titleEmphasis: e.target.value } }))} placeholder="Title emphasis" />
          </div>
          {content.subjects.items.map((item, index) => (
            <div key={`sub-${index}`} style={rowStyle}>
              {(() => {
                const levelValues = Array.isArray(item.level) ? item.level : []
                return (
                  <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input style={fieldStyle} value={item.name} onChange={(e) => updateSubjectItem(index, { name: e.target.value })} placeholder="Subject name" />
                <input style={fieldStyle} value={item.cat} onChange={(e) => updateSubjectItem(index, { cat: e.target.value as TeachingSubjectsItem['cat'] })} placeholder="Category" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <select style={fieldStyle} value={item.iconKey} onChange={(e) => updateSubjectItem(index, { iconKey: e.target.value })}>
                  {iconOptions.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <input style={fieldStyle} value={item.color} onChange={(e) => updateSubjectItem(index, { color: e.target.value })} placeholder="Color" />
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={levelValues.includes('UG')}
                    onChange={(e) =>
                      updateSubjectItem(index, {
                        level: e.target.checked
                          ? Array.from(new Set([...levelValues, 'UG']))
                          : levelValues.filter((entry) => entry !== 'UG'),
                      })
                    }
                  />
                  UG
                </label>
                <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={levelValues.includes('PG')}
                    onChange={(e) =>
                      updateSubjectItem(index, {
                        level: e.target.checked
                          ? Array.from(new Set([...levelValues, 'PG']))
                          : levelValues.filter((entry) => entry !== 'PG'),
                      })
                    }
                  />
                  PG
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    subjects: { ...prev.subjects, items: prev.subjects.items.filter((_, i) => i !== index) },
                  }))
                }
                style={{ ...secondaryButton, marginTop: 8 }}
              >
                Remove
              </button>
                  </>
                )
              })()}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                subjects: {
                  ...prev.subjects,
                  items: [
                    ...prev.subjects.items,
                    { iconKey: 'book', icon: prev.subjects.items[0]?.icon, name: '', cat: 'Core CS', color: '#0D1F3C', level: ['UG'] },
                  ],
                },
              }))
            }
            style={secondaryButton}
          >
            Add Subject
          </button>
          <button type="button" disabled={disabled} onClick={() => void saveSection('subjects')} style={primaryButton(busyKey === 'subjects')}>
            Save Subjects
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Institutions (Link and File Upload)</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input style={fieldStyle} value={content.institutions.kicker} onChange={(e) => setContent((p) => ({ ...p, institutions: { ...p.institutions, kicker: e.target.value } }))} placeholder="Kicker" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.institutions.titleLead} onChange={(e) => setContent((p) => ({ ...p, institutions: { ...p.institutions, titleLead: e.target.value } }))} placeholder="Title lead" />
            <input style={fieldStyle} value={content.institutions.titleEmphasis} onChange={(e) => setContent((p) => ({ ...p, institutions: { ...p.institutions, titleEmphasis: e.target.value } }))} placeholder="Title emphasis" />
          </div>
          {content.institutions.items.map((item) => (
            <div key={item.id} style={rowStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input style={fieldStyle} value={item.period} onChange={(e) => updateInstitutionItem(item.id, { period: e.target.value })} placeholder="Period" />
                <input style={fieldStyle} value={item.role} onChange={(e) => updateInstitutionItem(item.id, { role: e.target.value })} placeholder="Role" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <input style={fieldStyle} value={item.org} onChange={(e) => updateInstitutionItem(item.id, { org: e.target.value })} placeholder="Organization" />
                <input style={fieldStyle} value={item.city} onChange={(e) => updateInstitutionItem(item.id, { city: e.target.value })} placeholder="City" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <input style={fieldStyle} value={item.univ} onChange={(e) => updateInstitutionItem(item.id, { univ: e.target.value })} placeholder="University" />
                <input style={fieldStyle} value={item.color} onChange={(e) => updateInstitutionItem(item.id, { color: e.target.value })} placeholder="Color" />
              </div>
              <textarea style={{ ...textareaStyle, marginTop: 8 }} value={item.highlight} onChange={(e) => updateInstitutionItem(item.id, { highlight: e.target.value })} placeholder="Highlight" />
              <textarea style={{ ...textareaStyle, marginTop: 8 }} value={toCsv(item.roles)} onChange={(e) => updateInstitutionItem(item.id, { roles: parseCsv(e.target.value) })} placeholder="Role tags (comma separated)" />
              <input style={{ ...fieldStyle, marginTop: 8 }} value={item.resourceLink || ''} onChange={(e) => updateInstitutionItem(item.id, { resourceLink: e.target.value })} placeholder="External resource link (optional)" />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      void uploadInstitutionDocument(item.id, file)
                    }
                  }}
                />
                {item.documentUrl ? (
                  <a href={item.documentUrl} target="_blank" rel="noreferrer" style={{ ...secondaryButton, textDecoration: 'none' }}>
                    View Doc
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      institutions: {
                        ...prev.institutions,
                        items: prev.institutions.items.filter((entry) => entry.id !== item.id),
                      },
                    }))
                  }
                  style={secondaryButton}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
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
            style={secondaryButton}
          >
            Add Institution
          </button>
          <button type="button" disabled={disabled} onClick={() => void saveSection('institutions')} style={primaryButton(busyKey === 'institutions')}>
            Save Institutions
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Leadership</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input style={fieldStyle} value={content.admin.kicker} onChange={(e) => setContent((p) => ({ ...p, admin: { ...p.admin, kicker: e.target.value } }))} placeholder="Kicker" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.admin.titleLead} onChange={(e) => setContent((p) => ({ ...p, admin: { ...p.admin, titleLead: e.target.value } }))} placeholder="Title lead" />
            <input style={fieldStyle} value={content.admin.titleEmphasis} onChange={(e) => setContent((p) => ({ ...p, admin: { ...p.admin, titleEmphasis: e.target.value } }))} placeholder="Title emphasis" />
          </div>
          {content.admin.roles.map((role, index) => (
            <div key={`admin-${index}`} style={rowStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input style={fieldStyle} value={role.title} onChange={(e) => updateAdminRole(index, { title: e.target.value })} placeholder="Title" />
                <input style={fieldStyle} value={role.inst} onChange={(e) => updateAdminRole(index, { inst: e.target.value })} placeholder="Institution" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <select style={fieldStyle} value={role.iconKey} onChange={(e) => updateAdminRole(index, { iconKey: e.target.value })}>
                  {iconOptions.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <input style={fieldStyle} value={role.color} onChange={(e) => updateAdminRole(index, { color: e.target.value })} placeholder="Color" />
              </div>
              <textarea style={{ ...textareaStyle, marginTop: 8 }} value={role.desc} onChange={(e) => updateAdminRole(index, { desc: e.target.value })} placeholder="Description" />
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    admin: { ...prev.admin, roles: prev.admin.roles.filter((_, i) => i !== index) },
                  }))
                }
                style={{ ...secondaryButton, marginTop: 8 }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                admin: {
                  ...prev.admin,
                  roles: [...prev.admin.roles, { iconKey: 'target', icon: prev.admin.roles[0]?.icon, color: '#0D1F3C', title: '', desc: '', inst: '' }],
                },
              }))
            }
            style={secondaryButton}
          >
            Add Role
          </button>
          <button type="button" disabled={disabled} onClick={() => void saveSection('admin')} style={primaryButton(busyKey === 'admin')}>
            Save Leadership
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Impact</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input style={fieldStyle} value={content.impact.kicker} onChange={(e) => setContent((p) => ({ ...p, impact: { ...p.impact, kicker: e.target.value } }))} placeholder="Kicker" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.impact.titleLead} onChange={(e) => setContent((p) => ({ ...p, impact: { ...p.impact, titleLead: e.target.value } }))} placeholder="Title lead" />
            <input style={fieldStyle} value={content.impact.titleEmphasis} onChange={(e) => setContent((p) => ({ ...p, impact: { ...p.impact, titleEmphasis: e.target.value } }))} placeholder="Title emphasis" />
          </div>
          {content.impact.stats.map((item, index) => (
            <div key={`impact-${index}`} style={rowStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input style={fieldStyle} value={item.n} onChange={(e) => updateImpactStat(index, { n: e.target.value })} placeholder="Number" />
                <input style={fieldStyle} value={item.l} onChange={(e) => updateImpactStat(index, { l: e.target.value })} placeholder="Label" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <select style={fieldStyle} value={item.iconKey} onChange={(e) => updateImpactStat(index, { iconKey: e.target.value })}>
                  {iconOptions.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <input style={fieldStyle} value={item.s} onChange={(e) => updateImpactStat(index, { s: e.target.value })} placeholder="Small text" />
              </div>
              <button
                type="button"
                onClick={() => setContent((prev) => ({ ...prev, impact: { ...prev.impact, stats: prev.impact.stats.filter((_, i) => i !== index) } }))}
                style={{ ...secondaryButton, marginTop: 8 }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                impact: { ...prev.impact, stats: [...prev.impact.stats, { iconKey: 'star', icon: prev.impact.stats[0]?.icon, n: '', l: '', s: '' }] },
              }))
            }
            style={secondaryButton}
          >
            Add Stat
          </button>
          <button type="button" disabled={disabled} onClick={() => void saveSection('impact')} style={primaryButton(busyKey === 'impact')}>
            Save Impact
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>CTA</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.cta.titleLead} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, titleLead: e.target.value } }))} placeholder="Title lead" />
            <input style={fieldStyle} value={content.cta.titleEmphasis} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, titleEmphasis: e.target.value } }))} placeholder="Title emphasis" />
          </div>
          <textarea style={textareaStyle} value={content.cta.description} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, description: e.target.value } }))} placeholder="Description" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.cta.primaryLabel} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, primaryLabel: e.target.value } }))} placeholder="Primary label" />
            <input style={fieldStyle} value={content.cta.primaryHref} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, primaryHref: e.target.value } }))} placeholder="Primary href" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input style={fieldStyle} value={content.cta.secondaryLabel} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, secondaryLabel: e.target.value } }))} placeholder="Secondary label" />
            <input style={fieldStyle} value={content.cta.secondaryHref} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, secondaryHref: e.target.value } }))} placeholder="Secondary href" />
          </div>
          <button type="button" disabled={disabled} onClick={() => void saveSection('cta')} style={primaryButton(busyKey === 'cta')}>
            Save CTA
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Quick Save</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {sectionKeys.map((key) => (
            <button key={key} type="button" onClick={() => void saveSection(key)} disabled={disabled} style={secondaryButton}>
              Save {key}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
