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
              viewBox="0 0 960 620"
              width="100%"
              aria-label="TGPF 2026 Venue Map — Freshworks 5th Floor"
              style={{ display: 'block', fontFamily: 'Inter, sans-serif' }}
            >
              <defs>
                <marker id="arr" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                  <polygon points="0,0 7,3.5 0,7" fill="#555" />
                </marker>
                <marker id="arr-green" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                  <polygon points="0,0 7,3.5 0,7" fill="#10B981" />
                </marker>
                <marker id="arr-w" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                  <polygon points="0,0 7,3.5 0,7" fill="#E9D5FF" />
                </marker>
              </defs>

              {/* ── MAP BACKGROUND (light, like a real venue map) ── */}
              <rect width="960" height="620" fill="#1A1830" />
              {/* Map card with light bg */}
              <rect x="20" y="90" width="920" height="490" rx="6" fill="#F5F2FF" />

              {/* ── TOP LABELS ROW (outside the map, with arrows) ── */}

              {/* Main Hall label */}
              <text x="155" y="30" textAnchor="middle" fill="#E9D5FF" fontSize="11" fontWeight="700" letterSpacing="1">MAIN HALL</text>
              <line x1="155" y1="36" x2="155" y2="85" stroke="#9490AD" strokeWidth="1.2" markerEnd="url(#arr)" />

              {/* Workshop Rooms label */}
              <text x="480" y="30" textAnchor="middle" fill="#C4B5FD" fontSize="11" fontWeight="700" letterSpacing="1">WORKSHOP ROOMS</text>
              <line x1="420" y1="36" x2="370" y2="85" stroke="#9490AD" strokeWidth="1.2" markerEnd="url(#arr)" />
              <line x1="480" y1="36" x2="480" y2="85" stroke="#9490AD" strokeWidth="1.2" markerEnd="url(#arr)" />
              <line x1="540" y1="36" x2="590" y2="85" stroke="#9490AD" strokeWidth="1.2" markerEnd="url(#arr)" />

              {/* Expo label */}
              <text x="760" y="30" textAnchor="middle" fill="#FCD34D" fontSize="11" fontWeight="700" letterSpacing="1">EXPO &amp; NETWORKING</text>
              <line x1="760" y1="36" x2="760" y2="85" stroke="#9490AD" strokeWidth="1.2" markerEnd="url(#arr)" />

              {/* ── BUILDING OUTLINE ── */}
              {/* Outer shell */}
              <path
                d="M 40 100 L 900 100 L 900 130 L 930 130 L 930 540 L 40 540 Z"
                fill="#EAE5FF"
                stroke="#9490AD"
                strokeWidth="1"
              />
              {/* Inner floor */}
              <rect x="50" y="110" width="840" height="420" fill="#EAE5FF" />

              {/* ── MAIN HALL (large left zone) ── */}
              <rect x="58" y="118" width="290" height="280" rx="4"
                fill="#7C3AED" fillOpacity="0.20"
                stroke="#7C3AED" strokeWidth="2" />
              {/* Stage platform inside */}
              <rect x="90" y="335" width="226" height="50" rx="3"
                fill="#7C3AED" fillOpacity="0.40"
                stroke="#5B21B6" strokeWidth="1.5" />
              <text x="203" y="366" textAnchor="middle" fontSize="10" fill="#4C1D95" fontWeight="700" letterSpacing="4">▬  STAGE  ▬</text>
              {/* Hall label inside */}
              <text x="203" y="195" textAnchor="middle" fontSize="30" fill="#7C3AED">🎤</text>
              <text x="203" y="232" textAnchor="middle" fontSize="16" fill="#3B0764" fontWeight="800">Main Hall</text>
              <text x="203" y="252" textAnchor="middle" fontSize="10" fill="#6B21A8">Keynotes · Panels</text>

              {/* ── CORRIDOR (horizontal, separating hall from expo) ── */}
              <rect x="58" y="406" width="620" height="18" fill="#D8D0F0" />
              <text x="368" y="419" textAnchor="middle" fontSize="8" fill="#9490AD" letterSpacing="2">C O R R I D O R</text>

              {/* ── WORKSHOP ROOMS (top-right, 3 rooms) ── */}
              {/* Room 1 */}
              <rect x="358" y="118" width="105" height="160" rx="3"
                fill="#A78BFA" fillOpacity="0.25"
                stroke="#7C3AED" strokeWidth="1.5" />
              <text x="410" y="190" textAnchor="middle" fontSize="18" fill="#5B21B6">💡</text>
              <text x="410" y="212" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Room 1</text>
              {/* Room 2 */}
              <rect x="471" y="118" width="105" height="160" rx="3"
                fill="#A78BFA" fillOpacity="0.25"
                stroke="#7C3AED" strokeWidth="1.5" />
              <text x="523" y="190" textAnchor="middle" fontSize="18" fill="#5B21B6">💡</text>
              <text x="523" y="212" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Room 2</text>
              {/* Room 3 */}
              <rect x="584" y="118" width="105" height="160" rx="3"
                fill="#A78BFA" fillOpacity="0.25"
                stroke="#7C3AED" strokeWidth="1.5" />
              <text x="636" y="190" textAnchor="middle" fontSize="18" fill="#5B21B6">💡</text>
              <text x="636" y="212" textAnchor="middle" fontSize="11" fill="#3B0764" fontWeight="700">Room 3</text>

              {/* ── LUNCH & LOUNGE (mid-right) ── */}
              <rect x="358" y="286" width="331" height="112" rx="3"
                fill="#3B82F6" fillOpacity="0.15"
                stroke="#3B82F6" strokeWidth="1.5" />
              <text x="523" y="336" textAnchor="middle" fontSize="18" fill="#2563EB">☕</text>
              <text x="523" y="358" textAnchor="middle" fontSize="13" fill="#1E3A8A" fontWeight="700">Lunch &amp; Lounge</text>
              <text x="523" y="374" textAnchor="middle" fontSize="9" fill="#3B82F6">Meals &amp; informal chats</text>

              {/* ── REGISTRATION (far-right panel, with entry) ── */}
              <rect x="700" y="118" width="178" height="280" rx="3"
                fill="#10B981" fillOpacity="0.15"
                stroke="#10B981" strokeWidth="2" />
              <text x="789" y="230" textAnchor="middle" fontSize="24" fill="#059669">✅</text>
              <text x="789" y="262" textAnchor="middle" fontSize="14" fill="#064E3B" fontWeight="800">Registration</text>
              <text x="789" y="280" textAnchor="middle" fontSize="10" fill="#065F46">Entry &amp; badge pickup</text>
              <text x="789" y="296" textAnchor="middle" fontSize="9" fill="#6B7280">↑ Lift lobby</text>

              {/* Entry arrow from right */}
              <line x1="928" y1="258" x2="882" y2="258"
                stroke="#10B981" strokeWidth="2.5" markerEnd="url(#arr-green)" />
              <text x="938" y="254" textAnchor="start" fontSize="9" fill="#10B981" fontWeight="700">ENTRY</text>
              <text x="938" y="266" textAnchor="start" fontSize="8" fill="#6B7280">Lift lobby</text>

              {/* ── EXPO & NETWORKING (bottom wide zone) ── */}
              <rect x="58" y="432" width="820" height="98" rx="3"
                fill="#F59E0B" fillOpacity="0.18"
                stroke="#F59E0B" strokeWidth="2" />
              {/* Round table icons */}
              {[130, 250, 370, 490, 610, 730, 820].map((cx, i) => (
                <g key={i}>
                  <circle cx={cx} cy={497} r={20} fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.6" />
                  <circle cx={cx} cy={497} r={7} fill="#F59E0B" fillOpacity="0.3" />
                </g>
              ))}
              <text x="450" y="458" textAnchor="middle" fontSize="15" fill="#92400E" fontWeight="800">🤝  Expo &amp; Networking</text>
              <text x="450" y="473" textAnchor="middle" fontSize="9" fill="#92400E">Sponsor booths · Demos · Round tables</text>

              {/* ── WALL LINES (internal partitions) ── */}
              {/* Vertical wall between main hall and workshop rooms */}
              <line x1="356" y1="110" x2="356" y2="406" stroke="#9490AD" strokeWidth="1.5" />
              {/* Vertical wall between workshop and registration */}
              <line x1="698" y1="110" x2="698" y2="406" stroke="#9490AD" strokeWidth="1.5" />
              {/* Horizontal wall between workshop rooms and lounge */}
              <line x1="356" y1="284" x2="698" y2="284" stroke="#9490AD" strokeWidth="1.5" />

              {/* ── DIRECTION LABELS (bottom) ── */}
              <text x="480" y="555" textAnchor="middle" fontSize="9" fill="#6B7280" letterSpacing="1">
                ← Way to Washrooms &nbsp;&nbsp;&nbsp; Way to Parking →
              </text>

              {/* Scale note */}
              <text x="480" y="575" textAnchor="middle" fontSize="8" fill="#9490AD">
                5th Floor · Freshworks Building 32 · Not to scale
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
