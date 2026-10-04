import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
export async function GET(){await requireAdmin();const [users,matches,predictions,blackjack,roulette,walletTransactions]=await Promise.all([prisma.user.count(),prisma.match.count(),prisma.prediction.count(),prisma.blackjackGame.count(),prisma.rouletteGame.count(),prisma.walletTransaction.count()]);return NextResponse.json({users,matches,predictions,blackjack,roulette,walletTransactions});}
