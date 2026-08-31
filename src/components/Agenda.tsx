import { useEffect, useRef, useState } from 'react'

// ─── Schedule types & data ────────────────────────────────────────────────────
type SType = 'registration' | 'opening' | 'keynote' | 'panel' | 'workshop'
           | 'fireside' | 'lightning' | 'expert' | 'lunch' | 'closing' | 'networking'
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
  expert:       { label: 'Expert Session', color: '#2DD4BF', bg: 'rgba(20,184,166,0.13)'  },
  lunch:        { label: 'Lunch',          color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)' },
  closing:      { label: 'Closing',        color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)' },
  networking:   { label: 'Networking',     color: '#FB7185', bg: 'rgba(251,113,133,0.12)' },
  showcase:     { label: 'Showcase',       color: '#38BDF8', bg: 'rgba(56,189,248,0.13)'  },
  roundtable:   { label: 'Roundtable',     color: '#FB7185', bg: 'rgba(251,113,133,0.12)' },
  hackathon:    { label: 'Hackathon',      color: '#38BDF8', bg: 'rgba(56,189,248,0.11)'  },
}

const DAY1: Slot[] = [
  { start: '09:00', end: '10:00', sessions: [{ type: 'registration', title: 'Registration & Breakfast' }]},

  { start: '10:00', end: '10:25', sessions: [{ type: 'opening', title: 'The Great Product Festival: Welcoming Infinite Builders',
      speakers: [{ name: 'Swati Awasthi', role: 'Founder, Women in Product India' }] }]},

  { start: '10:30', end: '11:00', sessions: [{ type: 'keynote', venue: 'Freshworks Hall', title: 'The New Rules of Building Products & Companies',
      speakers: [{ name: 'Murali Swaminathan', role: 'CTO, Freshworks' }] }]},

  { start: '11:05', end: '11:40', sessions: [{ type: 'keynote', venue: 'Freshworks Hall', title: 'Building at the Frontlines of AI by Anthropic',
      speakers: [{ name: 'Sangeeta Bavi', role: 'Head, Anthropic India' }] }]},

  { start: '11:45', end: '12:30', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'The Future of Enterprise Agents',
      speakers: [
        { name: 'Minakshi Khuntia', role: 'Senior Director of Product, Freshworks · Moderator' },
        { name: 'Sreedhar Gade', role: 'Head of AI & Data, Freshworks' },
        { name: 'Seema Kumar', role: 'Director of Engineering, Databricks' },
        { name: 'Aditya Singh', role: 'VP Product & India Site Head, Salesforce' },
      ]},
  ]},

  { start: '12:30', end: '13:00', sessions: [{ type: 'hackathon', title: 'The Great Indian Hackathon Kickoff' }]},

  { start: '13:00', sessions: [], milestone: 'BUILD BEGINS — 24-hour build sprint starts. Teams move to build rooms.' },

  { start: '13:00', end: '14:15', sessions: [{ type: 'lunch', title: 'Lunch' }]},

  { start: '14:15', end: '14:35', sessions: [
    { type: 'keynote', venue: 'Toast Hall', title: 'From SaaS to Super Platforms: The Convergence of Software, Fintech & AI',
      speakers: [{ name: 'Rajat Harlalka', role: 'Director of Product, Toast' }] },
    { type: 'roundtable', venue: 'Boardroom', title: 'CXO Roundtable with Databricks (Invite Only)' },
    { type: 'workshop', venue: 'Workshop Room', title: 'Workshop: Build your first AI employee',
      speakers: [{ name: 'Ekta Shah', role: 'Data Scientist, MSCI' }] },
  ]},

  { start: '14:40', end: '15:25', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'Win Attention, Earn Habit: The Art of Consumer Product',
      speakers: [
        { name: 'Dipika Jaikishan', role: 'VP, Special Projects, Pronto' },
        { name: 'Shivalik Sen', role: 'Head of Product, Rapido' },
        { name: 'Anuj Rathi', role: 'Founder & CEO, Profound.me' },
      ]},
    { type: 'panel', venue: 'Toast Hall', title: 'The New Distribution: Creators, Communities & Growth',
      speakers: [
        { name: 'Amrit Raj', role: 'CMO, WiP India & Founder, FMI' },
        { name: 'Deeksha Anand', role: 'Senior PMM, Google' },
        { name: 'Roopa Pious', role: 'Partnerships Manager, Meta' },
      ]},
  ]},

  { start: '15:30', end: '16:15', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'Beyond E-Commerce: The Rise of Agentic Commerce',
      speakers: [{ name: 'Mansi Jain', role: 'COO, Glance' }] },
    { type: 'showcase', venue: 'Toast Hall', title: 'Physical AI Demo by NVIDIA',
      speakers: [{ name: 'Usha Rengaraju', role: 'AI Technologist, NVIDIA' }] },
    { type: 'workshop', venue: 'Workshop Room', title: 'Workshop: AI Evals for Product Teams',
      speakers: [{ name: 'Tanay Agrawal', role: 'Director of AI & Platform, KronosX AI' }] },
  ]},

  { start: '16:20', end: '16:50', sessions: [
    { type: 'fireside', venue: 'Freshworks Hall', title: 'From Bet to Breakthrough: 20 Years of Product Lessons',
      speakers: [{ name: 'Lalitha Ramani', role: 'GM, Google Maps' }] },
    { type: 'expert', venue: 'Toast Hall', title: 'Generative Engine Optimization (GEO): How to Get Discovered by AI',
      speakers: [{ name: 'Ritika Chugh', role: 'Head of Product, Milestone' }] },
  ]},

  { start: '17:00', end: '18:00', sessions: [{ type: 'networking', title: 'Festival Day 1 Close — Games & Engagement' }]},

  { start: '18:30', end: '21:00', sessions: [{ type: 'networking', title: 'After Hours: Leadership Dinner (Invite Only)' }]},
]

