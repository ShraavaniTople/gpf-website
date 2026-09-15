import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function buildCombinedHtml(p: {
  to_name: string; company: string; pass_type: string
  amount: string; payment_id: string; pass_number: string
  event_date: string; event_city: string
}) {
  const tier       = p.pass_type.replace(' Pass', '')
  const isVIP      = tier === 'VIP'
  const passLabel  = isVIP ? 'Season Pass · VIP' : p.pass_type
  const firstName  = p.to_name.split(' ')[0]
  const isPaid     = p.amount && p.amount !== 'Complimentary' && p.amount !== '0' && Number(p.amount) !== 0

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>GPF 2026 — Your Pass</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:40px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

      <!-- Dark header -->
      <tr><td style="background:#16125A;border-radius:16px 16px 0 0;padding:32px 36px 28px;">
        <p style="margin:0 0 10px;font-family:monospace;font-size:10px;color:#A78BFA;letter-spacing:0.2em;text-transform:uppercase;">WOMEN IN PRODUCT INDIA PRESENTS</p>
        <p style="margin:0;font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.2;">The Great Product Festival 2026</p>
      </td></tr>

      <!-- Confirmation banner -->
      <tr><td style="background:#5B21B6;padding:24px 36px;">
        <p style="margin:0 0 6px;font-family:monospace;font-size:10px;color:#C4B5FD;letter-spacing:0.2em;text-transform:uppercase;">REGISTRATION CONFIRMED</p>
        <p style="margin:0;font-size:38px;font-weight:800;color:#FFFFFF;letter-spacing:-0.03em;line-height:1.1;">You're in!</p>
      </td></tr>

      <!-- Main content card -->
      <tr><td style="background:#F5F3FF;border-radius:0 0 16px 16px;padding:32px 36px;">

        <!-- Attendee name -->
        <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#D97706;letter-spacing:0.18em;text-transform:uppercase;">ATTENDEE</p>
        <p style="margin:0 0 28px;font-size:24px;font-weight:800;color:#1a0a40;">${p.to_name}</p>

        <!-- Pass Type + Venue row -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
          <tr>
            <td width="40%" valign="top" style="padding-right:16px;">
              <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#D97706;letter-spacing:0.18em;text-transform:uppercase;">PASS TYPE</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#5B21B6;">${passLabel}</p>
            </td>
            <td width="60%" valign="top">
              <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#D97706;letter-spacing:0.18em;text-transform:uppercase;">VENUE</p>
              <p style="margin:0;font-size:14px;color:#1a0a40;line-height:1.6;">Freshworks<br/>RMZ Ecoworld, Bangalore</p>
            </td>
          </tr>
        </table>

        <!-- Date -->
        <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#D97706;letter-spacing:0.18em;text-transform:uppercase;">DATE</p>
        <p style="margin:0 0 ${isPaid ? '12px' : '24px'};font-size:15px;font-weight:700;color:#1a0a40;">September 25–26, 2026</p>

        ${isPaid ? `<!-- Amount paid -->
        <p style="margin:0 0 24px;font-size:13px;color:#6B7280;">Amount paid: <strong style="color:#1a0a40;">₹${p.amount}</strong></p>` : ''}

        <!-- Pass number -->
        <p style="margin:0 0 14px;font-family:monospace;font-size:11px;color:#9CA3AF;letter-spacing:0.06em;">PASS #${p.pass_number}</p>

        <!-- Divider -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
          <tr><td height="1" style="background:#DDD6FE;"></td></tr>
        </table>

        <!-- What to Bring -->
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1a0a40;letter-spacing:0.08em;text-transform:uppercase;">What to Bring</p>
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
          <tr>
            <td style="padding:0 10px 5px 0;font-size:15px;color:#7C3AED;vertical-align:top;line-height:1.5;">•</td>
            <td style="padding-bottom:5px;font-size:13px;color:#4B5563;line-height:1.5;">Government-issued photo ID</td>
          </tr>
          <tr>
            <td style="padding:0 10px 5px 0;font-size:15px;color:#7C3AED;vertical-align:top;line-height:1.5;">•</td>
            <td style="padding-bottom:5px;font-size:13px;color:#4B5563;line-height:1.5;">This email on your phone or printed</td>
          </tr>
          <tr>
            <td style="padding:0 10px 0 0;font-size:15px;color:#7C3AED;vertical-align:top;line-height:1.5;">•</td>
            <td style="font-size:13px;color:#4B5563;line-height:1.5;">Business cards and good energy</td>
          </tr>
        </table>

        <!-- Terms and Conditions -->
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1a0a40;letter-spacing:0.08em;text-transform:uppercase;">Terms and Conditions</p>
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
          <tr>
            <td style="padding:0 10px 5px 0;font-size:12px;color:#9CA3AF;vertical-align:top;font-weight:600;">1.</td>
            <td style="padding-bottom:5px;font-size:12px;color:#6B7280;line-height:1.5;">This pass is valid solely for the registered attendee.</td>
          </tr>
          <tr>
            <td style="padding:0 10px 5px 0;font-size:12px;color:#9CA3AF;vertical-align:top;font-weight:600;">2.</td>
            <td style="padding-bottom:5px;font-size:12px;color:#6B7280;line-height:1.5;">Passes are non-refundable but transferable up to 14 days before the event.</td>
          </tr>
          <tr>
            <td style="padding:0 10px 0 0;font-size:12px;color:#9CA3AF;vertical-align:top;font-weight:600;">3.</td>
            <td style="font-size:12px;color:#6B7280;line-height:1.5;">By attending, you consent to photography and video recording for event and promotional purposes.</td>
          </tr>
        </table>

        <!-- Divider -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
          <tr><td height="1" style="background:#DDD6FE;"></td></tr>
        </table>

        <!-- RSVP on Luma -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;margin-bottom:16px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1a0a40;">🗓️ RSVP on Luma</p>
            <p style="margin:0 0 14px;font-size:13px;color:#4B5563;line-height:1.5;">Lock in your spot for the workshops and sessions via Luma.</p>
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:#16A34A;border-radius:8px;padding:10px 24px;">
                <a href="https://luma.com/thegreatproductfestival" style="font-family:monospace;font-size:12px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.08em;display:inline-block;">RSVP ON LUMA →</a>
              </td>
            </tr></table>
            <p style="margin:10px 0 0;font-size:11px;color:#9CA3AF;">Direct link: <a href="https://luma.com/thegreatproductfestival" style="color:#16A34A;text-decoration:none;">luma.com/thegreatproductfestival</a></p>
          </td></tr>
        </table>

        <!-- Social Card CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EDE9FE;border:1px solid #DDD6FE;border-radius:12px;margin-bottom:24px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1a0a40;">📸 Create Your Social Card</p>
            <p style="margin:0 0 14px;font-size:13px;color:#4B5563;line-height:1.5;">Show the world you're attending TGPF 2026! Generate your personalised card and share it on LinkedIn, Twitter, or Instagram.</p>
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:#7C3AED;border-radius:8px;padding:10px 24px;">
                <a href="https://www.thegreatproductfestival.com/share" style="font-family:monospace;font-size:12px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.08em;display:inline-block;">CREATE YOUR SOCIAL CARD →</a>
              </td>
            </tr></table>
            <p style="margin:10px 0 0;font-size:11px;color:#9CA3AF;">Direct link: <a href="https://www.thegreatproductfestival.com/share" style="color:#7C3AED;text-decoration:none;">thegreatproductfestival.com/share</a></p>
          </td></tr>
        </table>

        <!-- Check-in notice -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;margin-bottom:24px;">
          <tr><td style="padding:14px 20px;font-size:13px;color:#92400E;line-height:1.6;">
            📲 <strong>A separate check-in ticket will be sent closer to the event.</strong> Please use that QR code for entry at the venue.
          </td></tr>
        </table>

        <!-- Footer -->
        <p style="margin:0 0 4px;text-align:center;font-size:12px;color:#9CA3AF;">Questions? <a href="mailto:hello@womeninproductindia.com" style="color:#7C3AED;text-decoration:none;">hello@womeninproductindia.com</a></p>
        <p style="margin:0;text-align:center;font-size:11px;color:#C4B5FD;">Women in Product India · The Great Product Festival 2026</p>

      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

function buildReceiptHtml(p: {
  to_name: string; to_email: string; phone: string; company: string; role: string
  pass_type: string; qty: number; amount: string; payment_id: string
  pass_number: string; discount_code: string
}) {
  const isPaid = p.amount && p.amount !== '0' && Number(p.amount) !== 0
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const receiptNo = `TGPF-${p.pass_number}`
  const unitPrice = isPaid ? Math.round(Number(p.amount) / p.qty) : 0
  const total = isPaid ? Number(p.amount) : 0

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Receipt — TGPF 2026</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr><td style="background:#16125A;padding:28px 36px 24px;">
    <p style="margin:0 0 4px;font-family:monospace;font-size:10px;color:#A78BFA;letter-spacing:0.2em;text-transform:uppercase;">Women in Product India Presents</p>
    <p style="margin:0;font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;">The Great Product Festival 2026</p>
    <p style="margin:6px 0 0;font-size:13px;color:#A78BFA;">25–26 September 2026 · Freshworks, RMZ Ecoworld, Bangalore</p>
  </td></tr>

  <!-- Receipt title bar -->
  <tr><td style="background:#5B21B6;padding:16px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td><p style="margin:0;font-size:20px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;">Payment Receipt</p></td>
      <td align="right" valign="middle">
        <p style="margin:0;font-family:monospace;font-size:11px;color:#C4B5FD;">${receiptNo}</p>
        <p style="margin:4px 0 0;font-family:monospace;font-size:11px;color:#C4B5FD;">${now}</p>
      </td>
    </tr></table>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:32px 36px;">

    <!-- Billed To + Payment Info side by side -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td width="52%" valign="top" style="padding-right:20px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:0.12em;text-transform:uppercase;">Billed To</p>
          <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1a0a40;">${p.to_name}</p>
          ${p.role ? `<p style="margin:0 0 3px;font-size:13px;color:#6B7280;">${p.role}</p>` : ''}
          ${p.company ? `<p style="margin:0 0 3px;font-size:13px;color:#6B7280;">${p.company}</p>` : ''}
          <p style="margin:0 0 3px;font-size:13px;color:#6B7280;">${p.to_email}</p>
          ${p.phone ? `<p style="margin:0;font-size:13px;color:#6B7280;">${p.phone}</p>` : ''}
        </td>
        <td width="48%" valign="top">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:0.12em;text-transform:uppercase;">Payment Info</p>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:12px;color:#9CA3AF;padding-bottom:4px;padding-right:12px;">Payment ID</td>
              <td style="font-size:12px;font-weight:600;color:#1a0a40;padding-bottom:4px;font-family:monospace;">${p.payment_id || '—'}</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#9CA3AF;padding-bottom:4px;padding-right:12px;">Method</td>
              <td style="font-size:12px;font-weight:600;color:#1a0a40;padding-bottom:4px;">Razorpay</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#9CA3AF;padding-right:12px;">Status</td>
              <td style="font-size:12px;font-weight:700;color:#16A34A;">Paid ✓</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;"><tr><td height="1" style="background:#E5E7EB;"></td></tr></table>

    <!-- Line items table -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
      <tr style="background:#F5F3FF;">
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:0.1em;text-transform:uppercase;border-radius:6px 0 0 6px;">Description</td>
        <td align="center" style="padding:10px 14px;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:0.1em;text-transform:uppercase;">Qty</td>
        <td align="right" style="padding:10px 14px;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:0.1em;text-transform:uppercase;">Unit Price</td>
        <td align="right" style="padding:10px 14px;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:0.1em;text-transform:uppercase;border-radius:0 6px 6px 0;">Amount</td>
      </tr>
      <tr>
        <td style="padding:14px 14px 10px;">
          <p style="margin:0;font-size:14px;font-weight:600;color:#1a0a40;">${p.pass_type}</p>
          <p style="margin:3px 0 0;font-size:12px;color:#9CA3AF;">The Great Product Festival 2026 · Pass #${p.pass_number}</p>
        </td>
        <td align="center" style="padding:14px 14px 10px;font-size:14px;color:#1a0a40;">${p.qty}</td>
        <td align="right" style="padding:14px 14px 10px;font-size:14px;color:#1a0a40;">${isPaid ? `₹${unitPrice.toLocaleString('en-IN')}` : 'Complimentary'}</td>
        <td align="right" style="padding:14px 14px 10px;font-size:14px;font-weight:600;color:#1a0a40;">${isPaid ? `₹${total.toLocaleString('en-IN')}` : '—'}</td>
      </tr>
      ${p.discount_code ? `<tr>
        <td colspan="3" style="padding:4px 14px 10px;font-size:12px;color:#16A34A;">Discount applied: ${p.discount_code}</td>
        <td align="right" style="padding:4px 14px 10px;font-size:12px;color:#16A34A;">—</td>
      </tr>` : ''}
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;"><tr><td height="1" style="background:#E5E7EB;"></td></tr></table>

    <!-- Total -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="font-size:15px;font-weight:700;color:#1a0a40;">Total Paid</td>
        <td align="right" style="font-size:22px;font-weight:800;color:#5B21B6;">${isPaid ? `₹${total.toLocaleString('en-IN')}` : 'Complimentary'}</td>
      </tr>
      ${isPaid ? `<tr><td colspan="2" align="right" style="padding-top:4px;font-size:11px;color:#9CA3AF;">Inclusive of all applicable taxes</td></tr>` : ''}
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;"><tr><td height="1" style="background:#E5E7EB;"></td></tr></table>

    <!-- Note -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F3FF;border-radius:10px;margin-bottom:24px;">
      <tr><td style="padding:16px 20px;font-size:12px;color:#6B7280;line-height:1.6;">
        This receipt serves as confirmation of your pass purchase for The Great Product Festival 2026. Please retain it for your records. A separate check-in ticket will be sent closer to the event.
      </td></tr>
    </table>

    <!-- Footer -->
    <p style="margin:0 0 4px;text-align:center;font-size:12px;color:#9CA3AF;">Questions? <a href="mailto:hello@womeninproductindia.com" style="color:#7C3AED;text-decoration:none;">hello@womeninproductindia.com</a></p>
    <p style="margin:0;text-align:center;font-size:11px;color:#C4B5FD;">Women in Product India · The Great Product Festival 2026</p>

  </td></tr>

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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { to_email, to_name, company, role, phone, pass_type, amount, payment_id, pass_number, event_date, event_city, qty, discount_code } = req.body

  if (!to_email || !to_name || !pass_number) return res.status(400).json({ error: 'Missing required fields' })

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'TGPF 2026 <tickets@thegreatproductfestival.com>'
  const isPaid = amount && amount !== 'Complimentary' && amount !== '0' && Number(amount) !== 0

  const emails: Promise<unknown>[] = [
    resend.emails.send({
      from:     fromAddress,
      to:       [to_email],
      reply_to: 'hello@womeninproductindia.com',
      subject:  isPaid
        ? `Payment confirmed — your ${pass_type} for GPF 2026 🎉`
        : `Your ${pass_type} for GPF 2026 is confirmed ✓`,
      html: buildCombinedHtml({ to_name, company, pass_type, amount, payment_id, pass_number, event_date, event_city }),
    }),
    logToSheets('Tickets', {
      Name:           to_name,
      Email:          to_email,
      Company:        company || '—',
      'Pass Type':    pass_type,
      'Amount (₹)':  amount,
      'Payment ID':  payment_id,
      'Pass Number': pass_number,
      'Event Date':  event_date,
    }),
  ]

  if (isPaid) {
    emails.push(
      resend.emails.send({
        from:     fromAddress,
        to:       [to_email],
        reply_to: 'hello@womeninproductindia.com',
        subject:  `Your payment receipt — TGPF 2026 (${pass_number})`,
        html: buildReceiptHtml({
          to_name, to_email,
          phone:         phone || '',
          company:       company || '—',
          role:          role || '',
          pass_type,
          qty:           Number(qty) || 1,
          amount,
          payment_id,
          pass_number,
          discount_code: discount_code || '',
        }),
      })
    )
  }

  try {
    await Promise.all(emails)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
