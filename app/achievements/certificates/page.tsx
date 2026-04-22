"use client";

// app/achievements/certificates/page.tsx
// Certificates — responsive compact list + modal viewer, backed by Supabase content.

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  CloudOff,
  Download,
  ExternalLink,
  Database,
  FileText,
  Filter,
  ImageIcon,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  normalizeCertificatesContent,
  STATIC_CERTIFICATES_CONTENT,
  type CertificateItemRaw,
  type CertificatesContentRaw,
} from "@/lib/certificatesContent";
import { CAT_COLOR } from "@/app/Database/Certificatedata";

type ApiState = {
  ok?: boolean;
  source?: "supabase" | "backup";
  content?: Partial<CertificatesContentRaw>;
  message?: string;
};

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.38,
    delay: i * 0.04,
    ease: [0.22, 1, 0.36, 1] as any,
  },
});

export default function CertificatesPage() {
  const [content, setContent] = useState(() => normalizeCertificatesContent(STATIC_CERTIFICATES_CONTENT));
  const [contentSource, setContentSource] = useState<'loading' | 'supabase' | 'backup'>('loading')
  const [contentNotice, setContentNotice] = useState<string | null>(null)
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CertificateItemRaw | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/achievements-certificates-content", { cache: "no-store" });
        const payload = (await response.json()) as ApiState;

        if (!active) {
          return;
        }

        setContent(normalizeCertificatesContent(payload.content || STATIC_CERTIFICATES_CONTENT));
        setContentSource(payload.source || 'backup');

        if (payload.source !== 'supabase') {
          setContentNotice(payload.message || 'Supabase is unavailable. Rendering the backup content file instead.');
          if (payload.message) {
            console.error('[certificates-page] Falling back to static backup:', payload.message);
          }
        } else {
          setContentNotice(null);
        }
      } catch {
        if (!active) {
          return;
        }

        setContent(normalizeCertificatesContent(STATIC_CERTIFICATES_CONTENT));
        setContentSource('backup');
        setContentNotice('Supabase is unavailable. Rendering the backup content file instead.');
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const certificates = useMemo(() => [...content.certificates].sort((a, b) => b.year - a.year), [content]);
  const allCats = useMemo(() => ["All", ...Array.from(new Set(certificates.map((cert) => cert.category)))], [certificates]);

  const filtered = useMemo(() => {
    return certificates.filter((cert) => {
      const matchCat = filter === "All" || cert.category === filter;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        cert.title.toLowerCase().includes(q) ||
        cert.issuer.toLowerCase().includes(q) ||
        cert.description?.toLowerCase().includes(q) ||
        cert.link?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [certificates, filter, query]);

  const idx = selected ? filtered.findIndex((cert) => cert.id === selected.id) : -1;
  const open = (cert: CertificateItemRaw) => {
    setImgLoaded(false);
    setSelected(cert);
  };
  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(() => {
    if (idx > 0) {
      setImgLoaded(false);
      setSelected(filtered[idx - 1]);
    }
  }, [idx, filtered]);
  const next = useCallback(() => {
    if (idx < filtered.length - 1) {
      setImgLoaded(false);
      setSelected(filtered[idx + 1]);
    }
  }, [idx, filtered]);

  useEffect(() => {
    if (!selected) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [selected, prev, next, close]);

  useEffect(() => {
    document.body.style.overflow = selected || filterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected, filterOpen]);

  const cc = (cat: string) =>
    CAT_COLOR[cat as keyof typeof CAT_COLOR] ?? {
      bg: "#F1F5F9",
      border: "#CBD5E1",
      text: "#475569",
    };

  const categoryCounts = useMemo(
    () =>
      allCats.reduce(
        (acc, cat) => {
          acc[cat] = cat === "All" ? certificates.length : certificates.filter((cert) => cert.category === cat).length;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [allCats, certificates],
  );

  const heroStats = useMemo(() => {
    const uniqueCategories = new Set(certificates.map((cert) => cert.category)).size;
    const since2020 = certificates.filter((cert) => cert.year >= 2020).length;

    return [
      { n: certificates.length, l: "Certificates" },
      { n: uniqueCategories, l: "Categories" },
      { n: since2020, l: "Since 2020" },
    ];
  }, [certificates]);

  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden />
        <div className="hero-glow" aria-hidden />
        <div className="W hero-body">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hero-content"
          >
            <span className="eyebrow">
              <Award size={12} />
              {content.hero.eyebrow}
            </span>
            <h1>
              {content.hero.title}
              <br />
              <em>&amp; Achievements</em>
            </h1>
            <p className="hero-sub">{content.hero.subtitle}</p>
          
            <div className="hero-stats">
              {heroStats.map((stat, index) => (
                <div key={index} className="stat">
                  <strong>{stat.n}</strong>
                  <span>{stat.l}</span>
                </div>
              ))}
            </div>
            <br/>
              {contentSource !== 'loading' && (
              <div className={`content-status content-status-${contentSource}`} role="status" aria-live="polite">
                {contentSource === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
                <span>{contentSource === 'supabase' ? 'Live' : 'Backup'}</span>
              </div>
            )}
            {contentNotice && contentSource === 'backup' && (
              <p className="content-notice" role="status" aria-live="polite">
                {contentNotice}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="toolbar">
        <div className="W toolbar-body">
          <div className="tb-desktop">
            <Filter size={11} className="filter-icon" aria-hidden />
            <div className="cats-scroll">
              {allCats.map((cat) => (
                <button key={cat} onClick={() => setFilter(cat)} className={`cat-pill${filter === cat ? " active" : ""}`}>
                  {cat}
                  <span className="pill-count">{categoryCounts[cat]}</span>
                </button>
              ))}
            </div>
            <div className="search-wrap">
              <Search size={13} className="search-icon" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="search-input"
                aria-label="Search certificates"
              />
              {query && (
                <button onClick={() => setQuery("")} className="search-clear" aria-label="Clear">
                  <X size={11} />
                </button>
              )}
            </div>
            <span className="count-badge">{filtered.length}</span>
          </div>

          <div className="tb-mobile">
            <div className="search-wrap search-full">
              <Search size={13} className="search-icon" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search certificates…"
                className="search-input"
                aria-label="Search certificates"
              />
              {query && (
                <button onClick={() => setQuery("")} className="search-clear" aria-label="Clear">
                  <X size={11} />
                </button>
              )}
            </div>
            <button
              className={`filter-toggle-btn${filterOpen || filter !== "All" ? " active" : ""}`}
              onClick={() => setFilterOpen((v) => !v)}
              aria-label="Filter"
            >
              <SlidersHorizontal size={15} />
              {filter !== "All" && <span className="filter-dot" />}
            </button>
            <span className="count-badge">{filtered.length}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div className="drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFilterOpen(false)} />
            <motion.div className="drawer" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="drawer-handle" />
              <div className="drawer-header">
                <p className="drawer-title">Filter by Category</p>
                <button className="drawer-close" onClick={() => setFilterOpen(false)} aria-label="Close">
                  <X size={14} />
                </button>
              </div>
              <div className="drawer-list">
                {allCats.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilter(cat);
                      setFilterOpen(false);
                    }}
                    className={`drawer-row${filter === cat ? " active" : ""}`}
                  >
                    <span>{cat}</span>
                    <span className="drawer-count">{categoryCounts[cat]}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="list-section">
        <div className="W">
          <AnimatePresence mode="wait">
            <motion.div key={filter + query} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {filtered.length === 0 ? (
                <div className="empty">
                  <Award size={40} className="empty-icon" />
                  <p className="empty-title">No certificates found</p>
                  <p className="empty-sub">Try adjusting your search or filter.</p>
                  <button
                    className="empty-reset"
                    onClick={() => {
                      setFilter("All");
                      setQuery("");
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="cert-grid">
                  {filtered.map((cert, i) => {
                    const c = cc(cert.category);
                    return (
                      <motion.div key={cert.id} {...fadeUp(i % 10)}>
                        <button className="cert-row" onClick={() => open(cert)} aria-label={`Open: ${cert.title}`}>
                          <div className="row-icon" aria-hidden>
                            {cert.type === "pdf" ? <FileText size={16} className="icon-pdf" /> : <ImageIcon size={16} className="icon-img" />}
                          </div>
                          <div className="row-body">
                            <div className="row-top">
                              <h3 className="row-title">{cert.title}</h3>
                              <span className="row-year">{cert.year}</span>
                            </div>
                            <div className="row-meta">
                              <span
                                className="cat-badge"
                                style={{
                                  background: c.bg,
                                  border: `1px solid ${c.border}`,
                                  color: c.text,
                                }}
                              >
                                {cert.category}
                              </span>
                              <span className="row-issuer" title={cert.issuer}>
                                {cert.issuer}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="row-arrow" aria-hidden />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.95, y: isMobile ? 80 : 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: isMobile ? 80 : 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <div className="modal-head-info">
                  <span
                    className="cat-badge"
                    style={{
                      background: cc(selected.category).bg,
                      border: `1px solid ${cc(selected.category).border}`,
                      color: cc(selected.category).text,
                    }}
                  >
                    {selected.category}
                  </span>
                  <p className="modal-title">{selected.title}</p>
                </div>
                <div className="modal-head-actions">
                  <a
                    href={selected.file}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="mab"
                    title="Download"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={13} />
                  </a>
                  <a
                    href={selected.file}
                    target="_blank"
                    rel="noreferrer"
                    className="mab"
                    title="Open file"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileText size={12} />
                  </a>
                  {selected.link && (
                    <a
                      href={selected.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mab"
                      title="Open external link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button className="mab mab-close" onClick={close} title="Close (Esc)">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="modal-viewer">
                {selected.type === "image" ? (
                  <>
                    {!imgLoaded && (
                      <div className="viewer-loader">
                        <div className="spinner" />
                        <p>Loading…</p>
                      </div>
                    )}
                    <img
                      src={selected.file}
                      alt={selected.title}
                      onLoad={() => setImgLoaded(true)}
                      className="viewer-img"
                      style={{ opacity: imgLoaded ? 1 : 0 }}
                    />
                  </>
                ) : (
                  <iframe src={`${selected.file}#toolbar=1&view=FitH`} className="viewer-pdf" title={selected.title} />
                )}
              </div>

              <div className="modal-info">
                <div className="info-grid">
                  <div className="info-cell">
                    <span className="info-lbl">Issuer</span>
                    <span className="info-val">{selected.issuer}</span>
                  </div>
                  <div className="info-cell">
                    <span className="info-lbl">Date</span>
                    <span className="info-val">{selected.date}</span>
                  </div>
                  {selected.credentialId && (
                    <div className="info-cell">
                      <span className="info-lbl">Credential ID</span>
                      <span className="info-val mono">{selected.credentialId}</span>
                    </div>
                  )}
                  {selected.link && (
                    <div className="info-cell">
                      <span className="info-lbl">Link</span>
                      <a className="info-link" href={selected.link} target="_blank" rel="noreferrer">
                        Open external record
                      </a>
                    </div>
                  )}
                </div>
                {selected.description && <p className="info-desc">{selected.description}</p>}
                {selected.tags && selected.tags.length > 0 && (
                  <div className="info-tags">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-nav">
                <button className="nav-btn" onClick={prev} disabled={idx <= 0} aria-label="Previous">
                  <ChevronLeft size={15} />
                  <span className="nav-lbl">Prev</span>
                </button>
                <span className="nav-count">
                  {idx + 1} / {filtered.length}
                </span>
                <button className="nav-btn" onClick={next} disabled={idx >= filtered.length - 1} aria-label="Next">
                  <span className="nav-lbl">Next</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        :root {
          --navy:   #0D1F3C;
          --gold:   #B8870A;
          --gold3:  #D4A920;
          --white:  #FFFFFF;
          --off:    #F7F9FB;
          --off2:   #EDF0F5;
          --ink:    #1A2232;
          --ink3:   #4A5568;
          --ink4:   #8896AA;
          --line:   #E2E8F0;
          --sh1:    0 1px 3px rgba(13,31,60,0.07),0 1px 2px rgba(13,31,60,0.04);
          --sh2:    0 4px 14px rgba(13,31,60,0.10);
          --nav-h:  64px;
          --r:      10px;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; color: var(--ink); -webkit-tap-highlight-color: transparent; }

        .W {
          width: 100%; max-width: 1120px; margin: 0 auto;
          padding-left: clamp(14px, 4vw, 60px);
          padding-right: clamp(14px, 4vw, 60px);
        }

        .hero { padding-top: var(--nav-h); background: var(--navy); position: relative; overflow: hidden; }
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 65% 60% at 50% 40%, rgba(184,135,10,0.14) 0%, transparent 68%);
        }
        .hero-body {
          position: relative; z-index: 1;
          padding-top: clamp(44px, 8vh, 92px);
          padding-bottom: clamp(44px, 8vh, 92px);
        }
        .hero-content { text-align: center; max-width: 620px; margin: 0 auto; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 100px;
          border: 1px solid rgba(184,135,10,0.32);
          background: rgba(184,135,10,0.10);
          color: var(--gold3); font-size: 10px; font-weight: 700;
          letter-spacing: 0.13em; text-transform: uppercase; margin-bottom: 18px;
        }
        .hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 5vw, 56px);
          font-weight: 800; color: #F0F4F8;
          line-height: 1.09; letter-spacing: -0.024em; margin-bottom: 14px;
        }
        .hero h1 em { color: var(--gold3); font-style: italic; font-weight: 600; }
        .hero-sub {
          font-size: clamp(13px, 1.5vw, 15.5px);
          color: rgba(226,232,240,0.6); line-height: 1.78; font-weight: 300;
          max-width: 500px; margin: 0 auto 28px;
        }
        .content-status {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 10px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          font-size: 11px; font-weight: 700; margin: 0 auto 16px;
        }
        .content-status-supabase { background: rgba(26,107,72,0.18); color: #8EE0B5; }
        .content-status-backup { background: rgba(184,135,10,0.2); color: #F7D080; }
        .content-notice {
          max-width: 760px; margin: 0 auto 18px;
          color: rgba(226,232,240,0.66); font-size: 12.5px; line-height: 1.65;
        }
        .hero-stats {
          display: flex; justify-content: center;
          border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;
          overflow: hidden; background: rgba(255,255,255,0.04);
          max-width: 380px; margin: 0 auto;
        }
        .stat { flex: 1; padding: clamp(11px,2.5vh,20px) 8px; text-align: center; border-right: 1px solid rgba(255,255,255,0.07); }
        .stat:last-child { border-right: none; }
        .stat strong {
          display: block; font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 3vw, 34px); font-weight: 700; color: var(--gold3); line-height: 1; margin-bottom: 4px;
        }
        .stat span { font-size: clamp(8.5px, 1vw, 10.5px); color: rgba(226,232,240,0.38); letter-spacing: 0.08em; text-transform: uppercase; display: block; }

        .toolbar {
          background: var(--white); border-bottom: 1px solid var(--line);
          position: sticky; top: var(--nav-h); z-index: 200;
          box-shadow: 0 2px 10px rgba(13,31,60,0.05);
        }
        .toolbar-body { padding-top: 9px; padding-bottom: 9px; }
        .tb-desktop { display: none; align-items: center; gap: 10px; }
        .tb-mobile { display: flex; align-items: center; gap: 8px; }
        @media (min-width: 640px) {
          .tb-desktop { display: flex; }
          .tb-mobile  { display: none; }
        }

        .filter-icon { color: var(--ink4); flex-shrink: 0; }
        .cats-scroll {
          display: flex; gap: 5px; flex: 1; min-width: 0;
          overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;
          padding-bottom: 1px;
        }
        .cats-scroll::-webkit-scrollbar { display: none; }
        .cat-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: 100px; white-space: nowrap; flex-shrink: 0;
          font-size: 11.5px; font-weight: 600; cursor: pointer;
          border: 1.5px solid var(--line); background: transparent; color: var(--ink3);
          transition: all 0.14s; font-family: inherit;
        }
        .cat-pill:hover { border-color: var(--navy); color: var(--navy); }
        .cat-pill.active { border-color: var(--navy); background: var(--navy); color: #fff; }
        .pill-count {
          font-size: 9px; font-weight: 700; border-radius: 100px;
          padding: 1px 5px; min-width: 18px; text-align: center;
          background: var(--off2); color: var(--ink4);
        }
        .cat-pill.active .pill-count { background: rgba(255,255,255,0.2); color: #fff; }

        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-full { flex: 1; }
        .search-icon { position: absolute; left: 10px; color: var(--ink4); pointer-events: none; }
        .search-input {
          padding: 7px 32px 7px 32px; border: 1.5px solid var(--line); border-radius: 8px;
          font-size: 13px; font-family: inherit; color: var(--ink); background: var(--off);
          outline: none; width: 170px; transition: border-color 0.16s, width 0.22s;
        }
        .search-input:focus { border-color: var(--navy); background: var(--white); width: 210px; }
        .search-full .search-input { width: 100% !important; }
        .search-clear {
          position: absolute; right: 9px; background: none; border: none;
          cursor: pointer; color: var(--ink4); display: flex; align-items: center;
          padding: 2px; border-radius: 4px;
        }
        .search-clear:hover { color: var(--ink); background: var(--line); }

        .count-badge {
          font-size: 11px; font-weight: 700; flex-shrink: 0; white-space: nowrap;
          background: var(--off2); color: var(--ink4); border: 1px solid var(--line);
          padding: 3px 9px; border-radius: 100px;
        }

        .filter-toggle-btn {
          position: relative; width: 38px; height: 38px; border-radius: 9px;
          border: 1.5px solid var(--line); background: var(--off); color: var(--ink3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: all 0.14s; font-family: inherit;
        }
        .filter-toggle-btn.active { border-color: var(--navy); background: var(--navy); color: #fff; }
        .filter-dot {
          position: absolute; top: 5px; right: 5px; width: 7px; height: 7px;
          border-radius: 50%; background: var(--gold3); border: 1.5px solid var(--white);
        }

        .drawer-overlay {
          position: fixed; inset: 0; z-index: 290;
          background: rgba(5,10,22,0.5); backdrop-filter: blur(4px);
        }
        .drawer {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 300;
          background: var(--white); border-radius: 18px 18px 0 0;
          padding-bottom: env(safe-area-inset-bottom, 16px);
          max-height: 82vh; overflow-y: auto;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
        }
        .drawer-handle { width: 36px; height: 4px; border-radius: 2px; background: var(--line); margin: 12px auto 0; }
        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 18px 10px; border-bottom: 1px solid var(--line);
        }
        .drawer-title { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink4); }
        .drawer-close {
          width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--line);
          background: var(--off); color: var(--ink3); display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-family: inherit;
        }
        .drawer-list { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 2px; }
        .drawer-row {
          display: flex; justify-content: space-between; align-items: center;
          width: 100%; padding: 12px 14px; border-radius: 9px;
          border: 1.5px solid transparent; background: transparent;
          cursor: pointer; text-align: left; font-size: 15px; font-weight: 500;
          color: var(--ink3); font-family: inherit; transition: all 0.13s;
          min-height: 48px;
        }
        .drawer-row:hover { background: var(--off); }
        .drawer-row.active { background: rgba(13,31,60,0.06); border-color: rgba(13,31,60,0.14); color: var(--navy); font-weight: 700; }
        .drawer-count {
          font-size: 11px; font-weight: 700; border-radius: 100px;
          padding: 2px 8px; background: var(--off2); color: var(--ink4);
        }
        .drawer-row.active .drawer-count { background: var(--navy); color: #fff; }

        .list-section {
          background: var(--off);
          padding: clamp(20px, 4vh, 44px) 0 clamp(40px, 7vh, 72px);
          min-height: 50vh;
        }
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(7px, 1vw, 11px);
        }
        @media (max-width: 639px) {
          .cert-grid { grid-template-columns: 1fr; gap: 7px; }
        }

        .cert-row {
          display: flex; align-items: center; gap: 12px;
          width: 100%; padding: 12px 13px;
          background: var(--white); border: 1px solid var(--line);
          border-radius: var(--r); cursor: pointer; text-align: left;
          transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;
          box-shadow: var(--sh1); font-family: inherit;
          min-height: 62px;
        }
        .cert-row:hover { box-shadow: var(--sh2); border-color: rgba(13,31,60,0.22); transform: translateY(-1px); }
        .cert-row:active { transform: scale(0.993); box-shadow: var(--sh1); }
        .cert-row:hover .row-arrow { color: var(--navy); opacity: 1; }

        .row-icon {
          width: 36px; height: 36px; flex-shrink: 0; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: var(--off2); border: 1px solid var(--line);
        }
        .icon-pdf { color: #C0392B; }
        .icon-img { color: #2563EB; }

        .row-body { flex: 1; min-width: 0; }
        .row-top { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 5px; }
        .row-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(11.5px, 1.1vw, 14px);
          font-weight: 600; color: var(--navy); line-height: 1.32;
          display: -webkit-box; -webkit-box-orient: vertical;
          overflow: hidden; -webkit-line-clamp: 2; flex: 1; min-width: 0;
        }
        @media (min-width: 640px) {
          .row-title { -webkit-line-clamp: 1; }
        }
        .row-year { font-size: 10.5px; font-weight: 700; color: var(--gold); flex-shrink: 0; font-variant-numeric: tabular-nums; }
        .row-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .cat-badge {
          display: inline-block; padding: 2px 7px; border-radius: 4px;
          font-size: 8.5px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; flex-shrink: 0; line-height: 1.7;
        }
        .row-issuer {
          font-size: 11px; color: var(--ink3);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          max-width: min(150px, 32vw);
        }
        .row-arrow { flex-shrink: 0; color: var(--ink4); opacity: 0.45; transition: color 0.16s, opacity 0.16s; }

        .empty { text-align: center; padding: 72px 0; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .empty-icon { color: var(--line); }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--ink); }
        .empty-sub { font-size: 14px; color: var(--ink4); }
        .empty-reset {
          margin-top: 6px; padding: 9px 20px; border-radius: 8px;
          border: 1.5px solid var(--navy); background: transparent; color: var(--navy);
          font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.14s;
        }
        .empty-reset:hover { background: var(--navy); color: #fff; }

        .modal-backdrop {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(5,10,22,0.88);
          backdrop-filter: blur(10px) saturate(0.75);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(8px, 3vw, 28px);
        }
        @media (max-width: 639px) {
          .modal-backdrop { align-items: flex-end; padding: 0; }
        }
        .modal {
          background: var(--white); border-radius: 16px; overflow: hidden;
          width: 100%; max-width: 880px; max-height: 92vh;
          display: flex; flex-direction: column;
          box-shadow: 0 40px 100px rgba(0,0,0,0.55);
        }
        @media (max-width: 639px) {
          .modal { border-radius: 18px 18px 0 0; max-height: 96vh; }
        }

        .modal-head {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 13px 15px; background: var(--navy);
          border-bottom: 1px solid rgba(255,255,255,0.07); flex-shrink: 0;
        }
        .modal-head-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(12.5px, 1.5vw, 15.5px);
          font-weight: 600; color: #F0F4F8; line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .modal-head-actions { display: flex; gap: 6px; flex-shrink: 0; padding-top: 2px; flex-wrap: wrap; }
        .mab {
          width: 32px; height: 32px; border-radius: 7px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.13); background: rgba(255,255,255,0.07);
          color: #B0BBCC; cursor: pointer; text-decoration: none;
          transition: background 0.14s, color 0.14s;
        }
        .mab:hover { background: rgba(255,255,255,0.16); color: #fff; }
        .mab-close:hover { background: rgba(200,50,50,0.22); border-color: rgba(220,70,70,0.4); color: #fff; }

        .modal-viewer {
          flex: 0 0 auto;
          height: clamp(220px, 44vh, 480px);
          background: #06101C;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        @media (max-width: 639px) {
          .modal-viewer { height: clamp(200px, 38vh, 340px); }
        }
        @media (max-width: 380px) {
          .modal-viewer { height: 220px; }
        }
        .viewer-loader { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .spinner {
          width: 26px; height: 26px; border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.07); border-top-color: var(--gold3);
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .viewer-loader p { font-size: 11.5px; color: rgba(255,255,255,0.28); }
        .viewer-img {
          max-width: 100%; max-height: 100%; object-fit: contain;
          padding: clamp(10px, 2vw, 22px); transition: opacity 0.28s; display: block;
        }
        .viewer-pdf { width: 100%; height: 100%; border: none; display: block; }

        .modal-info {
          padding: 12px 15px; background: var(--off);
          border-top: 1px solid var(--line); flex-shrink: 0;
          overflow-y: auto; max-height: 150px;
        }
        @media (max-width: 639px) { .modal-info { max-height: 130px; } }
        .info-grid { display: flex; flex-wrap: wrap; gap: 12px 20px; margin-bottom: 8px; }
        .info-cell { display: flex; flex-direction: column; gap: 1px; }
        .info-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.11em; text-transform: uppercase; color: var(--ink4); }
        .info-val { font-size: clamp(11.5px, 1.2vw, 13px); font-weight: 600; color: var(--navy); }
        .info-val.mono { font-family: 'DM Mono', ui-monospace, monospace; font-size: 11.5px; }
        .info-link {
          font-size: 11.5px;
          color: var(--gold);
          font-weight: 700;
          text-decoration: none;
        }
        .info-link:hover { text-decoration: underline; }
        .info-desc { font-size: 12.5px; color: var(--ink3); line-height: 1.65; }
        .info-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--line); }
        .tag {
          padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;
          background: rgba(13,31,60,0.06); border: 1px solid rgba(13,31,60,0.12); color: var(--ink3);
        }

        .modal-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 15px; background: var(--white);
          border-top: 1px solid var(--line); flex-shrink: 0;
          padding-bottom: max(10px, env(safe-area-inset-bottom, 10px));
        }
        .nav-btn {
          display: flex; align-items: center; gap: 5px; justify-content: center;
          padding: 8px 14px; border-radius: 8px;
          border: 1.5px solid var(--line); background: var(--off); color: var(--navy);
          font-size: clamp(12px, 1.2vw, 13px); font-weight: 600; cursor: pointer;
          transition: all 0.14s; font-family: inherit; min-width: 72px;
          min-height: 40px;
        }
        .nav-btn:hover:not(:disabled) { border-color: var(--navy); background: var(--navy); color: #fff; }
        .nav-btn:disabled { opacity: 0.32; cursor: not-allowed; }
        @media (max-width: 380px) {
          .nav-btn { padding: 8px 10px; min-width: 54px; }
          .nav-lbl { display: none; }
        }
        .nav-count { font-size: 12px; color: var(--ink4); font-variant-numeric: tabular-nums; }

        .cert-row:focus-visible, .cat-pill:focus-visible,
        .nav-btn:focus-visible, .mab:focus-visible,
        .drawer-row:focus-visible, .filter-toggle-btn:focus-visible {
          outline: 2px solid var(--gold3); outline-offset: 2px;
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .drawer { padding-bottom: env(safe-area-inset-bottom, 16px); }
        }
      `}</style>
    </>
  );
}