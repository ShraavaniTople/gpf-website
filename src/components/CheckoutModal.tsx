import { useState } from 'react'
import { Check, Tag, X, ArrowLeft, Shield, Download, Mail } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

// ─── Tier data ────────────────────────────────────────────────────────────────
const TIERS: Record<string, { price: number; features: string[] }> = {
  General: {
    price: 5499,
    features: ['Conference Access, Both Days', 'All Keynotes and Lightning Talks', 'Networking Zones', 'Meals and Refreshments'],
  },
  Premium: {
    price: 9999,
    features: ['Everything in General', 'Workshop Sessions', 'Hackathon Participation', 'Priority Seating'],
  },
  VIP: {
    price: 15999,
    features: ['Everything in Premium', 'Founders Roundtables', 'VIP Networking Dinner', 'Speaker Lounge Access'],
  },
}

// ─── Discount codes ───────────────────────────────────────────────────────────
const DISCOUNT_CODES: Record<string, { label: string; pct?: number; fixed?: number }> = {}

// ─── EmailJS config — fill in after EmailJS setup ────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'

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

// ─── Load EmailJS script ──────────────────────────────────────────────────────
function loadEmailJS(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as any).emailjs) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
    s.onload = () => {
      ;(window as any).emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
      resolve(true)
    }
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

// ─── Send confirmation email to buyer ────────────────────────────────────────
async function sendConfirmationEmail(params: {
  name: string; email: string; company: string
  tierName: string; amount: string; paymentId: string; passNumber: string
}) {
  if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') return
  try {
    await loadEmailJS()
    await (window as any).emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:   params.email,
      to_name:    params.name,
      company:    params.company || '—',
      pass_type:  params.tierName + ' Pass',
      amount:     params.amount,
      payment_id: params.paymentId,
      pass_number: params.passNumber,
      event_name: 'The Great Product Festival',
      event_date: '25-26 Sept 2026',
      event_city: 'Bangalore',
    })
  } catch { /* email failure is silent — pass is shown on screen */ }
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

