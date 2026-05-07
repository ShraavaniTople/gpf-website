import { useEffect, useRef, useState } from 'react'

function useVis() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

// Row 1 — Global + top Indian tech
const row1Companies = [
  { name: 'Google',           domain: 'google.com' },
  { name: 'Amazon',           domain: 'amazon.com' },
  { name: 'Microsoft',        domain: 'microsoft.com' },
  { name: 'Salesforce',       domain: 'salesforce.com' },
  { name: 'Stripe',           domain: 'stripe.com' },
  { name: 'Uber',             domain: 'uber.com' },
  { name: 'Lenovo',           domain: 'lenovo.com' },
  { name: 'Dell Technologies', domain: 'dell.com' },
  { name: 'Best Buy',         domain: 'bestbuy.com' },
  { name: 'Wells Fargo',      domain: 'wellsfargo.com' },
  { name: 'Bank of America',  domain: 'bankofamerica.com' },
  { name: 'HSBC',             domain: 'hsbc.com' },
]

// Row 2 — Indian ecosystem + fintech + analytics
const row2Companies = [
  { name: 'Razorpay',         domain: 'razorpay.com' },
  { name: 'Swiggy',           domain: 'swiggy.com' },
  { name: 'Zepto',            domain: 'zeptonow.com' },
  { name: 'Fractal',          domain: 'fractal.ai' },
  { name: 'Odessa',           domain: 'odessa.com' },
  { name: 'Milestone',        domain: 'milestonesys.com' },
  { name: 'Freshworks',       domain: 'freshworks.com' },
  { name: 'Zoho',             domain: 'zoho.com' },
  { name: 'PhonePe',          domain: 'phonepe.com' },
  { name: 'Flipkart',         domain: 'flipkart.com' },
  { name: 'Meesho',           domain: 'meesho.com' },
  { name: 'Zomato',           domain: 'zomato.com' },
]

function LogoCard({ name, domain }: { name: string; domain: string }) {
  const [err, setErr] = useState(false)
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center px-7"
      style={{
        height: 72,
        minWidth: 170,
        background: 'rgba(240,238,248,0.03)',
        border: '1px solid rgba(240,238,248,0.07)',
        borderRadius: 16,
        transition: 'background .2s, border-color .2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.08)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.25)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(240,238,248,0.03)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,238,248,0.07)'
      }}
    >
      {!err ? (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          onError={() => setErr(true)}
          style={{ height: 26, maxWidth: 110, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.65 }}
        />
      ) : (
        <span className="font-display font-bold text-sm" style={{ color: 'rgba(240,238,248,0.55)', letterSpacing: '-0.02em' }}>{name}</span>
      )}
    </div>
  )
}

const stats = [
  { n: '60%', label: 'Product Managers and Leaders' },
  { n: '20%', label: 'Founders and Entrepreneurs' },
  { n: '12%', label: 'Engineers and Designers' },
  { n: '8%',  label: 'Investors and VCs' },
]

function LogoTicker() {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function animate(el: HTMLDivElement | null, speed: number, dir: 1 | -1) {
      if (!el) return () => {}
      let pos = dir === -1 ? el.scrollWidth / 2 : 0
      let raf: number
      let paused = false
      const tick = () => {
        if (!paused) {
          pos += speed * dir
          if (dir === 1 && pos >= el.scrollWidth / 2) pos = 0
          if (dir === -1 && pos <= 0) pos = el.scrollWidth / 2
          el.style.transform = `translateX(${-pos}px)`
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      const pause = () => { paused = true }
      const resume = () => { paused = false }
      el.addEventListener('mouseenter', pause)
      el.addEventListener('mouseleave', resume)
      el.addEventListener('touchstart', pause, { passive: true })
      el.addEventListener('touchend', resume)
      return () => {
        cancelAnimationFrame(raf)
        el.removeEventListener('mouseenter', pause)
        el.removeEventListener('mouseleave', resume)
      }
    }
    const c1 = animate(ref1.current, 0.42, 1)
    const c2 = animate(ref2.current, 0.36, -1)
    return () => { c1(); c2() }
  }, [])

  return (
    <div
      className="relative overflow-hidden py-1"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      {/* Row 1 — scrolls left */}
      <div className="flex mb-3">
        <div ref={ref1} className="flex gap-3" style={{ willChange: 'transform' }}>
          {[...row1Companies, ...row1Companies, ...row1Companies].map((c, i) => (
            <LogoCard key={i} name={c.name} domain={c.domain} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="flex">
        <div ref={ref2} className="flex gap-3" style={{ willChange: 'transform' }}>
          {[...row2Companies, ...row2Companies, ...row2Companies].map((c, i) => (
            <LogoCard key={i} name={c.name} domain={c.domain} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WhoInRoom() {
  const ref = useVis()
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
    <section id="community" className="relative py-28 px-6 overflow-hidden" style={{ background: '#080618' }}>
      <div className="bg-num" style={{ bottom: '-10%', right: '-2%' }} aria-hidden>02</div>

      {/* Subtle purple glow top-left */}
      <div aria-hidden className="absolute pointer-events-none" style={{
        top: '10%', left: '-5%', width: 500, height: 400,
        background: 'radial-gradient(ellipse, rgba(124,58,237,.07) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div ref={ref} className="sr mb-16">
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
          <div className="sg grid grid-cols-2 gap-px" style={{ border: '1px solid #1C1A32', borderRadius: 16, overflow: 'hidden', background: '#1C1A32' }}>
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

        {/* Company logo ticker */}
        <div className="mt-20">
          {/* Label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(28,26,50,.8))' }} />
            <p className="font-mono text-[10px] uppercase tracking-[.28em] flex-shrink-0" style={{ color: '#52506A' }}>
              Professionals from these companies attend GPF
            </p>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(28,26,50,.8))' }} />
          </div>

          <LogoTicker />
        </div>
      </div>
    </section>
  )
}
