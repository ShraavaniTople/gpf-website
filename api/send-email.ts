import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const TIER_COLOR: Record<string, string> = {
  VIP: '#B45309',
  Premium: '#7C3AED',
  General: '#7C3AED',
}
const TIER_ACCENT_BG: Record<string, string> = {
  VIP: '#FEF3C7',
  Premium: '#EDE9FE',
  General: '#EDE9FE',
}
const TIER_BADGE: Record<string, string> = {
  VIP: '#92400E',
  Premium: '#5B21B6',
  General: '#5B21B6',
}

// ── Email 1: Payment confirmation ──────────────────────────────────────────────
function buildConfirmationHtml(p: {
  to_name: string; company: string; pass_type: string
  amount: string; payment_id: string; pass_number: string
  event_date: string; event_city: string
}) {
  const tier  = p.pass_type.replace(' Pass', '')
  const color = TIER_COLOR[tier] || '#7C3AED'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>GPF 2026 — Payment Confirmed</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:40px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

      <!-- Logo row -->
      <tr>
        <td style="padding-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td><img src="https://www.thegreatproductfestival.com/gpf-logo.png" alt="The Great Product Festival" height="40" style="display:block;"/></td>
              <td align="right"><img src="https://www.thegreatproductfestival.com/wip-logo.png" alt="Women in Product India" width="36" height="36" style="display:block;border-radius:50%;"/></td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;">

          <!-- Accent bar -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="4" style="background:${color};border-radius:16px 16px 0 0;"></td></tr>
          </table>

          <!-- Header -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:28px 32px 20px;">
            <tr>
              <td>
                <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#1a0a40;letter-spacing:-0.03em;">Payment Confirmed ✓</p>
                <p style="margin:0;font-size:14px;color:#6B7280;">Hi ${p.to_name.split(' ')[0]}, your pass for The Great Product Festival is confirmed. See you in Bangalore!</p>
              </td>
            </tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:0 32px;">
            <tr><td height="1" style="background:#F3F4F6;"></td></tr>
          </table>

          <!-- Details grid -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:24px 32px;">
            <tr>
              <td width="50%" valign="top" style="padding-bottom:20px;">
                <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#9CA3AF;letter-spacing:0.15em;text-transform:uppercase;">Attendee</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#1a0a40;">${p.to_name}</p>
                ${p.company && p.company !== '—' ? `<p style="margin:2px 0 0;font-size:13px;color:#6B7280;">${p.company}</p>` : ''}
              </td>
              <td width="50%" valign="top" align="right" style="padding-bottom:20px;">
                <p style="margin:0 0 6px;font-family:monospace;font-size:10px;color:#9CA3AF;letter-spacing:0.15em;text-transform:uppercase;">Pass Type</p>
                <table cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;background:${color};border-radius:6px;padding:5px 14px;">
                  <tr><td style="font-family:monospace;font-size:11px;font-weight:700;color:#FFFFFF;letter-spacing:0.1em;">${p.pass_type.toUpperCase()}</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td valign="top" style="padding-bottom:20px;">
                <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#9CA3AF;letter-spacing:0.15em;text-transform:uppercase;">Event</p>
                <p style="margin:0;font-size:14px;color:#4B5563;line-height:1.6;">${p.event_date}<br/>${p.event_city} · 2 Days · 4 Tracks · 500+ Attendees</p>
              </td>
              <td valign="top" align="right" style="padding-bottom:20px;">
                <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#9CA3AF;letter-spacing:0.15em;text-transform:uppercase;">Amount Paid</p>
                <p style="margin:0;font-size:24px;font-weight:800;color:#1a0a40;">₹${p.amount}</p>
              </td>
            </tr>
          </table>

          <!-- Dashed divider -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:0 32px;">
            <tr><td height="1" style="border-top:2px dashed #E5E7EB;"></td></tr>
          </table>

          <!-- Pass number + payment ID -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 32px 28px;">
            <tr>
              <td>
                <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#9CA3AF;letter-spacing:0.15em;text-transform:uppercase;">Pass Number</p>
                <p style="margin:0 0 10px;font-family:monospace;font-size:13px;color:${color};font-weight:600;">${p.pass_number}</p>
                <p style="margin:0;font-family:monospace;font-size:10px;color:#9CA3AF;">Payment ID: ${p.payment_id}</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Check-in notice -->
      <tr>
        <td style="padding:16px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;">
            <tr>
              <td style="font-size:13px;color:#92400E;line-height:1.6;">
                📲 <strong>A separate check-in ticket will be sent closer to the event.</strong>
                Please use that QR code for entry at the venue.
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 0 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#9CA3AF;">Questions? <a href="mailto:hello@womeninproductindia.com" style="color:${color};text-decoration:none;">hello@womeninproductindia.com</a></p>
          <p style="margin:0;font-size:11px;color:#D1D5DB;">Passes are non-refundable but transferable up to 14 days before the event.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Email 2: Visual ticket ──────────────────────────────────────────────────────
function buildTicketHtml(p: {
  to_name: string; company: string; pass_type: string; pass_number: string
}) {
  const tier    = p.pass_type.replace(' Pass', '')
  const color   = TIER_COLOR[tier]   || '#7C3AED'
  const accentBg = TIER_ACCENT_BG[tier] || '#EDE9FE'
  const badge   = TIER_BADGE[tier]   || '#5B21B6'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Your GPF 2026 Ticket</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:40px 16px;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

      <!-- Heading -->
      <tr>
        <td align="center" style="padding-bottom:20px;">
          <p style="margin:0;font-size:13px;color:#6B7280;">Here's your ticket for The Great Product Festival 🎟️</p>
        </td>
      </tr>

      <!-- ── Ticket ── -->
      <tr>
        <td style="border-radius:16px;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#16112B;border-radius:16px;overflow:hidden;">

            <!-- Top colour bar -->
            <tr>
              <td width="70%" height="5" style="background:${color};"></td>
              <td width="2%" height="5" style="background:#2A2748;"></td>
              <td width="28%" height="5" style="background:#A78BFA;"></td>
            </tr>

            <!-- Main row -->
            <tr>

              <!-- LEFT: main ticket body -->
              <td valign="top" width="70%" style="padding:22px 24px;border-right:2px dashed #3D3B55;">

                <!-- Logos row -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                  <tr>
                    <td valign="middle">
                      <img src="https://www.thegreatproductfestival.com/gpf-logo.png" alt="The Great Product Festival" height="30" style="display:block;"/>
                    </td>
                    <td valign="middle" align="right">
                      <img src="https://www.thegreatproductfestival.com/wip-logo.png" alt="WiP India" height="30" style="display:block;"/>
                    </td>
                  </tr>
                </table>

                <!-- Pass type label -->
                <p style="margin:0 0 4px;font-family:monospace;font-size:9px;color:#6B63A0;letter-spacing:0.2em;text-transform:uppercase;">${p.pass_type.replace(' Pass','').toUpperCase()} PASS</p>

                <!-- Name -->
                <p style="margin:0 0 4px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.03em;line-height:1.1;">${p.to_name}</p>

                <!-- Company -->
                ${p.company && p.company !== '—' ? `<p style="margin:0 0 18px;font-size:12px;color:#A78BFA;">${p.company}</p>` : '<p style="margin:0 0 18px;"></p>'}

                <!-- Fake barcode -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                  <tr>
                    <td width="3" height="24" style="background:#ffffff;"></td><td width="2" height="24" style="background:transparent;"></td>
                    <td width="1" height="24" style="background:#ffffff;"></td><td width="3" height="24" style="background:transparent;"></td>
                    <td width="2" height="24" style="background:#ffffff;"></td><td width="1" height="24" style="background:transparent;"></td>
                    <td width="3" height="24" style="background:#ffffff;"></td><td width="2" height="24" style="background:transparent;"></td>
                    <td width="1" height="24" style="background:#ffffff;"></td><td width="2" height="24" style="background:transparent;"></td>
                    <td width="4" height="24" style="background:#ffffff;"></td><td width="1" height="24" style="background:transparent;"></td>
                    <td width="1" height="24" style="background:#ffffff;"></td><td width="3" height="24" style="background:transparent;"></td>
                    <td width="2" height="24" style="background:#ffffff;"></td><td width="1" height="24" style="background:transparent;"></td>
                    <td width="3" height="24" style="background:#ffffff;"></td><td width="2" height="24" style="background:transparent;"></td>
                    <td width="1" height="24" style="background:#ffffff;"></td><td width="4" height="24" style="background:transparent;"></td>
                    <td width="2" height="24" style="background:#ffffff;"></td><td width="1" height="24" style="background:transparent;"></td>
                    <td width="3" height="24" style="background:#ffffff;"></td><td width="2" height="24" style="background:transparent;"></td>
                    <td width="1" height="24" style="background:#ffffff;"></td><td width="3" height="24" style="background:transparent;"></td>
                    <td width="2" height="24" style="background:#ffffff;"></td><td width="1" height="24" style="background:transparent;"></td>
                    <td width="4" height="24" style="background:#ffffff;"></td><td width="2" height="24" style="background:transparent;"></td>
                    <td width="1" height="24" style="background:#ffffff;"></td>
                  </tr>
                </table>

                <!-- Bottom info -->
                <p style="margin:0;font-family:monospace;font-size:10px;color:#6B63A0;letter-spacing:0.12em;text-transform:uppercase;">25–26 SEPT 2026 &nbsp;·&nbsp; BANGALORE, INDIA</p>

              </td>

              <!-- RIGHT: stub -->
              <td valign="top" width="28%" style="background:#1E1840;padding:22px 16px;text-align:center;">

                <p style="margin:0 0 6px;font-family:monospace;font-size:8px;color:#6B63A0;letter-spacing:0.18em;text-transform:uppercase;">Pass No.</p>
                <p style="margin:0 0 20px;font-family:monospace;font-size:11px;font-weight:700;color:#A78BFA;word-break:break-all;">${p.pass_number}</p>

                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                  <tr><td height="1" style="border-top:1px dashed #3D3B55;"></td></tr>
                </table>

                <p style="margin:0 0 4px;font-family:monospace;font-size:8px;color:#6B63A0;letter-spacing:0.18em;text-transform:uppercase;">Date</p>
                <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#ffffff;line-height:1.4;">25–26<br/>Sept 2026</p>

                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                  <tr><td height="1" style="border-top:1px dashed #3D3B55;"></td></tr>
                </table>

                <p style="margin:0 0 4px;font-family:monospace;font-size:8px;color:#6B63A0;letter-spacing:0.18em;text-transform:uppercase;">Venue</p>
                <p style="margin:0;font-size:12px;font-weight:700;color:#ffffff;line-height:1.4;">Bangalore<br/>India</p>

              </td>

            </tr>

            <!-- Bottom colour bar -->
            <tr>
              <td width="70%" height="4" style="background:${color};"></td>
              <td width="2%" height="4" style="background:#2A2748;"></td>
              <td width="28%" height="4" style="background:#A78BFA;"></td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Footer note -->
      <tr>
        <td align="center" style="padding:20px 0 0;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;">Save this email — bring this ticket (digital or printed) to the event.</p>
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

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'GPF 2026 <tickets@thegreatproductfestival.com>'

  try {
    await Promise.all([
      // Email 1 — payment confirmation
      resend.emails.send({
        from: fromAddress,
        to: [to_email],
        reply_to: 'hello@womeninproductindia.com',
        subject: `Payment confirmed — your ${pass_type} for GPF 2026 🎉`,
        html: buildConfirmationHtml({ to_name, company, pass_type, amount, payment_id, pass_number, event_date, event_city }),
      }),
      // Email 2 — visual ticket
      resend.emails.send({
        from: fromAddress,
        to: [to_email],
        reply_to: 'hello@womeninproductindia.com',
        subject: `Your GPF 2026 Ticket — ${to_name} 🎟️`,
        html: buildTicketHtml({ to_name, company, pass_type, pass_number }),
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
