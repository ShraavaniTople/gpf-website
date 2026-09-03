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

  /* Structural columns at known grid positions */
  const cols = [
    [68,58],[168,58],[268,58],[368,58],[468,58],[568,58],
    [68,178],[168,178],[268,178],[368,178],[468,178],[568,178],
    [68,298],[168,298],[268,298],[368,298],[468,298],[568,298],
    [68,418],[168,418],[268,418],[368,418],[468,418],[568,418],
    [680,58],[780,58],[880,58],[980,58],[1080,58],
    [680,178],[780,178],[880,178],[980,178],[1080,178],
  ]

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
          {/*
            Layout traced from actual Freshworks 5th floor plan:
            Phase-1 (left, full height) = main open area → Main Hall + Expo
            Phase-2 (upper-right, L-extension) = empty rooms → Workshop Rooms
            Right corridor = Registration / entry from lift lobby
          */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #2D2B4E' }}>
            <svg
              viewBox="0 0 1160 660"
              width="100%"
              aria-label="TGPF 2026 Venue Map"
              style={{ display: 'block', fontFamily: "'Inter', sans-serif" }}
            >
              <defs>
                <marker id="darr" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 5 5 L 10 0" stroke="#555" strokeWidth="1.5" fill="none" />
                </marker>
                <marker id="garr" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 5 5 L 10 0" stroke="#10B981" strokeWidth="1.5" fill="none" />
                </marker>
              </defs>

              {/* Dark page bg */}
              <rect width="1160" height="660" fill="#12102A" />

              {/* ── ZONE LABELS ROW (above map) ── */}
              {/* Main Hall */}
              <text x="240" y="36" textAnchor="middle" fill="#C4B5FD" fontSize="11" fontWeight="700" letterSpacing="1.5">MAIN HALL</text>
              <line x1="240" y1="42" x2="240" y2="74" stroke="#9490AD" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#darr)" />

              {/* Workshop Rooms */}
              <text x="820" y="36" textAnchor="middle" fill="#A78BFA" fontSize="11" fontWeight="700" letterSpacing="1.5">WORKSHOP ROOMS</text>
              <line x1="720" y1="42" x2="690" y2="74" stroke="#9490AD" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#darr)" />
              <line x1="820" y1="42" x2="820" y2="74" stroke="#9490AD" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#darr)" />
              <line x1="920" y1="42" x2="950" y2="74" stroke="#9490AD" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#darr)" />

              {/* Expo */}
              <text x="240" y="620" textAnchor="middle" fill="#FCD34D" fontSize="11" fontWeight="700" letterSpacing="1.5">EXPO &amp; NETWORKING</text>
              <line x1="240" y1="608" x2="240" y2="578" stroke="#9490AD" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#darr)" />

              {/* Registration (right) */}
              <text x="1120" y="280" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontWeight="700" letterSpacing="1" transform="rotate(90,1120,280)">REGISTRATION</text>
              <line x1="1098" y1="280" x2="1062" y2="280" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3,2" markerEnd="url(#garr)" />

              {/* ── BUILDING FLOOR (light bg, like paper) ── */}
              {/* The actual L-shaped footprint:
                  Phase-1: x=30,y=80 → x=630,y=600
                  Phase-2 (upper-right): x=630,y=80 → x=1090,y=360 */}
              <path
                d="M 30,80 L 1090,80 L 1090,360 L 630,360 L 630,600 L 30,600 Z"
                fill="#F0ECFF"
                stroke="#6D6A8A"
                strokeWidth="3"
              />

              {/* Internal wall — horizontal divide between Phase-2 rooms and lower Phase-1 extension */}
              <line x1="630" y1="360" x2="1090" y2="360" stroke="#6D6A8A" strokeWidth="3" />
              {/* Internal wall — vertical divide between Phase-1 and Phase-2 */}
              <line x1="630" y1="80" x2="630" y2="360" stroke="#6D6A8A" strokeWidth="3" />

              {/* ── STRUCTURAL COLUMNS ── */}
              {cols.map(([cx, cy], i) => (
                <rect key={i} x={cx - 5} y={cy - 5} width="10" height="10" fill="#9490AD" fillOpacity="0.4" />
              ))}

              {/* ══════════════════════════════════════
                  ZONE A — MAIN HALL (Phase-1, left/upper)
              ══════════════════════════════════════ */}
              <rect x="38" y="88" width="584" height="310" rx="0"
                fill="#7C3AED" fillOpacity="0.18"
                stroke="#7C3AED" strokeWidth="2" />
              {/* Stage platform */}
              <rect x="108" y="320" width="380" height="64" rx="4"
                fill="#7C3AED" fillOpacity="0.35"
                stroke="#5B21B6" strokeWidth="1.5" />
              <text x="298" y="356" textAnchor="middle" fontSize="11" fill="#4C1D95" fontWeight="700" letterSpacing="5">▬  STAGE  ▬</text>
              {/* Icon + label */}
              <text x="298" y="175" textAnchor="middle" fontSize="34" fill="#7C3AED">🎤</text>
              <text x="298" y="226" textAnchor="middle" fontSize="22" fill="#3B0764" fontWeight="800">Main Hall</text>
              <text x="298" y="252" textAnchor="middle" fontSize="12" fill="#6D28D9">Keynotes · Panels · Fireside Chats</text>

              {/* ══════════════════════════════════════
                  ZONE B — WORKSHOP ROOMS (Phase-2, upper-right, 3 rooms)
              ══════════════════════════════════════ */}
              {/* Room walls */}
              <line x1="768" y1="88" x2="768" y2="352" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.5" />
              <line x1="928" y1="88" x2="928" y2="352" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.5" />

              {/* Room 1 */}
              <rect x="638" y="88" width="122" height="264" rx="0"
                fill="#8B5CF6" fillOpacity="0.20"
                stroke="#7C3AED" strokeWidth="1.5" />
              <text x="699" y="198" textAnchor="middle" fontSize="22" fill="#5B21B6">💡</text>
              <text x="699" y="228" textAnchor="middle" fontSize="12" fill="#3B0764" fontWeight="700">Workshop</text>
              <text x="699" y="244" textAnchor="middle" fontSize="12" fill="#3B0764" fontWeight="700">Room 1</text>

              {/* Room 2 */}
              <rect x="776" y="88" width="144" height="264" rx="0"
                fill="#8B5CF6" fillOpacity="0.20"
                stroke="#7C3AED" strokeWidth="1.5" />
              <text x="848" y="198" textAnchor="middle" fontSize="22" fill="#5B21B6">💡</text>
              <text x="848" y="228" textAnchor="middle" fontSize="12" fill="#3B0764" fontWeight="700">Workshop</text>
              <text x="848" y="244" textAnchor="middle" fontSize="12" fill="#3B0764" fontWeight="700">Room 2</text>

              {/* Room 3 */}
              <rect x="936" y="88" width="146" height="264" rx="0"
                fill="#8B5CF6" fillOpacity="0.20"
                stroke="#7C3AED" strokeWidth="1.5" />
              <text x="1009" y="198" textAnchor="middle" fontSize="22" fill="#5B21B6">💡</text>
              <text x="1009" y="228" textAnchor="middle" fontSize="12" fill="#3B0764" fontWeight="700">Workshop</text>
              <text x="1009" y="244" textAnchor="middle" fontSize="12" fill="#3B0764" fontWeight="700">Room 3</text>

              {/* ══════════════════════════════════════
                  ZONE C — REGISTRATION (right corridor, lower Phase-2 slot)
              ══════════════════════════════════════ */}
              <rect x="638" y="360" width="444" height="232" rx="0"
                fill="#10B981" fillOpacity="0.14"
                stroke="#10B981" strokeWidth="2" />
              {/* Subdivide: left = lunch, right = registration */}
              <line x1="870" y1="360" x2="870" y2="592" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" />

              {/* Lunch & lounge (left sub-cell) */}
              <text x="752" y="446" textAnchor="middle" fontSize="22" fill="#3B82F6">☕</text>
              <text x="752" y="478" textAnchor="middle" fontSize="13" fill="#1E40AF" fontWeight="700">Lunch &amp; Lounge</text>
              <text x="752" y="496" textAnchor="middle" fontSize="10" fill="#3B82F6">Meals &amp; informal chats</text>
              {/* Override with separate stroke */}
              <rect x="638" y="360" width="224" height="232" rx="0"
                fill="#3B82F6" fillOpacity="0.12"
                stroke="#3B82F6" strokeWidth="1.5" />
              <text x="752" y="446" textAnchor="middle" fontSize="22" fill="#3B82F6">☕</text>
              <text x="752" y="478" textAnchor="middle" fontSize="13" fill="#1E3A8A" fontWeight="700">Lunch &amp; Lounge</text>
              <text x="752" y="496" textAnchor="middle" fontSize="10" fill="#3B82F6">Meals &amp; informal chats</text>

              {/* Registration (right sub-cell) */}
              <rect x="870" y="360" width="212" height="232" rx="0"
                fill="#10B981" fillOpacity="0.18"
                stroke="#10B981" strokeWidth="2" />
              <text x="976" y="446" textAnchor="middle" fontSize="24" fill="#059669">✅</text>
              <text x="976" y="480" textAnchor="middle" fontSize="14" fill="#064E3B" fontWeight="800">Registration</text>
              <text x="976" y="498" textAnchor="middle" fontSize="10" fill="#065F46">Entry &amp; badge pickup</text>
              <text x="976" y="514" textAnchor="middle" fontSize="9" fill="#9490AD">↑ Lift lobby · Main entry</text>

              {/* Entry arrow from outside */}
              <line x1="1120" y1="476" x2="1090" y2="476"
                stroke="#10B981" strokeWidth="2.5"
                markerEnd="url(#garr)" />
              <text x="1125" y="472" fontSize="9" fill="#10B981" fontWeight="700">IN</text>

              {/* ══════════════════════════════════════
                  ZONE D — EXPO & NETWORKING (Phase-1 bottom strip)
              ══════════════════════════════════════ */}
              <rect x="38" y="406" width="584" height="186" rx="0"
                fill="#F59E0B" fillOpacity="0.15"
                stroke="#F59E0B" strokeWidth="2" />

              {/* Corridor strip between Main Hall and Expo */}
              <rect x="38" y="400" width="584" height="10" fill="#D8D0F0" />
              <text x="330" y="409" textAnchor="middle" fontSize="7" fill="#9490AD" letterSpacing="3">CORRIDOR</text>

              {/* Round tables in Expo */}
              {[110, 220, 330, 440, 550].map((cx, i) => (
                <g key={i}>
                  <circle cx={cx} cy={500} r={25} fill="none" stroke="#F59E0B" strokeWidth="1.3" strokeOpacity="0.55" />
                  <circle cx={cx} cy={500} r={9} fill="#F59E0B" fillOpacity="0.25" />
                </g>
              ))}
              <text x="330" y="452" textAnchor="middle" fontSize="18" fill="#D97706">🤝</text>
              <text x="330" y="478" textAnchor="middle" fontSize="16" fill="#78350F" fontWeight="800">Expo &amp; Networking</text>
              <text x="330" y="494" textAnchor="middle" fontSize="10" fill="#92400E">Sponsor booths · Demos · Round tables</text>
              <text x="330" y="558" textAnchor="middle" fontSize="9" fill="#B45309">Round tables for networking</text>

              {/* ── DOOR OPENINGS (breaks in walls) ── */}
              {/* Main door between Main Hall and Corridor */}
              <rect x="275" y="396" width="50" height="18" fill="#F0ECFF" />
              {/* Door between workshops and corridor */}
              <rect x="700" y="352" width="40" height="16" fill="#F0ECFF" />
              <rect x="860" y="352" width="40" height="16" fill="#F0ECFF" />
              <rect x="1000" y="352" width="40" height="16" fill="#F0ECFF" />

              {/* ── FLOOR LABEL ── */}
              <text x="580" y="644" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#52506A">
                5th Floor · Freshworks Building No. 32 · Not to scale
              </text>
            </svg>
          </div>

          <p className="text-center text-xs mt-5" style={{ color: '#52506A' }}>
            Detailed signage will be placed throughout the venue on the day of the event.
          </p>
        </div>

      </div>
    </section>
  )
}
