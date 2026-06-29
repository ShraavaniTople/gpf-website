import { useState, useEffect } from 'react'
import Modal from './components/Modal'
import CheckoutModal from './components/CheckoutModal'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import WhyAttend from './components/WhyAttend'
import WhoInRoom from './components/WhoInRoom'
import Hackathon from './components/Hackathon'
import Agenda from './components/Agenda'
import Speakers from './components/Speakers'
import Passes from './components/Passes'
import Sponsor from './components/Sponsor'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import ClosingCTA from './components/ClosingCTA'

const WEB3FORMS_KEY = '05343d66-4685-49cf-ba57-e57dbf8a2bf1'

// Google Forms endpoints
const FORMS: Record<string, { action: string; fields: Record<string, string> }> = {
  pass: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSfxOrVEFJx1LRZfl6ZErkPa7ibzUpGvjhaCKCvTNys6XVdiNQ/formResponse',
    fields: {
      'First Name': 'entry.1521050117',
      'Last Name': 'entry.1404844400',
      'Email': 'entry.1747921729',
      'Phone': 'entry.1627017490',
      'Organisation': 'entry.1572704370',
      'Pass Type': 'entry.1827719032',
    },
  },
  hackathon: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLScXpZqorPihAqmgvsRVZuvlYO3UN5unoq_b457WO0Nc8VBqQg/formResponse',
    fields: {
      'First Name': 'entry.720795200',
      'Last Name': 'entry.1640917164',
      'Email': 'entry.140053087',
      'Phone': 'entry.908323434',
      'LinkedIn Profile': 'entry.1096221992',
      'Team Name': 'entry.83618507',
      'Team Size': 'entry.1732739717',
      'Your Role': 'entry.1081008863',
      'Problem Statement Interest': 'entry.20758291',
      'Idea': 'entry.1304277687',
    },
  },
  nominate: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSfrM_bik8JtftHHG20V3y4On_HQiqoBu20VAc5F3OHz8HVWAA/formResponse',
    fields: {
      'Your Name': 'entry.339905340',
      'Your Email': 'entry.1820619215',
      'Speaker Name': 'entry.1282725437',
      'Speaker Email': 'entry.271938526',
      'Speaker LinkedIn': 'entry.201134265',
      'Nomination Reason': 'entry.713528807',
    },
  },
  sponsor: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSegl7N-J3GdAS6FXdKtNFiip1eNuyBHecweNRSl8lzUzv84YA/formResponse',
    fields: {
      'Company Name': 'entry.130803940',
      'Your Name': 'entry.1731737182',
      'Your Email': 'entry.247102259',
      'Your Role': 'entry.1769964588',
      'Interest': 'entry.1110299030',
      'Message': 'entry.1670297234',
    },
  },
  community: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSfvkTuBlrwPX2ZKphmMaA_EpUt-C7F4cJQCTqzEXgbh8gzCRQ/formResponse',
    fields: {
      'Organisation': 'entry.413775976',
      'Your Name': 'entry.2089835798',
      'Your Email': 'entry.1042024691',
      'Community Size': 'entry.2085026524',
      'Website': 'entry.955312793',
      'Partnership Type': 'entry.215416756',
      'Message': 'entry.1387141779',
    },
  },
  speaker: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLScHDE8_WoWC9HoFKLyAfzaayNAfvqQLy5RjBwlPGMS2ay7nBg/formResponse',
    fields: {
      'Full Name': 'entry.722851407',
      'Email': 'entry.961513084',
      'Role and Company': 'entry.1824833147',
      'LinkedIn': 'entry.909122513',
      'Twitter': 'entry.762628107',
      'Session Format': 'entry.1262746475',
      'Bio': 'entry.1899813914',
      'Talk Abstract': 'entry.1073630510',
    },
  },
}

const FORM_TYPE_MAP: Record<string, string> = {
  'Pass Registration: General Pass': 'pass',
  'Pass Registration: Premium Pass': 'pass',
  'Pass Registration: VIP Pass': 'pass',
  'Hackathon Registration': 'hackathon',
  'Speaker Application': 'speaker',
  'Speaker Nomination': 'nominate',
  'Sponsorship Enquiry': 'sponsor',
  'Community Partnership': 'community',
}

