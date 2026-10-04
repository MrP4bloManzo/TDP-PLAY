import { Prisma } from '@prisma/client'
type Tx = Prisma.TransactionClient
/** Resta TDP Coins de forma atómica. Falla si el saldo no alcanza. */
export async function debit(tx: Tx, userId: string, amount: number) {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error('Monto inválido')
  const r = await tx.wallet.updateMany({ where: { userId, balance: { gte: amount } }, data: { balance: { decrement: amount } } })
  if (r.count === 0) throw new Error('Saldo insuficiente')
}
/** Acredita el premio y guarda el historial. stake = total apostado, payout = total devuelto. */
export async function settle(tx: Tx, userId: string, game: string, stake: number, payout: number) {
  const w = await tx.wallet.update({ where: { userId }, data: { balance: { increment: payout } } })
  await tx.walletTransaction.create({ data: { userId, game, stake, payout, net: payout - stake, balanceAfter: w.balance } })
  return w.balance
}
export const balanceOf = async (tx: Tx, userId: string) => (await tx.wallet.findUniqueOrThrow({ where: { userId } })).balance
