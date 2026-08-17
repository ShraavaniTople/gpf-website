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

// ─── Schedule data ────────────────────────────────────────────────────────────
type Track = 'main' | 'hackathon' | 'toast' | 'workshop' | 'roundtable'
type Event = { track: Track; title: string; detail?: string }
type Slot  = { time: string; events: Event[]; milestone?: string }

const TRACK: Record<Track, { label: string; color: string }> = {
  main:       { label: 'Main Stage',  color: '#A78BFA' },
  hackathon:  { label: 'Hackathon',   color: '#38BDF8' },
  toast:      { label: 'Toast Room',  color: '#FCD34D' },
  workshop:   { label: 'Workshop',    color: '#34D399' },
  roundtable: { label: 'Roundtable',  color: '#FB7185' },
}

const DAY1: Slot[] = [
  { time: '9:00 – 10:00', events: [
    { track: 'main',      title: 'Registration & Breakfast' },
    { track: 'hackathon', title: 'Team Check-in & Build-space Allocation' },
  ]},
  { time: '10:00 – 10:25', events: [
    { track: 'main', title: 'Welcome & Opening', detail: 'WIP India — Swati' },
  ]},
  { time: '10:30 – 11:00', events: [
    { track: 'main', title: 'Keynote — Murali, CTO, Freshworks' },
  ]},
  { time: '11:05 – 11:40', events: [
    { track: 'main', title: 'Keynote — Sangeeta, Anthropic' },
  ]},
  { time: '11:45 – 12:30', events: [
    { track: 'main',     title: 'Panel: The Future of Enterprise Agents', detail: 'Moderated by Minakshi · Sree Dhar (Freshworks), Seema (Databricks), Aditya (Salesforce)' },
    { track: 'workshop', title: 'Agentic Product Building', detail: 'Freshworks Room' },
  ]},
  { time: '12:30 – 13:00', events: [
    { track: 'main',      title: 'Platform & Partner Showcase', detail: 'Agent Studio, MCP, partner toolkits' },
    { track: 'hackathon', title: 'Hackathon Briefing', detail: 'Tracks, rubric, logistics' },
  ]},
  { time: '13:00', milestone: 'BUILD BEGINS — 24-hour timer starts · Teams break to build rooms', events: [] },
  { time: '13:00 – 14:00', events: [
    { track: 'main',      title: 'Lunch' },
    { track: 'hackathon', title: 'Lunch' },
  ]},
  { time: '14:00 – 14:35', events: [
    { track: 'toast',      title: 'Welcome + Session — Rajat, Director of Product, Toast' },
    { track: 'workshop',   title: 'GEO Workshop by Milestone', detail: 'Freshworks Room' },
    { track: 'roundtable', title: 'CXO Roundtable' },
  ]},
  { time: '14:40 – 15:25', events: [
    { track: 'main',  title: 'Panel: Consumer Products', detail: 'Anuj (Groww CPO), Rapido, Pronto' },
    { track: 'toast', title: 'Panel' },
  ]},
  { time: '15:30 – 16:15', events: [
    { track: 'main',      title: 'Panel: Growth & Distribution', detail: 'Amrit, Deeksha, Roopa Pious' },
    { track: 'hackathon', title: 'Mentor Hours' },
    { track: 'workshop',  title: 'Evals for PMs — Tanay', detail: 'Toast Room' },
  ]},
  { time: '16:20 – 16:50', events: [
    { track: 'main',  title: 'Fireside: Influential Leader / Founder' },
    { track: 'toast', title: 'Lightning Talks' },
  ]},
  { time: '16:50 – 17:00', events: [
    { track: 'main',  title: 'Closing Notes' },
    { track: 'toast', title: 'Closing Note + Head to Freshworks Office' },
  ]},
  { time: '17:00 – 18:00', events: [
    { track: 'main',      title: 'Festival Day 1 Close — Games & Engagement' },
    { track: 'hackathon', title: 'Teams Attend' },
  ]},
  { time: '18:30 – 21:00', events: [
    { track: 'hackathon', title: 'Teams Have Dinner + Build' },
    { track: 'workshop',  title: 'Leadership Dinner' },
  ]},
  { time: '21:00 onwards', events: [
    { track: 'hackathon', title: 'Overnight Build' },
  ]},
]

