import { prisma } from '@/lib/db/prisma';
import { createDeck, isBlackjack, scoreHand, shuffle, type Card } from '@/lib/casino/cards';
import { blackjackActionSchema, blackjackStartSchema } from '@/lib/validations/games';

function asCards(value: unknown) { return value as Card[]; }
function asDeck(value: unknown) { return value as Card[]; }

export async function startBlackjack(userId: string, input: unknown) {
  const { bet } = blackjackStartSchema.parse(input);
  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });
    if (wallet.balance < bet) throw new Error('SALDO_INSUFICIENTE');
    const deck = shuffle(createDeck());
    const playerCards = [deck.pop()!, deck.pop()!];
    const dealerCards = [deck.pop()!, deck.pop()!];
    const playerBJ = isBlackjack(playerCards);
    const dealerBJ = isBlackjack(dealerCards);
    let status: 'ACTIVE' | 'BLACKJACK' | 'PUSH' | 'DEALER_WIN' = 'ACTIVE';
    let payout = 0;
    if (playerBJ && dealerBJ) { status = 'PUSH'; payout = bet; }
    else if (playerBJ) { status = 'BLACKJACK'; payout = Math.floor(bet * 1.5); }
    else if (dealerBJ) { status = 'DEALER_WIN'; payout = 0; }
    const newWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: payout - bet }, ...(payout > bet ? { totalWon: { increment: payout } } : { totalLost: { increment: bet } }) },
    });
    await tx.walletTransaction.create({
      data: { walletId: wallet.id, type: 'BET', amount: -bet, balanceAfter: Math.max(0, wallet.balance - bet), description: 'Blackjack — apuesta' },
    });
    if (payout > 0) {
      await tx.walletTransaction.create({
        data: { walletId: wallet.id, type: status === 'PUSH' ? 'REFUND' : 'WIN', amount: payout, balanceAfter: newWallet.balance, description: `Blackjack — ${status}` },
      });
    }
    return tx.blackjackGame.create({ data: { userId, bet, playerCards, dealerCards, deck, status, payout } });
  });
}

export async function actBlackjack(userId: string, input: unknown) {
  const data = blackjackActionSchema.parse(input);
  return prisma.$transaction(async (tx) => {
    const game = await tx.blackjackGame.findFirst({ where: { id: data.gameId, userId, status: 'ACTIVE' } });
    if (!game) throw new Error('PARTIDA_NO_DISPONIBLE');
    let playerCards = asCards(game.playerCards);
    let dealerCards = asCards(game.dealerCards);
    let deck = asDeck(game.deck);
    let bet = game.bet;
    let status: any = 'ACTIVE';
    let payout = 0;
    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });

    if (data.action === 'double') {
      if (wallet.balance < bet) throw new Error('SALDO_INSUFICIENTE');
      bet *= 2;
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: game.bet }, totalLost: { increment: game.bet } } });
      await tx.walletTransaction.create({ data: { walletId: wallet.id, type: 'BET', amount: -game.bet, balanceAfter: wallet.balance - game.bet, description: 'Blackjack — doble' } });
      playerCards.push(deck.pop()!);
      if (scoreHand(playerCards) > 21) status = 'PLAYER_BUST';
      else data.action = 'stand';
    }

    if (data.action === 'hit') {
      playerCards.push(deck.pop()!);
      if (scoreHand(playerCards) > 21) status = 'PLAYER_BUST';
    }

    if (data.action === 'stand' && status === 'ACTIVE') {
      while (scoreHand(dealerCards) < 17) dealerCards.push(deck.pop()!);
      const playerScore = scoreHand(playerCards);
      const dealerScore = scoreHand(dealerCards);
      if (dealerScore > 21 || playerScore > dealerScore) { status = 'PLAYER_WIN'; payout = bet * 2; }
      else if (playerScore === dealerScore) { status = 'PUSH'; payout = bet; }
      else { status = 'DEALER_WIN'; payout = 0; }
    }

    if (status === 'PLAYER_BUST') payout = 0;
    if (status !== 'ACTIVE') {
      const current = await tx.wallet.findUniqueOrThrow({ where: { id: wallet.id } });
      const newWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: payout > 0 ? { balance: { increment: payout }, totalWon: { increment: payout } } : { totalLost: { increment: bet } },
      });
      if (payout > 0) await tx.walletTransaction.create({ data: { walletId: wallet.id, type: status === 'PUSH' ? 'REFUND' : 'WIN', amount: payout, balanceAfter: newWallet.balance, description: `Blackjack — ${status}` } });
      void current;
    }

    return tx.blackjackGame.update({ where: { id: game.id }, data: { bet, playerCards, dealerCards, deck, status, payout } });
  });
}
