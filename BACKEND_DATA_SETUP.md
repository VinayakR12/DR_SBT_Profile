# Complete Backend Data Setup Guide

## ✅ What's Been Done

Your app now has a **primary ↔ backup architecture**:

```
┌─────────────────────────────────────────────────────────┐
│              Data Flow Architecture                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  PRIMARY (Database)                                       │
│  └─ Supabase home_content_sections table                 │
│     ├─ projects: { pgProjects: 2, ugDomains: 6 }         │
│     └─ teaching: { hero, identity, pedagogy, ... }       │
│                          ↑                                │
│                     (synced data)                         │
│                          ↓                                │
│  PAGES & ADMIN                                            │
│  └─ Load from Supabase (PRIMARY)                          │
│     If unavailable → Fall back to .ts files (BACKUP)     │
│                                                           │
│  BACKUP (.ts files)                                       │
│  ├─ app/Database/Projectdata.ts                          │
│  ├─ app/Database/Teachingdata.ts                         │
│  └─ lib/projectsContent.ts                               │
│  └─ lib/teachingContent.ts                               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Current Data State

### Projects Section ✅
- **2 PG Projects** (dissertations/research projects)
  - Smart Farming with YOLO
  - Precision Farming CNN System
- **6 UG Domains** (undergraduate specializations)
  - AI & Machine Learning
  - Computer Vision
  - Web & Mobile Development
  - Cybersecurity
  - IoT & Embedded Systems
  - Data Science & Big Data

### Teaching Section ✅
- **Hero** (landing section with stats)
- **Identity** (teaching profile and credentials)
- **Pedagogy** (4 teaching principles)
- **Subjects** (8 courses taught across UG/PG)
- **Institutions** (3 institutions with timelines)
- **Admin** (3 leadership roles)
- **Impact** (4 student success metrics)
- **CTA** (call-to-action section)

---

## 🚀 How It Works

### 1️⃣ **Page Load Flow**
```
User visits /projects or /teaching
        ↓
Page calls API (/api/projects-content, /api/teaching-content)
        ↓
API queries Supabase database
        ↓
IF data found → return { source: 'supabase', content: {...} }
IF not found  → return { source: 'backup', content: STATIC_CONTENT }
        ↓
Page renders content with source indicator
```

### 2️⃣ **Admin Edit Flow**
```
Admin accesses /admin → authenticates
        ↓
Clicks on Projects/Teaching tab
        ↓
Components load current data from API
        ↓
Admin edits fields (projects, domains, teaching sections)
        ↓
Clicks "Save" button
        ↓
PUT/POST request to API with changes
        ↓
API updates Supabase database
        ↓
Page refreshes and displays changes
```

### 3️⃣ **Fallback Flow** (If Supabase unavailable)
```
Database query fails
        ↓
API returns backup .ts file content
        ↓
Page displays data with "Backup content active" notice
        ↓
System continues working with static data
```

---

## 🔄 Database Synchronization Scripts

You now have 4 utility scripts:

### `npm run sync:db` (or `node scripts/sync-backup-to-db.js`)
**Syncs all .ts backup data into Supabase**
- Loads data from backup files
- Saves to `home_content_sections` table
- Updates timestamps
- Verifies sync completion

Use when:
- Initial setup
- Data migration
- Resetting to known good state

```bash
npm run sync:db
```

### `npm run init:db` (or `node scripts/init-projects-teaching-db.js`)
**Initializes empty database rows**
- Creates `projects` row if missing
- Creates `teaching` row if missing
- Minimal setup (empty structures)

Use when:
- First time setting up database
- Creating missing rows only

```bash
npm run init:db
```

### `npm run verify:db` (or `node scripts/verify-db-init.js`)
**Checks database initialization**
- Verifies rows exist
- Shows timestamps
- Confirms structure

Use when:
- Debugging connection issues
- Checking sync status
- Verifying setup

```bash
npm run verify:db
```

### `node scripts/test-sync.js`
**Tests complete sync state**
- Shows data counts
- Verifies all sections
- Displays architecture

Use when:
- Verifying successful sync
- Checking data completeness
- Before deploying

---

## 📝 Workflow Examples

### Adding a New PG Project

**Via Admin Panel:**
1. Login to `/admin`
2. Go to "Projects" tab
3. Click "+" to add project
4. Fill fields:
   - Title: Project name
   - Student: Student/team name
   - University: Institution
   - Year: Date range
   - Domain: Category
   - Summary: Overview
   - Outcome: Results
   - Tags: Keywords
5. Click "Save PG Projects"
6. Changes saved to Supabase ✅

**Via API:**
```bash
curl -X PUT http://localhost:3000/api/projects-content \
  -H "Content-Type: application/json" \
  -d '{
    "sectionKey": "pgProjects",
    "content": {
      "pgProjects": [
        {
          "id": "pg-new-001",
          "title": "New Project",
          "student": "Student Name",
          ...
        }
      ]
    }
  }'
