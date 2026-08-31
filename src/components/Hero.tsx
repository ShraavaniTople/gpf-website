import heroBanner from '../assets/hero-banner.png'

interface HeroProps { onSponsor: () => void; onCommunity: () => void }

const filmPhotos = [
  { src: './photos/group.jpg', alt: 'Women in Product India community group' },
  { src: './photos/speaker1.jpg', alt: 'Speaker at Women in Product India event' },
  { src: './photos/audience1.jpg', alt: 'Attendees at product conference' },
  { src: './photos/speaker2.jpg', alt: 'Speaker on stage' },
  { src: './photos/audience3.jpg', alt: 'Event audience' },
]

function go(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

const venueBadge = (
  <div className="inline-flex items-center gap-2.5 w-fit"
    style={{ border: '1px solid rgba(245,158,11,.4)', borderRadius: 16, padding: '7px 14px', background: 'rgba(245,158,11,.10)' }}>
    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#F59E0B' }} aria-hidden />
    <span className="font-mono font-medium uppercase" style={{ color: '#F59E0B', fontSize: 11, letterSpacing: '0.14em', lineHeight: 1.5 }}>
      RMZ Ecoworld, Bangalore &nbsp;·&nbsp; 25-26 Sept 2026
    </span>
  </div>
)

const titleLines = [
  { text: 'The Great', cls: '',     delay: '0.1s' },
  { text: 'Product',   cls: '',     delay: '0.22s' },
  { text: 'Festival',  cls: 'grad', delay: '0.34s' },
]

export default function Hero({ onSponsor }: HeroProps) {
  return (
    <section className="relative overflow-hidden" style={{ background: '#05040C', paddingTop: '118px' }}>

      {/* ── MOBILE hero — everything in one unified div, no inter-div gaps ── */}
      <div className="lg:hidden relative px-6 pt-5 pb-8"
        style={{ background: 'radial-gradient(120% 80% at 80% 20%, rgba(124,58,237,.3) 0%, transparent 55%), radial-gradient(90% 60% at 10% 90%, rgba(245,158,11,.15) 0%, transparent 55%)' }}>
        <div className="mb-4">{venueBadge}</div>
        <h1 className="font-display font-extrabold leading-none mb-5"
          style={{ fontSize: 'clamp(52px,13vw,80px)', letterSpacing: '-0.045em', overflow: 'hidden' }}>
          {titleLines.map(({ text, cls, delay }) => (
            <span key={text} className="block" style={{ overflow: 'hidden' }}>
              <span className={`block ${cls}`} style={{ color: cls ? undefined : '#F0EEF8', opacity: 0, transform: 'translateY(105%)', animation: `heroLine .9s cubic-bezier(0.16,1,0.3,1) ${delay} forwards` }}>
                {text}
              </span>
            </span>
          ))}
        </h1>
        {/* Theme badge */}
        <div className="mb-4" style={{ opacity: 0, animation: 'heroFade .9s ease .62s forwards' }}>
          <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,.1) 0%, rgba(245,158,11,.05) 100%)', border: '1px solid rgba(124,58,237,.2)', backdropFilter: 'blur(8px)' }}>
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-[9px] uppercase tracking-[.3em]" style={{ color: '#A78BFA' }}>Conference Theme</p>
              <p className="font-display font-extrabold text-base leading-tight" style={{ letterSpacing: '-0.03em', color: '#F0EEF8' }}>
                Infinite <span style={{ background: 'linear-gradient(90deg, #A78BFA, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Builders</span>
              </p>
            </div>
          </div>
        </div>
        {/* CTAs */}
        <p className="font-mono text-[10px] uppercase tracking-[.18em] mb-3" style={{ color: '#F59E0B' }}>⚡ Limited passes – Grab yours now</p>
        <button onClick={() => go('passes')} className="btn-purple text-sm whitespace-nowrap mb-3" style={{ padding: '10px 18px' }}>Get Passes →</button>
        <p className="text-sm" style={{ color: '#52506A' }}>
          Last few sponsor slots remaining &nbsp;
          <button onClick={onSponsor} className="font-semibold hover:opacity-75 transition-opacity" style={{ color: '#F59E0B' }}>Become a Sponsor →</button>
        </p>
      </div>

      {/* ── DESKTOP hero — banner image with absolute text overlay ── */}
      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroBanner} alt="The Great Product Festival speakers" style={{ width: '100%', height: 'auto' }} />
        {/* Gradients */}
        <div aria-hidden className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(5,4,12,.92) 0%, rgba(5,4,12,.75) 25%, rgba(5,4,12,.3) 50%, rgba(5,4,12,0) 70%)' }} />
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 pointer-events-none" style={{ height: '80px', background: 'linear-gradient(to bottom, #05040C 0%, rgba(5,4,12,.5) 50%, transparent 100%)' }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: '80px', background: 'linear-gradient(to top, #05040C 0%, rgba(5,4,12,.5) 50%, transparent 100%)' }} />
        {/* Text overlay — venue badge + title anchored together at bottom-left */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-8 pointer-events-auto">
            <div className="mb-4">{venueBadge}</div>
            <div className="w-[50%]">
              <h1 className="font-display font-extrabold leading-none"
                style={{ fontSize: 'clamp(52px,8.5vw,128px)', letterSpacing: '-0.045em', overflow: 'hidden' }}>
                {titleLines.map(({ text, cls, delay }) => (
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

      {/* ── Theme badge + CTAs — desktop only, pulled up into banner ── */}
      <div className="hidden lg:flex relative z-10 max-w-7xl mx-auto px-6 pt-3 pb-4 flex-col items-start gap-3">
        <div style={{ opacity: 0, animation: 'heroFade .9s ease .62s forwards' }}>
          <div className="inline-flex items-center gap-4 px-5 py-3 rounded-xl"
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
          <div aria-hidden className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #05040C, transparent)' }} />
          <div aria-hidden className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #05040C, transparent)' }} />
          <div className="film-track">
            {[...filmPhotos, ...filmPhotos].map((p, i) => (
              <div key={i} className="flex-shrink-0 overflow-hidden rounded-xl"
                style={{ width: 'clamp(140px, 42vw, 260px)', height: 'clamp(90px, 28vw, 160px)', background: '#1C1A32' }}>
                <img src={p.src} alt={p.alt} className="w-full h-full object-cover"
                  loading={i < 6 ? 'eager' : 'lazy'} decoding="async" />
              </div>
            ))}
          </div>
        </div>
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
      `}</style>
    </section>
  )
}
