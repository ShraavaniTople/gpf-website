# GPF 2026 Website

The official website for The Great Product Festival 2026, a Women in Product India initiative. Built with React, TypeScript, Vite, and Tailwind CSS.


## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- Hosted on GitHub Pages


## Design Reference

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background deep | `#05040C` | Page background, form inputs |
| Background mid | `#080618` | Alternate sections |
| Background card | `#0D0B1F` | Cards, modals |
| Border | `#1C1A32` | Dividers, card borders |
| Brand Purple | `#7C3AED` | Primary CTA, accents |
| Purple Light | `#A78BFA` | Icons, gradient text |
| Purple Hover | `#6D28D9` | Hover state for purple |
| Brand Amber | `#F59E0B` | Secondary CTA, highlights |
| Amber Light | `#FCD34D` | Hover state for amber |
| Text Primary | `#F0EEF8` | Headlines, main text |
| Text Secondary | `#9490AD` | Subtext, form labels |
| Text Muted | `#6B7280` | Body copy, descriptions |
| Text Dim | `#52506A` | Metadata, timestamps |

### Gradient Text

Used on hero title and stat numbers.

```css
background: linear-gradient(120deg, #A78BFA 0%, #F59E0B 80%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```


### Typography

| Role | Font | Weight |
|---|---|---|
| Headings | Space Grotesk | 700, 800 |
| Body | Inter | 400, 500, 600 |
| Labels, badges, mono | JetBrains Mono | 400, 500 |

Hero headline: `clamp(56px, 8.5vw, 128px)`, letter-spacing `-0.045em`

Section headline: `clamp(40px, 6vw, 80px)`, letter-spacing `-0.04em`


### Buttons

| Class | Background | Text | Glow shadow |
|---|---|---|---|
| `.btn-purple` | `#7C3AED` | white | `0 0 28px rgba(124,58,237,.35)` |
| `.btn-amber` | `#F59E0B` | black | `0 0 28px rgba(245,158,11,.25)` |
| `.btn-ghost` | transparent | `#9490AD` | none, border `rgba(240,238,248,.12)` |

All buttons use `border-radius: 9999px`, Space Grotesk bold, `padding: 14px 32px`.


### Cards

**Pass Card** (`.pass-card`)
- Background: `#080618` standard, `#0E0C22` for popular tier
- Border: `1px solid #1C1A32` standard, `1.5px solid rgba(124,58,237,.5)` popular
- Border radius: 16px
- Hover: lifts `translateY(-5px)`
- Popular card: animated shimmer line on top edge, purple box-shadow `0 0 70px rgba(124,58,237,.18)`

**Speaker Card** (`.spk-card`)
- Aspect ratio: 3/4 portrait
- Name and title overlay slides up on hover
- Dark gradient from bottom: `rgba(5,4,12,.95)` to transparent

**Agenda Track Card**
- Background: `#080618`, border `1px solid #1C1A32`, 16px radius
- Coloured top strip 1px: purple `#7C3AED` for track 1, amber `#F59E0B` for track 2

**Modal**
- Background: `#0D0B1F`, border `1px solid rgba(124,58,237,.3)`
- Max width 672px, max height 90vh, 16px radius
- Backdrop: black 70% opacity with blur


### Animations

| Class | Effect |
|---|---|
| `.sr` | Fade up on scroll into view |
| `.sr-l` | Slide in from left on scroll |
| `.sr-r` | Slide in from right on scroll |
| `.sg` | Staggered children fade-up, 80ms steps |
| `.fl` | Floating badge, gentle bob with slight rotation |
| `.pd` | Amber pulse ring on dot |
| `.shim-top` | Shimmer sweep across popular card top edge |
| `.zoom` | Image scales to 1.07 on hover |
| `#cg` | 650px purple radial glow that follows the cursor |


### Forms

```
Input / Textarea   bg #05040C  border #1C1A32  focus-border #7C3AED  rounded-xl
Select             same as input + appearance-none
Label              text-sm, font-medium, color #9490AD
```

All forms capture data via `FormData` on submit and open a pre-filled email to `hello@womeninproductindia.com`.


### Dividers

```css
.div-glow {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(124,58,237,.3), rgba(245,158,11,.15), transparent);
}
```


### Section IDs

| Label | ID |
|---|---|
| Why Attend | `#why-attend` |
| Community | `#community` |
| Hackathon | `#hackathon` |
| Agenda | `#agenda` |
| Speakers | `#speakers` |
| Passes | `#passes` |
| Sponsor | `#sponsor` |
| FAQ / Press | `#press` |


### Modals and CTAs

| CTA | Opens |
|---|---|
| Get This Pass | Pass registration modal |
| Register for the Hackathon | Hackathon registration modal |
| Apply to Speak | Speaker application modal |
| Nominate to Speak | Speaker nomination modal |
| Request Sponsorship Details | Sponsorship enquiry modal |
| Become a Community Partner | Community partner modal |
| Get Passes (navbar, hero) | Scrolls to passes section |


## Local Development

```bash
npm install
npm run dev
```

```bash
npm run build
```