```

---

### Editing Teaching Courses

**Via Admin Panel:**
1. Login to `/admin`
2. Go to "Teaching" tab
3. Expand "Subjects" section
4. Click "+" to add course or edit existing
5. Change fields (name, category, level, color)
6. Click "Save"
7. Changes saved to Supabase ✅

---

### Resetting to Default Data

If you need to restore from backup:

**Option 1: Via Script**
```bash
npm run sync:db
# This overwrites database with current backup files
```

**Option 2: Via Admin UI**
1. Go to `/admin` → Projects/Teaching tab
2. Click "Restore Backup" button (if available)
3. Confirms overwrite with static data

**Option 3: Via API**
```bash
curl -X DELETE http://localhost:3000/api/projects-content
# Deletes Supabase row, pages show backup
```

---

## 🔐 Data Persistence

### What Gets Saved
✅ Content edited via admin panel → Supabase only  
✅ Section-wise updates → All other sections preserved  
✅ File uploads → Supabase Storage + database URL  

### What's Backup
📝 All .ts files remain unchanged  
📝 Can be manually updated if needed  
📝 Act as fallback when database unavailable  

---

## 🧪 Testing the Setup

### Test 1: Verify Database Has Data
```bash
node scripts/test-sync.js
```
Expected output:
```
✅ PG Projects: 2
✅ UG Domains: 6
✅ Subjects Courses: 8
✅ Institutions: 3
```

### Test 2: Check API Returns Supabase Data
```bash
curl http://localhost:3000/api/projects-content
# Look for: "source": "supabase"

curl http://localhost:3000/api/teaching-content
# Look for: "source": "supabase"
```

### Test 3: Verify Fallback Works
```bash
# Delete database row
curl -X DELETE http://localhost:3000/api/projects-content

# Check API now returns backup
curl http://localhost:3000/api/projects-content
# Look for: "source": "backup"

# Restore data
npm run sync:db
```

### Test 4: Test Admin CRUD
1. Go to `/admin` → Projects tab
2. Edit a project
3. Click "Save"
4. Go to `/projects` page
5. Verify changes appear

---

## 🎯 Production Checklist

Before deploying:

- [ ] Run `npm run sync:db` to ensure data is in database
- [ ] Run `npm run verify:db` to confirm initialization
- [ ] Test `/projects` and `/teaching` pages show content
- [ ] Test admin panel CRUD operations
- [ ] Check API endpoints return correct source ('supabase')
- [ ] Verify .env.local has all Supabase keys
- [ ] Test fallback by temporarily disabling Supabase connection
- [ ] Check build completes: `npm run build`

---

## 📋 File Reference

### Data Files
- **Backup Data**: `app/Database/Projectdata.ts`, `app/Database/Teachingdata.ts`
- **Content Handlers**: `lib/projectsContent.ts`, `lib/teachingContent.ts`
- **Database**: `home_content_sections` table in Supabase

### API Routes
- **Projects**: `/api/projects-content` (GET/PUT/POST/DELETE)
- **Teaching**: `/api/teaching-content` (GET/PUT/POST/DELETE)

### Admin Components
- **Projects Editor**: `components/admin/ProjectsEditor.tsx`
- **Teaching Editor**: `components/admin/TeachingEditor.tsx`

### Utility Scripts
- **Sync Data**: `scripts/sync-backup-to-db.js`
- **Initialize DB**: `scripts/init-projects-teaching-db.js`
- **Verify State**: `scripts/verify-db-init.js`
- **Test Sync**: `scripts/test-sync.js`

---

## 💡 Key Concepts

### Primary vs Backup
- **Primary**: Live Supabase database (fast, editable, real-time)
- **Backup**: Static .ts files (fallback, reliable, reference)

### Source Detection
- API checks if Supabase row exists and has content
- Returns `source: 'supabase'` if data found
- Returns `source: 'backup'` if database unavailable

### Data Merging
- Admin edits single section (e.g., pgProjects)
- API reads full current state from database
- Merges edited section with others
- Saves complete object back to database
- Prevents data loss on partial updates

### Fallback Behavior
- If Supabase connection fails → Pages show backup content
- Pages notify user with "Backup content active" banner
- System remains functional during outages
- No data loss; just displays static data

---

## 🚨 Troubleshooting

### Pages Show "Backup content active"
1. Check Supabase connection: `npm run verify:db`
2. Verify data in database: `node scripts/test-sync.js`
3. Check API response: `curl http://localhost:3000/api/projects-content`
4. If needed, resync: `npm run sync:db`

### Admin edits don't save
1. Check service role key in .env.local
2. Verify Supabase connection
3. Check browser console for errors
4. Try direct API test:
```bash
curl -X PUT http://localhost:3000/api/projects-content \
  -H "Content-Type: application/json" \
  -d '{"sectionKey":"pgProjects","content":{"pgProjects":[]}}'
```

### Database doesn't have latest .ts data
1. Run `npm run sync:db` to sync all data
2. Verify with `npm run verify:db`
3. Restart development server

---

## 🎉 Summary

Your application now has:

✅ **Primary backend** → Supabase database with real content  
✅ **Automatic fallback** → .ts files if database unavailable  
✅ **Full CRUD operations** → Admin panel for content editing  
✅ **Data persistence** → Changes saved to database  
✅ **Safety net** → Can reset to backup anytime  
✅ **Production ready** → Tested and verified  

**The system is now operating as:**
- Database = PRIMARY data source
- .ts files = BACKUP fallback
- Admin panel = Editing interface
- Pages = Display from database (or backup)
