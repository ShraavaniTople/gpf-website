import { useState, useEffect } from 'react'
import { Check, Tag, X, ArrowLeft, Shield, Download, Mail, Copy, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

// ─── Tier data ────────────────────────────────────────────────────────────────
const TIERS: Record<string, { price: number; features: string[] }> = {
  General: {
    price: 5499,
    features: ['Conference Access, Both Days', 'All Keynotes and Lightning Talks', 'Networking Zones', 'Meals and Refreshments'],
  },
  Premium: {
    price: 9999,
    features: ['Everything in General', 'Workshops Worth ₹1–2 Lakhs', 'Priority Seating', '6 Months WiP India Advance Membership', 'Swag Kit'],
  },
  VIP: {
    price: 15999,
    features: ['Everything in Premium', 'Founders Roundtables', 'VIP Networking Dinner', '1 Year WiP India Advance Membership', 'Swag Kit'],
  },
}

// ─── Discount codes ───────────────────────────────────────────────────────────
const DISCOUNT_CODES: Record<string, { label: string; pct?: number; fixed?: number; minQty?: number }> = {
  WIPINDIA15: { label: 'WiP India member · 15% off', pct: 15 },
  PRODUCT25: { label: 'WiP India member · 25% off', pct: 25 },
  PRODOM: { label: '25% off', pct: 25 },
  HERKEY: { label: '25% off', pct: 25 },
  TGPF50: { label: 'WiP India member · 50% off', pct: 50 },
  // Community partner codes — 25% off
  FOFMUM25:   { label: 'FOF Mumbai community · 25% off', pct: 25 },
  GDGCLOUD25: { label: 'GDG Cloud Mumbai community · 25% off', pct: 25 },
  FSH25:      { label: 'Founder Startup House community · 25% off', pct: 25 },
  HIDEVS25:   { label: 'HiDevs AI House community · 25% off', pct: 25 },
  FFDG25:     { label: 'FFDG Mumbai community · 25% off', pct: 25 },
  AIC25:      { label: 'AIC community · 25% off', pct: 25 },
  CN25:       { label: 'Coding Ninjas community · 25% off', pct: 25 },
  ANITAB25:   { label: 'Anita B.org community · 25% off', pct: 25 },
  FF25:       { label: 'FlutterFlow community · 25% off', pct: 25 },
  WIT25:      { label: 'Women in Tech India community · 25% off', pct: 25 },
  SAL25:      { label: 'Startups & Life community · 25% off', pct: 25 },
  UNWIND25:   { label: 'Unwind Ventures community · 25% off', pct: 25 },
  // Group discount — 40% off, requires 3+ passes
  GROUP40:    { label: 'Group discount · 40% off', pct: 40, minQty: 3 },
}

// ─── Load Razorpay script ─────────────────────────────────────────────────────
function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as any).Razorpay) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

// ─── Send confirmation email to buyer ────────────────────────────────────────
async function sendConfirmationEmail(params: {
  name: string; email: string; company: string
  tierName: string; amount: string; paymentId: string; passNumber: string
}) {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email:    params.email,
        to_name:     params.name,
        company:     params.company || '—',
        pass_type:   params.tierName + ' Pass',
        amount:      params.amount,
        payment_id:  params.paymentId,
        pass_number: params.passNumber,
        event_date:  '25-26 Sept 2026',
        event_city:  'RMZ Ecoworld, Bangalore',
      }),
    })
  } catch { /* email failure is silent — pass is shown on screen */ }
}

