import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAILS = ['hello@womeninproductindia.com', 'shraavanitople@gmail.com']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { csv, totalCheckedIn, totalAttendees, timestamp } = req.body
  if (!csv) return res.status(400).json({ error: 'Missing csv' })

  const ts = timestamp || new Date().toISOString()
  const label = new Date(ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
  const filename = `tgpf2026-checkins-${ts.replace(/[^0-9T]/g, '').slice(0, 15)}.csv`

  try {
    await resend.emails.send({
      from: 'TGPF Check-in <hello@womeninproductindia.com>',
      to: NOTIFY_EMAILS,
      subject: `📋 TGPF 2026 Check-in Export — ${totalCheckedIn}/${totalAttendees} checked in`,
      text: [
        `TGPF 2026 Check-in Data Export`,
        `Generated: ${label} IST`,
        ``,
        `Checked in: ${totalCheckedIn} / ${totalAttendees} total`,
        ``,
        `Full data is attached as ${filename}`,
      ].join('\n'),
      attachments: [
        {
          filename,
          content: Buffer.from(csv).toString('base64'),
        },
      ],
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('export-checkins email failed:', err)
    return res.status(500).json({ error: 'Email failed' })
  }
}
