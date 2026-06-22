import { useEffect, useRef } from 'react'
import heroBanner from '../assets/hero-banner.png'

interface HeroProps { onSponsor: () => void; onCommunity: () => void }

// Photos for the bottom film strip
const filmPhotos = [
  { src: './photos/group.jpg', alt: 'Women in Product India community group' },
  { src: './photos/speaker1.jpg', alt: 'Speaker at Women in Product India event' },
  { src: './photos/audience1.jpg', alt: 'Attendees at product conference' },
  { src: './photos/speaker2.jpg', alt: 'Speaker on stage' },
  { src: './photos/audience3.jpg', alt: 'Event audience' },
]

function go(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

export default function Hero({ onSponsor, onCommunity }: HeroProps) {
  const stripRef = useRef<HTMLDivElement>(null)

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

  return (
    <section className="relative overflow-hidden" style={{ background: '#05040C', paddingTop: 'clamp(120px, 10vw, 160px)' }}>
      {/* Banner wrapper — banner image + text overlay bound to image area */}
      <div className="relative">
        <img src={heroBanner} alt="The Great Product Festival speakers"
          style={{ width: '100%', height: 'auto', display: 'block' }} />

        {/* Dark gradient on left for text readability */}
        <div aria-hidden className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(5,4,12,.92) 0%, rgba(5,4,12,.75) 25%, rgba(5,4,12,.3) 50%, rgba(5,4,12,0) 70%)' }} />

        {/* ── Text overlaid on banner ── */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 w-full h-full pt-6 pb-6 flex items-center">
            <div className="w-full lg:w-[50%] flex flex-col pointer-events-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 mb-5 w-fit"
              style={{ border: '1px solid rgba(245,158,11,.2)', borderRadius: 16, padding: '7px 14px', background: 'rgba(245,158,11,.04)' }}>
              <span className="pd w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#F59E0B' }} aria-hidden />
              <span className="font-mono font-medium uppercase" style={{ color: '#F59E0B', fontSize: 11, letterSpacing: '0.14em', lineHeight: 1.5 }}>
                <span className="block sm:inline">Bangalore &nbsp;·&nbsp; 25-26 Sept 2026</span>
                <span className="block sm:inline sm:before:content-['_·_'] before:mx-1">Women in Product India</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold leading-none mb-5"
              style={{ fontSize: 'clamp(52px,8.5vw,128px)', letterSpacing: '-0.045em', overflow: 'hidden' }}>
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

            {/* Theme + Tagline + CTAs */}
            <div style={{ opacity: 0, animation: 'heroFade .9s ease .62s forwards' }}>
              <div className="inline-flex items-center gap-4 mb-5 px-5 py-3 rounded-xl"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,.1) 0%, rgba(245,158,11,.05) 100%)', border: '1px solid rgba(124,58,237,.2)', backdropFilter: 'blur(8px)' }}>
                <div className="flex flex-col gap-0.5">
                  <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[.3em]" style={{ color: '#A78BFA' }}>Conference Theme</p>
                  <p className="font-display font-extrabold text-base md:text-lg leading-tight" style={{ letterSpacing: '-0.03em', color: '#F0EEF8' }}>
                    Infinite <span style={{ background: 'linear-gradient(90deg, #A78BFA, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Builders</span>
                  </p>
                </div>
                <div className="w-[2px] h-8 rounded-full flex-shrink-0 hidden sm:block" style={{ background: 'linear-gradient(to bottom, #7C3AED, #F59E0B)' }} />
                <p className="font-mono text-[9px] uppercase tracking-[.15em] leading-tight hidden sm:block" style={{ color: '#52506A' }}>TGPF<br/>2026</p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center mb-4 mt-6">
                <button onClick={() => go('passes')} className="btn-purple text-sm w-full sm:w-auto">Get Passes</button>
                <button onClick={onCommunity} className="btn-purple text-sm w-full sm:w-auto">Become a Community Partner</button>
              </div>
              <p className="text-sm" style={{ color: '#52506A' }}>
                Priority sponsor slots are open &nbsp;
                <button onClick={onSponsor} className="font-semibold hover:opacity-75 transition-opacity" style={{ color: '#F59E0B' }}>
                  Become a Sponsor &rarr;
                </button>
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ── Film strip ── */}
      <div className="relative z-10 w-full pt-10 pb-10 overflow-hidden">
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
                style={{ width: 'clamp(140px, 42vw, 260px)', height: 'clamp(90px, 28vw, 160px)', background: '#1C1A32' }}>
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

      {/* Scroll indicator — hidden on mobile */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5"
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
