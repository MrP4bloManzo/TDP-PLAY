import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/db'
import { auth, err } from '@/lib/auth'
import { debit, balanceOf } from '@/services/wallet/walletService'
export async function POST(req: NextRequest) {
  const u = auth(req); if (!u) return err('No autorizado', 401)
  const p = z.object({ marketId: z.number().int(), stake: z.number().int().min(10).max(5000) }).safeParse(await req.json().catch(() => null))
  if (!p.success) return err('Datos inválidos')
  try {
    const out = await prisma.$transaction(async tx => {
      const mk = await tx.predictionMarket.findUnique({ where: { id: p.data.marketId }, include: { match: true } })
      if (!mk || mk.match.status !== 'SCHEDULED' || mk.match.date < new Date()) throw new Error('Mercado no disponible')
      await debit(tx, u.id, p.data.stake) // el saldo solo se modifica en backend
      const pr = await tx.prediction.create({ data: { code: randomUUID(), userId: u.id, marketId: mk.id, stake: p.data.stake, odds: mk.odds } })
      const code = `TDP-${new Date().getFullYear()}-${String(pr.id).padStart(6, '0')}`
      await tx.prediction.update({ where: { id: pr.id }, data: { code } })
      return { code, potential: Math.floor(p.data.stake * mk.odds), balance: await balanceOf(tx, u.id) }
    })
    return NextResponse.json(out)
  } catch (e) { return err((e as Error).message) }
}
