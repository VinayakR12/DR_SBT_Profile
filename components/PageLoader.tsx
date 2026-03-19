'use client'

// components/PageLoader.tsx
// Elegant full-screen loader for page transitions.
// Usage: Add <PageLoader /> inside your layout, above Navbar.
// It auto-hides once the page has loaded.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hide after fonts + first paint settle
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #0D1F3C 0%, #1A3560 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(13,31,60,0.18)',
              }}
            >
              <span style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 26,
                fontWeight: 700,
                color: '#D4A820',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}>
                ST
              </span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 18,
                fontWeight: 600,
                color: '#0D1F3C',
                letterSpacing: '-0.01em',
                marginBottom: 3,
              }}>
                Dr. Sachin Takmare
              </p>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#B8870A',
              }}>
                Ph.D · AI & ML · Professor
              </p>
            </motion.div>

            {/* Animated progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              style={{
                width: 160,
                height: 2,
                background: 'rgba(13,31,60,0.08)',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 0.75,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 0.1,
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, #B8870A, #D4A820, transparent)',
                  borderRadius: 2,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline font preload hint for the loader itself */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:opsz,wght@9..40,700&display=swap');
      `}</style>
    </>
  )
}