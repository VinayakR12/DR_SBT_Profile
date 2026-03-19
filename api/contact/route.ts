// app/api/contact/route.ts
// Handles contact form submissions.
// Sends email to Dr. Sachin Takmare via Resend.
// Install: npm install resend
// Set env: RESEND_API_KEY=your_key_here  in .env.local

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting — simple in-memory store (use Redis in production at scale)
const rateLimit = new Map<string, { count: number; ts: number }>()
const LIMIT = 3        // max submissions per IP
const WINDOW = 60_000  // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now - entry.ts > WINDOW) {
    rateLimit.set(ip, { count: 1, ts: now })
    return false
  }
  if (entry.count >= LIMIT) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, email, phone, subject, category, message } = body

    // ── Validation ──────────────────────────────────────
    if (!name?.trim())    return NextResponse.json({ error: 'Name is required.' },    { status: 400 })
    if (!email?.trim())   return NextResponse.json({ error: 'Email is required.' },   { status: 400 })
    if (!subject?.trim()) return NextResponse.json({ error: 'Subject is required.' }, { status: 400 })
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required.' }, { status: 400 })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (message.trim().length < 20) {
      return NextResponse.json({ error: 'Message must be at least 20 characters.' }, { status: 400 })
    }

    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    // ── Email to Dr. Sachin (notification) ──────────────
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',   // change to your verified domain later
      to: ['sachintakmare@gmail.com'],
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body style="margin:0;padding:0;background:#F8F9FC;font-family:'DM Sans',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FC;padding:40px 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(13,31,60,0.10);">
                
                <!-- Header -->
                <tr>
                  <td style="background:#0D1F3C;padding:28px 36px;">
                    <table width="100%">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#D4A820;">New Contact Form Submission</p>
                          <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#F0F4F8;font-family:Georgia,serif;">Dr. Sachin Takmare</h1>
                          <p style="margin:4px 0 0;font-size:12px;color:rgba(226,232,240,0.55);">Academic Portfolio — sachintakmare.com</p>
                        </td>
                        <td align="right">
                          <div style="width:48px;height:48px;background:linear-gradient(135deg,#B8870A,#D4A820);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
                            <span style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#0D1F3C;line-height:48px;display:block;text-align:center;">ST</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Gold line -->
                <tr><td style="height:3px;background:linear-gradient(90deg,#B8870A,#D4A820,#B8870A);"></td></tr>

                <!-- Body -->
                <tr>
                  <td style="padding:32px 36px;">
                    
                    <!-- Category badge -->
                    ${category ? `
                    <div style="margin-bottom:20px;">
                      <span style="background:rgba(13,31,60,0.07);border:1px solid rgba(13,31,60,0.14);color:#1A3560;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${category}</span>
                    </div>` : ''}

                    <!-- Details table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(15,23,42,0.08);border-radius:8px;overflow:hidden;margin-bottom:24px;">
                      <tr style="background:#F8F9FC;">
                        <td style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94A3B8;width:110px;">From</td>
                        <td style="padding:12px 16px;font-size:14px;color:#0F172A;font-weight:600;">${name}</td>
                      </tr>
                      <tr style="border-top:1px solid rgba(15,23,42,0.06);">
                        <td style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94A3B8;">Email</td>
                        <td style="padding:12px 16px;font-size:14px;color:#1A3560;"><a href="mailto:${email}" style="color:#1A3560;">${email}</a></td>
                      </tr>
                      ${phone ? `
                      <tr style="border-top:1px solid rgba(15,23,42,0.06);">
                        <td style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94A3B8;">Phone</td>
                        <td style="padding:12px 16px;font-size:14px;color:#0F172A;">${phone}</td>
                      </tr>` : ''}
                      <tr style="border-top:1px solid rgba(15,23,42,0.06);">
                        <td style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94A3B8;">Subject</td>
                        <td style="padding:12px 16px;font-size:14px;color:#0F172A;font-weight:600;">${subject}</td>
                      </tr>
                      <tr style="border-top:1px solid rgba(15,23,42,0.06);">
                        <td style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94A3B8;">Date</td>
                        <td style="padding:12px 16px;font-size:13px;color:#64748B;">${submittedAt} IST</td>
                      </tr>
                    </table>

                    <!-- Message -->
                    <div style="background:#F8F9FC;border:1px solid rgba(15,23,42,0.08);border-left:4px solid #B8870A;border-radius:0 8px 8px 0;padding:18px 20px;margin-bottom:24px;">
                      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94A3B8;">Message</p>
                      <p style="margin:0;font-size:14px;color:#334155;line-height:1.75;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                    </div>

                    <!-- Reply CTA -->
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
                       style="display:inline-block;background:#0D1F3C;color:#ffffff;padding:12px 24px;border-radius:7px;font-size:13px;font-weight:600;text-decoration:none;">
                      Reply to ${name} →
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#F8F9FC;border-top:1px solid rgba(15,23,42,0.08);padding:18px 36px;">
                    <p style="margin:0;font-size:11px;color:#94A3B8;text-align:center;">
                      This message was sent via the contact form on your academic portfolio website.<br/>
                      Dr. Sachin Takmare · sachintakmare@gmail.com · Kolhapur, Maharashtra
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })

    // ── Auto-reply to sender ─────────────────────────────
    await resend.emails.send({
      from: 'Dr. Sachin Takmare <onboarding@resend.dev>',
      to: [email],
      subject: `Thank you for reaching out, ${name.split(' ')[0]}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#F8F9FC;font-family:'DM Sans',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FC;padding:40px 20px;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(13,31,60,0.10);">
                <tr>
                  <td style="background:#0D1F3C;padding:28px 36px;text-align:center;">
                    <div style="width:52px;height:52px;background:linear-gradient(135deg,#B8870A,#D4A820);border-radius:11px;margin:0 auto 14px;display:block;line-height:52px;text-align:center;">
                      <span style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#0D1F3C;">ST</span>
                    </div>
                    <h1 style="margin:0;font-size:20px;font-weight:700;color:#F0F4F8;font-family:Georgia,serif;">Dr. Sachin Takmare</h1>
                    <p style="margin:6px 0 0;font-size:11px;color:rgba(226,232,240,0.55);letter-spacing:0.12em;text-transform:uppercase;">Ph.D · AI & ML · Assistant Professor</p>
                  </td>
                </tr>
                <tr><td style="height:3px;background:linear-gradient(90deg,#B8870A,#D4A820,#B8870A);"></td></tr>
                <tr>
                  <td style="padding:32px 36px;">
                    <h2 style="margin:0 0 16px;font-size:18px;color:#0D1F3C;font-family:Georgia,serif;">Thank you, ${name.split(' ')[0]}!</h2>
                    <p style="margin:0 0 14px;font-size:14px;color:#334155;line-height:1.78;">I have received your message and will get back to you as soon as possible — typically within 1–2 business days.</p>
                    <p style="margin:0 0 22px;font-size:14px;color:#334155;line-height:1.78;">In the meantime, you are welcome to explore my research work, teaching portfolio, and publications on my academic website.</p>
                    
                    <div style="background:#F8F9FC;border:1px solid rgba(15,23,42,0.08);border-left:4px solid #B8870A;border-radius:0 8px 8px 0;padding:16px 18px;margin-bottom:24px;">
                      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;">Your message subject</p>
                      <p style="margin:0;font-size:14px;color:#0D1F3C;font-weight:600;">${subject}</p>
                    </div>

                    <p style="margin:0;font-size:13px;color:#64748B;line-height:1.7;">
                      Warm regards,<br/>
                      <strong style="color:#0D1F3C;">Dr. Sachin Balawant Takmare</strong><br/>
                      <span style="color:#B8870A;">Assistant Professor, Computer Engineering</span><br/>
                      D. Y. Patil College of Engineering & Technology, Kolhapur<br/>
                      sachintakmare@gmail.com · +91 9960843406
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#F8F9FC;border-top:1px solid rgba(15,23,42,0.08);padding:16px 36px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#94A3B8;">This is an automated acknowledgement. Please do not reply to this email.</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err: any) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or email directly.' },
      { status: 500 }
    )
  }
}