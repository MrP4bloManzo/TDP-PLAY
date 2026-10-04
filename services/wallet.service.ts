import { Prisma, WalletTransactionType } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

export async function ensureWallet(userId: string, tx: Prisma.TransactionClient | typeof prisma = prisma) {
  return tx.wallet.upsert({
    where: { userId },
    update: {},
    create: { userId, balance: 10_000 },
  });
}

export async function debitWallet(userId: string, amount: number, description: string, reference?: string) {
  return prisma.$transaction(async (tx) => {
    const wallet = await ensureWallet(userId, tx);
    if (wallet.balance < amount) throw new Error('SALDO_INSUFICIENTE');
    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount }, totalLost: { increment: amount } },
    });
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WalletTransactionType.BET,
        amount: -amount,
        balanceAfter: updated.balance,
        description,
        reference,
      },
    });
    return updated;
  });
}

export async function creditWallet(userId: string, amount: number, description: string, reference?: string) {
  return prisma.$transaction(async (tx) => {
    const wallet = await ensureWallet(userId, tx);
    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount }, totalWon: { increment: amount } },
    });
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WalletTransactionType.WIN,
        amount,
        balanceAfter: updated.balance,
        description,
        reference,
      },
    });
    return updated;
  });
}
