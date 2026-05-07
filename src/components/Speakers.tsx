import { useEffect, useRef } from 'react'
import swatiPhoto from '../assets/speaker-swati.png'
import amritPhoto from '../assets/speaker-amrit.png'
import supriyaPhoto from '../assets/speaker-supriya.png'

interface Speaker { name: string; title: string; linkedin: string | null; photo: string; objectPos: string }
interface Props { onApply: () => void; onNominate: () => void }

const speakers = [
  {
    name: 'Swati Awasthi',
    title: 'Founder, Women in Product India',
    linkedin: 'https://www.linkedin.com/in/swatiawasthi/',
    photo: swatiPhoto,
    objectPos: '50% 20%',
  },
  {
    name: 'Amrit Raj',
    title: 'Co-Founder, Women in Product India',
    linkedin: 'https://www.linkedin.com/in/amritraj/',
    photo: amritPhoto,
    objectPos: '50% 15%',
  },
  {
    name: 'Supriya Rao',
    title: 'Product Leader',
    linkedin: 'https://www.linkedin.com/in/supriya-y-rao/',
    photo: supriyaPhoto,
    objectPos: '50% 10%',
  },
  {
    name: 'More Speakers',
    title: 'Being Announced Soon',
    linkedin: null,
    photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80',
    objectPos: '50% 50%',
  },
]

function useVis(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('vis'), delay); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return ref
}

export default function Speakers({ onApply, onNominate }: Props) {
  const headRef = useVis()
  const gridRef = useVis(100)
  const ctaRef = useVis(200)

  return (
    <section id="speakers" className="relative py-28 px-6 overflow-hidden" style={{ background: '#080618' }}>
      <div className="bg-num" style={{ bottom: '-8%', right: '-2%' }} aria-hidden>05</div>
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headRef} className="sr mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-5" style={{ color: '#7C3AED' }}>Speakers</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-0.04em', color: '#F0EEF8' }}>
              Speakers
            </h2>
            <p className="text-base leading-relaxed lg:text-right" style={{ color: '#6B7280', maxWidth: 380 }}>
              Elevate your voice. Share your expertise<br />with India's top product leaders and practitioners.
            </p>
          </div>
        </div>

        {/* Speaker grid — 4 portrait cards */}
        <div ref={gridRef} className="sg grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {(speakers as Speaker[]).map((s, i) => {
            const isTba = s.name === 'More Speakers'
            const inner = (
              <div className={`spk-card relative overflow-hidden rounded-2xl h-full w-full ${isTba ? 'opacity-50' : 'cursor-pointer'}`} style={{ aspectRatio: '3/4' }}>
                <img src={s.photo} alt={s.name} className="w-full h-full object-cover transition-transform duration-[900ms]"
                  style={{ objectPosition: s.objectPos }}
                  onMouseEnter={e => { if (!isTba) e.currentTarget.style.transform = 'scale(1.06)' }}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,4,12,.95) 0%, rgba(5,4,12,.1) 50%, transparent 100%)' }} />
                <div className="ov absolute bottom-0 left-0 right-0 p-5 z-10">
                  <p className="font-display font-bold leading-tight text-base" style={{ color: '#F0EEF8' }}>{s.name}</p>
                  <p className="text-xs mt-1.5 font-medium" style={{ color: isTba ? '#52506A' : '#F59E0B' }}>{s.title}</p>
                  {s.linkedin && (
                    <p className="text-[10px] mt-2 font-mono" style={{ color: '#7C3AED' }}>View LinkedIn</p>
                  )}
                </div>
              </div>
            )
            return s.linkedin
              ? <a key={i} href={s.linkedin} target="_blank" rel="noopener noreferrer" style={{ aspectRatio: '3/4', display: 'block' }}>{inner}</a>
              : <div key={i} style={{ aspectRatio: '3/4' }}>{inner}</div>
          })}
        </div>

        <p className="text-center text-sm italic mb-14" style={{ color: '#52506A' }}>
          More speakers to be announced. Lineup is being finalized.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="sr flex flex-wrap gap-4 justify-center">
          <button onClick={onApply} className="btn-purple text-sm">Apply to Speak</button>
          <button onClick={onNominate} className="btn-ghost text-sm">Nominate to Speak</button>
        </div>
      </div>
    </section>
  )
}
