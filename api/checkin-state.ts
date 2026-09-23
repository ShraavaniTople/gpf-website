import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    // Single O(1) call — all checked-in emails stored in one Redis set
    const checkedIn = (await kv.smembers('checkins')) as string[]
    return res.status(200).json({ checkedIn: checkedIn ?? [] })
  } catch {
    return res.status(200).json({ checkedIn: [] })
  }
}
