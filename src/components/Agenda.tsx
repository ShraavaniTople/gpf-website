import { useEffect, useRef } from 'react'

// ─── Thematic tracks ──────────────────────────────────────────────────────────
const THEME_DAYS = [
  {
    label: 'Day 1',
    title: 'Building Intelligent Products',
    tracks: [
      { name: 'Product in the Intelligence Era', sessions: [
        'Building products that think, learn, and act: agents, copilots, automation, and AI-native experiences.',
        'From PM to Product Architect: navigating strategy, discovery, experimentation, and decision-making in the AI era.',
        'Designing the future of human-AI collaboration: trust, workflows, interfaces, and responsible innovation.',
      ]},
      { name: 'Growth, Distribution & Digital Influence', sessions: [
        'Winning attention in the age of infinite content: positioning, storytelling, and brand differentiation.',
        'Modern distribution playbooks: creator ecosystems, communities, partnerships, and AI-powered growth.',
        'Building trust at scale: turning audiences into advocates, customers, and loyal communities.',
      ]},
    ],
  },
  {
    label: 'Day 2',
    title: 'Building Companies & Leaders',
    tracks: [
      { name: 'Infinite Startups', sessions: [
        'Building AI-native companies from idea to scale: product, GTM, talent, and execution.',
        'Creating durable advantages in a rapidly changing world: moats, defensibility, and market timing.',
        'Founder, operator, and investor playbooks: lessons from building, backing, and scaling breakout companies.',
      ]},
      { name: 'Leading the Infinite Builders', sessions: [
        'Leading humans and AI together: the evolving role of leadership, management, and decision-making.',
        'Building high-performance organizations: talent, culture, and execution in fast-changing environments.',
        'Thriving in the future of work: careers, skills, adaptability, and lifelong learning.',
      ]},
    ],
  },
]

// ─── Schedule ─────────────────────────────────────────────────────────────────
type SType = 'registration' | 'opening' | 'keynote' | 'panel' | 'workshop'
           | 'fireside' | 'lightning' | 'lunch' | 'closing' | 'networking'
           | 'showcase' | 'roundtable' | 'hackathon'

type Speaker = { name: string; role: string }
type Session = { type: SType; venue?: string; title: string; detail?: string; speakers?: Speaker[] }
type Slot    = { time: string; sessions: Session[]; milestone?: string }

