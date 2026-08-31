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

  return (
    <section className="relative overflow-hidden" style={{ background: '#05040C', paddingTop: '118px' }}>
      {/* Banner wrapper — banner image + text overlay bound to image area */}
      <div className="relative overflow-hidden hero-banner-wrap">
        <img src={heroBanner} alt="The Great Product Festival speakers"
          className="hidden lg:block"
          style={{ width: '100%', height: 'auto' }} />

        {/* Mobile-only gradient backdrop (in place of banner image) */}
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none lg:hidden" style={{ background: 'radial-gradient(120% 80% at 80% 20%, rgba(124,58,237,.35) 0%, rgba(124,58,237,0) 55%), radial-gradient(90% 70% at 15% 90%, rgba(245,158,11,.18) 0%, rgba(245,158,11,0) 60%), linear-gradient(180deg, #0A0817 0%, #05040C 100%)' }} />

        {/* Dark gradient on left for text readability — desktop only (image behind text) */}
        <div aria-hidden className="absolute inset-0 z-10 pointer-events-none hidden lg:block" style={{ background: 'linear-gradient(to right, rgba(5,4,12,.92) 0%, rgba(5,4,12,.75) 25%, rgba(5,4,12,.3) 50%, rgba(5,4,12,0) 70%)' }} />
        {/* Top fade — blends banner top edge into dark background */}
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 pointer-events-none" style={{ height: '80px', background: 'linear-gradient(to bottom, #05040C 0%, rgba(5,4,12,.5) 50%, rgba(5,4,12,0) 100%)' }} />
        {/* Bottom fade — blends banner bottom edge into dark background */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: '80px', background: 'linear-gradient(to top, #05040C 0%, rgba(5,4,12,.5) 50%, rgba(5,4,12,0) 100%)' }} />

        {/* ── Text overlaid on banner ── */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
          {/* Badge — top-anchored so it's always visible below the navbar */}
          <div className="max-w-7xl mx-auto w-full px-6 pt-6 flex-shrink-0">
            <div className="inline-flex items-center gap-2.5 w-fit pointer-events-auto"
              style={{ border: '1px solid rgba(245,158,11,.4)', borderRadius: 16, padding: '7px 14px', background: 'rgba(245,158,11,.10)' }}>
              <span className="pd w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#F59E0B' }} aria-hidden />
              <span className="font-mono font-medium uppercase" style={{ color: '#F59E0B', fontSize: 11, letterSpacing: '0.14em', lineHeight: 1.5 }}>
                RMZ Ecoworld, Bangalore &nbsp;·&nbsp; 25-26 Sept 2026
              </span>
            </div>
          </div>

          {/* Title — mobile: top-anchored tight to venue badge; desktop: bottom-anchored flush above badge+CTAs */}
          <div className="flex-1 max-w-7xl mx-auto px-6 w-full flex items-start pt-3 lg:items-end lg:pt-0 lg:pb-6">
            <div className="w-full lg:w-[50%] flex flex-col pointer-events-auto">
            {/* Title */}
            <h1 className="font-display font-extrabold leading-none"
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
          </div>
          </div>
        </div>
      </div>

      {/* ── Theme badge + CTAs in normal flow — never overlaps anything ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-4 lg:-mt-8 flex flex-col items-start gap-3">
        {/* Theme badge */}
        <div style={{ opacity: 0, animation: 'heroFade .9s ease .62s forwards' }}>
          <div className="inline-flex items-center gap-4 mb-2 px-5 py-3 rounded-xl"
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
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#F59E0B' }}>⚡ Limited passes – Grab yours now</p>
        <button onClick={() => go('passes')} className="btn-purple text-sm whitespace-nowrap" style={{ padding: '10px 18px' }}>Get Passes →</button>
        <p className="text-sm" style={{ color: '#52506A' }}>
          Last few sponsor slots remaining &nbsp;
          <button onClick={onSponsor} className="font-semibold hover:opacity-75 transition-opacity" style={{ color: '#F59E0B' }}>
            Become a Sponsor &rarr;
          </button>
        </p>
      </div>

      {/* ── Film strip ── */}
      <div className="relative z-10 w-full pt-10 pb-10 overflow-hidden">
        <div className="relative">
          <div aria-hidden className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #05040C, transparent)' }} />
          <div aria-hidden className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #05040C, transparent)' }} />
          <div className="film-track">
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
        @keyframes filmScroll {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
        .film-track {
          display: flex;
          gap: 0.75rem;
          padding-left: 1.5rem;
          width: max-content;
          animation: filmScroll 45s linear infinite;
        }
        .film-track:hover { animation-play-state: paused; }
        @media (max-width: 1023px) {
          .hero-banner-wrap { min-height: 380px; }
        }
      `}</style>
    </section>
  )
}
