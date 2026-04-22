
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, GraduationCap, ChevronRight, ChevronDown,
  Home, User, FlaskConical, Trophy, BookOpen, Mail,
  Award, Shield, FileText, Star, Briefcase, LogIn,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
type DropItem = { href: string; label: string; desc: string; icon: any }
type NavItem =
  | { type: 'link';     href: string; label: string; icon: any }
  | { type: 'dropdown'; label: string; href: string; icon: any; items: DropItem[] }

// ── Nav structure ──────────────────────────────────────────────
const NAV: NavItem[] = [
  { type: 'link',     href: '/',         label: 'Home',         icon: Home },
  { type: 'link',     href: '/about',    label: 'About',        icon: User },
  {
    type: 'dropdown',
    label: 'Research',
    href: '/research',
    icon: FlaskConical,
    items: [
      {
        href: '/research/publications',
        label: 'Publications',
        desc: '15 journals · 7 conferences',
        icon: FileText,
      },
      {
        href: '/research/patents',
        label: 'Patents & IP',
        desc: '2 utility patents · 2 copyrights',
        icon: Shield,
      },
    ],
  },
  {
    type: 'dropdown',
    label: 'Achievements',
    href: '/achievements',
    icon: Award,
    items: [
      {
        href: '/achievements/awards',
        label: 'Awards & Honors',
        desc: 'Academic recognition & appreciation',
        icon: Star,
      },
      {
        href: '/achievements/certificates',
        label: 'Certificates',
        desc: 'Certifications & Credentials',
        icon: Award,
      },
    ],
  },
  { type: 'link',     href: '/projects', label: 'Projects',     icon: Trophy },
  { type: 'link',     href: '/teaching', label: 'Teaching',     icon: BookOpen },
]

const MOBILE_QUICK = [
  { href: '/research/publications',     label: 'Publications',   icon: FileText },
  { href: '/research/patents',          label: 'Patents & IP',   icon: Shield },
  { href: '/achievements/awards',       label: 'Awards',         icon: Award },
  { href: '/achievements/certificates', label: 'Certificates',   icon: Briefcase },
]