// ─── Submit pass purchase to Web3Forms ───────────────────────────────────────
async function submitPassToWeb3Forms(params: {
  name: string; email: string; phone: string; company: string; role: string; linkedin: string
  tierName: string; qty: number; amount: string; paymentId: string; passNumber: string
  discountCode: string; consentToShare: boolean
}) {
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key:               '05343d66-4685-49cf-ba57-e57dbf8a2bf1',
        subject:                  `GPF 2026 - Pass Purchase: ${params.tierName} × ${params.qty} — ${params.name}`,
        from_name:                'GPF 2026 Website',
        'Full Name':              params.name,
        'Email':                  params.email,
        'Phone':                  params.phone,
        'Company':                params.company,
        'Role':                   params.role,
        'LinkedIn':               params.linkedin,
        'Pass Type':              params.tierName + ' Pass',
        'Quantity':               String(params.qty),
        'Amount Paid (INR)':      '₹' + params.amount,
        'Payment ID':             params.paymentId,
        'Pass Number':            params.passNumber,
        'Discount Code':          params.discountCode || 'None',
        'Consent to Share Data':  params.consentToShare ? 'Yes — opted in' : 'No — opted out',
      }),
    })
  } catch { /* non-blocking */ }
}

// ─── Generate pass number ─────────────────────────────────────────────────────
function genPassNumber(paymentId: string, tier: string) {
  const prefix = tier === 'VIP' ? 'V' : tier === 'Premium' ? 'P' : 'G'
  const suffix = paymentId.slice(-6).toUpperCase()
  return `GPF26-${prefix}-${suffix}`
}

// ─── Shared input styles ──────────────────────────────────────────────────────
const inp = 'w-full rounded-xl px-4 py-3 text-[#F0EEF8] placeholder-[#52506A] focus:outline-none transition bg-[#05040C] border border-[#1C1A32] focus:border-[#7C3AED]'
const lbl = 'block text-sm font-medium mb-1 text-[#9490AD]'

const RZP_KEY = 'rzp_live_Spz4J8PmOU9mZl'

interface Props {
  tierName: string
  onClose: () => void
}

// ─── Physical Ticket Card ────────────────────────────────────────────────────
function PhysicalTicket({ name, company, tierName, amount, paymentId, passNumber }: {
  name: string; company: string; tierName: string
  amount: string; paymentId: string; passNumber: string
}) {
  const tierColor  = tierName === 'VIP' ? '#B45309' : '#7C3AED'
  const accentBg   = tierName === 'VIP' ? '#FEF3C7' : '#EDE9FE'
  const badgeColor = tierName === 'VIP' ? '#92400E' : '#5B21B6'

  return (
    <div id="gpf-pass" style={{ borderRadius: 16, background: '#05040C', padding: 3, boxShadow: `0 8px 40px ${tierColor}25` }}>
    <div style={{
      background: '#FFFDF9',
      border: `3px solid ${tierColor}`,
      borderRadius: 14,
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Space Grotesk, system-ui, sans-serif',
    }}>

      {/* ── Main ticket body ── */}
      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220 }}>

        {/* Top row: GPF logo only */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <img src="/gpf-logo.webp" alt="The Great Product Festival" style={{ height: 34, width: 'auto', maxWidth: 120 }} />
          </div>
          <div style={{ height: 1, background: `${tierColor}15`, marginBottom: 14 }} />
        </div>

        {/* Middle: greeting + name + badge */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: 13,
            color: tierColor,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0 0 6px',
          }}>
            Namaste, Builder.
          </p>
          <p style={{
            fontWeight: 800,
            fontSize: 30,
            color: '#1a0a40',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            margin: '0 0 10px',
          }}>
            {name}
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: `${tierColor}14`,
            color: badgeColor,
            border: `1px solid ${tierColor}35`,
            borderRadius: 5,
            padding: '4px 10px',
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
          }}>
            {tierName} Pass
          </div>
        </div>

        {/* Bottom: location + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#6B7280', letterSpacing: '0.07em', textTransform: 'uppercase', paddingTop: 14 }}>
          <span>RMZ Ecoworld, Bangalore</span>
          <span style={{ color: tierColor, fontWeight: 900, fontSize: 13 }}>|</span>
          <span>25–26 Sept 2026</span>
        </div>
      </div>

      {/* ── Perforated divider ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 2 }}>
        <div style={{ width: 0, flex: 1, borderLeft: `2px dashed ${tierColor}35` }} />
      </div>

      {/* ── Right stub ── */}
      <div style={{
        width: 110,
        background: accentBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 8px',
        flexShrink: 0,
        gap: 0,
      }}>
        {/* WiP India logo — no label */}
        <img src="/wip-logo.webp" alt="WiP India" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${tierColor}25` }} />

        {/* QR code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ background: '#fff', padding: 5, borderRadius: 8, border: `1px solid ${tierColor}15` }}>
            <QRCodeSVG value="https://www.thegreatproductfestival.com" size={64} bgColor="#ffffff" fgColor="#1a1040" level="M" />
          </div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: badgeColor, letterSpacing: '0.06em', textAlign: 'center', margin: 0 }}>SCAN AT ENTRY</p>
        </div>

        {/* Rotated label */}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          fontSize: 9,
          color: `${tierColor}80`,
          letterSpacing: '0.22em',
          writingMode: 'vertical-rl' as const,
          textOrientation: 'mixed' as const,
          transform: 'rotate(180deg)',
          textTransform: 'uppercase',
        }}>
          TGPF 2026
        </span>
      </div>
    </div>
    </div>
  )
}

// ─── Social Share Block ───────────────────────────────────────────────────────
function SocialShare({ tierName }: { tierName: string }) {
  const [copied, setCopied] = useState(false)

  const caption = `🎟️ Just grabbed my ${tierName} Pass for The Great Product Festival 2026!

