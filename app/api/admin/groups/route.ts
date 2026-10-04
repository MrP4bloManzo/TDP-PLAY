import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

const schema = z.object({ name: z.string().min(2).max(80), region: z.string().min(2).max(60) });

export async function GET() { await requireAdmin(); const groups=await prisma.group.findMany({include:{_count:{select:{teams:true,matches:true}}},orderBy:{name:'asc'}}); return NextResponse.json({groups}); }
export async function POST(request:Request){const admin=await requireAdmin();try{const data=schema.parse(await request.json());const group=await prisma.group.create({data});await prisma.adminAction.create({data:{adminId:admin.id,action:'GROUP_CREATE',targetId:group.id,metadata:data}});return NextResponse.json({group},{status:201});}catch(error:any){return NextResponse.json({error:error?.message??'No se pudo crear el grupo.'},{status:400});}}
