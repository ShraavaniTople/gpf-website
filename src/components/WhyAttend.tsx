import { useEffect, useRef } from 'react'
import { Users, Wrench, Network, Code2, MessageSquare, Globe, Briefcase } from 'lucide-react'
import type { ElementType } from 'react'

interface Feature { icon: ElementType; num: string; title: string; bullets: string[] }

const features: Feature[] = [
  { icon: Users, num: '01', title: 'World-class Speakers',
    bullets: ["Learn from CPOs, Founders, and Product Leaders who have scaled India's biggest platforms.", 'Gain global product insights through the lens of the Indian ecosystem.'] },
  { icon: Wrench, num: '02', title: 'Hands-on Workshops',
    bullets: ['Intensive small-group sessions tackling growth, strategy, design thinking, and analytics challenges.', 'Leave with actionable toolkits you can deploy in your workflow the next morning.'] },
  { icon: Network, num: '03', title: 'Curated Networking',
    bullets: ['Industry-specific mixers with peers from Fintech, SaaS, E-commerce, and Healthtech.', 'Dedicated networking zones built for real conversation, not small talk.'] },
  { icon: Code2, num: '04', title: 'Hackathon',
    bullets: ['Cross-functional teams building real solutions under real constraints in 24 hours.', 'Build something real. Win something meaningful. Demo on the main stage.'] },
  { icon: MessageSquare, num: '05', title: 'Founders and Leaders Roundtables',
    bullets: ["Intimate, closed-door discussions with the people shaping India's product future.", 'Exchange ideas on leadership, team culture, and scaling with industry veterans.'] },
  { icon: Globe, num: '06', title: 'Built for All of India',
    bullets: ['Content addressing the unique nuances of building for the next billion users.', 'An inclusive environment that welcomes all genders, career levels, and industries.'] },
  { icon: Briefcase, num: '07', title: 'Hiring & Career Opportunities',
    bullets: ['Connect with top companies actively hiring for product roles.', 'Explore career opportunities, meet recruiters, and find your next big move.'] },
]

// Order so grid reads: 01,05 / 02,06 / 03,07 / 04 across the two columns
const gridOrder = [features[0], features[4], features[1], features[5], features[2], features[6], features[3]]

function useVis() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } }, { threshold: 0.05 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

export default function WhyAttend() {
  const headerRef = useVis()
  const gridRef = useVis()

  return (
    <section id="why-attend" className="relative py-28 px-6 overflow-hidden">
      <div className="bg-num" style={{ top: '-5%', left: '-2%' }} aria-hidden>01</div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div ref={headerRef} className="sr mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>The Conference</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
              The only Product conference<br />
              <span style={{ color: '#52506A' }}>that does all of this.</span>
            </h2>
            <p className="text-base max-w-xs leading-relaxed lg:text-right" style={{ color: '#6B7280' }}>
              A genuine gathering of India's best product minds.
            </p>
          </div>
        </div>

        {/* Single flat grid — 2 cols on desktop, auto rows share height naturally */}
        <div
          ref={gridRef}
          className="sr"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
          }}
        >
          <style>{`
            @media (min-width: 1024px) {
              .feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
          <div
            className="feature-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              borderTop: '1px solid #1C1A32',
            }}
          >
            {gridOrder.map((f, i) => {
              const Icon = f.icon
              const isRightCol = i % 2 === 1
              return (
                <div
                  key={f.num}
                  className="feat-row py-6 cursor-default"
                  style={{
                    borderBottom: '1px solid #1C1A32',
                  }}
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 flex items-center gap-3 w-16">
                      <span className="font-mono text-xs font-medium" style={{ color: '#52506A' }}>{f.num}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(124,58,237,.08)', border: '1px solid rgba(124,58,237,.15)' }}>
                        <Icon size={14} style={{ color: '#A78BFA' }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base mb-2" style={{ color: '#F0EEF8', letterSpacing: '-0.01em' }}>{f.title}</h3>
                      <ul className="space-y-1.5">
                        {f.bullets.map((b, bi) => (
                          <li key={bi} className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