// ── Dropdown Panel ─────────────────────────────────────────────
function DropPanel({ items, visible }: { items: DropItem[]; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 270,
            background: '#fff',
            border: '1px solid var(--ink-line)',
            borderRadius: 14,
            boxShadow: '0 12px 40px rgba(13,31,60,0.14), 0 2px 8px rgba(13,31,60,0.07)',
            padding: '8px',
            zIndex: 200,
            pointerEvents: 'all',
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Arrow */}
          <div style={{
            position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)',
            width: 10, height: 10, background: '#fff',
            border: '1px solid var(--ink-line)',
            borderBottom: 'none', borderRight: 'none',
            rotate: '45deg',
          }} />

          {items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 9,
                textDecoration: 'none',
                transition: 'background 0.15s',
                borderBottom: i === 0 && items.length > 1 ? '1px solid var(--ink-line)' : 'none',
                marginBottom: i === 0 && items.length > 1 ? 4 : 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--off)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: i === 0 ? 'var(--navy-pale)' : 'var(--off)',
                border: `1px solid ${i === 0 ? 'var(--navy-glow)' : 'var(--ink-line)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <item.icon size={15} style={{ color: i === 0 ? 'var(--navy)' : 'var(--ink-3)' }} />
              </div>
              <div>
                <p style={{
                  fontSize: 13, fontWeight: i === 0 ? 700 : 500,
                  color: 'var(--navy)', lineHeight: 1.2, marginBottom: 2,
                }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.3 }}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Main Navbar ────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false)
  const [open, setOpen]                   = useState(false)
  const [dropdown, setDropdown]           = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname                          = usePathname()
  const dropTimer                         = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false); setDropdown(null) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // ── Active state helpers ──────────────────────────────────
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isDropdownActive = (items: DropItem[]) =>
    items.some(item => isActive(item.href))

  // ── Hover with delay ──────────────────────────────────────
  const openDrop  = (label: string) => {
    if (dropTimer.current) clearTimeout(dropTimer.current)
    setDropdown(label)
  }
  const closeDrop = () => {
    dropTimer.current = setTimeout(() => setDropdown(null), 120)
  }
  const stayOpen  = () => {
    if (dropTimer.current) clearTimeout(dropTimer.current)
  }

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-h)',
        background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        backdropFilter: scrolled ? 'blur(18px) saturate(1.5)' : 'none',
        borderBottom: '1px solid var(--ink-line)',
        boxShadow: scrolled ? '0 2px 20px rgba(13,31,60,0.08)' : 'none',
        transition: 'box-shadow 0.3s',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="W" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 3px 10px var(--navy-glow)',
            }}>
              <GraduationCap size={17} color="#fff" strokeWidth={2} />
            </div>
            <div className="logo-text">
              <p style={{
                fontFamily: 'Playfair Display, serif', fontSize: 14.5, fontWeight: 600,
                color: 'var(--navy)', lineHeight: 1.2, letterSpacing: '-0.01em',
              }}>
                Dr. Sachin Takmare
              </p>
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.13em',
                textTransform: 'uppercase', color: 'var(--gold)', lineHeight: 1, marginTop: 2,
              }}>
                Ph.D · AI & ML
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="desk-nav" style={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            {NAV.map(item => {
              if (item.type === 'link') {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      position: 'relative',
                      display: 'flex', alignItems: 'center', height: '100%',
                      padding: '0 12px',
                      fontSize: 13,
                      fontWeight: active ? 700 : 400,
                      color: active ? 'var(--gold)' : 'var(--ink-3)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.18s',
                      // Golden pill background when active
                      background: active
                        ? 'linear-gradient(180deg, rgba(184,135,10,0.10) 0%, rgba(184,135,10,0.06) 100%)'
                        : 'transparent',
                      borderRadius: active ? '6px 6px 0 0' : 0,
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)' }}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active-bar"
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: 2,
                          background: 'linear-gradient(90deg, var(--gold), var(--gold-3))',
                          borderRadius: '2px 2px 0 0',
                          display: 'block',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>
                )
              }

              // Dropdown — main label is a link + chevron triggers dropdown
              const dropItem   = item as Extract<NavItem, { type: 'dropdown' }>
              const isActiveDrop = isDropdownActive(dropItem.items)
              const isOpen       = dropdown === dropItem.label

              return (
                <div
                  key={dropItem.label}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}
                  onMouseEnter={() => openDrop(dropItem.label)}
                  onMouseLeave={closeDrop}
                >
                  {/* Main label → navigates to section overview */}
                  <Link
                    href={dropItem.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      padding: '0 10px 0 12px', height: '100%',
                      background: isActiveDrop
                        ? 'linear-gradient(180deg, rgba(184,135,10,0.10) 0%, rgba(184,135,10,0.06) 100%)'
                        : 'transparent',
                      borderRadius: isActiveDrop ? '6px 6px 0 0' : 0,
                      fontSize: 13,
                      fontWeight: isActiveDrop ? 700 : 400,
                      color: isActiveDrop ? 'var(--gold)' : isOpen ? 'var(--navy)' : 'var(--ink-3)',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.18s',
                      textDecoration: 'none',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!isActiveDrop) (e.currentTarget as HTMLElement).style.color = 'var(--navy)'
                    }}
                    onMouseLeave={e => {
                      if (!isActiveDrop) (e.currentTarget as HTMLElement).style.color = isOpen ? 'var(--navy)' : 'var(--ink-3)'
                    }}
                  >
                    {dropItem.label}
                    {/* Active bar */}
                    {isActiveDrop && (
                      <motion.span
                        layoutId="nav-active-bar"
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: 2,
                          background: 'linear-gradient(90deg, var(--gold), var(--gold-3))',
                          borderRadius: '2px 2px 0 0',
                          display: 'block',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>

                  {/* Chevron toggle button */}
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 8px 0 2px', height: '100%',
                      background: isActiveDrop
                        ? 'linear-gradient(180deg, rgba(184,135,10,0.10) 0%, rgba(184,135,10,0.06) 100%)'
                        : 'transparent',
                      borderRadius: isActiveDrop ? '0 6px 0 0' : 0,
                      border: 'none', cursor: 'pointer',
                      color: isActiveDrop ? 'var(--gold)' : isOpen ? 'var(--navy)' : 'var(--ink-3)',
                      transition: 'color 0.18s',
                      position: 'relative',
                    }}
                    aria-label={`Toggle ${dropItem.label} menu`}
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronDown size={12} />
                    </motion.span>
                    {/* Active bar continuation */}
                    {isActiveDrop && (
                      <span style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: 2,
                        background: 'linear-gradient(90deg, var(--gold), var(--gold-3))',
                        borderRadius: '2px 2px 0 0',
                        display: 'block',
                      }} />
                    )}
                  </button>

                  <div onMouseEnter={stayOpen} onMouseLeave={closeDrop}>
                    <DropPanel items={dropItem.items} visible={isOpen} />
                  </div>
                </div>
              )
            })}
          </nav>

          {/* ── Right controls ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              href="/admin/login"
              className="desk-nav"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: 7,
                background: 'rgba(13,31,60,0.04)',
                color: 'var(--navy)',
                fontSize: 12.5, fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid var(--ink-line)',
                whiteSpace: 'nowrap',
                transition: 'background 0.18s, transform 0.15s, border-color 0.18s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--gold-pale)'
                el.style.borderColor = 'var(--gold-border)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(13,31,60,0.04)'
                el.style.borderColor = 'var(--ink-line)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <LogIn size={13} /> Admin Login
            </Link>

            <Link
              href="/contact"
              className="desk-nav collaborate-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '7px 16px', borderRadius: 7,
                background: 'var(--navy)',
                color: '#fff',
                fontSize: 12.5, fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 10px var(--navy-glow)',
                transition: 'background 0.18s, transform 0.15s, box-shadow 0.15s',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--gold)'
                el.style.transform = 'translateY(-1px)'
                el.style.boxShadow = '0 4px 16px var(--gold-glow)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--navy)'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 2px 10px var(--navy-glow)'
              }}
            >
              Collaborate
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              title="Toggle menu"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="mob-btn"
              style={{
                width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
                display: 'none', alignItems: 'center', justifyContent: 'center',
                background: 'var(--off)', border: '1px solid var(--ink-line)',
                color: 'var(--navy)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={open ? 'x' : 'm'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  {open ? <X size={16} /> : <Menu size={16} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════
          MOBILE DRAWER
      ══════════════════════════ */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 998,
                background: 'rgba(13,31,60,0.50)',
                backdropFilter: 'blur(5px)',
              }}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(300px, 90vw)',
                background: '#fff',
                borderLeft: '1px solid var(--ink-line)',
                zIndex: 999,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Drawer header — always shows name */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--ink-line)',
                background: 'var(--off)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px var(--navy-glow)',
                  }}>
                    <GraduationCap size={16} color="#fff" strokeWidth={2} />
                  </div>
                  <div>
                    <p style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 14, fontWeight: 600,
                      color: 'var(--navy)', lineHeight: 1.2,
                    }}>
                      Dr. Sachin Takmare
                    </p>
                    <p style={{
                      fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.13em', textTransform: 'uppercase',
                      color: 'var(--gold)', marginTop: 2,
                    }}>
                      Ph.D · AI & ML · 18+ Yrs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 30, height: 30, borderRadius: 7,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fff', border: '1px solid var(--ink-line)',
                    cursor: 'pointer', color: 'var(--ink-3)',
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Drawer links */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>

                {NAV.map((item, idx) => {
                  if (item.type === 'link') {
                    const active = isActive(item.href)
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <Link
                          href={item.href}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '9px 10px', borderRadius: 9, marginBottom: 2,
                            textDecoration: 'none',
                            // Golden bg when active
                            background: active
                              ? 'linear-gradient(135deg, rgba(184,135,10,0.12) 0%, rgba(184,135,10,0.06) 100%)'
                              : 'transparent',
                            border: `1px solid ${active ? 'rgba(184,135,10,0.28)' : 'transparent'}`,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: 8,
                              background: active ? 'rgba(184,135,10,0.15)' : 'var(--off)',
                              border: `1px solid ${active ? 'rgba(184,135,10,0.30)' : 'var(--ink-line)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: active ? 'var(--gold)' : 'var(--ink-3)',
                            }}>
                              <item.icon size={13} />
                            </div>
                            <span style={{
                              fontSize: 13.5, fontWeight: active ? 700 : 400,
                              color: active ? 'var(--gold)' : 'var(--ink)',
                            }}>
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight size={11} style={{ color: active ? 'var(--gold)' : 'var(--ink-4)' }} />
                        </Link>
                      </motion.div>
                    )
                  }

                  // Dropdown section in mobile
                  const dropItem    = item as Extract<NavItem, { type: 'dropdown' }>
                  const isExpanded  = mobileExpanded === dropItem.label
                  const anyActive   = isDropdownActive(dropItem.items)

                  return (
                    <motion.div
                      key={dropItem.label}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{ marginBottom: 2 }}
                    >
                      {/* Section header — tap to expand OR tap label to navigate */}
                      <div style={{ display: 'flex', alignItems: 'stretch' }}>
                        {/* Main label → navigate to section page */}
                        <Link
                          href={dropItem.href}
                          style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                            padding: '9px 6px 9px 10px', borderRadius: '9px 0 0 9px',
                            textDecoration: 'none',
                            background: anyActive
                              ? 'linear-gradient(135deg, rgba(184,135,10,0.12) 0%, rgba(184,135,10,0.06) 100%)'
                              : 'transparent',
                            border: `1px solid ${anyActive ? 'rgba(184,135,10,0.28)' : 'transparent'}`,
                            borderRight: 'none',
                          }}
                        >
                          <div style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: anyActive ? 'rgba(184,135,10,0.15)' : 'var(--off)',
                            border: `1px solid ${anyActive ? 'rgba(184,135,10,0.30)' : 'var(--ink-line)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: anyActive ? 'var(--gold)' : 'var(--ink-3)',
                            flexShrink: 0,
                          }}>
                            <dropItem.icon size={13} />
                          </div>
                          <span style={{
                            fontSize: 13.5, fontWeight: anyActive ? 700 : 400,
                            color: anyActive ? 'var(--gold)' : 'var(--ink)',
                          }}>
                            {dropItem.label}
                          </span>
                        </Link>

                        {/* Chevron toggle */}
                        <button
                          onClick={() => setMobileExpanded(isExpanded ? null : dropItem.label)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0 12px',
                            background: anyActive
                              ? 'linear-gradient(135deg, rgba(184,135,10,0.09) 0%, rgba(184,135,10,0.04) 100%)'
                              : 'var(--off)',
                            border: `1px solid ${anyActive ? 'rgba(184,135,10,0.28)' : 'var(--ink-line)'}`,
                            borderLeft: `1px solid ${anyActive ? 'rgba(184,135,10,0.15)' : 'var(--ink-line)'}`,
                            borderRadius: '0 9px 9px 0',
                            cursor: 'pointer',
                            color: anyActive ? 'var(--gold)' : 'var(--ink-4)',
                            minWidth: 40,
                          }}
                          aria-label={`Expand ${dropItem.label}`}
                        >
                          <motion.span
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ display: 'flex' }}
                          >
                            <ChevronRight size={13} />
                          </motion.span>
                        </button>
                      </div>

                      {/* Sub-links */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ paddingLeft: 10, paddingBottom: 2, paddingTop: 3 }}>
                              {dropItem.items.map((sub) => {
                                const subActive = isActive(sub.href)
                                return (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 10,
                                      padding: '8px 10px', borderRadius: 8, marginBottom: 2,
                                      textDecoration: 'none',
                                      background: subActive
                                        ? 'linear-gradient(135deg, rgba(184,135,10,0.10) 0%, rgba(184,135,10,0.05) 100%)'
                                        : 'transparent',
                                      border: `1px solid ${subActive ? 'rgba(184,135,10,0.22)' : 'transparent'}`,
                                      borderLeft: `2px solid ${subActive ? 'var(--gold)' : 'var(--ink-line)'}`,
                                    }}
                                  >
                                    <div style={{
                                      width: 26, height: 26, borderRadius: 7,
                                      background: subActive ? 'rgba(184,135,10,0.12)' : 'var(--off)',
                                      border: `1px solid ${subActive ? 'rgba(184,135,10,0.25)' : 'var(--ink-line)'}`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      color: subActive ? 'var(--gold)' : 'var(--ink-3)',
                                      flexShrink: 0,
                                    }}>
                                      <sub.icon size={11} />
                                    </div>
                                    <div>
                                      <p style={{
                                        fontSize: 12.5, fontWeight: subActive ? 700 : 500,
                                        color: subActive ? 'var(--gold)' : 'var(--ink)',
                                        lineHeight: 1.2,
                                      }}>
                                        {sub.label}
                                      </p>
                                      <p style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 1 }}>{sub.desc}</p>
                                    </div>
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}

                {/* Divider + quick links */}
                <div style={{ height: 1, background: 'var(--ink-line)', margin: '10px 2px 6px' }} />
                <p style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--ink-4)',
                  padding: '0 10px 5px',
                }}>
                  Quick Access
                </p>
                {MOBILE_QUICK.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (NAV.length + i) * 0.04 }}
                  >
                    <Link
                      href={l.href}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 8, marginBottom: 2,
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,135,10,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: 'rgba(184,135,10,0.08)',
                        border: '1px solid rgba(184,135,10,0.20)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--gold)', flexShrink: 0,
                      }}>
                        <l.icon size={11} />
                      </div>
                      <span style={{ fontSize: 12.5, color: 'var(--ink)' }}>{l.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Drawer CTA */}
              <div style={{ padding: '10px', borderTop: '1px solid var(--ink-line)', flexShrink: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <Link
                    href="/admin/login"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '11px',
                      borderRadius: 9,
                      background: 'rgba(13,31,60,0.04)',
                      color: 'var(--navy)',
                      fontWeight: 700, fontSize: 13,
                      textDecoration: 'none',
                      border: '1px solid var(--ink-line)',
                    }}
                  >
                    <LogIn size={14} /> Admin
                  </Link>
                  <Link
                    href="/contact"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '11px',
                      borderRadius: 9,
                      background: 'var(--navy)', color: '#fff',
                      fontWeight: 700, fontSize: 13,
                      textDecoration: 'none',
                      boxShadow: '0 3px 12px var(--navy-glow)',
                      transition: 'background 0.18s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy)')}
                  >
                    <Mail size={14} /> Get In Touch
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .desk-nav        { display: flex !important; }
        .mob-btn         { display: none  !important; }
        .collaborate-btn { display: inline-flex !important; }

        @media (max-width: 960px) {
          .desk-nav        { display: none !important; }
          .mob-btn         { display: flex !important; }
          .collaborate-btn { display: none !important; }
        }

        /* Always show full name on mobile (removed the hide rule) */
        @media (max-width: 400px) {
          .logo-text p:first-child { font-size: 13px !important; }
          .logo-text p:last-child  { display: block !important; }
        }
      `}</style>
    </>
  )
}