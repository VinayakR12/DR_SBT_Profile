"use client";

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  ArrowRight,
  FlaskConical,
  BookOpen,
  Shield,
  Brain,
  Leaf,
  Microscope,
  CheckCircle2,
  Database,
  CloudOff,
} from "lucide-react";
import {
  STATIC_ABOUT_CONTENT,
  normalizeAboutContent,
  type AboutContentRaw,
} from '@/lib/aboutContent';

// Icon mapping for research areas
const iconMap: Record<string, any> = {
  Brain: Brain,
  Leaf: Leaf,
  Microscope: Microscope,
  Shield: Shield,
  BookOpen: BookOpen,
  FlaskConical: FlaskConical,
};

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as any },
});
const ST = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const SI = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52 } },
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutContentRaw>(() => normalizeAboutContent(STATIC_ABOUT_CONTENT));
  const [contentSource, setContentSource] = useState<'loading' | 'supabase' | 'backup'>('loading');

  useEffect(() => {
    let active = true;

    const loadAboutContent = async () => {
      try {
        const response = await fetch('/api/about-content', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`about-content API returned ${response.status}`);
        }

        const payload = await response.json() as {
          source?: 'supabase' | 'backup'
          content?: Partial<AboutContentRaw>
          message?: string
        };

        if (!active) {
          return;
        }

        setContent(normalizeAboutContent(payload.content || STATIC_ABOUT_CONTENT));
        setContentSource(payload.source || 'backup');

        if (payload.source !== 'supabase' && payload.message) {
          console.error('[about-page] Falling back to static backup:', payload.message);
        }
      } catch (error) {
        if (!active) {
          return;
        }

        console.error('[about-page] Failed loading DB content. Rendering static fallback.', error);
        setContent(normalizeAboutContent(STATIC_ABOUT_CONTENT));
        setContentSource('backup');
      }
    };

    loadAboutContent();

    return () => {
      active = false;
    };
  }, []);

  const HERO_CONTENT = content.heroContent;
  const EDUCATION = content.education;
  const RESEARCH_AREAS = content.researchAreas;
  const MILESTONES = content.milestones;
  const TYPE_COLORS = content.typeColors;
  const HERO_TAGS = content.heroTags;
  const AT_A_GLANCE = content.atAGlance;
  const BIO_PARAGRAPHS = content.bioParagraphs;

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          paddingTop: "var(--nav-h)",
          background: "var(--navy)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 70% at 85% 50%, rgba(184,135,10,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "var(--nav-h)",
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, var(--gold-3), var(--gold), var(--gold-3), transparent)",
          }}
        />

        <div
          className="W"
          style={{
            padding: "clamp(52px, 9vh, 96px) clamp(18px, 5vw, 80px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(40px, 6vw, 80px)",
              alignItems: "center",
            }}
          >
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--gold-3)",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 2,
                    background: "var(--gold-3)",
                    borderRadius: 2,
                    display: "inline-block",
                  }}
                />
                About
              </p>
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "clamp(38px, 6vw, 72px)",
                  fontWeight: 800,
                  color: "#F0F4F8",
                  lineHeight: 1.0,
                  letterSpacing: "-0.025em",
                  marginBottom: 6,
                }}
              >
                {HERO_CONTENT.firstName}
              </h1>
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "clamp(38px, 6vw, 72px)",
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: "var(--gold-3)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  marginBottom: 26,
                }}
              >
                {HERO_CONTENT.lastName}
              </h1>

              <p
                style={{
                  fontSize: "clamp(14px, 1.4vw, 16.5px)",
                  color: "rgba(226,232,240,0.72)",
                  lineHeight: 1.78,
                  maxWidth: 520,
                  marginBottom: 28,
                  fontWeight: 300,
                }}
              >
                {HERO_CONTENT.description}
              </p>

              {contentSource !== 'loading' && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: contentSource === 'supabase' ? 'rgba(26,107,72,0.16)' : 'rgba(184,135,10,0.14)',
                    color: contentSource === 'supabase' ? '#8EE0B5' : 'var(--gold-3)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    marginBottom: 18,
                    width: 'fit-content',
                  }}
                >
                  {contentSource === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
                  <span>{contentSource === 'supabase' ? 'Live from Supabase' : 'Backup content active'}</span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 30,
                }}
              >
                {HERO_TAGS.map((t) => (
                  <span
                    key={t.label}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      padding: "4px 12px",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "rgba(226,232,240,0.65)",
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <Link
                  href="/research"
                  className="btn-navy"
                  style={{ padding: "10px 22px", fontSize: 13.5 }}
                >
                  Research Work <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  width: "clamp(250px, 26vw, 350px)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -10,
                    borderRadius: 18,
                    border: "1px solid rgba(184,135,10,0.18)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />

                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1.5px solid rgba(184,135,10,0.32)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.38)",
                  }}
                >
                  {/* Gold border at top */}
                  <div
                    style={{
                      height: 4,
                      background:
                        "linear-gradient(90deg, var(--gold), var(--gold-3))",
                    }}
                  />

                  {/* Full Image Container */}
                  <div
                    style={{
                      aspectRatio: "3/4",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={HERO_CONTENT.profileImageUrl || '/Profile_pic/SBT_About.jpg'}
                      alt="Dr. Sachin Takmare"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                      }}
                    />
                  </div>

                  {/* Content Section */}
                  <div
                    style={{
                      padding: "14px 16px",
                      background: "rgba(184,135,10,0.09)",
                      borderTop: "1px solid rgba(184,135,10,0.20)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: "#F0F4F8",
                        lineHeight: 1.2,
                      }}
                    >
                      {HERO_CONTENT.firstName} {HERO_CONTENT.lastName}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--gold-3)",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginTop: 4,
                      }}
                    >
                      {HERO_CONTENT.profileTitle}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 6,
                        fontSize: 11,
                        color: "rgba(226,232,240,0.48)",
                      }}
                    >
                      <MapPin
                        size={10}
                        style={{ color: "var(--gold-3)", flexShrink: 0 }}
                      />
                      {HERO_CONTENT.location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BIOGRAPHY ── */}
      <section className="S" style={{ background: "var(--white)" }}>
        <div className="W">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(40px, 7vw, 96px)",
              alignItems: "start",
            }}
          >
            <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 16 }}>
                Background
              </p>

              <h2
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "clamp(26px, 3.5vw, 44px)",
                  fontWeight: 700,
                  color: "var(--navy)",
                  lineHeight: 1.12,
                  marginBottom: 24,
                }}
              >
                Educator, Researcher,{" "}
                <em
                  style={{
                    color: "var(--gold)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  Engineer
                </em>
              </h2>

              {BIO_PARAGRAPHS.map((para, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: 14.5,
                    color: "var(--ink-2)",
                    lineHeight: 1.88,
                    marginBottom: idx < BIO_PARAGRAPHS.length - 1 ? 16 : 0,
                    fontWeight: 300,
                    textAlign: "justify",
                  }}
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Right — key facts */}
            <motion.div {...up(0.1)}>
              <div
                style={{
                  border: "1px solid var(--ink-line)",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "var(--sh1)",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "14px 20px",
                    background: "var(--off)",
                    borderBottom: "1px solid var(--ink-line)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <GraduationCap size={15} style={{ color: "var(--gold)" }} />
                  <p
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--navy)",
                    }}
                  >
                    At a Glance
                  </p>
                </div>
                {AT_A_GLANCE.map((r, i, a) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 14,
                      padding: "11px 20px",
                      borderBottom:
                        i < a.length - 1 ? "1px solid var(--ink-line)" : "none",
                      alignItems: "flex-start",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--off)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <CheckCircle2
                      size={12}
                      style={{
                        color: "var(--gold)",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--ink-4)",
                          marginBottom: 2,
                        }}
                      >
                        {r.k}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--ink)",
                          lineHeight: 1.5,
                        }}
                      >
                        {r.v}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* ── EDUCATION ── */}
      <section className="S" style={{ background: "var(--off)" }}>
        <div className="W">
          <motion.div
            {...up()}
            style={{ marginBottom: "clamp(32px, 5vh, 48px)" }}
          >
            <p className="lbl" style={{ marginBottom: 14 }}>
              Academic Qualifications
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(26px, 3.5vw, 44px)",
                fontWeight: 700,
                color: "var(--navy)",
                lineHeight: 1.1,
              }}
            >
              Education &{" "}
              <em
                style={{
                  color: "var(--gold)",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                Degrees
              </em>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ST}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {EDUCATION.map((e, i) => (
              <motion.div
                key={i}
                variants={SI}
                style={{
                  display: "flex",
                  gap: "clamp(14px, 2.5vw, 24px)",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  padding: "clamp(16px, 2.5vw, 22px) clamp(16px, 2.5vw, 22px)",
                  borderRadius: 10,
                  background: "#fff",
                  border: "1px solid var(--ink-line)",
                  transition:
                    "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(el) => {
                  const t = el.currentTarget as HTMLElement;
                  t.style.borderColor = `${e.color}38`;
                  t.style.boxShadow = "var(--sh2)";
                  t.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(el) => {
                  const t = el.currentTarget as HTMLElement;
                  t.style.borderColor = "var(--ink-line)";
                  t.style.boxShadow = "none";
                  t.style.transform = "translateX(0)";
                }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    borderRadius: 4,
                    background: `linear-gradient(180deg, ${e.color}, var(--gold))`,
                    minHeight: 48,
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      gap: "6px 10px",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "clamp(16px, 1.6vw, 19px)",
                        fontWeight: 700,
                        color: e.color,
                      }}
                    >
                      {e.degree}
                    </span>
                    <span
                      style={{
                        fontSize: 13.5,
                        color: "var(--ink-3)",
                        fontWeight: 400,
                      }}
                    >
                      {e.field}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--ink-2)",
                      fontWeight: 500,
                      marginBottom: e.note ? 5 : 0,
                    }}
                  >
                    {e.uni}
                  </p>
                  {e.note && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--ink-4)",
                        lineHeight: 1.55,
                        fontStyle: "italic",
                      }}
                    >
                      {e.note}
                    </p>
                  )}
                </div>

                {/* Badge */}
                <div style={{ flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 100,
                      background: e.badgeGold
                        ? "var(--gold-pale)"
                        : `${e.color}10`,
                      border: `1px solid ${e.badgeGold ? "var(--gold-border)" : `${e.color}22`}`,
                      color: e.badgeGold ? "var(--gold)" : e.color,
                    }}
                  >
                    {e.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <hr className="rule" />

      {/* ── RESEARCH AREAS ── */}
      <section className="S" style={{ background: "var(--white)" }}>
        <div className="W">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(40px, 7vw, 80px)",
              alignItems: "start",
            }}
          >
            <motion.div {...up(0)}>
              <p className="lbl" style={{ marginBottom: 14 }}>
                Research Interests
              </p>
              <h2
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "clamp(26px, 3.5vw, 44px)",
                  fontWeight: 700,
                  color: "var(--navy)",
                  lineHeight: 1.1,
                  marginBottom: 20,
                }}
              >
                Areas of{" "}
                <em
                  style={{
                    color: "var(--gold)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  Specialisation
                </em>
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--ink-3)",
                  lineHeight: 1.82,
                  marginBottom: 16,
                  fontWeight: 300,
                }}
              >
                Research work spans six interconnected areas, each with
                published output: peer-reviewed journals, IEEE conference
                papers, and filed intellectual property. The unifying interest
                is the application of deep learning and computer vision to
                real-world classification and diagnostic problems across
                agriculture, healthcare, security, and education.
              </p>
              <Link
                href="/research"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13.5,
                  color: "var(--navy)",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "2px solid var(--gold)",
                  paddingBottom: 2,
                }}
              >
                View all publications <ArrowRight size={13} />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={ST}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {RESEARCH_AREAS.map((r) => {
                  const IconComponent = iconMap[r.I];
                  return (
                    <motion.div
                      key={r.label}
                      variants={SI}
                      style={{
                        display: "flex",
                        gap: 11,
                        alignItems: "center",
                        padding: "13px 14px",
                        borderRadius: 9,
                        background: "#fff",
                        border: `1px solid ${r.color}18`,
                        transition:
                          "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(-2px)";
                        el.style.boxShadow = "var(--sh1)";
                        el.style.borderColor = `${r.color}38`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(0)";
                        el.style.boxShadow = "none";
                        el.style.borderColor = `${r.color}18`;
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 7,
                          background: r.bg,
                          border: `1px solid ${r.color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={14} style={{ color: r.color }} />
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--navy)",
                          lineHeight: 1.3,
                        }}
                      >
                        {r.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* ── CAREER MILESTONES ── */}
      <section className="S" style={{ background: "var(--off)" }}>
  <div className="W">
    <motion.div
      {...up()}
      style={{ marginBottom: "clamp(32px, 5vh, 48px)" }}
    >
      <p className="lbl" style={{ marginBottom: 14 }}>
        Career Timeline
      </p>
      <h2
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "clamp(26px, 3.5vw, 44px)",
          fontWeight: 700,
          color: "var(--navy)",
          lineHeight: 1.1,
        }}
      >
        Key Milestones{" "}
        <em
          style={{
            color: "var(--gold)",
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
         {Math.min(...MILESTONES.map(m => parseInt(m.year)))} -  {Math.max(...MILESTONES.map(m => parseInt(m.year)))} 
        </em>
      </h2>
    </motion.div>

    <div
      style={{
        position: "relative",
        paddingLeft: "clamp(28px, 4vw, 44px)",
      }}
    >
      {/* Rail */}
      <div
        style={{
          position: "absolute",
          left: "clamp(8px, 2vw, 14px)",
          top: 6,
          bottom: 6,
          width: 2,
          borderRadius: 2,
          background:
            "linear-gradient(180deg, var(--gold) 0%, var(--navy) 65%, rgba(13,31,60,0.10) 100%)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[...MILESTONES]
          .sort((a, b) => parseInt(b.year) - parseInt(a.year))
          .map((m, i) => {
            const c = TYPE_COLORS[m.type];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.52 }}
                style={{
                  position: "relative",
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: `calc(-1 * clamp(28px, 4vw, 44px) + clamp(8px, 2vw, 14px) - 5px)`,
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: c,
                    boxShadow: `0 0 0 3px var(--off), 0 0 0 4px ${c}35`,
                    zIndex: 1,
                  }}
                />

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    padding: "11px 16px",
                    borderRadius: 8,
                    background: "#fff",
                    border: "1px solid var(--ink-line)",
                    transition:
                      "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${c}35`;
                    el.style.boxShadow = "var(--sh1)";
                    el.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--ink-line)";
                    el.style.boxShadow = "none";
                    el.style.transform = "translateX(0)";
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: 4,
                      background: `${c}10`,
                      border: `1px solid ${c}22`,
                      color: c,
                      flexShrink: 0,
                    }}
                  >
                    {m.year}
                  </span>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--ink-2)",
                      lineHeight: 1.45,
                    }}
                  >
                    {m.event}
                  </p>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  </div>