async function submitForm(formType: string, fd: FormData) {
  const payload: Record<string, string> = {
    access_key: WEB3FORMS_KEY,
    subject: `GPF 2026 - ${formType}`,
    from_name: 'GPF 2026 Website',
  }
  const sheetData: Record<string, string> = {}
  fd.forEach((val, key) => {
    if (String(val).trim()) {
      payload[key] = String(val)
      sheetData[key] = String(val)
    }
  })

  const web3 = fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json())

  const sheetsUrl = import.meta.env.VITE_SHEETS_WEBHOOK
  const sheets = sheetsUrl
    ? fetch(sheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ sheet: formType, data: sheetData }),
      }).catch(() => {})
    : Promise.resolve()

  const [data] = await Promise.all([web3, sheets])
  if (!data.success) throw new Error(data.message || 'Submission failed')
}

// Reusable form field styles
const labelClass = 'block text-sm font-medium mb-1' + ' ' + 'text-[#9490AD]'
const inputClass =
  'w-full rounded-xl px-4 py-3 text-[#F0EEF8] placeholder-[#52506A] focus:outline-none transition'
  + ' bg-[#05040C] border border-[#1C1A32] focus:border-[#7C3AED]'
const selectClass =
  'w-full rounded-xl px-4 py-3 text-[#F0EEF8] focus:outline-none transition appearance-none bg-[#05040C] border border-[#1C1A32] focus:border-[#7C3AED]'
const textareaClass =
  'w-full rounded-xl px-4 py-3 text-[#F0EEF8] placeholder-[#52506A] focus:outline-none transition resize-none bg-[#05040C] border border-[#1C1A32] focus:border-[#7C3AED]'

function SuccessMessage({ message = "Thank you! We'll be in touch soon." }: { message?: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(124,58,237,.15)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-display font-bold text-xl mb-2" style={{ color: '#F0EEF8' }}>Submitted!</h3>
      <p className="text-sm" style={{ color: '#6B7280' }}>{message}</p>
    </div>
  )
}

