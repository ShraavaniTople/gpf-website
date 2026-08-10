import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SocialCardGenerator from '../components/social-card/SocialCardGenerator'

export default function SharePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#05040C', minHeight: '100vh', paddingTop: 120 }}>

        {/* ── Header ── */}
        <section style={{ padding: '48px 24px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-3" style={{ color: '#7C3AED' }}>
              Share the Festival
            </p>
            <h1 className="font-display font-extrabold" style={{ fontSize: 'clamp(36px,6vw,72px)', letterSpacing: '-0.04em', color: '#F0EEF8', marginBottom: 16, lineHeight: 1.05 }}>
              Make Your&nbsp;<span className="grad">Social Card</span>
            </h1>
            <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 560, lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
              Tell your network you're part of The Great Product Festival 2026. Pick your role, add your photo or logo, and download a ready-to-post 1080&times;1080 card — all in seconds, all on your device.
            </p>
          </div>
        </section>

        {/* ── Generator ── */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <SocialCardGenerator />
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
