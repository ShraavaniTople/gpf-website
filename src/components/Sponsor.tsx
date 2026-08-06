import { useEffect, useRef } from 'react'

interface Props { onRequest: () => void }

const reasons = [
  { n: '01', title: 'Targeted Reach', body: 'Connect with CPOs, Founders, PMs, and product practitioners. The exact people you need in the room.' },
  { n: '02', title: 'Brand Authority', body: "Align your brand with India's most credible product conference and the WiP India community." },
  { n: '03', title: 'Pipeline Access', body: 'Meet your next customers, partners, and hires. All in one high-intent space.' },
  { n: '04', title: 'Custom Integration', body: 'From keynotes to workshops, build a partnership shaped around your goals.' },
]

function useVis(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('vis'), delay); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return ref
}

export default function Sponsor({ onRequest }: Props) {
  const leftRef = useVis()
  const rightRef = useVis(150)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = photoRef.current; if (!el) return
    const fn = () => {
      const rect = el.getBoundingClientRect()
      const off = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.15
      const img = el.querySelector('img') as HTMLImageElement
      if (img) img.style.transform = `translateY(${off}px) scale(1.2)`
    }
    window.addEventListener('scroll', fn, { passive: true }); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <section id="sponsor" className="relative py-28 px-6 overflow-hidden" style={{ background: '#080618' }}>
      <div className="bg-num" style={{ top: '-5%', right: '-2%' }} aria-hidden>06</div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div ref={leftRef} className="sr-l">
            <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Sponsor</p>
            <h2 className="font-display font-extrabold leading-none mb-8" style={{ fontSize: 'clamp(40px,5.5vw,72px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
              Partner with<br />GPF 2026
            </h2>
            <p className="text-base leading-relaxed mb-12 max-w-md" style={{ color: '#6B7280' }}>
              Position your brand in front of India's most engaged community of product builders and leaders.
            </p>

            <ul className="space-y-6 mb-12">
              {reasons.map((r) => (
                <li key={r.n} className="flex gap-5 py-5 border-b" style={{ borderColor: '#1C1A32' }}>
                  <span className="font-mono text-xs mt-0.5 flex-shrink-0" style={{ color: '#52506A' }}>{r.n}</span>
                  <div>
                    <p className="font-display font-bold text-sm mb-1" style={{ color: '#F0EEF8' }}>{r.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{r.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button onClick={onRequest} className="btn-purple text-sm">Request Sponsorship Details</button>
            <p className="text-xs mt-3" style={{ color: '#52506A', fontFamily: 'JetBrains Mono, monospace' }}>We will get back to you within 2 business days.</p>
          </div>

          <div ref={rightRef} className="sr-r hidden lg:block">
            <div ref={photoRef} className="rounded-2xl overflow-hidden" style={{ height: 540, position: 'relative' }}>
              <img src="/photos/sponsor-audience.png" alt="Conference audience" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,24,.9) 0%, rgba(8,6,24,.2) 55%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
                <p className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: '#F59E0B' }}>GPF 2026</p>
                <p className="font-display font-bold text-2xl leading-tight" style={{ color: '#F0EEF8', letterSpacing: '-0.03em' }}>India's Most Inclusive Product Conference</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
