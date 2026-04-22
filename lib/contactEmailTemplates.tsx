type ContactEmailTemplateProps = {
  name: string
  email: string
  phone?: string
  subject: string
  category?: string
  message: string
  submittedAt: string
}

type ContactAutoReplyTemplateProps = {
  name: string
  subject: string
}

const shell: React.CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: '#F8F9FC',
  fontFamily: 'DM Sans, Arial, sans-serif',
}

const card: React.CSSProperties = {
  maxWidth: 620,
  margin: '24px auto',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  border: '1px solid rgba(15,23,42,0.08)',
  overflow: 'hidden',
}

export function ContactOwnerNotificationEmail(props: ContactEmailTemplateProps) {
  const { name, email, phone, subject, category, message, submittedAt } = props

  return (
    <html>
      <body style={shell}>
        <div style={card}>
          <div style={{ backgroundColor: '#0D1F3C', padding: '22px 24px' }}>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: '0.08em', color: '#D4A820', fontWeight: 700 }}>
              NEW CONTACT FORM SUBMISSION
            </p>
            <h1 style={{ margin: '10px 0 0', fontSize: 22, color: '#F0F4F8' }}>Website Contact Request</h1>
          </div>

          <div style={{ height: 3, background: 'linear-gradient(90deg, #B8870A, #D4A820, #B8870A)' }} />

          <div style={{ padding: '24px' }}>
            {category ? (
              <p
                style={{
                  display: 'inline-block',
                  margin: '0 0 18px',
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: 'rgba(13,31,60,0.08)',
                  color: '#1A3560',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {category}
              </p>
            ) : null}

            <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', marginBottom: 18 }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 0', color: '#64748B', fontSize: 13, width: 110 }}>Name</td>
                  <td style={{ padding: '8px 0', color: '#0F172A', fontSize: 14, fontWeight: 600 }}>{name}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', color: '#64748B', fontSize: 13 }}>Email</td>
                  <td style={{ padding: '8px 0', color: '#0F172A', fontSize: 14 }}>{email}</td>
                </tr>
                {phone ? (
                  <tr>
                    <td style={{ padding: '8px 0', color: '#64748B', fontSize: 13 }}>Phone</td>
                    <td style={{ padding: '8px 0', color: '#0F172A', fontSize: 14 }}>{phone}</td>
                  </tr>
                ) : null}
                <tr>
                  <td style={{ padding: '8px 0', color: '#64748B', fontSize: 13 }}>Subject</td>
                  <td style={{ padding: '8px 0', color: '#0F172A', fontSize: 14, fontWeight: 600 }}>{subject}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', color: '#64748B', fontSize: 13 }}>Submitted</td>
                  <td style={{ padding: '8px 0', color: '#334155', fontSize: 13 }}>{submittedAt}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ backgroundColor: '#F8F9FC', borderLeft: '4px solid #B8870A', padding: '14px 16px', borderRadius: '0 8px 8px 0' }}>
              <p style={{ margin: '0 0 8px', color: '#64748B', fontSize: 12, fontWeight: 700 }}>MESSAGE</p>
              <p style={{ margin: 0, color: '#1E293B', fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>{message}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export function ContactAutoReplyEmail(props: ContactAutoReplyTemplateProps) {
  const { name, subject } = props
  const firstName = name.trim().split(' ')[0] || 'there'

  return (
    <html>
      <body style={shell}>
        <div style={{ ...card, maxWidth: 560 }}>
          <div style={{ backgroundColor: '#0D1F3C', padding: '22px 24px', textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 22, color: '#F0F4F8' }}>Thank you for your message</h1>
            <p style={{ margin: '6px 0 0', color: 'rgba(226,232,240,0.8)', fontSize: 13 }}>
              We have received your contact request.
            </p>
          </div>

          <div style={{ height: 3, background: 'linear-gradient(90deg, #B8870A, #D4A820, #B8870A)' }} />

          <div style={{ padding: '24px' }}>
            <p style={{ margin: '0 0 12px', color: '#0F172A', fontSize: 15 }}>Hi {firstName},</p>
            <p style={{ margin: '0 0 14px', color: '#334155', fontSize: 14, lineHeight: 1.7 }}>
              Your inquiry has been submitted successfully. We usually respond within 1 to 2 business days.
            </p>
            <p style={{ margin: '0 0 16px', color: '#334155', fontSize: 14, lineHeight: 1.7 }}>
              Your subject: <strong style={{ color: '#0D1F3C' }}>{subject}</strong>
            </p>

            <p style={{ margin: 0, color: '#64748B', fontSize: 13, lineHeight: 1.7 }}>
              This is an automated acknowledgement email from the website contact form.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}