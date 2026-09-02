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

const cardStyle = { background: '#0E0C22', border: '1px solid #1C1A32', width: '100%', maxWidth: 360 }

export default function SponsorsShowcase() {
  const headRef = useVis()
  const bodyRef = useVis(80)

  return (
    <section id="sponsors-showcase" className="relative py-10 px-6 overflow-hidden" style={{ borderTop: '1px solid #1C1A32', borderBottom: '1px solid #1C1A32' }}>
      <div className="relative z-10 max-w-7xl mx-auto">

        <div ref={headRef} className="sr mb-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[.2em]" style={{ color: '#7C3AED' }}>Sponsors</p>
        </div>

        <div ref={bodyRef} className="sg flex flex-col gap-5 items-center">

          {/* Presented by — WiP India */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Presented by</p>
            <div className="flex items-center justify-center rounded-2xl px-10 py-5" style={cardStyle}>
              <img src="/wip-logo.webp" alt="Women in Product India"
                style={{ height: 72, width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Powered by — Freshworks */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Powered by</p>
            <div className="flex items-center justify-center rounded-2xl px-10 py-5" style={cardStyle}>
              <img src="/logos/freshworks-full.webp" alt="Freshworks"
                style={{ height: 52, width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Co-powered by — Toast */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Co-powered by</p>
            <div className="flex items-center justify-center rounded-2xl px-10 py-5" style={cardStyle}>
              <img src="/logos/toast.webp" alt="Toast"
                style={{ height: 52, width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Associate partner — Databricks */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Associate partner</p>
            <div className="flex items-center justify-center rounded-2xl px-10 py-5" style={cardStyle}>
              <img src="/logos/databricks.webp" alt="Databricks"
                style={{ height: 52, width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Gifting partner — Lamhenow */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Gifting partner</p>
            <div className="flex items-center justify-center rounded-2xl px-10 py-5" style={cardStyle}>
              <img src="/logos/lamhenow.webp" alt="Lamhenow"
                style={{ height: 52, width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Supported by — all hackathon partners */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Supported by</p>
            <div className="grid grid-cols-3 gap-4 w-full" style={{ maxWidth: 760 }}>
              {[
                { src: '/logos/sarvam.webp',          alt: 'Sarvam',        f: undefined },
                { src: '/logos/anthropic.webp',       alt: 'Anthropic',     f: 'invert(1)' },
                { src: '/logos/aws.svg',              alt: 'AWS',           f: undefined },
                { src: '/logos/dodopayments.webp',    alt: 'Dodo Payments', f: undefined },
                { src: '/logos/elevenlabs-crop.webp', alt: 'ElevenLabs',    f: undefined },
                { src: '/logos/vobiz.webp',           alt: 'Vobiz',         f: undefined },
              ].map(({ src, alt, f }) => (
                <div key={alt} className="flex items-center justify-center rounded-2xl px-6 py-5"
                  style={{ background: '#0E0C22', border: '1px solid #1C1A32' }}>
                  <img src={src} alt={alt}
                    style={{ display: 'block', width: '100%', height: 40, objectFit: 'contain', filter: f }} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
