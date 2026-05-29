import { useEffect, useRef } from 'react'

const days = [
  {
    label: 'Day 1',
    title: 'Product and Growth',
    tracks: [
      { name: 'AI Product Mastery', sessions: ['Modern product thinking', 'Rapid prototyping and building product MVPs', 'Shipping faster and smarter'] },
      { name: 'Growth, Distribution and Branding', sessions: ['Digital marketing and content strategy', 'Cracking distribution in a digital-first world', 'PM to creator to operator'] },
    ],
  },
  {
    label: 'Day 2',
    title: 'Startups and Leadership',
    tracks: [
      { name: 'Startups and AI Builders', sessions: ['Modern startup playbooks', 'GTM for modern products', 'Founder stories and breakdowns'] },
      { name: 'Leadership, Careers and the Future of Work', sessions: ['Automation vs augmentation for PMs', 'Leadership in high-growth teams', 'Hiring and skills of the future'] },
    ],
  },
]

function useVis() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

export default function Agenda() {
  const headerRef = useVis()
  const day1Ref = useVis()
  const day2Ref = useVis()

  return (
    <section id="agenda" className="relative py-28 px-6 overflow-hidden">
      <div className="bg-num" style={{ top: '-5%', left: '-2%' }} aria-hidden>04</div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div ref={headerRef} className="sr mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Schedule</p>
          <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
            2 Days of Impact
          </h2>
        </div>

        {/* Day 1 */}
        <div ref={day1Ref} className="sr mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-display font-bold text-lg px-4 py-1.5 rounded-full" style={{ background: '#7C3AED', color: '#fff' }}>
              {days[0].label}
            </span>
            <p className="font-display font-semibold text-base" style={{ color: '#52506A', letterSpacing: '-0.01em' }}>{days[0].title}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {days[0].tracks.map((track, ti) => (
              <div key={ti} className="rounded-2xl overflow-hidden" style={{ background: '#080618', border: '1px solid #1C1A32' }}>
                <div className="h-1" style={{ background: ti === 0 ? '#7C3AED' : '#F59E0B' }} />
                <div className="p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[.18em] mb-3" style={{ color: ti === 0 ? '#A78BFA' : '#FCD34D' }}>
                    Track {ti + 1}
                  </p>
                  <h3 className="font-display font-bold mb-7 leading-snug" style={{ fontSize: 'clamp(16px,2vw,22px)', color: '#F0EEF8', letterSpacing: '-0.02em' }}>
                    {track.name}
                  </h3>
                  <ul className="space-y-3">
                    {track.sessions.map((s, si) => (
                      <li key={si} className="flex items-start gap-3">
                        <span aria-hidden className="w-1 h-1 rounded-full mt-2.5 flex-shrink-0"
                          style={{ background: ti === 0 ? '#7C3AED' : '#F59E0B' }} />
                        <span className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day 2 */}
        <div ref={day2Ref} className="sr">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-display font-bold text-lg px-4 py-1.5 rounded-full" style={{ background: '#7C3AED', color: '#fff' }}>
              {days[1].label}
            </span>
            <p className="font-display font-semibold text-base" style={{ color: '#52506A', letterSpacing: '-0.01em' }}>{days[1].title}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {days[1].tracks.map((track, ti) => (
              <div key={ti} className="rounded-2xl overflow-hidden" style={{ background: '#080618', border: '1px solid #1C1A32' }}>
                <div className="h-1" style={{ background: ti === 0 ? '#7C3AED' : '#F59E0B' }} />
                <div className="p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[.18em] mb-3" style={{ color: ti === 0 ? '#A78BFA' : '#FCD34D' }}>
                    Track {ti + 1}
                  </p>
                  <h3 className="font-display font-bold mb-7 leading-snug" style={{ fontSize: 'clamp(16px,2vw,22px)', color: '#F0EEF8', letterSpacing: '-0.02em' }}>
                    {track.name}
                  </h3>
                  <ul className="space-y-3">
                    {track.sessions.map((s, si) => (
                      <li key={si} className="flex items-start gap-3">
                        <span aria-hidden className="w-1 h-1 rounded-full mt-2.5 flex-shrink-0"
                          style={{ background: ti === 0 ? '#7C3AED' : '#F59E0B' }} />
                        <span className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
