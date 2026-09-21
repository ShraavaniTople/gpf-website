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
  const isPaid     = p.amount && p.amount !== 'Complimentary' && p.amount !== '0' && Number(String(p.amount).replace(/,/g, '')) !== 0

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
        <p style="margin:0 0 24px;font-size:13px;color:#6B7280;">Amount paid: <strong style="color:#1a0a40;">&#8377;${p.amount}</strong></p>` : ''}

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
            <td style="padding:0 10px 5px 0;font-size:15px;color:#7C3AED;vertical-align:top;line-height:1.5;">&#8226;</td>
            <td style="padding-bottom:5px;font-size:13px;color:#4B5563;line-height:1.5;">Government-issued photo ID</td>
          </tr>
          <tr>
            <td style="padding:0 10px 5px 0;font-size:15px;color:#7C3AED;vertical-align:top;line-height:1.5;">&#8226;</td>
            <td style="padding-bottom:5px;font-size:13px;color:#4B5563;line-height:1.5;">This email on your phone or printed</td>
          </tr>
          <tr>
            <td style="padding:0 10px 0 0;font-size:15px;color:#7C3AED;vertical-align:top;line-height:1.5;">&#8226;</td>
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
            <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1a0a40;">RSVP on Luma</p>
            <p style="margin:0 0 14px;font-size:13px;color:#4B5563;line-height:1.5;">Lock in your spot for the workshops and sessions via Luma.</p>
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:#16A34A;border-radius:8px;padding:10px 24px;">
                <a href="https://luma.com/thegreatproductfestival" style="font-family:monospace;font-size:12px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.08em;display:inline-block;">RSVP ON LUMA</a>
              </td>
            </tr></table>
            <p style="margin:10px 0 0;font-size:11px;color:#9CA3AF;">Direct link: <a href="https://luma.com/thegreatproductfestival" style="color:#16A34A;text-decoration:none;">luma.com/thegreatproductfestival</a></p>
          </td></tr>
        </table>

        <!-- Social Card CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EDE9FE;border:1px solid #DDD6FE;border-radius:12px;margin-bottom:24px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#1a0a40;">Create Your Social Card</p>
            <p style="margin:0 0 14px;font-size:13px;color:#4B5563;line-height:1.5;">Show the world you're attending TGPF 2026! Generate your personalised card and share it on LinkedIn, Twitter, or Instagram.</p>
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:#7C3AED;border-radius:8px;padding:10px 24px;">
                <a href="https://www.thegreatproductfestival.com/share" style="font-family:monospace;font-size:12px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.08em;display:inline-block;">CREATE YOUR SOCIAL CARD</a>
              </td>
            </tr></table>
            <p style="margin:10px 0 0;font-size:11px;color:#9CA3AF;">Direct link: <a href="https://www.thegreatproductfestival.com/share" style="color:#7C3AED;text-decoration:none;">thegreatproductfestival.com/share</a></p>
          </td></tr>
        </table>

        <!-- Check-in notice -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;margin-bottom:24px;">
          <tr><td style="padding:14px 20px;font-size:13px;color:#92400E;line-height:1.6;">
            <strong>A separate check-in ticket will be sent closer to the event.</strong> Please use that QR code for entry at the venue.
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
  const isComp = !p.amount || p.amount === 'Complimentary' || p.amount === '0' || Number(String(p.amount).replace(/,/g, '')) === 0
  const total = isComp ? 0 : Number(String(p.amount).replace(/,/g, ''))
  const unitPrice = p.qty > 1 ? Math.round(total / p.qty) : total
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const receiptNo = 'TGPF-RCP-' + p.pass_number

  // Build payment status block without nested template literals (avoids mobile wrapping issues)
  const paymentStatusBlock = isComp
    ? '<p style="margin:0 0 8px;background:#EFF6FF;border-radius:14px;padding:7px 16px;font-size:13px;font-weight:700;color:#1D4ED8;text-align:right;">&#10003; CONFIRMED</p>'
    + '<p style="margin:0;font-size:12px;color:#475569;text-align:right;">Complimentary</p>'
    : '<p style="margin:0 0 8px;background:#DCFCE7;border-radius:14px;padding:7px 16px;font-size:13px;font-weight:700;color:#15803D;text-align:right;">&#10003; PAID</p>'
    + '<p style="margin:4px 0 2px;font-size:12px;color:#475569;text-align:right;">Via: <strong style="color:#1E1B4B;">Razorpay</strong></p>'
    + '<p style="margin:0;font-size:12px;color:#475569;text-align:right;">Currency: <strong style="color:#1E1B4B;">INR</strong></p>'

  const amountDisplay = isComp ? 'Complimentary' : '&#8377;' + total.toLocaleString('en-IN')
  const rateDisplay   = isComp ? '&mdash;' : '&#8377;' + unitPrice.toLocaleString('en-IN')
  const subtotalDisplay = amountDisplay
  const taxDisplay    = isComp ? '&mdash;' : 'Inclusive'
  const totalLabel    = isComp ? 'Total' : 'Total Paid'
  const discountRow   = p.discount_code
    ? '<tr><td colspan="3" style="padding:8px 12px;font-size:12px;color:#16A34A;border-bottom:1px solid #F1F5F9;">Discount: ' + p.discount_code + '</td><td align="right" style="padding:8px 12px;font-size:12px;color:#16A34A;border-bottom:1px solid #F1F5F9;">Applied</td></tr>'
    : ''
  const roleRow    = p.role    ? '<p style="margin:0 0 2px;font-size:12px;color:#475569;">' + p.role + '</p>'    : ''
  const companyRow = p.company ? '<p style="margin:0 0 2px;font-size:12px;color:#475569;">' + p.company + '</p>' : ''
  const phoneRow   = p.phone   ? '<p style="margin:0;font-size:12px;color:#475569;">'        + p.phone   + '</p>' : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Receipt — TGPF 2026</title></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F1F5F9;padding:32px 12px;">
