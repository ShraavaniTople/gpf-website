import { useEffect, useRef, useState } from 'react'

// ─── Thematic tracks ──────────────────────────────────────────────────────────
const THEME_DAYS = [
  {
    label: 'Day 1', title: 'Building Intelligent Products',
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
    label: 'Day 2', title: 'Building Companies & Leaders',
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

// ─── Schedule types & data ────────────────────────────────────────────────────
type SType = 'registration' | 'opening' | 'keynote' | 'panel' | 'workshop'
           | 'fireside' | 'lightning' | 'lunch' | 'closing' | 'networking'
           | 'showcase' | 'roundtable' | 'hackathon'

type Speaker = { name: string; role: string }
type Session = { type: SType; venue?: string; title: string; detail?: string; speakers?: Speaker[] }
type Slot    = { start: string; end?: string; sessions: Session[]; milestone?: string }

const ST: Record<SType, { label: string; color: string; bg: string }> = {
  registration: { label: 'Registration',   color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)' },
  opening:      { label: 'Opening',        color: '#C4B5FD', bg: 'rgba(167,139,250,0.14)' },
  keynote:      { label: 'Keynote',        color: '#A78BFA', bg: 'rgba(124,58,237,0.16)'  },
  panel:        { label: 'Panel',          color: '#93C5FD', bg: 'rgba(59,130,246,0.14)'  },
  workshop:     { label: 'Workshop',       color: '#34D399', bg: 'rgba(16,185,129,0.13)'  },
  fireside:     { label: 'Fireside Chat',  color: '#FCD34D', bg: 'rgba(245,158,11,0.13)'  },
  lightning:    { label: 'Lightning Talk', color: '#FB923C', bg: 'rgba(249,115,22,0.13)'  },
  lunch:        { label: 'Lunch',          color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)' },
  closing:      { label: 'Closing',        color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)' },
  networking:   { label: 'Networking',     color: '#FB7185', bg: 'rgba(251,113,133,0.12)' },
  showcase:     { label: 'Showcase',       color: '#38BDF8', bg: 'rgba(56,189,248,0.13)'  },
  roundtable:   { label: 'Roundtable',     color: '#FB7185', bg: 'rgba(251,113,133,0.12)' },
  hackathon:    { label: 'Hackathon',      color: '#38BDF8', bg: 'rgba(56,189,248,0.11)'  },
}

const DAY1: Slot[] = [
  { start: '9:00',  end: '10:00', sessions: [{ type: 'registration', title: 'Registration & Breakfast' }]},
  { start: '10:00', end: '10:25', sessions: [{ type: 'opening', title: 'Welcome & Opening Remarks',
      speakers: [{ name: 'Swati', role: 'Founder, WIP India' }] }]},
  { start: '10:30', end: '11:00', sessions: [{ type: 'keynote', venue: 'Freshworks Hall', title: 'Keynote',
      speakers: [{ name: 'Murali', role: 'CTO, Freshworks' }] }]},
  { start: '11:05', end: '11:40', sessions: [{ type: 'keynote', venue: 'Freshworks Hall', title: 'Keynote',
      speakers: [{ name: 'Sangeeta', role: 'Anthropic' }] }]},
  { start: '11:45', end: '12:30', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'The Future of Enterprise Agents',
      speakers: [
        { name: 'Minakshi', role: 'Moderator' },
        { name: 'Sree Dhar', role: 'Freshworks' },
        { name: 'Seema', role: 'Databricks' },
        { name: 'Aditya', role: 'Salesforce' },
      ]},
    { type: 'workshop', venue: 'Toast Workshop Room', title: 'Agentic Product Building' },
  ]},
  { start: '12:30', end: '13:00', sessions: [
    { type: 'showcase', venue: 'Freshworks Hall', title: 'Platform & Partner Showcase',
      detail: 'Agent Studio, MCP, partner toolkits' },
    { type: 'hackathon', venue: 'Build Space', title: 'Hackathon Kickoff' },
  ]},
  { start: '13:00', sessions: [], milestone: 'BUILD BEGINS - 24-hour timer starts. Teams break to build rooms.' },
  { start: '13:00', end: '14:00', sessions: [{ type: 'lunch', title: 'Lunch' }]},
  { start: '14:00', end: '14:35', sessions: [
    { type: 'keynote', venue: 'Toast Hall', title: 'Session',
      speakers: [{ name: 'Rajat', role: 'Director of Product, Toast' }] },
    { type: 'workshop', venue: 'Freshworks Hall', title: 'GEO Workshop' },
    { type: 'roundtable', venue: 'Boardroom', title: 'CXO Roundtable' },
  ]},
  { start: '14:40', end: '15:25', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'Consumer Products & Agentic Commerce' },
    { type: 'panel', venue: 'Toast Hall', title: 'Panel Discussion' },
  ]},
  { start: '15:30', end: '16:15', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'Creator-led Growth' },
    { type: 'workshop', venue: 'Toast Hall', title: 'Evals for PMs',
      speakers: [{ name: 'Tanay', role: 'Product Lead' }] },
  ]},
  { start: '16:20', end: '16:50', sessions: [
    { type: 'fireside', venue: 'Freshworks Hall', title: 'Fireside Chat' },
    { type: 'lightning', venue: 'Toast Hall', title: 'Lightning Talks' },
  ]},
  { start: '16:50', end: '17:00', sessions: [{ type: 'closing', title: 'Closing Notes' }]},
  { start: '17:00', end: '18:00', sessions: [{ type: 'networking', title: 'Festival Day 1 Close - Games & Engagement' }]},
  { start: '18:30', end: '21:00', sessions: [{ type: 'networking', title: 'Leadership Dinner' }]},
]

