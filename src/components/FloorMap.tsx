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

        {/* Map — clean illustrated SVG, Cypher-style */}
        <div ref={mapRef} className="sr">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #2D2B4E', background: '#F5F2FF' }}>
            <svg
              viewBox="0 0 960 580"
              width="100%"
              aria-label="TGPF 2026 Venue Map — Freshworks 5th Floor"
              style={{ display: 'block', fontFamily: "'Inter', sans-serif" }}
            >
              {/* ── MAP BACKGROUND ── */}
              <rect width="960" height="580" fill="#F0ECFF" />

              {/* ── ZONE LABELS ABOVE MAP (Cypher style) ── */}
              <defs>
                <marker id="da" viewBox="0 0 8 8" refX="4" refY="8" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M1,1 L4,7 L7,1" stroke="#6D6A8A" strokeWidth="1.5" fill="none" />
                </marker>
                <marker id="da-green" viewBox="0 0 8 8" refX="4" refY="8" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M1,1 L4,7 L7,1" stroke="#10B981" strokeWidth="1.5" fill="none" />
                </marker>
              </defs>

              {/* Label: MAIN HALL */}
              <text x="248" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4C1D95" letterSpacing="2">MAIN HALL</text>
              <line x1="248" y1="26" x2="248" y2="52" stroke="#6D6A8A" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#da)" />

              {/* Label: WORKSHOP ROOMS */}
              <text x="680" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#4C1D95" letterSpacing="2">WORKSHOP ROOMS</text>
              <line x1="620" y1="26" x2="595" y2="52" stroke="#6D6A8A" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#da)" />
              <line x1="680" y1="26" x2="720" y2="52" stroke="#6D6A8A" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#da)" />
              <line x1="748" y1="26" x2="845" y2="52" stroke="#6D6A8A" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#da)" />

              {/* Label: EXPO */}
              <text x="248" y="560" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E" letterSpacing="2">EXPO &amp; NETWORKING</text>
              <line x1="248" y1="554" x2="248" y2="530" stroke="#6D6A8A" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#da)" />

              {/* Label: REGISTRATION */}
              <text x="942" y="310" textAnchor="middle" fontSize="9" fontWeight="700" fill="#065F46" letterSpacing="1"
                transform="rotate(90 942 310)">REGISTRATION</text>
              <line x1="920" y1="310" x2="905" y2="310" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3,2" markerEnd="url(#da-green)" />

              {/* ════════════════════════════════════════════
                  BUILDING OUTLINE — L-shape (Phase-1 + Phase-2)
                  Phase-1: left tall rectangle x=35,y=55 → x=500,y=545
                  Phase-2: upper-right x=500,y=55 → x=920,y=300
              ════════════════════════════════════════════ */}
              <path
                d="M 35,55 L 920,55 L 920,300 L 500,300 L 500,545 L 35,545 Z"
                fill="#FFFFFF"
                stroke="#3D3B5A"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* ── Internal wall lines ── */}
              {/* Vertical wall: Phase-1 / Phase-2 boundary */}
              <line x1="500" y1="55" x2="500" y2="300" stroke="#3D3B5A" strokeWidth="2.5" />
              {/* Horizontal wall: Main Hall / Expo split */}
              <line x1="35" y1="400" x2="500" y2="400" stroke="#3D3B5A" strokeWidth="2" />
              {/* Corridor indicator */}
              <line x1="35" y1="408" x2="500" y2="408" stroke="#3D3B5A" strokeWidth="0.5" strokeDasharray="4,3" />
              {/* Phase-2 room dividers (3 workshop rooms) */}
              <line x1="640" y1="55" x2="640" y2="300" stroke="#3D3B5A" strokeWidth="2" />
              <line x1="780" y1="55" x2="780" y2="300" stroke="#3D3B5A" strokeWidth="2" />

              {/* ════════════════════════════════════════════
                  ZONE A — MAIN HALL (Phase-1 upper area)
              ════════════════════════════════════════════ */}
              <rect x="35" y="55" width="465" height="345" fill="#7C3AED" fillOpacity="0.18" />
              {/* Stage platform */}
              <rect x="100" y="318" width="330" height="68" rx="5"
                fill="#7C3AED" fillOpacity="0.45" stroke="#5B21B6" strokeWidth="1.5" />
              <text x="265" y="358" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700" letterSpacing="5">▬  STAGE  ▬</text>
              {/* Zone label */}
              <text x="240" y="175" textAnchor="middle" fontSize="28" fill="#6D28D9">🎤</text>
              <text x="240" y="220" textAnchor="middle" fontSize="20" fill="#3B0764" fontWeight="800">Main Hall</text>
              <text x="240" y="244" textAnchor="middle" fontSize="11" fill="#6D28D9">Keynotes · Panels · Fireside Chats</text>

              {/* ════════════════════════════════════════════
                  ZONE B — WORKSHOP ROOM 1 (left of Phase-2)
              ════════════════════════════════════════════ */}
              <rect x="500" y="55" width="140" height="245" fill="#8B5CF6" fillOpacity="0.22" />
              <text x="570" y="160" textAnchor="middle" fontSize="20" fill="#5B21B6">💡</text>
              <text x="570" y="190" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Workshop</text>
              <text x="570" y="206" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Room 1</text>

              {/* ════════════════════════════════════════════
                  ZONE C — WORKSHOP ROOM 2 (middle of Phase-2)
              ════════════════════════════════════════════ */}
              <rect x="640" y="55" width="140" height="245" fill="#8B5CF6" fillOpacity="0.22" />
              <text x="710" y="160" textAnchor="middle" fontSize="20" fill="#5B21B6">💡</text>
              <text x="710" y="190" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Workshop</text>
              <text x="710" y="206" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Room 2</text>

              {/* ════════════════════════════════════════════
                  ZONE D — WORKSHOP ROOM 3 (right of Phase-2)
              ════════════════════════════════════════════ */}
              <rect x="780" y="55" width="140" height="245" fill="#8B5CF6" fillOpacity="0.22" />
              <text x="850" y="160" textAnchor="middle" fontSize="20" fill="#5B21B6">💡</text>
              <text x="850" y="190" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Workshop</text>
              <text x="850" y="206" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Room 3</text>

              {/* ════════════════════════════════════════════
                  ZONE E — LUNCH & LOUNGE (lower Phase-2 left)
              ════════════════════════════════════════════ */}
              <rect x="500" y="300" width="280" height="245" fill="#3B82F6" fillOpacity="0.18" />
              <line x1="780" y1="300" x2="780" y2="545" stroke="#3D3B5A" strokeWidth="2" />
              <text x="640" y="408" textAnchor="middle" fontSize="20" fill="#2563EB">☕</text>
              <text x="640" y="438" textAnchor="middle" fontSize="13" fill="#1E3A8A" fontWeight="700">Lunch &amp; Lounge</text>
              <text x="640" y="456" textAnchor="middle" fontSize="10" fill="#3B82F6">Meals &amp; informal chats</text>

              {/* ════════════════════════════════════════════
                  ZONE F — REGISTRATION (lower Phase-2 right, near lift)
              ════════════════════════════════════════════ */}
              <rect x="780" y="300" width="140" height="245" fill="#10B981" fillOpacity="0.20" />
              <text x="850" y="395" textAnchor="middle" fontSize="22" fill="#059669">✅</text>
              <text x="850" y="425" textAnchor="middle" fontSize="13" fill="#064E3B" fontWeight="800">Registration</text>
              <text x="850" y="443" textAnchor="middle" fontSize="9" fill="#065F46">Entry &amp; badge pickup</text>
              <text x="850" y="458" textAnchor="middle" fontSize="9" fill="#9490AD">Lift lobby ↑</text>

              {/* Entry arrow from outside right */}
              <line x1="955" y1="420" x2="922" y2="420" stroke="#10B981" strokeWidth="2.5" markerEnd="url(#da-green)" />
              <text x="958" y="416" textAnchor="start" fontSize="8" fill="#10B981" fontWeight="700">ENTRY</text>

              {/* ════════════════════════════════════════════
                  ZONE G — EXPO & NETWORKING (Phase-1 lower strip)
              ════════════════════════════════════════════ */}
              <rect x="35" y="400" width="465" height="145" fill="#F59E0B" fillOpacity="0.22" />
              {/* Round tables */}
              {[100, 195, 290, 385, 460].map((cx, i) => (
                <g key={i}>
                  <circle cx={cx} cy={490} r={22} fill="none" stroke="#D97706" strokeWidth="1.3" strokeOpacity="0.6" />
                  <circle cx={cx} cy={490} r={8} fill="#F59E0B" fillOpacity="0.4" />
                </g>
              ))}
              <text x="265" y="432" textAnchor="middle" fontSize="16" fill="#D97706">🤝</text>
              <text x="265" y="455" textAnchor="middle" fontSize="15" fill="#78350F" fontWeight="800">Expo &amp; Networking</text>
              <text x="265" y="471" textAnchor="middle" fontSize="10" fill="#92400E">Sponsor booths · Demos · Round tables</text>

              {/* ── DOOR OPENINGS in walls ── */}
              {/* Main door into expo */}
              <rect x="228" y="397" width="50" height="13" fill="#F0ECFF" />
              {/* Door from workshop area to lounge */}
              <rect x="615" y="297" width="40" height="10" fill="#F0ECFF" />
              <rect x="755" y="297" width="40" height="10" fill="#F0ECFF" />

              {/* ── WAY TO labels ── */}
              <text x="35" y="540" fontSize="8" fill="#9490AD">← Way to Washrooms</text>
              <text x="340" y="540" fontSize="8" fill="#9490AD">Way to Parking →</text>

              {/* ── Floor note ── */}
              <text x="480" y="575" textAnchor="middle" fontSize="8" fill="#9490AD">
                5th Floor · Freshworks Building 32 · Not to scale
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            {[
              { color: '#7C3AED', label: 'Main Hall' },
              { color: '#8B5CF6', label: 'Workshop Rooms' },
              { color: '#F59E0B', label: 'Expo & Networking' },
              { color: '#10B981', label: 'Registration' },
              { color: '#3B82F6', label: 'Lunch & Lounge' },
            ].map(z => (
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