// ─── Pass Registration Form ───────────────────────────────────────────────────
function PassForm({ tierName }: { tierName: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const fd = new FormData(e.currentTarget)
      await submitForm(`Pass Registration: ${tierName} Pass`, fd)
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  if (submitted) return <SuccessMessage message={`Your ${tierName} Pass registration has been received. We'll confirm your spot via email.`} />

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono mb-2"
        style={{ background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.25)', color: '#A78BFA' }}>
        {tierName} Pass selected
      </div>
      <input type="hidden" name="Pass Type" value={`${tierName} Pass`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="p-first">First Name</label>
          <input id="p-first" name="First Name" type="text" required placeholder="Priya" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="p-last">Last Name</label>
          <input id="p-last" name="Last Name" type="text" required placeholder="Sharma" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="p-email">Email</label>
          <input id="p-email" name="Email" type="email" required placeholder="priya@example.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="p-phone">Phone</label>
          <input id="p-phone" name="Phone" type="tel" required placeholder="+91 98765 43210" className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="p-org">Organisation</label>
          <input id="p-org" name="Organisation" type="text" required placeholder="Your company or affiliation" className={inputClass} />
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="pt-2 flex flex-col items-start gap-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-purple disabled:opacity-60 w-full md:w-auto"
        >
          {loading ? 'Sending...' : 'Register for Pass'}
        </button>
        <p className="text-xs text-[#6B6880]">Our team will follow up with payment and confirmation details.</p>
      </div>
    </form>
  )
}

// ─── Hackathon Registration Form ────────────────────────────────────────────
function HackathonForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const fd = new FormData(e.currentTarget)
      await submitForm('Hackathon Registration', fd)
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  if (submitted) return <SuccessMessage message="Your hackathon registration has been received. We'll confirm your spot via email." />

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="h-first">First Name</label>
          <input id="h-first" name="First Name" type="text" required placeholder="Priya" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-last">Last Name</label>
          <input id="h-last" name="Last Name" type="text" required placeholder="Sharma" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-email">Email</label>
          <input id="h-email" name="Email" type="email" required placeholder="priya@example.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-phone">Phone</label>
          <input id="h-phone" name="Phone" type="tel" required placeholder="+91 98765 43210" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-linkedin">LinkedIn Profile</label>
          <input id="h-linkedin" name="LinkedIn Profile" type="url" required placeholder="https://linkedin.com/in/..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-github">GitHub Profile</label>
          <input id="h-github" name="GitHub Profile" type="url" required placeholder="https://github.com/..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-team">Team Name</label>
          <input id="h-team" name="Team Name" type="text" required placeholder="Team Velocity" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-size">Team Size</label>
          <select id="h-size" name="Team Size" required className={selectClass}>
            <option value="1">1 member</option>
            <option value="2">2 members</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="h-role">Your Role</label>
          <select id="h-role" name="Your Role" required className={selectClass}>
            <option value="">Select a role</option>
            <option>Product Manager</option>
            <option>Designer</option>
            <option>Engineer</option>
            <option>Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="h-track">Problem Statement Interest</label>
          <select id="h-track" name="Problem Statement Interest" required className={selectClass}>
            <option value="">Select a track</option>
            <option>Tech in Product</option>
            <option>Growth and Monetisation</option>
            <option>Sponsor-driven challenge</option>
            <option>Open Track</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="h-idea">Tell us about your idea</label>
        <textarea id="h-idea" name="Idea" rows={4} required placeholder="Give us a brief overview of what you plan to build..." className={textareaClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="h-prototype">Rough Prototype <span className="text-[#6B6880] font-normal">(link or short description)</span></label>
        <textarea id="h-prototype" name="Rough Prototype" rows={3} required placeholder="Share a Figma file, demo link, or briefly describe the prototype you have in mind..." className={textareaClass} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="pt-2 flex flex-col items-start gap-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-purple disabled:opacity-60 w-full md:w-auto"
        >
          {loading ? 'Sending...' : 'Submit Registration'}
        </button>
        <p className="text-xs text-[#6B6880]">Registration closes 48 hours before Day 1.</p>
      </div>
    </form>
  )
}

// ─── Speaker Application Form ────────────────────────────────────────────────
function SpeakerForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const fd = new FormData(e.currentTarget)
      await submitForm('Speaker Application', fd)
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  if (submitted) return <SuccessMessage message="Your speaker application has been received. Our team will review and get back to you." />

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="sp-name">Full Name</label>
          <input id="sp-name" name="Full Name" type="text" required placeholder="Aarti Mehta" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="sp-email">Email</label>
          <input id="sp-email" name="Email" type="email" required placeholder="aarti@example.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="sp-company">Current Role &amp; Company</label>
          <input id="sp-company" name="Role and Company" type="text" required placeholder="VP Product, Razorpay" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="sp-linkedin">LinkedIn URL</label>
          <input id="sp-linkedin" name="LinkedIn" type="url" required placeholder="https://linkedin.com/in/..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="sp-twitter">Twitter / X URL</label>
          <input id="sp-twitter" name="Twitter" type="url" required placeholder="https://x.com/..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="sp-title">Proposed Session Title</label>
          <input id="sp-title" name="Session Title" type="text" required placeholder="How I shipped features 10x faster" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="sp-format">Session Format</label>
          <select id="sp-format" name="Session Format" required className={selectClass}>
            <option value="">Select a format</option>
            <option>Keynote</option>
            <option>Panel Discussion</option>
            <option>Workshop</option>
            <option>Lightning Talk</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="sp-bio">Brief Bio <span className="text-[#6B6880] font-normal">(max 250 words)</span></label>
        <textarea id="sp-bio" name="Bio" rows={4} required placeholder="Share your background and what makes you the right voice for this topic..." className={textareaClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="sp-abstract">Talk Abstract <span className="text-[#6B6880] font-normal">(max 250 words)</span></label>
        <textarea id="sp-abstract" name="Talk Abstract" rows={4} required placeholder="Describe the core thesis, key takeaways, and audience of your talk..." className={textareaClass} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-purple disabled:opacity-60 w-full md:w-auto"
        >
          {loading ? 'Sending...' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}

// ─── Nominate Speaker Form ────────────────────────────────────────────────────
function NominateForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const fd = new FormData(e.currentTarget)
      await submitForm('Speaker Nomination', fd)
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  if (submitted) return <SuccessMessage message="Thank you for your nomination! We'll review it and reach out to the nominee." />

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="n-name">Your Name</label>
          <input id="n-name" name="Your Name" type="text" required placeholder="Riya Agarwal" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="n-email">Your Email</label>
          <input id="n-email" name="Your Email" type="email" required placeholder="riya@example.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="n-sp-name">Speaker's Full Name</label>
          <input id="n-sp-name" name="Speaker Name" type="text" required placeholder="Anika Verma" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="n-sp-email">Speaker's Email</label>
          <input id="n-sp-email" name="Speaker Email" type="email" required placeholder="anika@example.com" className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="n-sp-linkedin">Speaker's LinkedIn</label>
          <input id="n-sp-linkedin" name="Speaker LinkedIn" type="url" required placeholder="https://linkedin.com/in/..." className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="n-why">Why do you nominate this speaker?</label>
        <textarea
          id="n-why"
          name="Nomination Reason"
          rows={4}
          required
          placeholder="Tell us what makes this person a great voice for the GPF 2026 stage..."
          className={textareaClass}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-purple disabled:opacity-60 w-full md:w-auto"
        >
          {loading ? 'Sending...' : 'Submit Nomination'}
        </button>
      </div>
    </form>
  )
}