const DAY2: Slot[] = [
  { start: '8:00',  end: '10:00', sessions: [{ type: 'registration', title: 'Doors Open & Breakfast' }]},
  { start: '10:00', end: '10:15', sessions: [{ type: 'opening', title: 'Welcome & Recap' }]},
  { start: '10:20', end: '10:50', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'Build for Bharat Keynote' },
    { type: 'fireside', venue: 'Toast Hall', title: 'Fireside Chat',
      speakers: [{ name: 'Neha', role: 'HerKey' }] },
  ]},
  { start: '11:00', sessions: [], milestone: 'BUILD STOPS - Submissions frozen. Judging begins.' },
  { start: '11:00', end: '11:30', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'VC Keynote' },
    { type: 'showcase', venue: 'Toast Hall', title: '2 Physical AI Demos' },
    { type: 'workshop', venue: 'Workshop Room', title: 'GTM for Product Teams',
      speakers: [{ name: 'Deeksha', role: 'Product Leader' }] },
  ]},
  { start: '11:35', end: '12:05', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'GCCs as Product Innovation Hubs',
      speakers: [
        { name: 'Sheetal', role: '' }, { name: 'Roopa', role: '' },
        { name: 'Abhishek', role: '' }, { name: 'Supriya', role: '' },
      ]},
    { type: 'keynote', venue: 'Toast Hall', title: 'Speaker Session' },
  ]},
  { start: '12:05', end: '12:20', sessions: [
    { type: 'keynote', venue: 'Toast Hall', title: 'Leadership Session' },
    { type: 'workshop', venue: 'Workshop Room', title: 'Applied AI Product Teardown' },
  ]},
  { start: '12:25', end: '13:00', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'Speaker Session',
      speakers: [{ name: 'Pulkit', role: 'Vedantu' }] },
  ]},
  { start: '13:00', end: '14:00', sessions: [{ type: 'lunch', title: 'Lunch' }]},
  { start: '14:00', end: '15:00', sessions: [
    { type: 'showcase', venue: 'Freshworks Hall', title: 'Hackathon - Main Stage Showcase',
      detail: 'Top 4 finalists present their builds on the main stage' },
    { type: 'showcase', venue: 'Toast Hall', title: '2-3 AI Product Demos' },
    { type: 'workshop', venue: 'Workshop Rooms', title: 'Fundraising + VC Lab / Build Your Brand' },
  ]},
  { start: '15:00', end: '15:30', sessions: [
    { type: 'showcase', venue: 'Freshworks Hall', title: 'Winners Announced & Award Ceremony' },
    { type: 'keynote', venue: 'Toast Hall', title: 'Speaker Session' },
  ]},
  { start: '15:35', end: '16:15', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'VC Panel' },
    { type: 'panel', venue: 'Toast Hall', title: 'Voice AI Panel' },
  ]},
  { start: '16:15', end: '16:50', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'Speaker Session' },
    { type: 'fireside', venue: 'Toast Hall', title: 'In Conversation' },
  ]},
  { start: '17:00', end: '18:00', sessions: [{ type: 'networking', title: 'Festival Day 2 Close' }]},
  { start: '18:00', end: '20:00', sessions: [{ type: 'networking', title: 'Dinner Party - Team Celebration' }]},
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

function fmt(t: string) {
  if (!t || t === 'onwards') return t
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour   = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: SType }) {
  const s = ST[type]
  return (
    <span className="inline-block font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full"
      style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  )
}

