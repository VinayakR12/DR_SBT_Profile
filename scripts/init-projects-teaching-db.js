#!/usr/bin/env node
/**
 * Initialize Projects & Teaching sections in Supabase home_content_sections table
 * Usage: node scripts/init-projects-teaching-db.js
 */

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

async function initializeSections() {
  try {
    console.log('📡 Initializing Projects & Teaching sections in Supabase...')

    // Initialize projects section
    const { error: projectsError } = await client.from('home_content_sections').upsert(
      {
        section_key: 'projects',
        content: {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (projectsError) {
      console.error('❌ Error initializing projects section:', projectsError.message)
      process.exit(1)
    }

    console.log('✅ Projects section initialized')

    // Initialize teaching section
    const { error: teachingError } = await client.from('home_content_sections').upsert(
      {
        section_key: 'teaching',
        content: {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' },
    )

    if (teachingError) {
      console.error('❌ Error initializing teaching section:', teachingError.message)
      process.exit(1)
    }

    console.log('✅ Teaching section initialized')

    // Verify
    const { data, error: verifyError } = await client
      .from('home_content_sections')
      .select('section_key, updated_at')
      .in('section_key', ['projects', 'teaching'])

    if (verifyError) {
      console.error('❌ Error verifying sections:', verifyError.message)
      process.exit(1)
    }

    console.log('\n📊 Verification:')
    data.forEach((row) => {
      console.log(`  • ${row.section_key}: updated at ${row.updated_at}`)
    })

    console.log('\n✨ All sections initialized successfully!')
    console.log('🔄 The app will now fetch Projects & Teaching from Supabase instead of backup.')
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

initializeSections()
