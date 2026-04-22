"use client";

import { useState, useEffect, type CSSProperties, type ComponentType } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Award, BookOpen, Brain, CheckCircle2, CloudOff, Code2, Cpu, Database,
  ExternalLink, FileText, GraduationCap, Leaf, Mail, MapPin, Microscope, Quote, School,
  Shield, Sparkles, Star, Users,
} from "lucide-react";

import {
  hydrateHomeContent,
  STATIC_HOME_CONTENT,
  type HomeIconKey,
} from "@/lib/homeContent";

// ── Animation presets ─────────────────────────────────────────────────────────
const E = [0.22, 1, 0.36, 1] as [number,number,number,number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-36px" },
  transition: { duration: 0.72, delay, ease: E },
});
const ST  = { hidden:{}, visible:{ transition:{ staggerChildren: 0.08 } } };
const SI  = { hidden:{ opacity:0, y:22 }, visible:{ opacity:1, y:0, transition:{ duration:0.6, ease:E } } };

// ── IP icon helper ────────────────────────────────────────────────────────────
const IP_ICON_MAP: Record<HomeIconKey, ComponentType<{ size?: number; style?: CSSProperties }>> = {
  brain: Brain,
  leaf: Leaf,
  microscope: Microscope,
  school: School,
  'book-open': BookOpen,
  'file-text': FileText,
  users: Users,
  'graduation-cap': GraduationCap,
  shield: Shield,
  award: Award,
};

