import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth, err } from '@/lib/auth'
import { finishMatch } from '@/services/sports/betEngine'
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = auth(req); if (!u || u.role !== 'ADMIN') return err('Solo administradores', 403)
  const p = z.object({ homeGoals: z.number().int().min(0).max(20), awayGoals: z.number().int().min(0).max(20) }).safeParse(await req.json().catch(() => null))
  if (!p.success) return err('Datos inválidos')
  try { return NextResponse.json({ settled: await finishMatch(Number((await params).id), p.data.homeGoals, p.data.awayGoals) }) }
  catch (e) { return err((e as Error).message) }
}
