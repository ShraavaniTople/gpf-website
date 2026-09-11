export const EVENT = {
  name: 'The Great Product Festival',
  short: 'TGPF 2026',
  dates: '25–26 Sept 2026',
  city: 'RMZ Ecoworld, Bangalore, India',
  theme: 'Infinite Builders',
  url: 'thegreatproductfestival.com',
  hashtag: '#TGPF2026',
}

export type RoleId = 'attendee' | 'speaker' | 'mentor' | 'judge' | 'sponsor' | 'community-partner' | 'organizer'

export type DesignId = 'hero' | 'editorial' | 'festival'

export interface Role {
  id: RoleId
  label: string
  chip: string            // personalized text shown on the card
  hasPhoto: boolean       // true = personal photo; false = logo
  lockedDesign?: DesignId // if set, design picker is hidden and this design is used
  titleRequired?: boolean // if true, title field is marked required
  captions: [string, string]
}

export const ROLES: Role[] = [
  {
    id: 'attendee',
    label: 'Attendee',
    chip: "I'M ATTENDING",
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
    chip: "I'M SPEAKING",
    hasPhoto: true,
    lockedDesign: 'festival',
    titleRequired: true,
    captions: [
      `Thrilled to be speaking at ${EVENT.name} 2026! ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `See you on stage at ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'mentor',
    label: 'Mentor',
    chip: "I'M MENTORING",
    hasPhoto: true,
    lockedDesign: 'festival',
    titleRequired: true,
    captions: [
      `Excited to be mentoring at ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Giving back to the builder community at ${EVENT.name} 2026. ${EVENT.dates} · Bangalore ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'judge',
    label: 'Judge',
    chip: "I'M JUDGING",
    hasPhoto: true,
    lockedDesign: 'festival',
    titleRequired: true,
    captions: [
      `Honoured to be judging at ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Looking forward to seeing the best builders at ${EVENT.name} 2026. ${EVENT.dates} · Bangalore ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'sponsor',
    label: 'Sponsor',
    chip: "WE'RE SPONSORING",
    hasPhoto: false,
    captions: [
      `Proud to sponsor ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `We're powering ${EVENT.name} 2026! Join us ${EVENT.dates} in ${EVENT.city}. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'community-partner',
    label: 'Community Partner',
    chip: "WE'RE A PARTNER",
    hasPhoto: false,
    lockedDesign: 'editorial',
    captions: [
      `Proud community partner of ${EVENT.name} 2026 — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Our community is backing ${EVENT.name} 2026! Join us at RMZ Ecoworld, Bangalore. ${EVENT.hashtag}`,
    ],
  },
  {
    id: 'organizer',
    label: 'Organizer',
    chip: "I'M ORGANIZING",
    hasPhoto: true,
    lockedDesign: 'festival',
    titleRequired: true,
    captions: [
      `Building ${EVENT.name} 2026 for India's product community — ${EVENT.dates}, ${EVENT.city}. ${EVENT.hashtag}`,
      `Part of the team bringing ${EVENT.name} 2026 to life! ${EVENT.dates} · RMZ Ecoworld, Bangalore. ${EVENT.hashtag}`,
    ],
  },
]

export const DESIGNS: { id: DesignId; label: string; desc: string }[] = [
  { id: 'hero',      label: 'Hero',      desc: 'Bold full-bleed with gradient' },
  { id: 'editorial', label: 'Editorial', desc: 'Clean type-first layout' },
  { id: 'festival',  label: 'Festival',  desc: 'Vibrant celebration card' },
]
