import { useState } from 'react'
import { Check, Tag, X, ArrowLeft, Shield } from 'lucide-react'

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
const DISCOUNT_CODES: Record<string, { label: string; pct?: number; fixed?: number }> = {
  TEST2: { label: 'Test Code', fixed: 2 },
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

// ─── Shared input styles ──────────────────────────────────────────────────────
const inp = 'w-full rounded-xl px-4 py-3 text-[#F0EEF8] placeholder-[#52506A] focus:outline-none transition bg-[#05040C] border border-[#1C1A32] focus:border-[#7C3AED]'
const lbl = 'block text-sm font-medium mb-1 text-[#9490AD]'

// ─── Razorpay key — replace with live key before going live ──────────────────
const RZP_KEY = 'rzp_live_Spz4J8PmOU9mZl'

interface Props {
  tierName: string
  onClose: () => void
}

export default function CheckoutModal({ tierName, onClose }: Props) {
  const tier = TIERS[tierName] || TIERS.General

  // Step state
  const [step, setStep] = useState<'details' | 'review'>('details')

  // Details
  const [details, setDetails] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '' })

  // Discount
  const [codeInput, setCodeInput] = useState('')
  const [applied, setApplied] = useState<{ code: string; label: string; pct?: number; fixed?: number } | null>(null)
  const [codeErr, setCodeErr] = useState('')

  // Pay
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  const discount = applied
    ? applied.fixed !== undefined
      ? tier.price - applied.fixed
      : Math.round(tier.price * (applied.pct || 0) / 100)
    : 0
  const finalPrice = tier.price - discount

  const canProceed = details.firstName.trim() && details.lastName.trim() && details.email.trim() && details.phone.trim()

  function applyCode() {
    const key = codeInput.trim().toUpperCase()
    const found = DISCOUNT_CODES[key]
    if (found) {
      setApplied({ code: key, ...found })
      setCodeErr('')
    } else {
      setCodeErr('Invalid code. Please check and try again.')
      setApplied(null)
    }
  }

  function removeCode() {
    setApplied(null)
    setCodeInput('')
    setCodeErr('')
  }

  async function handlePay() {
    setPaying(true)
    const loaded = await loadRazorpay()
    if (!loaded) {
      alert('Could not load payment gateway. Please check your connection and try again.')
      setPaying(false)
      return
    }

    const options = {
      // Replace RZP_KEY with your live key before going live
      key: RZP_KEY,
      amount: finalPrice * 100,   // paise
      currency: 'INR',
      name: 'GPF 2026',
      description: `${tierName} Pass | The Great Product Festival`,
      prefill: {
        name: `${details.firstName} ${details.lastName}`,
        email: details.email,
        contact: details.phone,
      },
      notes: {
        pass_type: `${tierName} Pass`,
        company: details.company || '',
        discount_code: applied?.code || '',
        original_price: tier.price,
        final_price: finalPrice,
      },
      theme: { color: '#7C3AED' },
      handler: (response: { razorpay_payment_id: string }) => {
        setPaymentId(response.razorpay_payment_id)
        setSuccess(true)
        setPaying(false)
      },
      modal: {
        ondismiss: () => setPaying(false),
      },
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
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.3)' }}>
          <Check size={28} style={{ color: '#A78BFA' }} />
        </div>
        <h3 className="font-display font-bold text-2xl mb-3" style={{ color: '#F0EEF8' }}>
          Payment Successful!
        </h3>
        <p className="text-sm mb-1" style={{ color: '#9490AD' }}>
          Your <span style={{ color: '#F0EEF8' }}>{tierName} Pass</span> is confirmed.
        </p>
        <p className="text-sm mb-1" style={{ color: '#6B7280' }}>
          Confirmation sent to <span style={{ color: '#F0EEF8' }}>{details.email}</span>
        </p>
        {paymentId && (
          <p className="font-mono text-xs mt-3" style={{ color: '#52506A' }}>
            Payment ID: {paymentId}
          </p>
        )}
        <button onClick={onClose} className="btn-purple mt-8 px-10">Done</button>
      </div>
    )
  }

  // ── Step 1: Details ─────────────────────────────────────────────────────────
  if (step === 'details') {
    return (
      <div className="space-y-5">
        {/* Tier summary pill */}
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

        {/* Form */}
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
            <label className={lbl}>Company</label>
            <input value={details.company} onChange={e => setDetails({ ...details, company: e.target.value })}
              type="text" placeholder="Your company" className={inp} />
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
      {/* Back */}
      <button onClick={() => setStep('details')} className="flex items-center gap-1.5 text-sm transition-colors hover:text-white" style={{ color: '#6B7280' }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Order summary card */}
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

      {/* Discount code */}
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

      {/* Attendee preview */}
      <div className="rounded-xl px-4 py-3" style={{ background: '#080618', border: '1px solid #1C1A32' }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#52506A' }}>Registering as</p>
        <p className="text-sm font-semibold" style={{ color: '#F0EEF8' }}>
          {details.firstName} {details.lastName}
          {details.company ? <span style={{ color: '#6B7280', fontWeight: 400 }}> · {details.company}</span> : null}
        </p>
        <p className="text-sm" style={{ color: '#6B7280' }}>{details.email} · {details.phone}</p>
      </div>

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={paying}
        className="btn-purple w-full"
        style={{ padding: '15px', fontSize: 16, fontWeight: 700 }}
      >
        {paying ? 'Opening Razorpay...' : <>Pay &#8377;{finalPrice.toLocaleString('en-IN')}</>}
      </button>

      {/* Trust line */}
      <div className="flex items-center justify-center gap-2">
        <Shield size={12} style={{ color: '#52506A' }} />
        <p className="text-xs" style={{ color: '#52506A' }}>
          Secured by Razorpay · Passes are non-refundable but transferable up to 14 days before event
        </p>
      </div>
    </div>
  )
}
