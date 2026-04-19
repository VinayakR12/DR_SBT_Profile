import { Brain, Microscope, Globe, Shield, Cpu, Layers } from 'lucide-react'

export type PGProject = {
  id: string
  title: string
  student: string
  university: string
  year: string
  domain: string
  summary: string
  outcome: string
  tags: string[]
  color: string
  link?: string
  uploadUrl?: string
}

export type UGDomain = {
  id: string
  icon: any
  iconKey?: string
  domain: string
  color: string
  bg: string
  description: string
  totalGroups: number
  highlights: string[]
  technologies: string[]
}

// ── PG PROJECTS (sorted by year descending) ──
export const PG_PROJECTS: PGProject[] = [
  {
    id: 'pg-10',
    title: 'Smart Farming with YOLO: Crop and Weed Density Prediction',
    student: 'Research Collaboration',
    university: 'D. Y. Patil College of Engineering & Technology, Kolhapur',
    year: '2024–2025',
    domain: 'AI & Precision Agriculture',
    summary: 'Extended the PhD research to build a deployable field system using YOLO for real-time crop and weed density estimation. Integrates with drone imagery for large-scale farm monitoring.',
    outcome: 'Published in IJOEAR (Vol. 6, Issue 10, 2024). ISSN: 2454-1850.',
    tags: ['YOLO', 'Smart Farming', 'Drone Imagery', 'Real-Time AI'],
    color: '#1A6B48',
  },
  {
    id: 'pg-01',
    title: 'Precision Farming: CNN-Based Crop and Weed Classification System',
    student: 'Research Scholar (Ph.D. Level)',
    university: 'Pacific University, Udaipur',
    year: '2020–2024',
    domain: 'AI & Precision Agriculture',
    summary: 'Developed a full CNN-based pipeline for classifying crops and weed species from field images and estimating plant density using YOLO. The system enables targeted, eco-friendly herbicide deployment at scale.',
    outcome: 'Resulted in Ph.D. award (2024), 2 international journal publications, and 1 filed utility patent (Application No: 202421045939).',
    tags: ['CNN', 'YOLO', 'Precision Agriculture', 'Deep Learning', 'PhD'],
    color: '#1A6B48',
  },
  {
    id: 'pg-05',
    title: 'MetaCampus: Virtual Reality Platform for Online Education',
    student: 'M.E. Project Group',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2023–2024',
    domain: 'EdTech & Virtual Reality',
    summary: 'Built an immersive virtual classroom platform using metaverse technologies enabling interactive, real-time online education with spatial audio, virtual whiteboards, and student engagement tracking.',
    outcome: 'Published at IEEE INOCON 2024. Copyright registered (Diary No: 25004/2024-CO/SW).',
    tags: ['Virtual Reality', 'Online Education', 'Metaverse', 'IEEE'],
    color: '#5C3A8A',
  },
  {
    id: 'pg-06',
    title: 'Intelligent Malware Metamorphosis and Evasion Prevention System',
    student: 'M.E. Research Scholar',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2023–2024',
    domain: 'Cybersecurity & AI',
    summary: 'Designed an AI-based system that detects and prevents metamorphic malware by analyzing behavioural patterns, code transformations, and evasion techniques, outperforming signature-based methods.',
    outcome: 'Resulted in a filed utility patent (Application No: 202421069724, Published Oct 2024).',
    tags: ['Malware Detection', 'Cybersecurity', 'AI', 'Behavioural Analysis'],
    color: '#0D1F3C',
  },
  {
    id: 'pg-07',
    title: 'NFT Gaming on Blockchain: Dodging Turtis',
    student: 'M.E. Project Group',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2022–2023',
    domain: 'Blockchain & Game Development',
    summary: 'Developed a blockchain-integrated NFT-based game where in-game assets are tokenized as NFTs, enabling true digital ownership. Smart contracts manage game logic and asset transfers.',
    outcome: 'Published at IEEE WCONF 2023. ISBN: 979-8-3503-1120-4/23.',
    tags: ['NFT', 'Blockchain', 'Gaming', 'Smart Contracts', 'IEEE'],
    color: '#3A2A6A',
  },
  {
    id: 'pg-04',
    title: 'Sickle Cell Anemia Diagnosis Using Microscopic Image Analysis',
    student: 'M.E. Research Scholar',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2021–2022',
    domain: 'Medical Imaging & Deep Learning',
    summary: 'Developed an automated diagnostic system using deep learning to classify sickle cell anemia from microscopic blood smear images, enabling faster and more accessible screening in resource-limited settings.',
    outcome: 'Published in Neuroquantology (Vol. 20, Issue 17). E-ISSN: 1303-5150.',
    tags: ['Medical Imaging', 'Sickle Cell Anemia', 'Deep Learning', 'Healthcare AI'],
    color: '#7A1A1A',
  },
  {
    id: 'pg-08',
    title: 'Network Monitoring and System Diagnostic Suite',
    student: 'Parth Vora, Harvinder Singh, Royston Rodrigues, Lavleen Jain',
    university: 'A. P. Shah Institute of Technology, Thane (University of Mumbai)',
    year: '2021–2022',
    domain: 'Computer Networks & Systems',
    summary: 'Built a comprehensive network monitoring dashboard providing real-time diagnostics, anomaly detection, traffic analysis, and system health reporting for enterprise network infrastructure.',
    outcome: 'Published in IJRASET (Vol. 10, Issue IV, April 2022). ISSN: 2321-9653.',
    tags: ['Network Monitoring', 'System Diagnostics', 'Real-Time Analysis', 'Computer Networks'],
    color: '#2D5B8A',
  },
  {
    id: 'pg-02',
    title: 'Dynamic Analysis of Web Systems Using Model-Based Testing and Process Crawler',
    student: 'Mrs. Nayan Mulla',
    university: "Bharati Vidyapeeth's College of Engineering, Kolhapur (Shivaji University)",
    year: '2016–2017',
    domain: 'Software Engineering & Testing',
    summary: 'Designed a model-based testing framework with a process crawler model for dynamic web system analysis, improving test coverage and defect detection in complex web applications.',
    outcome: 'Published in IJECS (Vol. 6, Issue 6, 2017) and IJERT (Vol. 6, Issue 6, 2017). DOI: 10.18535/ijecs/v6i6.47.',
    tags: ['Model-Based Testing', 'Web Analysis', 'Process Crawler', 'Dynamic Testing'],
    color: '#1A3560',
  },
  {
    id: 'pg-03',
    title: 'Review and Analysis of K-means Clustering Algorithm Variations',
    student: 'Ms. Kavita Shiudkar',
    university: "Bharati Vidyapeeth's College of Engineering, Kolhapur (Shivaji University)",
    year: '2016–2017',
    domain: 'Machine Learning & Data Mining',
    summary: 'Comprehensive review and comparative analysis of existing K-means clustering methods, evaluating convergence behavior, initialization strategies, and performance across datasets.',
    outcome: 'Published in IRJET (Vol. 4, Issue 2, February 2017). e-ISSN: 2395-0056.',
    tags: ['K-means', 'Clustering', 'Machine Learning', 'Data Mining'],
    color: '#2D5B8A',
  },
  {
    id: 'pg-09',
    title: 'Voice-Based Watermarking Technique for Relational Databases',
    student: 'Research Collaboration',
    university: 'Parshavanath College of Engineering, Thane (University of Mumbai)',
    year: '2011–2012',
    domain: 'Data Security & Watermarking',
    summary: 'Proposed a novel watermarking technique for relational databases using voice signals as embedded watermarks. The detection algorithm works without access to the original data, making it robust against malicious attacks.',
    outcome: 'Published in International Journal of Scientific & Technology Research (Vol. 1, Issue 10, Nov 2012). ISSN: 2277-8616.',
    tags: ['Watermarking', 'Database Security', 'Voice Signal', 'Relational Database'],
    color: '#5C3A1A',
  },
]

