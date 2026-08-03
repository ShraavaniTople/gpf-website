import { useState } from 'react'
import PageLayout from '../layouts/PageLayout'
import Speakers from '../components/Speakers'
import Modal from '../components/Modal'
import { SpeakerForm, NominateForm } from '../forms'

export default function SpeakersPage() {
  const [speakerModal, setSpeakerModal] = useState(false)
  const [nominateModal, setNominateModal] = useState(false)

  return (
    <PageLayout>
      <Speakers
        onApply={() => setSpeakerModal(true)}
        onNominate={() => setNominateModal(true)}
      />

      <Modal isOpen={speakerModal} onClose={() => setSpeakerModal(false)} title="Apply to Speak">
        <SpeakerForm />
      </Modal>

      <Modal isOpen={nominateModal} onClose={() => setNominateModal(false)} title="Nominate a Speaker">
        <NominateForm />
      </Modal>
    </PageLayout>
  )
}
