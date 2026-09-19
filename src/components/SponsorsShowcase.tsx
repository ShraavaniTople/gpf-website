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

const cardStyle = { background: '#0E0C22', border: '1px solid #1C1A32', width: '100%', maxWidth: 760 }

// Fixed box for every hackathon grid logo — all logos sit in the same 140×36 area,
// object-fit:contain scales each one to fill it without distortion.
const gridLogoStyle: React.CSSProperties = {
  display: 'block',
  width: 140,
  height: 36,
  objectFit: 'contain',
}

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
            <div className="flex items-center justify-center rounded-2xl px-6 sm:px-10 py-5" style={cardStyle}>
              <img src="/wip-logo.webp" alt="Women in Product India"
                style={{ height: 56, width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Powered by + Co-powered by — same row */}
          <div className="grid grid-cols-2 gap-4 w-full" style={{ maxWidth: 760 }}>
            {[
              { label: 'Powered by',    src: '/logos/freshworks-full.webp', alt: 'Freshworks', h: 36 },
              { label: 'Co-powered by', src: '/logos/toast.webp',           alt: 'Toast',      h: 36 },
            ].map(({ label, src, alt, h }) => (
              <div key={alt} className="flex flex-col items-center gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-center" style={{ color: '#52506A' }}>{label}</p>
                <div className="flex items-center justify-center rounded-2xl px-4 w-full"
                  style={{ background: '#0E0C22', border: '1px solid #1C1A32', height: 80 }}>
                  <img src={src} alt={alt}
                    style={{ display: 'block', maxHeight: h, height: 'auto', width: 'auto', maxWidth: '85%', objectFit: 'contain' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise Intelligence partner + Voice partner — same row */}
          <div className="grid grid-cols-2 gap-4 w-full" style={{ maxWidth: 760 }}>
            {[
              { label: 'Enterprise Intelligence partner', src: '/logos/databricks.webp', alt: 'Databricks' },
              { label: 'Voice partner',                   src: '/logos/wispr.webp',      alt: 'Wispr Flow' },
            ].map(({ label, src, alt }) => (
              <div key={alt} className="flex flex-col items-center gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-center" style={{ color: '#52506A' }}>{label}</p>
                <div className="flex items-center justify-center rounded-2xl px-4 w-full"
                  style={{ background: '#0E0C22', border: '1px solid #1C1A32', height: 80 }}>
                  <img src={src} alt={alt}
                    style={{ display: 'block', width: '65%', height: 36, objectFit: 'contain' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Supported by — hackathon partners */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Hackathon Partners</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full" style={{ maxWidth: 760 }}>
              {[
                { src: '/logos/sarvam.webp',          alt: 'Sarvam'        },
                { src: '/logos/anthropic-v2.webp',    alt: 'Anthropic'     },
                { src: '/logos/aws-v3.png',           alt: 'AWS'           },
                { src: '/logos/dodopayments.webp',    alt: 'Dodo Payments' },
                { src: '/logos/elevenlabs-crop.webp', alt: 'ElevenLabs'    },
                { src: '/logos/vobiz.webp',           alt: 'Vobiz'         },
              ].map(({ src, alt }) => (
                <div key={alt}
                  className="flex items-center justify-center rounded-2xl px-4"
                  style={{ background: '#0E0C22', border: '1px solid #1C1A32', height: 80 }}>
                  <img src={src} alt={alt}
                    style={{ display: 'block', width: '80%', height: 34, objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Exhibiting Partners */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#52506A' }}>Exhibiting Partners</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full" style={{ maxWidth: 760 }}>
              {[
                { src: '/logos/vaaniai.png',        alt: 'Vaani AI'    },
                { src: '/logos/simplismart-v2.png', alt: 'Simplismart' },
                { src: '/logos/murf.svg',           alt: 'Murf'        },
                { src: '/logos/dataart.png',        alt: 'DataArt'     },
              ].map(({ src, alt }) => (
                <div key={alt} className="flex items-center justify-center rounded-2xl px-4"
                  style={{ background: '#0E0C22', border: '1px solid #1C1A32', height: 80 }}>
                  <img src={src} alt={alt}
                    style={{ display: 'block', width: '80%', height: 40, objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Strategic + Gifting + Snacking partners — one row */}
          <div className="grid grid-cols-3 gap-4 w-full" style={{ maxWidth: 760 }}>
            {[
              { label: 'Strategic partner', src: '/logos/kdem.webp',     alt: 'Karnataka Digital Economy Mission' },
              { label: 'Gifting partner',   src: '/logos/lamhenow.webp', alt: 'Lamhenow'                         },
              { label: 'Snacking partner',  src: '/logos/brb.png',       alt: 'BRB'                              },
            ].map(({ label, src, alt }) => (
              <div key={alt} className="flex flex-col items-center gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-center" style={{ color: '#52506A' }}>{label}</p>
                <div className="flex items-center justify-center rounded-2xl px-4 w-full"
                  style={{ background: '#0E0C22', border: '1px solid #1C1A32', height: 80 }}>
                  <img src={src} alt={alt}
                    style={{ display: 'block', width: '70%', height: 48, objectFit: 'contain' }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
