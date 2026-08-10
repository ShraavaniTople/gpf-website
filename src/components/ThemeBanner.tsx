import { useEffect, useRef } from 'react'

function useVis() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } }, { threshold: 0.15 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

export default function ThemeBanner() {
  const ref = useVis()

  return (
    <section className="relative overflow-hidden" style={{ background: '#05040C' }}>
      {/* Top fade for seamless blending */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #05040C, transparent)' }} />

      <div ref={ref} className="sr relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="relative rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(124,58,237,.15)' }}>
          {/* Background */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0d0a20 0%, #110c2e 50%, #0d0a20 100%)' }} />

          {/* Large decorative glows */}
          <div aria-hidden className="absolute pointer-events-none" style={{ top: '-20%', left: '-5%', width: '45%', height: '140%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.1) 0%, transparent 60%)' }} />
          <div aria-hidden className="absolute pointer-events-none" style={{ top: '-30%', right: '-5%', width: '40%', height: '130%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,.06) 0%, transparent 60%)' }} />

          {/* Horizontal accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,.4), rgba(245,158,11,.3), transparent)' }} />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-24">
            <p className="font-mono text-[11px] md:text-xs uppercase tracking-[.3em] mb-6" style={{ color: '#7C3AED' }}>
              Conference Theme
            </p>

            <h2 className="font-display font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(48px, 10vw, 120px)', letterSpacing: '-0.05em', color: '#F0EEF8' }}>
              The Infinite
            </h2>
            <h2 className="font-display font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(48px, 10vw, 120px)', letterSpacing: '-0.05em', background: 'linear-gradient(90deg, #7C3AED, #C084FC, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Builders
            </h2>

            <div className="w-16 h-[2px] mt-8 mb-6 rounded-full" style={{ background: 'linear-gradient(90deg, #7C3AED, #F59E0B)' }} />

            <p className="text-base md:text-lg leading-relaxed max-w-xl" style={{ color: '#6B7280' }}>
              Building products, companies, and careers without limits — the era of the infinite builders starts here.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
