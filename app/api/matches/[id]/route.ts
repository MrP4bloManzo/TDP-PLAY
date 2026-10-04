import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) { const {id}=await params; const match=await prisma.match.findUnique({where:{id},include:{homeTeam:true,awayTeam:true,group:true,markets:true}}); if(!match)return NextResponse.json({error:'No encontrado'},{status:404}); return NextResponse.json({match}); }
