import { useState } from 'react'

const WEB3FORMS_KEY = '05343d66-4685-49cf-ba57-e57dbf8a2bf1'

// All confirmed GPFINFINITE registrations (from email records)
// Muskan Gupta duplicate (guptamuskan495) removed
// Jahnvi Bedia (Premium) + Mayanka Sumanth (VIP) converted to General Pass
const GPFINFINITE_MEMBERS = [
  { name: 'Soumya Choubey',      email: 'soumya.c304@gmail.com',           phone: '+919977487263',  linkedin: 'https://www.linkedin.com/soumya-choubey',                          company: 'Flipkart',            role: 'Product Designer',          paymentId: 'FREE-1790092609718' },
  { name: 'Diya Vijay',          email: 'diyavijay2371@gmail.com',          phone: '9414869051',     linkedin: 'https://www.linkedin.com/in/diya-vijay',                            company: 'Finance Buddha',      role: 'SDE 2',                     paymentId: 'FREE-1790091263444' },
  { name: 'Ashutosh Poddar',     email: 'ashpd21@gmail.com',                phone: '7022140505',     linkedin: 'https://www.linkedin.com/in/ashutosh-poddar-947aa1141',            company: 'Jio Platforms',       role: 'Product Manager',           paymentId: 'FREE-1790082675925' },
  { name: 'Muskan Gupta',        email: 'guptamuskan1798@gmail.com',        phone: '8920506150',     linkedin: 'muskan.gupta',                                                      company: 'Dun and Bradstreet',  role: 'Product Manager',           paymentId: 'FREE-1790080062276' },
  { name: 'Vishwas Saini',       email: 'vishwassaini32@gmail.com',         phone: '8920506150',     linkedin: 'vishwas.saini',                                                     company: 'Vegapay',             role: 'Product Manager',           paymentId: 'FREE-1790080062276-2' },
  { name: 'Arpita Behura',       email: 'arpitabehura186@gmail.com',        phone: '7064218118',     linkedin: 'https://www.linkedin.com/in/arpitabehura',                          company: 'Altimetrik',          role: 'Product Owner',             paymentId: 'FREE-1790071322387' },
  { name: 'Palak Jadwani',       email: 'palak.jadwani@flipkart.com',       phone: '+917838643649',  linkedin: 'palak-jadwani',                                                     company: 'Flipkart',            role: 'Senior PM',                 paymentId: 'FREE-1790070465808' },
  { name: 'Sahana Mukherjee',    email: 'sahanamukherjee8@gmail.com',       phone: '+919748444767',  linkedin: 'http://www.linkedin.com/sahana-mukherjee',                          company: 'Micron Technology',   role: 'Product Manager',           paymentId: 'FREE-1790069935299' },
  { name: 'Suyash Ratna',        email: 'su.shrey1167@gmail.com',           phone: '8677094000',     linkedin: 'https://www.linkedin.com/in/suyash-ratna-ba324714a/',              company: 'Flipkart',            role: 'Product Manager',           paymentId: 'FREE-1790069320661' },
  { name: 'Srishti Agrawal',     email: 'aggrawal.srishti@gmail.com',       phone: '9471370082',     linkedin: 'https://www.linkedin.com/in/srishti-agrawal-15211769/',            company: 'Flipkart',            role: 'Product Manager II',        paymentId: 'FREE-1790068017964' },
  { name: 'Madhuparna Dutta',    email: 'md.dutta.10@gmail.com',            phone: '8951719659',     linkedin: 'https://www.linkedin.com/in/madhuparna-dutta-37854256/',           company: 'Employ',              role: 'Product Manager',           paymentId: 'FREE-1790065823359' },
  { name: 'Meghana Swethadri',   email: 'smeghana@lululemon.com',           phone: '+917829427211',  linkedin: 'https://www.linkedin.com/in/meghanas3107/',                         company: 'lululemon',           role: 'Associate Product Manager', paymentId: 'FREE-1790064473129' },
  { name: 'Shraddha Suresh',     email: 'sshraddha@lululemon.com',          phone: '+919739282280',  linkedin: 'https://www.linkedin.com/in/shraddha-suresh-478b85191/',           company: 'lululemon',           role: 'Associate Product Manager', paymentId: 'FREE-1790064473129-2' },
  { name: 'Udit Gattani',        email: 'uditgattani.ism@gmail.com',        phone: '+919741242242',  linkedin: 'https://www.linkedin.com/in/udit-gattani-05900629/',               company: 'Mercari, Inc.',       role: 'Senior Engineering Leader', paymentId: 'FREE-1790056539854' },
  { name: 'Swasthik Prabhu',     email: 'swasthik.prabhu@flipkart.com',    phone: '+918970362441',  linkedin: 'https://www.linkedin.com/swasthikprabhu',                           company: 'Flipkart',            role: 'Product Manager',           paymentId: 'FREE-1790054105459' },
  { name: 'Saranya Prakash',     email: 'saranya.prakash@flipkart.com',     phone: '+919886644124',  linkedin: 'https://www.linkedin.com/in/saranya-prakash-65682392',              company: 'Flipkart Internet',   role: 'Product Manager',           paymentId: 'FREE-1790052727936' },
  { name: 'Snehesh Mitra',       email: 'snehesh@google.com',               phone: '+919818053434',  linkedin: 'https://www.linkedin.com/in/sneheshm/',                             company: 'Google',              role: 'Group Product Manager',     paymentId: 'FREE-1790006410682' },
  { name: 'Appanna Prakash',     email: 'appanna.prakash@ibm.com',          phone: '7899744823',     linkedin: 'https://www.linkedin.com/in/appanna-b-prakash-207285146/',         company: 'IBM',                 role: 'Product Manager',           paymentId: 'FREE-1789994716695' },
  { name: 'Mitali Dubey',        email: 'dubey.mitali90@gmail.com',         phone: '9611600592',     linkedin: 'www.linkedin.com/in/mitali-dubey-a722b710b',                        company: 'Dell',                role: 'Product Owner',             paymentId: 'FREE-1789992604975' },
  { name: 'Jahnvi Bedia',        email: 'jahnvibedia.28@ibm.com',           phone: '+917984688350',  linkedin: 'https://www.linkedin.com/in/jahnvi-bedia/',                         company: 'IBM',                 role: 'Product Manager',           paymentId: 'FREE-1789991775393' },
  { name: 'Monica Singh',        email: 'monica.singh@salesforce.com',      phone: '+918826658886',  linkedin: 'https://www.linkedin.com/in/monicasingh25/',                        company: 'Salesforce',          role: 'PM',                        paymentId: 'FREE-1789991487122' },
  { name: 'Iptisha Gupta',       email: 'iptishagupta@gmail.com',           phone: '8350943626',     linkedin: 'https://in.linkedin.com/in/iptishagupta',                           company: 'ABInBev',             role: 'Product Manager',           paymentId: 'FREE-1789990904931' },
  { name: 'Sakshi Tiwari',       email: 'sakshi.tiwari@servicenow.com',     phone: '09960398834',    linkedin: 'www.linkedin.com/in/sakshi-tiwari3',                                company: 'ServiceNow',          role: 'Inbound Product Manager',   paymentId: 'FREE-1789990375281' },
  { name: 'Pradhyuman Shaktawat',email: 'pradhyumansingh575@gmail.com',     phone: '+918220063335',  linkedin: 'https://www.linkedin.com/in/pradhyumansingh67',                    company: 'IBM India',           role: 'Product Manager',           paymentId: 'FREE-1789989910425' },
  { name: 'Aman Gour',           email: 'amangour88@gmail.com',             phone: '7665238788',     linkedin: 'https://www.linkedin.com/in/amangour98/',                           company: 'IBM',                 role: 'Product Manager',           paymentId: 'FREE-1789989431481' },
  { name: 'Kalpana Kempanna',    email: 'kalpanak.ravikumar@gmail.com',     phone: '+919886523112',  linkedin: 'https://www.linkedin.com/in/kalpana-kempanna/',                    company: 'Dell',                role: 'Senior Manager',            paymentId: 'FREE-1789989042915' },
  { name: 'Ninkesh Neema',       email: 'ninkesh5@gmail.com',               phone: '+919425966444',  linkedin: 'https://www.linkedin.com/in/ninkesh',                               company: 'Glance',              role: 'Product Manager',           paymentId: 'FREE-1789989013607' },
  { name: 'Anushka Seth',        email: 'Anushka.Seth@ibm.com',             phone: '+919407889894',  linkedin: 'https://www.linkedin.com/in/anushka-seth-70a25a146',               company: 'IBM',                 role: 'Product Manager',           paymentId: 'FREE-1789987723829' },
  { name: 'Tushar Anand',        email: 'tusharanandinbox@gmail.com',       phone: '8147472479',     linkedin: 'https://www.linkedin.com/in/anand-tushar/',                         company: 'Expedia',             role: 'Product Manager',           paymentId: 'FREE-1789987123395' },
  { name: 'Kunal Kotak',         email: 'kunalkotak9@gmail.com',            phone: '9824061184',     linkedin: 'https://linkedin.com/in/kunalkotak9',                               company: 'IBM',                 role: 'Senior PM – AI',            paymentId: 'FREE-1789987000710' },
  { name: 'Khushbu Kamal',       email: 'khushbu.kamal@ibm.com',            phone: '+919504613137',  linkedin: 'https://www.linkedin.com/in/khushbu-kamal/',                        company: 'IBM',                 role: 'Product Manager',           paymentId: 'FREE-1789986255778' },
  { name: 'Mayanka Sumanth',     email: 'mayanka148@gmail.com',             phone: '8971084424',     linkedin: 'linkedin.com/in/mayanka-sumanth',                                   company: 'Dell',                role: 'Product Manager',           paymentId: 'FREE-1789985465313' },
]

