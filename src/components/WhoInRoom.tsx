import { useEffect, useRef } from 'react'

function useVis() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

const row1 = ['Google', 'Amazon', 'Microsoft', 'Salesforce', 'Stripe', 'Uber', 'Lenovo', 'Dell Technologies', 'HSBC', 'Wells Fargo', 'Bank of America', 'Best Buy']
const row2 = ['Razorpay', 'Swiggy', 'Zepto', 'Fractal', 'Odessa', 'Milestone', 'Freshworks', 'Zoho', 'PhonePe', 'Flipkart', 'Zomato', 'Meesho']

const audience = [
  'Product Managers',
  'Founders',
  'Product Leaders',
  'Designers',
  'Engineers',
  'Investors & VCs',
  'Growth & Marketing',
  'Startup Builders',
]

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const repeated = [...items, ...items, ...items, ...items]
  return (
    <div className="flex overflow-hidden" style={{
      maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
    }}>
      <div
        className="flex flex-shrink-0 gap-0"
        style={{ animation: `marquee${reverse ? 'R' : 'L'} 35s linear infinite` }}
      >
        {repeated.map((name, i) => (
          <span key={i} className="flex items-center flex-shrink-0">
            <span
              className="font-display font-bold px-5 transition-colors duration-300"
              style={{
                fontSize: 15,
                color: i % 3 === 0 ? 'rgba(167,139,250,0.7)' : i % 3 === 1 ? 'rgba(240,238,248,0.45)' : 'rgba(240,238,248,0.28)',
                letterSpacing: '-0.02em',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(240,238,248,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.color = i % 3 === 0 ? 'rgba(167,139,250,0.7)' : i % 3 === 1 ? 'rgba(240,238,248,0.45)' : 'rgba(240,238,248,0.28)')}
            >
              {name}
            </span>
            <span style={{ color: 'rgba(124,58,237,0.35)', fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function WhoInRoom() {
  const headRef = useVis()
  const statsRef = useVis()
  // statsRef reused for left content block
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = photoRef.current; if (!el) return
    const fn = () => {
      const rect = el.getBoundingClientRect()
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.15
      const img = el.querySelector('img') as HTMLImageElement
      if (img) img.style.transform = `translateY(${offset}px) scale(1.2)`
    }
    window.addEventListener('scroll', fn, { passive: true }); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <section id="community" className="relative overflow-hidden" style={{ background: '#080618' }}>
      <div className="bg-num" style={{ bottom: '-10%', right: '-2%' }} aria-hidden>02</div>


      {/* Top section with padding */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div ref={headRef} className="sr mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>The Community</p>
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(48px,8vw,104px)', letterSpacing: '-0.05em', color: '#F0EEF8' }}>
              Who's in<br />the Room
            </h2>
            <p className="text-xl lg:mb-3 max-w-xs" style={{ color: '#6B7280' }}>
              Your customers, your future hires, your peers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — statement + pills */}
          <div ref={statsRef} className="sr">
            <p className="font-display font-extrabold leading-tight mb-6"
              style={{ fontSize: 'clamp(22px,2.8vw,34px)', color: '#F0EEF8', letterSpacing: '-0.03em' }}>
              A room built for India's most{' '}
              <span className="grad">ambitious product minds.</span>
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#6B7280', maxWidth: 400 }}>
              Whether you're building 0 to 1, scaling a team, or shaping strategy — GPF 2026 is where your people are.
            </p>
            <div className="flex flex-wrap gap-2">
              {audience.map((a, i) => (
                <span key={i} className="px-4 py-2 font-display font-semibold text-sm rounded-full"
                  style={{
                    background: i % 2 === 0 ? 'rgba(124,58,237,0.1)' : 'rgba(240,238,248,0.04)',
                    border: `1px solid ${i % 2 === 0 ? 'rgba(124,58,237,0.25)' : 'rgba(240,238,248,0.08)'}`,
                    color: i % 2 === 0 ? '#A78BFA' : 'rgba(240,238,248,0.55)',
                    letterSpacing: '-0.01em',
                  }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div ref={photoRef} className="px-wrap rounded-2xl overflow-hidden" style={{ height: 360 }}>
            <img src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=900&q=80" alt="Panel discussion" style={{ height: '120%', width: '100%', objectFit: 'cover' }} />
            <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,24,.7) 0%, transparent 60%)' }} />
          </div>
        </div>
      </div>

      {/* Full-bleed marquee strip */}
      <div className="relative z-10 pb-20">
        <div className="h-px mb-8 mx-6" style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,.2) 30%, rgba(124,58,237,.2) 70%, transparent)' }} />

        <p className="font-mono text-[10px] uppercase tracking-[.28em] text-center mb-6" style={{ color: '#3D3A56' }}>
          Attendees come from teams at
        </p>

        <div className="space-y-4">
          <MarqueeRow items={row1} />
          <MarqueeRow items={row2} reverse />
        </div>
      </div>

      <style>{`
        @keyframes marqueeL {
          from { transform: translateX(0) }
          to   { transform: translateX(-25%) }
        }
        @keyframes marqueeR {
          from { transform: translateX(-25%) }
          to   { transform: translateX(0) }
        }
      `}</style>
    </section>
  )
}
