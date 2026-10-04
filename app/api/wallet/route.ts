import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
export async function GET(){const user=await requireUser();return NextResponse.json({wallet:user.wallet});}
