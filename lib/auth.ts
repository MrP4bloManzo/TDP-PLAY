import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
type Claims = { id: string; role: 'USER' | 'ADMIN' }
export const sign = (c: Claims) => jwt.sign(c, process.env.AUTH_SECRET!, { expiresIn: '7d' })
export function auth(req: NextRequest): Claims | null {
  const t = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!t) return null
  try { return jwt.verify(t, process.env.AUTH_SECRET!) as Claims } catch { return null }
}
export const err = (m: string, s = 400) => NextResponse.json({ error: m }, { status: s })
const hits = new Map<string, { n: number; t: number }>()
export function limited(key: string, max = 10, ms = 60_000) {
  const now = Date.now(), e = hits.get(key)
  if (!e || now - e.t > ms) { hits.set(key, { n: 1, t: now }); return false }
  return ++e.n > max
}
