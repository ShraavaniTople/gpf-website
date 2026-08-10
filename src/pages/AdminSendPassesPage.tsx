import { useState } from 'react'

const WEB3FORMS_KEY = '05343d66-4685-49cf-ba57-e57dbf8a2bf1'

const members = [
  { firstName: 'Swathi',        lastName: 'Chirravuri',   company: 'Stealth Startup', role: 'AI Product Manager',               email: 'swathi.chirravuri@gmail.com' },
  { firstName: 'Aditi',         lastName: 'Rajesh',       company: 'Hashfame',        role: 'Product Manager',                  email: 'Aditirajesh1234@gmail.com' },
  { firstName: 'Priyadarshini', lastName: 'M',            company: 'SES Satellite',   role: 'Product Manager',                  email: 'priya1687@gmail.com' },
  { firstName: 'Sonika',        lastName: 'Panghal',      company: 'Godrej Capital',  role: 'Product Manager MarTech',          email: 'Sonikap70@gmail.com' },
  { firstName: 'Khyaati',       lastName: 'Jindal',       company: 'Apple',           role: 'AI Engineer',                      email: 'khyaatijindal@gmail.com' },
  { firstName: 'Sangeetha',     lastName: 'Balakrishnan', company: 'Workday',         role: 'Product Manager',                  email: 'Sangeetha.balakrishnan.k@gmail.com' },
  { firstName: 'Shubhodaye',    lastName: 'Hiremath',     company: 'Freelancer',      role: 'Software Tester',                  email: 'Shubhodaye@gmail.com' },
  { firstName: 'Nidhi',         lastName: 'Bartakke',     company: 'Target',          role: 'Sr Data Analyst',                  email: 'nidhbartakke@gmail.com' },
  { firstName: 'Vishwajeet',    lastName: 'Jonnada',      company: 'CGI',             role: 'Technical Product Owner',          email: 'jonnada.vishwajeet@gmail.com' },
  { firstName: 'Deeksha',       lastName: 'Anand',        company: 'Google',          role: 'Senior Product Marketing Manager', email: 'deeksha.anand29@gmail.com' },
  { firstName: 'Mahi',          lastName: 'Monga',        company: 'Sprinklr',        role: 'AI Product Manager',               email: 'mahimonga04@gmail.com' },
  { firstName: 'Anchal',        lastName: 'Garg',         company: 'Arintra',         role: 'Senior AI Product Manager',        email: 'anchalgarg1995@gmail.com' },
]

type Status = 'idle' | 'sending' | 'sent' | 'error'

async function sendPass(m: typeof members[0]): Promise<boolean> {
  const name = `${m.firstName} ${m.lastName}`
  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: `GPF 2026 — General Pass Issued: ${name}`,
    from_name: 'The Great Product Festival 2026',
    name,
    email: m.email,
    'Pass Type': 'General Pass',
    Company: m.company,
    Role: m.role,
    Event: 'The Great Product Festival 2026',
    'Event Date': '25–26 September 2026',
    Venue: 'Bangalore, India',
    Message:
      `Hi ${m.firstName},\n\n` +
      `Your complimentary General Pass for The Great Product Festival 2026 has been issued.\n\n` +
      `Event: The Great Product Festival 2026\n` +
      `Date:  25–26 September 2026\n` +
      `City:  Bangalore, India\n\n` +
      `Venue and schedule details will be shared closer to the event.\n\n` +
      `See you there!\n— Team GPF 2026`,
  }
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  return data.success === true
}

const badge = (s: Status) => {
  if (s === 'sending') return { label: 'Sending…', bg: 'rgba(124,58,237,.15)', color: '#A78BFA' }
  if (s === 'sent')    return { label: '✓ Sent',   bg: 'rgba(16,185,129,.15)', color: '#34D399' }
  if (s === 'error')   return { label: '✗ Failed', bg: 'rgba(239,68,68,.15)',  color: '#F87171' }
  return { label: 'Pending', bg: 'rgba(28,26,50,.9)', color: '#52506A' }
}

