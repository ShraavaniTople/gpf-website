import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, bucket, tier, action, timestamp, pass_number } = req.body
  if (!name || !email) return res.status(400).json({ error: 'Missing name/email' })

  const url = process.env.SHEETS_WEBHOOK
  if (url) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'Checkins',
          data: {
            Timestamp:    timestamp || new Date().toISOString(),
            Name:         name,
            Email:        email,
            Bucket:       bucket  || '—',
            Tier:         tier    || '—',
            'Pass Number': pass_number || '—',
            Action:       action  || 'checkin',
          },
        }),
      })
    } catch { /* silent — local state is still saved */ }
  }

  return res.status(200).json({ ok: true })
}
