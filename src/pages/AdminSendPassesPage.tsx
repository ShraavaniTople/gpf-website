import { useState } from 'react'

const WEB3FORMS_KEY = '05343d66-4685-49cf-ba57-e57dbf8a2bf1'

const generalMembers: { firstName: string; lastName: string; company: string; role: string; email: string; sentOn?: string; passType?: string }[] = [
  // Batch 1 - sent 2026-09-08
  { firstName: 'Swathi',        lastName: 'Chirravuri',   company: 'Stealth Startup', role: 'AI Product Manager',               email: 'swathi.chirravuri@gmail.com',          sentOn: '2026-09-08' },
  { firstName: 'Aditi',         lastName: 'Rajesh',       company: 'Hashfame',        role: 'Product Manager',                  email: 'Aditirajesh1234@gmail.com',            sentOn: '2026-09-08' },
  { firstName: 'Priyadarshini', lastName: 'M',            company: 'SES Satellite',   role: 'Product Manager',                  email: 'priya1687@gmail.com',                  sentOn: '2026-09-08' },
  { firstName: 'Sonika',        lastName: 'Panghal',      company: 'Godrej Capital',  role: 'Product Manager MarTech',          email: 'Sonikap70@gmail.com',                  sentOn: '2026-09-08' },
  { firstName: 'Khyaati',       lastName: 'Jindal',       company: 'Apple',           role: 'AI Engineer',                      email: 'khyaatijindal@gmail.com',              sentOn: '2026-09-08' },
  { firstName: 'Sangeetha',     lastName: 'Balakrishnan', company: 'Workday',         role: 'Product Manager',                  email: 'Sangeetha.balakrishnan.k@gmail.com',   sentOn: '2026-09-08' },
  { firstName: 'Shubhodaye',    lastName: 'Hiremath',     company: 'Freelancer',      role: 'Software Tester',                  email: 'Shubhodaye@gmail.com',                 sentOn: '2026-09-08' },
  { firstName: 'Nidhi',         lastName: 'Bartakke',     company: 'Target',          role: 'Sr Data Analyst',                  email: 'nidhbartakke@gmail.com',               sentOn: '2026-09-08' },
  { firstName: 'Vishwajeet',    lastName: 'Jonnada',      company: 'CGI',             role: 'Technical Product Owner',          email: 'jonnada.vishwajeet@gmail.com',         sentOn: '2026-09-08' },
  { firstName: 'Deeksha',       lastName: 'Anand',        company: 'Google',          role: 'Senior Product Marketing Manager', email: 'deeksha.anand29@gmail.com',            sentOn: '2026-09-08' },
  { firstName: 'Mahi',          lastName: 'Monga',        company: 'Sprinklr',        role: 'AI Product Manager',               email: 'mahimonga04@gmail.com',                sentOn: '2026-09-08' },
  { firstName: 'Anchal',        lastName: 'Garg',         company: 'Arintra',         role: 'Senior AI Product Manager',        email: 'anchalgarg1995@gmail.com',             sentOn: '2026-09-08' },
  { firstName: 'Shrinivas',     lastName: 'Chouraddi',    company: 'Valuecart',       role: 'VP',                               email: 'shrinivas@valuecart.in',               sentOn: '2026-09-08' },
  // Batch 2 - sent 2026-09-13
  { firstName: 'Chintan',            lastName: 'Shah',         company: 'Future AGI',          role: 'Product Manager',                  email: 'chintshah.91@gmail.com',            sentOn: '2026-09-13' },
  { firstName: 'Saaniya',            lastName: 'Afreen',       company: 'Oneinbox',            role: 'Product Manager',                  email: 'saaniya@vibtree.com',               sentOn: '2026-09-13' },
  { firstName: 'Sheetal',            lastName: 'Kale',         company: 'DataArt India',       role: 'Managing Director',                email: 'sheetal.kale@dataart.com',          sentOn: '2026-09-13' },
  { firstName: 'Manoj',              lastName: 'Ponnusamy',    company: 'DataArt India',       role: 'Director, Account Management',     email: 'Manoj.ponnusamy@dataart.com',       sentOn: '2026-09-13' },
  { firstName: 'Shahid',             lastName: 'Afrid',        company: 'RGMCET',              role: 'Student',                          email: '23091a32d4@rgmcet.edu.in',          sentOn: '2026-09-13' },
  { firstName: 'Veena',              lastName: 'Godugu',       company: 'RGMCET',              role: 'Undergraduate Student',            email: '23091a32h9@rgmcet.edu.in',          sentOn: '2026-09-13' },
  { firstName: 'Shaik',              lastName: 'Rehana',       company: 'RGMCET',              role: 'Student',                          email: '23091a32c1@rgmcet.edu.in',          sentOn: '2026-09-13' },
  { firstName: 'Penchala Prasad',    lastName: 'P',            company: 'RGMCET',              role: 'Associate Professor',              email: 'prasadcseds@rgmcet.edu.in',         sentOn: '2026-09-13' },
  { firstName: 'Vikram Chandra',     lastName: 'Gangavarapu',  company: 'RGMCET',              role: 'Assistant Professor',              email: 'vikramcseds@rgmcet.edu.in',         sentOn: '2026-09-13' },
  { firstName: 'Anshuman',           lastName: 'Awasthi',      company: 'MBRDI',               role: 'Senior VP',                        email: 'anshuman.awasthi@mercedes-benz.com', sentOn: '2026-09-13' },
  { firstName: 'Nikhil',             lastName: 'Mankar',       company: 'BD',                  role: 'Lead Engineer, Medical Devices',   email: 'nikhilpmankar@gmail.com',           sentOn: '2026-09-13' },
  { firstName: 'Priya',              lastName: 'Ahuja',        company: 'Independent',         role: 'Investor / VC',                    email: 'hi@priyaahuja.in',                  sentOn: '2026-09-13' },
  { firstName: 'Bhavik',             lastName: 'Kaul',         company: 'Ex-SuperMoney',       role: 'ex-CPO',                           email: 'kaulbhavik@gmail.com',              sentOn: '2026-09-13' },
  { firstName: 'Sobhitha',           lastName: 'Neelanath',    company: 'Salesforce',          role: 'Senior Manager, Software Eng',     email: 'sneelanath@salesforce.com',         sentOn: '2026-09-13' },
  { firstName: 'Nency',              lastName: 'Shah',         company: 'HealthEdge',          role: 'Product Manager',                  email: 'nency.shah@healthedge.com',         sentOn: '2026-09-13' },
  { firstName: 'Ritik',              lastName: 'Gupta',        company: 'POP by Razorpay',     role: 'Design Engineer',                  email: 'gupta.ritik@popclub.co',            sentOn: '2026-09-13' },
  { firstName: 'Rekha',              lastName: 'Poosala',      company: 'Dell',                role: 'Senior Engineering Manager',       email: 'rekha.poosala@gmail.com',           sentOn: '2026-09-13' },
  { firstName: 'Sumit',              lastName: 'Dutta',        company: 'Unwind Ventures',     role: 'Managing Partner',                 email: 'sumit@unwindventures.com',          sentOn: '2026-09-13' },
  { firstName: 'Vivek',              lastName: 'Bharadwaj',    company: 'Grab',                role: 'Group Product Manager',            email: 'vivek.bharadwaj@grabtaxi.com',      sentOn: '2026-09-13' },
  { firstName: 'Subhadeep',          lastName: 'Mondal',       company: 'Kalaari Capital',     role: 'Venture Partner',                  email: 'subhadeep@kalaari.com',             sentOn: '2026-09-13' },
  { firstName: 'Chanakya',           lastName: 'Varma',        company: 'DataArt',             role: 'Director & Growth Partner',        email: 'chanakya.varma@dataart.com',        sentOn: '2026-09-13' },
  { firstName: 'Glory',              lastName: 'Michael',      company: 'DataArt',             role: 'Client Solutions Partner',         email: 'Glory.Michael@dataart.com',         sentOn: '2026-09-13' },
  { firstName: 'Manish S',           lastName: 'Sugandhi',     company: 'Noon',                role: 'Product',                          email: 'manish@noon.design',                sentOn: '2026-09-13' },
  { firstName: 'Neha',               lastName: 'Nadiger',       company: 'Unimad',              role: 'Product Manager',                  email: 'nehanadigerwork@gmail.com',         sentOn: '2026-09-13' },
  // Batch 3 - sent 2026-09-13
  { firstName: 'Suganthi',           lastName: 'Arumugam',      company: 'LSEG',                role: 'Product Leader / Product Manager', email: 'suganthi.arumugam@lseg.com',        sentOn: '2026-09-13' },
  { firstName: 'Abhinav',            lastName: 'Gandotra',      company: 'Microsoft',           role: 'Senior AI PM',                     email: 'agandotra@microsoft.com',           sentOn: '2026-09-13' },
  { firstName: 'Sanil',              lastName: 'Bhatte',        company: 'JP Morgan Chase',     role: 'VP Product Design Lead',           email: 'Sanil.bhatte@jpmorgan.com',         sentOn: '2026-09-13' },
  { firstName: 'Swapnil',            lastName: 'Agrawal',       company: 'KPMG',                role: 'Associate Director',               email: 'swapnilagrawal1@kpmg.com',          sentOn: '2026-09-13' },
  { firstName: 'Yuti',               lastName: 'Agrawal',       company: 'CitiusTech',          role: 'Technical Sr. Lead/Specialist',    email: 'Yuti.nangliya@citiustech.com',      sentOn: '2026-09-13' },
  { firstName: 'Neha',               lastName: 'Gupta',         company: 'Microsoft',           role: 'Partner PM',                       email: 'GARGNEHA@microsoft.com',            sentOn: '2026-09-13' },
  { firstName: 'Devanshi',           lastName: 'Choudhary',     company: 'Walmart',             role: 'Director of Engineering',          email: 'devanshi.choudhary@walmart.com',    sentOn: '2026-09-13' },
  { firstName: 'Manju',              lastName: 'Bhagtani',      company: 'Microsoft',           role: 'Software Engineer 2',              email: 'mbhagtani@microsoft.com',           sentOn: '2026-09-13' },
  { firstName: 'Vijeta',             lastName: 'Pai',           company: 'Lumitia',             role: 'Cloud and AI Advisor',             email: 'Vijetapai90@gmail.com',             sentOn: '2026-09-13', passType: 'VIP Pass' },
  { firstName: 'Kavya',              lastName: 'Joseph',        company: 'Microsoft',           role: 'Senior Product Manager Lead',      email: 'kavyajoseph@microsoft.com',         sentOn: '2026-09-13' },
  { firstName: 'Pranay',             lastName: 'Bansal',        company: 'JPMC',                role: 'VP UX',                            email: 'pranay.bansal@jpmorgan.com',        sentOn: '2026-09-13' },
  { firstName: 'Gautam',             lastName: 'Mahesh',        company: 'Paytm',               role: 'AVP of Product',                   email: 'gautam.mahesh@paytm.com',           sentOn: '2026-09-13' },
  { firstName: 'Ankit',              lastName: 'Ambasht',       company: 'TCS',                 role: 'Product Manager',                  email: 'ankit.ambasht@tcs.com',             sentOn: '2026-09-13' },
  { firstName: 'Pallavi',            lastName: 'Ghadyalpatil',  company: 'Nuvika Technologies', role: 'Director Growth and Delivery',     email: 'pallavi@nuvikatech.com',            sentOn: '2026-09-13' },
  { firstName: 'Prasen',             lastName: 'Ghadyalpatil',  company: 'Nuvika Technologies', role: 'Intern',                           email: 'prasen@nuvikatech.com',             sentOn: '2026-09-13' },
  { firstName: 'Ashish',             lastName: 'Goyal',         company: 'ThriveX Studios',     role: 'Co Founder',                       email: 'ashisharsh2022@gmail.com',          sentOn: '2026-09-13' },
  { firstName: 'Viha Shomikha',      lastName: 'A S',           company: 'Autumn Tech Worx',    role: 'Associate Project Manager',        email: 'viha@weareautumn.com',              sentOn: '2026-09-13' },
  { firstName: 'Nikhil',             lastName: 'Sharma',        company: 'Athenahealth',        role: 'Sr Product Manager',               email: 'Snikhil@athenahealth.com',          sentOn: '2026-09-13' },
  { firstName: 'Nisha',              lastName: 'Chandrasekaran',company: 'Previously Intuit',   role: 'Senior Product Designer',          email: 'nishac0506@gmail.com',              sentOn: '2026-09-13' },
  { firstName: 'Smriti',             lastName: 'Chawla',        company: 'PMM Lens',            role: 'Product Marketing Consultant',     email: 'smritic.1607@gmail.com',            sentOn: '2026-09-13' },
  { firstName: 'Darshan',            lastName: 'Krishna N',     company: 'JLL Technologies',    role: 'Data Analyst',                     email: 'darshan.krishna@jll.com',           sentOn: '2026-09-13' },
  { firstName: 'Dipayan',            lastName: 'Ghatak',        company: 'Walmart',             role: 'Senior Manager',                   email: 'dipayan.ghatak@walmart.com',        sentOn: '2026-09-13' },
  { firstName: 'Krishna N',          lastName: 'Mehta',         company: 'Visa Inc',            role: 'Senior Software Engineer',         email: 'krimehta@visa.com',                 sentOn: '2026-09-13' },
  { firstName: 'Mudrika',            lastName: 'C',             company: 'Google',              role: 'Product Manager',                  email: 'mudrika@google.com',                sentOn: '2026-09-13' },
  { firstName: 'Reetika',            lastName: 'Choudhary',     company: 'Walmart Global Tech', role: 'Senior Manager Product Management',email: 'Reetika.Choudhary@walmart.com',     sentOn: '2026-09-13' },
  { firstName: 'Rakhi',              lastName: 'Sharma',        company: 'House of Manthan',    role: 'Creator and Founder',              email: 'rakhi.ptr@gmail.com',               sentOn: '2026-09-13' },
]

