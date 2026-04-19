'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CircleUserRound,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

type Banner = {
  type: 'success' | 'error' | 'info'
  text: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('Admin@gmail.com')
  const [password, setPassword] = useState('admin@123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [banner, setBanner] = useState<Banner | null>({
    type: 'info',
    text: 'Use your admin credentials to access the control center.',
  })

  const canSubmit = useMemo(() => email.trim().length > 5 && password.trim().length > 5, [email, password])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit || loading) {
      return
    }

    setLoading(true)
    setBanner(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = (await res.json()) as { ok?: boolean; message?: string }

      if (!res.ok || !data.ok) {
        setBanner({
          type: 'error',
          text: data.message || 'Login failed. Please verify your credentials.',
        })
        return
      }

      setBanner({ type: 'success', text: 'Welcome back. Redirecting to dashboard...' })
      setTimeout(() => {
        router.push('/admin')
        router.refresh()
      }, 800)
    } catch {
      setBanner({
        type: 'error',
        text: 'Server error while logging in. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg-orb admin-login-bg-orb-a" />
      <div className="admin-login-bg-orb admin-login-bg-orb-b" />

      <div className="W admin-login-wrap">
        <motion.section
          className="admin-login-hero"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="admin-login-badge">
            <ShieldCheck size={30} color="var(--gold-3)" />
          </div>
          <p className="admin-login-kicker">Corporate Admin Console</p>
          <h1 className="admin-login-title">Secure access for authenticated administrators.</h1>
          <p className="admin-login-copy">
            This panel now validates against configured admin credentials and supports Supabase authentication.
          </p>

          <div className="admin-login-points">
            <div className="admin-login-point">
              <Sparkles size={14} />
              <span>Supabase-powered login handshake</span>
            </div>
            <div className="admin-login-point">
              <Sparkles size={14} />
              <span>Session-protected dashboard routes</span>
            </div>
            <div className="admin-login-point">
              <Sparkles size={14} />
              <span>Premium micro-interactions and status alerts</span>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="admin-login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="admin-login-head">
            <p className="admin-login-flag">Welcome back</p>
            <h2>Admin Login</h2>
            <p>Enter your credentials to continue to the dashboard.</p>
          </div>

          {banner && (
            <div className={`admin-login-banner admin-login-banner-${banner.type}`}>
              {banner.text}
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="admin-login-field">
              <span>Email</span>
              <div className="admin-login-input-wrap">
                <CircleUserRound size={16} className="admin-login-icon" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin@gmail.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="admin-login-field">
              <span>Password</span>
              <div className="admin-login-input-wrap">
                <KeyRound size={16} className="admin-login-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin@123"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="admin-login-eye"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button type="submit" className="admin-login-submit" disabled={!canSubmit || loading}>
              {loading ? 'Signing in...' : 'Enter Dashboard'} <ArrowRight size={16} />
            </button>

            <p className="admin-login-note">
              Your session is protected and restricted to admin routes.
            </p>
          </form>

          <div className="admin-login-footer">
            <Link href="/" className="admin-login-return">
              Return to website
            </Link>
          </div>
        </motion.section>
      </div>

      <style>{`
        .admin-login-page {
          min-height: calc(100vh - var(--nav-h));
          padding: 92px 20px 72px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 18%, rgba(184,135,10,0.15), transparent 34%),
            radial-gradient(circle at 86% 0%, rgba(13,31,60,0.10), transparent 30%),
            linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 56%, #FFFDF8 100%);
        }

        .admin-login-bg-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(14px);
          pointer-events: none;
        }

        .admin-login-bg-orb-a {
          width: 250px;
          height: 250px;
          right: -90px;
          top: 100px;
          background: rgba(13,31,60,0.10);
        }

        .admin-login-bg-orb-b {
          width: 290px;
          height: 290px;
          left: -120px;
          bottom: 70px;
          background: rgba(184,135,10,0.13);
        }

        .admin-login-wrap {
          max-width: 1180px;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 470px);
          gap: 28px;
          align-items: stretch;
          position: relative;
          z-index: 1;
        }

        .admin-login-hero {
          border-radius: 28px;
          padding: 36px clamp(22px, 4vw, 44px);
          background: linear-gradient(145deg, #0D1F3C 0%, #16335E 48%, #0D1F3C 100%);
          color: #fff;
          box-shadow: 0 20px 54px rgba(13,31,60,0.23);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .admin-login-badge {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        .admin-login-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.74);
          margin-bottom: 14px;
        }

        .admin-login-title {
          font-size: clamp(32px, 4.8vw, 54px);
          line-height: 1.04;
          color: #fff;
          margin-bottom: 16px;
          max-width: 640px;
        }

        .admin-login-copy {
          max-width: 590px;
          font-size: 16px;
          color: rgba(255,255,255,0.86);
          line-height: 1.8;
          margin-bottom: 28px;
        }

        .admin-login-points {
          display: grid;
          gap: 12px;
          max-width: 560px;
        }

        .admin-login-point {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.9);
          font-size: 14.5px;
        }

        .admin-login-card {
          border-radius: 28px;
          background: #fff;
          border: 1px solid var(--ink-line);
          box-shadow: 0 18px 48px rgba(13,31,60,0.11);
          padding: 30px clamp(20px, 3.5vw, 34px);
          backdrop-filter: blur(4px);
        }

        .admin-login-head {
          margin-bottom: 22px;
        }

        .admin-login-flag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 10px;
        }

        .admin-login-head h2 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .admin-login-head p {
          color: var(--ink-3);
          line-height: 1.7;
        }

        .admin-login-banner {
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 14px;
          font-size: 13px;
          font-weight: 600;
        }

        .admin-login-banner-info {
          background: rgba(13,31,60,0.06);
          border: 1px solid rgba(13,31,60,0.14);
          color: var(--navy);
        }

        .admin-login-banner-success {
          background: rgba(16,129,73,0.10);
          border: 1px solid rgba(16,129,73,0.2);
          color: #0E6940;
        }

        .admin-login-banner-error {
          background: rgba(186,35,35,0.08);
          border: 1px solid rgba(186,35,35,0.2);
          color: #8A1E1E;
        }

        .admin-login-form {
          display: grid;
          gap: 16px;
        }

        .admin-login-field {
          display: grid;
          gap: 8px;
        }

        .admin-login-field span {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-2);
        }

        .admin-login-input-wrap {
          position: relative;
        }

        .admin-login-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--ink-4);
        }

        .admin-login-input-wrap input {
          width: 100%;
          padding: 14px 44px 14px 42px;
          border-radius: 14px;
          border: 1px solid var(--ink-line);
          background: var(--off);
          color: var(--ink);
          font-size: 15px;
          outline: none;
          font-family: inherit;
          transition: box-shadow 0.18s, border-color 0.18s, background 0.18s;
        }

        .admin-login-input-wrap input:focus {
          border-color: var(--gold-border);
          box-shadow: 0 0 0 3px rgba(184,135,10,0.12);
          background: #fff;
        }

        .admin-login-eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: var(--ink-4);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .admin-login-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          margin-top: 4px;
          padding: 14px 18px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(13,31,60,0.18);
          transition: transform 0.16s, box-shadow 0.16s, opacity 0.16s;
        }

        .admin-login-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 34px rgba(13,31,60,0.2);
        }

        .admin-login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .admin-login-note {
          font-size: 12.5px;
          color: var(--ink-4);
          line-height: 1.6;
          text-align: center;
        }

        .admin-login-footer {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid var(--ink-line);
        }

        .admin-login-return {
          color: var(--navy);
          font-weight: 700;
          text-decoration: none;
          transition: color 0.16s;
        }

        .admin-login-return:hover {
          color: var(--gold);
        }

        @media (max-width: 980px) {
          .admin-login-wrap {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
