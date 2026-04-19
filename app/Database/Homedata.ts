// ─── homeContent.ts ───────────────────────────────────────────────────────────
// Single source of truth — all content imported by page.tsx

import {
  Brain, Leaf, Microscope, School, BookOpen,
  FileText, Users, GraduationCap,
} from "lucide-react";

// ── Hero ──────────────────────────────────────────────────────────────────────
export const HERO = {
  badge:       "Ph.D. · Computer Engineering · 18+ Years",
  firstName:   "Dr. Sachin",
  lastName:    "Takmare",
  role:        "AI & Deep Learning Researcher",
  tagline:
    "Bridging theory and practice through precision farming, computer vision, and intelligent systems — 15 peer-reviewed publications, 2 utility patents, and 70+ mentored projects across 18 years.",
  location:    "Kolhapur, Maharashtra",
  email:       "sachintakmare@gmail.com",
  ctaResearch: "/research",
  ctaContact:  "/contact",
};

// ── ID Card ─── profile card only (NO KPIs — those are in STATS below) ────────
export const ID_CARD = {
  name:     "Dr. Sachin B. Takmare",
  initials: "ST",
  degree:   "Ph.D. (2024) · M.Tech · B.E.",
  field:    "Computer Engineering",
  thesis:   "CNN-Based Precision Farming System",
  tagline:  "AI Researcher · Educator · Innovator",
  skills:   ["Deep Learning", "Computer Vision", "NLP", "AI / ML", "Data Science"],
  badges: [
    { label: "IEEE Author",   color: "#2D5B8A" },
    { label: "Patent Holder", color: "#B8870A" },
    { label: "PG Supervisor", color: "#1A6B48" },
  ],
};

// ── Stats / KPI bar ─── rectangle strip, no cross-lines ──────────────────────
export const STATS = [
  { n: "18+", l: "Years Teaching",  s: "UGC Approved"   },
  { n: "15",  l: "Int'l Journals",  s: "Peer Reviewed"  },
  { n: "07",  l: "Conferences",     s: "International"  },
  { n: "70+", l: "Projects Guided", s: "UG & PG Both"   },
  { n: "02",  l: "Patents Filed",   s: "Utility Patents"},
];

// ── PhD / Pinnacle Achievement ────────────────────────────────────────────────
export const PHD = {
  label:       "Pinnacle Achievement",
  degree:      "Doctor of Philosophy (Ph.D.)",
  awardedYear: "2024",
  institution: "Pacific University, Udaipur",
  thesis:
    "Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis",
  description:
    "Doctoral research confronting India's agricultural crisis — fields across India are over-sprayed because crops and weeds are visually indistinguishable at scale. By training CNNs on annotated field imagery and applying YOLO for plant density estimation, the system automates what was previously manual, reducing herbicide use and environmental damage.",
  tags: ["Doctorate", "AI Research", "Precision Agriculture", "CNN", "YOLO"],
  details: [
    { k: "Degree",      v: "Doctor of Philosophy (Ph.D.)"    },
    { k: "Institution", v: "Pacific University, Udaipur"      },
    { k: "Year",        v: "2024 — Awarded"                   },
    { k: "Thesis",      v: "Precision Farming: CNN-Based System for Crop and Weed Classification and Density Analysis" },
    { k: "Method",      v: "CNN + Computer Vision Pipeline"   },
    { k: "Outcome",     v: "2 International Publications · 1 Utility Patent Filed" },
  ],
  cta: "/research",
};

// ── About ─────────────────────────────────────────────────────────────────────
export const ABOUT = {
  label:        "Scholar · Researcher · Mentor",
  heading:      "Eighteen years shaping engineers —",
  headingItalic:"advancing the AI frontier.",
  body1:
    "From lecture halls in Thane to award-winning AI research, my career is built on one belief: technology must solve real problems for real people. My Ph.D. research — a CNN-based precision farming system — was driven by India's agricultural challenges, not academic ambition alone.",
  body2:
    "Approved as Assistant Professor by the University of Mumbai and Shivaji University Kolhapur, I have mentored 70+ student projects and supervised 10 M.E. dissertations, while publishing 15 international research papers and filing 2 utility patents.",
  cta: "/about",
};

export const CREDENTIALS = [
  { t: "Ph.D. Awarded — Pacific University, 2024",  d: "Thesis: CNN-Based System for Crop & Weed Classification and Density Analysis." },
  { t: "Dual University Appointment",                d: "University of Mumbai (2008, 2018) & Shivaji University Kolhapur (2014)." },
  { t: "Patent Holder (×2)",                         d: "AI Crop & Weed Management System · Intelligent Malware Evasion Prevention System." },
  { t: "Copyright Holder (×2)",                      d: "Plant Species CNN Software · VR Interactive Education Software registered 2024." },
  { t: "PG Recognized Teacher",                      d: "Recognized by Shivaji University Kolhapur for M.E. research supervision." },
  { t: "External Examiner — M.E. Dissertations",     d: "Appointed evaluator for M.E. thesis examination by Shivaji University." },
];

