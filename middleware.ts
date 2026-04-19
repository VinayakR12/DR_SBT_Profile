import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/adminAuth'

const ADMIN_COOKIE = 'admin_session'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    const payload = await verifyAdminSession(token)
    if (!payload) {
      const res = NextResponse.redirect(new URL('/admin/login', req.url))
      res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 })
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
