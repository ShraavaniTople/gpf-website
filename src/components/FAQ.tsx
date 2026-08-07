import { useState, useEffect, useRef } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'When and where is GPF 2026?',
    a: 'The Great Product Festival is scheduled for 25-26 September 2026 in Bangalore, India. Venue details will be announced to all registered pass holders well in advance.',
  },
  {
    q: 'Is GPF only for women in product?',
    a: "No. While it is a Women in Product India initiative, GPF is India's most inclusive product conference. We welcome professionals of all genders, career levels, and industries.",
  },
  {
    q: 'Do I need a pass to join the Hackathon?',
    a: 'Shortlisted hackathon finalists receive complimentary conference passes. For all other participants, the Hackathon finale and mentorship sessions happen on site, so a valid conference pass is required. Team registration details will be shared via email.',
  },
  {
    q: 'How do WiP India member discounts work?',
    a: 'Active WiP India members get exclusive early access and discounted rates on all pass tiers. Use your registered community email at checkout to apply the discount automatically.',
  },
  {
    q: 'How do I apply to speak?',
    a: 'Submit your proposal through the Apply to Speak section on this page. Share your bio, the topic you want to cover, and your preferred session format.',
  },
  {
    q: 'What is the refund policy?',
    a: 'Passes are non-refundable but transferable up to 14 days before the event. Email hello@womeninproductindia.com to process a name change.',
  },
  {
    q: 'How do I become a sponsor?',
    a: 'Click the Become a Sponsor button to request our partnership deck, or reach out directly at hello@womeninproductindia.com to discuss opportunities.',
  },
]

function useVis() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const headRef = useVis()
  const listRef = useVis()

  return (
    <section id="faq" className="relative py-28 px-6 overflow-hidden">
      <div className="bg-num" style={{ top: '-5%', left: '-2%' }} aria-hidden>08</div>
      <div className="relative z-10 max-w-3xl mx-auto">

        <div ref={headRef} className="sr mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>FAQ</p>
          <h2 className="font-display font-extrabold leading-tight" style={{ fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
            Everything you need to know<br />before you go
          </h2>
        </div>

        <div ref={listRef} className="sr">
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #1C1A32' }}>
              <button
                className="w-full flex items-center justify-between gap-3 sm:gap-6 py-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="font-display font-semibold text-base leading-snug"
                  style={{ color: open === i ? '#F0EEF8' : '#9490AD', transition: 'color .2s', letterSpacing: '-0.015em' }}
                >
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: open === i ? 'rgba(124,58,237,.15)' : 'transparent',
                    border: `1px solid ${open === i ? 'rgba(124,58,237,.35)' : '#1C1A32'}`,
                    transition: 'background .2s, border-color .2s',
                  }}
                >
                  {open === i
                    ? <Minus size={12} style={{ color: '#A78BFA' }} />
                    : <Plus size={12} style={{ color: '#52506A' }} />}
                </span>
              </button>
              <div
                style={{
                  maxHeight: open === i ? 300 : 0,
                  overflow: 'hidden',
                  transition: 'max-height .45s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <p className="pb-6 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
