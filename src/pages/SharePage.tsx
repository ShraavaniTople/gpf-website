import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SocialCardGenerator from '../components/social-card/SocialCardGenerator'

export default function SharePage() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => { document.head.removeChild(meta) }
  }, [])

  return (
    <>
      <Navbar />
      <main style={{ background: '#05040C', minHeight: '100vh', paddingTop: 148 }}>

        <section style={{ padding: '32px 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <SocialCardGenerator />
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
