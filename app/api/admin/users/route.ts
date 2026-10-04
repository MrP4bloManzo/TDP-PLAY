import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

const createSchema=z.object({name:z.string().min(2).max(80),username:z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),email:z.string().email().max(160),password:z.string().min(8).max(72),role:z.enum(['USER','ADMIN']).default('USER')});

export async function GET(){await requireAdmin();const users=await prisma.user.findMany({select:{id:true,name:true,username:true,email:true,role:true,level:true,createdAt:true,wallet:{select:{balance:true}}},orderBy:{createdAt:'desc'},take:200});return NextResponse.json({users});}
export async function POST(request:Request){const admin=await requireAdmin();try{const input=createSchema.parse(await request.json());const passwordHash=await bcrypt.hash(input.password,12);const user=await prisma.user.create({data:{name:input.name,username:input.username,email:input.email,passwordHash,role:input.role,wallet:{create:{balance:10000}}},select:{id:true,name:true,username:true,email:true,role:true,level:true}});await prisma.adminAction.create({data:{adminId:admin.id,action:'USER_CREATE',targetId:user.id,metadata:{role:user.role}}});return NextResponse.json({user},{status:201});}catch(error:any){return NextResponse.json({error:error?.code==='P2002'?'Email o username ya registrado.':error?.issues?.[0]?.message??'No se pudo crear el usuario.'},{status:400});}}
