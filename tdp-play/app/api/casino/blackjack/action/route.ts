import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { auth, err } from '@/lib/auth'
import { debit, settle, balanceOf } from '@/services/wallet/walletService'
import { act, view, BJ } from '@/services/casino/blackjack'
export async function POST(req: NextRequest) {
  const u = auth(req); if (!u) return err('No autorizado', 401)
  const p = z.object({ gameId: z.string(), action: z.enum(['hit', 'stand', 'double']) }).safeParse(await req.json().catch(() => null))
  if (!p.success) return err('Datos inválidos')
  try {
    const out = await prisma.$transaction(async tx => {
      // bloqueo atómico: evita acciones paralelas sobre la misma partida
      const lock = await tx.blackjackGame.updateMany({ where: { id: p.data.gameId, userId: u.id, status: 'ACTIVE' }, data: { status: 'LOCK' } })
      if (!lock.count) throw new Error('Partida no encontrada o en proceso')
      const row = await tx.blackjackGame.findUniqueOrThrow({ where: { id: p.data.gameId } })
      const g = row.state as unknown as BJ
      if (p.data.action === 'double') await debit(tx, u.id, g.bet)
      act(g, p.data.action)
      await tx.blackjackGame.update({ where: { id: row.id }, data: { state: g as never, bet: g.bet, status: g.done ? 'DONE' : 'ACTIVE' } })
      const balance = g.done ? await settle(tx, u.id, 'BLACKJACK', g.bet, g.payout!) : await balanceOf(tx, u.id)
      return { id: row.id, game: view(g), balance }
    })
    return NextResponse.json(out)
  } catch (e) { return err((e as Error).message) }
}
