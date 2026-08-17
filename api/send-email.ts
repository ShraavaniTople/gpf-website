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

      <!-- ── Redesigned dark ticket ── -->
      <tr>
        <td style="border-radius:20px;overflow:hidden;background:#0E0C22;border:1.5px solid #2A2748;">

          <!-- Top gradient bar -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="5" style="background:linear-gradient(90deg,${color} 0%,#A78BFA 60%,#F59E0B 100%);"></td></tr>
          </table>

          <!-- Header row: logos -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:24px 28px 0;">
            <tr>
              <td valign="middle">
                <img src="https://www.thegreatproductfestival.com/gpf-logo.png" alt="The Great Product Festival" height="32" style="display:block;filter:brightness(0) invert(1);opacity:0.9;"/>
              </td>
              <td valign="middle" align="right">
                <img src="https://www.thegreatproductfestival.com/wip-logo.png" alt="WiP India" width="32" height="32" style="display:block;border-radius:50%;border:1.5px solid #3D3B55;"/>
              </td>
            </tr>
          </table>

          <!-- Main content -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 28px 0;">
            <tr>
              <td>
                <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#6B7280;letter-spacing:0.18em;text-transform:uppercase;">The Great Product Festival 2026</p>
                <p style="margin:0 0 6px;font-size:34px;font-weight:900;color:#F0EEF8;letter-spacing:-0.03em;line-height:1.1;">${p.to_name}</p>
                ${p.company && p.company !== '—' ? `<p style="margin:0 0 18px;font-size:13px;color:#9490AD;">${p.company}</p>` : '<p style="margin:0 0 18px;"></p>'}
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background:${color};border-radius:6px;padding:6px 16px;">
                      <span style="font-family:monospace;font-size:10px;font-weight:700;color:#FFFFFF;letter-spacing:0.14em;text-transform:uppercase;">${p.pass_type.toUpperCase()}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Dashed divider -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:24px 28px 0;">
            <tr><td height="1" style="border-top:1.5px dashed #2A2748;"></td></tr>
          </table>

          <!-- Bottom row: date + pass number -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:16px 28px 28px;">
            <tr>
              <td valign="top" width="50%">
                <p style="margin:0 0 3px;font-family:monospace;font-size:9px;color:#52506A;letter-spacing:0.16em;text-transform:uppercase;">Date &amp; Venue</p>
                <p style="margin:0;font-size:13px;font-weight:700;color:#F0EEF8;">25–26 Sept 2026</p>
                <p style="margin:2px 0 0;font-size:12px;color:#9490AD;">Bangalore, India</p>
              </td>
              <td valign="top" width="50%" align="right">
                <p style="margin:0 0 3px;font-family:monospace;font-size:9px;color:#52506A;letter-spacing:0.16em;text-transform:uppercase;">Pass No.</p>
                <p style="margin:0;font-family:monospace;font-size:13px;font-weight:700;color:${color};">${p.pass_number}</p>
              </td>
            </tr>
          </table>

          <!-- Bottom gradient bar -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="4" style="background:linear-gradient(90deg,${color} 0%,#A78BFA 100%);"></td></tr>
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
