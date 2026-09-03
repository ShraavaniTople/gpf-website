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
  { id: 'mainstage', label: 'Main Stage', sublabel: 'Keynotes & panels', color: '#5B21B6', icon: '🎤' },
  { id: 'workshop', label: 'Workshop Rooms', sublabel: '3 breakout rooms', color: '#7C3AED', icon: '💡' },
  { id: 'expo', label: 'Expo & Networking', sublabel: 'Sponsor booths & demos', color: '#F59E0B', icon: '🤝' },
  { id: 'registration', label: 'Registration', sublabel: 'Entry & badge pickup', color: '#10B981', icon: '✅' },
  { id: 'lunch', label: 'Lunch & Lounge', sublabel: 'Meals & informal chats', color: '#3B82F6', icon: '☕' },
]

export default function FloorMap() {
  const headRef = useVis()
  const mapRef = useVis(100)
  const legendRef = useVis(180)

  return (
    <section id="floor-map" className="relative py-24 px-6 overflow-hidden" style={{ background: '#080618', borderTop: '1px solid #1C1A32' }}>
      <div className="bg-num" style={{ top: '-6%', left: '-2%' }} aria-hidden>06</div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headRef} className="sr mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Venue</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(36px,5vw,72px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
              Floor Map
            </h2>
            <div className="lg:text-right">
              <p className="text-base font-semibold" style={{ color: '#F0EEF8' }}>Freshworks, Building No. 32</p>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>5th Floor · RMZ Eco World Rd, Bengaluru</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div ref={mapRef} className="sr">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1C1A32', background: '#0E0C22' }}>
            <svg
              viewBox="0 0 900 520"
              width="100%"
              aria-label="Freshworks 5th Floor Map"
              style={{ display: 'block' }}
            >
              {/* Floor outline */}
              <rect x="20" y="20" width="860" height="480" rx="12" fill="#13112A" stroke="#2D2B4E" strokeWidth="2" />

              {/* ── REGISTRATION (right side, entry) ── */}
              <rect x="710" y="30" width="160" height="130" rx="8" fill="#052E1C" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6,3" />
              <text x="790" y="72" textAnchor="middle" fill="#10B981" fontSize="13" fontFamily="monospace" fontWeight="700">✅</text>
              <text x="790" y="92" textAnchor="middle" fill="#10B981" fontSize="12" fontFamily="sans-serif" fontWeight="700">Registration</text>
              <text x="790" y="110" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="sans-serif">Entry &amp; badge pickup</text>
              <text x="790" y="126" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="sans-serif">← Lift lobby</text>

              {/* ── WORKSHOP ROOMS (top right) ── */}
              <rect x="460" y="30" width="235" height="130" rx="8" fill="#1A0A4C" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="6,3" />
              <text x="577" y="72" textAnchor="middle" fill="#A78BFA" fontSize="13" fontFamily="monospace" fontWeight="700">💡</text>
              <text x="577" y="92" textAnchor="middle" fill="#A78BFA" fontSize="12" fontFamily="sans-serif" fontWeight="700">Workshop Rooms</text>
              <text x="577" y="110" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="sans-serif">3 breakout rooms</text>
              {/* room dividers */}
              <line x1="537" y1="35" x2="537" y2="155" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="617" y1="35" x2="617" y2="155" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.4" />
              <text x="498" y="148" textAnchor="middle" fill="#52506A" fontSize="9" fontFamily="monospace">W1</text>
              <text x="577" y="148" textAnchor="middle" fill="#52506A" fontSize="9" fontFamily="monospace">W2</text>
              <text x="657" y="148" textAnchor="middle" fill="#52506A" fontSize="9" fontFamily="monospace">W3</text>

              {/* ── MAIN STAGE (left, large) ── */}
              <rect x="30" y="30" width="415" height="280" rx="8" fill="#1A0A4C" stroke="#5B21B6" strokeWidth="2" />
              <text x="237" y="120" textAnchor="middle" fill="#C4B5FD" fontSize="16" fontFamily="monospace" fontWeight="700">🎤</text>
              <text x="237" y="148" textAnchor="middle" fill="#E9D5FF" fontSize="18" fontFamily="sans-serif" fontWeight="800">Main Stage</text>
              <text x="237" y="172" textAnchor="middle" fill="#6B7280" fontSize="12" fontFamily="sans-serif">Keynotes &amp; panel discussions</text>
              {/* stage indicator */}
              <rect x="137" y="240" width="200" height="40" rx="6" fill="#2D1B69" stroke="#5B21B6" strokeWidth="1" />
              <text x="237" y="266" textAnchor="middle" fill="#A78BFA" fontSize="11" fontFamily="monospace" fontWeight="600">▬▬ STAGE ▬▬</text>

              {/* ── EXPO & NETWORKING (bottom center-right) ── */}
              <rect x="30" y="330" width="540" height="160" rx="8" fill="#2C1A02" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6,3" />
              <text x="300" y="390" textAnchor="middle" fill="#F59E0B" fontSize="13" fontFamily="monospace" fontWeight="700">🤝</text>
              <text x="300" y="412" textAnchor="middle" fill="#FCD34D" fontSize="14" fontFamily="sans-serif" fontWeight="800">Expo &amp; Networking</text>
              <text x="300" y="432" textAnchor="middle" fill="#6B7280" fontSize="11" fontFamily="sans-serif">Sponsor booths · Demos · Round tables</text>
              {/* round table indicators */}
              {[80, 180, 280, 380, 480].map((cx, i) => (
                <circle key={i} cx={cx} cy={472} r="14" fill="none" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.35" />
              ))}

              {/* ── LUNCH & LOUNGE (bottom right) ── */}
              <rect x="590" y="175" width="280" height="315" rx="8" fill="#051020" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="6,3" />
              <text x="730" y="285" textAnchor="middle" fill="#60A5FA" fontSize="13" fontFamily="monospace" fontWeight="700">☕</text>
              <text x="730" y="307" textAnchor="middle" fill="#93C5FD" fontSize="13" fontFamily="sans-serif" fontWeight="700">Lunch &amp; Lounge</text>
              <text x="730" y="325" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="sans-serif">Meals &amp; informal chats</text>

              {/* ── Corridors / Circulation ── */}
              <rect x="460" y="170" width="115" height="145" rx="4" fill="#0E0C22" stroke="#2D2B4E" strokeWidth="1" />
              <text x="517" y="248" textAnchor="middle" fill="#52506A" fontSize="10" fontFamily="sans-serif">Corridor</text>

              {/* Compass / North indicator */}
              <text x="860" y="510" textAnchor="end" fill="#52506A" fontSize="9" fontFamily="monospace">Phase 1 · 5th Floor · Not to scale</text>

              {/* Entry arrow */}
              <path d="M870 90 L840 90" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="880" y="94" textAnchor="middle" fill="#10B981" fontSize="10" fontFamily="sans-serif">IN</text>
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#10B981" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div ref={legendRef} className="sr mt-8 flex flex-wrap gap-3 justify-center">
          {zones.map(z => (
            <div key={z.id} className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: '#0E0C22', border: `1px solid ${z.color}33` }}>
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: z.color }} />
              <span className="text-xs font-medium" style={{ color: '#D1D5DB' }}>{z.label}</span>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs mt-6" style={{ color: '#52506A' }}>
          Detailed signage will be placed throughout the venue on the day of the event.
        </p>

      </div>
    </section>
  )
}
