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

export default function SponsorsShowcase() {
  const headRef = useVis()
  const bodyRef = useVis(80)

  return (
    <section id="sponsors-showcase" className="relative py-16 px-6 overflow-hidden" style={{ borderTop: '1px solid #1C1A32', borderBottom: '1px solid #1C1A32' }}>
      <div className="relative z-10 max-w-7xl mx-auto">

        <div ref={headRef} className="sr mb-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[.2em]" style={{ color: '#7C3AED' }}>Sponsors</p>
        </div>

        <div ref={bodyRef} className="sg flex flex-col gap-10 items-center">

          {/* Presented by — Freshworks */}
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Presented by</p>
            <div
              className="flex items-center justify-center rounded-2xl px-12 py-6"
              style={{ background: '#0E0C22', border: '1px solid #1C1A32', width: '100%', maxWidth: 360 }}
            >
              <img
                src="/logos/freshworks-full.png"
                alt="Freshworks"
                style={{ height: 48, width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 40, height: 1, background: '#1C1A32' }} />

          {/* Co-presented by — Toast */}
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Co-presented by</p>
            <div
              className="flex items-center justify-center rounded-2xl px-12 py-6"
              style={{ background: '#FFFFFF', border: '1px solid #1C1A32', width: '100%', maxWidth: 360 }}
            >
              <img
                src="/logos/toast.svg"
                alt="Toast"
                style={{ height: 48, width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 40, height: 1, background: '#1C1A32' }} />

          {/* Supported by — ElevenLabs + Dodo Payments */}
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Supported by</p>
            <div className="flex flex-wrap items-center justify-center gap-4 w-full">
              {[
                { src: '/logos/elevenlabs-crop.png', alt: 'ElevenLabs', dark: true },
                { src: '/logos/dodopayments.png', alt: 'Dodo Payments', dark: true },
              ].map(({ src, alt, dark }) => (
                <div
                  key={alt}
                  className="flex items-center justify-center rounded-2xl px-10 py-5"
                  style={{ background: dark ? '#0E0C22' : '#FFFFFF', border: '1px solid #1C1A32', minWidth: 200, flex: '1 1 200px', maxWidth: 280 }}
                >
                  <img
                    src={src}
                    alt={alt}
                    style={{ height: 44, width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
