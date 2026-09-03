import { useEffect, useRef } from 'react'

function useVis(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('vis'), delay); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return ref
}

export default function FloorMap() {
  const headRef = useVis()
  const mapRef = useVis(100)

  return (
    <section id="floor-map" className="relative py-24 px-6 overflow-hidden" style={{ background: '#080618', borderTop: '1px solid #1C1A32' }}>
      <div className="bg-num" style={{ top: '-6%', left: '-2%' }} aria-hidden>06</div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <div ref={headRef} className="sr mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Venue</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(36px,5vw,72px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
              Floor Map
            </h2>
            <div className="lg:text-right">
              <p className="text-base font-semibold" style={{ color: '#F0EEF8' }}>Freshworks, Building No. 32</p>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>5th Floor · RMZ Eco World · Bengaluru</p>
            </div>
          </div>
        </div>

        {/* Floor Map Grid */}
        <div ref={mapRef} className="sr">
          <div
            className="rounded-2xl p-3 sm:p-4"
            style={{ background: '#0E0C22', border: '1px solid #1C1A32' }}
          >
            {/* Top row: Main Hall + Workshop rooms */}
            <div className="grid grid-cols-5 gap-3 mb-3">

              {/* Main Hall — spans 3 cols */}
              <div
                className="col-span-5 sm:col-span-3 rounded-xl p-6 flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, #1A0A4C 0%, #120830 100%)', border: '1.5px solid #5B21B6', minHeight: 200 }}
              >
                <div>
                  <div className="text-3xl mb-3">🎤</div>
                  <p className="font-display font-bold text-xl" style={{ color: '#E9D5FF' }}>Main Hall</p>
                  <p className="text-sm mt-1" style={{ color: '#9490AD' }}>Keynotes · Panels · Fireside chats</p>
                </div>
                <div
                  className="mt-6 rounded-lg py-2 px-4 text-center text-xs font-mono font-semibold tracking-widest"
                  style={{ background: '#2D1B69', color: '#A78BFA', border: '1px solid #5B21B633' }}
                >
                  ▬ &nbsp; STAGE &nbsp; ▬
                </div>
              </div>

              {/* Workshop rooms — spans 2 cols, stacked inside */}
              <div className="col-span-5 sm:col-span-2 flex flex-col gap-3">
                {['Workshop Room 1', 'Workshop Room 2', 'Workshop Room 3'].map((name, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-4 py-3 flex items-center gap-3 flex-1"
                    style={{ background: '#160C3A', border: '1.5px solid #7C3AED55' }}
                  >
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#C4B5FD' }}>{name}</p>
                      <p className="text-xs" style={{ color: '#52506A' }}>Breakout sessions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row: Expo wide + Registration */}
            <div className="grid grid-cols-5 gap-3">

              {/* Expo & Networking — spans 3 cols */}
              <div
                className="col-span-5 sm:col-span-3 rounded-xl p-6"
                style={{ background: 'linear-gradient(135deg, #1C1000 0%, #110A00 100%)', border: '1.5px solid #F59E0B55' }}
              >
                <div className="text-3xl mb-3">🤝</div>
                <p className="font-display font-bold text-xl" style={{ color: '#FCD34D' }}>Expo & Networking</p>
                <p className="text-sm mt-1" style={{ color: '#9490AD' }}>Sponsor booths · Demos · Round tables</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {['Round Table', 'Round Table', 'Round Table'].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      style={{ background: '#1C1000', border: '1.5px solid #F59E0B44' }}
                    />
                  ))}
                </div>
              </div>

              {/* Registration — spans 2 cols */}
              <div
                className="col-span-5 sm:col-span-2 rounded-xl p-6 flex flex-col justify-between"
                style={{ background: '#031810', border: '1.5px solid #10B98155' }}
              >
                <div>
                  <div className="text-3xl mb-3">✅</div>
                  <p className="font-display font-bold text-xl" style={{ color: '#6EE7B7' }}>Registration</p>
                  <p className="text-sm mt-1" style={{ color: '#9490AD' }}>Entry & badge pickup</p>
                </div>
                <div
                  className="mt-4 flex items-center gap-2 text-xs font-mono"
                  style={{ color: '#10B981' }}
                >
                  <span>→</span>
                  <span>Lift lobby · Main entry</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs mt-5" style={{ color: '#52506A' }}>
            Detailed signage will be placed throughout the venue on the day of the event.
          </p>
        </div>

      </div>
    </section>
  )
}
