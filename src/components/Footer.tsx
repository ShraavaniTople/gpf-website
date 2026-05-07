import { Instagram, Linkedin, Globe } from 'lucide-react'

const socials = [
  { icon: Instagram, label: 'Instagram',  href: 'https://www.instagram.com/womeninproductindia' },
  { icon: Linkedin,  label: 'LinkedIn',   href: 'https://www.linkedin.com/company/wip-india/' },
  { icon: Globe,     label: 'Website',    href: 'https://womeninproductindia.com/' },
]

const navLinks = [
  { label: 'Why Attend', id: 'why-attend' },
  { label: 'Agenda',     id: 'agenda' },
  { label: 'Speakers',   id: 'speakers' },
  { label: 'Passes',     id: 'passes' },
  { label: 'Hackathon',  id: 'hackathon' },
  { label: 'Sponsor',    id: 'sponsor' },
]

function go(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

// Custom X (Twitter) icon
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#080618', borderTop: '1px solid #1C1A32' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="font-display font-extrabold text-2xl" style={{ color: '#F0EEF8', letterSpacing: '-0.03em' }}>GPF</span>
              <span className="font-mono text-sm font-medium" style={{ color: '#F59E0B' }}>2026</span>
            </div>
            <p className="font-display font-bold text-lg leading-snug mb-2" style={{ color: '#F0EEF8' }}>The Great Product Festival</p>
            <p className="text-xs mb-1" style={{ color: '#52506A' }}>A Women in Product India Initiative</p>
            <p className="text-xs leading-relaxed mt-4 max-w-xs" style={{ color: '#52506A' }}>
              India's most inclusive product management conference. All genders. All levels. All industries.
              <br />Bangalore · Q3 2026.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-6" style={{ color: '#52506A' }}>Quick Links</p>
            <ul className="space-y-3">
              {navLinks.map(l => (
                <li key={l.id}>
                  <button onClick={() => go(l.id)} className="text-sm transition-colors duration-200"
                    style={{ color: '#6B7280', fontFamily: 'Inter' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F0EEF8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + socials */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest mb-6" style={{ color: '#52506A' }}>Connect</p>
            <a href="mailto:hello@womeninproductindia.com" className="text-sm block mb-6 transition-colors duration-200"
              style={{ color: '#6B7280' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F0EEF8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
              hello@womeninproductindia.com
            </a>
            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ background: '#1C1A32', color: '#6B7280', border: '1px solid rgba(28,26,50,0.8)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,.15)'; (e.currentTarget as HTMLElement).style.color = '#A78BFA'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,.3)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1C1A32'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,26,50,0.8)' }}>
                  <s.icon size={15} />
                </a>
              ))}
              {/* X/Twitter */}
              <a href="https://x.com/wipindia" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: '#1C1A32', color: '#6B7280', border: '1px solid rgba(28,26,50,0.8)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,.15)'; (e.currentTarget as HTMLElement).style.color = '#A78BFA'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,.3)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1C1A32'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,26,50,0.8)' }}>
                <XIcon size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderTop: '1px solid #1C1A32' }}>
          <p className="font-mono text-xs" style={{ color: '#52506A' }}>
            &copy; 2026 The Great Product Festival &nbsp;&middot;&nbsp; Women in Product India
          </p>
          <p className="font-mono text-xs" style={{ color: '#52506A' }}>
            Bangalore &nbsp;&middot;&nbsp; Q3 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
