#!/usr/bin/env node
/**
 * Sync .ts backup file data into Supabase database
 * - Loads STATIC_PROJECTS_CONTENT from lib/projectsContent.ts
 * - Loads STATIC_TEACHING_CONTENT from lib/teachingContent.ts
 * - Saves to database as PRIMARY data
 * - .ts files remain as BACKUP fallback
 * 
 * Usage: node scripts/sync-ts-data-to-db.js
 */

const path = require('path')
const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in .env.local')
  process.exit(1)
}

const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

async function syncDataToDatabase() {
  try {
    console.log('📡 Syncing .ts backup data into Supabase database...\n')

    // Try to load from compiled Next.js build first (most reliable)
    let projectsData = null
    let teachingData = null

    // Attempt 1: Load from .next build output
    try {
      const projectsPath = path.resolve('.next/server/lib/projectsContent.js')
      const teachingPath = path.resolve('.next/server/lib/teachingContent.js')

      if (fs.existsSync(projectsPath)) {
        delete require.cache[require.resolve(projectsPath)]
        const projectsModule = require(projectsPath)
        projectsData = projectsModule.STATIC_PROJECTS_CONTENT
        console.log('✅ Loaded projects from compiled .next build')
      }

      if (fs.existsSync(teachingPath)) {
        delete require.cache[require.resolve(teachingPath)]
        const teachingModule = require(teachingPath)
        teachingData = teachingModule.STATIC_TEACHING_CONTENT
        console.log('✅ Loaded teaching from compiled .next build')
      }
    } catch (err) {
      console.warn('⚠️  Could not load from .next build, trying source...')
    }

    // Attempt 2: Load directly from source (requires TypeScript)
    if (!projectsData || !teachingData) {
      try {
        require('@swc/core') // Check if SWC is available
        delete require.cache[require.resolve('../lib/projectsContent.ts')]
        delete require.cache[require.resolve('../lib/teachingContent.ts')]
        const projectsModule = require('../lib/projectsContent.ts')
        const teachingModule = require('../lib/teachingContent.ts')
        projectsData = projectsModule.STATIC_PROJECTS_CONTENT
        teachingData = teachingModule.STATIC_TEACHING_CONTENT
        console.log('✅ Loaded data from TypeScript source')
      } catch (err) {
        // Fall back to manual data loading below
      }
    }

    // Attempt 3: If still no data, create a bootstrap version
    if (!projectsData) {
      console.log('⚠️  Building projects data from Database...')
      // Query current data from DB to use as template
      const { data: currentProjects } = await client
        .from('home_content_sections')
        .select('content')
        .eq('section_key', 'projects')
        .single()

      if (currentProjects?.content && Object.keys(currentProjects.content).length > 0) {
        projectsData = currentProjects.content
        console.log('✅ Using existing projects data from database')
      } else {
        console.warn('⚠️  No projects data found, using minimal structure')
        projectsData = {
          pgProjects: [],
          ugDomains: [],
        }
      }
    }

    if (!teachingData) {
      console.log('⚠️  Building teaching data from Database...')
      // Query current data from DB
      const { data: currentTeaching } = await client
        .from('home_content_sections')
        .select('content')
        .eq('section_key', 'teaching')
        .single()

      if (currentTeaching?.content && Object.keys(currentTeaching.content).length > 0) {
        teachingData = currentTeaching.content
        console.log('✅ Using existing teaching data from database')
      } else {
        console.warn('⚠️  No teaching data found, using minimal structure')
        teachingData = {
          hero: { kicker: '', titleLead: '', titleEmphasis: '', description: '', quote: '', quoteAuthor: '', stats: [] },
          identity: { kicker: '', titleLead: '', titleEmphasis: '', paragraph1: '', paragraph2: '', credentials: [] },
          pedagogy: [],
          subjects: { kicker: '', titleLead: '', titleEmphasis: '', items: [] },
          institutions: { kicker: '', titleLead: '', titleEmphasis: '', items: [] },
          admin: { kicker: '', titleLead: '', titleEmphasis: '', roles: [] },
          impact: { kicker: '', titleLead: '', titleEmphasis: '', stats: [] },
          cta: { titleLead: '', titleEmphasis: '', description: '', primaryLabel: '', primaryHref: '', secondaryLabel: '', secondaryHref: '' },
        }
      }
    }

    // Save to database
    console.log('\n📊 Data Summary:')
    console.log(`   Projects:`)
    if (projectsData.pgProjects) console.log(`     - pgProjects: ${projectsData.pgProjects.length} items`)
    if (projectsData.ugDomains) console.log(`     - ugDomains: ${projectsData.ugDomains.length} items`)

    console.log(`   Teaching:`)
    console.log(`     - hero, identity, pedagogy, subjects, institutions, admin, impact, cta`)
    if (teachingData.subjects?.items) console.log(`     - subjects items: ${teachingData.subjects.items.length}`)
    if (teachingData.institutions?.items) console.log(`     - institutions items: ${teachingData.institutions.items.length}`)

    console.log('\n💾 Saving to Supabase...\n')

    // Save projects
    const { error: projectsError } = await client.from('home_content_sections').upsert(
      {
        section_key: 'projects',
        content: projectsData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (projectsError) {
      console.error('❌ Error saving projects:', projectsError.message)
      process.exit(1)
    }

    console.log('✅ Projects data synced to database')

    // Save teaching
    const { error: teachingError } = await client.from('home_content_sections').upsert(
      {
        section_key: 'teaching',
        content: teachingData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (teachingError) {
      console.error('❌ Error saving teaching:', teachingError.message)
      process.exit(1)
    }

    console.log('✅ Teaching data synced to database')

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
      console.log(`  ✅ ${row.section_key}: Updated at ${row.updated_at}`)
    })

    console.log('\n✨ Data sync complete!')
    console.log('🎯 Database is now PRIMARY data source')
    console.log('📝 .ts backup files remain as fallback')
    console.log('🔄 Next.js app will:')
    console.log('   1. Load from Supabase database (PRIMARY)')
    console.log('   2. Fall back to .ts files if DB unavailable (BACKUP)')
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

syncDataToDatabase()
