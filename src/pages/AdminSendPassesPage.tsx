import { useState } from 'react'

const WEB3FORMS_KEY = '05343d66-4685-49cf-ba57-e57dbf8a2bf1'

const generalMembers = [
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

const premiumMembers = [
  // WiP India community members — Accelerate tier
  { firstName: 'Madhushree',      lastName: '',            company: 'Mastercard',               role: '',                                    email: 'findmadhu.roy@gmail.com',       paymentId: 'XCOMPWIP001', sentOn: '2026-08-12' },
  { firstName: 'Sheethal Ann',    lastName: 'George',      company: 'Adobe',                    role: '',                                    email: 'sheethalg@gmail.com',           paymentId: 'XCOMPWIP002', sentOn: '2026-08-12' },
  { firstName: 'Lavanya',         lastName: 'Karunakaran', company: 'Light And Wonder iGaming', role: 'Deputy Director, Product Management', email: 'lavanya.karunakaran@gmail.com', paymentId: 'XCOMPWIP003', sentOn: '2026-08-12' },
  { firstName: 'Sai Keerthana',   lastName: 'Srinivasan',  company: 'Docusign',                 role: 'Lead Product Designer',               email: 'ssai.keerthana@gmail.com',      paymentId: 'XCOMPWIP004', sentOn: '2026-08-12' },
  // WiP India community members — Advance tier
  { firstName: 'Swati',           lastName: 'Sharma',      company: 'Ellucian India',           role: 'Senior Product Manager',              email: 'swati.sharma8621@gmail.com',    paymentId: 'XCOMPWIP005', sentOn: '2026-08-12' },
]

function genGeneralPassNumber(email: string) {
  const hash = [...email].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xFFFFFF, 0)
  return `GPF26-G-${hash.toString(16).toUpperCase().padStart(6, '0')}`
}

function genPremiumPassNumber(paymentId: string) {
  return `GPF26-P-${paymentId.slice(-6).toUpperCase()}`
}

async function recordInWeb3Forms(m: typeof generalMembers[0], passNumber: string) {
  const name = `${m.firstName} ${m.lastName}`
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key:    WEB3FORMS_KEY,
        subject:       `[GPF Pass Issued] General (Complimentary) — ${name}`,
        from_name:     'GPF 2026 Admin',
        name,
        email:         m.email,
        'Pass Number': passNumber,
        'Pass Type':   'General Pass (Complimentary)',
        'Role':        m.role,
        'Company':     m.company,
        'Event Date':  '25–26 Sept 2026',
        'Venue':       'RMZ Ecoworld, Bangalore',
      }),
    })
  } catch { /* silent */ }
}

async function sendGeneralPass(m: typeof generalMembers[0]): Promise<boolean> {
  const name       = `${m.firstName} ${m.lastName}`
  const passNumber = genGeneralPassNumber(m.email)
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email:    m.email,
        to_name:     name,
        company:     m.company,
        pass_type:   'General Pass',
        amount:      'Complimentary',
        payment_id:  'COMP-CORE-TEAM',
        pass_number: passNumber,
        event_date:  '25–26 Sept 2026',
        event_city:  'RMZ Ecoworld, Bangalore',
      }),
    })
    const data = await res.json()
    if (data.ok) recordInWeb3Forms(m, passNumber)
    return data.ok === true
  } catch {
    return false
  }
}

async function sendPremiumPass(m: typeof premiumMembers[0]): Promise<boolean> {
  const name       = `${m.firstName} ${m.lastName}`.trim()
  const passNumber = genPremiumPassNumber(m.paymentId)
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email:    m.email,
        to_name:     name,
        company:     m.company,
        pass_type:   'Premium Pass',
        amount:      'Complimentary',
        payment_id:  m.paymentId,
        pass_number: passNumber,
        event_date:  '25–26 Sept 2026',
        event_city:  'RMZ Ecoworld, Bangalore',
      }),
    })
    const data = await res.json()
    return data.ok === true
  } catch {
    return false
  }
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

const badge = (s: Status) => {
  if (s === 'sending') return { label: 'Sending…', bg: 'rgba(124,58,237,.15)', color: '#A78BFA' }
  if (s === 'sent')    return { label: '✓ Sent',   bg: 'rgba(16,185,129,.15)', color: '#34D399' }
  if (s === 'error')   return { label: '✗ Failed', bg: 'rgba(239,68,68,.15)',  color: '#F87171' }
  return { label: 'Pending', bg: 'rgba(28,26,50,.9)', color: '#52506A' }
}