<tr><td align="center">
<table cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:4px;border:1px solid #E2E8F0;">

  <!-- Top accent bar -->
  <tr><td height="6" style="background:linear-gradient(90deg,#7C3AED,#A78BFA,#F59E0B);border-radius:4px 4px 0 0;"></td></tr>

  <!-- Header -->
  <tr><td style="padding:28px 32px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="top" width="50%">
        <p style="margin:0 0 2px;font-size:16px;font-weight:800;color:#1E1B4B;">Women in Product India</p>
        <p style="margin:0 0 1px;font-size:11px;color:#64748B;">The Great Product Festival 2026</p>
        <p style="margin:0;font-size:11px;color:#64748B;">hello@womeninproductindia.com</p>
      </td>
      <td valign="top" align="right" width="50%" style="padding-left:12px;">
        <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#1E1B4B;">RECEIPT</p>
        <p style="margin:0 0 2px;font-size:10px;color:#64748B;">Receipt No:</p>
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#1E1B4B;font-family:monospace;word-break:break-all;">${receiptNo}</p>
        <p style="margin:0 0 2px;font-size:10px;color:#64748B;">Date: <strong style="color:#1E1B4B;">${now}</strong></p>
        <p style="margin:0 0 2px;font-size:10px;color:#64748B;">Payment ID:</p>
        <p style="margin:0;font-size:10px;font-weight:700;color:#1E1B4B;font-family:monospace;word-break:break-all;">${p.payment_id}</p>
      </td>
    </tr></table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background:#E2E8F0;"></td></tr></table></td></tr>

  <!-- Billed To + Payment Status -->
  <tr><td style="padding:20px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="top" width="52%" style="padding-right:16px;">
        <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94A3B8;letter-spacing:0.14em;text-transform:uppercase;">Billed To</p>
        <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#1E1B4B;">${p.to_name}</p>
        ${roleRow}
        ${companyRow}
        <p style="margin:0 0 2px;font-size:12px;color:#475569;word-break:break-all;">${p.to_email}</p>
        ${phoneRow}
      </td>
      <td valign="top" width="48%" style="padding-left:4px;">
        <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94A3B8;letter-spacing:0.14em;text-transform:uppercase;">Payment Status</p>
        ${paymentStatusBlock}
      </td>
    </tr></table>
  </td></tr>

  <!-- Line items -->
  <tr><td style="padding:0 32px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <!-- Header row -->
      <tr style="background:#F8FAFC;">
        <td width="50%" style="padding:9px 10px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">Item</td>
        <td width="10%" align="center" style="padding:9px 6px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">Qty</td>
        <td width="15%" align="right" style="padding:9px 6px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">Rate</td>
        <td width="25%" align="right" style="padding:9px 10px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">Amount</td>
      </tr>
      <!-- Item row -->
      <tr>
        <td valign="top" style="padding:14px 10px 10px;border-bottom:1px solid #F1F5F9;">
          <p style="margin:0 0 3px;font-size:13px;font-weight:600;color:#1E1B4B;">${p.pass_type}</p>
          <p style="margin:0 0 2px;font-size:10px;color:#94A3B8;">The Great Product Festival 2026</p>
          <p style="margin:0 0 2px;font-size:10px;color:#94A3B8;">25&ndash;26 Sept 2026 &middot; Freshworks, Bangalore</p>
          <p style="margin:0;font-size:10px;color:#94A3B8;word-break:break-all;">Pass: ${p.pass_number}</p>
        </td>
        <td align="center" valign="top" style="padding:14px 6px 10px;font-size:13px;color:#1E1B4B;border-bottom:1px solid #F1F5F9;">${p.qty}</td>
        <td align="right" valign="top" style="padding:14px 6px 10px;font-size:13px;color:#1E1B4B;border-bottom:1px solid #F1F5F9;">${rateDisplay}</td>
        <td align="right" valign="top" style="padding:14px 10px 10px;font-size:13px;font-weight:600;color:#1E1B4B;border-bottom:1px solid #F1F5F9;">${amountDisplay}</td>
      </tr>
      ${discountRow}
      <!-- Subtotal -->
      <tr>
        <td colspan="3" align="right" style="padding:10px 6px 3px;font-size:11px;color:#64748B;">Subtotal</td>
        <td align="right" style="padding:10px 10px 3px;font-size:11px;color:#1E1B4B;">${subtotalDisplay}</td>
      </tr>
      <tr>
        <td colspan="3" align="right" style="padding:3px 6px 10px;font-size:11px;color:#64748B;">Tax</td>
        <td align="right" style="padding:3px 10px 10px;font-size:11px;color:#1E1B4B;">${taxDisplay}</td>
      </tr>
      <!-- Total -->
      <tr style="background:#F5F3FF;">
        <td colspan="3" align="right" style="padding:14px 6px;font-size:13px;font-weight:700;color:#1E1B4B;">${totalLabel}</td>
        <td align="right" style="padding:14px 10px;font-size:17px;font-weight:800;color:#5B21B6;">${amountDisplay}</td>
      </tr>
    </table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background:#E2E8F0;"></td></tr></table></td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 32px 28px;">
    <p style="margin:0 0 3px;font-size:10px;color:#94A3B8;">Issued by: Women in Product India</p>
    <p style="margin:0 0 3px;font-size:10px;color:#94A3B8;">Event: The Great Product Festival 2026</p>
    <p style="margin:0 0 10px;font-size:10px;color:#94A3B8;">Contact: hello@womeninproductindia.com</p>
    <p style="margin:0;font-size:10px;color:#CBD5E1;">This is a valid proof of registration. Please retain for your records.</p>
  </td></tr>

  <!-- Bottom accent bar -->
  <tr><td height="6" style="background:linear-gradient(90deg,#7C3AED,#A78BFA,#F59E0B);border-radius:0 0 4px 4px;"></td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function buildCorporateInvoiceHtml(p: {
  attendee_name: string; attendee_email: string; attendee_phone: string; attendee_role: string
  bill_to_company: string; bill_to_address: string; gst_number: string
  pass_type: string; qty: number; amount: string
  payment_id: string; pass_number: string; is_unpaid: boolean
  additional_members?: { name: string; email: string; role: string; phone: string }[]
}) {
  const total = Number(String(p.amount).replace(/,/g, '')) || 0
  const unitPrice = p.qty > 1 ? Math.round(total / p.qty) : total
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const invoiceNo = 'TGPF-INV-' + p.pass_number

  const statusBadge = p.is_unpaid
    ? '<p style="margin:0 0 8px;background:#FEF3C7;border-radius:14px;padding:7px 16px;font-size:13px;font-weight:700;color:#92400E;text-align:right;">&#9203; PAYMENT DUE</p>'
    + '<p style="margin:0;font-size:12px;color:#475569;text-align:right;">Awaiting payment</p>'
    : '<p style="margin:0 0 8px;background:#DCFCE7;border-radius:14px;padding:7px 16px;font-size:13px;font-weight:700;color:#15803D;text-align:right;">&#10003; PAID</p>'
    + '<p style="margin:4px 0 2px;font-size:12px;color:#475569;text-align:right;">Via: <strong style="color:#1E1B4B;">Razorpay</strong></p>'
    + '<p style="margin:0;font-size:12px;color:#475569;text-align:right;">Currency: <strong style="color:#1E1B4B;">INR</strong></p>'

  const paymentIdRow = p.is_unpaid
    ? '<p style="margin:0 0 2px;font-size:10px;color:#64748B;">Payment ID: <strong style="color:#92400E;">Pending</strong></p>'
    : '<p style="margin:0 0 2px;font-size:10px;color:#64748B;">Payment ID:</p><p style="margin:0;font-size:10px;font-weight:700;color:#1E1B4B;font-family:monospace;word-break:break-all;">' + p.payment_id + '</p>'

  const totalRow = p.is_unpaid
    ? '<td align="right" style="padding:14px 10px;font-size:17px;font-weight:800;color:#92400E;">&#8377;' + total.toLocaleString('en-IN') + ' DUE</td>'
    : '<td align="right" style="padding:14px 10px;font-size:17px;font-weight:800;color:#5B21B6;">&#8377;' + total.toLocaleString('en-IN') + '</td>'

  const allAttendees = [
    { name: p.attendee_name, email: p.attendee_email, role: p.attendee_role, phone: p.attendee_phone },
    ...(p.additional_members || []),
  ]
  const attendeesLabel = allAttendees.length > 1 ? `Attendees (${allAttendees.length})` : 'Attendee'
  const attendeesHtml = allAttendees.map((m, i) =>
    `<tr><td style="padding:${i > 0 ? '10px 0 0' : '0'};">`
    + `<p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1E1B4B;">${m.name}</p>`
    + (m.role  ? `<p style="margin:0 0 2px;font-size:12px;color:#475569;">${m.role}</p>`          : '')
    + `<p style="margin:0 0 2px;font-size:12px;color:#475569;word-break:break-all;">${m.email}</p>`
    + (m.phone ? `<p style="margin:0;font-size:12px;color:#475569;">${m.phone}</p>`               : '')
    + `</td></tr>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Invoice — TGPF 2026</title></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F1F5F9;padding:32px 12px;">
<tr><td align="center">
<table cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#FFFFFF;border-radius:4px;border:1px solid #E2E8F0;">

  <tr><td height="6" style="background:linear-gradient(90deg,#7C3AED,#A78BFA,#F59E0B);border-radius:4px 4px 0 0;"></td></tr>

  <!-- Header -->
  <tr><td style="padding:28px 32px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="top" width="50%">
        <p style="margin:0 0 2px;font-size:16px;font-weight:800;color:#1E1B4B;">Women in Product India</p>
        <p style="margin:0 0 1px;font-size:11px;color:#64748B;">The Great Product Festival 2026</p>
        <p style="margin:0;font-size:11px;color:#64748B;">hello@womeninproductindia.com</p>
      </td>
      <td valign="top" align="right" width="50%" style="padding-left:12px;">
        <p style="margin:0 0 4px;font-size:20px;font-weight:800;color:#1E1B4B;">INVOICE</p>
        <p style="margin:0 0 2px;font-size:10px;color:#64748B;">Invoice No:</p>
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#1E1B4B;font-family:monospace;word-break:break-all;">${invoiceNo}</p>
        <p style="margin:0 0 4px;font-size:10px;color:#64748B;">Date: <strong style="color:#1E1B4B;">${now}</strong></p>
        ${paymentIdRow}
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background:#E2E8F0;"></td></tr></table></td></tr>

  <!-- Billed To + Status -->
  <tr><td style="padding:20px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="top" width="55%" style="padding-right:16px;">
        <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94A3B8;letter-spacing:0.14em;text-transform:uppercase;">Billed To</p>
        <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#1E1B4B;">${p.bill_to_company}</p>
        <p style="margin:0 0 6px;font-size:11px;color:#475569;line-height:1.6;">${p.bill_to_address.replace(/,\s*/g, ',<br/>')}</p>
        <p style="margin:0;font-size:11px;color:#475569;">GST: <strong style="color:#1E1B4B;font-family:monospace;">${p.gst_number}</strong></p>
      </td>
      <td valign="top" width="45%" style="padding-left:4px;">
        <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94A3B8;letter-spacing:0.14em;text-transform:uppercase;">Payment Status</p>
        ${statusBadge}
      </td>
    </tr></table>
  </td></tr>

  <!-- Attendee(s) -->
  <tr><td style="padding:0 32px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8FAFC;border-radius:8px;padding:14px 16px;">
      <tr><td>
        <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#94A3B8;letter-spacing:0.14em;text-transform:uppercase;">${attendeesLabel}</p>
      </td></tr>
      ${attendeesHtml}
    </table>
  </td></tr>

  <tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background:#E2E8F0;"></td></tr></table></td></tr>

  <!-- Line items -->
  <tr><td style="padding:0 32px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr style="background:#F8FAFC;">
        <td width="50%" style="padding:9px 10px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">Item</td>
        <td width="10%" align="center" style="padding:9px 6px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">Qty</td>
        <td width="18%" align="right" style="padding:9px 6px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">Rate</td>
        <td width="22%" align="right" style="padding:9px 10px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;">Amount</td>
      </tr>
      <tr>
        <td valign="top" style="padding:14px 10px 10px;border-bottom:1px solid #F1F5F9;">
          <p style="margin:0 0 3px;font-size:13px;font-weight:600;color:#1E1B4B;">${p.pass_type}</p>
          <p style="margin:0 0 2px;font-size:10px;color:#94A3B8;">The Great Product Festival 2026</p>
          <p style="margin:0 0 2px;font-size:10px;color:#94A3B8;">25&ndash;26 Sept 2026 &middot; Freshworks, Bangalore</p>
          <p style="margin:0;font-size:10px;color:#94A3B8;word-break:break-all;">Pass: ${p.pass_number}</p>
        </td>
        <td align="center" valign="top" style="padding:14px 6px 10px;font-size:13px;color:#1E1B4B;border-bottom:1px solid #F1F5F9;">${p.qty}</td>
        <td align="right" valign="top" style="padding:14px 6px 10px;font-size:13px;color:#1E1B4B;border-bottom:1px solid #F1F5F9;">&#8377;${unitPrice.toLocaleString('en-IN')}</td>
        <td align="right" valign="top" style="padding:14px 10px 10px;font-size:13px;font-weight:600;color:#1E1B4B;border-bottom:1px solid #F1F5F9;">&#8377;${total.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td colspan="3" align="right" style="padding:10px 6px 3px;font-size:11px;color:#64748B;">Subtotal</td>
        <td align="right" style="padding:10px 10px 3px;font-size:11px;color:#1E1B4B;">&#8377;${total.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td colspan="3" align="right" style="padding:3px 6px 10px;font-size:11px;color:#64748B;">GST</td>
        <td align="right" style="padding:3px 10px 10px;font-size:11px;color:#1E1B4B;">Inclusive</td>
      </tr>
      <tr style="background:#F5F3FF;">
        <td colspan="3" align="right" style="padding:14px 6px;font-size:13px;font-weight:700;color:#1E1B4B;">${p.is_unpaid ? 'Amount Due' : 'Total Paid'}</td>
        ${totalRow}
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background:#E2E8F0;"></td></tr></table></td></tr>

  <tr><td style="padding:20px 32px 28px;">
    <p style="margin:0 0 3px;font-size:10px;color:#94A3B8;">Issued by: Women in Product India</p>
    <p style="margin:0 0 3px;font-size:10px;color:#94A3B8;">Event: The Great Product Festival 2026</p>
    <p style="margin:0 0 10px;font-size:10px;color:#94A3B8;">Contact: hello@womeninproductindia.com</p>
    <p style="margin:0;font-size:10px;color:#CBD5E1;">This is an official invoice. Please retain for your records.</p>
  </td></tr>

  <tr><td height="6" style="background:linear-gradient(90deg,#7C3AED,#A78BFA,#F59E0B);border-radius:0 0 4px 4px;"></td></tr>

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

  const {
    to_email, to_name, company, role, phone, pass_type, amount, payment_id, pass_number,
    event_date, event_city, qty, discount_code,
    invoice_only, bill_to_company, bill_to_address, gst_number, is_unpaid, additional_members,
  } = req.body

  if (!to_email || !to_name || !pass_number) return res.status(400).json({ error: 'Missing required fields' })

  // Server-side: GPFINFINITE is only valid for General pass
  if (discount_code === 'GPFINFINITE' && pass_type !== 'General Pass') {
    return res.status(400).json({ error: 'This code is only applicable for the General Pass.' })
  }

  // Corporate invoice-only mode (no pass email, billed to company)
  if (invoice_only) {
    const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'TGPF 2026 <tickets@thegreatproductfestival.com>'
    const subject = is_unpaid
      ? `Invoice — TGPF 2026 Premium Pass [${pass_number}] — Payment Due`
      : `Invoice — TGPF 2026 Premium Pass [${pass_number}]`
    try {
      await resend.emails.send({
        from:     fromAddress,
        to:       [to_email],
        reply_to: 'hello@womeninproductindia.com',
        subject,
        html: buildCorporateInvoiceHtml({
          attendee_name:  to_name,
          attendee_email: to_email,
          attendee_phone: phone || '',
          attendee_role:  role  || '',
          bill_to_company: bill_to_company || company || '',
          bill_to_address: bill_to_address || '',
          gst_number:      gst_number     || '',
          pass_type,
          qty:       Number(qty) || 1,
          amount:    amount || '0',
          payment_id: payment_id || '',
          pass_number,
          is_unpaid: !!is_unpaid,
          additional_members: additional_members || [],
        }),
      })
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('Invoice email error:', err)
      return res.status(500).json({ error: 'Failed to send invoice' })
    }
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'TGPF 2026 <tickets@thegreatproductfestival.com>'
  const isPaid = amount && amount !== 'Complimentary' && amount !== '0' && Number(String(amount).replace(/,/g, '')) !== 0

  const emails: Promise<unknown>[] = [
    resend.emails.send({
      from:     fromAddress,
      to:       [to_email],
      reply_to: 'hello@womeninproductindia.com',
      subject:  `You're in! Your ${pass_type} for TGPF 2026 is confirmed`,
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

  emails.push(
    resend.emails.send({
      from:     fromAddress,
      to:       [to_email],
      reply_to: 'hello@womeninproductindia.com',
      subject:  `Invoice & Receipt — TGPF 2026 [${pass_number}]`,
      html: buildReceiptHtml({
        to_name, to_email,
        phone:         phone || '',
        company:       company || '—',
        role:          role || '',
        pass_type,
        qty:           Number(qty) || 1,
        amount:        amount || '0',
        payment_id,
        pass_number,
        discount_code: discount_code || '',
      }),
    })
  )

  try {
    await Promise.all(emails)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