// ─── Sponsor Request Form ─────────────────────────────────────────────────────
function SponsorForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const fd = new FormData(e.currentTarget)
      await submitForm('Sponsorship Enquiry', fd)
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const interests = [
    'Title Sponsorship',
    'Track Sponsorship',
    'Hackathon Sponsorship',
    'Community Partnership',
    'Custom',
  ]

  if (submitted)
    return (
      <SuccessMessage message="Thank you for your interest in partnering with GPF 2026. We will get back to you within 2 business days with our full partnership deck." />
    )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="s-company">Company Name</label>
          <input id="s-company" name="Company Name" type="text" required placeholder="Acme Corp" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="s-name">Your Name</label>
          <input id="s-name" name="Your Name" type="text" required placeholder="Kiran Patel" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="s-email">Your Email</label>
          <input id="s-email" name="Your Email" type="email" required placeholder="kiran@acmecorp.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="s-role">Your Role</label>
          <input id="s-role" name="Your Role" type="text" required placeholder="Head of Marketing" className={inputClass} />
        </div>
      </div>

      <div>
        <p className={labelClass}>Areas of Interest</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {interests.map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="Interest"
                value={item}
                className="w-4 h-4 rounded border-brand-border bg-brand-bg accent-brand-purple cursor-pointer"
              />
              <span className="text-sm text-[#B8B4C8] group-hover:text-white transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="s-msg">Message</label>
        <textarea
          id="s-msg"
          name="Message"
          rows={4}
          required
          placeholder="Tell us about your goals for this partnership..."
          className={textareaClass}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="pt-2 flex flex-col items-start gap-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-purple disabled:opacity-60 w-full md:w-auto"
        >
          {loading ? 'Sending...' : 'Request Details'}
        </button>
        <p className="text-xs text-[#6B6880]">We will get back to you within 2 business days.</p>
      </div>
    </form>
  )
}

