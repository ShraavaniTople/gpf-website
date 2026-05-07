import { useEffect, useRef } from 'react'
import { Users, Wrench, Network, Code2, MessageSquare, Globe } from 'lucide-react'
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
]

function useVis(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('vis'), delay); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return ref
}

function FeatureCell({ f, delay, borderLeft }: { f: Feature; delay: number; borderLeft?: boolean }) {
  const Icon = f.icon
  const ref = useVis(delay)
  return (
    <div
      ref={ref}
      className="sr feat-row border-t border-b py-6 cursor-default"
      style={{
        borderColor: '#1C1A32',
        transitionDelay: `${delay}ms`,
        borderLeft: borderLeft ? '1px solid #1C1A32' : undefined,
        paddingLeft: borderLeft ? '3rem' : undefined,
        marginBottom: '-1px',
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
            {f.bullets.map((b, i) => (
              <li key={i} className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function WhyAttend() {
  const headerRef = useVis()
  const bannerRef = useRef<HTMLDivElement>(null)

  // Parallax on banner
  useEffect(() => {
    const el = bannerRef.current; if (!el) return
    const fn = () => {
      const rect = el.getBoundingClientRect()
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.2
      const img = el.querySelector('img') as HTMLImageElement
      if (img) img.style.transform = `translateY(${offset}px) scale(1.2)`
    }
    window.addEventListener('scroll', fn, { passive: true }); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const pairs = [
    [features[0], features[3]],
    [features[1], features[4]],
    [features[2], features[5]],
  ]

  return (
    <section id="why-attend" className="relative py-28 px-6 overflow-hidden">
      {/* Section bg number */}
      <div className="bg-num" style={{ top: '-5%', left: '-2%' }} aria-hidden>01</div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Parallax photo banner */}
        <div ref={bannerRef} className="px-wrap rounded-2xl mb-20 relative overflow-hidden" style={{ height: 260 }}>
          <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80" alt="Stage" style={{ height: '120%', width: '100%', objectFit: 'cover' }} />
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(5,4,12,.9) 0%, rgba(5,4,12,.2) 50%, rgba(5,4,12,.6) 100%)' }} />
          <div className="absolute bottom-8 left-8">
            <p className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>One stage.</p>
            <p className="text-sm mt-1" style={{ color: '#9490AD' }}>India's best product minds. Together.</p>
          </div>
          <div className="absolute top-8 right-8 hidden md:block text-right">
            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#52506A' }}>Q3 2026</p>
            <p className="font-display font-bold text-2xl mt-1" style={{ color: '#F0EEF8' }}>Bangalore</p>
          </div>
        </div>

        {/* Feature grid — paired rows so left+right are always same height */}
        <div>
          {pairs.map(([l, r], i) => (
            <div key={l.num} className="grid grid-cols-1 lg:grid-cols-2">
              <FeatureCell f={l} delay={i * 80} />
              <FeatureCell f={r} delay={i * 80 + 40} borderLeft />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
