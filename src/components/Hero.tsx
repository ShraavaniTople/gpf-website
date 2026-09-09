import type React from 'react'
import heroBanner from '../assets/hero-banner.webp'

interface HeroProps { onSponsor: () => void; onCommunity: () => void }

const filmPhotos = [
  { src: './photos/group.webp', alt: 'Women in Product India community group' },
  { src: './photos/speaker1.webp', alt: 'Speaker at Women in Product India event' },
  { src: './photos/audience1.webp', alt: 'Attendees at product conference' },
  { src: './photos/speaker2.webp', alt: 'Speaker on stage' },
  { src: './photos/audience3.webp', alt: 'Event audience' },
]

function go(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

const venueBadge = (
  <div className="inline-flex items-center gap-2.5 w-fit"
    style={{ border: '1px solid rgba(245,158,11,.4)', borderRadius: 16, padding: '7px 14px', background: 'rgba(245,158,11,.10)' }}>
    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#F59E0B' }} aria-hidden />
    <span className="font-mono font-medium uppercase" style={{ color: '#F59E0B', fontSize: 11, letterSpacing: '0.14em', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
      RMZ Ecoworld, Bangalore &nbsp;·&nbsp; 25-26 Sept 2026
    </span>
  </div>
)

const venueBadgeMobile = (
  <div className="inline-flex items-center gap-2 w-fit"
    style={{ border: '1px solid rgba(245,158,11,.4)', borderRadius: 16, padding: '6px 12px', background: 'rgba(245,158,11,.10)' }}>
    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#F59E0B' }} aria-hidden />
    <span className="font-mono font-medium uppercase" style={{ color: '#F59E0B', fontSize: 10, letterSpacing: '0.07em', lineHeight: 1.5 }}>
      RMZ Ecoworld, Bangalore · 25-26 Sept 2026
    </span>
  </div>
)

const S: React.CSSProperties = { fontFamily: 'JetBrains Mono, monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.13em', color: '#8B87B8', whiteSpace: 'nowrap' }

const sponsorRow = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
    <span style={S}>Presented by</span>
    <img src="/wip-logo.webp" alt="Women in Product India" style={{ height: 48, width: 48, objectFit: 'contain', borderRadius: '50%', flexShrink: 0 }} />
    <div style={{ width: 1, height: 40, background: '#2A2840', flexShrink: 0 }} />
    <span style={S}>Powered by</span>
    <img src="/logos/freshworks-full.webp" alt="Freshworks" style={{ height: 26, width: 'auto', maxWidth: 130, objectFit: 'contain', opacity: 0.9, flexShrink: 0 }} />
    <div style={{ width: 1, height: 40, background: '#2A2840', flexShrink: 0 }} />
    <span style={S}>Co-powered by</span>
    <img src="/logos/toast.webp" alt="Toast" style={{ height: 26, width: 'auto', maxWidth: 110, objectFit: 'contain', opacity: 0.9, flexShrink: 0 }} />
  </div>
)

const titleLines = [
  { text: 'The Great', cls: '',     delay: '0.1s' },
  { text: 'Product',   cls: '',     delay: '0.22s' },
  { text: 'Festival',  cls: 'grad', delay: '0.34s' },
]

export default function Hero({ onSponsor }: HeroProps) {
  return (
    <section className="hero-section relative overflow-hidden" style={{ background: '#05040C' }}>

      {/* ── MOBILE hero ── */}
      <div className="lg:hidden relative px-6 pt-6 pb-8"
        style={{ background: 'radial-gradient(120% 80% at 80% 20%, rgba(124,58,237,.3) 0%, transparent 55%), radial-gradient(90% 60% at 10% 90%, rgba(245,158,11,.15) 0%, transparent 55%)' }}>
        {/* Sponsor row — each label+logo grouped so they never split across lines */}
        <div className="mb-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px 14px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={S}>Presented by</span>
              <img src="/wip-logo.webp" alt="Women in Product India" style={{ height: 30, width: 30, objectFit: 'contain', borderRadius: '50%' }} />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={S}>Powered by</span>
              <img src="/logos/freshworks-full.webp" alt="Freshworks" style={{ height: 16, width: 'auto', maxWidth: 100, objectFit: 'contain', opacity: 0.9 }} />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={S}>Co-powered by</span>
              <img src="/logos/toast.webp" alt="Toast" style={{ height: 16, width: 'auto', maxWidth: 80, objectFit: 'contain', opacity: 0.9 }} />
            </span>
          </div>
        </div>
        {/* Venue badge */}
        <div className="mb-5">{venueBadgeMobile}</div>
        <h1 className="font-display font-extrabold leading-none mb-5"
          style={{ fontSize: 'clamp(52px,14vw,72px)', letterSpacing: '-0.045em', overflow: 'hidden' }}>
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
        <div className="flex flex-col items-start gap-2 mb-3">
          <button onClick={() => go('passes')} className="btn-purple text-sm whitespace-nowrap" style={{ padding: '10px 18px' }}>Get Passes →</button>
          <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#F59E0B' }}>Limited passes · Grab yours now</p>
        </div>
      </div>

      {/* ── DESKTOP hero ── */}
      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroBanner} alt="The Great Product Festival speakers" width={1800} height={750} fetchPriority="high" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <div aria-hidden className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(5,4,12,.92) 0%, rgba(5,4,12,.75) 25%, rgba(5,4,12,.3) 50%, rgba(5,4,12,0) 70%)' }} />
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 pointer-events-none" style={{ height: '30px', background: 'linear-gradient(to bottom, #05040C 0%, transparent 100%)' }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: '120px', background: 'linear-gradient(to top, #05040C 0%, rgba(5,4,12,.5) 60%, transparent 100%)' }} />
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-3 left-0 right-0 pointer-events-auto">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-4">{sponsorRow}</div>
              <div className="mb-4">{venueBadge}</div>
              <div className="w-[50%]">
                <h1 className="font-display font-extrabold leading-none"
                  style={{ fontSize: 'clamp(40px,6vw,88px)', letterSpacing: '-0.045em', overflow: 'hidden' }}>
                  {titleLines.map(({ text, cls, delay }) => (
                    <span key={text} className="block" style={{ overflow: 'hidden' }}>
                      <span className={`block ${cls}`} style={{ color: cls ? undefined : '#F0EEF8', opacity: 0, transform: 'translateY(105%)', animation: `heroLine .9s cubic-bezier(0.16,1,0.3,1) ${delay} forwards` }}>
                        {text}
                      </span>
                    </span>
                  ))}
                </h1>
              </div>
              <div className="mt-5 flex flex-col items-start gap-5" style={{ opacity: 0, animation: 'heroFade .9s ease .62s forwards' }}>
                <div className="inline-flex items-center gap-4 px-5 py-3 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,.1) 0%, rgba(245,158,11,.05) 100%)', border: '1px solid rgba(124,58,237,.2)', backdropFilter: 'blur(8px)' }}>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-mono text-[9px] uppercase tracking-[.3em]" style={{ color: '#A78BFA' }}>Conference Theme</p>
                    <p className="font-display font-extrabold text-base leading-tight" style={{ letterSpacing: '-0.03em', color: '#F0EEF8' }}>
                      Infinite <span style={{ background: 'linear-gradient(90deg, #A78BFA, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Builders</span>
                    </p>
                  </div>
                  <div className="w-[2px] h-8 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #7C3AED, #F59E0B)' }} />
                  <p className="font-mono text-[9px] uppercase tracking-[.15em] leading-tight" style={{ color: '#52506A' }}>TGPF<br/>2026</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => go('passes')} className="btn-purple text-sm whitespace-nowrap" style={{ padding: '10px 18px' }}>Get Passes →</button>
                  <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: '#F59E0B' }}>Limited passes · Grab yours now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Partners strip — rest of logos ── */}
      <div className="relative z-10 w-full px-6 pb-5 pt-2 lg:-mt-[60px]">
        <p className="font-mono text-center mb-4" style={{ fontSize: 10, letterSpacing: '0.22em', color: '#52506A', textTransform: 'uppercase' }}>Our Partners</p>
        <div className="flex items-center justify-center flex-wrap" style={{ gap: '14px 32px' }}>
          {([
            { src: '/logos/kdem.webp',            alt: 'KDEM',          mw: 80  },
            { src: '/logos/databricks.webp',      alt: 'Databricks',    mw: 110 },
            { src: '/logos/anthropic-v2.webp',    alt: 'Anthropic',     mw: 110 },
            { src: '/logos/sarvam.webp',          alt: 'Sarvam',        mw: 90  },
            { src: '/logos/elevenlabs-crop.webp', alt: 'ElevenLabs',    mw: 110 },
            { src: '/logos/dodopayments.webp',    alt: 'Dodo Payments', mw: 110 },
            { src: '/logos/aws.webp',             alt: 'AWS',           mw: 60  },
          ] as { src: string; alt: string; mw: number }[]).map(({ src, alt, mw }) => (
            <div key={alt} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 36 }}>
              <img src={src} alt={alt}
                style={{ height: 22, width: 'auto', maxWidth: mw, objectFit: 'contain', opacity: 0.92 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Film strip ── */}
      <div className="relative z-10 w-full pt-6 pb-10 overflow-hidden">
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
        .hero-section { padding-top: 68px; }
        @media (min-width: 1024px) { .hero-section { padding-top: 118px; } }
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
