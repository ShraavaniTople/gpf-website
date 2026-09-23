import { useEffect, useRef } from 'react'

function useVis(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('vis'), delay); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return ref
}

export default function Venue() {
  const ref = useVis()

  return (
    <section id="venue" className="relative py-16 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ borderTop: '1px solid #1C1A32' }}>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div ref={ref} className="sr">

          {/* Section label */}
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Venue</p>
          <h2 className="font-display font-extrabold leading-none mb-12"
            style={{ fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
            Moving Around
          </h2>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left — map image (constrained width) */}
            <div className="rounded-2xl overflow-hidden mx-auto w-full" style={{ border: '1px solid #1C1A32', maxWidth: 340 }}>
              <img
                src="/venue-map.png"
                alt="Walking route between Freshworks Building 32 and Toast Campus 20/20C"
                className="w-full h-auto block"
              />
            </div>

            {/* Right — venue details */}
            <div className="flex flex-col gap-6 lg:pt-2">
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: '#B8B4D4' }}>
                TGPF 2026 is spread across two offices — Freshworks and Toast — both inside RMZ Ecoworld, Bengaluru. They're about a 2-minute walk from each other, so you can move between sessions without any hassle.
              </p>

              {/* Freshworks */}
              <div className="rounded-xl p-5" style={{ background: '#0A0817', border: '1px solid #1E1B35' }}>
                <p className="font-display font-bold text-base mb-2" style={{ color: '#F0EEF8' }}>Freshworks</p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#7C78A5' }}>
                  Campus 32, 5th Floor, RMZ Ecoworld, Sarjapur–Marathahalli Outer Ring Road, Bengaluru 560103
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Freshworks+Campus+32+RMZ+Ecoworld+Sarjapur+Marathahalli+Ring+Road+Bengaluru"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono"
                  style={{ color: '#7C3AED' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Open in Google Maps
                </a>
              </div>

              {/* Toast */}
              <div className="rounded-xl p-5" style={{ background: '#0A0817', border: '1px solid #1E1B35' }}>
                <p className="font-display font-bold text-base mb-2" style={{ color: '#F0EEF8' }}>Toast</p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#7C78A5' }}>
                  5th Floor, Campus 20/20C, RMZ Ecoworld, Bellandur, Bengaluru 560103
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Toast+Campus+20+RMZ+Ecoworld+Bellandur+Bengaluru"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono"
                  style={{ color: '#7C3AED' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Open in Google Maps
                </a>
              </div>

              {/* Parking note */}
              <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#A78BFA' }}>
                  You can park at either building. Check each session's venue tag in the agenda and use the map to walk across.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
