import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const TIER_COLOR: Record<string, string> = {
  VIP: '#F59E0B',
  Premium: '#A78BFA',
  General: '#7C3AED',
}

function buildHtml(p: {
  to_name: string; company: string; pass_type: string
  amount: string; payment_id: string; pass_number: string
  event_date: string; event_city: string
}) {
  const tier = p.pass_type.replace(' Pass', '')
  const color = TIER_COLOR[tier] || '#7C3AED'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your GPF 2026 Pass is Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#05040C;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#05040C;padding:40px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

      <!-- Logo row -->
      <tr>
        <td align="center" style="padding-bottom:32px;">
          <img src="https://www.thegreatproductfestival.com/gpf-logo.png" alt="The Great Product Festival" height="44" style="display:block;"/>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td style="background:linear-gradient(135deg,#0D0B1F 0%,#080618 100%);border:1px solid ${color}40;border-radius:20px;overflow:hidden;">

          <!-- Top color bar -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="3" style="background:linear-gradient(90deg,transparent,${color},transparent);"></td></tr>
          </table>

          <!-- Header -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:28px 32px 20px;">
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0" style="background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.25);border-radius:999px;padding:6px 14px;">
                  <tr>
                    <td style="font-family:monospace;font-size:11px;color:#34D399;letter-spacing:0.1em;">✓ CONFIRMED</td>
                  </tr>
                </table>
                <p style="margin:12px 0 4px;font-size:22px;font-weight:800;color:#F0EEF8;letter-spacing:-0.03em;">You're in, ${p.to_name.split(' ')[0]}!</p>
                <p style="margin:0;font-size:14px;color:#6B7280;">Your pass for The Great Product Festival is confirmed.</p>
              </td>
            </tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:0 32px;">
            <tr><td height="1" style="background:#1C1A32;"></td></tr>
          </table>

          <!-- Pass details -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:24px 32px;">
            <tr>
              <td width="50%" valign="top" style="padding-bottom:20px;">
                <p style="margin:0 0 6px;font-family:monospace;font-size:10px;color:#52506A;letter-spacing:0.15em;text-transform:uppercase;">Attendee</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#F0EEF8;">${p.to_name}</p>
                ${p.company && p.company !== '—' ? `<p style="margin:2px 0 0;font-size:13px;color:#6B7280;">${p.company}</p>` : ''}
              </td>
              <td width="50%" valign="top" align="right" style="padding-bottom:20px;">
                <p style="margin:0 0 6px;font-family:monospace;font-size:10px;color:#52506A;letter-spacing:0.15em;text-transform:uppercase;">Pass Type</p>
                <table cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;background:${color}22;border:1px solid ${color}40;border-radius:10px;padding:6px 14px;">
                  <tr><td style="font-size:14px;font-weight:700;color:${color};">${p.pass_type}</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td valign="top" style="padding-bottom:20px;">
                <p style="margin:0 0 6px;font-family:monospace;font-size:10px;color:#52506A;letter-spacing:0.15em;text-transform:uppercase;">Event</p>
                <p style="margin:0;font-size:14px;color:#9490AD;line-height:1.6;">${p.event_date}<br/>${p.event_city} · 2 Days · 4 Tracks · 500+ Attendees</p>
              </td>
              <td valign="top" align="right" style="padding-bottom:20px;">
                <p style="margin:0 0 6px;font-family:monospace;font-size:10px;color:#52506A;letter-spacing:0.15em;text-transform:uppercase;">Amount Paid</p>
                <p style="margin:0;font-size:22px;font-weight:800;color:#F0EEF8;">₹${p.amount}</p>
              </td>
            </tr>
          </table>

          <!-- Perforated divider -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:0 32px;">
            <tr><td height="1" style="border-top:2px dashed #1C1A32;"></td></tr>
          </table>

          <!-- Pass number + payment ID -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 32px 28px;">
            <tr>
              <td>
                <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#52506A;letter-spacing:0.15em;text-transform:uppercase;">Pass Number</p>
                <p style="margin:0 0 12px;font-family:monospace;font-size:14px;color:#A78BFA;font-weight:500;">${p.pass_number}</p>
                <p style="margin:0;font-family:monospace;font-size:10px;color:#52506A;">Payment ID: ${p.payment_id}</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Check-in notice -->
      <tr>
        <td style="padding:20px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.2);border-radius:14px;padding:16px 20px;">
            <tr>
              <td style="font-size:13px;color:#9490AD;line-height:1.6;">
                📲 <strong style="color:#F0EEF8;">A separate check-in ticket will be sent closer to the event.</strong>
                Please use that QR code for entry at the venue.
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:28px 0 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#52506A;">Questions? Email us at
            <a href="mailto:hello@womeninproductindia.com" style="color:#A78BFA;text-decoration:none;">hello@womeninproductindia.com</a>
          </p>
          <p style="margin:0;font-size:11px;color:#3A3851;">
            Passes are non-refundable but transferable up to 14 days before the event.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

async function logToSheets(sheet: string, data: Record<string, string>) {
  const url = process.env.SHEETS_WEBHOOK
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheet, data }),
    })
  } catch { /* silent */ }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to_email, to_name, company, pass_type, amount, payment_id, pass_number, event_date, event_city } = req.body

  if (!to_email || !to_name || !pass_number) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'TGPF 2026 <tickets@thegreatproductfestival.com>',
        to: [to_email],
        reply_to: 'hello@womeninproductindia.com',
        subject: `Your ${pass_type} for The Great Product Festival is confirmed! 🎉`,
        html: buildHtml({ to_name, company, pass_type, amount, payment_id, pass_number, event_date, event_city }),
      }),
      logToSheets('Tickets', {
        Name: to_name,
        Email: to_email,
        Company: company || '—',
        'Pass Type': pass_type,
        'Amount (₹)': amount,
        'Payment ID': payment_id,
        'Pass Number': pass_number,
        'Event Date': event_date,
      }),
    ])
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
