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

const stats = [
  { n: '60%', label: 'Product Managers and Leaders' },
  { n: '20%', label: 'Founders and Entrepreneurs' },
  { n: '12%', label: 'Engineers and Designers' },
  { n: '8%',  label: 'Investors and VCs' },
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

      <div aria-hidden className="absolute pointer-events-none" style={{
        top: '10%', left: '-5%', width: 600, height: 500,
        background: 'radial-gradient(ellipse, rgba(124,58,237,.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Stats */}
          <div ref={statsRef} className="sr grid grid-cols-2 gap-px" style={{ border: '1px solid #1C1A32', borderRadius: 16, overflow: 'hidden', background: '#1C1A32' }}>
            {stats.map((s, i) => (
              <div key={i} className="p-7 flex flex-col gap-2" style={{ background: '#080618' }}>
                <span className="font-display font-extrabold grad" style={{ fontSize: 'clamp(32px,4vw,48px)', letterSpacing: '-0.04em' }}>{s.n}</span>
                <span className="text-sm leading-snug" style={{ color: '#6B7280' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Photo */}
          <div ref={photoRef} className="px-wrap rounded-2xl overflow-hidden" style={{ height: 320 }}>
            <img src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=900&q=80" alt="Panel discussion" style={{ height: '120%', width: '100%', objectFit: 'cover' }} />
            <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,24,.7) 0%, transparent 60%)' }} />
          </div>
        </div>
      </div>

      {/* Full-bleed marquee strip */}
      <div className="relative z-10 pb-24">
        {/* Thin top border line */}
        <div className="h-px mb-8 mx-6" style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,.2) 30%, rgba(124,58,237,.2) 70%, transparent)' }} />

        <p className="font-mono text-[10px] uppercase tracking-[.28em] text-center mb-6" style={{ color: '#3D3A56' }}>
          Attendees come from teams at
        </p>

        <div className="space-y-4">
          <MarqueeRow items={row1} />
          <MarqueeRow items={row2} reverse />
        </div>

        <div className="h-px mt-8 mx-6" style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,.2) 30%, rgba(124,58,237,.2) 70%, transparent)' }} />
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