const DAY2: Slot[] = [
  { time: '8:00 – 10:00', events: [
    { track: 'main',      title: 'Doors Open & Breakfast' },
    { track: 'hackathon', title: 'Breakfast + Quick Mentor Check-in' },
    { track: 'toast',     title: 'Breakfast (light)' },
  ]},
  { time: '10:00 – 10:15', events: [
    { track: 'main',      title: 'Welcome & Recap' },
    { track: 'hackathon', title: 'Final Build Sprint' },
    { track: 'toast',     title: 'Welcome & Recap' },
  ]},
  { time: '10:20 – 10:50', events: [
    { track: 'main',  title: 'Build for Bharat — Sarvam Keynote', detail: 'Tentative' },
    { track: 'toast', title: 'Fireside — Neha, HerKey' },
  ]},
  { time: '11:00', milestone: 'BUILD STOPS — Submissions frozen · Judging begins', events: [] },
  { time: '11:00 – 11:30', events: [
    { track: 'main',      title: 'VC Keynote' },
    { track: 'hackathon', title: 'Judges Evaluate Teams · Teams Demo at Stations' },
    { track: 'toast',     title: '2 Physical AI Demos' },
    { track: 'workshop',  title: 'GTM for Product Teams — Deeksha', detail: 'Freshworks Room' },
  ]},
  { time: '11:35 – 12:05', events: [
    { track: 'main',  title: 'Panel: GCCs as Product Innovation Hubs', detail: 'Sheetal, Roopa, Abhishek, Supriya' },
    { track: 'toast', title: 'Speaker Session — Anshuman, Mercedes-Benz' },
  ]},
  { time: '12:05 – 12:20', events: [
    { track: 'hackathon', title: 'Judges Huddle & Decide Results' },
    { track: 'toast',     title: 'Leadership Session — Bhavna, Shenomics' },
    { track: 'workshop',  title: 'Applied AI Product Teardown — Adithi Sampath', detail: 'Toast Room' },
  ]},
  { time: '12:25 – 13:00', events: [
    { track: 'main',      title: 'Speaker Session — Pulkit, Vedantu' },
    { track: 'hackathon', title: 'Announce Teams Demoing on Stage' },
  ]},
  { time: '13:00 – 14:00', events: [
    { track: 'main',  title: 'Lunch' },
    { track: 'toast', title: 'Lunch' },
  ]},
  { time: '14:00 – 15:00', events: [
    { track: 'workshop',   title: 'Fundraising + VC Lab — Subhadeep (Toast) · Build Your Brand (Freshworks)' },
    { track: 'roundtable', title: 'CXO Roundtable' },
  ]},
  { time: '14:15 – 15:00', events: [
    { track: 'main',      title: 'Hackathon Finalists (Top 4) Present on Stage' },
    { track: 'hackathon', title: 'Finalists on Main Stage' },
    { track: 'toast',     title: '2–3 AI Product Demos' },
  ]},
  { time: '15:00 – 15:30', events: [
    { track: 'main',  title: 'Winners Announced & Award Ceremony' },
    { track: 'toast', title: 'Speaker Session — KDEM' },
  ]},
  { time: '15:35 – 16:15', events: [
    { track: 'main',  title: 'VC Panel', detail: 'Shalini, Shveta, Subhadeep · PeakXV / Accel / Nexus' },
    { track: 'toast', title: 'Voice AI Panel' },
  ]},
  { time: '16:15 – 16:50', events: [
    { track: 'main',  title: 'Speaker Session — Bhavik' },
    { track: 'toast', title: 'In Conversation — Ritika, Swati Dogra' },
  ]},
  { time: '16:50 – 17:00', events: [
    { track: 'toast', title: 'Head to Freshworks Office' },
  ]},
  { time: '17:00 – 18:00', events: [
    { track: 'main',  title: 'Festival Day 2 Close — Band or Comedian' },
    { track: 'toast', title: 'Setup for Dinner' },
  ]},
  { time: '18:00 – 20:00', events: [
    { track: 'toast', title: 'Dinner Party — Team Celebration' },
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

function ScheduleDay({ label, date, slots }: { label: string; date: string; slots: Slot[] }) {
  return (
    <div>
      {/* Day header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-display font-bold text-lg px-4 py-1.5 rounded-full"
          style={{ background: '#7C3AED', color: '#fff' }}>
          {label}
        </span>
        <span className="font-mono text-xs" style={{ color: '#52506A' }}>{date}</span>
      </div>

      {/* Slots */}
      <div style={{ borderTop: '1px solid #1C1A32' }}>
        {slots.map((slot, i) => (
          slot.milestone ? (
            <div key={i} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid #1C1A32' }}>
              <span className="w-36 flex-shrink-0 font-mono text-[11px] text-right" style={{ color: '#7C3AED' }}>
                {slot.time}
              </span>
              <div className="flex-1 rounded-lg px-4 py-2"
                style={{ background: 'rgba(124,58,237,0.10)', border: '1px dashed rgba(124,58,237,0.4)' }}>
                <span className="font-mono text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#A78BFA' }}>
                  {slot.milestone}
                </span>
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-4 py-4" style={{ borderBottom: '1px solid #1C1A32' }}>
              <span className="w-36 flex-shrink-0 font-mono text-[11px] text-right pt-0.5 leading-snug"
                style={{ color: '#3A3852' }}>
                {slot.time}
              </span>
              <div className="flex-1 space-y-2.5">
                {slot.events.map((ev, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0"
                      style={{ background: TRACK[ev.track].color }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold leading-snug"
                        style={{ color: '#E8E6F5', letterSpacing: '-0.01em' }}>
                        {ev.title}
                      </span>
                      {ev.detail && (
                        <span className="text-xs" style={{ color: '#6B7280' }}> · {ev.detail}</span>
                      )}
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider flex-shrink-0 pt-[3px]"
                      style={{ color: '#3A3852' }}>
                      {TRACK[ev.track].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Agenda() {
  const headRef   = useVis()
  const day1Ref   = useVis(80)
  const day2Ref   = useVis(120)
  const schedRef  = useVis(160)

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

        {/* ── Thematic tracks ── */}
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
                    style={{ color: ti === 0 ? '#A78BFA' : '#FCD34D' }}>
                    Track {ti + 1}
                  </p>
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
                    style={{ color: ti === 0 ? '#A78BFA' : '#FCD34D' }}>
                    Track {ti + 3}
                  </p>
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

        {/* ── Full schedule ── */}
        <div ref={schedRef} className="sr">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-10"
            style={{ color: '#7C3AED' }}>
            Full Schedule
          </p>

          {/* Track legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-10">
            {(Object.keys(TRACK) as Track[]).map(k => (
              <span key={k} className="flex items-center gap-1.5 text-xs" style={{ color: '#52506A' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: TRACK[k].color }} />
                {TRACK[k].label}
              </span>
            ))}
          </div>

          <div className="space-y-14">
            <ScheduleDay label="Day 1" date="25 September" slots={DAY1} />
            <ScheduleDay label="Day 2" date="26 September" slots={DAY2} />
          </div>
        </div>

      </div>
    </section>
  )
}
