import { useEffect, useRef } from 'react'

interface Speaker { name: string; title: string; linkedin: string | null; photo: string; objectPos: string }
interface Props { onApply: () => void; onNominate: () => void }

const speakers: Speaker[] = [
  // Row 1
  { name: 'Sangeeta Bavi', title: 'Head of Digital Natives, Startups & Growth, Anthropic India', linkedin: 'https://www.linkedin.com/in/sangeetabavi/', photo: '/speaker-sangeeta.webp', objectPos: '50% 15%' },
  { name: 'Murali Swaminathan', title: 'CTO, Freshworks', linkedin: 'https://www.linkedin.com/in/muraliswaminathan', photo: '/speaker-murali.webp', objectPos: '50% 15%' },
  { name: 'Manikantha', title: 'Head of Product, Sarvam', linkedin: 'https://www.linkedin.com/in/manikantha/', photo: '/speaker-manikantha.webp', objectPos: '50% 15%' },
  { name: 'Swati Awasthi', title: 'Founder, Women in Product India', linkedin: 'https://www.linkedin.com/in/swati-awasthi/', photo: '/speaker-swati.webp', objectPos: '50% 20%' },
  // Row 2
  { name: 'Lalitha Ramani K', title: 'GM, Google Maps', linkedin: 'https://www.linkedin.com/in/lalitha-ramani-k-b863462/', photo: '/speaker-lalitha2.webp', objectPos: '50% 10%' },
  { name: 'Vikas Bansal', title: 'CPO, Groww', linkedin: 'https://www.linkedin.com/in/vikasbansal/', photo: '/speaker-vikas.webp', objectPos: '50% 15%' },
  { name: 'Mansi Jain', title: 'COO, Glance', linkedin: 'https://www.linkedin.com/in/mansi-jain-39b51728/', photo: '/speaker-mansi3.webp', objectPos: '50% 15%' },
  { name: 'Pulkit Jain', title: 'Co-Founder & CPO, Vedantu', linkedin: 'https://www.linkedin.com/in/jainpulkit/', photo: '/speaker-pulkit.webp', objectPos: '50% 20%' },
  // Row 3
  { name: 'Prashant Pandey', title: 'Head of Global, Neysa', linkedin: 'https://www.linkedin.com/in/prashantpandeyofficial/', photo: '/speaker-prashant.webp', objectPos: '50% 15%' },
  { name: 'Usha Rengaraju', title: 'AI Technologist, NVIDIA', linkedin: 'https://www.linkedin.com/in/usha-rengaraju/', photo: '/speaker-usha.webp', objectPos: '50% 15%' },
  { name: 'Aditya Singh', title: 'VP, Product & India Site Head, Salesforce', linkedin: 'https://www.linkedin.com/in/adityas76', photo: '/speaker-aditya.webp', objectPos: '50% 15%' },
  { name: 'Seema Kumar', title: 'Director, Field Engineering, Databricks', linkedin: 'https://www.linkedin.com/in/seemapkumar/', photo: '/speaker-seema.webp', objectPos: '50% 15%' },
  // Row 4 onwards — rest
  { name: 'Dharma Varahappian', title: 'Product Leader, eBay', linkedin: 'https://www.linkedin.com/in/dharmav/', photo: '/speaker-dharma.webp', objectPos: '50% 15%' },
  { name: 'Minakshi Khuntia', title: 'Senior Director, Product Management, Freshworks', linkedin: 'https://www.linkedin.com/in/khuntiaminakshi/', photo: '/speaker-minakshi.webp', objectPos: '50% 15%' },
  { name: 'Anuj Rathi', title: 'Founder, Profound.me', linkedin: 'https://www.linkedin.com/in/anujrathi1', photo: '/speaker-anuj.webp', objectPos: '50% 15%' },
  { name: 'Neha Bagaria', title: 'Founder & CEO, HerKey', linkedin: 'https://www.linkedin.com/in/nehabagariaherkey', photo: '/speaker-neha.webp', objectPos: '50% 15%' },
  { name: 'Roopa Jayaraman', title: 'Chief Product & Technology Officer, Odessa', linkedin: 'https://www.linkedin.com/in/roopajayaraman/', photo: '/speaker-roopa.webp', objectPos: '50% 15%' },
  { name: 'Abhishek Gupta', title: 'Partner & National Sector Leader, KPMG', linkedin: 'https://www.linkedin.com/in/akgin/', photo: '/speaker-abhishek.webp', objectPos: '50% 15%' },
  { name: 'Supriya Rao', title: 'Managing Director, ClearRoute', linkedin: 'https://www.linkedin.com/in/supriya-y-rao/', photo: '/speaker-supriya-new.webp', objectPos: '50% 20%' },
  { name: 'Amrit Raj', title: 'Co-Founder, Women in Product India', linkedin: 'https://www.linkedin.com/in/amritraj02/', photo: '/speaker-amrit.webp', objectPos: '50% 15%' },
  { name: 'Dipika Jaikishan', title: 'VP Special Projects, Pronto', linkedin: 'https://www.linkedin.com/in/dipika-jaikishan-b16b439/', photo: '/speaker-dipika.webp', objectPos: '50% 15%' },
  { name: 'Shivalik Sen', title: 'Associate Director of Product, Rapido', linkedin: 'https://www.linkedin.com/in/shivaliksen/', photo: '/speaker-shivalik.webp', objectPos: '50% 10%' },
  { name: 'Ritika Chugh', title: 'Head of Product, Milestone', linkedin: 'https://www.linkedin.com/in/ritikachugh/', photo: '/speaker-ritika-new.webp', objectPos: '50% 15%' },
  { name: 'Sreedhar Gade', title: 'Vice President, Engineering, Freshworks', linkedin: 'https://www.linkedin.com/in/sreegade/', photo: '/speaker-sreedhar.webp', objectPos: '50% 15%' },
  { name: 'Sheetal Kale', title: 'Managing Director, Head of DataArt India', linkedin: 'https://www.linkedin.com/in/sheetalskale/', photo: '/speaker-sheetal.webp', objectPos: '50% 15%' },
  { name: 'Rajat Harlalka', title: 'Director of Product, Toast', linkedin: 'https://www.linkedin.com/in/rajatharlalka/', photo: '/speaker-rajat.webp', objectPos: '50% 15%' },
  { name: 'Deeksha Anand', title: 'Senior PMM, Google Play', linkedin: 'https://www.linkedin.com/in/deekshaanand/', photo: '/speaker-deeksha.webp', objectPos: '50% 15%' },
  { name: 'Bhavik Kaul', title: 'CPO, SuperMoney', linkedin: 'https://www.linkedin.com/in/kaulbhavik/', photo: '/speaker-bhavik2.webp', objectPos: '50% 15%' },
  { name: 'Anshuman Awasthi', title: 'SVP, Mercedes-Benz Research & Development India', linkedin: 'https://in.linkedin.com/in/anshumanawasthi', photo: '/speaker-anshuman.webp', objectPos: '50% 15%' },
  { name: 'Mitasha Singh', title: 'Founder, All Things Talent', linkedin: 'https://www.linkedin.com/in/mitashasingh/', photo: '/speaker-mitasha.webp', objectPos: '50% 15%' },
  { name: 'Tanay Agrawal', title: 'Director of AI & Platform, KronosX AI', linkedin: 'https://www.linkedin.com/in/agrawaltanay/', photo: '/speaker-tanay.webp', objectPos: '50% 15%' },
  { name: 'Suman G', title: 'Founder, Vobiz', linkedin: 'https://www.linkedin.com/in/gsuman/', photo: '/speaker-suman2.webp', objectPos: '50% 10%' },
  { name: 'Nikkitha Shanker', title: 'Founder & CEO, SuperBryn', linkedin: 'https://www.linkedin.com/in/nikkitha-shanker/', photo: '/speaker-nikkitha.webp', objectPos: '50% 15%' },
  { name: 'Sreya Sanyal', title: 'Product Lead, Ford', linkedin: 'https://www.linkedin.com/in/sreya-sanyal-138b8144/', photo: '/speaker-sreya.webp', objectPos: '50% 15%' },
  { name: 'Ekta Shah', title: 'Data Scientist, MSCI', linkedin: 'https://www.linkedin.com/in/ekta-shah30/', photo: '/speaker-ekta.webp', objectPos: '50% 8%' },
  { name: 'Subhadeep Mondal', title: 'VC, Kalaari Capital', linkedin: 'https://www.linkedin.com/in/subhadeepmondal/', photo: '/speaker-subhadeep.webp', objectPos: '50% 15%' },
  { name: 'Jagriti Shreya', title: 'COO, OneInbox', linkedin: 'https://www.linkedin.com/in/jagritishreya/', photo: '/speaker-jagriti2.webp', objectPos: '50% 15%' },
  { name: 'Rekha Poosala', title: 'Engineering Leader, Dell', linkedin: null, photo: '/speaker-rekha.webp', objectPos: '50% 15%' },
  { name: 'Vaishnavi Devi', title: 'AVP of Product, Swiggy', linkedin: null, photo: '/speaker-vaishnavi.webp', objectPos: '50% 15%' },
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
        <div ref={gridRef} className="sg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {speakers.map((s, i) => {
            const isTba = false
            const inner = (
              <div className={`spk-card relative overflow-hidden rounded-2xl h-full w-full ${isTba ? 'opacity-50' : 'cursor-pointer'}`} style={{ aspectRatio: '3/4' }}>
                <img src={s.photo} alt={s.name} className="w-full h-full object-cover transition-transform duration-[900ms]"
                  loading="lazy" decoding="async"
                  style={{ objectPosition: s.objectPos }}
                  onMouseEnter={e => { if (!isTba) e.currentTarget.style.transform = 'scale(1.06)' }}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,4,12,1) 0%, rgba(5,4,12,.7) 35%, rgba(5,4,12,.1) 60%, transparent 100%)' }} />
                <div className="ov absolute bottom-0 left-0 right-0 px-4 py-4 z-10">
                  <p className="font-display font-bold leading-tight text-sm" style={{ color: '#F0EEF8' }}>{s.name}</p>
                  <p className="text-[11px] mt-1 font-medium leading-snug" style={{ color: isTba ? '#52506A' : '#F59E0B' }}>{s.title}</p>
                  {s.linkedin && (
                    <p className="text-[10px] mt-1.5 font-mono" style={{ color: '#7C3AED' }}>View LinkedIn</p>
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
          More exciting speakers joining the lineup soon.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="sr flex flex-wrap gap-4 justify-center">
          <button onClick={onApply} className="btn-purple text-sm">Apply to Speak</button>
          <button onClick={onNominate} className="btn-purple text-sm">Nominate to Speak</button>
        </div>
      </div>
    </section>
  )
}
