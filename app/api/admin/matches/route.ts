import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
const schema=z.object({homeTeamId:z.string().min(1),awayTeamId:z.string().min(1),groupId:z.string().min(1),date:z.coerce.date(),stadium:z.string().min(2).max(120),status:z.enum(['SCHEDULED','LIVE','FINISHED','CANCELLED']).default('SCHEDULED'),homeScore:z.number().int().min(0).nullable().optional(),awayScore:z.number().int().min(0).nullable().optional()});
export async function GET(){await requireAdmin();const matches=await prisma.match.findMany({include:{homeTeam:true,awayTeam:true,group:true},orderBy:{date:'desc'},take:200});return NextResponse.json({matches});}
export async function POST(request:Request){const admin=await requireAdmin();try{const data=schema.parse(await request.json());const match=await prisma.match.create({data});await prisma.adminAction.create({data:{adminId:admin.id,action:'MATCH_CREATE',targetId:match.id,metadata:{...data,date:data.date instanceof Date ? data.date.toISOString() : data.date}}});return NextResponse.json({match},{status:201});}catch(error:any){return NextResponse.json({error:error?.message??'No se pudo crear el partido.'},{status:400});}}
