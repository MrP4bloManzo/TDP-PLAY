import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
const schema=z.object({name:z.string().min(2).max(80),shortName:z.string().min(2).max(5),badgeColor:z.string().regex(/^#[0-9a-fA-F]{6}$/),groupId:z.string().min(1)});
export async function GET(){await requireAdmin();const teams=await prisma.team.findMany({include:{group:true},orderBy:{points:'desc'}});return NextResponse.json({teams});}
export async function POST(request:Request){const admin=await requireAdmin();try{const data=schema.parse(await request.json());const team=await prisma.team.create({data});await prisma.adminAction.create({data:{adminId:admin.id,action:'TEAM_CREATE',targetId:team.id,metadata:data}});return NextResponse.json({team},{status:201});}catch(error:any){return NextResponse.json({error:error?.message??'No se pudo crear el equipo.'},{status:400});}}