India's biggest product conference is coming to Bengaluru — 2 days, 4 tracks, workshops, keynotes & 500+ product builders, founders & PMs under one roof.

📅 25–26 September 2026 | Bengaluru, India
🌐 thegreatproductfestival.com

Organised by @womeninproductindia 🙌

#TGPF2026 #GPF2026 #ProductManagement #ProductFestival #WiPIndia`

  const tweetText = encodeURIComponent(
    `🎟️ Just got my ${tierName} Pass for @wipindia's The Great Product Festival 2026!\n\n25–26 Sept | Bengaluru | 500+ product builders\n\n#TGPF2026 #GPF2026`
  )
  const twitterUrl  = `https://twitter.com/intent/tweet?text=${tweetText}&url=https%3A%2F%2Fwww.thegreatproductfestival.com`
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.thegreatproductfestival.com`

  function copy() {
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(124,58,237,.06)', border: '1px solid rgba(124,58,237,.18)' }}>
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#A78BFA' }}>Share on Socials 🎉</p>

      {/* Caption box */}
      <div className="rounded-lg p-3 text-xs leading-relaxed whitespace-pre-line" style={{ background: 'rgba(0,0,0,.25)', color: '#9490AD', fontFamily: 'inherit' }}>
        {caption}
      </div>

      {/* Handles hint */}
      <p className="text-[10px]" style={{ color: '#52506A' }}>
        Tag us — IG: <span style={{ color: '#A78BFA' }}>@womeninproductindia</span> · X: <span style={{ color: '#A78BFA' }}>@wipindia</span> · LI: <span style={{ color: '#A78BFA' }}>wip-india</span>
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copy}
          className="btn-ghost flex items-center gap-1.5"
          style={{ padding: '8px 14px', fontSize: 12 }}
        >
          <Copy size={12} /> {copied ? 'Copied!' : 'Copy Caption'}
        </button>
        <a
          href={twitterUrl} target="_blank" rel="noopener noreferrer"
          className="btn-ghost flex items-center gap-1.5"
          style={{ padding: '8px 14px', fontSize: 12, textDecoration: 'none' }}
        >
          <ExternalLink size={12} /> Post on X
        </a>
        <a
          href={linkedInUrl} target="_blank" rel="noopener noreferrer"
          className="btn-ghost flex items-center gap-1.5"
          style={{ padding: '8px 14px', fontSize: 12, textDecoration: 'none' }}
        >
          <ExternalLink size={12} /> Share on LinkedIn
        </a>
        <a
          href="https://instagram.com/womeninproductindia" target="_blank" rel="noopener noreferrer"
          className="btn-ghost flex items-center gap-1.5"
          style={{ padding: '8px 14px', fontSize: 12, textDecoration: 'none' }}
        >
          <ExternalLink size={12} /> Instagram
        </a>
      </div>
    </div>
  )
}

export default function CheckoutModal({ tierName, onClose }: Props) {
  const tier = TIERS[tierName] || TIERS.General

  const [step, setStep] = useState<'details' | 'review'>('details')
  const [qty, setQty] = useState(1)
  const [details, setDetails] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', linkedin: '', role: '' })
  const [codeInput, setCodeInput] = useState('')
  const [applied, setApplied] = useState<{ code: string; label: string; pct?: number; fixed?: number; minQty?: number } | null>(null)
  const [codeErr, setCodeErr] = useState('')
  const [consent, setConsent] = useState(false)
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentId, setPaymentId] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  // Remove code if user reduces qty below the minimum required
  useEffect(() => {
    if (applied?.minQty && qty < applied.minQty) {
      setApplied(null)
      setCodeInput('')
      setCodeErr(`Code removed — requires ${applied.minQty}+ passes.`)
    }
  }, [qty]) // eslint-disable-line react-hooks/exhaustive-deps

  const baseTotal = tier.price * qty
  const discount = applied
    ? applied.fixed !== undefined
      ? applied.fixed
      : Math.round(baseTotal * (applied.pct || 0) / 100)
    : 0
  const finalPrice = baseTotal - discount

  const canProceed = details.firstName.trim() && details.lastName.trim() && details.email.trim() && details.phone.trim() && details.company.trim() && details.linkedin.trim() && details.role.trim()

  function applyCode() {
    const key = codeInput.trim().toUpperCase()
    const found = DISCOUNT_CODES[key]
    if (!found) { setCodeErr('Invalid code. Please check and try again.'); setApplied(null); return }
    if (found.minQty && qty < found.minQty) {
      setCodeErr(`This code is valid for ${found.minQty}+ passes. Please increase your quantity.`)
      setApplied(null)
      return
    }
    setApplied({ code: key, ...found }); setCodeErr('')
  }

  function removeCode() { setApplied(null); setCodeInput(''); setCodeErr('') }

  async function handlePay() {
    setPaying(true)

    const loaded = await loadRazorpay()
    if (!loaded) {
      alert('Could not load payment gateway. Please check your connection and try again.')
      setPaying(false)
      return
    }

    const options = {
      key: RZP_KEY,
      amount: finalPrice * 100,
      currency: 'INR',
      name: 'GPF 2026',
      description: `${tierName} Pass × ${qty} | The Great Product Festival`,
      prefill: { name: `${details.firstName} ${details.lastName}`, email: details.email, contact: details.phone },
      notes: { pass_type: `${tierName} Pass`, quantity: qty, company: details.company || '', role: details.role || '', linkedin: details.linkedin || '', discount_code: applied?.code || '', final_price: finalPrice },
      theme: { color: '#7C3AED' },
      handler: async (response: { razorpay_payment_id: string }) => {
        const pid      = response.razorpay_payment_id
        const pn       = genPassNumber(pid, tierName)
        const fullName = `${details.firstName} ${details.lastName}`
        const amountStr = finalPrice.toLocaleString('en-IN')
        setPaymentId(pid)
        setSuccess(true)
        setPaying(false)
        const sent = await sendConfirmationEmail({
          name: fullName,
          email: details.email,
          company: details.company,
          tierName,
          amount: amountStr,
          paymentId: pid,
          passNumber: pn,
        })
        if (sent !== undefined) setEmailSent(true)
        submitPassToWeb3Forms({
          name:           fullName,
          email:          details.email,
          phone:          details.phone,
          company:        details.company,
          role:           details.role,
          linkedin:       details.linkedin,
          tierName,
          qty,
          amount:         amountStr,
          paymentId:      pid,
          passNumber:     pn,
          discountCode:   applied?.code || '',
          consentToShare: consent,
        })
      },
      modal: { ondismiss: () => setPaying(false) },
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.on('payment.failed', () => {
      setPaying(false)
      alert('Payment failed. Please try again or contact hello@womeninproductindia.com')
    })
    rzp.open()
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    const pn = genPassNumber(paymentId, tierName)
    const fullName = `${details.firstName} ${details.lastName}`

    return (
      <div className="space-y-5">
        {/* Congrats header */}
        <div className="text-center pb-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(52,211,153,.12)', border: '1px solid rgba(52,211,153,.25)' }}>
            <Check size={24} color="#34D399" />
          </div>
          <h3 className="font-display font-bold text-2xl mb-1" style={{ color: '#F0EEF8' }}>
            You're In! 🎉
          </h3>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Your pass has been confirmed. See you at RMZ Ecoworld, Bangalore!
          </p>
        </div>

        {/* Physical Ticket */}
        <PhysicalTicket
          name={fullName}
          company={details.company}
          tierName={tierName}
          amount={finalPrice.toLocaleString('en-IN')}
          paymentId={paymentId}
          passNumber={pn}
        />

        {/* Payment details row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl px-4 py-3" style={{ background: '#080618', border: '1px solid #1C1A32' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52506A', letterSpacing: '0.12em', marginBottom: 4 }}>PASS NUMBER</p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#A78BFA', fontWeight: 500 }}>{pn}</p>
          </div>
          <div className="rounded-xl px-4 py-3" style={{ background: '#080618', border: '1px solid #1C1A32' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52506A', letterSpacing: '0.12em', marginBottom: 4 }}>AMOUNT PAID</p>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: '#F0EEF8' }}>₹{finalPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>
        {paymentId && (
          <p className="text-center" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#52506A', letterSpacing: '0.06em' }}>
            Payment ID: {paymentId}
          </p>
        )}

        {/* Email notice */}
        <div className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(124,58,237,.07)', border: '1px solid rgba(124,58,237,.15)' }}>
          <Mail size={15} style={{ color: '#A78BFA', flexShrink: 0, marginTop: 2 }} />
          <p className="text-xs leading-relaxed" style={{ color: '#9490AD' }}>
            A confirmation email has been sent to <span style={{ color: '#F0EEF8' }}>{details.email}</span>.
            If you don't see it, check your spam folder or contact{' '}
            <a href="mailto:hello@womeninproductindia.com" style={{ color: '#A78BFA' }}>hello@womeninproductindia.com</a>
          </p>
        </div>

        {/* Luma check-in notice */}
        <div className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)' }}>
          <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>📲</span>
          <p className="text-xs leading-relaxed" style={{ color: '#9490AD' }}>
            You will receive a <span style={{ color: '#F0EEF8' }}>separate check-in ticket via email</span> closer to the event. Please use that QR code for entry at the venue.
          </p>
        </div>

        {/* Social sharing */}
        <SocialShare tierName={tierName} />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              const pass = document.getElementById('gpf-pass')
              if (!pass) return
              const w = window.open('', '_blank', 'width=680,height=380')
              if (!w) return
              w.document.write(`<!DOCTYPE html><html><head><title>GPF 2026 Pass — ${fullName}</title>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { background: #F3F4F6; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 40px; }
                  @page { size: A5 landscape; margin: 16px; }
                </style>
              </head><body>${pass.outerHTML}</body></html>`)
              w.document.close()
              w.focus()
              setTimeout(() => { w.print() }, 600)
            }}
            className="btn-ghost flex items-center justify-center gap-2 flex-1"
            style={{ padding: '12px', fontSize: 13 }}
          >
            <Download size={14} /> Save / Print Pass
          </button>
          <button onClick={onClose} className="btn-purple flex-1" style={{ padding: '12px', fontSize: 13 }}>
            Done
          </button>
        </div>
      </div>
    )
  }

  // ── Step 1: Details ─────────────────────────────────────────────────────────
  if (step === 'details') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 rounded-2xl"
          style={{ background: 'rgba(124,58,237,.07)', border: '1px solid rgba(124,58,237,.18)' }}>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-0.5" style={{ color: '#52506A' }}>Selected</p>
            <p className="font-display font-bold text-base" style={{ color: '#F0EEF8' }}>{tierName} Pass</p>
          </div>
          <div className="text-right">
            <p className="font-display font-extrabold text-xl" style={{ color: '#F0EEF8' }}>
              &#8377;{baseTotal.toLocaleString('en-IN')}
            </p>
            {qty > 1 && (
              <p className="text-xs" style={{ color: '#6B7280' }}>₹{tier.price.toLocaleString('en-IN')} × {qty}</p>
            )}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{ background: '#080618', border: '1px solid #1C1A32' }}>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-0.5" style={{ color: '#52506A' }}>Number of Passes</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>Each pass admits one person</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-opacity hover:opacity-70"
              style={{ background: '#1C1A32', color: '#F0EEF8' }}
            >
              −
            </button>
            <span className="font-display font-bold text-xl w-5 text-center" style={{ color: '#F0EEF8' }}>{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(20, q + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-opacity hover:opacity-70"
              style={{ background: '#1C1A32', color: '#F0EEF8' }}
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>First Name *</label>
            <input value={details.firstName} onChange={e => setDetails({ ...details, firstName: e.target.value })}
              type="text" placeholder="Priya" className={inp} />
          </div>
          <div>
            <label className={lbl}>Last Name *</label>
            <input value={details.lastName} onChange={e => setDetails({ ...details, lastName: e.target.value })}
              type="text" placeholder="Sharma" className={inp} />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className={lbl}>Email *</label>
            <input value={details.email} onChange={e => setDetails({ ...details, email: e.target.value })}
              type="email" placeholder="priya@example.com" className={inp} />
          </div>
          <div>
            <label className={lbl}>Phone *</label>
            <input value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value })}
              type="tel" placeholder="+91 98765 43210" className={inp} />
          </div>
          <div>
            <label className={lbl}>Company *</label>
            <input value={details.company} onChange={e => setDetails({ ...details, company: e.target.value })}
              type="text" required placeholder="Your company" className={inp} />
          </div>
          <div>
            <label className={lbl}>Your Role *</label>
            <input value={details.role} onChange={e => setDetails({ ...details, role: e.target.value })}
              type="text" placeholder="Product Manager" className={inp} />
          </div>
          <div>
            <label className={lbl}>LinkedIn Profile *</label>
            <input value={details.linkedin} onChange={e => setDetails({ ...details, linkedin: e.target.value })}
              type="url" placeholder="https://linkedin.com/in/..." className={inp} />
          </div>
        </div>

        <button
          onClick={() => setStep('review')}
          disabled={!canProceed}
          className="btn-purple w-full"
          style={{ padding: '14px', fontSize: 15, opacity: canProceed ? 1 : 0.45, cursor: canProceed ? 'pointer' : 'not-allowed' }}
        >
          Continue to Review
        </button>
        <p className="text-xs text-center" style={{ color: '#52506A' }}>* Required fields</p>
      </div>
    )
  }

  // ── Step 2: Review & Pay ────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <button onClick={() => setStep('details')} className="flex items-center gap-1.5 text-sm transition-colors hover:text-white" style={{ color: '#6B7280' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="rounded-2xl p-5 space-y-3" style={{ background: '#080618', border: '1px solid #1C1A32' }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: '#52506A' }}>Order Summary</p>
        <div className="flex justify-between text-sm">
          <span style={{ color: '#9490AD' }}>
            {tierName} Pass{qty > 1 ? ` × ${qty}` : ''}
          </span>
          <span style={{ color: '#F0EEF8' }}>&#8377;{baseTotal.toLocaleString('en-IN')}</span>
        </div>
        {applied && (
          <div className="flex justify-between text-sm">
            <span style={{ color: '#34D399' }}>{applied.label}</span>
            <span style={{ color: '#34D399' }}>- &#8377;{discount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="h-px" style={{ background: '#1C1A32' }} />
        <div className="flex justify-between items-baseline">
          <span className="font-display font-bold text-sm" style={{ color: '#F0EEF8' }}>Total</span>
          <span className="font-display font-extrabold text-2xl" style={{ color: '#F0EEF8' }}>
            &#8377;{finalPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2" style={{ color: '#9490AD' }}>Have a discount code?</p>
        {applied ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(52,211,153,.07)', border: '1px solid rgba(52,211,153,.2)' }}>
            <Tag size={13} style={{ color: '#34D399', flexShrink: 0 }} />
            <span className="flex-1 font-mono text-sm font-medium" style={{ color: '#34D399' }}>
              {applied.code}: {applied.label}
            </span>
            <button onClick={removeCode} className="transition-opacity hover:opacity-70">
              <X size={13} style={{ color: '#34D399' }} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeErr('') }}
              onKeyDown={e => e.key === 'Enter' && applyCode()}
              placeholder="ENTER CODE"
              className={inp + ' flex-1 font-mono tracking-widest uppercase'}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              data-lpignore="true"
              data-form-type="other"
              style={{ border: '1px solid rgba(124,58,237,.4)' }}
            />
            <button
              onClick={applyCode}
              style={{ padding: '10px 20px', fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0, background: '#7C3AED', color: '#fff', borderRadius: 9999, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Apply
            </button>
          </div>
        )}
        {codeErr && <p className="text-xs mt-1.5" style={{ color: '#F87171' }}>{codeErr}</p>}
      </div>

      <div className="rounded-xl px-4 py-3" style={{ background: '#080618', border: '1px solid #1C1A32' }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#52506A' }}>Registering as</p>
        <p className="text-sm font-semibold" style={{ color: '#F0EEF8' }}>
          {details.firstName} {details.lastName}
          {details.company ? <span style={{ color: '#6B7280', fontWeight: 400 }}> · {details.company}</span> : null}
          {details.role ? <span style={{ color: '#6B7280', fontWeight: 400 }}> · {details.role}</span> : null}
        </p>
        <p className="text-sm" style={{ color: '#6B7280' }}>{details.email} · {details.phone}</p>
        {details.linkedin && (
          <p className="text-xs mt-1 truncate" style={{ color: '#6B7280' }}>{details.linkedin}</p>
        )}
      </div>

      {/* Data sharing consent */}
      <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(124,58,237,.06)', border: '1px solid rgba(124,58,237,.18)' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: '#F0EEF8' }}>
          Share my contact details with TGPF 2026 sponsors &amp; partners for networking opportunities?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setConsent(true)}
            style={{
              flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer', transition: 'all .15s',
              background: consent ? '#7C3AED' : 'transparent',
              color: consent ? '#fff' : '#9490AD',
              border: consent ? '1px solid #7C3AED' : '1px solid #1C1A32',
            }}
          >
            Yes, Opt In
          </button>
          <button
            type="button"
            onClick={() => setConsent(false)}
            style={{
              flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer', transition: 'all .15s',
              background: !consent ? '#1C1A32' : 'transparent',
              color: !consent ? '#F0EEF8' : '#9490AD',
              border: !consent ? '1px solid #52506A' : '1px solid #1C1A32',
            }}
          >
            No, Opt Out
          </button>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={paying}
        className="btn-purple w-full"
        style={{ padding: '15px', fontSize: 16, fontWeight: 700 }}
      >
        {paying ? 'Opening Razorpay...' : <>Pay &#8377;{finalPrice.toLocaleString('en-IN')}</>}
      </button>

      <div className="flex items-center justify-center gap-2">
        <Shield size={12} style={{ color: '#52506A' }} />
        <p className="text-xs" style={{ color: '#52506A' }}>
          Secured by Razorpay · Passes are non-refundable but transferable up to 14 days before event
        </p>
      </div>
    </div>
  )
}
