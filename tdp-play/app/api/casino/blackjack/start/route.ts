import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { auth, err } from '@/lib/auth'
import { debit, settle, balanceOf } from '@/services/wallet/walletService'
import { deal, view } from '@/services/casino/blackjack'
export async function POST(req: NextRequest) {
  const u = auth(req); if (!u) return err('No autorizado', 401)
  const p = z.object({ bet: z.number().int().min(10).max(5000) }).safeParse(await req.json().catch(() => null))
  if (!p.success) return err('Apuesta inválida (10 a 5,000 TDP)')
  try {
    const out = await prisma.$transaction(async tx => {
      if (await tx.blackjackGame.findFirst({ where: { userId: u.id, status: { not: 'DONE' } } })) throw new Error('Ya tienes una partida activa')
      await debit(tx, u.id, p.data.bet)
      const g = deal(p.data.bet)
      const row = await tx.blackjackGame.create({ data: { userId: u.id, bet: g.bet, state: g as never, status: g.done ? 'DONE' : 'ACTIVE' } })
      const balance = g.done ? await settle(tx, u.id, 'BLACKJACK', g.bet, g.payout!) : await balanceOf(tx, u.id)
      return { id: row.id, game: view(g), balance }
    })
    return NextResponse.json(out)
  } catch (e) { return err((e as Error).message) }
}
