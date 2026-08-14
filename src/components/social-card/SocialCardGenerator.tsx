import { useState, useRef, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { ROLES, DESIGNS, type RoleId, type DesignId } from './config'
import { renderCard } from './cardRenderer'

// ── crop helper ────────────────────────────────────────────────────────────────
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = imageSrc
  })
  const canvas = document.createElement('canvas')
  canvas.width  = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, -pixelCrop.x, -pixelCrop.y, img.width, img.height)
  return canvas.toDataURL('image/png')
}

// ── section label ─────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[.22em] mb-2.5" style={{ color: '#7C3AED' }}>
      {children}
    </p>
  )
}

// ── field ─────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(28,26,50,.8)',
  border: '1px solid #2A2748',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#F0EEF8',
  fontSize: 14,
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
}

export default function SocialCardGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ── state ──────────────────────────────────────────────────────────────────
  const [roleId,      setRoleId]      = useState<RoleId>('attendee')
  const [design,      setDesign]      = useState<DesignId>('hero')
  const [name,        setName]        = useState('')
  const [title,       setTitle]       = useState('')
  const [captionIdx,  setCaptionIdx]  = useState(0)
  const [portrait,    setPortrait]    = useState(false)
  const [rendering,   setRendering]   = useState(false)
  const [sharing,     setSharing]     = useState(false)

  // photo / crop
  const [rawPhoto,    setRawPhoto]    = useState<string | null>(null)
  const [croppedPhoto, setCroppedPhoto] = useState<string | null>(null)
  const [cropMode,    setCropMode]    = useState(false)
  const [crop,        setCrop]        = useState({ x: 0, y: 0 })
  const [zoom,        setZoom]        = useState(1)
  const [cropArea,    setCropArea]    = useState<Area | null>(null)

  const role = ROLES.find(r => r.id === roleId)!
  const activeDesign = role.lockedDesign ?? design

  // ── re-render canvas whenever inputs change ────────────────────────────────
  const redraw = useCallback(async () => {
    if (!canvasRef.current) return
    setRendering(true)
    try {
      await renderCard({
        canvas:     canvasRef.current,
        design:     activeDesign,
        role,
        name:       name.trim() || (role.hasPhoto ? 'Your Name' : 'Your Organisation'),
        title:      title.trim(),
        photo:      croppedPhoto,
        captionIdx,
        portrait,
      })
    } finally {
      setRendering(false)
    }
  }, [activeDesign, role, name, title, croppedPhoto, captionIdx, portrait])

  useEffect(() => { redraw() }, [redraw])

  // ── photo file pick ────────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setRawPhoto(ev.target?.result as string)
      setCropMode(true)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function confirmCrop() {
    if (!rawPhoto || !cropArea) return
    const cropped = await getCroppedImg(rawPhoto, cropArea)
    setCroppedPhoto(cropped)
    setCropMode(false)
  }

  function removePhoto() {
    setRawPhoto(null)
    setCroppedPhoto(null)
    setCropMode(false)
  }

  // ── export PNG ────────────────────────────────────────────────────────────
  async function downloadPng() {
    if (!canvasRef.current) return
    await redraw()
    const link = document.createElement('a')
    link.download = `tgpf2026-${roleId}-${activeDesign}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  // ── share ─────────────────────────────────────────────────────────────────
  async function shareCard() {
    if (!canvasRef.current) return
    setSharing(true)
    try {
      await redraw()
      const blob = await new Promise<Blob>(res =>
        canvasRef.current!.toBlob(b => res(b!), 'image/png')
      )
      const file = new File([blob], `tgpf2026-${roleId}.png`, { type: 'image/png' })
      const caption = role.captions[captionIdx]
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: caption })
      } else if (navigator.share) {
        await navigator.share({ text: caption, url: 'https://thegreatproductfestival.com' })
      } else {
        await navigator.clipboard.writeText(caption)
        alert('Caption copied to clipboard! Download the image and share manually.')
      }
    } catch { /* user cancelled or unsupported */ }
    setSharing(false)
  }

  const caption = role.captions[captionIdx]
  const isPersonal = role.hasPhoto

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ── crop overlay ──────────────────────────────────────────────────── */}
      {cropMode && rawPhoto && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,4,12,0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] mb-4" style={{ color: '#A78BFA' }}>
            Crop & Zoom
          </p>
          <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: 400, borderRadius: 16, overflow: 'hidden' }}>
            <Cropper
              image={rawPhoto}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, area) => setCropArea(area)}
            />
          </div>
          <input
            type="range" min={1} max={3} step={0.01}
            value={zoom} onChange={e => setZoom(Number(e.target.value))}
            style={{ width: '100%', maxWidth: 480, margin: '20px 0', accentColor: '#7C3AED' }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={confirmCrop}
              className="btn-purple"
              style={{ padding: '10px 28px', fontSize: 14 }}
            >
              Apply Crop
            </button>
            <button
              onClick={() => setCropMode(false)}
              style={{
                padding: '10px 20px', fontSize: 14, border: '1px solid #2A2748',
                borderRadius: 9999, background: 'transparent', color: '#9490AD', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>

        {/* ── LEFT: controls ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Role */}
          <Field label="I am a…">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setRoleId(r.id); setCaptionIdx(0); removePhoto() }}
                  style={{
                    padding: '6px 14px', borderRadius: 9999, fontSize: 13,
                    fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    border: roleId === r.id ? '1.5px solid #7C3AED' : '1.5px solid #2A2748',
                    background: roleId === r.id ? 'rgba(124,58,237,0.2)' : 'rgba(28,26,50,.6)',
                    color: roleId === r.id ? '#A78BFA' : '#6B7280',
                    transition: 'all .15s',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Card design — hidden when role locks a design */}
          {!role.lockedDesign && (
            <Field label="Card Design">
              <div style={{ display: 'flex', gap: 10 }}>
                {DESIGNS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDesign(d.id)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 12, cursor: 'pointer',
                      border: design === d.id ? '1.5px solid #7C3AED' : '1.5px solid #2A2748',
                      background: design === d.id ? 'rgba(124,58,237,0.15)' : 'rgba(28,26,50,.6)',
                      color: design === d.id ? '#A78BFA' : '#52506A',
                      fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                      transition: 'all .15s', textAlign: 'center',
                    }}
                  >
                    <div>{d.label}</div>
                    <div style={{ fontSize: 10, fontFamily: 'Inter', fontWeight: 400, marginTop: 2, color: design === d.id ? '#7C3AED' : '#3D3B55' }}>
                      {d.desc}
                    </div>
                  </button>
                ))}
              </div>
            </Field>
          )}

          {/* Name */}
          <Field label={isPersonal ? 'Your Name' : 'Organisation Name'}>
            <input
              style={inputStyle}
              placeholder={isPersonal ? 'e.g. Priya Sharma' : 'e.g. Hashfame'}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Field>

          {/* Title */}
          <Field label={isPersonal ? `Job Title / Tagline${role.titleRequired ? ' *' : ' (optional)'}` : 'Tagline (optional)'}>
            <input
              style={{ ...inputStyle, borderColor: role.titleRequired && !title.trim() ? 'rgba(248,113,113,.5)' : undefined }}
              placeholder={isPersonal ? 'e.g. Product Lead at Razorpay' : 'e.g. India\'s fastest growing startup'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required={role.titleRequired}
            />
            {role.titleRequired && !title.trim() && (
              <p style={{ fontSize: 11, color: '#F87171', marginTop: 4, fontFamily: 'Inter' }}>Required for speaker cards</p>
            )}
          </Field>

          {/* Photo / Logo upload */}
          <Field label={isPersonal ? 'Your Photo' : 'Logo'}>
            {croppedPhoto ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={croppedPhoto}
                  alt="preview"
                  style={{ width: 64, height: 64, borderRadius: isPersonal ? '50%' : 10, objectFit: 'cover', border: '2px solid #2A2748' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { setCropMode(true) }}
                    style={{ padding: '6px 14px', fontSize: 12, borderRadius: 9999, border: '1px solid #2A2748', background: 'rgba(28,26,50,.8)', color: '#9490AD', cursor: 'pointer' }}
                  >
                    Re-crop
                  </button>
                  <button
                    onClick={removePhoto}
                    style={{ padding: '6px 14px', fontSize: 12, borderRadius: 9999, border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.08)', color: '#F87171', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '16px', borderRadius: 12, cursor: 'pointer',
                border: '1.5px dashed #2A2748', background: 'rgba(28,26,50,.4)',
                color: '#52506A', fontSize: 13,
              }}>
                <span style={{ fontSize: 20 }}>📁</span>
                <span>Click to upload {isPersonal ? 'photo' : 'logo'}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            )}
            <p style={{ fontSize: 11, color: '#3D3B55', marginTop: 6, fontFamily: 'Inter' }}>
              Your {isPersonal ? 'photo' : 'logo'} stays on your device — never uploaded.
            </p>
          </Field>

          {/* Caption picker */}
          <Field label="Caption">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {role.captions.map((cap, i) => (
                <button
                  key={i}
                  onClick={() => setCaptionIdx(i)}
                  style={{
                    textAlign: 'left', padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                    border: captionIdx === i ? '1.5px solid #7C3AED' : '1.5px solid #2A2748',
                    background: captionIdx === i ? 'rgba(124,58,237,0.12)' : 'rgba(28,26,50,.5)',
                    color: captionIdx === i ? '#C4B5FD' : '#6B7280',
                    fontSize: 12, lineHeight: 1.6, fontFamily: 'Inter',
                  }}
                >
                  {cap}
                </button>
              ))}
            </div>
          </Field>

          {/* Format */}
          <Field label="Format">
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'Square (1:1)', value: false, desc: '1080×1080' },
                { label: 'Portrait (4:5)', value: true,  desc: '1080×1350' },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setPortrait(opt.value)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: 10, cursor: 'pointer',
                    border: portrait === opt.value ? '1.5px solid #7C3AED' : '1.5px solid #2A2748',
                    background: portrait === opt.value ? 'rgba(124,58,237,0.15)' : 'rgba(28,26,50,.6)',
                    color: portrait === opt.value ? '#A78BFA' : '#52506A',
                    fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600,
                  }}
                >
                  <div>{opt.label}</div>
                  <div style={{ fontSize: 10, color: portrait === opt.value ? '#7C3AED' : '#3D3B55', marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* ── RIGHT: preview + actions ───────────────────────────────────── */}
        <div style={{ position: 'sticky', top: 100 }}>
          <Label>Live Preview</Label>

          {/* canvas wrapper — width-driven, canvas sets height via intrinsic ratio */}
          <div style={{
            position: 'relative', borderRadius: 16, overflow: 'hidden',
            border: '1px solid #1C1A32',
            background: '#080618',
            lineHeight: 0,
          }}>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            {rendering && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'rgba(5,4,12,0.5)',
              }}>
                <div style={{ width: 32, height: 32, border: '3px solid #7C3AED', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            )}
          </div>

          <p style={{ fontSize: 11, color: '#3D3B55', textAlign: 'center', marginTop: 6, fontFamily: 'Inter' }}>
            Exports at {portrait ? '1080×1350' : '1080×1080'} · PNG · stays on your device
          </p>

          {/* caption copy */}
          <div style={{
            margin: '16px 0',
            padding: '12px 16px',
            borderRadius: 10,
            background: 'rgba(28,26,50,.6)',
            border: '1px solid #1C1A32',
          }}>
            <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, fontFamily: 'Inter', marginBottom: 8 }}>
              {caption}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(caption)}
              style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 9999,
                border: '1px solid #2A2748', background: 'transparent',
                color: '#52506A', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              Copy caption
            </button>
          </div>

          {/* action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={shareCard}
              disabled={sharing}
              className="btn-purple"
              style={{ width: '100%', padding: '13px 24px', fontSize: 15, opacity: sharing ? 0.6 : 1 }}
            >
              {sharing ? 'Preparing…' : '↑ Share Card'}
            </button>
            <button
              onClick={downloadPng}
              style={{
                width: '100%', padding: '13px 24px', fontSize: 15, borderRadius: 9999,
                border: '1.5px solid rgba(124,58,237,.4)', background: 'rgba(124,58,237,.08)',
                color: '#A78BFA', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
              }}
            >
              ↓ Download PNG
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        input[type=range] { cursor: pointer; }
        input[type=text]:focus, input[type=text]:focus-within { border-color: #7C3AED !important; }
      `}</style>
    </div>
  )
}
