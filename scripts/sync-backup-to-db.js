#!/usr/bin/env node
/**
 * Direct sync of .ts backup data to Supabase
 * Loads data from source and saves to database
 * Usage: npm run sync:db
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
  process.exit(1)
}

const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

async function syncDataToDB() {
  try {
    console.log('📡 Loading backup data from .ts files and syncing to database...\n')

    // ────────────────────────────────────────────────────────────
    // PROJECTS DATA (hardcoded from Projectdata.ts)
    // ────────────────────────────────────────────────────────────
    const PROJECTS_DATA = {
      pgProjects: [
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
          link: '',
          uploadUrl: '',
        },
        {
          id: 'pg-01',
          title: 'Precision Farming: CNN-Based Crop and Weed Classification System',
          student: 'Research Scholar (Ph.D. Level)',
          university: 'Pacific University, Udaipur',
          year: '2020–2024',
          domain: 'AI & Precision Agriculture',
          summary: 'Developed a CNN architecture for classifying crops vs. weeds in precision farming. Used YOLOv3 and ResNet variants. Dataset: 12,000+ annotated field images across 5 crop types.',
          outcome: 'Pending publication in IEEE Transactions on Agricultural Engineering. Patent filing in progress.',
          tags: ['CNN', 'Precision Agriculture', 'YOLO', 'Field Robotics'],
          color: '#0D1F3C',
          link: 'https://github.com/example',
          uploadUrl: '',
        },
      ],
      ugDomains: [
        {
          id: 'ug-ai',
          iconKey: 'brain',
          domain: 'AI & Machine Learning',
          color: '#1A6B48',
          bg: 'rgba(26,107,72,0.07)',
          description: 'Projects applying neural networks, computer vision, and ML algorithms to real-world problems.',
          totalGroups: 12,
          highlights: ['CNN for Image Classification', 'NLP Chatbots', 'Recommendation Systems'],
          technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
        },
        {
          id: 'ug-cv',
          iconKey: 'microscope',
          domain: 'Computer Vision & Image Processing',
          color: '#0D1F3C',
          bg: 'rgba(13,31,60,0.07)',
          description: 'Undergraduate projects focused on image/video processing, object detection, and visual analytics.',
          totalGroups: 8,
          highlights: ['Object Detection', 'Face Recognition', 'Medical Imaging'],
          technologies: ['OpenCV', 'Python', 'TensorFlow'],
        },
        {
          id: 'ug-web',
          iconKey: 'globe',
          domain: 'Web & Mobile Development',
          color: '#0D5B7A',
          bg: 'rgba(13,91,122,0.07)',
          description: 'Full-stack web applications, mobile apps, and real-time collaborative platforms.',
          totalGroups: 10,
          highlights: ['MERN Stack', 'Flutter Apps', 'Real-time Chat'],
          technologies: ['React', 'Node.js', 'Flutter', 'Firebase'],
        },
        {
          id: 'ug-sec',
          iconKey: 'shield',
          domain: 'Cybersecurity & Cryptography',
          color: '#5C3A8A',
          bg: 'rgba(92,58,138,0.07)',
          description: 'Network security, cryptographic systems, penetration testing, and vulnerability assessment.',
          totalGroups: 6,
          highlights: ['Penetration Testing', 'Encryption Algorithms', 'Network Analysis'],
          technologies: ['Kali Linux', 'Python', 'Wireshark'],
        },
        {
          id: 'ug-iot',
          iconKey: 'cpu',
          domain: 'IoT & Embedded Systems',
          color: '#7A5500',
          bg: 'rgba(122,85,0,0.07)',
          description: 'Arduino, Raspberry Pi, sensor networks, and IoT applications for smart systems.',
          totalGroups: 7,
          highlights: ['Smart Home Systems', 'Environmental Monitoring', 'Drone Control'],
          technologies: ['Arduino', 'Raspberry Pi', 'C/C++', 'Python'],
        },
        {
          id: 'ug-data',
          iconKey: 'layers',
          domain: 'Data Science & Big Data',
          color: '#1A3560',
          bg: 'rgba(26,53,96,0.07)',
          description: 'Data analytics, visualization, and insights from large datasets using statistical and ML techniques.',
          totalGroups: 9,
          highlights: ['Data Analytics', 'Tableau Dashboards', 'Predictive Modeling'],
          technologies: ['Python', 'R', 'Pandas', 'Power BI'],
        },
      ],
    }

    // ────────────────────────────────────────────────────────────
    // TEACHING DATA (hardcoded from Teachingdata.ts)
    // ────────────────────────────────────────────────────────────
    const TEACHING_DATA = {
      hero: {
        kicker: 'Teaching Portfolio',
        titleLead: '18 Years of',
        titleEmphasis: 'Purposeful Teaching',
        description: 'UGC-approved teaching across four institutions, two universities spanning foundational Computer Science to advanced AI and Machine Learning. Every classroom shaped by curiosity, rigour, and real-world relevance.',
        quote: 'The best engineers I have produced are not those who memorised the most — they are those who learned to ask the right questions and never stopped building.',
        quoteAuthor: 'Dr. Sachin B. Takmare',
        stats: [
          { n: '18', l: 'Years', s: 'of Teaching' },
          { n: '4', l: 'Institutions', s: 'Taught' },
          { n: '2000+', l: 'Students', s: 'Mentored' },
          { n: '15+', l: 'Courses', s: 'Designed' },
        ],
      },
      identity: {
        kicker: 'Teaching Identity',
        titleLead: 'Professor, Researcher,',
        titleEmphasis: 'Practitioner',
        paragraph1: 'My teaching is inseparable from my research. When I teach CNN architectures, I draw from my own Ph.D. work on crop classification. When I lecture on network security, I reference the malware evasion patent my students and I developed together. This integration of theory, practice, and active research is what distinguishes my classroom.',
        paragraph2: 'Over 18 years across four institutions and two universities, I have taught foundational subjects like Data Structures and Computer Networks, and advanced electives including Deep Learning, Computer Vision, and Research Methodology. At every level, the goal remains the same: produce engineers who think critically and build confidently.',
        credentials: ['Ph.D. in Computer Science', 'M.Tech in Computer Networks', 'B.Tech in Information Technology', '18+ Years Teaching Experience'],
      },
      pedagogy: [
        { iconKey: 'target', title: 'Problem-Based Learning', desc: 'Real-world problems drive the curriculum, not textbooks.' },
        { iconKey: 'lightbulb', title: 'Active Engagement', desc: 'Coding in class, lab projects, group discussions—passive learning is avoided.' },
        { iconKey: 'trend', title: 'Research Integration', desc: 'Share ongoing PhD and funded research; involve students as collaborators.' },
        { iconKey: 'bookmark', title: 'Industry Exposure', desc: 'Guest lectures by alumni, internship prep, real-world case studies.' },
      ],
      subjects: {
        kicker: 'Course Offerings',
        titleLead: 'Subjects I',
        titleEmphasis: 'Teach & Love',
        items: [
          { iconKey: 'layers', name: 'Data Structures & Algorithms', cat: 'Core CS', color: '#0D1F3C', level: ['UG'] },
          { iconKey: 'database', name: 'Database Management Systems', cat: 'Core CS', color: '#1A3560', level: ['UG'] },
          { iconKey: 'network', name: 'Computer Networks', cat: 'Core CS', color: '#0D1F3C', level: ['UG', 'PG'] },
          { iconKey: 'brain', name: 'Artificial Intelligence', cat: 'AI & ML', color: '#1A6B48', level: ['UG', 'PG'] },
          { iconKey: 'flask', name: 'Machine Learning', cat: 'AI & ML', color: '#1A6B48', level: ['UG', 'PG'] },
          { iconKey: 'brain', name: 'Deep Learning', cat: 'AI & ML', color: '#1A5038', level: ['PG'] },
          { iconKey: 'code2', name: 'Software Engineering', cat: 'Software', color: '#B8870A', level: ['UG', 'PG'] },
          { iconKey: 'shield', name: 'Cybersecurity & Ethical Hacking', cat: 'Security', color: '#5C3A8A', level: ['UG', 'PG'] },
        ],
      },
      institutions: {
        kicker: '18-Year Journey',
        titleLead: 'Experience at Every',
        titleEmphasis: 'Institution',
        items: [
          {
            id: 'inst-1',
            period: '2023 – Present',
            role: 'Assistant Professor (on contract)',
            org: 'D. Y. Patil College of Engineering & Technology',
            city: 'Kolhapur',
            univ: 'Shivaji University',
            color: '#1A6B48',
            current: true,
            roles: ['B.Tech CS Faculty', 'Research Guide'],
            highlight: 'Teaching Core CS and AI/ML courses; guiding M.E. dissertations with focus on precision agriculture and IoT.',
            resourceLink: '',
            documentUrl: '',
          },
          {
            id: 'inst-2',
            period: '2020 – 2023',
            role: 'Assistant Professor',
            org: 'Pacific University',
            city: 'Udaipur',
            univ: 'Pacific University',
            color: '#0D5B7A',
            current: false,
            roles: ['B.Tech & M.Tech CS Faculty', 'PhD Research Guide'],
            highlight: 'Core CS and Advanced AI courses; supervised 5 Ph.D. candidates on precision farming and computer vision.',
            resourceLink: '',
            documentUrl: '',
          },
          {
            id: 'inst-3',
            period: '2012 – 2020',
            role: 'Lecturer / Assistant Professor',
            org: 'Institute of Engineering & Management',
            city: 'Pune',
            univ: 'Pune University',
            color: '#5C3A8A',
            current: false,
            roles: ['B.Tech & M.Tech Faculty', 'Research Lead'],
            highlight: 'Designed curriculum for AI, Machine Learning, and Network Security. Pioneered research lab for student projects.',
            resourceLink: '',
            documentUrl: '',
          },
        ],
      },
      admin: {
        kicker: 'Leadership & Administration',
        titleLead: 'Academic',
        titleEmphasis: 'Roles & Responsibilities',
        roles: [
          { iconKey: 'target', color: '#1A6B48', title: 'Research Coordinator', desc: 'Lead funded research projects in precision agriculture and AI.' , inst: 'D. Y. Patil College' },
          { iconKey: 'users', color: '#0D5B7A', title: 'Placement Coordinator', desc: 'Liaise between industry and students for internships and placements.', inst: 'Pacific University' },
          { iconKey: 'award', color: '#5C3A8A', title: 'Faculty Mentor', desc: 'Guide junior faculty in research publication and grant writing.', inst: 'Institute of Engineering' },
        ],
      },
      impact: {
        kicker: 'Student Impact',
        titleLead: 'Numbers That',
        titleEmphasis: 'Speak',
        stats: [
          { iconKey: 'graduation', n: '2000+', l: 'Students', s: 'Across Institutions' },
          { iconKey: 'target', n: '85%', l: 'Placement', s: 'Success Rate' },
          { iconKey: 'award', n: '25+', l: 'Research', s: 'Publications (Co-Author)' },
          { iconKey: 'star', n: '4.8/5', l: 'Student', s: 'Feedback (Avg.)' },
        ],
      },
      cta: {
        titleLead: 'Looking for a',
        titleEmphasis: 'Research Guide',
        description: 'I am open to supervising M.E. / Ph.D. research, co-authoring publications, and speaking at faculty development programmes.',
        primaryLabel: 'Get In Touch',
        primaryHref: '/contact',
        secondaryLabel: 'Publications',
        secondaryHref: '/research',
      },
    }

    console.log('📊 Data Summary:')
    console.log(`   Projects:`)
    console.log(`     ✓ PG Projects: ${PROJECTS_DATA.pgProjects.length} items`)
    console.log(`     ✓ UG Domains: ${PROJECTS_DATA.ugDomains.length} items`)
    console.log(`   Teaching:`)
    console.log(`     ✓ Hero, Identity, Pedagogy sections`)
    console.log(`     ✓ Subjects: ${TEACHING_DATA.subjects.items.length} courses`)
    console.log(`     ✓ Institutions: ${TEACHING_DATA.institutions.items.length} entries`)
    console.log(`     ✓ Admin roles: ${TEACHING_DATA.admin.roles.length} entries`)
    console.log(`     ✓ Impact stats: ${TEACHING_DATA.impact.stats.length} metrics`)

    console.log('\n💾 Saving to Supabase...\n')

    // Save projects
    const { error: projectsError } = await client.from('home_content_sections').upsert(
      {
        section_key: 'projects',
        content: PROJECTS_DATA,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (projectsError) {
      console.error('❌ Error saving projects:', projectsError.message)
      process.exit(1)
    }

    console.log('✅ Projects data synced to Supabase')

    // Save teaching
    const { error: teachingError } = await client.from('home_content_sections').upsert(
      {
        section_key: 'teaching',
        content: TEACHING_DATA,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (teachingError) {
      console.error('❌ Error saving teaching:', teachingError.message)
      process.exit(1)
    }

    console.log('✅ Teaching data synced to Supabase')

    // Verify
    console.log('\n🔍 Verification:')
    const { data: verifyData, error: verifyError } = await client
      .from('home_content_sections')
      .select('section_key, updated_at')
      .in('section_key', ['projects', 'teaching'])

    if (verifyError) {
      console.error('❌ Error verifying:', verifyError.message)
      process.exit(1)
    }

    verifyData.forEach((row) => {
      console.log(`  ✅ ${row.section_key}: ${row.updated_at}`)
    })

    console.log('\n✨ Sync Complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📌 Data Flow Architecture:')
    console.log('   PRIMARY  → Supabase Database (with real content)')
    console.log('   BACKUP   → TypeScript .ts files (fallback)')
    console.log('   UI       → Admin panel for editing')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎯 Pages will now:')
    console.log('   1. Load from Supabase (PRIMARY)')
    console.log('   2. Use .ts files as fallback if DB unavailable')
    console.log('   3. Allow admins to edit and save changes')
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

syncDataToDB()
