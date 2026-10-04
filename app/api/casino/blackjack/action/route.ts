import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { actBlackjack } from '@/services/blackjack.service';
export async function POST(request:Request){try{const user=await requireUser();const game=await actBlackjack(user.id,await request.json());return NextResponse.json({game});}catch(error:any){return NextResponse.json({error:error?.issues?.[0]?.message??error?.message??'No se pudo ejecutar la acción.'},{status:400});}}
