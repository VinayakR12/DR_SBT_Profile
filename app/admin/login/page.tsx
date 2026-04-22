'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
} from 'lucide-react'

type Banner = { type: 'success' | 'error' | 'info'; text: string }

const FEATURES = [
  { icon: LayoutDashboard, label: 'Dashboard Overview',  desc: 'Analytics & key metrics at a glance' },
   { icon: FileText,        label: 'Content Control',     desc: 'Pages, posts & media assets' },
  { icon: BarChart3,       label: 'Reports & Insights',  desc: 'Performance data & activity logs' },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [banner,       setBanner]       = useState<Banner | null>(null)
  const [focused,      setFocused]      = useState<string | null>(null)

  const canSubmit = useMemo(
    () => email.trim().length > 5 && password.trim().length > 5,
    [email, password]
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true)
    setBanner(null)
    try {
      const res  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as { ok?: boolean; message?: string }
      if (!res.ok || !data.ok) {
        setBanner({ type: 'error', text: data.message || 'Invalid credentials. Please try again.' })
        return
      }
      setBanner({ type: 'success', text: 'Authentication successful. Redirecting to dashboard…' })
      setTimeout(() => { router.push('/admin'); router.refresh() }, 1000)
    } catch {
      setBanner({ type: 'error', text: 'Connection error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="alp-root">
      <div className="alp-texture" />
      <div className="alp-topbar" />

      <div className="alp-wrap">

        {/* ── Left info panel ── */}
        <motion.aside
          className="alp-panel"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="alp-panel-glow" />

          <div className="alp-shield-badge">
            <ShieldCheck size={24} strokeWidth={1.6} />
          </div>

          <p className="alp-panel-kicker">Admin Control Center</p>
          <h1 className="alp-panel-title">Secure Portal Access</h1>
          <p className="alp-panel-body">
            This console is restricted to authorised administrators only. Your session is encrypted and scoped to admin routes.
          </p>

          <div className="alp-rule" />

          <p className="alp-feat-heading">What you can manage</p>
          <ul className="alp-feats">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <li key={label} className="alp-feat">
                <div className="alp-feat-icon">
                  <Icon size={13} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="alp-feat-label">{label}</p>
                  <p className="alp-feat-desc">{desc}</p>
                </div>
              </li>
            ))}
          </ul>

          
        </motion.aside>

        {/* ── Right login card ── */}
        <motion.main
          className="alp-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="alp-card-topbar" />

          <div className="alp-card-body">
            <div className="alp-card-head">
              <p className="alp-card-kicker">Welcome back</p>
              <h2 className="alp-card-title">Administrator Login</h2>
              <p className="alp-card-sub">Enter your credentials to access the control panel.</p>
            </div>

            <AnimatePresence mode="wait">
              {banner && (
                <motion.div
                  key={banner.text}
                  className={`alp-banner alp-banner-${banner.type}`}
                  initial={{ opacity: 0, y: -6, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, y: 0,  height: 'auto', marginBottom: 20 }}
                  exit={{    opacity: 0,         height: 0,       marginBottom: 0  }}
                  transition={{ duration: 0.22 }}
                >
                  {banner.type === 'success'
                    ? <CheckCircle2 size={14} strokeWidth={2} className="alp-banner-ico" />
                    : <AlertCircle  size={14} strokeWidth={2} className="alp-banner-ico" />
                  }
                  <span>{banner.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="alp-form" onSubmit={handleSubmit} noValidate>

              <div className="alp-field">
                <label htmlFor="alp-email" className="alp-label">Email Address</label>
                <div className={`alp-inp-wrap ${focused === 'email' ? 'alp-inp-focus' : ''}`}>
                  <Mail size={14} strokeWidth={1.8} className="alp-inp-icon" />
                  <input
                    id="alp-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                    className="alp-inp"
                  />
                </div>
              </div>

              <div className="alp-field">
                <label htmlFor="alp-pass" className="alp-label">Password</label>
                <div className={`alp-inp-wrap ${focused === 'pass' ? 'alp-inp-focus' : ''}`}>
                  <KeyRound size={14} strokeWidth={1.8} className="alp-inp-icon" />
                  <input
                    id="alp-pass"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('pass')}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="alp-inp"
                  />
                  <button
                    type="button"
                    className="alp-eye"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword
                      ? <EyeOff size={13} strokeWidth={1.8} />
                      : <Eye    size={13} strokeWidth={1.8} />
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="alp-btn"
                disabled={!canSubmit || loading}
                aria-busy={loading}
              >
                {loading ? (
                  <><span className="alp-spin" /><span>Authenticating…</span></>
                ) : (
                  <><span>Access Dashboard</span><ArrowRight size={15} strokeWidth={2.2} /></>
                )}
              </button>

            </form>

           <div className="alp-trust">
  <span className="alp-trust-dot" /><span>Secure Connection</span>
  <span className="alp-trust-sep"> · </span>
  <span className="alp-trust-dot" /><span>Authenticated User Access</span>
  <span className="alp-trust-sep"> · </span>
  <span className="alp-trust-dot" /><span>Encrypted Session</span>
</div>
          </div>

         
        </motion.main>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        .alp-root {
          margin-top: 50px;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 20px;
          background: #F8F6F1;
          position: relative; overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Subtle woven texture */
        .alp-texture {
        margin: 0; padding: 0;
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(180,155,90,0.04) 3px, rgba(180,155,90,0.04) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(13,31,60,0.018) 10px, rgba(13,31,60,0.018) 11px);
        }

        /* Gold top accent bar */
        .alp-topbar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px; z-index: 10;
          background: linear-gradient(90deg, #9A6E00 0%, #C8960A 35%, #E8C040 60%, #B8870A 100%);
        }

        .alp-wrap {
          position: relative; z-index: 1;
          width: 100%; max-width: 1040px;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 430px);
          gap: 20px;
          align-items: stretch;
        }

        /* ─── LEFT PANEL ─── */
        .alp-panel {
          background: #0D1F3C;
          border-radius: 20px;
          padding: 44px 38px;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          box-shadow: 0 24px 72px rgba(13,31,60,0.32), 0 2px 8px rgba(13,31,60,0.14);
        }

        .alp-panel-glow {
          position: absolute; top: -80px; right: -80px;
          width: 260px; height: 260px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(200,150,10,0.14) 0%, transparent 65%);
        }

        .alp-shield-badge {
          width: 50px; height: 50px; border-radius: 13px;
          background: rgba(200,150,10,0.14);
          border: 1px solid rgba(200,150,10,0.32);
          display: flex; align-items: center; justify-content: center;
          color: #D4A020; margin-bottom: 22px; flex-shrink: 0;
        }

        .alp-panel-kicker {
          font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: #C8960A; margin-bottom: 10px;
        }

        .alp-panel-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3vw, 38px); line-height: 1.12;
          color: #fff; margin-bottom: 14px; letter-spacing: -0.02em;
        }

        .alp-panel-body {
          font-size: 13.5px; line-height: 1.8; color: rgba(255,255,255,0.48);
          margin-bottom: 26px;
        }

        .alp-rule {
          width: 100%; height: 1px;
          background: rgba(255,255,255,0.08);
          margin-bottom: 22px;
        }

        .alp-feat-heading {
          font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.28);
          margin-bottom: 14px;
        }

        .alp-feats { list-style: none; padding: 0; margin: 0; display: grid; gap: 13px; flex: 1; }

        .alp-feat { display: flex; align-items: flex-start; gap: 11px; }

        .alp-feat-icon {
          width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5); margin-top: 1px;
        }

        .alp-feat-label {
          font-size: 12.5px; font-weight: 600; color: rgba(255,255,255,0.82);
          margin: 0 0 2px;
        }

        .alp-feat-desc {
          font-size: 11.5px; color: rgba(255,255,255,0.34); margin: 0; line-height: 1.5;
        }

        .alp-panel-foot {
          margin-top: 26px; padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: rgba(255,255,255,0.22);
          letter-spacing: 0.04em;
        }

        /* ─── RIGHT CARD ─── */
        .alp-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(184,135,10,0.16);
          box-shadow: 0 16px 52px rgba(13,31,60,0.1), 0 1px 4px rgba(13,31,60,0.06);
          display: flex; flex-direction: column; overflow: hidden;
        }

        .alp-card-topbar {
          height: 3px;
          background: linear-gradient(90deg, #9A6E00, #D4A020 50%, #9A6E00);
        }

        .alp-card-body {
          padding: 34px 34px 24px;
          flex: 1;
        }

        .alp-card-head { margin-bottom: 22px; }

        .alp-card-kicker {
          font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: #B8870A; margin-bottom: 8px;
        }

        .alp-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 25px; color: #0D1F3C;
          letter-spacing: -0.02em; margin-bottom: 7px;
        }

        .alp-card-sub { font-size: 13.5px; color: #6B7280; line-height: 1.65; }

        /* Banner */
        .alp-banner {
          display: flex; align-items: flex-start; gap: 9px;
          border-radius: 10px; padding: 11px 13px;
          font-size: 13px; font-weight: 500; overflow: hidden; line-height: 1.5;
        }
        .alp-banner-ico { flex-shrink: 0; margin-top: 1px; }
        .alp-banner-success { background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; }
        .alp-banner-error   { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; }
        .alp-banner-info    { background: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; }

        /* Form */
        .alp-form { display: grid; gap: 16px; }
        .alp-field { display: grid; gap: 7px; }

        .alp-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #374151;
        }

        .alp-inp-wrap {
          position: relative; border-radius: 11px;
          border: 1.5px solid #E5E7EB;
          background: #FAFAFA;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
        }

        .alp-inp-wrap.alp-inp-focus {
          border-color: #B8870A; background: #fff;
          box-shadow: 0 0 0 3px rgba(184,135,10,0.1);
        }

        .alp-inp-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          color: #C4C9D4; pointer-events: none;
          transition: color 0.16s;
        }

        .alp-inp-wrap.alp-inp-focus .alp-inp-icon { color: #B8870A; }

        .alp-inp {
          width: 100%; padding: 13px 40px 13px 37px;
          background: transparent; border: none; outline: none;
          color: #111827; font-family: 'Inter', sans-serif;
          font-size: 14px; caret-color: #B8870A;
        }

        .alp-inp::placeholder { color: #D1D5DB; }

        .alp-eye {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #C4C9D4; display: flex; align-items: center;
          padding: 4px; transition: color 0.16s;
        }

        .alp-eye:hover { color: #B8870A; }

        /* Submit */
        .alp-btn {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; width: 100%; margin-top: 4px;
          padding: 14px 20px; border-radius: 11px; border: none;
          background: linear-gradient(135deg, #0A1A30 0%, #16335E 100%);
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 14.5px; font-weight: 600; letter-spacing: 0.01em;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(13,31,60,0.28);
          transition: transform 0.16s, box-shadow 0.18s, opacity 0.18s;
        }

        .alp-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 26px rgba(13,31,60,0.35);
        }

        .alp-btn:active:not(:disabled) { transform: translateY(0); }
        .alp-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .alp-spin {
          width: 14px; height: 14px; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff; border-radius: 50%;
          animation: alp-spin 0.65s linear infinite;
        }

        @keyframes alp-spin { to { transform: rotate(360deg); } }

        /* Trust row */
        .alp-trust {
          display: flex; align-items: center; gap: 6px;
          justify-content: center; flex-wrap: wrap;
          margin-top: 14px; font-size: 11.5px; color: #9CA3AF;
        }

        .alp-trust-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22C55E; flex-shrink: 0;
        }

        .alp-trust-sep { color: #E5E7EB; }

        /* Card footer */
        .alp-card-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 34px 16px;
          border-top: 1px solid #F3F4F6;
        }

        .alp-back {
          font-size: 13px; font-weight: 500; color: #9CA3AF;
          text-decoration: none; transition: color 0.16s;
        }

        .alp-back:hover { color: #0D1F3C; }

        .alp-foot-tag { font-size: 11px; color: #D1D5DB; letter-spacing: 0.06em; }

        /* Responsive */
        @media (max-width: 840px) {
          .alp-wrap { grid-template-columns: 1fr; max-width: 460px; }
          .alp-panel { padding: 30px 26px; }
          .alp-feats { display: none; }
        }

        @media (max-width: 480px) {
          .alp-root { padding: 24px 12px; }
          .alp-card-body { padding: 26px 20px 20px; }
          .alp-card-foot { padding: 12px 20px 14px; }
        }
      `}</style>
    </div>
  )
}