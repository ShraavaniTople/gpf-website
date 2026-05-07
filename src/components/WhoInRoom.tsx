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

// slug = Simple Icons CDN slug (https://simpleicons.org)
// null slug = text-only fallback
const row1Companies = [
  { name: 'Google',          slug: 'google' },
  { name: 'Amazon',          slug: 'amazon' },
  { name: 'Microsoft',       slug: 'microsoft' },
  { name: 'Salesforce',      slug: 'salesforce' },
  { name: 'Stripe',          slug: 'stripe' },
  { name: 'Uber',            slug: 'uber' },
  { name: 'Lenovo',          slug: 'lenovo' },
  { name: 'Dell',            slug: 'dell' },
  { name: 'HSBC',            slug: 'hsbc' },
  { name: 'Wells Fargo',     slug: 'wellsfargo' },
  { name: 'Bank of America', slug: 'bankofamerica' },
  { name: 'Best Buy',        slug: 'bestbuy' },
]

const row2Companies = [
  { name: 'Razorpay',    slug: 'razorpay' },
  { name: 'Swiggy',      slug: 'swiggy' },
  { name: 'Zepto',       slug: null },
  { name: 'Fractal',     slug: null },
  { name: 'Odessa',      slug: null },
  { name: 'Milestone',   slug: null },
  { name: 'Freshworks',  slug: 'freshworks' },
  { name: 'Zoho',        slug: 'zoho' },
  { name: 'PhonePe',     slug: 'phonepe' },
  { name: 'Flipkart',    slug: 'flipkart' },
  { name: 'Zomato',      slug: 'zomato' },
  { name: 'Meesho',      slug: null },
]

function LogoCard({ name, slug }: { name: string; slug: string | null }) {
  const [err, setErr] = useState(false)
  const showImg = slug && !err

  return (
    <div
      className="flex-shrink-0 flex items-center gap-2.5 px-4"
      style={{
        height: 44,
        borderRadius: 999,
        background: 'rgba(240,238,248,0.05)',
        border: '1px solid rgba(240,238,248,0.09)',
        cursor: 'default',
        transition: 'background .2s, border-color .2s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.12)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.35)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(240,238,248,0.05)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,238,248,0.09)'
      }}
    >
      {showImg && (
        <img
          src={`https://cdn.simpleicons.org/${slug}/ffffff`}
          alt=""
          onError={() => setErr(true)}
          style={{ width: 16, height: 16, objectFit: 'contain', opacity: 0.6, flexShrink: 0 }}
        />
      )}
      <span
        className="font-display font-semibold tracking-tight"
        style={{ fontSize: 13, color: 'rgba(240,238,248,0.6)' }}
      >
        {name}
      </span>
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
      let pos = dir === -1 ? el.scrollWidth / 3 : 0
      let raf: number
      let paused = false
      const tick = () => {
        if (!paused) {
          pos += speed * dir
          if (dir === 1 && pos >= el.scrollWidth / 3) pos = 0
          if (dir === -1 && pos <= 0) pos = el.scrollWidth / 3
          el.style.transform = `translateX(${-pos}px)`
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      const pause = () => { paused = true }
      const resume = () => { paused = false }
      el.addEventListener('mouseenter', pause)
      el.addEventListener('mouseleave', resume)
      return () => { cancelAnimationFrame(raf); el.removeEventListener('mouseenter', pause); el.removeEventListener('mouseleave', resume) }
    }
    const c1 = animate(ref1.current, 0.45, 1)
    const c2 = animate(ref2.current, 0.38, -1)
    return () => { c1(); c2() }
  }, [])

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div className="flex mb-3">
        <div ref={ref1} className="flex gap-3" style={{ willChange: 'transform' }}>
          {[...row1Companies, ...row1Companies, ...row1Companies].map((c, i) => (
            <LogoCard key={i} name={c.name} slug={c.slug} />
          ))}
        </div>
      </div>
      <div className="flex">
        <div ref={ref2} className="flex gap-3" style={{ willChange: 'transform' }}>
          {[...row2Companies, ...row2Companies, ...row2Companies].map((c, i) => (
            <LogoCard key={i} name={c.name} slug={c.slug} />
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
          <div className="grid grid-cols-2 gap-px" style={{ border: '1px solid #1C1A32', borderRadius: 16, overflow: 'hidden', background: '#1C1A32' }}>
            {stats.map((s, i) => (
              <div key={i} className="p-7 flex flex-col gap-2" style={{ background: '#080618' }}>
                <span className="font-display font-extrabold grad" style={{ fontSize: 'clamp(32px,4vw,48px)', letterSpacing: '-0.04em' }}>{s.n}</span>
                <span className="text-sm leading-snug" style={{ color: '#6B7280' }}>{s.label}</span>
              </div>
            ))}
          </div>

          <div ref={photoRef} className="px-wrap rounded-2xl overflow-hidden" style={{ height: 320 }}>
            <img src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=900&q=80" alt="Panel discussion" style={{ height: '120%', width: '100%', objectFit: 'cover' }} />
            <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,24,.7) 0%, transparent 60%)' }} />
          </div>
        </div>

        {/* Ticker */}
        <div className="mt-20">
          <p className="font-mono text-[10px] uppercase tracking-[.25em] mb-6 text-center" style={{ color: '#3D3A56' }}>
            Attendees come from teams at
          </p>
          <LogoTicker />
        </div>
      </div>
    </section>
  )
}
