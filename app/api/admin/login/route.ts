import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { signAdminSession } from '@/lib/adminAuth'

type LoginBody = {
  email?: string
  password?: string
}

const ADMIN_COOKIE = 'admin_session'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody
    const email = (body.email || '').trim().toLowerCase()
    const password = body.password || ''

    const allowedEmail = (process.env.ADMIN_USER || 'admin@gmail.com').trim().toLowerCase()
    const allowedPassword = process.env.ADMIN_PASSWORD || 'admin@123'

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: 'Email and password are required.' }, { status: 400 })
    }

    if (email !== allowedEmail || password !== allowedPassword) {
      return NextResponse.json({ ok: false, message: 'Invalid admin credentials.' }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (url && key) {
      const supabase = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      })

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return NextResponse.json({ ok: false, message: 'Supabase login failed. Check Admin user in Supabase Auth.' }, { status: 401 })
      }
    }

    const token = await signAdminSession(email)
    const res = NextResponse.json({ ok: true, message: 'Login successful.' })

    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return res
  } catch {
    return NextResponse.json({ ok: false, message: 'Unable to process login request.' }, { status: 500 })
  }
}
