import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const rateLimit = new Map<string, { count: number; ts: number }>()
const LIMIT = 3
const WINDOW_MS = 60_000

const requestSchema = z.object({
  name: z.string().trim().min(2, 'Name is required.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  subject: z.string().trim().min(3, 'Subject is required.'),
  category: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().min(20, 'Message must be at least 20 characters.'),
})

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now - entry.ts > WINDOW_MS) {
    rateLimit.set(ip, { count: 1, ts: now })
    return false
  }

  if (entry.count >= LIMIT) {
    return true
  }

  entry.count += 1
  return false
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (!forwarded) {
    return 'unknown'
  }

  return forwarded.split(',')[0]?.trim() || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait one minute and try again.' },
        { status: 429 }
      )
    }

    const rawBody = await request.json()
    const parsed = requestSchema.safeParse(rawBody)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Invalid form input.'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    const data = parsed.data

    // Temporary mode: email delivery is disabled, but we still accept valid form submissions.
    return NextResponse.json({
      ok: true,
      message: 'Message received successfully. Email notifications are temporarily disabled.',
      submission: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        category: data.category || '',
        submittedAt,
      },
    })
  } catch (error) {
    console.error('Contact API error:', error)

    const message = error instanceof Error ? error.message : 'Unknown server error.'
    return NextResponse.json(
      { error: `Unable to send your message right now. ${message}` },
      { status: 500 }
    )
  }
}