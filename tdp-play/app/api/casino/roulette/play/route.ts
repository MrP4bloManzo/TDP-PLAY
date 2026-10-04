import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { auth, err } from '@/lib/auth'
import { debit, settle } from '@/services/wallet/walletService'
import { spin, payoutOf, colorOf } from '@/services/casino/roulette'
const B = z.object({ type: z.enum(['red','black','even','odd','low','high','dozen','column','number']), value: z.number().int().min(0).max(36).optional(), amount: z.number().int().min(10).max(5000) })
export async function POST(req: NextRequest) {
  const u = auth(req); if (!u) return err('No autorizado', 401)
  const p = z.object({ bets: z.array(B).min(1).max(10) }).safeParse(await req.json().catch(() => null))
  if (!p.success) return err('Apuestas inválidas')
  for (const b of p.data.bets) {
    if (b.type === 'number' && b.value === undefined) return err('Falta el número')
    if ((b.type === 'dozen' || b.type === 'column') && !(b.value && b.value <= 3)) return err('Valor inválido')
  }
  try {
    const out = await prisma.$transaction(async tx => {
      const stake = p.data.bets.reduce((s, b) => s + b.amount, 0)
      await debit(tx, u.id, stake)
      const n = spin(), payout = p.data.bets.reduce((s, b) => s + payoutOf(b, n), 0)
      const balance = await settle(tx, u.id, 'RULETA', stake, payout)
      await tx.rouletteGame.create({ data: { userId: u.id, bets: p.data.bets, number: n, net: payout - stake } })
      return { number: n, color: colorOf(n), stake, payout, balance }
    })
    return NextResponse.json(out)
  } catch (e) { return err((e as Error).message) }
}
