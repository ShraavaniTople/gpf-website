const items = ['GPF 2026','Bangalore','25-26 Sept 2026','Women in Product India','Product Innovation','2 Days','500+ Attendees','World-class Speakers','Hackathon','Workshops','Leadership','Networking']
const all = [...items, ...items, ...items]

export default function Marquee() {
  return (
    <div className="relative overflow-hidden py-4" style={{ background: '#0D0B1F', borderTop: '1px solid #1C1A32', borderBottom: '1px solid #1C1A32' }}>
      <div className="mq-track">
        {all.map((t, i) => (
          <span key={i} className="flex items-center gap-10 flex-shrink-0">
            <span className="font-mono text-[11px] uppercase tracking-[.18em] font-medium" style={{ color: '#52506A', whiteSpace: 'nowrap' }}>{t}</span>
            <span aria-hidden className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'rgba(124,58,237,.4)' }} />
          </span>
        ))}
      </div>
    </div>
  )
}
