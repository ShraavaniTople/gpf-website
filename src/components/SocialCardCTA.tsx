import { useEffect, useRef } from 'react'

function useVis() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

const ROLES_PREVIEW = [
  'Attendee',
  'Speaker',
  'Sponsor',
  'Community Partner',
  'Volunteer',
]

export default function SocialCardCTA() {
  const headRef = useVis()
  const cardsRef = useVis()

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* bg glow */}
      <div aria-hidden style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div ref={headRef} className="sr mb-14 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-4" style={{ color: '#7C3AED' }}>
            Spread the Word
          </p>
          <h2 className="font-display font-extrabold mb-5"
            style={{ fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-0.04em', color: '#F0EEF8', lineHeight: 1.05 }}>
            Share that you're part of&nbsp;<span className="grad">TGPF 2026</span>
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
            Attendees, speakers, sponsors, volunteers — everyone gets a custom social card.
            Design yours in 30 seconds, download at full resolution, post anywhere.
          </p>
        </div>

        {/* mini card previews */}
        <div ref={cardsRef} className="sg mb-12 flex flex-wrap justify-center gap-4">
          {ROLES_PREVIEW.map(label => (
            <div key={label} style={{
              padding: '10px 18px', borderRadius: 9999,
              border: '1px solid rgba(124,58,237,.25)',
              background: 'rgba(124,58,237,.07)',
            }}>
              <span style={{ fontSize: 13, color: '#9490AD', fontFamily: 'Inter, sans-serif' }}>{label}</span>
            </div>
          ))}
          <div style={{
            padding: '10px 18px', borderRadius: 9999,
            border: '1px solid #1C1A32',
            background: 'rgba(28,26,50,.4)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 13, color: '#52506A', fontFamily: 'Inter, sans-serif' }}>+5 more roles</span>
          </div>
        </div>

        <div className="text-center">
          <a href="/share" className="btn-purple" style={{ display: 'inline-block', padding: '14px 40px', fontSize: 16 }}>
            Create My Card →
          </a>
          <p style={{ marginTop: 12, fontSize: 12, color: '#3D3B55', fontFamily: 'Inter, sans-serif' }}>
            3 card designs · 1080×1080 PNG · No login required
          </p>
        </div>
      </div>
    </section>
  )
}
