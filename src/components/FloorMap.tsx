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

        {/* Map */}
        <div ref={mapRef} className="sr">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #2D2B4E' }}>
            <svg
              viewBox="0 0 1100 560"
              width="100%"
              aria-label="Freshworks 5th Floor — Event Layout"
              style={{ display: 'block' }}
            >
              {/* ── Background / floor base ── */}
              <rect width="1100" height="560" fill="#0D0B1F" />

              {/* Floor outline — matches actual building footprint (wide, slightly irregular) */}
              {/* Main floor body */}
              <path
                d="M 30 30 L 850 30 L 850 80 L 1070 80 L 1070 480 L 850 480 L 850 530 L 30 530 Z"
                fill="#13112A"
                stroke="#2D2B4E"
                strokeWidth="2.5"
              />

              {/* ══════════════════════════════════
                  ZONE 1 — MAIN HALL + STAGE
                  Large open area, left/centre
              ══════════════════════════════════ */}
              <rect x="40" y="40" width="500" height="350" rx="4" fill="#1A0A4C" fillOpacity="0.85" />
              <rect x="40" y="40" width="500" height="350" rx="4" fill="none" stroke="#7C3AED" strokeWidth="2.5" />
              {/* Stage platform */}
              <rect x="110" y="290" width="360" height="80" rx="5" fill="#2D1B69" />
              <rect x="110" y="290" width="360" height="80" rx="5" fill="none" stroke="#5B21B6" strokeWidth="1.5" />
              <text x="290" y="337" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fill="#A78BFA" fontWeight="700" letterSpacing="5">▬  STAGE  ▬</text>
              {/* Label */}
              <text x="290" y="130" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="30" fill="#E9D5FF">🎤</text>
              <text x="290" y="190" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="26" fill="#E9D5FF" fontWeight="800">Main Hall</text>
              <text x="290" y="220" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="#9490AD">Keynotes · Panels · Fireside chats</text>

              {/* ══════════════════════════════════
                  ZONE 2 — EXPO & NETWORKING
                  Wide bottom strip
              ══════════════════════════════════ */}
              <rect x="40" y="408" width="790" height="112" rx="4" fill="#1C1000" fillOpacity="0.9" />
              <rect x="40" y="408" width="790" height="112" rx="4" fill="none" stroke="#F59E0B" strokeWidth="2" />
              {/* Round table indicators */}
              {[130, 270, 410, 550, 690].map((cx, i) => (
                <g key={i}>
                  <circle cx={cx} cy={488} r={22} fill="#251400" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />
                  <circle cx={cx} cy={488} r={8} fill="#2C1A02" />
                </g>
              ))}
              {/* Label */}
              <text x="415" y="445" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="18" fill="#FCD34D" fontWeight="800">Expo &amp; Networking</text>
              <text x="415" y="463" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#9490AD">Sponsor booths · Demos · Round tables</text>

              {/* ══════════════════════════════════
                  ZONE 3 — WORKSHOP ROOMS
                  Top right, 3 rooms side by side
              ══════════════════════════════════ */}
              {/* Outer container label */}
              <text x="700" y="72" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#6B7280" letterSpacing="2" fontWeight="600">WORKSHOP ROOMS</text>
              {/* Room 1 */}
              <rect x="558" y="82" width="94" height="158" rx="3" fill="#160C3A" />
              <rect x="558" y="82" width="94" height="158" rx="3" fill="none" stroke="#7C3AED" strokeWidth="1.5" />
              <text x="605" y="145" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="18" fill="#C4B5FD">💡</text>
              <text x="605" y="170" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#C4B5FD" fontWeight="700">Room 1</text>
              {/* Room 2 */}
              <rect x="660" y="82" width="94" height="158" rx="3" fill="#160C3A" />
              <rect x="660" y="82" width="94" height="158" rx="3" fill="none" stroke="#7C3AED" strokeWidth="1.5" />
              <text x="707" y="145" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="18" fill="#C4B5FD">💡</text>
              <text x="707" y="170" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#C4B5FD" fontWeight="700">Room 2</text>
              {/* Room 3 */}
              <rect x="762" y="82" width="94" height="158" rx="3" fill="#160C3A" />
              <rect x="762" y="82" width="94" height="158" rx="3" fill="none" stroke="#7C3AED" strokeWidth="1.5" />
              <text x="809" y="145" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="18" fill="#C4B5FD">💡</text>
              <text x="809" y="170" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#C4B5FD" fontWeight="700">Room 3</text>

              {/* ══════════════════════════════════
                  ZONE 4 — LUNCH & LOUNGE
                  Right side mid area (cafeteria)
              ══════════════════════════════════ */}
              <rect x="558" y="256" width="298" height="144" rx="3" fill="#051020" />
              <rect x="558" y="256" width="298" height="144" rx="3" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="707" y="318" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="20" fill="#60A5FA">☕</text>
              <text x="707" y="348" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="14" fill="#93C5FD" fontWeight="700">Lunch &amp; Lounge</text>
              <text x="707" y="366" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#52506A">Meals &amp; informal chats</text>

              {/* ══════════════════════════════════
                  ZONE 5 — REGISTRATION
                  Far right, near lifts (entry)
              ══════════════════════════════════ */}
              <rect x="870" y="90" width="188" height="260" rx="3" fill="#031810" />
              <rect x="870" y="90" width="188" height="260" rx="3" fill="none" stroke="#10B981" strokeWidth="2" />
              <text x="964" y="180" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="28" fill="#6EE7B7">✅</text>
              <text x="964" y="215" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="16" fill="#6EE7B7" fontWeight="800">Registration</text>
              <text x="964" y="237" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#9490AD">Entry &amp; badge pickup</text>
              <text x="964" y="260" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#52506A">Lift lobby</text>

              {/* ── Entry arrow (from outside right) ── */}
              <defs>
                <marker id="ea" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#10B981" />
                </marker>
              </defs>
              <line x1="1090" y1="220" x2="1062" y2="220" stroke="#10B981" strokeWidth="2.5" markerEnd="url(#ea)" />
              <text x="1093" y="215" textAnchor="start" fontFamily="Inter, sans-serif" fontSize="9" fill="#10B981" fontWeight="700">ENTRY</text>

              {/* ── Corridor strip between zones ── */}
              <rect x="558" y="248" width="298" height="10" rx="0" fill="#0D0B1F" />
              <rect x="548" y="248" width="8" height="162" rx="0" fill="#0D0B1F" />

              {/* ── Walls / partition lines ── */}
              {/* Vertical wall between main hall and workshop zones */}
              <line x1="548" y1="40" x2="548" y2="400" stroke="#2D2B4E" strokeWidth="2" />
              {/* Corridor between main hall bottom and expo */}
              <rect x="40" y="396" width="810" height="14" fill="#0D0B1F" />

              {/* ── Floor note ── */}
              <text x="550" y="549" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#3D3B5A">5th Floor · Freshworks Bldg 32 · Not to scale</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            {[
              { color: '#7C3AED', label: 'Main Hall' },
              { color: '#A78BFA', label: 'Workshop Rooms' },
              { color: '#F59E0B', label: 'Expo & Networking' },
              { color: '#10B981', label: 'Registration' },
              { color: '#3B82F6', label: 'Lunch & Lounge' },
            ].map(z => (
              <div key={z.label} className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{ background: '#0E0C22', border: `1px solid ${z.color}33` }}>
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