// ── Expertise ─────────────────────────────────────────────────────────────────
export const EXPERTISE = [
  { label: "Deep Learning",               color: "#0D1F3C", bg: "rgba(13,31,60,0.07)",   border: "rgba(13,31,60,0.16)",   sub: "CNN · RNN · Transformers",                         icon: Brain      },
  { label: "AI & Machine Learning",       color: "#1A6B48", bg: "rgba(26,107,72,0.08)",  border: "rgba(26,107,72,0.18)",  sub: "Supervised · Unsupervised · Reinforcement",        icon: Leaf       },
  { label: "Computer Vision",             color: "#2D5B8A", bg: "rgba(45,91,138,0.08)",  border: "rgba(45,91,138,0.18)",  sub: "YOLO · CNN Pipelines · Image Classification",      icon: Microscope },
  { label: "Natural Language Processing", color: "#5C3A8A", bg: "rgba(92,58,138,0.07)",  border: "rgba(92,58,138,0.16)",  sub: "Language Models · Text Analysis · Semantics",      icon: BookOpen   },
  { label: "Data Science",                color: "#7A5500", bg: "rgba(122,85,0,0.07)",   border: "rgba(122,85,0,0.16)",   sub: "Analytics · Visualisation · Statistical Modelling",icon: FileText   },
  { label: "Core CS Concepts",            color: "#1A3560", bg: "rgba(26,53,96,0.07)",   border: "rgba(26,53,96,0.16)",   sub: "DS & Algo · OS · Networks · DBMS · TOC",           icon: School     },
];

// ── Publications ──────────────────────────────────────────────────────────────
export const PUBLICATIONS = [
  { tag: "IJISAE 2024", color: "#0D1F3C", title: "Transforming Farming with CNNs: Accurate Crop and Weed Classification",       info: "Vol. 12, Issue 4 · pp. 1484–1490 · ISSN 2147-6799" },
  { tag: "IEEE INOCON", color: "#1A6B48", title: "MetaCampus: Advancing Online Education with Virtual Classroom",                info: "IEEE 2024 · 979-8-3503-8193-1/24"                  },
  { tag: "IJOEAR 2024", color: "#2D5B8A", title: "Estimating Crop and Weed Density Using YOLO for Precision Agriculture",        info: "Vol. 6, Issue 10 · pp. 14–25 · ISSN 2454-1850"     },
  { tag: "IEEE WCONF",  color: "#B8870A", title: "Dodging Turtis NFT Gaming on Blockchain",                                      info: "IEEE 2023 · 979-8-3503-1120-4/23"                  },
  { tag: "IJCSE 2024",  color: "#5C3A1A", title: "A Deep Learning Approach to Efficient Crop and Weed Classification",           info: "Vol. 12, Issue 6 · pp. 30–43 · E-ISSN 2347-2693"   },
];

// ── IP ────────────────────────────────────────────────────────────────────────
export const IP_ITEMS = [
  { iconKey: "shield" as const, iconColor: "var(--gold-3)", tag: "Patent · 2024",    title: "AI-Based Crop & Weed Management System",          detail: "Application No: 202421045939 · Published",          href: "/research/patents"          },
  { iconKey: "shield" as const, iconColor: "#6B95D8",       tag: "Patent · 2024",    title: "Intelligent Malware Evasion Prevention System",    detail: "Application No: 202421069724 · Published Oct 2024", href: "/research/patents"          },
  { iconKey: "award"  as const, iconColor: "var(--gold-3)", tag: "Copyright · 2024", title: "Plant Species & Weed Classification CNN Software", detail: "Diary No: 14704/2024-CO/SW · May 2024",             href: "/achievements/certificates" },
  { iconKey: "award"  as const, iconColor: "#6BD8B8",       tag: "Copyright · 2024", title: "VR Solution for Interactive Online Education",     detail: "Diary No: 25004/2024-CO/SW · Dec 2024",             href: "/achievements/certificates" },
];

// ── Teaching ──────────────────────────────────────────────────────────────────
export const TEACHING = {
  quote:    "My goal is not to fill a student's notebook — it is to ignite the curiosity that fills a career.",
  body:     "Across 18 years and three universities, my pedagogy centres on Project-Based Learning: students design, build, fail, and iterate on real engineering challenges. Technical mastery is built through wrestling with real problems, not passive absorption of theory.",
  subjects: ["Data Structures","Computer Networks","DBMS","AI/ML","Deep Learning","Computer Vision","Theory of Computation"],
  cta:      "/teaching",
  stats: [
    { icon: Users,         v: "60+", l: "UG Project Groups Guided" },
    { icon: GraduationCap, v: "10",  l: "M.E. Students Supervised" },
    { icon: BookOpen,      v: "18+", l: "Years in the Classroom"   },
    { icon: FileText,      v: "15",  l: "Int'l Publications"       },
  ],
};

// ── CTA ───────────────────────────────────────────────────────────────────────
export const CTA = {
  label:         "Open to Collaboration",
  heading:       "Let's Build Something",
  headingItalic: "Meaningful",
  body:          "Open to research collaborations, conference invitations, AI & ML consultancy, academic partnerships, and student mentorship in Computer Engineering.",
  btnPrimary:   { label: "Start a Conversation",    href: "/contact"                       },
  btnSecondary: { label: "sachintakmare@gmail.com", href: "mailto:sachintakmare@gmail.com" },
};