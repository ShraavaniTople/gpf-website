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

const stats = [
  { n: '60%', label: 'Product Managers and Leaders' },
  { n: '20%', label: 'Founders and Entrepreneurs' },
  { n: '12%', label: 'Engineers and Designers' },
  { n: '8%',  label: 'Investors and VCs' },
]

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

        {/* Company carousel placeholder */}
        <div className="mt-14 rounded-2xl flex items-center justify-center py-14"
          style={{ border: '1px dashed rgba(28,26,50,.8)', background: 'rgba(13,11,31,.4)' }}>
          <p className="font-mono text-xs uppercase tracking-[.25em]" style={{ color: '#52506A' }}>Company logos carousel, coming soon</p>
        </div>
      </div>
    </section>
  )
}