function SpeakerList({ speakers }: { speakers: Speaker[] }) {
  if (!speakers.length) return null
  return (
    <div className="mt-4 pt-4 flex flex-col gap-2" style={{ borderTop: '1px solid #1C1A32' }}>
      {speakers.map((s, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
            style={{ background: 'rgba(124,58,237,0.25)', color: '#A78BFA' }}>
            {s.name[0]}
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-tight" style={{ color: '#D4D0ED' }}>{s.name}</p>
            {s.role && <p className="text-[11px]" style={{ color: '#52506A' }}>{s.role}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div className="rounded-xl p-5 h-full flex flex-col"
      style={{ background: '#0A0817', border: '1px solid #1E1B35' }}>
      {session.venue && (
        <p className="font-mono text-[9px] uppercase tracking-widest mb-2.5" style={{ color: '#3A3852' }}>
          {session.venue}
        </p>
      )}
      <TypeBadge type={session.type} />
      <h4 className="font-display font-semibold mt-3 leading-snug flex-1"
        style={{ fontSize: 'clamp(14px,1.5vw,17px)', color: '#ECEAF8', letterSpacing: '-0.02em' }}>
        {session.title}
      </h4>
      {session.detail && (
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#52506A' }}>{session.detail}</p>
      )}
      {session.speakers && session.speakers.length > 0 && (
        <SpeakerList speakers={session.speakers} />
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
      </div>
      <div className="space-y-0">
        {slots.map((slot, i) => {
          const parallel = slot.sessions.length > 1
          const cols = slot.sessions.length === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2'

          return (
            <div key={i} className="flex gap-6 sm:gap-10 py-6"
              style={{ borderBottom: '1px solid #12101E' }}>

              {/* Time column */}
              <div className="w-20 sm:w-28 flex-shrink-0 pt-0.5">
                <p className="font-mono text-sm font-bold leading-none" style={{ color: '#A78BFA' }}>
                  {fmt(slot.start)}
                </p>
                {slot.end && (
                  <>
                    <p className="font-mono text-[10px] mt-1" style={{ color: '#3A3852' }}>to</p>
                    <p className="font-mono text-[11px] mt-0.5" style={{ color: '#52506A' }}>
                      {fmt(slot.end)}
                    </p>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {slot.milestone ? (
                  <div className="rounded-xl px-5 py-3"
                    style={{ background: 'rgba(124,58,237,0.12)', border: '1px dashed rgba(124,58,237,0.4)' }}>
                    <p className="font-semibold text-sm" style={{ color: '#A78BFA' }}>{slot.milestone}</p>
                  </div>
                ) : parallel ? (
                  <div>
                    <div className="mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                        style={{ color: '#38BDF8', background: 'rgba(56,189,248,0.12)' }}>
                        Parallel Sessions
                      </span>
                    </div>
                    <div className={`grid gap-3 ${cols}`}>
                      {slot.sessions.map((s, j) => <SessionCard key={j} session={s} />)}
                    </div>
                  </div>
                ) : (
                  <SessionCard session={slot.sessions[0]} />
                )}
              </div>
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
  const [activeDay, setActiveDay] = useState<1 | 2>(1)

  return (
    <section id="agenda" className="relative py-28 px-6 overflow-hidden">
      <div className="bg-num" style={{ top: '-5%', left: '-2%' }} aria-hidden>04</div>
      <div className="relative z-10 max-w-7xl mx-auto">

        <div ref={headRef} className="sr mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Schedule</p>
          <h2 className="font-display font-extrabold leading-none"
            style={{ fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
            2 Days of Impact
          </h2>
        </div>

        {/* Thematic tracks Day 1 */}
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

        {/* Thematic tracks Day 2 */}
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
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-8" style={{ color: '#7C3AED' }}>
            Full Schedule
          </p>
          {/* Day tabs */}
          <div className="flex gap-2 mb-10">
            {([1, 2] as const).map(d => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className="font-display font-bold px-6 py-2.5 rounded-full text-sm transition-all duration-200"
                style={activeDay === d
                  ? { background: '#7C3AED', color: '#fff', boxShadow: '0 0 24px rgba(124,58,237,.4)' }
                  : { background: 'transparent', color: '#52506A', border: '1px solid #1C1A32' }
                }
              >
                Day {d}
              </button>
            ))}
          </div>
          {activeDay === 1
            ? <ScheduleDay label="Day 1" date="" slots={DAY1} />
            : <ScheduleDay label="Day 2" date="" slots={DAY2} />
          }
        </div>

      </div>
    </section>
  )
}
