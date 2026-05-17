import { useEffect, useRef } from 'react'

interface Props {
  onRegister: () => void
  onSponsor: () => void
  onSpeak: () => void
}

function useVis() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

export default function ClosingCTA({ onRegister, onSponsor, onSpeak }: Props) {
  const ref = useVis()

  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ background: '#05040C' }}>
      {/* Purple + amber radial glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(124,58,237,.22) 0%, transparent 70%)',
      }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 40% 40% at 20% 20%, rgba(245,158,11,.07) 0%, transparent 70%)',
      }} />

      <div ref={ref} className="sr relative z-10 max-w-4xl mx-auto text-center">
        {/* Label */}
        <p className="font-mono text-[11px] uppercase tracking-[.25em] mb-8" style={{ color: '#F59E0B' }}>
          See You in Bangalore
        </p>

        {/* Headline */}
        <h2
          className="font-display font-extrabold leading-none mb-8"
          style={{ fontSize: 'clamp(48px,8vw,100px)', letterSpacing: '-0.045em', color: '#F0EEF8' }}
        >
          Let's Build India's<br />
          <span className="grad">Product Future.</span><br />
          Together.
        </h2>

        {/* Subtext */}
        <p className="text-base md:text-lg leading-relaxed mb-14 max-w-xl mx-auto" style={{ color: '#6B7280' }}>
          500+ product leaders. 20+ world-class speakers. 2 days of learning, connecting, and building. GPF 2026. Don't miss it.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mb-16">
          <button onClick={onRegister} className="btn-purple">
            Register Now
          </button>
          <button onClick={onSponsor} className="btn-purple">
            Become a Sponsor
          </button>
          <button onClick={onSpeak} className="btn-purple">
            Apply to Speak
          </button>
        </div>

        {/* Divider */}
        <div className="h-px mb-10 max-w-xs mx-auto" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,.3), transparent)' }} />

        {/* Contact line */}
        <p className="font-mono text-xs" style={{ color: '#52506A' }}>
          WiP India &nbsp;&middot;&nbsp;
          <a href="mailto:hello@womeninproductindia.com" className="transition-colors hover:text-white" style={{ color: '#6B7280' }}>
            hello@womeninproductindia.com
          </a>
          &nbsp;&middot;&nbsp;
          <a href="https://womeninproductindia.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: '#6B7280' }}>
            womeninproductindia.com
          </a>
        </p>
      </div>
    </section>
  )
}
