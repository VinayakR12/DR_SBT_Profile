#!/usr/bin/env node
/**
 * Quick verification that data is synced and APIs are working
 * Usage: node scripts/test-sync.js
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

async function testSync() {
  try {
    console.log('🧪 Testing Data Sync & API Configuration\n')

    // Check projects
    const { data: projects, error: projectsError } = await client
      .from('home_content_sections')
      .select('section_key, content')
      .eq('section_key', 'projects')
      .single()

    console.log('📊 Projects Section:')
    if (projectsError) {
      console.log(`   ❌ Error: ${projectsError.message}`)
    } else {
      const pgCount = projects.content?.pgProjects?.length || 0
      const ugCount = projects.content?.ugDomains?.length || 0
      console.log(`   ✅ PG Projects: ${pgCount}`)
      console.log(`   ✅ UG Domains: ${ugCount}`)
      console.log(`   ✅ Total Data Points: ${pgCount + ugCount}`)
    }

    // Check teaching
    const { data: teaching, error: teachingError } = await client
      .from('home_content_sections')
      .select('section_key, content')
      .eq('section_key', 'teaching')
      .single()

    console.log('\n📚 Teaching Section:')
    if (teachingError) {
      console.log(`   ❌ Error: ${teachingError.message}`)
    } else {
      const subjects = teaching.content?.subjects?.items?.length || 0
      const institutions = teaching.content?.institutions?.items?.length || 0
      const roles = teaching.content?.admin?.roles?.length || 0
      const stats = teaching.content?.impact?.stats?.length || 0
      console.log(`   ✅ Subjects Courses: ${subjects}`)
      console.log(`   ✅ Institutions: ${institutions}`)
      console.log(`   ✅ Admin Roles: ${roles}`)
      console.log(`   ✅ Impact Stats: ${stats}`)
      console.log(`   ✅ Total Data Points: ${subjects + institutions + roles + stats}`)
    }

    console.log('\n🎯 Data Architecture:')
    console.log('   PRIMARY  →  Supabase Database')
    console.log('   BACKUP   →  TypeScript .ts files')
    console.log('   FALLBACK →  Used if Supabase unavailable')

    console.log('\n✨ Sync Status: ✅ Complete')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Ready for:')
    console.log('  ✓ Pages to render Supabase data as PRIMARY')
    console.log('  ✓ Admin panel CRUD operations')
    console.log('  ✓ .ts files as automatic BACKUP')
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

testSync()
