import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
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
import SponsorsShowcase from './components/SponsorsShowcase'
import CommunityPartners from './components/CommunityPartners'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import ClosingCTA from './components/ClosingCTA'
import { SpeakerForm, NominateForm, SponsorForm, CommunityForm } from './forms'

import PassesPage from './pages/PassesPage'
import HackathonPage from './pages/HackathonPage'
import AgendaPage from './pages/AgendaPage'
import SpeakersPage from './pages/SpeakersPage'
import SponsorPage from './pages/SponsorPage'
import FAQPage from './pages/FAQPage'

// ─── Home page ────────────────────────────────────────────────────────────────
function HomePage() {
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
        <Hackathon />
        <Speakers onApply={() => setSpeakerModal(true)} onNominate={() => setNominateModal(true)} />
        <Passes onGetPass={(tierName) => setPassModal({ open: true, tierName })} />
        <Sponsor onRequest={() => setSponsorModal(true)} />
        <SponsorsShowcase />
        <CommunityPartners />
        <FAQ />
        <ClosingCTA
          onRegister={() => setPassModal({ open: true, tierName: 'General' })}
          onSponsor={() => setSponsorModal(true)}
          onSpeak={() => setSpeakerModal(true)}
        />
      </main>
      <Footer />

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

      <Modal isOpen={speakerModal} onClose={() => setSpeakerModal(false)} title="Apply to Speak">
        <SpeakerForm />
      </Modal>

      <Modal isOpen={nominateModal} onClose={() => setNominateModal(false)} title="Nominate a Speaker">
        <NominateForm />
      </Modal>

      <Modal isOpen={sponsorModal} onClose={() => setSponsorModal(false)} title="Request Sponsorship Details">
        <SponsorForm />
      </Modal>

      <Modal isOpen={communityModal} onClose={() => setCommunityModal(false)} title="Become a Community Partner">
        <CommunityForm />
      </Modal>
    </>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/passes" element={<PassesPage />} />
      <Route path="/hackathon" element={<HackathonPage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/speakers" element={<SpeakersPage />} />
      <Route path="/sponsor" element={<SponsorPage />} />
      <Route path="/faq" element={<FAQPage />} />
<Route path="*" element={<HomePage />} />
    </Routes>
  )
}
