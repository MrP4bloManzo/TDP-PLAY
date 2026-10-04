import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
export async function GET(){const user=await requireUser();const transactions=await prisma.walletTransaction.findMany({where:{walletId:user.wallet?.id},orderBy:{createdAt:'desc'},take:100});return NextResponse.json({transactions});}
