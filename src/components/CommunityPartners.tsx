import { useEffect, useRef, useState } from 'react'

const partners = [
  { name: 'FOF Mumbai',           slug: 'fof-mumbai',            url: 'https://friends.figma.com/mumbai' },
  { name: 'GDG Cloud Mumbai',     slug: 'gdg-cloud-mumbai',      url: 'https://gdg.community/gdg-cloud-mumbai' },
  { name: 'Founder Startup House',slug: 'founder-startup-house', url: '#' },
  { name: 'HiDevs',               slug: 'hidevs',                url: 'https://hidevs.io' },
  { name: 'FFDG Mumbai',          slug: 'ffdg-mumbai',           url: '#' },
  { name: 'AIC',                  slug: 'aic',                   url: '#' },
  { name: 'Coding Ninjas',        slug: 'coding-ninjas',         url: 'https://www.codingninjas.com' },
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

function PartnerLogo({ name, slug, url }: { name: string; slug: string; url: string }) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <a
      href={url !== '#' ? url : undefined}
      target={url !== '#' ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group flex items-center justify-center rounded-2xl transition-all duration-200"
      style={{
        background: '#0E0C22',
        border: '1px solid #1C1A32',
        padding: '20px 28px',
        minHeight: 88,
        cursor: url !== '#' ? 'pointer' : 'default',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,.4)'; (e.currentTarget as HTMLElement).style.background = '#120F2A' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1C1A32'; (e.currentTarget as HTMLElement).style.background = '#0E0C22' }}
    >
      {imgOk ? (
        <img
          src={`/community/${slug}.png`}
          alt={name}
          onError={() => setImgOk(false)}
          style={{ maxHeight: 48, maxWidth: 140, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.75, transition: 'opacity .2s' }}
          className="group-hover:opacity-100"
        />
      ) : (
        <span
          className="font-display font-bold text-sm text-center group-hover:opacity-100"
          style={{ color: '#52506A', letterSpacing: '-0.02em', opacity: 0.75, transition: 'opacity .2s' }}
        >
          {name}
        </span>
      )}
    </a>
  )
}

export default function CommunityPartners() {
  const headRef = useVis()
  const gridRef = useVis(100)

  return (
    <section id="community-partners" className="relative py-20 px-6 overflow-hidden">
      <div className="bg-num" style={{ top: '-5%', right: '-2%' }} aria-hidden>07</div>
      <div className="relative z-10 max-w-7xl mx-auto">

        <div ref={headRef} className="sr mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Community Partners</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(32px,5vw,64px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
              Our Community
            </h2>
            <p className="text-sm max-w-xs sm:text-right leading-relaxed" style={{ color: '#6B7280' }}>
              Communities whose members get exclusive access and discounts to GPF 2026.
            </p>
          </div>
        </div>

        <div ref={gridRef} className="sg grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {partners.map(p => (
            <PartnerLogo key={p.slug} {...p} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs" style={{ color: '#52506A' }}>
          Want your community listed?{' '}
          <a href="mailto:hello@womeninproductindia.com?subject=Community%20Partnership%20—%20GPF%202026"
            style={{ color: '#7C3AED' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#A78BFA')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#7C3AED')}>
            Partner with us →
          </a>
        </p>

      </div>
    </section>
  )
}
