import { useEffect, useRef } from 'react'

const days = [
  {
    label: 'Day 1',
    title: 'Building Intelligent Products',
    tracks: [
      { name: 'Product in the Intelligence Era', sessions: [
        'Building products that think, learn, and act: agents, copilots, automation, and AI-native experiences.',
        'From PM to Product Architect: navigating strategy, discovery, experimentation, and decision-making in the AI era.',
        'Designing the future of human-AI collaboration: trust, workflows, interfaces, and responsible innovation.',
      ] },
      { name: 'Growth, Distribution & Digital Influence', sessions: [
        'Winning attention in the age of infinite content: positioning, storytelling, and brand differentiation.',
        'Modern distribution playbooks: creator ecosystems, communities, partnerships, and AI-powered growth.',
        'Building trust at scale: turning audiences into advocates, customers, and loyal communities.',
      ] },
    ],
  },
  {
    label: 'Day 2',
    title: 'Building Companies & Leaders',
    tracks: [
      { name: 'Infinite Startups', sessions: [
        'Building AI-native companies from idea to scale: product, GTM, talent, and execution.',
        'Creating durable advantages in a rapidly changing world: moats, defensibility, and market timing.',
        'Founder, operator, and investor playbooks: lessons from building, backing, and scaling breakout companies.',
      ] },
      { name: 'Leading the Infinite Builders', sessions: [
        'Leading humans and AI together: the evolving role of leadership, management, and decision-making.',
        'Building high-performance organizations: talent, culture, and execution in fast-changing environments.',
        'Thriving in the future of work: careers, skills, adaptability, and lifelong learning.',
      ] },
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
                    Track {ti + 3}
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
