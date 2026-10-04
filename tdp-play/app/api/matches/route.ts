import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function GET() {
  return NextResponse.json(await prisma.match.findMany({ orderBy: { date: 'asc' }, include: { home: true, away: true, markets: true } }))
}