function MemberRow({ idx, name, role, company, email, passNumber, status, onSend, running }: {
  idx: number; name: string; role: string; company: string; email: string
  passNumber: string; status: Status; onSend: () => void; running: boolean
}) {
  const b = badge(status)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 20px',
      background: idx % 2 === 0 ? '#080618' : '#05040C',
    }}>
      <span className="font-mono text-xs flex-shrink-0" style={{ color: '#52506A', width: 20 }}>
        {String(idx + 1).padStart(2, '0')}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="font-display font-semibold text-sm" style={{ color: '#F0EEF8' }}>{name}</p>
        {role ? <p className="text-xs" style={{ color: '#52506A' }}>{role} · {company}</p> : <p className="text-xs" style={{ color: '#52506A' }}>{company}</p>}
        <p className="font-mono text-[10px] mt-0.5" style={{ color: '#6B7280' }}>{email}</p>
        <p className="font-mono text-[10px] mt-0.5" style={{ color: '#52506A' }}>{passNumber}</p>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0"
        style={{ background: b.bg, color: b.color }}>
        {b.label}
      </span>
      <button onClick={onSend}
        disabled={running || status === 'sending' || status === 'sent'}
        className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg flex-shrink-0"
        style={{
          border: '1px solid rgba(124,58,237,.3)', color: '#A78BFA', background: 'rgba(124,58,237,.08)',
          opacity: (running || status === 'sending' || status === 'sent') ? 0.4 : 1,
          cursor: (running || status === 'sending' || status === 'sent') ? 'not-allowed' : 'pointer',
        }}>
        Send
      </button>
    </div>
  )
}

export default function AdminSendPassesPage() {
  const [genStatuses,  setGenStatuses]  = useState<Status[]>(generalMembers.map(() => 'idle'))
  const [premStatuses, setPremStatuses] = useState<Status[]>(premiumMembers.map(() => 'sent'))
  const [running, setRunning] = useState(false)

  const genSent  = genStatuses.filter(s => s === 'sent').length
  const premSent = premStatuses.filter(s => s === 'sent').length

  async function handleGenAll() {
    setRunning(true)
    for (let i = 0; i < generalMembers.length; i++) {
      if (genStatuses[i] === 'sent') continue
      setGenStatuses(prev => { const n = [...prev]; n[i] = 'sending'; return n })
      const ok = await sendGeneralPass(generalMembers[i])
      setGenStatuses(prev => { const n = [...prev]; n[i] = ok ? 'sent' : 'error'; return n })
      await new Promise(r => setTimeout(r, 1000))
    }
    setRunning(false)
  }

  async function handleGenOne(i: number) {
    setGenStatuses(prev => { const n = [...prev]; n[i] = 'sending'; return n })
    const ok = await sendGeneralPass(generalMembers[i])
    setGenStatuses(prev => { const n = [...prev]; n[i] = ok ? 'sent' : 'error'; return n })
  }

  async function handlePremOne(i: number) {
    setPremStatuses(prev => { const n = [...prev]; n[i] = 'sending'; return n })
    const ok = await sendPremiumPass(premiumMembers[i])
    setPremStatuses(prev => { const n = [...prev]; n[i] = ok ? 'sent' : 'error'; return n })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05040C', padding: '60px 24px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-3" style={{ color: '#7C3AED' }}>
          Admin · Internal Tool
        </p>
        <h1 className="font-display font-extrabold mb-2" style={{ fontSize: 32, color: '#F0EEF8', letterSpacing: '-0.03em' }}>
          Complimentary Passes
        </h1>
        <p className="text-sm mb-10" style={{ color: '#6B7280' }}>
          Sends the same emails paid attendees receive — confirmation + visual ticket — via Resend.
        </p>

        {/* ── General Passes ── */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg" style={{ color: '#F0EEF8' }}>General Pass (Complimentary)</h2>
            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{genSent}/{generalMembers.length} sent</p>
          </div>
          <button onClick={handleGenAll} disabled={running || genSent === generalMembers.length}
            className="btn-purple"
            style={{ padding: '10px 24px', fontSize: 13, opacity: (running || genSent === generalMembers.length) ? 0.5 : 1 }}>
            {genSent === generalMembers.length ? 'All Sent ✓' : `Send All ${generalMembers.length}`}
          </button>
        </div>
        <div className="mb-10" style={{ border: '1px solid #1C1A32', borderRadius: 16, overflow: 'hidden' }}>
          {generalMembers.map((m, i) => (
            <div key={i} style={{ borderBottom: i < generalMembers.length - 1 ? '1px solid #1C1A32' : 'none' }}>
              <MemberRow
                idx={i}
                name={`${m.firstName} ${m.lastName}`}
                role={m.role} company={m.company} email={m.email}
                passNumber={genGeneralPassNumber(m.email)}
                status={genStatuses[i]}
                onSend={() => handleGenOne(i)}
                running={running}
              />
            </div>
          ))}
        </div>

        {/* ── Premium Passes ── */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg" style={{ color: '#F0EEF8' }}>Premium Pass (Complimentary)</h2>
            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{premSent}/{premiumMembers.length} sent · WiP India community members</p>
          </div>
        </div>
        <div className="mb-10" style={{ border: '1px solid #1C1A32', borderRadius: 16, overflow: 'hidden' }}>
          {premiumMembers.map((m, i) => (
            <div key={i} style={{ borderBottom: i < premiumMembers.length - 1 ? '1px solid #1C1A32' : 'none' }}>
              <MemberRow
                idx={i}
                name={`${m.firstName} ${m.lastName}`.trim()}
                role={m.role} company={m.company} email={m.email}
                passNumber={genPremiumPassNumber(m.paymentId)}
                status={premStatuses[i]}
                onSend={() => handlePremOne(i)}
                running={running}
              />
            </div>
          ))}
        </div>

        <p className="text-xs mt-6 text-center" style={{ color: '#52506A' }}>
          Not linked from the public site · <a href="/" style={{ color: '#7C3AED' }}>← Back to home</a>
        </p>
      </div>
    </div>
  )
}
