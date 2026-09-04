/**
 * Social Card Renderer — Canvas-based, all client-side
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

const W = 1080
const PAD = 68

function H(portrait?: boolean) { return portrait ? 1350 : 1080 }

// ── Role theme ────────────────────────────────────────────────────────────────
interface T {
  r: number; g: number; b: number  // accent RGB
  hex: string                       // accent hex
  light: string                     // lighter shade hex
  bar: [string, string, string]     // bottom bar gradient stops
  watermark: string                 // large bg decorative text
}

function ac(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`
}

function getTheme(id: RoleId): T {
  const map: Record<RoleId, T> = {
    attendee: {
      r: 124, g: 58,  b: 237, hex: '#7C3AED', light: '#A78BFA',
      bar: ['#7C3AED', '#A78BFA', '#F59E0B'], watermark: '2026',
    },
    speaker: {
      r: 161, g: 98,  b: 7,   hex: '#A16207', light: '#FCD34D',
      bar: ['#B45309', '#F59E0B', '#FEF3C7'], watermark: 'STAGE',
    },
    mentor: {
      r: 20,  g: 184, b: 166, hex: '#14B8A6', light: '#5EEAD4',
      bar: ['#0F766E', '#14B8A6', '#CCFBF1'], watermark: 'MENTOR',
    },
    judge: {
      r: 234, g: 88,  b: 12,  hex: '#EA580C', light: '#FB923C',
      bar: ['#C2410C', '#EA580C', '#FED7AA'], watermark: 'JUDGE',
    },
    sponsor: {
      r: 29,  g: 78,  b: 216, hex: '#1D4ED8', light: '#93C5FD',
      bar: ['#1D4ED8', '#60A5FA', '#BFDBFE'], watermark: '2026',
    },
    'community-partner': {
      r: 6,   g: 95,  b: 70,  hex: '#065F46', light: '#6EE7B7',
      bar: ['#065F46', '#059669', '#D1FAE5'], watermark: 'COMM',
    },
  }
  return map[id]
}

// ── Text helpers ──────────────────────────────────────────────────────────────
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
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  startSize: number,
  maxLines = 3,
): { lines: string[]; size: number } {
  let size = startSize
  ctx.font = font(size, 700)
  let lines = wrapText(ctx, text, maxW)
  while ((lines.length > maxLines || lines.some(l => ctx.measureText(l).width > maxW)) && size > 48) {
    size -= 6
    ctx.font = font(size, 700)
    lines = wrapText(ctx, text, maxW)
  }
  return { lines, size }
}

// ── Image loaders ─────────────────────────────────────────────────────────────
function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

async function drawGpfLogo(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  try {
    const img = await loadImg('/gpf-logo.png')
    ctx.drawImage(img, x, y, (img.width / img.height) * h, h)
  } catch {
    ctx.font = font(28, 700); ctx.fillStyle = '#A78BFA'
    ctx.fillText('TGPF 2026', x, y + h * 0.7)
  }
}

async function drawWipLogo(ctx: CanvasRenderingContext2D, rightX: number, y: number, h: number) {
  try {
    const img = await loadImg('/wip-logo.png')
    const w = (img.width / img.height) * h
    ctx.drawImage(img, rightX - w, y, w, h)
  } catch { /* silent */ }
}

async function drawRoundedPhoto(
  ctx: CanvasRenderingContext2D, src: string,
  x: number, y: number, w: number, h: number, r: number,
  tr: number, tg: number, tb: number,
) {
  try {
    const img = await loadImg(src)
    ctx.save()
    roundRect(ctx, x, y, w, h, r); ctx.clip()
    ctx.drawImage(img, x, y, w, h)
    ctx.restore()
    ctx.save()
    ctx.shadowColor = ac(tr, tg, tb, 0.55); ctx.shadowBlur = 24
    ctx.strokeStyle = ac(tr, tg, tb, 0.75); ctx.lineWidth = 3
    roundRect(ctx, x, y, w, h, r); ctx.stroke()
    ctx.restore()
  } catch { /* no photo */ }
}

