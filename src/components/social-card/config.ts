export const EVENT = {
  name: 'The Great Product Festival',
  short: 'TGPF 2026',
  dates: '25–26 Sept 2026',
  city: 'Bangalore, India',
  theme: 'Infinite Builders',
  url: 'thegreatproductfestival.com',
  hashtag: '#TGPF2026',
}

export type RoleId = 'attendee' | 'speaker' | 'sponsor' | 'community-partner'

export type DesignId = 'hero' | 'editorial' | 'festival'

export interface Role {
  id: RoleId
  label: string
  hasPhoto: boolean       // true = personal photo; false = logo
  lockedDesign?: DesignId // if set, design picker is hidden and this design is used
  titleRequired?: boolean // if true, title field is marked required
  captions: [string, string]
}

export const ROLES: Role[] = [
  {
    id: 'attendee',
    label: 'Attendee',
    hasPhoto: true,
    lockedDesign: 'hero',
    captions: [
      `I'm attending ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. Join me! ${EVENT.hashtag}`,
      `Excited to be part of ${EVENT.name} — India's premier product festival. ${EVENT.dates} · ${EVENT.city} ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'speaker',
    label: 'Speaker',
    hasPhoto: true,
    lockedDesign: 'festival',
    titleRequired: true,
    captions: [
      `Thrilled to be speaking at ${EVENT.name} 2026! ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `See you on stage at ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'sponsor',
    label: 'Sponsor',
    hasPhoto: false,
    captions: [
      `Proud to sponsor ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `We're powering ${EVENT.name} 2026! Join us ${EVENT.dates} in ${EVENT.city}. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'community-partner',
    label: 'Community Partner',
    hasPhoto: false,
    lockedDesign: 'editorial',
    captions: [
      `Proud community partner of ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Our community is backing ${EVENT.name} 2026! Join us in Bangalore. ${EVENT.hashtag}`,
    ],
  },
]

export const DESIGNS: { id: DesignId; label: string; desc: string }[] = [
  { id: 'hero',      label: 'Hero',      desc: 'Bold full-bleed with gradient' },
  { id: 'editorial', label: 'Editorial', desc: 'Clean type-first layout' },
  { id: 'festival',  label: 'Festival',  desc: 'Vibrant celebration card' },
]
