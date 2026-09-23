import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    // Scan all keys matching ci:* (checked-in emails)
    const keys: string[] = []
    let cursor = 0
    do {
      const [nextCursor, batch] = await kv.scan(cursor, { match: 'ci:*', count: 200 })
      keys.push(...(batch as string[]))
      cursor = nextCursor as number
    } while (cursor !== 0)

    // Strip the "ci:" prefix to get back plain email strings
    const checkedIn = keys.map(k => k.replace(/^ci:/, ''))
    return res.status(200).json({ checkedIn })
  } catch {
    // KV not yet configured — return empty so UI falls back gracefully
    return res.status(200).json({ checkedIn: [] })
  }
}
