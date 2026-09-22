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
            Getting Here
          </h2>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left — map image */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1C1A32' }}>
              <img
                src="/venue-map.jpg"
                alt="Venue map showing walking route between Freshworks Building 32 and Toast Campus 20/20C"
                className="w-full h-auto block"
              />
            </div>

            {/* Right — venue details */}
            <div className="flex flex-col gap-8 lg:pt-2">
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: '#B8B4D4' }}>
                TGPF 2026 takes place across Freshworks and the Toast offices at RMZ Ecoworld, Bengaluru,
                both within 2–3 mins of walking distance of each other.
              </p>

              {/* Freshworks */}
              <div className="rounded-xl p-5" style={{ background: '#0A0817', border: '1px solid #1E1B35' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#3B7FFF' }} />
                  <p className="font-display font-bold text-base" style={{ color: '#F0EEF8' }}>Freshworks</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#7C78A5' }}>
                  Campus 32, 5th Floor, RMZ Ecoworld, Sarjapur – Marathahalli Outer Ring Road,
                  Bhoganahalli Village, Varthur Hobli, Bengaluru, Karnataka – 560103, India.
                </p>
              </div>

              {/* Toast */}
              <div className="rounded-xl p-5" style={{ background: '#0A0817', border: '1px solid #1E1B35' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#E5103A' }} />
                  <p className="font-display font-bold text-base" style={{ color: '#F0EEF8' }}>Toast</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#7C78A5' }}>
                  5th Floor, Campus 20, 20C, RMZ Ecoworld Rd, Adarsh Palm Retreat Villas,
                  Bellandur, Bengaluru, Karnataka 560103.
                </p>
              </div>

              {/* Parking note */}
              <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#A78BFA' }}>
                  Pass holders can park at either Freshworks or Toast and attend sessions across both venues.
                  Please check the agenda for the venue of each session and use the map to navigate between locations.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
