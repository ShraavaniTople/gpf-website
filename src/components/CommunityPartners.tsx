import { useEffect, useRef, useState } from 'react'

const partners = [
  { name: 'FOF Mumbai',            slug: 'fof-mumbai' },
  { name: 'GDG Cloud Mumbai',      slug: 'gdg-cloud-mumbai' },
  { name: 'Founder Startup House', slug: 'founder-startup-house' },
  { name: 'HiDevs',                slug: 'hidevs' },
  { name: 'FFDG Mumbai',           slug: 'ffdg-mumbai' },
  { name: 'AIC',                   slug: 'aic' },
  { name: 'Coding Ninjas',         slug: 'coding-ninjas' },
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

function PartnerLogo({ name, slug }: { name: string; slug: string }) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <div
      className="flex items-center justify-center rounded-2xl"
      style={{ background: '#0E0C22', border: '1px solid #1C1A32', padding: '20px 28px', minHeight: 88 }}
    >
      {imgOk ? (
        <img
          src={`/community/${slug}.png`}
          alt={name}
          onError={() => setImgOk(false)}
          style={{ maxHeight: 48, maxWidth: 140, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.8 }}
        />
      ) : (
        <span className="font-display font-bold text-sm text-center" style={{ color: '#52506A', letterSpacing: '-0.02em' }}>
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
