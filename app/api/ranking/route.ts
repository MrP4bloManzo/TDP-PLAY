import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
export async function GET(){const ranking=await prisma.user.findMany({where:{role:'USER'},include:{wallet:true},orderBy:{wallet:{balance:'desc'}},take:10});return NextResponse.json({ranking});}