const IpIcon = ({ k, color, size }: { k: HomeIconKey; color: string; size: number }) => {
  const Icon = IP_ICON_MAP[k] || Shield;
  return <Icon size={size} style={{ color }} />;
};

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [m, setM] = useState(false);
  const [content, setContent] = useState(() => hydrateHomeContent(STATIC_HOME_CONTENT));
  const [contentSource, setContentSource] = useState<'loading' | 'supabase' | 'backup'>('loading');
  const [contentNotice, setContentNotice] = useState<string | null>(null);

  useEffect(() => setM(true), []);

  useEffect(() => {
    let active = true;

    const loadHomeContent = async () => {
      try {
        const response = await fetch('/api/home-content', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`home-content API returned ${response.status}`)
        }

        const payload = await response.json() as {
          ok?: boolean
          source?: 'supabase' | 'backup'
          content?: Parameters<typeof hydrateHomeContent>[0]
          message?: string
        }

        if (!active) {
          return
        }

        const nextContent = hydrateHomeContent(payload.content || STATIC_HOME_CONTENT)
        setContent(nextContent)
        setContentSource(payload.source || 'backup')

        if (payload.source !== 'supabase') {
          if (payload.message) {
            console.error('[home-page] Falling back to static backup:', payload.message)
          }
          setContentNotice(payload.message || 'Supabase is unavailable. Rendering the backup content file instead.')
        }
      } catch (error) {
        if (!active) {
          return
        }

        console.error('[home-page] Failed loading DB content. Rendering static fallback.', error)

        setContent(hydrateHomeContent(STATIC_HOME_CONTENT))
        setContentSource('backup')
        setContentNotice('Supabase is unavailable. Rendering the backup content file instead.')
      }
    }

    loadHomeContent()

    return () => {
      active = false
    }
  }, [])

  const HERO = content.hero
  const ID_CARD = content.idCard
  const STATS = content.stats
  const PHD = content.phd
  const ABOUT = content.about
  const CREDENTIALS = content.credentials
  const EXPERTISE = content.expertise
  const PUBLICATIONS = content.publications
  const IP_ITEMS = content.ipItems
  const TEACHING = content.teaching
  const CTA = content.cta

  return (
    <>

{/* ════════════════════════════════════════════════════════════════════════════
    HERO
════════════════════════════════════════════════════════════════════════════ */}
<section className="hero-section">

  {/* Background mesh */}
  <div className="hero-bg-mesh" aria-hidden />
  {/* Dot pattern */}
  <div className="hero-dot-pattern" aria-hidden />
  {/* Gold top line */}
  <div className="hero-top-line" aria-hidden />

  <div className="W hero-inner">

    {/* ── LEFT ── */}
    <motion.div
      className="hero-left"
      initial={{ opacity:0, y:44 }}
      animate={{ opacity: m?1:0, y: m?0:44 }}
      transition={{ duration:0.95, ease:E }}
    >
      {/* Badge pill */}
      <div className="hero-badge">
        <span className="hero-badge-dot"><GraduationCap size={11} color="#fff" /></span>
        <span>{HERO.badge}</span>
      </div>

      {/* Name */}
      <div className="hero-name-block">
        <h1 className="hero-name-first">{HERO.firstName}</h1>
        <h1 className="hero-name-last">{HERO.lastName}</h1>
      </div>

      {/* Role chip */}
      <div className="hero-role-chip">
        <span className="hero-role-dot" />
        <span>{HERO.role}</span>
      </div>

      {/* Tagline */}
      <p className="hero-tagline">{HERO.tagline}</p>

     
      {/* Location */}
      <div className="hero-meta">
        <span className="hero-location">
          <MapPin size={12} style={{color:"var(--gold)"}} />
          {HERO.location}
        </span>
        <span className="hero-divider" />
        <span className="tag tag-gold" style={{fontSize:10.5}}>Open to Collaboration</span>
       {contentSource !== 'loading' && (
        <div className={`home-content-status home-content-status-${contentSource}`}>
          {contentSource === 'supabase' ? <Database size={12} /> : <CloudOff size={12} />}
          <span >{contentSource === 'supabase' ? 'Live' : 'Backup'}</span>
        </div>
      )}

      {/* {contentNotice && contentSource === 'backup' && (
        <div className="home-content-alert" role="status" aria-live="polite">
          <CloudOff size={1} />
          <span>{contentNotice}</span>
        </div>
      )} */}

      
      </div>

      {/* CTA buttons */}
      <div className="hero-ctas">
        <Link href={HERO.ctaResearch} className="btn-navy">
          Explore Research <ArrowRight size={14} />
        </Link>
        <Link href={HERO.ctaContact} className="btn-out">
          Get in Touch
        </Link>
       
      </div>
    </motion.div>

    {/* ── RIGHT — ID Card ── */}
    <motion.div
      className="hero-right"
      initial={{ opacity:0, x:40, scale:0.94 }}
      animate={{ opacity: m?1:0, x: m?0:40, scale: m?1:0.94 }}
      transition={{ duration:1.05, delay:0.22, ease:E }}
    >
      <IdCard card={ID_CARD} />
    </motion.div>

  </div>

  {/* Bottom wave clip */}
  <div className="hero-bottom-clip" aria-hidden />
</section>


{/* ════════════════════════════════════════════════════════════════════════════
    STATS — Rectangle KPI bar
════════════════════════════════════════════════════════════════════════════ */}
<section className="stats-section">
  <div className="W">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once:true }}
      variants={ST}
      className="stats-grid"
    >
      {STATS.map((s,i) => (
        <motion.div key={i} variants={SI} className="stats-cell">
          <p className="stats-number">{s.n}</p>
          <p className="stats-label">{s.l}</p>
          <p className="stats-sub">{s.s}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>


{/* ════════════════════════════════════════════════════════════════════════════
    PhD — PINNACLE ACHIEVEMENT
════════════════════════════════════════════════════════════════════════════ */}
<section className="S" style={{background:"var(--white)", position:"relative", overflow:"hidden"}}>
  <div style={{position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,135,10,0.04) 0%, transparent 70%)", pointerEvents:"none"}} />
  <div className="W" style={{position:"relative"}}>

    <motion.div {...fadeUp()} style={{marginBottom:"clamp(24px,4vh,40px)"}}>
      <p className="lbl">{PHD.label}</p>
    </motion.div>

    <motion.div {...fadeUp(0.1)}>
      <div className="phd-card">

        {/* Dark left panel */}
        <div className="phd-left">
          <div className="phd-left-topbar" />
          <div className="phd-left-header">
            <div className="phd-icon-wrap">
              <GraduationCap size={24} style={{color:"var(--gold-3)"}} />
            </div>
            <div>
              <span className="phd-academic-label">Academic</span>
              <span className="phd-awarded-label">Awarded {PHD.awardedYear}</span>
            </div>
          </div>
          <h2 className="phd-degree">{PHD.degree}</h2>
          <p className="phd-desc">{PHD.description}</p>
          <div className="phd-tags">
            {PHD.tags.map(t => <span key={t} className="phd-tag">{t}</span>)}
          </div>
        </div>

        {/* Light right panel */}
        <div className="phd-right">
          <p className="phd-details-label">Award Details</p>
          {PHD.details.map((r,i,a) => (
            <div key={i} className="phd-row" style={{borderBottom: i<a.length-1?"1px solid rgba(15,23,42,0.07)":"none"}}>
              <span className="phd-row-key">{r.k}</span>
              <span className="phd-row-val">{r.v}</span>
            </div>
          ))}
          <div style={{marginTop:24}}>
            <Link href={PHD.cta} className="underline-link">
              View related research <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  </div>
</section>


{/* ════════════════════════════════════════════════════════════════════════════
    ABOUT + CREDENTIALS
════════════════════════════════════════════════════════════════════════════ */}
<section className="S" style={{background:"var(--white)"}}>
  <div className="W">
    <div className="two-col-grid">

      <motion.div {...fadeUp(0)}>
        <p className="lbl" style={{marginBottom:18}}>{ABOUT.label}</p>
        <h2 className="section-h2">
          {ABOUT.heading}{" "}
          <em style={{color:"var(--gold)",fontStyle:"italic",fontWeight:500}}>{ABOUT.headingItalic}</em>
        </h2>
        <p className="body-text" style={{marginBottom:16}}>{ABOUT.body1}</p>
        <p className="body-text muted" style={{marginBottom:32}}>{ABOUT.body2}</p>
        <Link href={ABOUT.cta} className="underline-link">Full academic profile <ArrowRight size={13} /></Link>
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <div className="card" style={{overflow:"hidden",boxShadow:"var(--sh2)"}}>
          <div style={{padding:"14px 20px",background:"var(--off)",borderBottom:"1px solid var(--ink-line)",display:"flex",alignItems:"center",gap:10}}>
            <Star size={14} style={{color:"var(--gold)"}} />
            <p style={{fontFamily:"Playfair Display, serif",fontSize:15,fontWeight:600,color:"var(--navy)"}}>Key Credentials</p>
          </div>
          {CREDENTIALS.map((r,i,a) => (
            <div
              key={i}
              style={{display:"flex",gap:12,padding:"13px 20px",borderBottom:i<a.length-1?"1px solid var(--ink-line)":"none",transition:"background 0.15s"}}
              onMouseEnter={e=>(e.currentTarget.style.background="var(--off)")}
              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
            >
              <CheckCircle2 size={14} style={{color:"var(--gold)",flexShrink:0,marginTop:3}} />
              <div>
                <p style={{fontSize:13,fontWeight:600,color:"var(--navy)",marginBottom:2}}>{r.t}</p>
                <p style={{fontSize:12,color:"var(--ink-3)",lineHeight:1.58}}>{r.d}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  </div>
</section>

<hr className="rule" />

{/* ════════════════════════════════════════════════════════════════════════════
    EXPERTISE GRID
════════════════════════════════════════════════════════════════════════════ */}
<section className="S" style={{background:"var(--off)"}}>
  <div className="W">
    <motion.div {...fadeUp()} style={{textAlign:"center",marginBottom:"clamp(32px,5vh,52px)"}}>
      <p className="lbl" style={{justifyContent:"center",marginBottom:12}}>Domains of Specialization</p>
      <h2 className="section-h2" style={{textAlign:"center"}}>
        Areas of <em style={{color:"var(--gold)",fontStyle:"italic",fontWeight:500}}>Deep Expertise</em>
      </h2>
    </motion.div>

    <motion.div
      className="expertise-grid"
      initial="hidden"
      whileInView="visible"
      viewport={{once:true}}
      variants={ST}
    >
      {EXPERTISE.map(ex => (
        <motion.div key={ex.label} variants={SI} className="expertise-card"
          style={{padding:"clamp(16px,2.2vw,22px)",borderRadius:13,background:"#fff",border:`1.5px solid ${ex.border}`,transition:"transform 0.22s,box-shadow 0.22s,border-color 0.22s",cursor:"default"}}
          onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.transform="translateY(-4px)"; el.style.boxShadow="0 12px 40px rgba(13,31,60,0.11)"; el.style.borderColor=`${ex.color}50`; }}
          onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.transform=""; el.style.boxShadow=""; el.style.borderColor=ex.border; }}
        >
          <div style={{width:38,height:38,borderRadius:9,background:ex.bg,border:`1px solid ${ex.color}20`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
            <ex.icon size={17} style={{color:ex.color}} />
          </div>
          <p style={{fontSize:13.5,fontWeight:700,color:ex.color,marginBottom:5,lineHeight:1.2}}>{ex.label}</p>
          <p style={{fontSize:11,color:"var(--ink-4)",lineHeight:1.6}}>{ex.sub}</p>
        </motion.div>
      ))}
    </motion.div>

    <motion.div {...fadeUp(0.1)} style={{textAlign:"center",marginTop:32}}>
      <Link href="/teaching" className="underline-link" style={{justifyContent:"center"}}>
        View teaching portfolio <ArrowRight size={13} />
      </Link>
    </motion.div>
  </div>
</section>

<hr className="rule" />

{/* ════════════════════════════════════════════════════════════════════════════
    RESEARCH + PUBLICATIONS
════════════════════════════════════════════════════════════════════════════ */}
<section className="S" style={{background:"var(--white)"}}>
  <div className="W">
    <div className="two-col-grid">

      <motion.div {...fadeUp(0)}>
        <p className="lbl" style={{marginBottom:16}}>Research Overview</p>
        <h2 className="section-h2">
          Advancing Intelligent Systems Through{" "}
          <em style={{color:"var(--gold)",fontStyle:"italic",fontWeight:500}}>Applied Artificial Intelligence</em>
        </h2>
        <p className="body-text muted" style={{marginBottom:24,textAlign:"justify"}}>
          Research combining deep learning, computer vision, and intelligent automation to build models capable of understanding complex patterns — enabling smarter decision-making across agriculture, healthcare, cybersecurity, and education.
        </p>
        {[
          ["Core Area",    "Artificial Intelligence & Machine Learning"],
          ["Tech Stack",   "Deep Learning, Computer Vision, Neural Networks"],
          ["Approach",     "Data-driven modeling & intelligent automation"],
          ["Applications", "Smart systems, analytics, and optimisation"],
          ["Focus",        "Scalability, accuracy, and real-world usability"],
        ].map(([k,v],i) => (
          <div key={i} style={{display:"flex",gap:16,padding:"9px 0",borderBottom:"1px solid var(--ink-line)"}}>
            <span style={{fontSize:12,color:"var(--ink-4)",minWidth:108,flexShrink:0,fontWeight:600}}>{k}</span>
            <span style={{fontSize:12.5,color:"var(--ink)"}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop:24}}>
          <Link href="/research" className="underline-link">
            View detailed research work <ArrowRight size={13} />
          </Link>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <div className="card" style={{overflow:"hidden",boxShadow:"var(--sh2)"}}>
          <div style={{padding:"14px 20px",background:"var(--navy)",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <p style={{fontFamily:"Playfair Display, serif",fontSize:15.5,fontWeight:600,color:"#E2E8F0"}}>Selected Publications</p>
              <p style={{fontSize:11,color:"rgba(226,232,240,0.48)",marginTop:2}}>15 international journals · 7 conferences</p>
            </div>
            <Link href="/research" style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--gold-3)",fontWeight:600,textDecoration:"none"}}>
              All <ExternalLink size={10} />
            </Link>
          </div>
          {PUBLICATIONS.map((p,i) => (
            <div key={i}
              style={{display:"flex",gap:12,padding:"13px 20px",borderBottom:i<PUBLICATIONS.length-1?"1px solid var(--ink-line)":"none",transition:"background 0.15s"}}
              onMouseEnter={e=>(e.currentTarget.style.background="var(--off)")}
              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
            >
              <span style={{flexShrink:0,alignSelf:"flex-start",padding:"3px 9px",borderRadius:4,background:`${p.color}12`,border:`1px solid ${p.color}28`,fontSize:9.5,color:p.color,fontWeight:700,letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{p.tag}</span>
              <div>
                <p style={{fontSize:13,fontWeight:500,color:"var(--navy)",lineHeight:1.42,marginBottom:3}}>{p.title}</p>
                <p style={{fontSize:11,color:"var(--ink-4)"}}>{p.info}</p>
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:24,padding:"14px 20px",background:"var(--off)",flexWrap:"wrap",borderTop:"1px solid var(--ink-line)"}}>
            {[["15","Journals"],["07","Conf."],["02","Patents"],["02","Copyrights"]].map(([n,l]) => (
              <div key={l}>
                <p className="sn" style={{fontSize:24,lineHeight:1}}>{n}</p>
                <p style={{fontSize:9.5,color:"var(--ink-4)",letterSpacing:"0.07em",textTransform:"uppercase",marginTop:3}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  </div>
</section>

{/* ════════════════════════════════════════════════════════════════════════════
    IP — PATENTS & COPYRIGHTS
════════════════════════════════════════════════════════════════════════════ */}
<section style={{background:"var(--navy)",padding:"clamp(56px,9vh,92px) 0",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,var(--gold),transparent)"}} />
  <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 70% 50%,rgba(184,135,10,0.08) 0%,transparent 55%)",pointerEvents:"none"}} />
  <div className="W" style={{position:"relative"}}>
    <motion.div {...fadeUp()} style={{textAlign:"center",marginBottom:"clamp(32px,5vh,52px)"}}>
      <p className="lbl" style={{color:"var(--gold-3)",justifyContent:"center",marginBottom:14}}>Intellectual Property</p>
      <h2 style={{fontFamily:"Playfair Display, serif",fontSize:"clamp(26px,4vw,50px)",fontWeight:700,color:"#E2E8F0",lineHeight:1.1}}>
        Patents, Copyrights &{" "}
        <em style={{color:"var(--gold-3)",fontStyle:"italic",fontWeight:500}}>Registered IP</em>
      </h2>
    </motion.div>
    <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={ST}
      style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"clamp(10px,1.5vw,16px)"}}
    >
      {IP_ITEMS.map((r,i) => (
        <motion.div key={i} variants={SI}
          style={{padding:"clamp(18px,2.5vw,28px)",borderRadius:13,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",transition:"transform 0.22s,background 0.22s,border-color 0.22s",cursor:"default"}}
          onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.background="rgba(184,135,10,0.10)"; el.style.borderColor="rgba(184,135,10,0.32)"; el.style.transform="translateY(-4px)"; }}
          onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.background="rgba(255,255,255,0.04)"; el.style.borderColor="rgba(255,255,255,0.08)"; el.style.transform=""; }}
        >
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div style={{width:42,height:42,borderRadius:10,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <IpIcon k={r.iconKey} color={r.iconColor} size={18} />
            </div>
            <span style={{fontSize:9.5,padding:"2px 10px",borderRadius:4,background:"rgba(184,135,10,0.16)",border:"1px solid rgba(184,135,10,0.28)",color:"var(--gold-3)",fontWeight:700,letterSpacing:"0.07em"}}>{r.tag}</span>
          </div>
          <p style={{fontSize:13.5,fontWeight:600,color:"#E2E8F0",lineHeight:1.42,marginBottom:7}}>{r.title}</p>
          <p style={{fontSize:11,color:"rgba(226,232,240,0.38)",marginBottom:18}}>{r.detail}</p>
          <Link href={r.href} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:"var(--gold-3)",fontWeight:600,textDecoration:"none",borderBottom:"1px solid rgba(212,168,32,0.35)",paddingBottom:1}}>
            View details <ArrowRight size={11} />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

{/* ════════════════════════════════════════════════════════════════════════════
    TEACHING
════════════════════════════════════════════════════════════════════════════ */}
<section className="S" style={{background:"var(--white)"}}>
  <div className="W">
    <div className="two-col-grid" style={{alignItems:"center"}}>

      <motion.div {...fadeUp(0)}>
        <p className="lbl" style={{marginBottom:18}}>Teaching Philosophy</p>
        <div style={{borderLeft:"4px solid var(--gold)",paddingLeft:22,marginBottom:28}}>
          <Quote size={22} style={{color:"var(--gold)",opacity:0.5,marginBottom:10}} />
          <p style={{fontFamily:"Playfair Display, serif",fontSize:"clamp(17px,2vw,23px)",fontStyle:"italic",fontWeight:400,color:"var(--navy)",lineHeight:1.5}}>
            "{TEACHING.quote}"
          </p>
        </div>
        <p className="body-text muted" style={{marginBottom:26,textAlign:"justify"}}>{TEACHING.body}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:28}}>
          {TEACHING.subjects.map(s=><span key={s} className="tag" style={{fontSize:11}}>{s}</span>)}
        </div>
        <Link href={TEACHING.cta} className="underline-link">Full teaching portfolio <ArrowRight size={13} /></Link>
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <div className="teaching-stats-grid">
          {TEACHING.stats.map((s,i) => (
            <motion.div key={i}
              initial={{opacity:0,scale:0.92}}
              whileInView={{opacity:1,scale:1}}
              viewport={{once:true}}
              transition={{delay:i*0.09,ease:E}}
              className="card teaching-stat-card"
              style={{padding:"clamp(18px,3vw,28px)",textAlign:"center"}}
            >
              <div style={{width:42,height:42,borderRadius:10,background:"var(--navy-pale)",border:"1px solid var(--navy-glow)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <s.icon size={18} style={{color:"var(--navy)"}} />
              </div>
              <p className="sn" style={{fontSize:36,lineHeight:1,marginBottom:7}}>{s.v}</p>
              <p style={{fontSize:12.5,color:"var(--ink-3)",lineHeight:1.42}}>{s.l}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  </div>
</section>

{/* ════════════════════════════════════════════════════════════════════════════
    CTA
════════════════════════════════════════════════════════════════════════════ */}
<section className="cta-section">
  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,var(--gold),transparent)"}} />
  <div className="cta-bg-text" aria-hidden>AI</div>
  <div className="W" style={{position:"relative",textAlign:"center"}}>
    <motion.div {...fadeUp()}>
      <p className="lbl" style={{justifyContent:"center",marginBottom:16}}>{CTA.label}</p>
      <h2 className="cta-heading">
        {CTA.heading}{" "}
        <em style={{color:"var(--gold)",fontStyle:"italic",fontWeight:600}}>{CTA.headingItalic}</em>{" "}
        Together
      </h2>
      <p className="cta-body">{CTA.body}</p>
      <div className="cta-btns">
        <Link href={CTA.btnPrimary.href} className="btn-navy" style={{padding:"14px 30px",fontSize:14}}>
          {CTA.btnPrimary.label} <ArrowRight size={15} />
        </Link>
        <a href={CTA.btnSecondary.href} className="btn-out" style={{padding:"14px 30px",fontSize:14}}>
          <Mail size={14} /> {CTA.btnSecondary.label}
        </a>
      </div>
    </motion.div>
  </div>
</section>


{/* ════════════════════════════════════════════════════════════════════════════
    SCOPED STYLES
════════════════════════════════════════════════════════════════════════════ */}
<style>{`

/* ── Shared helpers ── */
.two-col-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(40px, 7vw, 100px);
  align-items: start;
}
.section-h2 {
  font-size: clamp(26px, 3.8vw, 50px);
  font-weight: 700;
  color: var(--navy);
  line-height: 1.1;
  margin-bottom: 22px;
}
.body-text       { font-size: 15px; color: var(--ink-2);  line-height: 1.82; font-weight: 300; }
.body-text.muted { font-size: 14.5px; color: var(--ink-3); }
.underline-link  {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13.5px; color: var(--navy); font-weight: 600;
  text-decoration: none; border-bottom: 2px solid var(--gold); padding-bottom: 2px;
  transition: opacity .2s;
}
.underline-link:hover { opacity: .72; }

/* ── HERO ── */
.hero-section {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: var(--white);
  padding-top: var(--nav-h);
  position: relative;
  overflow: hidden;
}
.hero-bg-mesh {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 80% 65% at 100%  0%, rgba(212,168,32,.09) 0%, transparent 54%),
    radial-gradient(ellipse 55% 55% at   0% 100%, rgba(45,91,138,.07)  0%, transparent 54%),
    radial-gradient(ellipse 40% 50% at  50%  50%, rgba(13,31,60,.03)   0%, transparent 60%);
}
.hero-dot-pattern {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(13,31,60,.12) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}
.hero-top-line {
  position: absolute; top: var(--nav-h); left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent 0%, var(--gold) 22%, var(--gold-3) 55%, var(--gold) 80%, transparent 100%);
}
.hero-inner {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: clamp(40px, 6vw, 96px);
  align-items: center;
  padding: clamp(56px, 9vh, 112px) clamp(20px, 5vw, 80px);
  position: relative;
  z-index: 1;
}
.hero-left  { display: flex; flex-direction: column; }
.hero-right { display: flex; justify-content: center; }

/* Badge */
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 16px 5px 7px; border-radius: 100px;
  border: 1px solid var(--gold-border); background: var(--gold-pale);
  margin-bottom: 28px; width: fit-content;
}
.hero-badge-dot {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--gold);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.hero-badge span:last-child { font-size: 11px; color: var(--gold); font-weight: 600; letter-spacing: .04em; }

/* Name */
.hero-name-block { margin-bottom: 18px; }
.hero-name-first {
  font-family: "Playfair Display", serif;
  font-size: clamp(52px, 8vw, 102px);
  font-weight: 800; line-height: .92; letter-spacing: -.03em;
  color: var(--navy); margin: 0;
}
.hero-name-last {
  font-family: "Playfair Display", serif;
  font-size: clamp(52px, 8vw, 102px);
  font-weight: 400; font-style: italic; line-height: 1.06; letter-spacing: -.025em;
  color: var(--gold); margin: 0;
}

/* Role chip */
.hero-role-chip {
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 22px; width: fit-content;
}
.hero-role-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--gold);
  box-shadow: 0 0 8px rgba(184,135,10,.55);
  animation: pulse-dot 2.4s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,100% { box-shadow: 0 0 8px rgba(184,135,10,.55); }
  50%      { box-shadow: 0 0 16px rgba(184,135,10,.90); }
}
.hero-role-chip span:last-child {
  font-size: clamp(13px,1.2vw,15px); font-weight: 700;
  color: var(--navy); letter-spacing: .04em; text-transform: uppercase;
}

/* Tagline */
.hero-tagline {
  font-size: clamp(14.5px, 1.35vw, 17px);
  color: var(--ink-2); line-height: 1.78; max-width: 530px;
  margin-bottom: 26px; font-weight: 300; text-align: justify;
}

/* Meta row */
.hero-meta   { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 34px; }
.hero-location { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--ink-3); }
.hero-divider  { width: 1px; height: 14px; background: var(--ink-line); }

.home-content-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  margin: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid rgba(13,31,60,0.14);
  background: rgba(255,255,255,0.72);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--navy);
}

.home-content-status-supabase {
  border-color: rgba(26,107,72,0.22);
  background: rgba(26,107,72,0.08);
  color: #1A6B48;
}

.home-content-status-backup {
  border-color: rgba(184,135,10,0.22);
  background: rgba(184,135,10,0.08);
  color: #7A5500;
}

.home-content-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: fit-content;
  max-width: 520px;
  margin: 0 0 18px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(184,135,10,0.22);
  background: rgba(184,135,10,0.08);
  color: #7A5500;
  font-size: 12px;
  line-height: 1.5;
}

/* CTAs */
.hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.hero-email-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; color: var(--ink-3); font-weight: 500;
  text-decoration: none; border-bottom: 1px dashed var(--ink-line); padding-bottom: 1px;
  transition: color .2s, border-color .2s;
}
.hero-email-link:hover { color: var(--navy); border-color: var(--gold); }

/* Bottom clip */
.hero-bottom-clip {
  position: absolute; bottom: -1px; left: 0; right: 0; height: 50px;
  background: var(--navy);
  clip-path: polygon(0 100%, 100% 100%, 100% 0);
  pointer-events: none;
}

/* ── STATS ── */
.stats-section {
  background: var(--navy);
  padding: clamp(32px, 5vh, 52px) 0;
  position: relative;
}
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1px;
  background: rgba(255,255,255,.08);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
  padding: 1px;
}
.stats-cell {
  flex: 1 1 180px;
  min-width: 0;
  padding: clamp(20px, 3.2vw, 36px) clamp(10px, 1.5vw, 18px);
  text-align: center;
  background: rgba(13,31,60,.55);
  transition: background .25s;
  cursor: default;
}
.stats-cell:hover      { background: rgba(184,135,10,.13); }
.stats-number  { font-family:"Playfair Display",serif; font-size:clamp(32px,4.5vw,54px); font-weight:700; line-height:1; color:var(--gold-3); margin-bottom:5px; }
.stats-label   { font-size:clamp(10.5px,1vw,13px); font-weight:600; color:#E2E8F0; margin-bottom:3px; }
.stats-sub     { font-size:9.5px; color:rgba(226,232,240,.38); letter-spacing:.08em; }

/* ── PhD CARD ── */
.phd-card {
  border-radius: 18px; overflow: hidden;
  border: 1.5px solid rgba(184,135,10,.28);
  box-shadow: 0 20px 60px rgba(13,31,60,.13), 0 4px 16px rgba(13,31,60,.07);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.phd-left {
  background: #0D1F3C;
  padding: clamp(28px, 4vw, 52px);
  position: relative; overflow: hidden;
}
.phd-left-topbar { position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--gold),var(--gold-3)); }
.phd-left-header { display:flex; align-items:center; gap:12px; margin-bottom:22px; }
.phd-icon-wrap {
  width:52px; height:52px; border-radius:12px;
  background:rgba(184,135,10,.15); border:1px solid rgba(184,135,10,.30);
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.phd-academic-label { font-size:9.5px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--gold-3); display:block; }
.phd-awarded-label  { font-size:11px; color:rgba(226,232,240,.45); }
.phd-degree  { font-family:"Playfair Display",serif; font-size:clamp(22px,3vw,34px); font-weight:700; color:#F0F4F8; line-height:1.18; margin-bottom:14px; }
.phd-desc    { font-size:14px; color:rgba(226,232,240,.62); line-height:1.78; margin-bottom:22px; }
.phd-tags    { display:flex; flex-wrap:wrap; gap:6px; }
.phd-tag     { padding:3px 10px; border-radius:100px; font-size:11px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); color:rgba(226,232,240,.65); }
.phd-right   { background:var(--off); padding:clamp(28px,4vw,52px); }
.phd-details-label { font-size:10.5px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; }
.phd-row     { display:flex; gap:16px; padding:11px 0; }
.phd-row-key { font-size:11px; color:var(--ink-4); font-weight:600; min-width:88px; flex-shrink:0; }
.phd-row-val { font-size:13px; color:var(--ink); }

/* ── CTA SECTION ── */
.cta-section {
  background: var(--off);
  padding: clamp(80px,13vh,130px) 0;
  position: relative; overflow: hidden;
  border-top: 1px solid var(--ink-line);
}
.cta-bg-text {
  position:absolute; top:50%; left:-50px; transform:translateY(-50%);
  font-family:"Playfair Display",serif; font-weight:800;
  font-size:clamp(90px,20vw,240px); color:var(--navy-pale);
  line-height:1; user-select:none; pointer-events:none; letter-spacing:-.04em;
}
.cta-heading {
  font-family:"Playfair Display",serif;
  font-size:clamp(32px,5.5vw,72px);
  font-weight:800; color:var(--navy); line-height:1.05;
  letter-spacing:-.025em; max-width:820px; margin:0 auto 20px;
}
.cta-body   { font-size:clamp(14px,1.3vw,17px); color:var(--ink-3); line-height:1.8; max-width:560px; margin:0 auto 44px; font-weight:300; }
.cta-btns   { display:flex; flex-wrap:wrap; gap:14px; justify-content:center; }

/* ── RESPONSIVE ── */
@media (max-width: 980px) {
  .hero-inner { grid-template-columns: 1fr !important; }
  .stats-cell { flex-basis: 220px; }
}
@media (max-width: 640px) {
  .hero-inner { padding: 40px 18px 60px; }
  .stats-grid { border-radius: 8px; }
  .stats-cell { flex-basis: 100%; }
  .W { padding-left: 16px !important; padding-right: 16px !important; }
  .S { padding-top: 52px !important; padding-bottom: 52px !important; }
  .two-col-grid { gap: 40px; }
  .hero-email-link { display: none; }
}
@media (min-width: 641px) and (max-width: 980px) {
  .stats-cell { flex-basis: calc(50% - 1px); }
}
@media (min-width: 981px) {
  .stats-cell { flex-basis: calc(20% - 1px); }
}

.expertise-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}
.expertise-card {
  flex: 1 1 220px;
  max-width: 320px;
}
.teaching-stats-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}
.teaching-stat-card {
  flex: 1 1 190px;
  max-width: 290px;
}
`}</style>

    </>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
  ID CARD — profile card only (skills + role badges, NO KPIs)
═══════════════════════════════════════════════════════════════════════════ */
function IdCard({ card }: { card: ReturnType<typeof hydrateHomeContent>["idCard"] }) {
  const avatarSrc = card.imageUrl?.trim() || '/Profile_pic/SBT_Profile.jpg'

  return (
    <div style={{width:"100%", maxWidth:400, position:"relative"}}>

      {/* Outer decorative rings */}
      <div style={{position:"absolute",inset:-18,borderRadius:24,border:"1.5px solid var(--gold-border)",opacity:.4,pointerEvents:"none"}} />
      <div style={{position:"absolute",inset:-8,borderRadius:19,border:"1px solid var(--ink-line)",pointerEvents:"none"}} />

      {/* Card */}
      <div className="card" style={{overflow:"hidden",borderRadius:16,boxShadow:"0 28px 72px rgba(13,31,60,.20), 0 8px 24px rgba(13,31,60,.12)"}}>

        {/* Top accent */}
        <div style={{height:5,background:"linear-gradient(90deg,var(--navy) 0%,var(--navy-2) 45%,var(--gold) 100%)"}} />

        {/* Dark header */}
        <div style={{
          background:"linear-gradient(140deg,#0D1F3C 0%,#172d55 100%)",
          padding:"clamp(22px,3vw,30px) clamp(20px,3vw,28px) clamp(16px,2vw,22px)",
          position:"relative", overflow:"hidden",
        }}>
          {/* Subtle dot grid */}
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.07) 1px,transparent 1px)",backgroundSize:"22px 22px",pointerEvents:"none"}} />

          {/* Corner watermark */}
          <div style={{position:"absolute",bottom:-12,right:-8,fontFamily:"Playfair Display,serif",fontSize:90,fontWeight:800,color:"rgba(255,255,255,.04)",lineHeight:1,userSelect:"none",pointerEvents:"none"}}>AI</div>

          {/* Avatar + name */}
          <div style={{position:"relative",display:"flex",gap:16,alignItems:"center",marginBottom:18}}>
            <div style={{
              width:68,height:68,borderRadius:"50%",flexShrink:0,
              background:"rgba(184,135,10,.15)",
              border:"2.5px solid rgba(212,168,32,.55)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 0 28px rgba(184,135,10,.28)",
            }}>
           {/* <   <span style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:700,color:"var(--gold-3)"}}>
                {card.initials}
              </span>> */}
              <img src={avatarSrc} alt={`${card.name}'s avatar`} style={{width:64,height:64,borderRadius:"50%",objectFit:"cover"}} />
            </div>
            <div>
              <p style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(15px,2vw,18px)",fontWeight:700,color:"#F0F4F8",lineHeight:1.18,marginBottom:4}}>
                {card.name}
              </p>
              <p style={{fontSize:11.5,color:"rgba(226,232,240,.58)",marginBottom:6}}>{card.degree}</p>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <GraduationCap size={10} style={{color:"var(--gold-3)"}} />
                <span style={{fontSize:10.5,color:"var(--gold-3)",fontWeight:600,letterSpacing:".02em"}}>{card.field}</span>
              </div>
            </div>
          </div>

          {/* Thesis line */}
          <div style={{position:"relative",padding:"10px 14px",borderRadius:8,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.10)",marginBottom:16}}>
            <p style={{fontSize:9.5,color:"rgba(226,232,240,.45)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>Doctoral Thesis</p>
            <p style={{fontSize:12,color:"rgba(226,232,240,.80)",lineHeight:1.45,fontWeight:400}}>{card.thesis}</p>
          </div>

          {/* Skill pills */}
          <div style={{position:"relative",display:"flex",flexWrap:"wrap",gap:5}}>
            {card.skills.map(s=>(
              <span key={s} style={{padding:"3px 10px",borderRadius:100,fontSize:10,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.14)",color:"rgba(226,232,240,.78)",fontWeight:600}}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Light footer — role badges */}
        <div style={{padding:"14px 20px 16px",background:"#fff",borderTop:"1px solid var(--ink-line)"}}>
          <p style={{fontSize:9.5,color:"var(--ink-4)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>
            Roles & Recognition
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {card.badges.map(b=>(
              <span key={b.label} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:100,fontSize:11,fontWeight:600,color:b.color,background:`${b.color}12`,border:`1.5px solid ${b.color}30`}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:b.color,flexShrink:0}} />
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div style={{padding:"10px 20px",background:"var(--off)",borderTop:"1px solid var(--ink-line)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 7px rgba(34,197,94,.65)"}} />
            <span style={{fontSize:11,color:"var(--ink-3)",fontWeight:500}}>Available for collaboration</span>
          </div>
          <div style={{display:"flex",gap:7}}>
            {[Code2,Cpu].map((Icon,i)=>(
              <span key={i} style={{width:28,height:28,borderRadius:7,background:"var(--navy-pale)",border:"1px solid var(--navy-glow)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon size={13} style={{color:"var(--navy)"}} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating PhD badge */}
      <motion.div
        animate={{y:[0,-8,0]}}
        transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}
        style={{
          position:"absolute",top:16,right:-26,
          padding:"10px 16px",borderRadius:12,
          background:"#fff",border:"1.5px solid var(--gold-border)",
          boxShadow:"0 10px 30px rgba(184,135,10,.18), var(--sh2)",
          textAlign:"center",zIndex:2,
        }}
      >
        <p style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:700,color:"var(--gold)",lineHeight:1}}>Ph.D.</p>
        <p style={{fontSize:9,color:"var(--ink-4)",letterSpacing:".12em",textTransform:"uppercase",marginTop:3}}>Awarded 2024</p>
      </motion.div>

      {/* Floating tag */}
      {/* <motion.div
        animate={{y:[0,7,0]}}
        transition={{duration:4.5,repeat:Infinity,ease:"easeInOut",delay:1.3}}
        style={{
          position:"absolute",bottom:40,left:-22,
          padding:"8px 14px",borderRadius:10,
          background:"var(--navy)",border:"1px solid rgba(255,255,255,.10)",
          boxShadow:"0 8px 24px rgba(13,31,60,.30)",
          zIndex:2,display:"flex",alignItems:"center",gap:7,
        }}
      >
        <Sparkles size={12} style={{color:"var(--gold-3)"}} />
        <span style={{fontSize:11,color:"#E2E8F0",fontWeight:600}}>AI Researcher</span>
      </motion.div> */}

    </div>
  );
}