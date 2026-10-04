import { prisma } from '@/lib/db/prisma';
import { rouletteSchema } from '@/lib/validations/games';
import { resolveRoulette } from '@/lib/casino/roulette';

export async function playRoulette(userId: string, input: unknown) {
  const data = rouletteSchema.parse(input);
  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });
    if (wallet.balance < data.bet) throw new Error('SALDO_INSUFICIENTE');
    const winningNumber = Math.floor(Math.random() * 37);
    const multiplier = resolveRoulette(data.selectionType, data.selectionValue, winningNumber);
    const won = multiplier > 0;
    const payout = won ? data.bet * (multiplier + 1) : 0;
    const newWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: won ? { balance: { increment: payout - data.bet }, totalWon: { increment: payout } } : { balance: { decrement: data.bet }, totalLost: { increment: data.bet } },
    });
    await tx.walletTransaction.create({ data: { walletId: wallet.id, type: 'BET', amount: -data.bet, balanceAfter: Math.max(0, wallet.balance - data.bet), description: 'Ruleta — apuesta' } });
    if (won) await tx.walletTransaction.create({ data: { walletId: wallet.id, type: 'WIN', amount: payout, balanceAfter: newWallet.balance, description: `Ruleta — premio x${multiplier + 1}` } });
    return tx.rouletteGame.create({ data: { userId, bet: data.bet, selectionType: data.selectionType, selectionValue: data.selectionValue, winningNumber, won, payout } });
  });
}
