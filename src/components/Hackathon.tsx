import { useEffect, useRef } from 'react'



const format = [
  { n: '01', title: 'Virtual Kickoff', desc: 'Registrations are now open. Register and submit your idea.' },
  { n: '02', title: 'Team Composition', desc: 'Cross-functional squads of 1 to 2 members across product, design, and engineering.' },
  { n: '03', title: 'Finalist Shortlisting', desc: 'Teams are evaluated and shortlisted based on the strength of their idea, alignment to the problem statement, and depth of technical and product composition.' },
  { n: '04', title: 'Build Sprint', desc: 'A 24-hour in-person build window with mentorship from industry veterans.' },
  { n: '05', title: 'Main Stage Finals', desc: 'Finalists demo live in front of India\'s top product leaders at the conference.' },
]

const tracks = [
  'Track 1: Customer & Employee Experience',
  'Track 2: Platform Agent Skills & Knowledge',
  'Track 3: AI-native Enterprise (Open)',
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

export default function Hackathon() {
  const headRef = useVis()
  const leftRef = useVis(100)
  const rightRef = useVis(180)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = photoRef.current; if (!el) return
    const fn = () => {
      const rect = el.getBoundingClientRect()
      const off = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.14
      const img = el.querySelector('img') as HTMLImageElement
      if (img) img.style.transform = `translateY(${off}px) scale(1.2)`
    }
    window.addEventListener('scroll', fn, { passive: true }); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <section id="hackathon" className="relative py-28 px-6 overflow-hidden" style={{ background: '#0D0B1F' }}>
      {/* Amber glow bg */}
      <div aria-hidden className="absolute pointer-events-none" style={{ bottom: '-20%', right: '-10%', width: '55%', height: '80%', background: 'radial-gradient(ellipse at 80% 80%, rgba(245,158,11,.06) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <div className="bg-num" style={{ top: '-5%', right: '-2%' }} aria-hidden>03</div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div ref={headRef} className="sr mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Left: title */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#F59E0B' }}>Hackathon</p>
            <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
              The Great Agent<br />
              <span className="grad">Hackathon.</span>
            </h2>
          </div>
          {/* Right: partner logos */}
          <div className="flex items-end gap-10 flex-shrink-0">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] mb-3" style={{ color: '#52506A' }}>Partner</p>
              <img src="/logos/freshworks-crop.png" alt="Freshworks" style={{ height: 72, width: 'auto', objectFit: 'contain' }} />
            </div>
            <div style={{ width: 1, height: 72, background: '#1C1A32', flexShrink: 0 }} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] mb-3" style={{ color: '#52506A' }}>Credits Partner</p>
              <img src="/logos/elevenlabs-crop.png" alt="ElevenLabs" style={{ height: 72, width: 'auto', objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: format */}
          <div ref={leftRef} className="sr-l">
            {format.map((item, i) => (
              <div key={i} className="flex gap-5 py-6 border-b group" style={{ borderColor: '#1C1A32', transition: 'border-color .25s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1C1A32')}>
                <span className="font-mono text-xs mt-0.5 flex-shrink-0 w-7" style={{ color: '#F59E0B' }}>{item.n}</span>
                <div>
                  <h4 className="font-display font-bold mb-1.5 text-sm" style={{ color: '#F0EEF8', letterSpacing: '-0.01em' }}>{item.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{item.desc}</p>
                </div>
              </div>
            ))}
            <div className="pt-8">
              <a href="https://the-great-agent-hackathon.devpost.com/" target="_blank" rel="noopener noreferrer" className="btn-purple text-sm">Apply for Hackathon</a>
              <p className="text-xs mt-5" style={{ color: '#52506A', fontFamily: 'JetBrains Mono, monospace' }}>Registration closes on 25 August 2026.</p>
            </div>
          </div>

          {/* Right: tracks card + photo */}
          <div ref={rightRef} className="sr-r flex flex-col gap-4">
            <div className="rounded-2xl p-8" style={{ background: '#05040C', border: '1px solid #1C1A32' }}>
              <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-6" style={{ color: '#7C3AED' }}>Problem Statements</p>
              {tracks.map((t, i) => (
                <div key={i} className="flex items-center gap-4 py-3.5 border-b group" style={{ borderColor: 'rgba(28,26,50,.7)' }}>
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#7C3AED', transition: 'background .2s' }} />
                  <span className="font-medium text-sm" style={{ color: '#F0EEF8' }}>{t}</span>
                </div>
              ))}
            </div>

            <div ref={photoRef} className="rounded-2xl overflow-hidden" style={{ height: 'clamp(120px, 25vw, 200px)', position: 'relative' }}>
              <img src="/photos/hackathon-people.png" alt="Hackathon team" style={{ height: '120%', width: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,11,31,.6) 0%, transparent 60%)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
