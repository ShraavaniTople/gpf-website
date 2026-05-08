import { useEffect, useRef } from 'react'
import heroSwatiStage from '../assets/hero-swati-stage.jpg'

interface HeroProps { onSponsor: () => void; onCommunity: () => void }

// Photos for the mosaic (right side)
const mosaicPhotos = {
  main:   heroSwatiStage,
  bl:     'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=85',
  br:     'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=85',
}

// Photos for the bottom film strip
const filmPhotos = [
  { src: './photos/group.jpg', alt: 'Women in Product India community group' },
  { src: './photos/speaker1.jpg', alt: 'Speaker at Women in Product India event' },
  { src: './photos/audience1.jpg', alt: 'Attendees at product conference' },
  { src: './photos/audience2.jpg', alt: 'Audience at product event' },
  { src: './photos/speaker2.jpg', alt: 'Speaker on stage' },
  { src: './photos/audience3.jpg', alt: 'Event audience' },
  { src: './photos/speaker3.jpg', alt: 'Speaker presenting at Canvas venue' },
  { src: './photos/awards.jpg', alt: 'Award ceremony' },
]

function go(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

export default function Hero({ onSponsor, onCommunity }: HeroProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const mosaicRef = useRef<HTMLDivElement>(null)

  // Film strip auto-scroll
  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    let frame: number
    let pos = 0
    const tick = () => {
      pos += 0.45
      if (pos >= el.scrollWidth / 2) pos = 0
      el.scrollLeft = pos
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const stop = () => cancelAnimationFrame(frame)
    el.addEventListener('mouseenter', stop)
    el.addEventListener('touchstart', stop, { passive: true })
    return () => { cancelAnimationFrame(frame); el.removeEventListener('mouseenter', stop) }
  }, [])

  // Mosaic parallax on scroll
  useEffect(() => {
    const el = mosaicRef.current
    if (!el) return
    const fn = () => {
      const scrollY = window.scrollY
      const imgs = el.querySelectorAll<HTMLElement>('[data-spd]')
      imgs.forEach(img => {
        const spd = parseFloat(img.dataset.spd || '0')
        img.style.transform = `translateY(${scrollY * spd}px) scale(1.12)`
      })
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: '#05040C' }}>
      {/* Background glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 70% at 15% 55%, rgba(124,58,237,.15) 0%, transparent 100%)'
      }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 45% 50% at 85% 15%, rgba(245,158,11,.06) 0%, transparent 100%)'
      }} />

      {/* ── Main two-column layout ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-36 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-6 min-h-[calc(100vh-220px)]">

          {/* LEFT — text (55%) */}
          <div className="lg:w-[55%] flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 mb-10 w-fit"
              style={{ border: '1px solid rgba(245,158,11,.2)', borderRadius: 999, padding: '8px 18px', background: 'rgba(245,158,11,.04)' }}>
              <span className="pd w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#F59E0B' }} aria-hidden />
              <span className="font-mono text-xs font-medium tracking-widest uppercase" style={{ color: '#F59E0B' }}>
                Bangalore &nbsp;·&nbsp; Q3 2026 &nbsp;·&nbsp; Women in Product India
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold leading-none mb-8"
              style={{ fontSize: 'clamp(56px,8.5vw,128px)', letterSpacing: '-0.045em', overflow: 'hidden' }}>
              {[
                { text: 'The Great', cls: '',     delay: '0.1s' },
                { text: 'Product',   cls: '',     delay: '0.22s' },
                { text: 'Festival',  cls: 'grad', delay: '0.34s' },
              ].map(({ text, cls, delay }) => (
                <span key={text} className="block" style={{ overflow: 'hidden' }}>
                  <span className={`block ${cls}`} style={{ color: cls ? undefined : '#F0EEF8', opacity: 0, transform: 'translateY(105%)', animation: `heroLine .9s cubic-bezier(0.16,1,0.3,1) ${delay} forwards` }}>
                    {text}
                  </span>
                </span>
              ))}
            </h1>

            {/* Tagline + CTAs */}
            <div style={{ opacity: 0, animation: 'heroFade .9s ease .62s forwards' }}>
              <p className="text-lg md:text-xl mb-10 max-w-md leading-relaxed" style={{ color: '#9490AD' }}>
                The Home of India's Product Builders &amp; Leaders
              </p>
              <div className="flex flex-wrap gap-4 items-center mb-5">
                <button onClick={() => go('passes')} className="btn-purple text-sm">Get Passes</button>
                <button onClick={onCommunity} className="btn-ghost text-sm">Become a Community Partner</button>
              </div>
              <p className="text-sm" style={{ color: '#52506A' }}>
                Priority sponsor slots are open &nbsp;
                <button onClick={onSponsor} className="font-semibold hover:opacity-75 transition-opacity" style={{ color: '#F59E0B' }}>
                  Become a Sponsor &rarr;
                </button>
              </p>
            </div>
          </div>

          {/* RIGHT — photo mosaic (45%), desktop only */}
          <div
            ref={mosaicRef}
            className="hidden lg:block lg:w-[45%] flex-shrink-0 relative"
            style={{ height: 520, opacity: 0, animation: 'heroFade 1.1s cubic-bezier(0.16,1,0.3,1) 0.25s forwards' }}
          >
            {/* MAIN large photo — top, takes up ~60% height */}
            <div className="absolute overflow-hidden rounded-2xl"
              style={{ top: 0, left: '8%', right: 0, height: '58%', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
              <img
                data-spd="-0.06"
                src={mosaicPhotos.main}
                alt="Conference crowd"
                style={{ width: '100%', height: '112%', objectFit: 'cover', objectPosition: '50% 30%', transition: 'transform .1s linear' }}
              />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 50%, rgba(5,4,12,.35) 100%)' }} />
            </div>

            {/* BOTTOM-LEFT photo */}
            <div className="absolute overflow-hidden rounded-2xl"
              style={{ bottom: 0, left: 0, width: '48%', height: '42%', boxShadow: '0 16px 50px rgba(0,0,0,0.5)' }}>
              <img
                data-spd="0.05"
                src={mosaicPhotos.bl}
                alt="Networking"
                style={{ width: '100%', height: '112%', objectFit: 'cover', transition: 'transform .1s linear' }}
              />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,4,12,.5) 0%, transparent 60%)' }} />
            </div>

            {/* BOTTOM-RIGHT photo — slightly overlaps the main */}
            <div className="absolute overflow-hidden rounded-xl"
              style={{ bottom: '4%', right: '2%', width: '42%', height: '38%',
                boxShadow: '0 16px 50px rgba(0,0,0,0.5)',
                border: '2px solid rgba(5,4,12,0.9)' }}>
              <img
                data-spd="-0.03"
                src={mosaicPhotos.br}
                alt="Speaker presenting"
                style={{ width: '100%', height: '112%', objectFit: 'cover', transition: 'transform .1s linear' }}
              />
            </div>

            {/* Floating amber info badge */}
            <div className="fl absolute font-display font-bold text-xs leading-tight"
              style={{
                top: '55%', left: '2%',
                background: '#F59E0B', color: '#000',
                padding: '10px 14px', borderRadius: 12,
                transform: 'rotate(-3deg)',
                boxShadow: '0 8px 32px rgba(245,158,11,.35)',
                maxWidth: 130,
              }}>
              A Women in Product India Initiative
            </div>


            {/* Purple glow behind mosaic */}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, zIndex: -1,
              background: 'radial-gradient(ellipse at 60% 50%, rgba(124,58,237,.18) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }} />
          </div>

        </div>
      </div>

      {/* ── Film strip ── */}
      <div className="relative z-10 w-full pb-10">
        <div className="relative">
          <div aria-hidden className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #05040C, transparent)' }} />
          <div aria-hidden className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #05040C, transparent)' }} />
          <div
            ref={stripRef}
            className="flex gap-3 pl-6"
            style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab', userSelect: 'none' }}
          >
            {[...filmPhotos, ...filmPhotos].map((p, i) => (
              <div key={i} className="zoom flex-shrink-0 overflow-hidden rounded-xl"
                style={{ width: 260, height: 160, minWidth: 260, background: '#1C1A32' }}>
                <img
                  src={p.src}
                  alt={p.alt}
                  className="w-full h-full object-cover"
                  loading={i < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ opacity: 0, animation: 'heroFade 1s ease 1.5s forwards' }} aria-hidden>
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#52506A' }}>Scroll</span>
        <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, #52506A, transparent)' }} />
      </div>

      <style>{`
        @keyframes heroLine {
          from { opacity:0; transform:translateY(105%) }
          to   { opacity:1; transform:translateY(0) }
        }
        @keyframes heroFade {
          from { opacity:0; transform:translateY(14px) }
          to   { opacity:1; transform:translateY(0) }
        }
      `}</style>
    </section>
  )
}