// Sort PG projects by year (descending)
PG_PROJECTS.sort((a, b) => {
  const getStartYear = (yearStr: string) => parseInt(yearStr.split('–')[0])
  return getStartYear(b.year) - getStartYear(a.year)
})

// ── UG DOMAINS ──
export const UG_DOMAINS: UGDomain[] = [
  {
    id: 'ug-ai',
    icon: Brain,
    domain: 'Artificial Intelligence & Machine Learning',
    color: '#0D1F3C',
    bg: 'rgba(13,31,60,0.07)',
    description: 'Projects involving supervised/unsupervised learning, neural networks, NLP, and intelligent automation systems built using Python, TensorFlow, and PyTorch.',
    totalGroups: 18,
    highlights: [
      'Sentiment analysis for social media data',
      'Chatbot development using transformer models',
      'Fraud detection using anomaly detection',
      'Handwritten digit recognition systems',
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'NLP'],
  },
  {
    id: 'ug-cv',
    icon: Microscope,
    domain: 'Computer Vision & Image Processing',
    color: '#1A6B48',
    bg: 'rgba(26,107,72,0.07)',
    description: 'Image classification, object detection, face recognition, and medical image analysis projects leveraging CNN architectures and OpenCV.',
    totalGroups: 12,
    highlights: [
      'Face attendance system using OpenCV',
      'Plant disease detection from leaf images',
      'Real-time object detection for surveillance',
      'X-ray image classification for diagnostics',
    ],
    technologies: ['OpenCV', 'CNN', 'YOLO', 'ResNet', 'VGG', 'Python'],
  },
  {
    id: 'ug-web',
    icon: Globe,
    domain: 'Web & Mobile Application Development',
    color: '#2D5B8A',
    bg: 'rgba(45,91,138,0.07)',
    description: 'Full-stack web apps, mobile applications, and cloud-integrated platforms built using modern frameworks for real-world problem domains.',
    totalGroups: 14,
    highlights: [
      'E-commerce platforms with payment gateways',
      'Hospital management information systems',
      'Student examination portals',
      'Job portal with ML-based matching',
    ],
    technologies: ['React', 'Node.js', 'Next.js', 'Flutter', 'Firebase', 'MongoDB'],
  },
  {
    id: 'ug-sec',
    icon: Shield,
    domain: 'Cybersecurity & Network Systems',
    color: '#5C3A8A',
    bg: 'rgba(92,58,138,0.07)',
    description: 'Network security tools, intrusion detection systems, encryption implementations, and cybersecurity analysis frameworks.',
    totalGroups: 8,
    highlights: [
      'Network intrusion detection using ML',
      'Password strength analyser and manager',
      'Secure file transfer with AES encryption',
      'Phishing website detection system',
    ],
    technologies: ['Python', 'Wireshark', 'Nmap', 'AES', 'RSA', 'Firewall'],
  },
  {
    id: 'ug-iot',
    icon: Cpu,
    domain: 'IoT & Embedded Systems',
    color: '#B8870A',
    bg: 'rgba(184,135,10,0.07)',
    description: 'Smart sensors, IoT dashboards, Arduino/Raspberry Pi projects, and real-time monitoring systems for agriculture, healthcare, and smart homes.',
    totalGroups: 5,
    highlights: [
      'Smart irrigation system with soil sensors',
      'Home automation using Raspberry Pi',
      'Air quality monitoring dashboard',
      'Patient health monitoring wearable',
    ],
    technologies: ['Arduino', 'Raspberry Pi', 'MQTT', 'Node-RED', 'AWS IoT', 'Python'],
  },
  {
    id: 'ug-data',
    icon: Layers,
    domain: 'Data Science & Analytics',
    color: '#7A1A1A',
    bg: 'rgba(122,26,26,0.07)',
    description: 'Big data analysis, data visualization, business intelligence dashboards, and predictive analytics projects using Python and BI tools.',
    totalGroups: 3,
    highlights: [
      'Student performance prediction system',
      'COVID-19 data analysis and visualization',
      'Stock market trend prediction',
    ],
    technologies: ['Python', 'Pandas', 'Matplotlib', 'Tableau', 'Power BI', 'SQL'],
  },
]

