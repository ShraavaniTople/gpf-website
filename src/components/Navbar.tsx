import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Why Attend',    id: 'why-attend' },
  { label: 'Agenda',        id: 'agenda' },
  { label: 'Hackathon',     id: 'hackathon' },
  { label: 'Speakers',      id: 'speakers' },
  { label: 'Passes',        id: 'passes' },
  { label: 'Sponsor',       id: 'sponsor' },
  { label: 'FAQ',           id: 'faq' },
]

const externalLinks = [
  { label: 'WiP Community', href: 'https://womeninproductindia.com' },
]

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="relative w-full flex items-center justify-center px-8 sm:px-10 py-2.5 text-center"
      style={{ background: 'linear-gradient(90deg, rgba(124,58,237,.18) 0%, rgba(245,158,11,.12) 50%, rgba(124,58,237,.18) 100%)', borderBottom: '1px solid rgba(245,158,11,.15)' }}
    >
      {/* Scrolling text on mobile, static on desktop */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#F59E0B' }} aria-hidden />
        <p className="font-mono text-[11px] uppercase tracking-[.18em] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#F0EEF8' }}>
          Early Bird Pricing is Live &nbsp;&middot;&nbsp; Limited Passes Available &nbsp;&middot;&nbsp;
          <button
            onClick={() => go('passes')}
            className="underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: '#F59E0B' }}
          >
            Get yours now
          </button>
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
        style={{ color: '#52506A' }}
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [banner, setBanner] = useState(true)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Announcement bar */}
        {banner && (
          <div style={{ animation: 'fadeIn .5s ease' }}>
            <AnnouncementBar onDismiss={() => setBanner(false)} />
          </div>
        )}

        {/* Nav */}
        <nav
          className="transition-all duration-500"
          style={scrolled ? { background: 'rgba(5,4,12,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(28,26,50,0.8)' } : {}}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center flex-shrink-0">
              <img
                src="/gpf-logo.png"
                alt="The Great Product Festival"
                style={{ height: 60, width: 'auto' }}
              />
            </button>

            <div className="hidden xl:flex items-center gap-6">
              {links.map(l => (
                <button key={l.id} onClick={() => go(l.id)}
                  className="text-xs font-medium tracking-wide transition-colors duration-200"
                  style={{ color: '#6B7280', fontFamily: 'Inter' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F0EEF8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                >{l.label}</button>
              ))}
              {externalLinks.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium tracking-wide transition-colors duration-200"
                  style={{ color: '#6B7280', fontFamily: 'Inter', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F0EEF8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                >{l.label}</a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => go('passes')} className="btn-purple hidden sm:block" style={{ padding: '9px 22px', fontSize: '13px' }}>
                Get Passes
              </button>
              <button onClick={() => setOpen(true)} className="xl:hidden w-9 h-9 flex items-center justify-center rounded-lg" style={{ color: '#9490AD', border: '1px solid #1C1A32' }}>
                <Menu size={18} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#05040C' }}>
          <div className="flex items-center justify-between px-6 h-16 border-b" style={{ borderColor: '#1C1A32' }}>
            <img src="/gpf-logo.png" alt="The Great Product Festival" style={{ height: 40, width: 'auto' }} />
            <button onClick={() => setOpen(false)} style={{ color: '#9490AD' }}><X size={22} /></button>
          </div>
          <div className="flex flex-col flex-1 justify-center px-8 gap-6">
            {links.map(l => (
              <button key={l.id} onClick={() => { go(l.id); setOpen(false) }}
                className="text-left font-display font-bold text-3xl text-white transition-colors duration-200"
              >{l.label}</button>
            ))}
            {externalLinks.map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                className="text-left font-display font-bold text-3xl text-white transition-colors duration-200"
                style={{ textDecoration: 'none' }}
                onClick={() => setOpen(false)}
              >{l.label}</a>
            ))}
            <button onClick={() => { go('passes'); setOpen(false) }} className="btn-purple mt-4 w-full text-center" style={{ padding: '14px 28px' }}>
              Get Passes
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </>
  )
}
