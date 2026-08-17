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

function buildShareHtml(p: {
  to_name: string; company: string; pass_type: string; pass_number: string
}) {
  const firstName = p.to_name.split(' ')[0]
  const tier      = p.pass_type.replace(' Pass', '')
  const color     = TIER_COLOR[tier]     || '#7C3AED'
  const accentBg  = TIER_ACCENT_BG[tier] || '#EDE9FE'
  const badge     = TIER_BADGE[tier]     || '#5B21B6'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Share Your GPF 2026 Pass</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:40px 16px;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

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

      <!-- Main card -->
      <tr>
        <td style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;">

          <!-- Accent bar -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="4" style="background:${color};border-radius:16px 16px 0 0;"></td></tr>
          </table>

          <!-- Body -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:32px 36px;">
            <tr>
              <td>
                <p style="margin:0 0 20px;font-size:22px;font-weight:800;color:#1a0a40;letter-spacing:-0.03em;">Hi ${firstName}, spread the word! 🎉</p>

                <p style="margin:0 0 16px;font-size:15px;color:#4B5563;line-height:1.7;">
                  We're thrilled to have you at <strong>The Great Product Festival 2026</strong> — India's premier product festival, coming to Bangalore on <strong>25–26 September 2026</strong>.
                </p>

                <p style="margin:0 0 16px;font-size:15px;color:#4B5563;line-height:1.7;">
                  As you gear up for the event, we'd love for you to share the excitement with your network. We've created a personalised social card generator exclusively for our attendees — a beautiful, ready-to-post card with your name and role.
                </p>

                <!-- CTA button -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
                  <tr>
                    <td style="background:${color};border-radius:10px;padding:14px 32px;">
                      <a href="https://thegreatproductfestival.com/share" style="font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.01em;">Create Your Social Card →</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 8px;font-size:13px;color:#6B7280;">Or copy the link: <a href="https://thegreatproductfestival.com/share" style="color:${color};text-decoration:none;">thegreatproductfestival.com/share</a></p>

                <!-- Divider -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
                  <tr><td height="1" style="background:#F3F4F6;"></td></tr>
                </table>

                <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1a0a40;">Once you post, tag us and we'll reshare you:</p>

                <!-- WiP India socials -->
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#4B5563;">WiP India</p>
                <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                  <tr>
                    <td style="padding:4px 0;">
                      <a href="https://www.instagram.com/womeninproductindia" style="font-size:13px;color:${color};text-decoration:none;">📸 @womeninproductindia</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">
                      <a href="https://www.linkedin.com/company/wip-india/" style="font-size:13px;color:${color};text-decoration:none;">💼 Women in Product India</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">
                      <a href="https://x.com/wipindia" style="font-size:13px;color:${color};text-decoration:none;">𝕏 @wipindia</a>
                    </td>
                  </tr>
                </table>

                <!-- TGPF socials -->
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#4B5563;">The Great Product Festival</p>
                <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="padding:4px 0;">
                      <a href="https://www.linkedin.com/showcase/the-great-product-festival/" style="font-size:13px;color:${color};text-decoration:none;">💼 The Great Product Festival</a>
                    </td>
                  </tr>
                </table>

                <!-- Hashtags -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
                  <tr>
                    <td style="background:#F5F3FF;border-radius:8px;padding:10px 16px;">
                      <span style="font-family:monospace;font-size:13px;color:${color};font-weight:600;">#TGPF2026 &nbsp;·&nbsp; #WiPIndia</span>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
                  <tr><td height="1" style="background:#F3F4F6;"></td></tr>
                </table>

                <p style="margin:0;font-size:14px;color:#4B5563;line-height:1.7;">See you in Bangalore.</p>
                <p style="margin:8px 0 0;font-size:14px;font-weight:700;color:#1a0a40;">Warm regards,<br/>Team WiP India</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Ticket label -->
      <tr>
        <td style="padding-top:28px;padding-bottom:12px;">
          <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">Your Pass</p>
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
                <!-- Pass tier badge -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:0;">
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
            <tr><td height="4" style="background:linear-gradient(90deg,${color} 0%,#A78BFA 100%);opacity:0.5;"></td></tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 0 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;">Questions? <a href="mailto:hello@womeninproductindia.com" style="color:${color};text-decoration:none;">hello@womeninproductindia.com</a></p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { to_email, to_name, company, pass_type, pass_number } = req.body
  if (!to_email || !to_name || !pass_number) return res.status(400).json({ error: 'Missing required fields' })

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'GPF 2026 <tickets@thegreatproductfestival.com>'

  try {
    await resend.emails.send({
      from: fromAddress,
      to: [to_email],
      reply_to: 'hello@womeninproductindia.com',
      subject: `Share Your GPF 2026 Pass — Make Your Social Card 🎉`,
      html: buildShareHtml({ to_name, company, pass_type, pass_number }),
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Share email error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
