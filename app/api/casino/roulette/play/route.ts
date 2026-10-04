import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { playRoulette } from '@/services/roulette.service';
export async function POST(request:Request){try{const user=await requireUser();const game=await playRoulette(user.id,await request.json());return NextResponse.json({game},{status:201});}catch(error:any){return NextResponse.json({error:error?.issues?.[0]?.message??(error?.message==='SALDO_INSUFICIENTE'?'Saldo insuficiente.':'No se pudo jugar.')},{status:error?.message==='SALDO_INSUFICIENTE'?402:400});}}