const DAY2: Slot[] = [
  { start: '08:00', end: '10:00', sessions: [{ type: 'registration', title: 'Doors Open & Breakfast' }]},

  { start: '10:00', end: '10:15', sessions: [{ type: 'opening', title: 'Welcome & Day 2 Kickoff' }]},

  { start: '10:15', end: '10:45', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'Build for Bharat: How AI is Being Built for the Next Billion by Sarvam' },
    { type: 'fireside', venue: 'Toast Hall', title: 'Product × Community: Building for Belonging',
      speakers: [{ name: 'Neha Bagaria', role: 'Founder & CEO, HerKey' }] },
  ]},

  { start: '10:45', end: '11:30', sessions: [
    { type: 'keynote', venue: 'Freshworks Hall', title: 'VC Keynote' },
    { type: 'panel', venue: 'Toast Hall', title: 'Global Capability Centres (GCCs) as Product Innovation Hubs',
      speakers: [
        { name: 'Sheetal Kale', role: 'MD, Head of DataArt India' },
        { name: 'Roopa Jayaraman', role: 'Chief Product & Technology Officer, Odessa' },
        { name: 'Abhishek Gupta', role: 'Partner & National Sector Leader, KPMG' },
        { name: 'Supriya Rao', role: 'Managing Director, ClearRoute' },
      ]},
    { type: 'workshop', venue: 'Workshop Room', title: 'Workshop: GTM for Product Teams',
      speakers: [{ name: 'Deeksha Anand', role: 'Senior PMM, Google' }] },
  ]},

  { start: '11:00', sessions: [], milestone: 'BUILD STOPS — Hackathon submissions frozen. Judging begins.' },

  { start: '11:00', end: '11:35', sessions: [{ type: 'workshop', venue: 'Workshop Room', title: 'The Product Automation Lab: Build with n8n' }]},

  { start: '11:35', end: '12:05', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'Voice AI Panel',
      detail: 'Bolna · Deepgram · Superbryn · Vobiz' },
    { type: 'keynote', venue: 'Toast Hall', title: 'Physical AI: From Intelligence to the Real World',
      speakers: [{ name: 'Anshuman Awasthi', role: 'SVP, Mercedes-Benz Research & Development India' }] },
  ]},

  { start: '13:00', end: '14:00', sessions: [{ type: 'lunch', title: 'Lunch' }]},

  { start: '14:35', end: '15:20', sessions: [
    { type: 'panel', venue: 'Freshworks Hall', title: 'VC Panel' },
    { type: 'panel', venue: 'Toast Hall', title: 'PLG Panel: Growth in High-Trust Markets',
      speakers: [
        { name: 'Bhavik Kaul', role: 'CPO, SuperMoney' },
        { name: 'Pulkit Jain', role: 'Co-Founder & CPO, Vedantu' },
      ]},
  ]},

  { start: '15:20', end: '16:20', sessions: [{ type: 'showcase', venue: 'Freshworks Hall', title: 'The Great Agent Showcase',
      detail: 'Hackathon finalists demo live in front of India\'s top product leaders. Winners announced on stage.' }]},

  { start: '17:00', end: '18:00', sessions: [{ type: 'closing', title: 'TGPF Unplugged: Closing Jam Session' }]},
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
        <div key={i}>
          <p className="text-[13px] font-semibold leading-tight" style={{ color: '#D4D0ED' }}>{s.name}</p>
          {s.role && <p className="text-[11px] mt-0.5" style={{ color: '#52506A' }}>{s.role}</p>}
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

function ScheduleDay({ slots }: { slots: Slot[] }) {
  return (
    <div>
      <div className="space-y-0">
        {slots.map((slot, i) => {
          const parallel = slot.sessions.length > 1
          const cols = slot.sessions.length >= 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : slot.sessions.length === 3
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
  const schedRef = useVis(80)
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

        {/* Full schedule */}
        <div ref={schedRef} className="sr">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-8" style={{ color: '#7C3AED' }}>
            Full Schedule <span className="font-extrabold">(Tentative)</span>
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
            ? <ScheduleDay slots={DAY1} />
            : <ScheduleDay slots={DAY2} />
          }
        </div>

      </div>
    </section>
  )
}
