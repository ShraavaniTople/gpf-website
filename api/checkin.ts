import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { kv } from '@vercel/kv'

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAIL = 'hello@womeninproductindia.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, bucket, tier, action, timestamp, pass_number } = req.body
  if (!name || !email) return res.status(400).json({ error: 'Missing name/email' })

  const ts = timestamp || new Date().toISOString()
  const act = action || 'checkin'

  // 1 ── Vercel KV (real-time sync across all volunteer devices)
  try {
    if (act === 'checkin') {
      await kv.set(`ci:${email.toLowerCase()}`, { name, bucket, tier, pass_number, ts })
    } else if (act === 'undo') {
      await kv.del(`ci:${email.toLowerCase()}`)
    }
  } catch { /* KV not yet enabled — local state still saved */ }

  // 2 ── Google Sheets (primary record)
  const sheetsUrl = process.env.SHEETS_WEBHOOK
  if (sheetsUrl) {
    try {
      await fetch(sheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'Checkins',
          data: {
            Timestamp:    ts,
            Name:         name,
            Email:        email,
            Bucket:       bucket     || '—',
            Tier:         tier       || '—',
            'Pass Number': pass_number || '—',
            Action:       act,
          },
        }),
      })
    } catch { /* non-fatal */ }
  }

  // 2 ── Email backup via Resend — awaited so it never gets dropped
  if (process.env.RESEND_API_KEY && act === 'checkin') {
    const bucketEmoji: Record<string, string> = {
      Speaker: '🎤', Hackathon: '💻', VIP: '⭐', Premium: '🎫', General: '✅',
    }
    const emoji = bucketEmoji[bucket] || '✅'
    try {
      await resend.emails.send({
        from: 'TGPF Check-in <hello@womeninproductindia.com>',
        to: ['hello@womeninproductindia.com', 'shraavanitople@gmail.com'],
        subject: `${emoji} ${name} checked in — ${bucket || tier}`,
        text: [
          `TGPF 2026 Check-in Record`,
          `─────────────────────────`,
          `Name:        ${name}`,
          `Email:       ${email}`,
          `Bucket:      ${bucket || '—'}`,
          `Tier:        ${tier || '—'}`,
          `Pass Number: ${pass_number || '—'}`,
          `Time:        ${ts}`,
        ].join('\n'),
      })
    } catch { /* Sheets already has the record — email is belt-and-suspenders */ }
  }

  return res.status(200).json({ ok: true })
}