async function drawCirclePhoto(
  ctx: CanvasRenderingContext2D, src: string,
  cx: number, cy: number, r: number,
  tr: number, tg: number, tb: number,
) {
  try {
    const img = await loadImg(src)
    ctx.save()
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2)
    ctx.restore()
    ctx.save()
    ctx.shadowColor = ac(tr, tg, tb, 0.55); ctx.shadowBlur = 20
    ctx.beginPath(); ctx.arc(cx, cy, r + 2, 0, Math.PI * 2)
    ctx.strokeStyle = ac(tr, tg, tb, 0.75); ctx.lineWidth = 4; ctx.stroke()
    ctx.restore()
  } catch { /* no photo */ }
}

async function drawOrgLogo(
  ctx: CanvasRenderingContext2D, src: string,
  cx: number, cy: number, maxSize: number,
) {
  try {
    const img = await loadImg(src)
    const ratio = img.width / img.height
    const w = ratio >= 1 ? maxSize : maxSize * ratio
    const h = ratio >= 1 ? maxSize / ratio : maxSize
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h)
  } catch { /* silent */ }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
async function renderHero(ctx: CanvasRenderingContext2D, opts: RenderOptions) {
  const height = H(opts.portrait)
  const hasPhoto = !!opts.photo
  const isPersonal = opts.role.hasPhoto
  const t = getTheme(opts.role.id)
  const { r, g, b } = t

  // ── Background ──────────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, height)
  bg.addColorStop(0, '#0C0A1E'); bg.addColorStop(1, '#05040C')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, height)

  // Role-coloured top-right orb
  const o1 = ctx.createRadialGradient(W * 0.9, height * 0.08, 0, W * 0.9, height * 0.08, W * 0.72)
  o1.addColorStop(0, ac(r, g, b, 0.42)); o1.addColorStop(1, ac(r, g, b, 0))
  ctx.fillStyle = o1; ctx.fillRect(0, 0, W, height)

  // Amber bottom-left orb (event branding, fixed)
  const o2 = ctx.createRadialGradient(W * 0.06, height * 0.92, 0, W * 0.06, height * 0.92, W * 0.52)
  o2.addColorStop(0, 'rgba(245,158,11,0.2)'); o2.addColorStop(1, 'rgba(245,158,11,0)')
  ctx.fillStyle = o2; ctx.fillRect(0, 0, W, height)

  // Grid tinted by role
  ctx.strokeStyle = ac(r, g, b, 0.07); ctx.lineWidth = 1
  for (let x = 0; x <= W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke() }
  for (let y = 0; y <= height; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

  // Role-specific watermark text
  ctx.font = font(t.watermark.length > 4 ? 200 : 320, 700)
  ctx.fillStyle = ac(r, g, b, 0.05)
  ctx.textAlign = 'center'
  ctx.fillText(t.watermark, W / 2, height * 0.72)
  ctx.textAlign = 'left'

  // ── Photo / logo zone (right side) ───────────────────────────────────────────
  const FW = opts.portrait ? 420 : 460
  const FH = FW
  const FR = 32
  const FX = W - PAD - FW
  const FY = 224
  const FCX = FX + FW / 2
  const FCY = FY + FH / 2

  const gp = ctx.createRadialGradient(FCX, FCY, 0, FCX, FCY, FW * 0.85)
  gp.addColorStop(0, ac(r, g, b, 0.16)); gp.addColorStop(1, ac(r, g, b, 0))
  ctx.fillStyle = gp; ctx.fillRect(0, 0, W, height)

  if (hasPhoto && isPersonal) {
    await drawRoundedPhoto(ctx, opts.photo!, FX, FY, FW, FH, FR, r, g, b)

  } else if (hasPhoto && !isPersonal) {
    ctx.fillStyle = 'rgba(5,4,12,0.55)'
    roundRect(ctx, FX, FY, FW, FH, FR); ctx.fill()
    ctx.strokeStyle = ac(r, g, b, 0.35); ctx.lineWidth = 2
    roundRect(ctx, FX, FY, FW, FH, FR); ctx.stroke()
    await drawOrgLogo(ctx, opts.photo!, FCX, FCY, FW * 0.72)

  } else if (isPersonal) {
    // Photo placeholder
    const fg = ctx.createLinearGradient(FX, FY, FX, FY + FH)
    fg.addColorStop(0, ac(r, g, b, 0.09)); fg.addColorStop(1, ac(r, g, b, 0.03))
    ctx.fillStyle = fg; roundRect(ctx, FX, FY, FW, FH, FR); ctx.fill()
    ctx.save()
    ctx.shadowColor = ac(r, g, b, 0.35); ctx.shadowBlur = 14
    ctx.setLineDash([20, 11])
    ctx.strokeStyle = t.light + 'AA'; ctx.lineWidth = 2.5
    roundRect(ctx, FX, FY, FW, FH, FR); ctx.stroke()
    ctx.restore()
    for (const [dx, dy] of [[FX+FR,FY+FR],[FX+FW-FR,FY+FR],[FX+FR,FY+FH-FR],[FX+FW-FR,FY+FH-FR]]) {
      ctx.beginPath(); ctx.arc(dx as number, dy as number, 5, 0, Math.PI*2)
      ctx.fillStyle = t.light + '77'; ctx.fill()
    }
    ctx.fillStyle = ac(r, g, b, 0.22)
    ctx.beginPath(); ctx.arc(FCX, FCY - FH*0.14, FW*0.16, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(FCX, FCY + FH*0.36, FW*0.30, Math.PI, 0); ctx.fill()
    ctx.font = font(22, 400, 'JetBrains Mono'); ctx.fillStyle = t.light + '80'
    ctx.textAlign = 'center'; ctx.fillText('+ ADD PHOTO', FCX, FY+FH-30); ctx.textAlign = 'left'

  } else {
    // Logo placeholder
    const fg = ctx.createLinearGradient(FX, FY, FX, FY+FH)
    fg.addColorStop(0, ac(r, g, b, 0.08)); fg.addColorStop(1, ac(r, g, b, 0.02))
    ctx.fillStyle = fg; roundRect(ctx, FX, FY, FW, FH, FR); ctx.fill()
    ctx.save()
    ctx.shadowColor = ac(r, g, b, 0.28); ctx.shadowBlur = 12
    ctx.setLineDash([20, 11])
    ctx.strokeStyle = t.light + '88'; ctx.lineWidth = 2.5
    roundRect(ctx, FX, FY, FW, FH, FR); ctx.stroke()
    ctx.restore()
    for (const [dx, dy] of [[FX+FR,FY+FR],[FX+FW-FR,FY+FR],[FX+FR,FY+FH-FR],[FX+FW-FR,FY+FH-FR]]) {
      ctx.beginPath(); ctx.arc(dx as number, dy as number, 5, 0, Math.PI*2)
      ctx.fillStyle = t.light + '66'; ctx.fill()
    }
    const iw = FW*0.46, ih = FH*0.28, ix = FCX-iw/2, iy = FCY-ih/2-20
    roundRect(ctx, ix, iy, iw, ih, 10)
    ctx.fillStyle = ac(r, g, b, 0.18); ctx.fill()
    ctx.strokeStyle = ac(r, g, b, 0.35); ctx.lineWidth = 2; ctx.stroke()
    ctx.font = font(22, 400, 'JetBrains Mono'); ctx.fillStyle = t.light + '80'
    ctx.textAlign = 'center'; ctx.fillText('+ ADD LOGO', FCX, FY+FH-30); ctx.textAlign = 'left'
  }

  const textMaxW = FX - PAD - 44

  // ── Header ────────────────────────────────────────────────────────────────────
  const hdGrad = ctx.createLinearGradient(0, 0, 0, 148)
  hdGrad.addColorStop(0, 'rgba(5,4,12,0.78)'); hdGrad.addColorStop(1, 'rgba(5,4,12,0)')
  ctx.fillStyle = hdGrad; ctx.fillRect(0, 0, W, 148)

  const LOGO_H = 72, WIP_H = 60, LOGO_Y = 48
  await drawGpfLogo(ctx, PAD, LOGO_Y, LOGO_H)
  await drawWipLogo(ctx, W - PAD, LOGO_Y + (LOGO_H - WIP_H) / 2, WIP_H)

  // ── Role badge ────────────────────────────────────────────────────────────────
  const BADGE_TOP = LOGO_Y + LOGO_H + 44
  const BADGE_H = 52
  const BADGE_BTM = BADGE_TOP + BADGE_H
  const badgeTxt = opts.role.label.toUpperCase()

  ctx.font = font(22, 400, 'JetBrains Mono')
  const badgeW = ctx.measureText(badgeTxt).width + 52
  ctx.fillStyle = ac(r, g, b, 0.2); roundRect(ctx, PAD, BADGE_TOP, badgeW, BADGE_H, 26); ctx.fill()
  ctx.strokeStyle = t.light + '99'; ctx.lineWidth = 1.5; roundRect(ctx, PAD, BADGE_TOP, badgeW, BADGE_H, 26); ctx.stroke()
  ctx.fillStyle = t.light; ctx.fillText(badgeTxt, PAD + 26, BADGE_TOP + 33)

  // ── Name ──────────────────────────────────────────────────────────────────────
  const NAME_BASELINE_MIN = 390
  const displayName = opts.name.trim() || (isPersonal ? 'Your Name' : 'Your Organisation')
  const { lines: nameLines, size: nameFontSize } = fitName(ctx, displayName, textMaxW, 144, 3)
  const lineH = nameFontSize * 1.12
  const capHeight = nameFontSize * 0.72
  const nameBaseline = Math.max(NAME_BASELINE_MIN, BADGE_BTM + capHeight + 30)

  ctx.font = font(nameFontSize, 700); ctx.fillStyle = '#F0EEF8'
  nameLines.forEach((line, i) => ctx.fillText(line, PAD, nameBaseline + i * lineH))
  let cursor = nameBaseline + nameLines.length * lineH

  if (opts.title.trim()) {
    cursor += 28
    ctx.font = font(30, 400, 'Inter'); ctx.fillStyle = '#6B7280'
    ctx.fillText(opts.title.trim(), PAD, cursor); cursor += 30
  }

  // ── Divider + event block ─────────────────────────────────────────────────────
  const DIVIDER_Y = Math.round(height * 0.74)
  const divGrad = ctx.createLinearGradient(PAD, 0, PAD + 260, 0)
  divGrad.addColorStop(0, t.hex); divGrad.addColorStop(1, ac(r, g, b, 0))
  ctx.fillStyle = divGrad; ctx.fillRect(PAD, DIVIDER_Y, 260, 3)

  ctx.font = font(34, 700); ctx.fillStyle = '#F59E0B'
  ctx.fillText(EVENT.dates, PAD, DIVIDER_Y + 58)
  ctx.font = font(26, 400, 'Inter'); ctx.fillStyle = '#9490AD'
  ctx.fillText(EVENT.city, PAD, DIVIDER_Y + 96)

  // ── Footer ────────────────────────────────────────────────────────────────────
  ctx.font = font(20, 400, 'JetBrains Mono'); ctx.fillStyle = '#3A3856'
  ctx.fillText(EVENT.hashtag, PAD, height - 34)
  ctx.textAlign = 'right'; ctx.fillText(EVENT.url, W - PAD, height - 34); ctx.textAlign = 'left'

  const bar = ctx.createLinearGradient(0, 0, W, 0)
  bar.addColorStop(0, t.bar[0]); bar.addColorStop(0.5, t.bar[1]); bar.addColorStop(1, t.bar[2])
  ctx.fillStyle = bar; ctx.fillRect(0, height - 6, W, 6)
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITORIAL
// ─────────────────────────────────────────────────────────────────────────────
async function renderEditorial(ctx: CanvasRenderingContext2D, opts: RenderOptions) {
  const height = H(opts.portrait)
  const hasPhoto = !!opts.photo
  const isPersonal = opts.role.hasPhoto
  const TX = PAD + 20
  const t = getTheme(opts.role.id)
  const { r, g, b } = t

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = '#07051A'; ctx.fillRect(0, 0, W, height)

  // Dot texture tinted by role
  ctx.fillStyle = ac(r, g, b, 0.028)
  for (let x = 40; x < W; x += 30) for (let y = 30; y < height; y += 30) {
    ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill()
  }

  // Left color strip: role accent → role light
  const strip = ctx.createLinearGradient(0, 0, 0, height)
  strip.addColorStop(0, t.hex); strip.addColorStop(1, t.light)
  ctx.fillStyle = strip; ctx.fillRect(0, 0, 8, height)

  // ── Photo / logo (top-right) ─────────────────────────────────────────────────
  const IMG_SIZE = opts.portrait ? 310 : 270
  const imgX = W - PAD - IMG_SIZE
  const imgY = 48 + 72 + 16

  if (hasPhoto) {
    if (isPersonal) {
      ctx.save()
      roundRect(ctx, imgX, imgY, IMG_SIZE, IMG_SIZE, 18); ctx.clip()
      const img = await loadImg(opts.photo!).catch(() => null)
      if (img) ctx.drawImage(img, imgX, imgY, IMG_SIZE, IMG_SIZE)
      ctx.restore()
      ctx.strokeStyle = ac(r, g, b, 0.55); ctx.lineWidth = 2.5
      roundRect(ctx, imgX, imgY, IMG_SIZE, IMG_SIZE, 18); ctx.stroke()
    } else {
      ctx.fillStyle = ac(r, g, b, 0.05)
      roundRect(ctx, imgX, imgY, IMG_SIZE, IMG_SIZE, 18); ctx.fill()
      ctx.strokeStyle = ac(r, g, b, 0.2); ctx.lineWidth = 1.5
      roundRect(ctx, imgX, imgY, IMG_SIZE, IMG_SIZE, 18); ctx.stroke()
      await drawOrgLogo(ctx, opts.photo!, imgX + IMG_SIZE / 2, imgY + IMG_SIZE / 2, IMG_SIZE * 0.72)
    }
  } else {
    ctx.save()
    ctx.setLineDash([14, 8])
    ctx.strokeStyle = ac(r, g, b, 0.35); ctx.lineWidth = 2.5
    roundRect(ctx, imgX, imgY, IMG_SIZE, IMG_SIZE, 18); ctx.stroke()
    ctx.restore()
    ctx.fillStyle = ac(r, g, b, 0.04)
    roundRect(ctx, imgX, imgY, IMG_SIZE, IMG_SIZE, 18); ctx.fill()
    const pcx = imgX + IMG_SIZE / 2, pcy = imgY + IMG_SIZE / 2
    ctx.fillStyle = ac(r, g, b, 0.2)
    if (isPersonal) {
      ctx.beginPath(); ctx.arc(pcx, pcy - IMG_SIZE*0.16, IMG_SIZE*0.17, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(pcx, pcy + IMG_SIZE*0.42, IMG_SIZE*0.33, Math.PI, 0); ctx.fill()
    } else {
      const iw = IMG_SIZE*0.56, ih = IMG_SIZE*0.34, ix = pcx-iw/2, iy = pcy-ih/2-12
      roundRect(ctx, ix, iy, iw, ih, 8)
      ctx.fillStyle = ac(r, g, b, 0.18); ctx.fill()
      ctx.strokeStyle = ac(r, g, b, 0.35); ctx.lineWidth = 2; ctx.stroke()
    }
    ctx.font = font(20, 400, 'JetBrains Mono'); ctx.fillStyle = t.light + '77'
    ctx.textAlign = 'center'
    ctx.fillText(isPersonal ? 'YOUR PHOTO' : 'YOUR LOGO', pcx, imgY + IMG_SIZE + 40)
    ctx.textAlign = 'left'
  }

  const textMaxW = imgX - TX - 40

  // ── Header ────────────────────────────────────────────────────────────────────
  const hdGradE = ctx.createLinearGradient(0, 0, 0, 148)
  hdGradE.addColorStop(0, 'rgba(7,5,26,0.85)'); hdGradE.addColorStop(1, 'rgba(7,5,26,0)')
  ctx.fillStyle = hdGradE; ctx.fillRect(0, 0, W, 148)

  await drawGpfLogo(ctx, TX, 48, 72)
  await drawWipLogo(ctx, W - PAD, 54, 60)

  // ── Role label ───────────────────────────────────────────────────────────────
  const ROLE_Y = 48 + 72 + 44
  ctx.font = font(19, 400, 'JetBrains Mono'); ctx.fillStyle = t.hex
  ctx.fillText(`— ${opts.role.label.toUpperCase()}`, TX, ROLE_Y)

  // ── Name ──────────────────────────────────────────────────────────────────────
  const NAME_BASELINE_MIN = ROLE_Y + 24 + 116 * 0.72 + 24
  const displayName = opts.name.trim() || (isPersonal ? 'Your Name' : 'Your Organisation')
  const { lines: nameLines, size: nameFontSize } = fitName(ctx, displayName, textMaxW, 116, 3)
  const lineH = nameFontSize * 1.1
  const capH = nameFontSize * 0.72
  const nameBaseline = Math.max(NAME_BASELINE_MIN, ROLE_Y + capH + 36)

  nameLines.forEach((line, i) => {
    if (i === nameLines.length - 1) {
      // last word in accent light colour
      const words = line.split(' '); let x = TX
      words.forEach((word, wi) => {
        ctx.font = font(nameFontSize, 700)
        ctx.fillStyle = wi === words.length - 1 ? t.light : '#F0EEF8'
        ctx.fillText(word, x, nameBaseline + i * lineH)
        x += ctx.measureText(word + ' ').width
      })
    } else {
      ctx.font = font(nameFontSize, 700); ctx.fillStyle = '#F0EEF8'
      ctx.fillText(line, TX, nameBaseline + i * lineH)
    }
  })
  let cursor = nameBaseline + nameLines.length * lineH

  if (opts.title.trim()) {
    cursor += 24
    ctx.font = font(28, 400, 'Inter'); ctx.fillStyle = '#52506A'
    ctx.fillText(opts.title.trim(), TX, cursor); cursor += 30
  }

  // ── Event info box ────────────────────────────────────────────────────────────
  const BOX_Y = Math.round(height * 0.73)
  const BOX_W = Math.min(textMaxW, 480)
  const BOX_H = 128

  ctx.fillStyle = ac(r, g, b, 0.07)
  roundRect(ctx, TX, BOX_Y, BOX_W, BOX_H, 14); ctx.fill()
  ctx.strokeStyle = ac(r, g, b, 0.2); ctx.lineWidth = 1.5
  roundRect(ctx, TX, BOX_Y, BOX_W, BOX_H, 14); ctx.stroke()

  ctx.font = font(16, 400, 'JetBrains Mono'); ctx.fillStyle = t.hex
  ctx.fillText('WHEN & WHERE', TX + 20, BOX_Y + 30)
  ctx.font = font(32, 700); ctx.fillStyle = '#F59E0B'
  ctx.fillText(EVENT.dates, TX + 20, BOX_Y + 72)
  ctx.font = font(23, 400, 'Inter'); ctx.fillStyle = '#9490AD'
  ctx.fillText(EVENT.city, TX + 20, BOX_Y + 108)

  // ── Footer ────────────────────────────────────────────────────────────────────
  ctx.font = font(19, 400, 'JetBrains Mono'); ctx.fillStyle = '#2D2B45'
  ctx.fillText(EVENT.hashtag, TX, height - 36)
  ctx.textAlign = 'right'; ctx.fillText(EVENT.url, W - PAD, height - 36); ctx.textAlign = 'left'

  // Bottom accent dot on strip uses role bar end colour
  ctx.fillStyle = t.bar[1]; ctx.fillRect(0, height - 6, 8, 6)
}

// ─────────────────────────────────────────────────────────────────────────────
// FESTIVAL
// ─────────────────────────────────────────────────────────────────────────────
async function renderFestival(ctx: CanvasRenderingContext2D, opts: RenderOptions) {
  const height = H(opts.portrait)
  const hasPhoto = !!opts.photo
  const isPersonal = opts.role.hasPhoto
  const cx = W / 2
  const t = getTheme(opts.role.id)
  const { r, g, b } = t

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = '#05040C'; ctx.fillRect(0, 0, W, height)

  // Role-coloured central orb
  const g1 = ctx.createRadialGradient(cx, height * 0.4, 0, cx, height * 0.4, W * 0.9)
  g1.addColorStop(0, ac(r, g, b, 0.28)); g1.addColorStop(0.65, ac(r, g, b, 0.06)); g1.addColorStop(1, ac(r, g, b, 0))
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, height)

  // Amber bottom orb (event branding)
  const g2 = ctx.createRadialGradient(cx, height * 0.88, 0, cx, height * 0.88, W * 0.5)
  g2.addColorStop(0, 'rgba(245,158,11,0.2)'); g2.addColorStop(1, 'rgba(245,158,11,0)')
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, height)

  // Role-coloured concentric rings
  ctx.strokeStyle = ac(r, g, b, 0.12); ctx.lineWidth = 1.5
  for (const rr of [140, 260, 390, 530]) {
    ctx.beginPath(); ctx.arc(cx, height * 0.4, rr, 0, Math.PI * 2); ctx.stroke()
  }

  // ── Logos ─────────────────────────────────────────────────────────────────────
  const hdGradF = ctx.createLinearGradient(0, 0, 0, 148)
  hdGradF.addColorStop(0, 'rgba(5,4,12,0.75)'); hdGradF.addColorStop(1, 'rgba(5,4,12,0)')
  ctx.fillStyle = hdGradF; ctx.fillRect(0, 0, W, 148)

  await drawGpfLogo(ctx, PAD, 48, 72)
  await drawWipLogo(ctx, W - PAD, 54, 60)

  // ── Photo / logo zone ─────────────────────────────────────────────────────────
  const PHOTO_R = opts.portrait ? 248 : 220
  const PHOTO_CY = height * 0.355

  const ORG_BW = opts.portrait ? 580 : 520
  const ORG_BH = opts.portrait ? 300 : 270
  const ORG_BR = 20
  const ORG_BX = cx - ORG_BW / 2
  const ORG_BY = PHOTO_CY - ORG_BH / 2

  let TEXT_START: number

  if (!isPersonal) {
    if (hasPhoto) {
      const gp = ctx.createRadialGradient(cx, PHOTO_CY, 0, cx, PHOTO_CY, 420)
      gp.addColorStop(0, ac(r, g, b, 0.25)); gp.addColorStop(1, ac(r, g, b, 0))
      ctx.fillStyle = gp; ctx.fillRect(0, 0, W, height)

      ctx.fillStyle = 'rgba(5,4,12,0.55)'
      roundRect(ctx, ORG_BX, ORG_BY, ORG_BW, ORG_BH, ORG_BR); ctx.fill()
      ctx.save()
      ctx.shadowColor = ac(r, g, b, 0.35); ctx.shadowBlur = 18
      ctx.strokeStyle = ac(r, g, b, 0.45); ctx.lineWidth = 2
      roundRect(ctx, ORG_BX, ORG_BY, ORG_BW, ORG_BH, ORG_BR); ctx.stroke()
      ctx.restore()
      await drawOrgLogo(ctx, opts.photo!, cx, PHOTO_CY, Math.min(ORG_BW * 0.72, ORG_BH * 0.68))
    } else {
      ctx.fillStyle = ac(r, g, b, 0.05)
      roundRect(ctx, ORG_BX, ORG_BY, ORG_BW, ORG_BH, ORG_BR); ctx.fill()
      ctx.save()
      ctx.setLineDash([16, 9])
      ctx.strokeStyle = t.light + '70'; ctx.lineWidth = 2
      roundRect(ctx, ORG_BX, ORG_BY, ORG_BW, ORG_BH, ORG_BR); ctx.stroke()
      ctx.restore()
      const iw = ORG_BW*0.34, ih = ORG_BH*0.38, ix = cx-iw/2, iy = PHOTO_CY-ih/2-16
      roundRect(ctx, ix, iy, iw, ih, 8)
      ctx.fillStyle = ac(r, g, b, 0.14); ctx.fill()
      ctx.strokeStyle = ac(r, g, b, 0.3); ctx.lineWidth = 1.5; ctx.stroke()
      ctx.font = font(20, 400, 'JetBrains Mono'); ctx.fillStyle = t.light + '7A'
      ctx.textAlign = 'center'; ctx.fillText('+ ADD LOGO', cx, ORG_BY + ORG_BH - 24)
    }
    TEXT_START = PHOTO_CY + ORG_BH / 2 + 56

  } else {
    if (hasPhoto) {
      const gp = ctx.createRadialGradient(cx, PHOTO_CY, PHOTO_R*0.4, cx, PHOTO_CY, PHOTO_R*1.6)
      gp.addColorStop(0, ac(r, g, b, 0.38)); gp.addColorStop(1, ac(r, g, b, 0))
      ctx.fillStyle = gp; ctx.fillRect(0, 0, W, height)
      await drawCirclePhoto(ctx, opts.photo!, cx, PHOTO_CY, PHOTO_R, r, g, b)
    } else {
      ctx.fillStyle = ac(r, g, b, 0.06)
      ctx.beginPath(); ctx.arc(cx, PHOTO_CY, PHOTO_R, 0, Math.PI*2); ctx.fill()
      ctx.save()
      ctx.setLineDash([18, 10])
      ctx.strokeStyle = t.light + '77'; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.arc(cx, PHOTO_CY, PHOTO_R, 0, Math.PI*2); ctx.stroke()
      ctx.restore()
      ctx.fillStyle = ac(r, g, b, 0.22)
      ctx.beginPath(); ctx.arc(cx, PHOTO_CY - PHOTO_R*0.2, PHOTO_R*0.32, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx, PHOTO_CY + PHOTO_R*0.62, PHOTO_R*0.52, Math.PI, 0); ctx.fill()
      ctx.font = font(20, 400, 'JetBrains Mono'); ctx.fillStyle = t.light + '80'
      ctx.textAlign = 'center'; ctx.fillText('+ ADD PHOTO', cx, PHOTO_CY + PHOTO_R + 34)
    }
    TEXT_START = height * 0.62
  }

  // ── Text block ────────────────────────────────────────────────────────────────
  ctx.textAlign = 'center'

  ctx.font = font(18, 400, 'JetBrains Mono'); ctx.fillStyle = '#52506A'
  ctx.fillText(EVENT.name.toUpperCase(), cx, TEXT_START)

  const displayName = opts.name.trim() || (isPersonal ? 'Your Name' : 'Your Organisation')
  const { lines: nameLines, size: nameFontSize } = fitName(ctx, displayName, W - PAD * 2.5, 90, 2)
  const lineH = nameFontSize * 1.12
  const capH = nameFontSize * 0.72
  const nameY = TEXT_START + capH + 12

  ctx.font = font(nameFontSize, 700); ctx.fillStyle = '#F0EEF8'
  nameLines.forEach((line, i) => ctx.fillText(line, cx, nameY + i * lineH))
  // Advance from last line's baseline by descenders + gap (not a full lineH, which leaves a dead zone)
  let cursor = nameY + (nameLines.length - 1) * lineH + Math.round(nameFontSize * 0.28) + 36

  if (opts.title.trim()) {
    cursor += 14
    ctx.font = font(26, 400, 'Inter'); ctx.fillStyle = '#6B7280'
    ctx.fillText(opts.title.trim(), cx, cursor); cursor += 22
  }

  // Role chip in role accent colour
  cursor += 12
  ctx.font = font(21, 400, 'JetBrains Mono')
  const chipTxt = opts.role.label.toUpperCase()
  const chipW = ctx.measureText(chipTxt).width + 56
  const chipX = cx - chipW / 2
  ctx.fillStyle = ac(r, g, b, 0.2); roundRect(ctx, chipX, cursor, chipW, 48, 24); ctx.fill()
  ctx.strokeStyle = t.light + '99'; ctx.lineWidth = 1.5; roundRect(ctx, chipX, cursor, chipW, 48, 24); ctx.stroke()
  ctx.fillStyle = t.light; ctx.fillText(chipTxt, cx, cursor + 31)
  cursor += 48

  cursor += 40
  ctx.font = font(30, 600); ctx.fillStyle = '#F59E0B'
  ctx.fillText(EVENT.dates, cx, cursor)
  cursor += 46
  ctx.font = font(23, 400, 'Inter'); ctx.fillStyle = '#6B7280'
  ctx.fillText(EVENT.city, cx, cursor)

  // ── Footer divider + hashtag ──────────────────────────────────────────────────
  const dg = ctx.createLinearGradient(PAD, 0, W - PAD, 0)
  dg.addColorStop(0, ac(r, g, b, 0)); dg.addColorStop(0.5, t.light + '80'); dg.addColorStop(1, ac(r, g, b, 0))
  ctx.fillStyle = dg; ctx.fillRect(PAD, height - 32, W - PAD * 2, 2)

  ctx.font = font(19, 400, 'JetBrains Mono'); ctx.fillStyle = '#3A3856'
  ctx.fillText(`${EVENT.hashtag}  ·  ${EVENT.url}`, cx, height - 14)
  ctx.textAlign = 'left'
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
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
