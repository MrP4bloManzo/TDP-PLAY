import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { startBlackjack } from '@/services/blackjack.service';
export async function POST(request:Request){try{const user=await requireUser();const game=await startBlackjack(user.id,await request.json());return NextResponse.json({game},{status:201});}catch(error:any){return NextResponse.json({error:error?.issues?.[0]?.message??(error?.message==='SALDO_INSUFICIENTE'?'Saldo insuficiente.':'No se pudo iniciar la partida.')},{status:error?.message==='SALDO_INSUFICIENTE'?402:400});}}