const ST: Record<SType, { label: string; color: string; bg: string }> = {
  registration: { label: 'Registration',  color: '#9CA3AF', bg: 'rgba(107,114,128,0.12)' },
  opening:      { label: 'Opening',       color: '#C4B5FD', bg: 'rgba(139,92,246,0.13)'  },
  keynote:      { label: 'Keynote',       color: '#A78BFA', bg: 'rgba(124,58,237,0.15)'  },
  panel:        { label: 'Panel',         color: '#93C5FD', bg: 'rgba(37,99,235,0.13)'   },
  workshop:     { label: 'Workshop',      color: '#34D399', bg: 'rgba(5,150,105,0.13)'   },
  fireside:     { label: 'Fireside Chat', color: '#FCD34D', bg: 'rgba(217,119,6,0.13)'   },
  lightning:    { label: 'Lightning Talk',color: '#FB923C', bg: 'rgba(234,88,12,0.13)'   },
  lunch:        { label: 'Lunch',         color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
  closing:      { label: 'Closing',       color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
  networking:   { label: 'Networking',    color: '#FB7185', bg: 'rgba(225,29,72,0.10)'   },
  showcase:     { label: 'Showcase',      color: '#38BDF8', bg: 'rgba(14,165,233,0.13)'  },
  roundtable:   { label: 'Roundtable',    color: '#FB7185', bg: 'rgba(225,29,72,0.10)'   },
  hackathon:    { label: 'Hackathon',     color: '#38BDF8', bg: 'rgba(14,165,233,0.11)'  },
}

const DAY1: Slot[] = [
  { time: '9:00 - 10:00', sessions: [
    { type: 'registration', title: 'Registration & Breakfast' },
  ]},
  { time: '10:00 - 10:25', sessions: [
    { type: 'opening', title: 'Welcome & Opening Remarks', speakers: [
      { name: 'Swati', role: 'Founder, WIP India' },
    ]},
  ]},
  { time: '10:30 - 11:00', sessions: [
    { type: 'keynote', title: 'Keynote', speakers: [
      { name: 'Murali', role: 'CTO, Freshworks' },
    ]},
  ]},
  { time: '11:05 - 11:40', sessions: [
    { type: 'keynote', title: 'Keynote', speakers: [
      { name: 'Sangeeta', role: 'Anthropic' },
    ]},
  ]},
  { time: '11:45 - 12:30', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'The Future of Enterprise Agents', speakers: [
      { name: 'Minakshi', role: 'Moderator' },
      { name: 'Sree Dhar', role: 'Freshworks' },
      { name: 'Seema', role: 'Databricks' },
      { name: 'Aditya', role: 'Salesforce' },
    ]},
    { type: 'workshop', venue: 'Toast Hall', title: 'Agentic Product Building' },
  ]},
  { time: '12:30 - 13:00', sessions: [
    { type: 'showcase', venue: 'Freshworks Hall', title: 'Platform & Partner Showcase', detail: 'Agent Studio, MCP, partner toolkits' },
    { type: 'hackathon', venue: 'Build Space', title: 'Hackathon Kickoff' },
  ]},
  { time: '13:00', milestone: 'BUILD BEGINS - 24-hour timer starts. Teams break to build rooms.', sessions: [] },
  { time: '13:00 - 14:00', sessions: [
    { type: 'lunch', title: 'Lunch' },
  ]},
  { time: '14:00 - 14:35', sessions: [
    { type: 'keynote', venue: 'Toast Hall', title: 'Session', speakers: [
      { name: 'Rajat', role: 'Director of Product, Toast' },
    ]},
    { type: 'workshop', venue: 'Freshworks Hall', title: 'GEO Workshop by Milestone' },
    { type: 'roundtable', venue: 'Boardroom', title: 'CXO Roundtable' },
  ]},
  { time: '14:40 - 15:25', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'Consumer Products & Agentic Commerce' },
    { type: 'panel', venue: 'Toast Hall', title: 'Panel Discussion' },
  ]},
  { time: '15:30 - 16:15', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'Creator-led Growth' },
    { type: 'workshop', venue: 'Toast Hall', title: 'Evals for PMs', speakers: [
      { name: 'Tanay', role: 'Product Lead' },
    ]},
  ]},
  { time: '16:20 - 16:50', sessions: [
    { type: 'fireside', venue: 'Freshworks Hall', title: 'Fireside Chat' },
    { type: 'lightning', venue: 'Toast Hall', title: 'Lightning Talks' },
  ]},
  { time: '16:50 - 17:00', sessions: [
    { type: 'closing', title: 'Closing Notes' },
  ]},
  { time: '17:00 - 18:00', sessions: [
    { type: 'networking', title: 'Festival Day 1 Close - Games & Engagement' },
  ]},
  { time: '18:30 - 21:00', sessions: [
    { type: 'networking', title: 'Leadership Dinner' },
  ]},
]

const DAY2: Slot[] = [
  { time: '8:00 - 10:00', sessions: [
    { type: 'registration', title: 'Doors Open & Breakfast' },
  ]},
  { time: '10:00 - 10:15', sessions: [
    { type: 'opening', title: 'Welcome & Recap' },
  ]},
  { time: '10:20 - 10:50', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'Build for Bharat Keynote' },
    { type: 'fireside', venue: 'Toast Hall', title: 'Fireside Chat', speakers: [
      { name: 'Neha', role: 'HerKey' },
    ]},
  ]},
  { time: '11:00', milestone: 'BUILD STOPS - Submissions frozen. Judging begins.', sessions: [] },
  { time: '11:00 - 11:30', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'VC Keynote' },
    { type: 'showcase', venue: 'Toast Hall', title: '2 Physical AI Demos' },
    { type: 'workshop', venue: 'Workshop Room', title: 'GTM for Product Teams', speakers: [
      { name: 'Deeksha', role: 'Product Leader' },
    ]},
  ]},
  { time: '11:35 - 12:05', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'GCCs as Product Innovation Hubs', speakers: [
      { name: 'Sheetal', role: '' },
      { name: 'Roopa', role: '' },
      { name: 'Abhishek', role: '' },
      { name: 'Supriya', role: '' },
    ]},
    { type: 'keynote', venue: 'Toast Hall', title: 'Speaker Session', speakers: [
      { name: 'Anshuman', role: 'Mercedes-Benz' },
    ]},
  ]},
  { time: '12:05 - 12:20', sessions: [
    { type: 'keynote', venue: 'Toast Hall', title: 'Leadership Session', speakers: [
      { name: 'Bhavna', role: 'Shenomics' },
    ]},
    { type: 'workshop', venue: 'Workshop Room', title: 'Applied AI Product Teardown', speakers: [
      { name: 'Adithi Sampath', role: 'Product Leader' },
    ]},
  ]},
  { time: '12:25 - 13:00', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'Speaker Session', speakers: [
      { name: 'Pulkit', role: 'Vedantu' },
    ]},
  ]},
  { time: '13:00 - 14:00', sessions: [
    { type: 'lunch', title: 'Lunch' },
  ]},
  { time: '14:00 - 15:00', sessions: [
    { type: 'showcase', venue: 'Freshworks Hall', title: 'Hackathon - Main Stage Showcase', detail: 'Top 4 finalists present their builds' },
    { type: 'showcase', venue: 'Toast Hall', title: '2-3 AI Product Demos' },
    { type: 'workshop', venue: 'Workshop Rooms', title: 'Fundraising + VC Lab / Build Your Brand' },
  ]},
  { time: '15:00 - 15:30', sessions: [
    { type: 'showcase', venue: 'Freshworks Hall', title: 'Winners Announced & Award Ceremony' },
    { type: 'keynote', venue: 'Toast Hall', title: 'Speaker Session' },
  ]},
  { time: '15:35 - 16:15', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'VC Panel', speakers: [
      { name: 'Shalini', role: 'Investor' },
      { name: 'Shveta', role: 'Investor' },
      { name: 'Subhadeep', role: 'Investor' },
    ]},
    { type: 'panel', venue: 'Toast Hall', title: 'Voice AI Panel' },
  ]},
  { time: '16:15 - 16:50', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'Speaker Session', speakers: [
      { name: 'Bhavik', role: '' },
    ]},
    { type: 'fireside', venue: 'Toast Hall', title: 'In Conversation', speakers: [
      { name: 'Ritika', role: '' },
      { name: 'Swati Dogra', role: '' },
    ]},
  ]},
  { time: '17:00 - 18:00', sessions: [
    { type: 'networking', title: 'Festival Day 2 Close - Band or Comedian' },
  ]},
  { time: '18:00 - 20:00', sessions: [
    { type: 'networking', title: 'Dinner Party - Team Celebration' },
  ]},
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useVis(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('vis'), delay); obs.disconnect() }
    }, { threshold: 0.05 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return ref
}

