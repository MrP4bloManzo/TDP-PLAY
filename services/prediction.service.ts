import { prisma } from '@/lib/db/prisma';
import { predictionSchema } from '@/lib/validations/games';
import { debitWallet } from './wallet.service';

export async function placePrediction(userId: string, input: unknown) {
  const data = predictionSchema.parse(input);
  const match = await prisma.match.findUnique({ where: { id: data.matchId } });
  if (!match || match.status === 'FINISHED' || match.status === 'CANCELLED') throw new Error('PARTIDO_NO_DISPONIBLE');
  const market = await prisma.predictionMarket.findUnique({
    where: { matchId_market_selection: { matchId: data.matchId, market: data.market, selection: data.selection } },
  });
  if (!market || !market.active) throw new Error('MERCADO_NO_DISPONIBLE');
  const odds = market.odds;
  const code = `TDP-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
  await debitWallet(userId, data.stake, `Pronóstico ${code}`, code);
  return prisma.prediction.create({
    data: {
      code,
      userId,
      matchId: data.matchId,
      market: data.market,
      selection: data.selection,
      odds,
      stake: data.stake,
      potentialPrize: Math.floor(data.stake * odds),
    },
  });
}

export async function resolvePrediction(predictionId: string, won: boolean) {
  return prisma.$transaction(async (tx) => {
    const prediction = await tx.prediction.findUniqueOrThrow({ where: { id: predictionId } });
    if (prediction.status !== 'PENDING') return prediction;
    const status = won ? 'WON' : 'LOST';
    const updated = await tx.prediction.update({ where: { id: prediction.id }, data: { status, settledAt: new Date() } });
    if (won) {
      const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId: prediction.userId } });
      const newWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: prediction.potentialPrize }, totalWon: { increment: prediction.potentialPrize } },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'WIN',
          amount: prediction.potentialPrize,
          balanceAfter: newWallet.balance,
          description: `Premio ${prediction.code}`,
          reference: prediction.code,
        },
      });
    }
    return updated;
  });
}
