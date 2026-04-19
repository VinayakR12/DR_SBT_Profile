import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const HOME_CONTENT_TABLE = 'home_content_sections'
export const HOME_PROFILE_IMAGES_BUCKET = 'home-profile-images'
export const RESEARCH_PATENTS_ASSETS_BUCKET = 'research-patents-assets'
export const ACHIEVEMENTS_AWARDS_ASSETS_BUCKET = 'achievements-awards-assets'
export const ACHIEVEMENTS_CERTIFICATES_ASSETS_BUCKET = 'achievements-certificates-assets'
export const PROJECTS_ASSETS_BUCKET = 'projects-assets'
export const TEACHING_ASSETS_BUCKET = 'teaching-assets'

type SupabaseKind = 'read' | 'write'

const getSupabaseUrl = (): string => process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''

const getPublicKey = (): string =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  ''

const getServiceKey = (): string => process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''

const buildClient = (kind: SupabaseKind): SupabaseClient | null => {
  const url = getSupabaseUrl()
  const key = kind === 'write' ? getServiceKey() : getPublicKey()

  if (!url || !key) {
    return null
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

export const createSupabaseReadClient = (): SupabaseClient | null => buildClient('read')

export const createSupabaseWriteClient = (): SupabaseClient | null => buildClient('write')

export const getSupabaseStoragePublicUrl = (bucket: string, path: string): string => {
  const baseUrl = getSupabaseUrl().replace(/\/+$/, '')
  const safePath = path.replace(/^\/+/, '')
  return `${baseUrl}/storage/v1/object/public/${bucket}/${safePath}`
}

export const getSupabaseStoragePathFromPublicUrl = (url: string, bucket: string): string | null => {
  const baseUrl = getSupabaseUrl().replace(/\/+$/, '')
  const prefix = `${baseUrl}/storage/v1/object/public/${bucket}/`

  if (!url || !url.startsWith(prefix)) {
    return null
  }

  return decodeURIComponent(url.slice(prefix.length))
}

export const getSupabaseStatus = (): { url: boolean; publicKey: boolean; serviceKey: boolean } => ({
  url: Boolean(getSupabaseUrl()),
  publicKey: Boolean(getPublicKey()),
  serviceKey: Boolean(getServiceKey()),
})