export default function AdminSendPassesPage() {
  const [statuses, setStatuses] = useState<Status[]>(members.map(() => 'idle'))
  const [running, setRunning] = useState(false)

  function setStatus(i: number, s: Status) {
    setStatuses(prev => { const next = [...prev]; next[i] = s; return next })
  }

  async function sendOne(i: number) {
    setStatus(i, 'sending')
    const ok = await sendPass(members[i]).catch(() => false)
    setStatus(i, ok ? 'sent' : 'error')
  }

  async function sendAll() {
    setRunning(true)
    for (let i = 0; i < members.length; i++) {
      if (statuses[i] === 'sent') continue
      setStatus(i, 'sending')
      const ok = await sendPass(members[i]).catch(() => false)
      setStatus(i, ok ? 'sent' : 'error')
      await new Promise(r => setTimeout(r, 1200))
    }
    setRunning(false)
  }

  const sent  = statuses.filter(s => s === 'sent').length
  const total = members.length

  return (
    <div style={{ minHeight: '100vh', background: '#05040C', padding: '60px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-3" style={{ color: '#7C3AED' }}>
          Admin · Internal Tool
        </p>
        <h1 className="font-display font-extrabold mb-2" style={{ fontSize: 32, color: '#F0EEF8', letterSpacing: '-0.03em' }}>
          Send General Passes
        </h1>
        <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
          Submits each member to Web3Forms — recorded in your dashboard and triggers confirmation emails if enabled.
          &nbsp;<span style={{ color: '#F59E0B' }}>{sent}/{total} sent</span>
        </p>

        {/* Send All button */}
        <button
          onClick={sendAll}
          disabled={running || sent === total}
          className="btn-purple mb-8"
          style={{ padding: '12px 28px', fontSize: 14, opacity: (running || sent === total) ? 0.5 : 1 }}
        >
          {running ? 'Sending…' : sent === total ? 'All Sent ✓' : 'Send All Passes'}
        </button>

        {/* Member list */}
        <div style={{ border: '1px solid #1C1A32', borderRadius: 16, overflow: 'hidden' }}>
          {members.map((m, i) => {
            const b = badge(statuses[i])
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 20px',
                  borderBottom: i < members.length - 1 ? '1px solid #1C1A32' : 'none',
                  background: i % 2 === 0 ? '#080618' : '#05040C',
                }}
              >
                {/* Index */}
                <span className="font-mono text-xs" style={{ color: '#52506A', width: 20, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Name + details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="font-display font-semibold text-sm" style={{ color: '#F0EEF8' }}>
                    {m.firstName} {m.lastName}
                  </p>
                  <p className="text-xs" style={{ color: '#52506A' }}>
                    {m.role} · {m.company}
                  </p>
                  <p className="font-mono text-[10px] mt-0.5" style={{ color: '#6B7280' }}>{m.email}</p>
                </div>

                {/* Status badge */}
                <span
                  className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: b.bg, color: b.color }}
                >
                  {b.label}
                </span>

                {/* Individual send button */}
                <button
                  onClick={() => sendOne(i)}
                  disabled={running || statuses[i] === 'sending' || statuses[i] === 'sent'}
                  className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg flex-shrink-0"
                  style={{
                    border: '1px solid rgba(124,58,237,.3)',
                    color: '#A78BFA',
                    background: 'rgba(124,58,237,.08)',
                    opacity: (running || statuses[i] === 'sending' || statuses[i] === 'sent') ? 0.4 : 1,
                    cursor: (running || statuses[i] === 'sending' || statuses[i] === 'sent') ? 'not-allowed' : 'pointer',
                  }}
                >
                  Send
                </button>
              </div>
            )
          })}
        </div>

        <p className="text-xs mt-6 text-center" style={{ color: '#52506A' }}>
          This page is not linked from the public site. Bookmark it for future use.
        </p>
      </div>
    </div>
  )
}
