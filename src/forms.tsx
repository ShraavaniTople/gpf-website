import { useState } from 'react'

// ─── Submission ───────────────────────────────────────────────────────────────
const WEB3FORMS_KEY = '05343d66-4685-49cf-ba57-e57dbf8a2bf1'

export async function submitForm(formType: string, fd: FormData) {
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

// ─── Shared styles ────────────────────────────────────────────────────────────
export const labelClass = 'block text-sm font-medium mb-1 text-[#9490AD]'
export const inputClass =
  'w-full rounded-xl px-4 py-3 text-[#F0EEF8] placeholder-[#52506A] focus:outline-none transition' +
  ' bg-[#05040C] border border-[#1C1A32] focus:border-[#7C3AED]'
export const selectClass =
  'w-full rounded-xl px-4 py-3 text-[#F0EEF8] focus:outline-none transition appearance-none bg-[#05040C] border border-[#1C1A32] focus:border-[#7C3AED]'
export const textareaClass =
  'w-full rounded-xl px-4 py-3 text-[#F0EEF8] placeholder-[#52506A] focus:outline-none transition resize-none bg-[#05040C] border border-[#1C1A32] focus:border-[#7C3AED]'

// ─── Success ──────────────────────────────────────────────────────────────────
export function SuccessMessage({ message = "Thank you! We'll be in touch soon." }: { message?: string }) {
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

// ─── Speaker Application ──────────────────────────────────────────────────────
export function SpeakerForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await submitForm('Speaker Application', new FormData(e.currentTarget))
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
        <button type="submit" disabled={loading} className="btn-purple disabled:opacity-60 w-full md:w-auto">
          {loading ? 'Sending...' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}

// ─── Nominate Speaker ─────────────────────────────────────────────────────────
export function NominateForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await submitForm('Speaker Nomination', new FormData(e.currentTarget))
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
        <textarea id="n-why" name="Nomination Reason" rows={4} required placeholder="Tell us what makes this person a great voice for the GPF 2026 stage..." className={textareaClass} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="pt-2">
        <button type="submit" disabled={loading} className="btn-purple disabled:opacity-60 w-full md:w-auto">
          {loading ? 'Sending...' : 'Submit Nomination'}
        </button>
      </div>
    </form>
  )
}

// ─── Sponsor Request ──────────────────────────────────────────────────────────
export function SponsorForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await submitForm('Sponsorship Enquiry', new FormData(e.currentTarget))
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const interests = ['Title Sponsorship', 'Track Sponsorship', 'Hackathon Sponsorship', 'Community Partnership', 'Custom']

  if (submitted) return <SuccessMessage message="Thank you for your interest in partnering with GPF 2026. We will get back to you within 2 business days with our full partnership deck." />

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
          {interests.map(item => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" name="Interest" value={item} className="w-4 h-4 rounded border-brand-border bg-brand-bg accent-brand-purple cursor-pointer" />
              <span className="text-sm text-[#B8B4C8] group-hover:text-white transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="s-msg">Message</label>
        <textarea id="s-msg" name="Message" rows={4} required placeholder="Tell us about your goals for this partnership..." className={textareaClass} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="pt-2 flex flex-col items-start gap-2">
        <button type="submit" disabled={loading} className="btn-purple disabled:opacity-60 w-full md:w-auto">
          {loading ? 'Sending...' : 'Request Details'}
        </button>
        <p className="text-xs text-[#6B6880]">We will get back to you within 2 business days.</p>
      </div>
    </form>
  )
}

// ─── Community Partner ────────────────────────────────────────────────────────
export function CommunityForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await submitForm('Community Partnership', new FormData(e.currentTarget))
      setSubmitted(true)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const types = ['Community / Meetup Group', 'Media / Newsletter / Podcast', 'College / University Club', 'Corporate Employee Resource Group', 'Other']

  if (submitted) return <SuccessMessage message="Thank you for your interest! We'll review your application and reach out within 3 business days." />

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
          {types.map(t => (
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
        <button type="submit" disabled={loading} className="btn-purple disabled:opacity-60 w-full md:w-auto">
          {loading ? 'Sending...' : 'Submit Application'}
        </button>
        <p className="text-xs text-[#6B6880]">We'll get back to you within 3 business days.</p>
      </div>
    </form>
  )
}
