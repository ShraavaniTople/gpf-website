import { useState } from 'react'
import PageLayout from '../layouts/PageLayout'
import Passes from '../components/Passes'
import Modal from '../components/Modal'
import CheckoutModal from '../components/CheckoutModal'

export default function PassesPage() {
  const [passModal, setPassModal] = useState<{ open: boolean; tierName: string }>({ open: false, tierName: '' })

  return (
    <PageLayout>
      <Passes onGetPass={(tierName) => setPassModal({ open: true, tierName })} />

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
    </PageLayout>
  )
}
