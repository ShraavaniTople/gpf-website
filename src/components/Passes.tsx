import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'General',
    label: 'Admission',
    price: '5,499',
    regularPrice: '7,499',
    popular: false,
    desc: 'Everything you need to experience GPF 2026.',
    features: [
      'Conference Access, Both Days',
      'All Keynotes and Lightning Talks',
      'Networking Zones',
      'Meals and Refreshments',
    ],
  },
  {
    name: 'Premium',
    label: 'Pass',
    price: '9,999',
    regularPrice: '11,999',
    popular: true,
    desc: 'The complete GPF experience.',
    features: [
      'Everything in **General**',
      'Workshops Worth ₹1–2 Lakhs',
      'Hackathon Participation',
      'Priority Seating',
      '6 Months WiP India Advance Membership',
      'Swag Kit',
    ],
  },
  {
    name: 'VIP',
    label: 'Pass',
    price: '15,999',
    regularPrice: '17,999',
    popular: false,
    desc: 'For leaders who want the inner circle.',
    features: [
      'Everything in **Premium**',
      'Workshops Worth ₹1–2 Lakhs',
      'Founders Roundtables',
      'VIP Networking Dinner',
      'Speaker Lounge Access',
      '1 Year WiP India Advance Membership',
      'Swag Kit',
    ],
  },
]

function useVis(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('vis'), delay); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

interface Props { onGetPass: (tierName: string) => void }

export default function Passes({ onGetPass }: Props) {
  const headRef = useVis()
  const cardsRef = useVis(100)
  const discRef = useVis(200)

  return (
    <section id="passes" className="relative py-28 px-6 overflow-hidden">
      <div className="bg-num" style={{ top: '-5%', left: '-2%' }} aria-hidden>06</div>
      <div className="relative z-10 max-w-7xl mx-auto">

        <div ref={headRef} className="sr mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Passes</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
              Get Your Pass
            </h2>
            <p className="text-sm max-w-xs sm:text-right leading-relaxed" style={{ color: '#6B7280' }}>
              Early access pricing. Passes are limited.
            </p>
          </div>
        </div>

        <div ref={cardsRef} className="sg grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="pass-card relative rounded-2xl flex flex-col overflow-hidden"
              style={tier.popular
                ? { background: '#0E0C22', border: '1.5px solid rgba(124,58,237,.5)', boxShadow: '0 0 70px rgba(124,58,237,.18)', marginBottom: 0 }
                : { background: '#080618', border: '1px solid #1C1A32' }}
            >
              {tier.popular && <div className="shim-top" aria-hidden />}

              <div className="p-7 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#52506A' }}>{tier.label}</p>
                    <h3 className="font-display font-extrabold text-xl" style={{ color: '#F0EEF8', letterSpacing: '-0.03em' }}>{tier.name}</h3>
                  </div>
                  {tier.popular && (
                    <span className="font-mono text-[10px] uppercase tracking-widest py-1 px-2.5 rounded-full mt-0.5" style={{ background: 'rgba(124,58,237,.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,.25)', whiteSpace: 'nowrap' }}>
                      Popular
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  {/* Regular price struck through */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#52506A' }}>Regular</span>
                    <span className="font-display font-semibold text-base line-through" style={{ color: '#52506A' }}>
                      &#8377;{tier.regularPrice}
                    </span>
                  </div>
                  {/* Early bird price big */}
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-extrabold" style={{ fontSize: 'clamp(36px,4vw,52px)', color: '#F0EEF8', letterSpacing: '-0.04em' }}>
                      &#8377;{tier.price}
                    </span>
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full self-center"
                      style={{ background: 'rgba(245,158,11,.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,.3)', whiteSpace: 'nowrap' }}
                    >
                      Early Bird
                    </span>
                  </div>
                  <p className="font-mono text-[11px] mt-1" style={{ color: '#52506A' }}>per person</p>
                </div>

                <p className="text-xs leading-relaxed mb-6" style={{ color: '#6B7280' }}>{tier.desc}</p>

                <div className="h-px mb-6" style={{ background: tier.popular ? 'rgba(124,58,237,.18)' : '#1C1A32' }} />

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-7">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: tier.popular ? 'rgba(124,58,237,.15)' : 'rgba(28,26,50,.9)' }}>
                        <Check size={9} style={{ color: tier.popular ? '#A78BFA' : '#52506A' }} />
                      </div>
                      <span className="text-sm" style={{ color: '#9490AD' }}>
                        {f.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
                          part.startsWith('**') && part.endsWith('**')
                            ? <strong key={j} style={{ color: '#F0EEF8', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
                            : part
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onGetPass(tier.name)}
                  className="btn-purple"
                  style={{ textAlign: 'center', fontSize: 14 }}
                >
                  Get This Pass
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discounts row: member discount + group discount */}
        <div ref={discRef} className="sr mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Member discount */}
          <div className="text-center rounded-2xl p-6"
            style={{ border: '1px solid rgba(124,58,237,.15)', background: 'rgba(124,58,237,.03)' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: '#A78BFA' }}>WiP India Members</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
              All active members get{' '}
              <span style={{ color: '#F0EEF8' }}>15% off</span>
              {' '}on all passes. Current{' '}
              <span style={{ color: '#F0EEF8' }}>Advance &amp; Accelerate</span>
              {' '}members attend{' '}
              <span style={{ color: '#F0EEF8' }}>free</span>.
            </p>
            <a
              href="https://womeninproductindia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-semibold text-sm"
              style={{ color: '#A78BFA' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C4B5FD')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#A78BFA')}
            >
              Join as Member &rarr;
            </a>
          </div>

          {/* Group discount */}
          <div className="text-center rounded-2xl p-6"
            style={{ border: '1px solid rgba(124,58,237,.15)', background: 'rgba(124,58,237,.03)' }}>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: '#A78BFA' }}>Group Discount</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
              Book{' '}
              <span style={{ color: '#F0EEF8' }}>3 or more passes</span>
              {' '}together and get{' '}
              <span style={{ color: '#F0EEF8' }}>25% off</span>
              {' '}— valid across all three tiers.
            </p>
            <a
              href="mailto:hello@womeninproductindia.com?subject=Corporate%20%2F%20Bulk%20Passes%20Enquiry"
              className="font-display font-semibold text-sm"
              style={{ color: '#A78BFA' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C4B5FD')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#A78BFA')}
            >
              Corporate &amp; bulk enquiries &rarr;
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
