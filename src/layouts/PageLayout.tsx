import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PageLayout({ children }: { children: React.ReactNode }) {
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
      <main style={{ paddingTop: '108px' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