</section>

      {/* ── CTA ── */}
      <section
        style={{
          background: "var(--white)",
          padding: "clamp(60px, 10vh, 100px) 0",
          borderTop: "1px solid var(--ink-line)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -10,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "Playfair Display, serif",
            fontWeight: 800,
            fontSize: "clamp(80px, 16vw, 200px)",
            color: "var(--navy-pale)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.04em",
          }}
        >
          18
        </div>

        <div
          className="W"
          style={{ position: "relative", textAlign: "center" }}
        >
          <motion.div {...up()}>
            <p
              className="lbl"
              style={{ justifyContent: "center", marginBottom: 16 }}
            >
              Connect
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(26px, 4vw, 52px)",
                fontWeight: 700,
                color: "var(--navy)",
                lineHeight: 1.1,
                maxWidth: 640,
                margin: "0 auto 16px",
              }}
            >
              Open to Research,
              <br />
              <span style={{ whiteSpace: "nowrap" }}>
                <em
                  style={{
                    color: "var(--gold)",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  Collaboration
                </em>{" "}
                &{" "}
                <em
                  style={{
                    color: "var(--gold)",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  Mentorship
                </em>
              </span>
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 1.3vw, 16px)",
                color: "var(--ink-3)",
                lineHeight: 1.8,
                maxWidth: 500,
                margin: "0 auto 36px",
                fontWeight: 300,
              }}
            >
              Available for research collaborations, academic consultancy,
              conference presentations, and M.E. / Ph.D. supervision in Computer
              Engineering.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <Link
                href="/contact"
                className="btn-navy"
                style={{ padding: "11px 26px", fontSize: 13.5 }}
              >
                Get In Touch <ArrowRight size={14} />
              </Link>
              <Link
                href="/research"
                className="btn-out"
                style={{ padding: "11px 26px", fontSize: 13.5 }}
              >
                Research
              </Link>
              {/* <Link
                href="/achievements"
                className="btn-out"
                style={{ padding: "11px 26px", fontSize: 13.5 }}
              >
                Achievements
              </Link> */}
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 480px) { .W { padding-left: 16px !important; padding-right: 16px !important; } }
      `}</style>
    </>
  );
}
