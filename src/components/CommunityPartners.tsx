import { useEffect, useRef, useState } from 'react'

const partners = [
  { name: 'AI House',               slug: 'ai-house',          h: 48 },
  { name: 'AIC Mumbai',             slug: 'aic-mumbai',        h: 56 },
  { name: 'AnitaB.org',            slug: 'anita-b' },
  { name: 'Coding Ninjas',         slug: 'coding-ninjas',     h: 80 },
  { name: 'FFDG Mumbai',           slug: 'ffdg-mumbai' },
  { name: 'FOF Mumbai',            slug: 'fof-mumbai',        h: 64 },
  { name: 'Founder Startup House', slug: 'founder-startup-house' },
  { name: 'GDG Cloud Mumbai',      slug: 'gdg-cloud-mumbai',  h: 64 },
  { name: 'HerKey',                slug: 'herkey' },
  { name: 'Women in Tech India',   slug: 'women-in-tech-india', h: 96 },
  { name: 'Startups Life',         slug: 'startups-life',       h: 56 },
  { name: 'Unwind Ventures',       slug: 'unwind-ventures',     h: 120 },
]

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

function PartnerLogo({ name, slug, h = 40 }: { name: string; slug: string; h?: number }) {
  const [tried, setTried] = useState<'webp' | 'png' | 'svg' | 'failed'>('webp')

  const src = tried === 'webp' ? `/community/${slug}.webp` : tried === 'png' ? `/community/${slug}.png` : `/community/${slug}.svg`

  function handleError() {
    if (tried === 'webp') setTried('png')
    else if (tried === 'png') setTried('svg')
    else setTried('failed')
  }

  return (
    <div
      className="flex items-center justify-center rounded-2xl"
      style={{ background: '#0E0C22', border: '1px solid #1C1A32', padding: '16px 12px', minHeight: 88 }}
    >
      {tried !== 'failed' ? (
        <img
          src={src}
          alt={name}
          onError={handleError}
          style={{ height: 'auto', maxHeight: h, width: 'auto', maxWidth: '100%', objectFit: 'contain', opacity: 0.9 }}
        />
      ) : (
        <span className="font-display font-semibold text-sm text-center" style={{ color: '#6B7280', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          {name}
        </span>
      )}
    </div>
  )
}

export default function CommunityPartners() {
  const headRef = useVis()
  const gridRef = useVis(100)

  return (
    <section id="community-partners" className="relative py-20 px-6 overflow-hidden">
      <div className="bg-num" style={{ top: '-5%', right: '-2%' }} aria-hidden>07</div>
      <div className="relative z-10 max-w-7xl mx-auto">

        <div ref={headRef} className="sr mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[.2em]" style={{ color: '#7C3AED' }}>Community Partners</p>
        </div>

        <div ref={gridRef} className="sg grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {partners.map(p => (
            <PartnerLogo key={p.slug} {...p} />
          ))}
        </div>

      </div>
    </section>
  )
}
