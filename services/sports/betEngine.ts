import { prisma } from '@/lib/db'
import { settle } from '../wallet/walletService'
const wins = (t: string, s: string, h: number, a: number) =>
  t === '1X2' ? s === (h > a ? 'HOME' : h < a ? 'AWAY' : 'DRAW') :
  t === 'OU25' ? s === (h + a > 2 ? 'OVER' : 'UNDER') :
  t === 'BTTS' ? s === (h > 0 && a > 0 ? 'YES' : 'NO') : false
/** Finaliza el partido (resultado simulado) y liquida todos los pronósticos pendientes. */
export function finishMatch(matchId: number, hg: number, ag: number) {
  return prisma.$transaction(async tx => {
    const m = await tx.match.updateMany({ where: { id: matchId, status: { not: 'FINISHED' } }, data: { status: 'FINISHED', homeGoals: hg, awayGoals: ag } })
    if (!m.count) throw new Error('Partido inexistente o ya finalizado')
    const preds = await tx.prediction.findMany({ where: { status: 'PENDING', market: { matchId } }, include: { market: true } })
    for (const p of preds) {
      const won = wins(p.market.type, p.market.selection, hg, ag), payout = won ? Math.floor(p.stake * p.odds) : 0
      await tx.prediction.update({ where: { id: p.id }, data: { status: won ? 'WON' : 'LOST', payout } })
      await settle(tx, p.userId, 'PRONÓSTICO', p.stake, payout)
    }
    return preds.length
  })
}
