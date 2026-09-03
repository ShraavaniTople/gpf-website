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

const zones = [
  { label: 'Main Hall', sub: 'Keynotes · Panels · Stage', color: '#7C3AED', emoji: '🎤' },
  { label: 'Workshop Rooms', sub: 'Breakout sessions', color: '#8B5CF6', emoji: '💡' },
  { label: 'Expo & Networking', sub: 'Sponsor booths · Demos', color: '#F59E0B', emoji: '🤝' },
  { label: 'Registration', sub: 'Entry & badge pickup', color: '#10B981', emoji: '✅' },
  { label: 'Lunch & Lounge', sub: 'Meals & informal chats', color: '#3B82F6', emoji: '☕' },
]

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

        {/* Map */}
        <div ref={mapRef} className="sr">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #2D2B4E', position: 'relative' }}>

            {/* Actual floor plan image as base */}
            <img
              src="/floorplan.png"
              alt="Freshworks 5th Floor Plan"
              style={{ width: '100%', display: 'block', filter: 'brightness(1.05) contrast(0.75) opacity(0.55)' }}
            />

            {/* SVG overlays — positioned over the real room locations */}
            {/* viewBox matches image dimensions: 1200×819, floor area is y=10–505 */}
            <svg
              viewBox="0 0 1200 819"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              aria-hidden
            >
              {/* ── MAIN HALL (Phase-1 central open area) ── */}
              <rect x="155" y="12" width="505" height="492" fill="#7C3AED" fillOpacity="0.28" />
              <rect x="155" y="12" width="505" height="492" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeOpacity="0.7" />
              {/* Stage */}
              <rect x="225" y="390" width="360" height="90" rx="4" fill="#5B21B6" fillOpacity="0.55" />

              {/* ── WORKSHOP ROOMS (Phase-2 top-right) ── */}
              {/* Split into 3 rooms */}
              <rect x="662" y="12" width="158" height="166" fill="#8B5CF6" fillOpacity="0.30" />
              <rect x="662" y="12" width="158" height="166" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeOpacity="0.7" />
              <rect x="822" y="12" width="158" height="166" fill="#8B5CF6" fillOpacity="0.30" />
              <rect x="822" y="12" width="158" height="166" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeOpacity="0.7" />
              <rect x="982" y="12" width="180" height="166" fill="#8B5CF6" fillOpacity="0.30" />
              <rect x="982" y="12" width="180" height="166" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeOpacity="0.7" />

              {/* ── EXPO & NETWORKING (bottom-right open area) ── */}
              <rect x="662" y="320" width="500" height="184" fill="#F59E0B" fillOpacity="0.28" />
              <rect x="662" y="320" width="500" height="184" fill="none" stroke="#F59E0B" strokeWidth="2" strokeOpacity="0.7" />

              {/* ── REGISTRATION (far-right enclosed rooms) ── */}
              <rect x="1068" y="180" width="94" height="138" fill="#10B981" fillOpacity="0.35" />
              <rect x="1068" y="180" width="94" height="138" fill="none" stroke="#10B981" strokeWidth="2" strokeOpacity="0.7" />

              {/* ── LUNCH & LOUNGE (cafeteria, left side) ── */}
              <rect x="14" y="12" width="139" height="492" fill="#3B82F6" fillOpacity="0.22" />
              <rect x="14" y="12" width="139" height="492" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeOpacity="0.6" />
            </svg>

            {/* Zone labels — absolutely positioned over the map */}
            <div style={{ position: 'absolute', inset: 0 }}>

              {/* Main Hall label (center of purple zone) */}
              <div style={{
                position: 'absolute',
                left: '22%', top: '28%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 28 }}>🎤</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.8)', marginTop: 4 }}>Main Hall</div>
                <div style={{ fontSize: 10, color: '#E9D5FF', textShadow: '0 1px 4px rgba(0,0,0,0.9)', marginTop: 2 }}>Keynotes · Panels · Stage</div>
              </div>

              {/* Stage label */}
              <div style={{
                position: 'absolute',
                left: '22%', top: '73%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: '#E9D5FF', letterSpacing: 4, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>▬ STAGE ▬</div>
              </div>

              {/* Workshop Room 1 */}
              <div style={{
                position: 'absolute',
                left: '60%', top: '12%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 16 }}>💡</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.9)', marginTop: 2 }}>Workshop 1</div>
              </div>

              {/* Workshop Room 2 */}
              <div style={{
                position: 'absolute',
                left: '73%', top: '12%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 16 }}>💡</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.9)', marginTop: 2 }}>Workshop 2</div>
              </div>

              {/* Workshop Room 3 */}
              <div style={{
                position: 'absolute',
                left: '87%', top: '12%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 16 }}>💡</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.9)', marginTop: 2 }}>Workshop 3</div>
              </div>

              {/* Expo label */}
              <div style={{
                position: 'absolute',
                left: '76%', top: '65%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 20 }}>🤝</div>
                <div style={{ fontWeight: 800, fontSize: 12, color: '#FCD34D', textShadow: '0 1px 6px rgba(0,0,0,0.9)', marginTop: 3 }}>Expo &amp; Networking</div>
                <div style={{ fontSize: 9, color: '#FDE68A', textShadow: '0 1px 4px rgba(0,0,0,0.9)', marginTop: 1 }}>Sponsor booths · Demos</div>
              </div>

              {/* Registration label */}
              <div style={{
                position: 'absolute',
                left: '93%', top: '35%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 14 }}>✅</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#6EE7B7', textShadow: '0 1px 4px rgba(0,0,0,0.9)', marginTop: 2 }}>Registration</div>
              </div>

              {/* Lunch label */}
              <div style={{
                position: 'absolute',
                left: '5%', top: '35%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
                writingMode: 'vertical-rl',
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#93C5FD', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>Lunch &amp; Lounge ☕</div>
              </div>

              {/* Entry arrow */}
              <div style={{
                position: 'absolute',
                right: '2%', top: '33%',
                pointerEvents: 'none',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#10B981', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>ENTRY →</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            {zones.map(z => (
              <div key={z.label} className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{ background: '#0E0C22', border: `1px solid ${z.color}44` }}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: z.color }} />
                <span className="text-xs font-medium" style={{ color: '#D1D5DB' }}>{z.label}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-5" style={{ color: '#52506A' }}>
            Detailed signage will be placed throughout the venue on the day of the event.
          </p>
        </div>

      </div>
    </section>
  )
}