// Sort UG domains by totalGroups (descending)
UG_DOMAINS.sort((a, b) => b.totalGroups - a.totalGroups)

// ── DYNAMIC KPIs ──
export const PROJECTS_KPIS = {
  totalPGProjects: PG_PROJECTS.length,
  totalUGGroups: UG_DOMAINS.reduce((sum, domain) => sum + domain.totalGroups, 0),
  totalDomains: UG_DOMAINS.length,
  publishedStudentResearch: PG_PROJECTS.filter(p => 
    p.outcome.includes('Published') || p.outcome.includes('IEEE')
  ).length,
  uniqueDomains: [...new Set(PG_PROJECTS.map(p => p.domain))].length,
}

// ── GET UNIQUE YEARS FOR PG PROJECTS ──
export const getPGProjectYears = () => {
  const years = PG_PROJECTS.map(p => parseInt(p.year.split('–')[0]))
  return [...new Set(years)].sort((a, b) => b - a)
}

// ── GROUP PG PROJECTS BY YEAR ──
export const getPGProjectsByYear = () => {
  const grouped: Record<string, PGProject[]> = {}
  PG_PROJECTS.forEach(project => {
    const year = project.year.split('–')[0]
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(project)
  })
  return grouped
}

// ── MENTORSHIP STEPS ──
export const MENTORSHIP_STEPS = [
  { step: '01', title: 'Problem Identification', desc: 'Students identify real-world gaps with literature support and clear problem statements.' },
  { step: '02', title: 'Research Methodology', desc: 'Guided design of experiments, dataset collection, and architectural decisions.' },
  { step: '03', title: 'Build & Iterate', desc: 'Hands-on development with regular review cycles and iterative refinement.' },
  { step: '04', title: 'Document & Publish', desc: 'Quality work is submitted to journals and conferences — real academic output.' },
]

// ── FILTER TABS ──
export const FILTER_TABS = ['All', 'PG Dissertations', 'UG Projects'] as const
export type FilterTab = typeof FILTER_TABS[number]