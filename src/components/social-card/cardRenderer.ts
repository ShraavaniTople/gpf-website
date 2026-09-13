/**
 * Social Card Renderer - Canvas-based, all client-side
 * All-white background · logo header · partner footer strip
 * Three designs: Hero, Editorial, Festival
 * Output: 1080×1080 (square) or 1080×1350 (portrait)
 */
import { EVENT, type DesignId, type Role, type RoleId } from './config'

export interface RenderOptions {
  canvas: HTMLCanvasElement
  design: DesignId
  role: Role
  name: string
  title: string
  photo: string | null
  captionIdx: number
  portrait?: boolean
}

const W            = 1080
const PAD          = 64
const TOP_BAR      = 6    // gradient bar at very top
const LOGO_ZONE_H  = 152  // logo header zone height (below top bar)
const BOT_BAR      = 6    // gradient bar at very bottom
// Legacy - kept so TypeScript is happy; unified layout derives its own zones
const HEADER_H = TOP_BAR + LOGO_ZONE_H + 2
const FOOTER_H = 0

function H(portrait?: boolean) { return portrait ? 1350 : 1080 }

// Role theme
interface T {
  r: number; g: number; b: number
  hex: string
  light: string
  bar: [string, string, string]
}

function ac(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`
}

function getTheme(id: RoleId): T {
  const map: Record<RoleId, T> = {
    attendee:            { r: 124, g: 58,  b: 237, hex: '#7C3AED', light: '#A78BFA', bar: ['#7C3AED', '#A78BFA', '#F59E0B'] },
    speaker:             { r: 161, g: 98,  b: 7,   hex: '#A16207', light: '#FCD34D', bar: ['#B45309', '#F59E0B', '#FEF3C7'] },
    mentor:              { r: 20,  g: 184, b: 166, hex: '#0D9488', light: '#5EEAD4', bar: ['#0F766E', '#14B8A6', '#CCFBF1'] },
    judge:               { r: 234, g: 88,  b: 12,  hex: '#EA580C', light: '#FB923C', bar: ['#C2410C', '#EA580C', '#FED7AA'] },
    sponsor:             { r: 29,  g: 78,  b: 216, hex: '#1D4ED8', light: '#93C5FD', bar: ['#1D4ED8', '#60A5FA', '#BFDBFE'] },
    'community-partner': { r: 6,   g: 95,  b: 70,  hex: '#065F46', light: '#6EE7B7', bar: ['#065F46', '#059669', '#D1FAE5'] },
    organizer:           { r: 190, g: 24,  b: 93,  hex: '#BE185D', light: '#F472B6', bar: ['#9D174D', '#EC4899', '#FDF2F8'] },
  }
  return map[id]
}

// Helpers
function font(
  size: number,
  weight: 700 | 600 | 400,
  family: 'Space Grotesk' | 'Inter' | 'JetBrains Mono' = 'Space Grotesk',
) {
  return `${weight} ${size}px "${family}"`
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w }
    else cur = test
  }
  if (cur) lines.push(cur)
  return lines
}

function fitName(
  ctx: CanvasRenderingContext2D, text: string, maxW: number, startSize: number, maxLines = 3,
): { lines: string[]; size: number } {
  let size = startSize
  ctx.font = font(size, 700)
  let lines = wrapText(ctx, text, maxW)
  while ((lines.length > maxLines || lines.some(l => ctx.measureText(l).width > maxW)) && size > 48) {
    size -= 6; ctx.font = font(size, 700); lines = wrapText(ctx, text, maxW)
  }
  return { lines, size }
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image(); img.crossOrigin = 'anonymous'
    img.onload = () => res(img); img.onerror = rej; img.src = src
  })
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath()
}


async function drawGpfLogo(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  try {
    const img = await loadImg('/gpf-logo.png')
    ctx.drawImage(img, x, y, (img.width / img.height) * h, h)
  } catch {
    ctx.font = font(28, 700); ctx.fillStyle = '#7C3AED'
    ctx.fillText('TGPF 2026', x, y + h * 0.7)
  }
}

async function drawWipLogo(ctx: CanvasRenderingContext2D, rightX: number, cy: number, h: number) {
  try {
    const img = await loadImg('/wip-logo.png')
    // WIP logo is a purple circle - shows fine directly on white
    const logoW = Math.round((img.width / img.height) * h)
    ctx.drawImage(img, rightX - logoW, cy - h / 2, logoW, h)
  } catch {
    ctx.font = font(22, 700); ctx.fillStyle = '#7C3AED'
    ctx.textAlign = 'right'; ctx.fillText('WiP', rightX, cy + 8); ctx.textAlign = 'left'
  }
}

// Shared header
async function drawHeader(ctx: CanvasRenderingContext2D, t: T) {
  // Top gradient bar
  const topBar = ctx.createLinearGradient(0, 0, W, 0)
  topBar.addColorStop(0, t.bar[0]); topBar.addColorStop(0.5, t.bar[1]); topBar.addColorStop(1, t.bar[2])
  ctx.fillStyle = topBar; ctx.fillRect(0, 0, W, TOP_BAR)

  // TGPF logo - centred and large so it reads as the focus of the header
  const LOGO_H = 150
  const LOGO_CY = TOP_BAR + Math.round((HEADER_H - TOP_BAR - 2) / 2)

  try {
    const gpf = await loadImg('/gpf-logo.png')
    const gpfW = Math.round((gpf.width / gpf.height) * LOGO_H)
    ctx.drawImage(gpf, Math.round(W / 2 - gpfW / 2), LOGO_CY - LOGO_H / 2, gpfW, LOGO_H)
  } catch {
    ctx.font = font(36, 700); ctx.fillStyle = '#7C3AED'
    ctx.textAlign = 'center'; ctx.fillText('TGPF 2026', W / 2, LOGO_CY + 12); ctx.textAlign = 'left'
  }

  // Thin separator between header and body
  ctx.fillStyle = '#E5E7EB'; ctx.fillRect(0, HEADER_H - 2, W, 2)
}

// Shared footer - 2 sponsor columns matching website pattern
async function drawFooter(ctx: CanvasRenderingContext2D, t: T, height: number, centerText = false) {
  const stripY = height - FOOTER_H
  const STRIP_H = FOOTER_H - BOT_BAR

  // Light gray strip + separator
  ctx.fillStyle = '#F7F7F9'; ctx.fillRect(0, stripY, W, STRIP_H)
  ctx.fillStyle = '#E5E7EB'; ctx.fillRect(0, stripY, W, 1)

  // 3 logos in one row: WIP · Freshworks · Toast
  const logoSrcs = ['/wip-logo.png', '/logos/freshworks-logo.png', '/logos/toast.webp']

  // Same height for all logos → perfect horizontal alignment
  const LOGO_H = 52
  const LOGO_CY = stripY + 66

  const imgs = await Promise.all(logoSrcs.map(s => loadImg(s).catch(() => null)))

  const dims = imgs.map(img => {
    if (!img) return { w: 0, h: 0 }
    return { w: Math.round((img.width / img.height) * LOGO_H), h: LOGO_H }
  })

  // Equal gaps between logos and equal outer margins
  const totalLogoW = dims.reduce((sum, d) => sum + d.w, 0)
  const gap = Math.round((W - 2 * PAD - totalLogoW) / (dims.length + 1))

  ctx.save()
  let drawX = PAD + gap
  for (let i = 0; i < logoSrcs.length; i++) {
    const img = imgs[i]
    const { w, h } = dims[i]
    if (img && w > 0) {
      ctx.drawImage(img, drawX, Math.round(LOGO_CY - h / 2), w, h)
    }
    drawX += w + gap
  }
  ctx.restore()

  // Hashtag + URL
  ctx.font = font(14, 400, 'JetBrains Mono'); ctx.fillStyle = '#B0B7C3'
  const HASH_Y = LOGO_CY + Math.ceil(LOGO_H / 2) + 24
  if (centerText) {
    ctx.textAlign = 'center'
    ctx.fillText(`${EVENT.hashtag}  ·  ${EVENT.url}`, W / 2, HASH_Y)
    ctx.textAlign = 'left'
  } else {
    ctx.fillText(EVENT.hashtag, PAD, HASH_Y)
    ctx.textAlign = 'right'; ctx.fillText(EVENT.url, W - PAD, HASH_Y); ctx.textAlign = 'left'
  }

  // Bottom gradient bar
  const botBar = ctx.createLinearGradient(0, 0, W, 0)
  botBar.addColorStop(0, t.bar[0]); botBar.addColorStop(0.5, t.bar[1]); botBar.addColorStop(1, t.bar[2])
  ctx.fillStyle = botBar; ctx.fillRect(0, height - BOT_BAR, W, BOT_BAR)
}

// Photo helpers
async function drawRoundedPhoto(
  ctx: CanvasRenderingContext2D, src: string,
  x: number, y: number, w: number, h: number, r: number,
  tr: number, tg: number, tb: number,
) {
  try {
    const img = await loadImg(src)
    ctx.save(); roundRect(ctx, x, y, w, h, r); ctx.clip(); ctx.drawImage(img, x, y, w, h); ctx.restore()
    ctx.save()
    ctx.shadowColor = ac(tr, tg, tb, 0.3); ctx.shadowBlur = 20
    ctx.strokeStyle = ac(tr, tg, tb, 0.5); ctx.lineWidth = 3
    roundRect(ctx, x, y, w, h, r); ctx.stroke(); ctx.restore()
  } catch { /* no photo */ }
}

async function drawCirclePhoto(
  ctx: CanvasRenderingContext2D, src: string,
  cx: number, cy: number, r: number,
  tr: number, tg: number, tb: number,
) {
  try {
    const img = await loadImg(src)
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2); ctx.restore()
    ctx.save()
    ctx.shadowColor = ac(tr, tg, tb, 0.3); ctx.shadowBlur = 18
    ctx.beginPath(); ctx.arc(cx, cy, r + 2, 0, Math.PI * 2)
    ctx.strokeStyle = ac(tr, tg, tb, 0.55); ctx.lineWidth = 4; ctx.stroke(); ctx.restore()
  } catch { /* no photo */ }
}

async function drawOrgLogo(
  ctx: CanvasRenderingContext2D, src: string, cx: number, cy: number, maxSize: number,
) {
  try {
    const img = await loadImg(src)
    const ratio = img.width / img.height
    const w = ratio >= 1 ? maxSize : maxSize * ratio
    const h = ratio >= 1 ? maxSize / ratio : maxSize
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h)
  } catch { /* silent */ }
}

// Placeholder box or circle when no photo/logo is uploaded
function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
  label: string, t: T, circle = false,
) {
  if (circle) {
    const cx = x + w / 2, cy = y + h / 2, cr = Math.min(w, h) / 2
    ctx.fillStyle = '#F3F4F6'; ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill()
    ctx.save(); ctx.setLineDash([12, 7])
    ctx.strokeStyle = ac(t.r, t.g, t.b, 0.3); ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
    ctx.font = font(16, 400, 'JetBrains Mono'); ctx.fillStyle = '#9CA3AF'
    ctx.textAlign = 'center'; ctx.fillText(label, cx, cy + cr + 28); ctx.textAlign = 'left'
  } else {
    ctx.fillStyle = '#F3F4F6'; roundRect(ctx, x, y, w, h, r); ctx.fill()
    ctx.save(); ctx.setLineDash([12, 7])
    ctx.strokeStyle = ac(t.r, t.g, t.b, 0.3); ctx.lineWidth = 2
    roundRect(ctx, x, y, w, h, r); ctx.stroke(); ctx.restore()
    ctx.font = font(16, 400, 'JetBrains Mono'); ctx.fillStyle = '#9CA3AF'
    ctx.textAlign = 'center'; ctx.fillText(label, x + w / 2, y + h - 28); ctx.textAlign = 'left'
  }
}

// Solid-fill badge pill (role colour, white text)
function drawBadge(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, t: T) {
  ctx.font = font(19, 400, 'JetBrains Mono')
  const bw = ctx.measureText(text).width + 48
  roundRect(ctx, x, y, bw, 44, 22)
  ctx.fillStyle = t.hex; ctx.fill()
  ctx.fillStyle = '#FFFFFF'; ctx.fillText(text, x + 24, y + 28)
}

// UNIFIED - same layout for every role
// Top: partner logos row  →  photo  →  name  →  TGPF logo  →  badge  →  date/venue
async function renderUnified(ctx: CanvasRenderingContext2D, opts: RenderOptions) {
  const height     = H(opts.portrait)
  const P          = !!opts.portrait
  const t          = getTheme(opts.role.id)
  const { r, g, b } = t
  const isPersonal = opts.role.hasPhoto
  const hasPhoto   = !!opts.photo
  const cx         = W / 2

  // Dark gradient background
  const bg = ctx.createLinearGradient(0, 0, W, height)
  bg.addColorStop(0, '#0C0A1E'); bg.addColorStop(1, '#05040C')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, height)

  // Role-coloured orb top-right
  const o1 = ctx.createRadialGradient(W * 0.9, height * 0.1, 0, W * 0.9, height * 0.1, W * 0.72)
  o1.addColorStop(0, ac(r, g, b, 0.38)); o1.addColorStop(1, ac(r, g, b, 0))
  ctx.fillStyle = o1; ctx.fillRect(0, 0, W, height)

  // Amber orb bottom-left
  const o2 = ctx.createRadialGradient(W * 0.06, height * 0.92, 0, W * 0.06, height * 0.92, W * 0.52)
  o2.addColorStop(0, 'rgba(245,158,11,0.18)'); o2.addColorStop(1, 'rgba(245,158,11,0)')
  ctx.fillStyle = o2; ctx.fillRect(0, 0, W, height)

  // Top gradient bar
  const gBar = ctx.createLinearGradient(0, 0, W, 0)
  gBar.addColorStop(0, t.bar[0]); gBar.addColorStop(0.5, t.bar[1]); gBar.addColorStop(1, t.bar[2])
  ctx.fillStyle = gBar; ctx.fillRect(0, 0, W, TOP_BAR)

  // Header logos: TGPF left, WiP right — directly on dark background
  const LOGO_CY_ROW = TOP_BAR + Math.round(LOGO_ZONE_H / 2)
  const TGPF_H = P ? 108 : 90
  const WIP_H  = P ? 78 : 66

  const [gpfImg, wipImg] = await Promise.all([
    loadImg('/gpf-logo.png').catch(() => null),
    loadImg('/wip-logo.png').catch(() => null),
  ])

  if (gpfImg) {
    const gpfW = Math.round((gpfImg.width / gpfImg.height) * TGPF_H)
    ctx.drawImage(gpfImg, PAD, Math.round(LOGO_CY_ROW - TGPF_H / 2), gpfW, TGPF_H)
  }

  if (wipImg) {
    const wipW = Math.round((wipImg.width / wipImg.height) * WIP_H)
    ctx.drawImage(wipImg, W - PAD - wipW, Math.round(LOGO_CY_ROW - WIP_H / 2), wipW, WIP_H)
  }

  // Subtle separator
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(0, TOP_BAR + LOGO_ZONE_H, W, 1)

  const BODY_TOP = TOP_BAR + LOGO_ZONE_H + 2

  // Radial glow wash in body
  const PHOTO_R  = P ? 268 : 210
  const PHOTO_CY = BODY_TOP + (P ? 48 : 36) + PHOTO_R

  const wash = ctx.createRadialGradient(cx, PHOTO_CY, 0, cx, PHOTO_CY, W * 0.72)
  wash.addColorStop(0, ac(r, g, b, 0.14)); wash.addColorStop(1, ac(r, g, b, 0))
  ctx.fillStyle = wash; ctx.fillRect(0, BODY_TOP, W, height - BODY_TOP - BOT_BAR)

  // Photo / Org logo
  if (isPersonal) {
    if (hasPhoto) {
      await drawCirclePhoto(ctx, opts.photo!, cx, PHOTO_CY, PHOTO_R, r, g, b)
    } else {
      ctx.fillStyle = ac(r, g, b, 0.12)
      ctx.beginPath(); ctx.arc(cx, PHOTO_CY, PHOTO_R, 0, Math.PI * 2); ctx.fill()
      ctx.save(); ctx.setLineDash([12, 7])
      ctx.strokeStyle = ac(r, g, b, 0.4); ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(cx, PHOTO_CY, PHOTO_R, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
      ctx.font = font(16, 400, 'JetBrains Mono'); ctx.fillStyle = t.light + '99'
      ctx.textAlign = 'center'; ctx.fillText('+ ADD PHOTO', cx, PHOTO_CY + PHOTO_R + 28); ctx.textAlign = 'left'
    }
  } else {
    const bw = Math.round(PHOTO_R * 2.1), bh = Math.round(PHOTO_R * 1.35)
    const bx = cx - bw / 2, by = PHOTO_CY - bh / 2
    if (hasPhoto) {
      ctx.fillStyle = ac(r, g, b, 0.12); roundRect(ctx, bx, by, bw, bh, 20); ctx.fill()
      ctx.strokeStyle = ac(r, g, b, 0.3); ctx.lineWidth = 1.5
      roundRect(ctx, bx, by, bw, bh, 20); ctx.stroke()
      await drawOrgLogo(ctx, opts.photo!, cx, PHOTO_CY, Math.min(bw * 0.68, bh * 0.65))
    } else {
      ctx.fillStyle = ac(r, g, b, 0.1); roundRect(ctx, bx, by, bw, bh, 20); ctx.fill()
      ctx.save(); ctx.setLineDash([12, 7])
      ctx.strokeStyle = ac(r, g, b, 0.35); ctx.lineWidth = 2
      roundRect(ctx, bx, by, bw, bh, 20); ctx.stroke(); ctx.restore()
      ctx.font = font(16, 400, 'JetBrains Mono'); ctx.fillStyle = t.light + '99'
      ctx.textAlign = 'center'; ctx.fillText('+ ADD LOGO', cx, by + bh - 28); ctx.textAlign = 'left'
    }
  }

  let y = PHOTO_CY + PHOTO_R
  ctx.textAlign = 'center'

  // Name
  y += P ? 36 : 28
  const displayName = opts.name.trim() || (isPersonal ? 'Your Name' : 'Your Organisation')
  const NAME_SZ = P ? 72 : 56
  const { lines: nameLines, size: nameSz } = fitName(ctx, displayName, W - PAD * 3, NAME_SZ, 2)
  const nLineH  = nameSz * 1.12
  ctx.font = font(nameSz, 700); ctx.fillStyle = '#F0EEF8'
  nameLines.forEach((ln, i) => ctx.fillText(ln, cx, y + Math.round(nameSz * 0.72) + i * nLineH))
  y += nameSz * nameLines.length + Math.round(nameSz * 0.12) * (nameLines.length - 1)

  // Title / tagline
  const TITLE_SZ = P ? 26 : 22
  if (opts.title.trim()) {
    y += P ? 18 : 14
    ctx.font = font(TITLE_SZ, 400, 'Inter'); ctx.fillStyle = '#9490AD'
    ctx.fillText(opts.title.trim(), cx, y + Math.round(TITLE_SZ * 0.72))
    y += TITLE_SZ + (P ? 22 : 18)
  } else {
    y += P ? 20 : 14
  }

  // Role badge
  y += P ? 18 : 14
  const BADGE_FONT = P ? 20 : 18
  ctx.font = font(BADGE_FONT, 400, 'JetBrains Mono')
  const chipTxt = opts.role.chip
  const chipPx  = ctx.measureText(chipTxt).width + 52
  const BADGE_H = 46
  roundRect(ctx, cx - chipPx / 2, y, chipPx, BADGE_H, 23)
  ctx.fillStyle = t.hex; ctx.fill()
  ctx.fillStyle = '#FFFFFF'; ctx.fillText(chipTxt, cx, y + 30)
  y += BADGE_H

  // Gradient divider
  y += P ? 26 : 20
  const divW = P ? 380 : 300
  const divG  = ctx.createLinearGradient(cx - divW / 2, 0, cx + divW / 2, 0)
  divG.addColorStop(0, ac(r, g, b, 0)); divG.addColorStop(0.5, t.hex); divG.addColorStop(1, ac(r, g, b, 0))
  ctx.fillStyle = divG; ctx.fillRect(cx - divW / 2, y, divW, 3)
  y += 3

  // Date
  const DATE_SZ = P ? 36 : 32
  y += P ? 28 : 24
  ctx.font = font(DATE_SZ, 700); ctx.fillStyle = '#F59E0B'
  ctx.fillText(EVENT.dates, cx, y + Math.round(DATE_SZ * 0.72))
  y += DATE_SZ

  // Venue
  const VENUE_SZ = P ? 26 : 22
  y += P ? 16 : 14
  ctx.font = font(VENUE_SZ, 400, 'Inter'); ctx.fillStyle = '#9490AD'
  ctx.fillText(EVENT.city, cx, y + Math.round(VENUE_SZ * 0.72))
  y += VENUE_SZ

  // Hashtag + URL
  y += P ? 32 : 26
  ctx.font = font(14, 400, 'JetBrains Mono'); ctx.fillStyle = '#3A3856'
  ctx.fillText(`${EVENT.hashtag}  ·  ${EVENT.url}`, cx, y + 10)

  // Bottom gradient bar
  const botG = ctx.createLinearGradient(0, 0, W, 0)
  botG.addColorStop(0, t.bar[0]); botG.addColorStop(0.5, t.bar[1]); botG.addColorStop(1, t.bar[2])
  ctx.fillStyle = botG; ctx.fillRect(0, height - BOT_BAR, W, BOT_BAR)

  ctx.textAlign = 'left'
}

async function renderHero(ctx: CanvasRenderingContext2D, opts: RenderOptions) {
  return renderUnified(ctx, opts)
}

// EDITORIAL
async function renderEditorial(ctx: CanvasRenderingContext2D, opts: RenderOptions) {
  return renderUnified(ctx, opts)
}

// FESTIVAL
async function renderFestival(ctx: CanvasRenderingContext2D, opts: RenderOptions) {
  return renderUnified(ctx, opts)
}

// Main export
export async function renderCard(opts: RenderOptions): Promise<void> {
  const { canvas, design, portrait } = opts
  const height = H(portrait)
  canvas.width = W; canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, height)
  await document.fonts.ready
  if (design === 'hero')           await renderHero(ctx, opts)
  else if (design === 'editorial') await renderEditorial(ctx, opts)
  else                             await renderFestival(ctx, opts)
}
