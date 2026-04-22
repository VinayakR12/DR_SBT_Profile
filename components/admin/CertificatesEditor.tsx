'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Database, Plus, RefreshCw, Save, Trash2, Upload } from 'lucide-react'

import {
  CERTIFICATE_CATEGORIES,
  CERTIFICATE_TYPE_OPTIONS,
  CERTIFICATES_SECTION_META,
  STATIC_CERTIFICATES_CONTENT,
  createDefaultCertificate,
  normalizeCertificatesContent,
  type CertificateItemRaw,
  type CertificatesContentRaw,
  type CertificatesSectionKey,
} from '@/lib/certificatesContent'

type ApiState = {
  ok?: boolean
  source?: 'supabase' | 'backup'
  content?: Partial<CertificatesContentRaw>
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
  return <p className="cert-editor-field-label">{children}</p>
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
  return <input className="cert-editor-input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
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
  return <textarea className="cert-editor-textarea" value={value} placeholder={placeholder} rows={rows} onChange={(event) => onChange(event.target.value)} />
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
    <select className="cert-editor-select" value={value} onChange={(event) => onChange(event.target.value as T)} aria-label={ariaLabel}>
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

export default function CertificatesEditor() {
  const [content, setContent] = useState<CertificatesContentRaw>(() => normalizeCertificatesContent(STATIC_CERTIFICATES_CONTENT))
  const [source, setSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [statusMessage, setStatusMessage] = useState<string>('Loading certificates content...')
  const [savingSection, setSavingSection] = useState<CertificatesSectionKey | 'all' | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<CertificatesSectionKey | null>('hero')
  const [expandedCertificateId, setExpandedCertificateId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const response = await fetch('/api/achievements-certificates-content', { cache: 'no-store' })
        const payload = (await response.json()) as ApiState

        if (!active) {
          return
        }

        setContent(normalizeCertificatesContent(payload.content || STATIC_CERTIFICATES_CONTENT))
        setSource(payload.source || 'backup')
        if (payload.supabase && payload.supabase.serviceKey === false) {
          setStatusMessage('Read is working, but save is disabled: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local.')
        } else {
          setStatusMessage(
            payload.source === 'supabase'
              ? 'Certificates loaded from Supabase.'
              : payload.message || 'Backup content is active.',
          )
        }
      } catch {
        if (!active) {
          return
        }

        setContent(normalizeCertificatesContent(STATIC_CERTIFICATES_CONTENT))
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

  const saveSection = async <K extends CertificatesSectionKey>(sectionKey: K, sectionValue: CertificatesContentRaw[K]) => {
    if (savingSection) {
      return
    }

    setSavingSection(sectionKey)
    try {
      const response = await fetch('/api/achievements-certificates-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, content: { [sectionKey]: sectionValue } }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Save failed', payload.message || 'Unable to save this section right now.')
        return
      }

      setContent(normalizeCertificatesContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage(`${CERTIFICATES_SECTION_META[sectionKey].label} section saved to Supabase.`)
      await showAlert('success', 'Saved', `${CERTIFICATES_SECTION_META[sectionKey].label} section has been updated.`)
    } catch {
      await showAlert('error', 'Save failed', 'Unable to reach the certificates API.')
    } finally {
      setSavingSection(null)
    }
  }

  const saveHero = async () => {
    await saveSection('hero', content.hero)
  }

  const saveCertificates = async () => {
    await saveSection('certificates', content.certificates)
  }

  const confirmAndSaveCertificates = async (nextCertificates: CertificatesContentRaw['certificates'], title: string, text: string) => {
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
      certificates: nextCertificates,
    }))
    await saveSection('certificates', nextCertificates)
  }

  const syncAll = async () => {
    if (savingSection) {
      return
    }

    setSavingSection('all')
    try {
      const response = await fetch('/api/achievements-certificates-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-all', content }),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Sync failed', payload.message || 'Unable to sync certificates content.')
        return
      }

      setContent(normalizeCertificatesContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('All certificates content synced to Supabase.')
      await showAlert('success', 'Synced', 'All certificates content has been synced.')
    } catch {
      await showAlert('error', 'Sync failed', 'Unable to reach the certificates API.')
    } finally {
      setSavingSection(null)
    }
  }

  const restoreBackup = async () => {
    setContent(normalizeCertificatesContent(STATIC_CERTIFICATES_CONTENT))
    await syncAll()
  }

  const deleteOverride = async () => {
    if (savingSection) {
      return
    }

    const Swal = (await import('sweetalert2')).default
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete certificates override?',
      text: 'The page will fall back to the static Certificates data file.',
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
      const response = await fetch('/api/achievements-certificates-content', { method: 'DELETE' })
      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok) {
        await showAlert('error', 'Delete failed', payload.message || 'Unable to remove the certificates override.')
        return
      }

      setContent(normalizeCertificatesContent(payload.content || STATIC_CERTIFICATES_CONTENT))
      setSource('backup')
      setStatusMessage('Certificates override removed. Backup content is active.')
      await showAlert('success', 'Deleted', 'Certificates now use the backup file.')
    } catch {
      await showAlert('error', 'Delete failed', 'Unable to reach the certificates API.')
    } finally {
      setSavingSection(null)
    }
  }

  const updateHeroField = (field: keyof CertificatesContentRaw['hero'], value: string) => {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [field]: value,
      },
    }))
  }

  const updateCertificateField = <Field extends keyof CertificateItemRaw>(index: number, field: Field, value: CertificateItemRaw[Field]) => {
    setContent((current) => ({
      ...current,
      certificates: current.certificates.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }))
  }

  const addCertificate = () => {
    setContent((current) => ({
      ...current,
      certificates: [createDefaultCertificate(), ...current.certificates],
    }))
  }

  const removeCertificate = (index: number) => {
    void confirmAndSaveCertificates(
      content.certificates.filter((_, itemIndex) => itemIndex !== index),
      'Delete this certificate?',
      'This will remove the certificate from Supabase and every page that uses it.',
    )
  }

  const uploadAsset = async (params: { file: File; certificateId: string }) => {
    if (savingSection || uploadingKey) {
      return
    }

    const key = `${params.certificateId}-asset`
    setUploadingKey(key)

    try {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('certificateId', params.certificateId)

      const response = await fetch('/api/achievements-certificates-content/assets', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok || !payload.content) {
        await showAlert('error', 'Upload failed', payload.message || 'Unable to upload asset.')
        return
      }

      setContent(normalizeCertificatesContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Certificate file uploaded and saved to Supabase.')
      await showAlert('success', 'Uploaded', 'Certificate file has been uploaded successfully.')
    } catch {
      await showAlert('error', 'Upload failed', 'Unable to reach the certificate asset API.')
    } finally {
      setUploadingKey(null)
    }
  }

  const removeAsset = async (params: { certificateId: string; assetUrl: string }) => {
    if (savingSection || uploadingKey) {
      return
    }

    const key = `${params.certificateId}-asset`
    setUploadingKey(key)

    try {
      const response = await fetch('/api/achievements-certificates-content/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const payload = (await response.json()) as ApiState
      if (!response.ok || !payload.ok || !payload.content) {
        await showAlert('error', 'Remove failed', payload.message || 'Unable to remove asset.')
        return
      }

      setContent(normalizeCertificatesContent(payload.content || content))
      setSource(payload.source || 'supabase')
      setStatusMessage('Certificate file removed from Supabase content.')
      await showAlert('success', 'Removed', 'Certificate file has been removed.')
    } catch {
      await showAlert('error', 'Remove failed', 'Unable to reach the certificate asset API.')
    } finally {
      setUploadingKey(null)
    }
  }

  const saveCertificateItem = async (index: number) => {
    if (savingSection) {
      return
    }

    await saveSection('certificates', content.certificates.map((item, itemIndex) => (itemIndex === index ? content.certificates[index] : item)))
  }

  return (
    <div className="cert-editor-shell">
      <div className="cert-editor-banner">
        <div>
          <p className="cert-editor-kicker">Certificates Manager</p>
          <h3>Supabase first, static certificate data always available</h3>
          <p className="cert-editor-source">Source: {source === 'loading' ? 'loading...' : source}</p>
          <p>{statusMessage}</p>
        </div>
        <div className="cert-editor-banner-actions">
          <button type="button" className="cert-editor-btn bg-amber-200 text-[#0d1f3c]" onClick={restoreBackup} disabled={savingSection === 'all'}>
            <RefreshCw size={14} /> Restore backup
          </button>
          <button type="button" className="cert-editor-btn cert-editor-btn-danger" onClick={deleteOverride} disabled={savingSection === 'all'}>
            <Trash2 size={14} /> Delete from DB
          </button>
          <button type="button" className="cert-editor-btn cert-editor-btn-primary" onClick={syncAll} disabled={savingSection === 'all'}>
            <Database size={14} /> {savingSection === 'all' ? 'Syncing...' : 'Sync all'}
          </button>
        </div>
      </div>

      <div className="cert-editor-grid">
        <motion.section className="cert-editor-card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="cert-editor-card-head cert-editor-card-head-accordion">
            <div>
              <button type="button" className="cert-editor-section-toggle" onClick={() => setExpandedSection(expandedSection === 'hero' ? null : 'hero')}>
                <p className="cert-editor-section-kicker">{CERTIFICATES_SECTION_META.hero.label}</p>
                <h4>{CERTIFICATES_SECTION_META.hero.description}</h4>
                <span className="cert-editor-toggle-icon">{expandedSection === 'hero' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
              </button>
            </div>
            <button type="button" className="cert-editor-btn cert-editor-btn-primary" onClick={saveHero} disabled={savingSection === 'hero'}>
              <Save size={14} /> {savingSection === 'hero' ? 'Saving...' : 'Save hero'}
            </button>
          </div>

          {expandedSection === 'hero' ? <div className="cert-editor-fields">
            <label>
              <FieldLabel>Eyebrow</FieldLabel>
              <TextField value={content.hero.eyebrow} onChange={(value) => updateHeroField('eyebrow', value)} />
            </label>
            <label>
              <FieldLabel>Title</FieldLabel>
              <TextField value={content.hero.title} onChange={(value) => updateHeroField('title', value)} />
            </label>
            <label>
              <FieldLabel>Subtitle</FieldLabel>
              <TextArea value={content.hero.subtitle} onChange={(value) => updateHeroField('subtitle', value)} rows={4} />
            </label>
          </div> : null}
        </motion.section>

        <motion.section className="cert-editor-card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="cert-editor-card-head cert-editor-card-head-stack cert-editor-card-head-accordion">
            <div>
              <button type="button" className="cert-editor-section-toggle" onClick={() => setExpandedSection(expandedSection === 'certificates' ? null : 'certificates')}>
                <p className="cert-editor-section-kicker">{CERTIFICATES_SECTION_META.certificates.label}</p>
                <h4>{CERTIFICATES_SECTION_META.certificates.description}</h4>
                <span className="cert-editor-toggle-icon">{expandedSection === 'certificates' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
              </button>
            </div>
            <div className="cert-editor-banner-actions">
              <button type="button" className="cert-editor-btn cert-editor-btn-secondary" onClick={addCertificate} disabled={savingSection !== null}>
                <Plus size={14} /> Add certificate
              </button>
              <button type="button" className="cert-editor-btn cert-editor-btn-primary" onClick={saveCertificates} disabled={savingSection === 'certificates'}>
                <Save size={14} /> {savingSection === 'certificates' ? 'Saving...' : 'Save list'}
              </button>
            </div>
          </div>

          {expandedSection === 'certificates' ? <div className="cert-editor-list">
            {content.certificates.map((certificate, index) => (
              <div key={certificate.id} className="cert-editor-item">
                <div className="cert-editor-item-head">
                  <button type="button" className="cert-editor-item-toggle" onClick={() => setExpandedCertificateId(expandedCertificateId === certificate.id ? null : certificate.id)}>
                    <div>
                    <p className="cert-editor-item-title">Certificate {index + 1}</p>
                    <p className="cert-editor-item-subtitle">{certificate.title || 'Untitled certificate'}</p>
                    </div>
                    <span className="cert-editor-toggle-icon">{expandedCertificateId === certificate.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
                  </button>
                  <div className="cert-editor-item-actions">
                    <button type="button" className="cert-editor-btn cert-editor-btn-secondary" onClick={() => saveCertificateItem(index)} disabled={savingSection === 'certificates'}>
                      <Save size={14} /> Save item
                    </button>
                    <button type="button" className="cert-editor-btn cert-editor-btn-danger" onClick={() => removeCertificate(index)} disabled={savingSection === 'certificates'}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>

                {expandedCertificateId === certificate.id ? <div className="cert-editor-fields cert-editor-fields-grid">
                  <label>
                    <FieldLabel>Title</FieldLabel>
                    <TextField value={certificate.title} onChange={(value) => updateCertificateField(index, 'title', value)} />
                  </label>
                  <label>
                    <FieldLabel>Issuer</FieldLabel>
                    <TextField value={certificate.issuer} onChange={(value) => updateCertificateField(index, 'issuer', value)} />
                  </label>
                  <label>
                    <FieldLabel>Date</FieldLabel>
                    <TextField value={certificate.date} onChange={(value) => updateCertificateField(index, 'date', value)} />
                  </label>
                  <label>
                    <FieldLabel>Year</FieldLabel>
                    <TextField type="number" value={`${certificate.year}`} onChange={(value) => updateCertificateField(index, 'year', Number.parseInt(value || '0', 10) || new Date().getFullYear())} />
                  </label>
                  <label>
                    <FieldLabel>Category</FieldLabel>
                    <SelectField value={certificate.category} options={CERTIFICATE_CATEGORIES} onChange={(value) => updateCertificateField(index, 'category', value)} ariaLabel="Certificate category" />
                  </label>
                  <label>
                    <FieldLabel>Type</FieldLabel>
                    <SelectField value={certificate.type} options={CERTIFICATE_TYPE_OPTIONS} onChange={(value) => updateCertificateField(index, 'type', value)} ariaLabel="Certificate type" />
                  </label>
                  <label className="cert-editor-span-2">
                    <FieldLabel>File path</FieldLabel>
                    <div className="cert-editor-asset-row">
                      <TextField value={certificate.file} onChange={(value) => updateCertificateField(index, 'file', value)} placeholder="/certificate/example.pdf" />
                      <label className="cert-editor-btn cert-editor-btn-secondary cert-editor-upload-label">
                        <Upload size={14} /> {uploadingKey === `${certificate.id}-asset` ? 'Uploading...' : 'Upload file / image'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,application/pdf"
                          className="cert-editor-hidden-file"
                          disabled={Boolean(uploadingKey)}
                          onChange={async (event) => {
                            const file = event.target.files?.[0]
                            event.currentTarget.value = ''
                            if (!file) {
                              return
                            }
                            await uploadAsset({ file, certificateId: certificate.id })
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="cert-editor-btn cert-editor-btn-danger"
                        disabled={!certificate.file || Boolean(uploadingKey)}
                        onClick={async () => {
                          const Swal = (await import('sweetalert2')).default
                          const confirm = await Swal.fire({
                            icon: 'warning',
                            title: 'Remove certificate asset?',
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

                          await removeAsset({ certificateId: certificate.id, assetUrl: certificate.file })
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </label>
                  <label className="cert-editor-span-2">
                    <FieldLabel>Link</FieldLabel>
                    <TextField value={certificate.link || ''} onChange={(value) => updateCertificateField(index, 'link', value)} placeholder="https://..." />
                  </label>
                  <label className="cert-editor-span-2">
                    <FieldLabel>Credential ID</FieldLabel>
                    <TextField value={certificate.credentialId || ''} onChange={(value) => updateCertificateField(index, 'credentialId', value)} placeholder="Credential or diary number" />
                  </label>
                  <label className="cert-editor-span-2">
                    <FieldLabel>Description</FieldLabel>
                    <TextArea value={certificate.description || ''} onChange={(value) => updateCertificateField(index, 'description', value)} rows={4} />
                  </label>
                  <label className="cert-editor-span-2">
                    <FieldLabel>Tags, one per line</FieldLabel>
                    <TextArea value={joinLines(certificate.tags || [])} onChange={(value) => updateCertificateField(index, 'tags', splitLines(value))} rows={3} />
                  </label>
                </div> : null}
              </div>
            ))}
          </div> : null}
        </motion.section>
      </div>

      <style>{`
        .cert-editor-shell {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cert-editor-banner {
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

        .cert-editor-kicker {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255,255,255,0.72);
          margin-bottom: 8px;
        }

        .cert-editor-banner h3,
        .cert-editor-card h4 {
          margin: 0;
        }

        .cert-editor-banner p:last-child {
          margin-top: 8px;
          color: rgba(255,255,255,0.82);
          line-height: 1.65;
        }

        .cert-editor-source {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.62);
          font-weight: 700;
        }

        .cert-editor-banner-actions,
        .cert-editor-item-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cert-editor-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .cert-editor-card {
          border-radius: 18px;
          border: 1px solid var(--ink-line);
          background: #fff;
          padding: 18px;
          box-shadow: 0 10px 26px rgba(13,31,60,0.08);
        }

        .cert-editor-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 14px;
        }

        .cert-editor-card-head-stack {
          align-items: center;
        }

        .cert-editor-card-head-accordion {
          align-items: flex-start;
        }

        .cert-editor-section-toggle,
        .cert-editor-item-toggle {
          border: none;
          background: transparent;
          text-align: left;
          padding: 0;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .cert-editor-toggle-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid var(--ink-line);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-3);
          flex-shrink: 0;
        }

        .cert-editor-section-kicker {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 6px;
        }

        .cert-editor-card h4 {
          color: var(--ink-3);
          font-size: 13px;
          line-height: 1.6;
          font-weight: 500;
          max-width: 720px;
        }

        .cert-editor-fields {
          display: grid;
          gap: 12px;
        }

        .cert-editor-fields-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 14px;
        }

        .cert-editor-span-2 {
          grid-column: span 2;
        }

        .cert-editor-asset-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          gap: 8px;
        }

        .cert-editor-upload-label {
          position: relative;
          overflow: hidden;
        }

        .cert-editor-hidden-file {
          display: none;
        }

        .cert-editor-list {
          display: grid;
          gap: 14px;
        }

        .cert-editor-item {
          border-radius: 16px;
          border: 1px solid var(--ink-line);
          background: linear-gradient(180deg, #fff, #FBFCFE);
          padding: 14px;
        }

        .cert-editor-item-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .cert-editor-item-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 4px;
        }

        .cert-editor-item-subtitle {
          font-size: 14px;
          color: var(--ink);
          line-height: 1.5;
          font-weight: 600;
        }

        .cert-editor-field-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink-4);
          margin-bottom: 6px;
        }

        .cert-editor-input,
        .cert-editor-textarea,
        .cert-editor-select {
          width: 100%;
          border: 1px solid var(--ink-line);
          border-radius: 10px;
          padding: 10px 12px;
          background: #fff;
          color: var(--ink);
          font: inherit;
          outline: none;
        }

        .cert-editor-textarea {
          resize: vertical;
          min-height: 92px;
        }

        .cert-editor-btn {
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

        .cert-editor-btn-primary {
          background: linear-gradient(135deg, #1A6B48 0%, #0E8E57 100%);
          color: #fff;
          border-color: rgba(14,142,87,0.32);
        }

        .cert-editor-btn-secondary {
          background: rgba(13,31,60,0.05);
          color: var(--navy);
          border-color: rgba(13,31,60,0.12);
        }

        .cert-editor-btn-danger {
          background: linear-gradient(135deg, #B42318 0%, #D92D20 100%);
          color: #fff;
          border-color: rgba(185,28,28,0.24);
        }

        .cert-editor-btn:disabled {
          opacity: 0.58;
          cursor: not-allowed;
        }

        .cert-editor-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .cert-editor-banner,
          .cert-editor-card-head,
          .cert-editor-item-head {
            flex-direction: column;
          }

          .cert-editor-fields-grid,
          .cert-editor-span-2 {
            grid-column: span 1;
          }

          .cert-editor-asset-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}