const premiumMembers = [
  // WiP India community members - Accelerate tier
  { firstName: 'Madhushree',      lastName: '',            company: 'Mastercard',               role: '',                                    email: 'findmadhu.roy@gmail.com',       paymentId: 'XCOMPWIP001', sentOn: '2026-08-12' },
  { firstName: 'Sheethal Ann',    lastName: 'George',      company: 'Adobe',                    role: '',                                    email: 'sheethalg@gmail.com',           paymentId: 'XCOMPWIP002', sentOn: '2026-08-12' },
  { firstName: 'Lavanya',         lastName: 'Karunakaran', company: 'Light And Wonder iGaming', role: 'Deputy Director, Product Management', email: 'lavanya.karunakaran@gmail.com', paymentId: 'XCOMPWIP003', sentOn: '2026-08-12' },
  { firstName: 'Sai Keerthana',   lastName: 'Srinivasan',  company: 'Docusign',                 role: 'Lead Product Designer',               email: 'ssai.keerthana@gmail.com',      paymentId: 'XCOMPWIP004', sentOn: '2026-08-12' },
  // WiP India community members - Advance tier
  { firstName: 'Swati',           lastName: 'Sharma',      company: 'Ellucian India',           role: 'Senior Product Manager',              email: 'swati.sharma8621@gmail.com',    paymentId: 'XCOMPWIP005', sentOn: '2026-08-12' },
]

function genGeneralPassNumber(email: string) {
  const hash = [...email].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xFFFFFF, 0)
  return `GPF26-G-${hash.toString(16).toUpperCase().padStart(6, '0')}`
}

function genVIPPassNumber(email: string) {
  const hash = [...email].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xFFFFFF, 0)
  return `GPF26-V-${hash.toString(16).toUpperCase().padStart(6, '0')}`
}

function getPassNumber(m: typeof generalMembers[0]) {
  return m.passType === 'VIP Pass' ? genVIPPassNumber(m.email) : genGeneralPassNumber(m.email)
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
  const passType   = m.passType || 'General Pass'
  const passNumber = getPassNumber(m)
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email:    m.email,
        to_name:     name,
        company:     m.company,
        pass_type:   passType,
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
  const [genStatuses,  setGenStatuses]  = useState<Status[]>(generalMembers.map(m => m.sentOn ? 'sent' : 'idle'))
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
                passNumber={getPassNumber(m)}
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
