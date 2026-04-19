const encoder = new TextEncoder()

type SessionPayload = {
  email: string
  exp: number
}

const b64urlEncode = (input: Uint8Array): string => {
  let binary = ''
  for (let i = 0; i < input.length; i += 1) {
    binary += String.fromCharCode(input[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const b64urlDecode = (input: string): Uint8Array => {
  const pad = '='.repeat((4 - (input.length % 4 || 4)) % 4)
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad
  const binary = atob(b64)
  const output = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    output[i] = binary.charCodeAt(i)
  }
  return output
}

const safeDecodeJson = (input: Uint8Array): SessionPayload | null => {
  try {
    const text = new TextDecoder().decode(input)
    const parsed = JSON.parse(text) as SessionPayload
    if (!parsed?.email || !parsed?.exp) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const getSecret = (): string => {
  return process.env.ADMIN_SECRET || 'dev-admin-secret-change-me'
}

const importHmacKey = async (): Promise<CryptoKey> => {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export const signAdminSession = async (email: string, maxAgeSeconds = 60 * 60 * 8): Promise<string> => {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  }
  const payloadBytes = encoder.encode(JSON.stringify(payload))
  const payloadEncoded = b64urlEncode(payloadBytes)

  const key = await importHmacKey()
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadEncoded))
  const signatureEncoded = b64urlEncode(new Uint8Array(signature))

  return `${payloadEncoded}.${signatureEncoded}`
}

export const verifyAdminSession = async (token: string): Promise<SessionPayload | null> => {
  const [payloadEncoded, signatureEncoded] = token.split('.')
  if (!payloadEncoded || !signatureEncoded) {
    return null
  }

  const payloadBytes = b64urlDecode(payloadEncoded)
  const signatureBytes = b64urlDecode(signatureEncoded)
  const key = await importHmacKey()

  const valid = await crypto.subtle.verify('HMAC', key, signatureBytes.buffer as ArrayBuffer, encoder.encode(payloadEncoded))
  if (!valid) {
    return null
  }

  const payload = safeDecodeJson(payloadBytes)
  if (!payload) {
    return null
  }

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null
  }

  return payload
}