// ─── Community Partner Form ───────────────────────────────────────────────────
function CommunityForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const fd = new FormData(e.currentTarget)
      await submitForm('Community Partnership', fd)
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const types = [
    'Community / Meetup Group',
    'Media / Newsletter / Podcast',
    'College / University Club',
    'Corporate Employee Resource Group',
    'Other',
  ]

  if (submitted)
    return (
      <SuccessMessage message="Thank you for your interest! We'll review your application and reach out within 3 business days." />
    )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="cp-org">Organisation / Community Name</label>
          <input id="cp-org" name="Organisation" type="text" required placeholder="ProductCraft Bangalore" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="cp-name">Your Name</label>
          <input id="cp-name" name="Your Name" type="text" required placeholder="Neha Joshi" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="cp-email">Your Email</label>
          <input id="cp-email" name="Your Email" type="email" required placeholder="neha@productcraft.in" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="cp-size">Community Size</label>
          <select id="cp-size" name="Community Size" required className={selectClass}>
            <option value="">Select a range</option>
            <option>Under 500</option>
            <option>500 – 2,000</option>
            <option>2,000 – 10,000</option>
            <option>Over 10,000</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="cp-website">Website / Social Link</label>
          <input id="cp-website" name="Website" type="url" required placeholder="https://your-community.com" className={inputClass} />
        </div>
      </div>

      <div>
        <p className={labelClass}>Type of Partnership</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {types.map((t) => (
            <label key={t} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" name="Partnership Type" value={t} className="w-4 h-4 rounded border-[#1C1A32] bg-[#05040C] accent-[#7C3AED] cursor-pointer" />
              <span className="text-sm text-[#B8B4C8] group-hover:text-white transition-colors">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="cp-msg">Tell us about your community and how you'd like to collaborate</label>
        <textarea id="cp-msg" name="Message" rows={4} required placeholder="Share what your community is about, your audience, and what kind of partnership you're looking for..." className={textareaClass} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="pt-2 flex flex-col items-start gap-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-purple disabled:opacity-60 w-full md:w-auto"
        >
          {loading ? 'Sending...' : 'Submit Application'}
        </button>
        <p className="text-xs text-[#6B6880]">We'll get back to you within 3 business days.</p>
      </div>
    </form>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [hackathonModal, setHackathonModal] = useState(false)
  const [speakerModal, setSpeakerModal] = useState(false)
  const [nominateModal, setNominateModal] = useState(false)
  const [sponsorModal, setSponsorModal] = useState(false)
  const [communityModal, setCommunityModal] = useState(false)
  const [passModal, setPassModal] = useState<{ open: boolean; tierName: string }>({ open: false, tierName: '' })

  useEffect(() => {
    const glow = document.getElementById('cg')
    if (!glow) return
    const move = (e: MouseEvent) => {
      glow.style.left = e.clientX + 'px'
      glow.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div id="cg" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero onSponsor={() => setSponsorModal(true)} onCommunity={() => setCommunityModal(true)} />
        <Marquee />
        <WhyAttend />
        <hr className="div-glow" />
        <WhoInRoom />
        <hr className="div-glow" />
        <Agenda />
        <Hackathon onRegister={() => setHackathonModal(true)} />
        <Speakers
          onApply={() => setSpeakerModal(true)}
          onNominate={() => setNominateModal(true)}
        />
        <Passes onGetPass={(tierName) => setPassModal({ open: true, tierName })} />
        <Sponsor onRequest={() => setSponsorModal(true)} />
        <FAQ />
        <ClosingCTA
          onRegister={() => setPassModal({ open: true, tierName: 'General' })}
          onSponsor={() => setSponsorModal(true)}
          onSpeak={() => setSpeakerModal(true)}
        />
      </main>
      <Footer />

      {/* Modals */}
      {passModal.open && (
        <Modal
          isOpen={passModal.open}
          onClose={() => setPassModal({ open: false, tierName: '' })}
          title={`Get Your ${passModal.tierName} Pass`}
        >
          <CheckoutModal
            tierName={passModal.tierName}
            onClose={() => setPassModal({ open: false, tierName: '' })}
          />
        </Modal>
      )}

      <Modal
        isOpen={hackathonModal}
        onClose={() => setHackathonModal(false)}
        title="Register for the Hackathon"
      >
        <HackathonForm />
      </Modal>

      <Modal
        isOpen={speakerModal}
        onClose={() => setSpeakerModal(false)}
        title="Apply to Speak"
      >
        <SpeakerForm />
      </Modal>

      <Modal
        isOpen={nominateModal}
        onClose={() => setNominateModal(false)}
        title="Nominate a Speaker"
      >
        <NominateForm />
      </Modal>

      <Modal
        isOpen={sponsorModal}
        onClose={() => setSponsorModal(false)}
        title="Request Sponsorship Details"
      >
        <SponsorForm />
      </Modal>

      <Modal
        isOpen={communityModal}
        onClose={() => setCommunityModal(false)}
        title="Become a Community Partner"
      >
        <CommunityForm />
      </Modal>
    </>
  )
}
