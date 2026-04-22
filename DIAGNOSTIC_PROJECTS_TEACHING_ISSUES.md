# Projects & Teaching Pages: Issues & Solutions

## ROOT CAUSE ANALYSIS

### Issue #1: API Returns Empty Content (Fallback to Backup)

**Problem:**
The database rows exist BUT contain `content: {}` (empty JSON object). The API checks:
```typescript
const hasRemote = Object.keys(remote).length > 0
```

When `content: {}` is fetched and parsed:
- `Object.keys({})` → `[]` 
- `[].length > 0` → `false`
- Result: Falls back to `backup` source even though DB row exists

**Location:** `/api/projects-content/route.ts:87` and `/api/teaching-content/route.ts:87`

**Fix:**
Instead of checking if object is empty, check if Supabase returned the row:
```typescript
// OLD (broken)
const hasRemote = Object.keys(remote).length > 0

// NEW (fixed)
const hasRemote = data !== null && data !== undefined
```

---

### Issue #2: Admin CRUD Operations Fail

**Problem:**
When admin saves a section via PUT, the API expects `section_key` and `content`, but:

1. Admin sends: `{ sectionKey: 'pgProjects', content: { pgProjects: [...] } }`
2. API merges with existing: `{ ...current, [sectionKey]: sectionValue }`
3. API normalizes: `normalizeProjectsContent(merged)`
4. **FAILS**: Normalization functions expect ALL sections (`pgProjects` AND `ugDomains`) to be present
   - Missing sections → defaults to static data fallback
   - Result: User edits get overwritten by static data!

**Location:** `/api/projects-content/route.ts:117` and `/api/teaching-content/route.ts:117`

**The Normalization Chain Problem:**
```typescript
// In projectsContent.ts
export const normalizeProjectsContent = (
  value?: Partial<ProjectsContentRaw> | null,
): ProjectsContentRaw => ({
  pgProjects: Array.isArray(value?.pgProjects)
    ? value.pgProjects.map(...) 
    : STATIC_PROJECTS_CONTENT.pgProjects  // ⚠️ FALLBACK WHEN MISSING
  ugDomains: Array.isArray(value?.ugDomains)
    ? value.ugDomains.map(...)
    : STATIC_PROJECTS_CONTENT.ugDomains   // ⚠️ FALLBACK WHEN MISSING
})
```

**Example Failure Flow:**
1. DB has: `{ pgProjects: [{...}], ugDomains: [{...}] }`
2. Admin edits only `pgProjects`
3. PUT sends: `{ pgProjects: [...edited...] }`
4. API reads current DB: `{ pgProjects: [...], ugDomains: [...] }`
5. API merges: `{ pgProjects: [...edited...], ugDomains: [...] }`
6. Normalization should preserve both ✅
7. But if read fails → merges with `{}` → normalization fills missing with STATIC ❌

---

### Issue #3: Database Initialization with Empty Content

**Problem:**
Database rows were created with `content: '{}'::jsonb` (empty object).
This is semantically different from "having real data":
- DB row exists: `{ section_key: 'projects', content: {} }`
- But `content` is empty → Should merge with static defaults

**The Chicken-and-Egg Issue:**
- Empty DB content should → Use static data until first edit
- But empty DB also confuses → hasRemote check (sees empty object = no data)

---

## CURRENT BEHAVIOR (BROKEN)

### Pages see "Backup content active"
```
Projects Page Load Flow:
1. Call /api/projects-content
2. API reads DB → { content: {} }  (parsed to empty object)
3. hasRemote check: Object.keys({}).length > 0 → false
4. API returns: source: 'backup'  ❌
5. Page displays: "Supabase unavailable..."  ❌
```

### Admin Edits don't save properly
```
Admin Edit Flow:
1. Load current: { pgProjects: [...], ugDomains: [...] }
2. Edit only pgProjects field in UI
3. Send PUT: { sectionKey: 'pgProjects', content: { pgProjects: [...edited...] } }
4. API reads current: If this fails or gets {}, normalization fills with STATIC
5. User sees their edits overwritten by old static data  ❌
```

---

## SOLUTIONS

### Solution A: Fix API READ Detection (Recommended)

**File:** `/api/projects-content/route.ts` and `/api/teaching-content/route.ts`

Change the `hasRemote` check from checking object contents to checking if row was found:

```typescript
export async function GET() {
  try {
    const remote = await readRemote()
    // FIX: Don't check if object is empty, check if we got data from DB
    const hasRemote = remote && Object.keys(remote).length > 0
    
    return NextResponse.json({
      ok: true,
      source: hasRemote ? 'supabase' : 'backup',
      content: normalizeProjectsContent(remote),
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    // ...
  }
}
```

**Better Approach:**
```typescript
const readRemote = async (): Promise<{ found: boolean; data: Partial<ProjectsContentRaw> }> => {
  const client = createSupabaseWriteClient() ?? createSupabaseReadClient()
  if (!client) {
    console.error('[projects] Supabase client is not configured.')
    return { found: false, data: {} }
  }

  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .select('content, updated_at')
    .eq('section_key', PROJECTS_KEY)
    .maybeSingle()

  if (error || !data) {
    if (error) {
      console.error('[projects] Failed reading content:', error.message)
    }
    return { found: false, data: {} }  // Row doesn't exist
  }

  return { found: true, data: parseContent((data as { content?: unknown }).content) || {} }
}

export async function GET() {
  try {
    const remote = await readRemote()
    const content = remote.found
      ? normalizeProjectsContent(remote.data)
      : STATIC_PROJECTS_CONTENT

    return NextResponse.json({
      ok: true,
      source: remote.found ? 'supabase' : 'backup',
      content,
      supabase: getSupabaseStatus(),
    })
  } catch (error) {
    // ...
  }
}
```

### Solution B: Fix Empty Database Content Initialization

**File:** `scripts/init-projects-teaching-db.js`

Initialize with proper structure instead of empty object:

```javascript
// Initialize with proper structure from static files
const { STATIC_PROJECTS_CONTENT } = require('./lib/projectsContent')
const { STATIC_TEACHING_CONTENT } = require('./lib/teachingContent')

await client.from('home_content_sections').upsert({
  section_key: 'projects',
  content: STATIC_PROJECTS_CONTENT,  // Use actual structure
  updated_at: new Date().toISOString(),
})

await client.from('home_content_sections').upsert({
  section_key: 'teaching',
  content: STATIC_TEACHING_CONTENT,  // Use actual structure
  updated_at: new Date().toISOString(),
})
```

### Solution C: Fix Admin CRUD - Ensure Full Merge on Update

**File:** `/api/projects-content/route.ts` and `/api/teaching-content/route.ts`

Ensure PUT always merges with complete current state:

```typescript
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveBody

    if (!body.sectionKey || !isSectionKey(body.sectionKey)) {
      return NextResponse.json(
        { ok: false, message: 'Valid sectionKey is required.' },
        { status: 400 }
      )
    }

    const sectionValue = body.content?.[body.sectionKey]
    if (sectionValue === undefined) {
      return NextResponse.json(
        { ok: false, message: 'Section content is required.' },
        { status: 400 }
      )
    }

    // FIX: Start with static content as fallback, THEN merge current DB
    let current = normalizeProjectsContent(STATIC_PROJECTS_CONTENT)
    const remote = await readRemote()
    if (remote && Object.keys(remote).length > 0) {
      current = normalizeProjectsContent(remote)
    }

    const next = normalizeProjectsContent({
      ...current,
      [body.sectionKey]: sectionValue,
    })

    const result = await upsertContent(next)
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 503 }
      )
    }

    return NextResponse.json({ ok: true, source: 'supabase', content: next })
  } catch (error) {
    console.error('[projects] PUT failed:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to save projects content.',
      },
      { status: 500 }
    )
  }
}
```

---

## IMPLEMENTATION PRIORITY

1. **Priority 1:** Fix API READ detection (Solution A)
   - Immediate impact: Pages will show Supabase data
   - Low risk: Only changes detection logic

2. **Priority 2:** Reinitialize database with proper content (Solution B)
   - Ensures data structure is correct
   - Run once script

3. **Priority 3:** Fix admin CRUD merge logic (Solution C)
   - Prevents data loss on edits
   - Ensures safety in update operations

---

## TESTING CHECKLIST

After implementing fixes:

- [ ] `/projects` page shows Supabase source (not "backup")
- [ ] `/teaching` page shows Supabase source (not "backup")
- [ ] Admin can edit PG Projects and save successfully
- [ ] Admin can edit UG Domains and save successfully
- [ ] Admin can edit Teaching sections and save successfully
- [ ] Edited content appears on public pages
- [ ] Backup/static files are preserved (not modified)
