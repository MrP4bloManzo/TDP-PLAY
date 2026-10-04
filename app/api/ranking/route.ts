import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function GET() {
  const users = await prisma.user.findMany({ where: { role: 'USER' }, orderBy: { wallet: { balance: 'desc' } }, take: 10,
    select: { username: true, level: true, wallet: { select: { balance: true } }, _count: { select: { predictions: { where: { status: 'WON' } } } } } })
  return NextResponse.json(users.map((u, i) => ({ pos: i + 1, username: u.username, level: u.level, won: u._count.predictions, coins: u.wallet?.balance ?? 0 })))
}
