import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth, err } from '@/lib/auth'
export async function GET(req: NextRequest) {
  const u = auth(req); if (!u) return err('No autorizado', 401)
  return NextResponse.json(await prisma.prediction.findMany({ where: { userId: u.id }, orderBy: { id: 'desc' }, take: 50, include: { market: { include: { match: { include: { home: true, away: true } } } } } }))
}