const SIMPLE: SType[] = ['registration', 'lunch', 'closing', 'networking']

function SessionCard({ session, parallel }: { session: Session; parallel: boolean }) {
  const st = ST[session.type]
  const isSimple = SIMPLE.includes(session.type) && !parallel

  if (isSimple) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ color: st.color, background: st.bg }}>
          {st.label}
        </span>
        <span className="text-sm font-medium" style={{ color: '#C4C0E0' }}>{session.title}</span>
      </div>
    )
  }

  return (
    <div className="rounded-xl p-5 flex flex-col h-full"
      style={{ background: '#080618', border: '1px solid #1C1A32' }}>
      {session.venue && (
        <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: '#3A3852' }}>
          {session.venue}
        </p>
      )}
      <span className="inline-block font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 self-start"
        style={{ color: st.color, background: st.bg }}>
        {st.label}
      </span>
      <h4 className="font-display font-semibold leading-snug"
        style={{ fontSize: 'clamp(14px,1.5vw,16px)', color: '#E2DFEF', letterSpacing: '-0.02em' }}>
        {session.title}
      </h4>
      {session.detail && (
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#52506A' }}>{session.detail}</p>
      )}
      {session.speakers && session.speakers.length > 0 && (
        <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: '1px solid #1C1A32' }}>
          {session.speakers.map((s, i) => (
            <div key={i}>
              <p className="text-[13px] font-semibold" style={{ color: '#C8C4E0' }}>{s.name}</p>
              {s.role && <p className="text-[11px]" style={{ color: '#52506A' }}>{s.role}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ScheduleDay({ label, date, slots }: { label: string; date: string; slots: Slot[] }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <span className="font-display font-bold text-lg px-4 py-1.5 rounded-full"
          style={{ background: '#7C3AED', color: '#fff' }}>
          {label}
        </span>
        <span className="font-mono text-xs" style={{ color: '#52506A' }}>{date}</span>
      </div>

      <div style={{ borderTop: '1px solid #1C1A32' }}>
        {slots.map((slot, i) => {
          if (slot.milestone) {
            return (
              <div key={i} className="flex items-center gap-6 py-4" style={{ borderBottom: '1px solid #1C1A32' }}>
                <span className="w-28 sm:w-36 flex-shrink-0 font-mono text-[11px] text-right" style={{ color: '#7C3AED' }}>
                  {slot.time}
                </span>
                <div className="flex-1 rounded-xl px-5 py-3"
                  style={{ background: 'rgba(124,58,237,0.12)', border: '1px dashed rgba(124,58,237,0.4)' }}>
                  <p className="font-semibold text-sm" style={{ color: '#A78BFA' }}>{slot.milestone}</p>
                </div>
              </div>
            )
          }

          const parallel = slot.sessions.length > 1
          const cols = slot.sessions.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

          return (
            <div key={i} className="flex gap-6 py-6" style={{ borderBottom: '1px solid #0E0C22' }}>
              <div className="w-28 sm:w-36 flex-shrink-0 text-right pt-1">
                <span className="font-mono text-[11px] leading-snug" style={{ color: '#4A4865' }}>
                  {slot.time}
                </span>
              </div>

              {parallel ? (
                <div className={`flex-1 grid gap-3 ${cols}`}>
                  {slot.sessions.map((s, j) => <SessionCard key={j} session={s} parallel={true} />)}
                </div>
              ) : (
                <div className="flex-1">
                  <SessionCard session={slot.sessions[0]} parallel={false} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Agenda() {
  const headRef  = useVis()
  const day1Ref  = useVis(80)
  const day2Ref  = useVis(120)
  const schedRef = useVis(160)

  return (
    <section id="agenda" className="relative py-28 px-6 overflow-hidden">
      <div className="bg-num" style={{ top: '-5%', left: '-2%' }} aria-hidden>04</div>
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headRef} className="sr mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Schedule</p>
          <h2 className="font-display font-extrabold leading-none"
            style={{ fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
            2 Days of Impact
          </h2>
        </div>

        {/* Thematic tracks - Day 1 */}
        <div ref={day1Ref} className="sr mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-display font-bold text-lg px-4 py-1.5 rounded-full"
              style={{ background: '#7C3AED', color: '#fff' }}>
              {THEME_DAYS[0].label}
            </span>
            <p className="font-display font-semibold text-base"
              style={{ color: '#52506A', letterSpacing: '-0.01em' }}>
              {THEME_DAYS[0].title}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {THEME_DAYS[0].tracks.map((track, ti) => (
              <div key={ti} className="rounded-2xl overflow-hidden"
                style={{ background: '#080618', border: '1px solid #1C1A32' }}>
                <div className="h-1" style={{ background: ti === 0 ? '#7C3AED' : '#F59E0B' }} />
                <div className="p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[.18em] mb-3"
                    style={{ color: ti === 0 ? '#A78BFA' : '#FCD34D' }}>Track {ti + 1}</p>
                  <h3 className="font-display font-bold mb-7 leading-snug"
                    style={{ fontSize: 'clamp(16px,2vw,22px)', color: '#F0EEF8', letterSpacing: '-0.02em' }}>
                    {track.name}
                  </h3>
                  <ul className="space-y-3">
                    {track.sessions.map((s, si) => (
                      <li key={si} className="flex items-start gap-3">
                        <span aria-hidden className="w-1 h-1 rounded-full mt-2.5 flex-shrink-0"
                          style={{ background: ti === 0 ? '#7C3AED' : '#F59E0B' }} />
                        <span className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thematic tracks - Day 2 */}
        <div ref={day2Ref} className="sr mb-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-display font-bold text-lg px-4 py-1.5 rounded-full"
              style={{ background: '#7C3AED', color: '#fff' }}>
              {THEME_DAYS[1].label}
            </span>
            <p className="font-display font-semibold text-base"
              style={{ color: '#52506A', letterSpacing: '-0.01em' }}>
              {THEME_DAYS[1].title}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {THEME_DAYS[1].tracks.map((track, ti) => (
              <div key={ti} className="rounded-2xl overflow-hidden"
                style={{ background: '#080618', border: '1px solid #1C1A32' }}>
                <div className="h-1" style={{ background: ti === 0 ? '#7C3AED' : '#F59E0B' }} />
                <div className="p-8">
                  <p className="font-mono text-[11px] uppercase tracking-[.18em] mb-3"
                    style={{ color: ti === 0 ? '#A78BFA' : '#FCD34D' }}>Track {ti + 3}</p>
                  <h3 className="font-display font-bold mb-7 leading-snug"
                    style={{ fontSize: 'clamp(16px,2vw,22px)', color: '#F0EEF8', letterSpacing: '-0.02em' }}>
                    {track.name}
                  </h3>
                  <ul className="space-y-3">
                    {track.sessions.map((s, si) => (
                      <li key={si} className="flex items-start gap-3">
                        <span aria-hidden className="w-1 h-1 rounded-full mt-2.5 flex-shrink-0"
                          style={{ background: ti === 0 ? '#7C3AED' : '#F59E0B' }} />
                        <span className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full schedule */}
        <div ref={schedRef} className="sr">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-10" style={{ color: '#7C3AED' }}>
            Full Schedule
          </p>
          <div className="space-y-16">
            <ScheduleDay label="Day 1" date="25 September" slots={DAY1} />
            <ScheduleDay label="Day 2" date="26 September" slots={DAY2} />
          </div>
        </div>

      </div>
    </section>
  )
}