// ─── Digital Pass Card ────────────────────────────────────────────────────────
function DigitalPass({ name, company, tierName, amount, paymentId, passNumber }: {
  name: string; company: string; tierName: string
  amount: string; paymentId: string; passNumber: string
}) {
  const tierColor = tierName === 'VIP' ? '#F59E0B' : tierName === 'Premium' ? '#A78BFA' : '#7C3AED'
  const tierBg    = tierName === 'VIP' ? 'rgba(245,158,11,.15)' : tierName === 'Premium' ? 'rgba(167,139,250,.15)' : 'rgba(124,58,237,.15)'

  return (
    <div id="gpf-pass" style={{
      background: 'linear-gradient(135deg, #0D0B1F 0%, #080618 100%)',
      border: `1px solid ${tierColor}40`,
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: `0 0 60px ${tierColor}20`,
      position: 'relative',
    }}>
      {/* Top shimmer line */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${tierColor}, transparent)` }} />

      {/* Background decorative circles */}
      <div aria-hidden style={{
        position: 'absolute', top: -60, right: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: `radial-gradient(circle, ${tierColor}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -40, left: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ padding: '24px 28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* GPF logo left */}
        <img src="/gpf-logo.png" alt="The Great Product Festival" style={{ height: 48, width: 'auto', maxWidth: 140 }} />
        {/* WiP logo right + confirmed badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,.12)', border: '1px solid rgba(52,211,153,.25)', borderRadius: 999, padding: '5px 12px' }}>
            <Check size={11} color="#34D399" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#34D399', letterSpacing: '0.1em' }}>CONFIRMED</span>
          </div>
          <img src="/wip-logo.png" alt="Women in Product India" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1C1A32, transparent)', margin: '0 28px' }} />

      {/* Main content */}
      <div style={{ padding: '24px 28px' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52506A', letterSpacing: '0.15em', marginBottom: 6 }}>ATTENDEE</p>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 24, color: '#F0EEF8', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {name}
        </p>
        {company && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280', marginTop: 4 }}>{company}</p>
        )}

        {/* Pass type + event info */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52506A', letterSpacing: '0.15em', marginBottom: 8 }}>PASS TYPE</p>
            <div style={{ background: tierBg, border: `1px solid ${tierColor}40`, borderRadius: 10, padding: '8px 16px', display: 'inline-block' }}>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: tierColor, letterSpacing: '-0.01em' }}>
                {tierName} Pass
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52506A', letterSpacing: '0.15em', marginBottom: 8 }}>EVENT DETAILS</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9490AD', lineHeight: 1.7 }}>
              25-26 Sept 2026, Bangalore<br />
              2 Days · 4 Tracks<br />
              500+ Attendees
            </p>
          </div>
        </div>
      </div>

      {/* Perforated divider */}
      <div style={{ position: 'relative', margin: '0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#05040C', flexShrink: 0, marginLeft: -32 }} />
        <div style={{ flex: 1, borderTop: '2px dashed #1C1A32' }} />
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#05040C', flexShrink: 0, marginRight: -32 }} />
      </div>

      {/* Footer — QR + payment info */}
      <div style={{ padding: '20px 28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        {/* QR code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ background: '#fff', padding: 8, borderRadius: 10 }}>
            <QRCodeSVG
              value={passNumber}
              size={80}
              bgColor="#ffffff"
              fgColor="#1a1040"
              level="M"
            />
          </div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#52506A', letterSpacing: '0.1em', textAlign: 'center' }}>SCAN AT ENTRY</p>
        </div>

        {/* Pass details */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52506A', letterSpacing: '0.12em', marginBottom: 4 }}>PASS NUMBER</p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#A78BFA', fontWeight: 500 }}>{passNumber}</p>
          </div>
          <div style={{ marginBottom: paymentId ? 10 : 0 }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52506A', letterSpacing: '0.12em', marginBottom: 4 }}>AMOUNT PAID</p>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: '#F0EEF8' }}>₹{amount}</p>
          </div>
          {paymentId && (
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#52506A', letterSpacing: '0.06em' }}>
              Payment ID: {paymentId}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CheckoutModal({ tierName, onClose }: Props) {
  const tier = TIERS[tierName] || TIERS.General

  const [step, setStep] = useState<'details' | 'review'>('details')
  const [details, setDetails] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '' })
  const [codeInput, setCodeInput] = useState('')
  const [applied, setApplied] = useState<{ code: string; label: string; pct?: number; fixed?: number } | null>(null)
  const [codeErr, setCodeErr] = useState('')
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentId, setPaymentId] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const discount = applied
    ? applied.fixed !== undefined
      ? tier.price - applied.fixed
      : Math.round(tier.price * (applied.pct || 0) / 100)
    : 0
  const finalPrice = tier.price - discount

  const canProceed = details.firstName.trim() && details.lastName.trim() && details.email.trim() && details.phone.trim() && details.company.trim()

  function applyCode() {
    const key = codeInput.trim().toUpperCase()
    const found = DISCOUNT_CODES[key]
    if (found) { setApplied({ code: key, ...found }); setCodeErr('') }
    else { setCodeErr('Invalid code. Please check and try again.'); setApplied(null) }
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
      description: `${tierName} Pass | The Great Product Festival`,
      prefill: { name: `${details.firstName} ${details.lastName}`, email: details.email, contact: details.phone },
      notes: { pass_type: `${tierName} Pass`, company: details.company || '', discount_code: applied?.code || '', final_price: finalPrice },
      theme: { color: '#7C3AED' },
      handler: async (response: { razorpay_payment_id: string }) => {
        const pid = response.razorpay_payment_id
        const pn  = genPassNumber(pid, tierName)
        setPaymentId(pid)
        setSuccess(true)
        setPaying(false)
        const sent = await sendConfirmationEmail({
          name: `${details.firstName} ${details.lastName}`,
          email: details.email,
          company: details.company,
          tierName,
          amount: finalPrice.toLocaleString('en-IN'),
          paymentId: pid,
          passNumber: pn,
        })
        if (sent !== undefined) setEmailSent(true)
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
            Your pass has been confirmed. See you in Bangalore!
          </p>
        </div>

        {/* Digital Pass */}
        <DigitalPass
          name={fullName}
          company={details.company}
          tierName={tierName}
          amount={finalPrice.toLocaleString('en-IN')}
          paymentId={paymentId}
          passNumber={pn}
        />

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

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              const pass = document.getElementById('gpf-pass')
              if (!pass) return
              const w = window.open('', '_blank', 'width=600,height=700')
              if (!w) return
              w.document.write(`<!DOCTYPE html><html><head><title>GPF 2026 Pass</title>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { background: #05040C; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
                  @page { size: A5 landscape; margin: 0; }
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
              &#8377;{tier.price.toLocaleString('en-IN')}
            </p>
            <p className="font-mono text-[10px] mt-0.5" style={{ color: '#F59E0B' }}>Early Bird</p>
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
          <span style={{ color: '#9490AD' }}>{tierName} Pass (Early Bird)</span>
          <span style={{ color: '#F0EEF8' }}>&#8377;{tier.price.toLocaleString('en-IN')}</span>
        </div>
        {applied && (
          <div className="flex justify-between text-sm">
            <span style={{ color: '#34D399' }}>{applied.label} ({applied.pct}% off)</span>
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
            />
            <button onClick={applyCode} className="btn-ghost"
              style={{ padding: '10px 18px', fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}>
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
        </p>
        <p className="text-sm" style={{ color: '#6B7280' }}>{details.email} · {details.phone}</p>
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
