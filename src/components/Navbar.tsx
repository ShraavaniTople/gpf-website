import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Why Attend', id: 'why-attend' },
  { label: 'Agenda',     id: 'agenda' },
  { label: 'Hackathon',  id: 'hackathon' },
  { label: 'Speakers',   id: 'speakers' },
  { label: 'Passes',     id: 'passes' },
  { label: 'Sponsor',    id: 'sponsor' },
  { label: 'Press',      id: 'press' },
  { label: 'WiP Community', id: 'community' },
]

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={scrolled ? { background: 'rgba(5,4,12,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(28,26,50,0.8)' } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-baseline gap-1.5 flex-shrink-0">
            <span className="font-display font-extrabold text-xl text-white tracking-tight">GPF</span>
            <span className="font-mono text-sm font-medium" style={{ color: '#F59E0B' }}>2026</span>
          </button>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-6">
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)}
                className="text-xs font-medium tracking-wide transition-colors duration-200"
                style={{ color: '#6B7280', fontFamily: 'Inter' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F0EEF8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
              >{l.label}</button>
            ))}
          </div>

          {/* CTA + hamburger */}
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

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#05040C' }}>
          <div className="flex items-center justify-between px-6 h-16 border-b" style={{ borderColor: '#1C1A32' }}>
            <span className="font-display font-extrabold text-xl text-white">GPF <span style={{ color: '#F59E0B' }}>2026</span></span>
            <button onClick={() => setOpen(false)} style={{ color: '#9490AD' }}><X size={22} /></button>
          </div>
          <div className="flex flex-col flex-1 justify-center px-8 gap-6">
            {links.map(l => (
              <button key={l.id} onClick={() => { go(l.id); setOpen(false) }}
                className="text-left font-display font-bold text-3xl text-white hover:text-g-violet transition-colors duration-200"
              >{l.label}</button>
            ))}
            <button onClick={() => { go('passes'); setOpen(false) }} className="btn-purple mt-4 w-full text-center" style={{ padding: '14px 28px' }}>
              Get Passes
            </button>
          </div>
        </div>
      )}
    </>
  )
}
