import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
export async function GET() { const matches = await prisma.match.findMany({ where: { status: { in: ['SCHEDULED','LIVE'] } }, include: { homeTeam: true, awayTeam: true, group: true, markets: true }, orderBy: { date: 'asc' } }); return NextResponse.json({ matches }); }
