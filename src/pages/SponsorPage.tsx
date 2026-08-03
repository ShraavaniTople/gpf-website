import { useState } from 'react'
import PageLayout from '../layouts/PageLayout'
import Sponsor from '../components/Sponsor'
import Modal from '../components/Modal'
import { SponsorForm } from '../forms'

export default function SponsorPage() {
  const [modal, setModal] = useState(false)

  return (
    <PageLayout>
      <Sponsor onRequest={() => setModal(true)} />

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Request Sponsorship Details">
        <SponsorForm />
      </Modal>
    </PageLayout>
  )
}