type W3FSub = {
  _id: string
  created_at: string
  data: Record<string, string>
}

type Row = {
  id: string
  name: string
  passType: string
  email: string
  phone: string
  linkedin: string
  company: string
  role: string
  passNumber: string
  paymentId: string
  createdAt: string
}

type SendStatus = 'idle' | 'sending' | 'sent' | 'error'

function genPassNumber(paymentId: string): string {
  const hash = [...paymentId].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xFFFFFF, 0)
  return `GPF26-G-${hash.toString(16).toUpperCase().padStart(6, '0')}`
}

async function sendPass(row: Row): Promise<boolean> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email:    row.email,
        to_name:     row.name,
        company:     row.company,
        role:        row.role,
        pass_type:   'General Pass',
        amount:      'Complimentary',
        payment_id:  row.paymentId,
        pass_number: row.passNumber,
        event_date:  '25–26 Sept 2026',
        event_city:  'RMZ Ecoworld, Bangalore',
        qty:         1,
      }),
    })
    const data = await res.json()
    return data.ok === true
  } catch {
    return false
  }
}

function StatusBadge({ s }: { s: SendStatus }) {
  const map: Record<SendStatus, { label: string; bg: string; color: string }> = {
    idle:    { label: 'Not Sent',  bg: 'rgba(28,26,50,.9)',     color: '#52506A' },
    sending: { label: 'Sending…', bg: 'rgba(124,58,237,.15)',  color: '#A78BFA' },
    sent:    { label: '✓ Sent',   bg: 'rgba(16,185,129,.15)',  color: '#34D399' },
    error:   { label: '✗ Failed', bg: 'rgba(239,68,68,.15)',   color: '#F87171' },
  }
  const b = map[s]
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: b.bg, color: b.color }}>
      {b.label}
    </span>
  )
}

