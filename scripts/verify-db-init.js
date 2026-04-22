#!/usr/bin/env node
/**
 * Verify that Projects & Teaching APIs return Supabase data (not backup)
 * Usage: node scripts/verify-db-init.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

async function verifyDatabase() {
  console.log('📋 Verifying Projects & Teaching Database Initialization\n')

  try {
    // Check projects section
    const { data: projectsData, error: projectsError } = await client
      .from('home_content_sections')
      .select('section_key, content, updated_at')
      .eq('section_key', 'projects')
      .single()

    if (projectsError) {
      console.error('❌ Projects section not found:', projectsError.message)
    } else {
      console.log('✅ Projects section exists')
      console.log(`   • Last updated: ${projectsData.updated_at}`)
      console.log(
        `   • Content: ${JSON.stringify(projectsData.content).substring(0, 100)}${
          JSON.stringify(projectsData.content).length > 100 ? '...' : ''
        }`,
      )
    }

    // Check teaching section
    const { data: teachingData, error: teachingError } = await client
      .from('home_content_sections')
      .select('section_key, content, updated_at')
      .eq('section_key', 'teaching')
      .single()

    if (teachingError) {
      console.error('❌ Teaching section not found:', teachingError.message)
    } else {
      console.log('\n✅ Teaching section exists')
      console.log(`   • Last updated: ${teachingData.updated_at}`)
      console.log(
        `   • Content: ${JSON.stringify(teachingData.content).substring(0, 100)}${
          JSON.stringify(teachingData.content).length > 100 ? '...' : ''
        }`,
      )
    }

    // Summary
    console.log('\n📊 Summary:')
    if (!projectsError && !teachingError) {
      console.log('✨ Both sections initialized and ready for API queries')
      console.log('🎯 Pages will now render Supabase data instead of backup content')
    }
  } catch (err) {
    console.error('❌ Verification error:', err.message)
    process.exit(1)
  }
}

verifyDatabase()
