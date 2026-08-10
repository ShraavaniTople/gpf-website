export const EVENT = {
  name: 'The Great Product Festival',
  short: 'TGPF 2026',
  dates: '25–26 Sept 2026',
  city: 'Bangalore, India',
  theme: 'Infinite Builders',
  url: 'thegreatproductfestival.com',
  hashtag: '#TGPF2026',
}

export type RoleId =
  | 'attendee' | 'speaker' | 'mentor' | 'volunteer' | 'organizer'
  | 'sponsor' | 'exhibitor' | 'partner' | 'community-partner' | 'media'

export type DesignId = 'hero' | 'editorial' | 'festival'

export interface Role {
  id: RoleId
  label: string
  hasPhoto: boolean  // true = personal photo; false = logo
  captions: [string, string]
}

export const ROLES: Role[] = [
  {
    id: 'attendee',
    label: 'Attendee',
    hasPhoto: true,
    captions: [
      `I'm attending ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. Join me! ${EVENT.hashtag}`,
      `Excited to be part of ${EVENT.name} — India's premier product festival. ${EVENT.dates} · ${EVENT.city} ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'speaker',
    label: 'Speaker',
    hasPhoto: true,
    captions: [
      `Thrilled to be speaking at ${EVENT.name} 2026! ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `See you on stage at ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'mentor',
    label: 'Mentor',
    hasPhoto: true,
    captions: [
      `Mentoring at ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Looking forward to connecting with brilliant builders at ${EVENT.name} 2026. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'volunteer',
    label: 'Volunteer',
    hasPhoto: true,
    captions: [
      `Volunteering at ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Proud to volunteer at ${EVENT.name} — helping build India's product community. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'organizer',
    label: 'Organizer',
    hasPhoto: true,
    captions: [
      `Organizing ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Building ${EVENT.name} 2026 from the ground up. ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
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
    id: 'exhibitor',
    label: 'Exhibitor',
    hasPhoto: false,
    captions: [
      `Find us at ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Exhibiting at ${EVENT.name} 2026! Come see what we're building. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'partner',
    label: 'Partner',
    hasPhoto: false,
    captions: [
      `Partnering with ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `We're partnering with ${EVENT.name} 2026 to empower India's product builders. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'community-partner',
    label: 'Community Partner',
    hasPhoto: false,
    captions: [
      `Proud community partner of ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Our community is backing ${EVENT.name} 2026! Join us in Bangalore. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'media',
    label: 'Media',
    hasPhoto: false,
    captions: [
      `Covering ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Tune in as we cover ${EVENT.name} 2026 live from Bangalore. ${EVENT.hashtag}`,
    ],
  },
]

export const DESIGNS: { id: DesignId; label: string; desc: string }[] = [
  { id: 'hero',      label: 'Hero',      desc: 'Bold full-bleed with gradient' },
  { id: 'editorial', label: 'Editorial', desc: 'Clean type-first layout' },
  { id: 'festival',  label: 'Festival',  desc: 'Vibrant celebration card' },
]
