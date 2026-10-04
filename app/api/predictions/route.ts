import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { placePrediction } from '@/services/prediction.service';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request){try{const user=await requireUser();const prediction=await placePrediction(user.id,await request.json());return NextResponse.json({prediction},{status:201});}catch(error:any){const code=error?.message==='SALDO_INSUFICIENTE'?402:400;return NextResponse.json({error:error?.issues?.[0]?.message??error?.message??'No se pudo crear el pronóstico.'},{status:code});}}
export async function GET(){const user=await requireUser();const predictions=await prisma.prediction.findMany({where:{userId:user.id},orderBy:{createdAt:'desc'},include:{match:{include:{homeTeam:true,awayTeam:true}}}});return NextResponse.json({predictions});}