// Pre-build rows from hardcoded list
function buildRows(): Row[] {
  return GPFINFINITE_MEMBERS.map((m, i) => ({
    id:         String(i),
    name:       m.name,
    passType:   'General Pass',
    email:      m.email,
    phone:      m.phone,
    linkedin:   m.linkedin,
    company:    m.company,
    role:       m.role,
    passNumber: genPassNumber(m.paymentId),
    paymentId:  m.paymentId,
    createdAt:  '',
  }))
}

export default function AdminGPFInfinitePage() {
  const [rows,     setRows]     = useState<Row[]>(buildRows)
  const [statuses, setStatuses] = useState<SendStatus[]>(() => buildRows().map(() => 'idle'))
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [running,  setRunning]  = useState(false)
  const [fetched,  setFetched]  = useState(true)

  async function fetchSubmissions() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://api.web3forms.com/submissions?apikey=${WEB3FORMS_KEY}&limit=500`
      )
      const json = await res.json()

      const allSubs: W3FSub[] = json.submissions ?? json.data ?? []
      const infinite = allSubs.filter(
        s => (s.data['Discount Code'] || '').toUpperCase() === 'GPFINFINITE'
      )

      const parsed: Row[] = infinite.map(s => {
        const d       = s.data
        const name    = d['Full Name'] || d['name'] || ''
        const pid     = d['Payment ID'] || d['payment_id'] || `FREE-${s._id.slice(-8).toUpperCase()}`
        const pn      = d['Pass Number'] || genPassNumber(pid)
        return {
          id:         s._id,
          name,
          passType:   'General Pass',
          email:      d['Email'] || d['email'] || '',
          phone:      d['Phone'] || d['phone'] || '',
          linkedin:   d['LinkedIn'] || d['linkedin'] || '',
          company:    d['Company'] || d['company'] || '',
          role:       d['Role'] || d['role'] || '',
          passNumber: pn,
          paymentId:  pid,
          createdAt:  s.created_at || '',
        }
      })

      setRows(parsed)
      setStatuses(parsed.map(() => 'idle'))
      setFetched(true)
    } catch (e) {
      setError('Failed to fetch from Web3Forms. Check console for details.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendOne(i: number) {
    setStatuses(prev => { const n = [...prev]; n[i] = 'sending'; return n })
    const ok = await sendPass(rows[i])
    setStatuses(prev => { const n = [...prev]; n[i] = ok ? 'sent' : 'error'; return n })
  }

  async function handleSendAllUnsent() {
    setRunning(true)
    for (let i = 0; i < rows.length; i++) {
      if (statuses[i] === 'sent') continue
      setStatuses(prev => { const n = [...prev]; n[i] = 'sending'; return n })
      const ok = await sendPass(rows[i])
      setStatuses(prev => { const n = [...prev]; n[i] = ok ? 'sent' : 'error'; return n })
      await new Promise(r => setTimeout(r, 1200))
    }
    setRunning(false)
  }

  const sentCount   = statuses.filter(s => s === 'sent').length
  const unsentCount = rows.length - sentCount

  // ── Copy table to clipboard ───────────────────────────────────────────────
  function copyTable() {
    const header = ['#', 'Name', 'Type', 'Pass Type', 'Email', 'Phone', 'LinkedIn', 'Company', 'Role', 'Sent'].join('\t')
    const body = rows.map((r, i) =>
      [
        i + 1,
        r.name,
        'GPFINFINITE',
        r.passType,
        r.email,
        r.phone,
        r.linkedin,
        r.company,
        r.role,
        statuses[i] === 'sent' ? 'Yes' : 'No',
      ].join('\t')
    ).join('\n')
    navigator.clipboard.writeText(header + '\n' + body)
      .then(() => alert('Table copied to clipboard!'))
      .catch(() => alert('Copy failed — try selecting manually.'))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05040C', padding: '60px 16px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-3" style={{ color: '#7C3AED' }}>
          Admin · Internal Tool
        </p>
        <h1 className="font-display font-extrabold mb-2" style={{ fontSize: 32, color: '#F0EEF8', letterSpacing: '-0.03em' }}>
          GPFINFINITE — Complimentary Passes
        </h1>
        <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
          Fetches all Web3Forms submissions where Discount Code = GPFINFINITE. Send General passes to anyone who hasn't received one.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={fetchSubmissions} disabled={loading || running}
            className="btn-purple"
            style={{ padding: '10px 24px', fontSize: 13, opacity: (loading || running) ? 0.6 : 1 }}>
            {loading ? 'Fetching…' : fetched ? '↻ Refresh from Web3Forms' : 'Fetch from Web3Forms'}
          </button>

          {fetched && (
            <>
              <button onClick={handleSendAllUnsent}
                disabled={running || unsentCount === 0}
                className="btn-purple"
                style={{ padding: '10px 24px', fontSize: 13, background: 'transparent', border: '1px solid rgba(124,58,237,.4)', color: '#A78BFA', opacity: (running || unsentCount === 0) ? 0.5 : 1 }}>
                {running ? 'Sending…' : `Send All Unsent (${unsentCount})`}
              </button>

              <button onClick={copyTable}
                style={{ padding: '10px 24px', fontSize: 13, background: 'transparent', border: '1px solid #1C1A32', color: '#52506A', borderRadius: 9999, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                Copy Table
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-xl px-5 py-4" style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)' }}>
            <p className="text-sm" style={{ color: '#F87171' }}>{error}</p>
          </div>
        )}

        {/* Stats row */}
        {fetched && (
          <div className="flex gap-4 mb-6">
            {[
              { label: 'Total',   val: rows.length },
              { label: 'Sent',    val: sentCount },
              { label: 'Unsent',  val: unsentCount },
            ].map(({ label, val }) => (
              <div key={label} className="rounded-xl px-5 py-3" style={{ background: '#0A0817', border: '1px solid #1E1B35' }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: '#52506A' }}>{label}</p>
                <p className="font-display font-bold text-2xl" style={{ color: '#F0EEF8' }}>{val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {fetched && rows.length === 0 && (
          <div className="rounded-2xl px-8 py-16 text-center" style={{ border: '1px solid #1C1A32' }}>
            <p style={{ color: '#52506A' }}>No GPFINFINITE submissions found.</p>
          </div>
        )}

        {rows.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#0A0817', borderBottom: '1px solid #1C1A32' }}>
                  {['#', 'Name', 'Type', 'Pass Type', 'Email', 'Phone', 'LinkedIn', 'Company', 'Role', 'Sent', ''].map(h => (
                    <th key={h} className="font-mono text-[10px] uppercase tracking-widest text-left"
                      style={{ padding: '12px 14px', color: '#52506A', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}
                    style={{ background: i % 2 === 0 ? '#080618' : '#05040C', borderBottom: '1px solid #12101E' }}>
                    <td style={{ padding: '12px 14px', color: '#52506A', fontFamily: 'monospace' }}>{i + 1}</td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <p className="font-semibold" style={{ color: '#F0EEF8' }}>{r.name}</p>
                      <p className="font-mono text-[10px] mt-0.5" style={{ color: '#52506A' }}>{r.passNumber}</p>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(52,211,153,.08)', color: '#34D399' }}>
                        GPFINFINITE
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#A78BFA', whiteSpace: 'nowrap' }}>{r.passType}</td>
                    <td style={{ padding: '12px 14px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: 11 }}>{r.email}</td>
                    <td style={{ padding: '12px 14px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: 11, whiteSpace: 'nowrap' }}>{r.phone || '—'}</td>
                    <td style={{ padding: '12px 14px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.linkedin
                        ? <a href={r.linkedin} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#7C3AED', fontSize: 11, fontFamily: 'monospace' }}>
                            {r.linkedin.replace('https://www.linkedin.com/', 'li/').replace('https://linkedin.com/', 'li/')}
                          </a>
                        : <span style={{ color: '#52506A' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{r.company || '—'}</td>
                    <td style={{ padding: '12px 14px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{r.role || '—'}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge s={statuses[i]} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => handleSendOne(i)}
                        disabled={running || statuses[i] === 'sending' || statuses[i] === 'sent'}
                        className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg"
                        style={{
                          border: '1px solid rgba(124,58,237,.3)', color: '#A78BFA', background: 'rgba(124,58,237,.08)',
                          opacity: (running || statuses[i] === 'sending' || statuses[i] === 'sent') ? 0.4 : 1,
                          cursor: (running || statuses[i] === 'sending' || statuses[i] === 'sent') ? 'not-allowed' : 'pointer',
                          whiteSpace: 'nowrap',
                        }}>
                        {statuses[i] === 'sent' ? 'Sent ✓' : 'Send'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs mt-8 text-center" style={{ color: '#52506A' }}>
          Not linked from the public site ·{' '}
          <a href="/admin/send-passes" style={{ color: '#7C3AED' }}>← Complimentary Passes</a>
          {' · '}
          <a href="/" style={{ color: '#7C3AED' }}>← Home</a>
        </p>
      </div>
    </div>
  )
}
