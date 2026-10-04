import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
const schema=z.object({name:z.string().min(2).max(80).optional(),region:z.string().min(2).max(60).optional()});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const admin=await requireAdmin();const {id}=await params;try{const data=schema.parse(await request.json());const group=await prisma.group.update({where:{id},data});await prisma.adminAction.create({data:{adminId:admin.id,action:'GROUP_UPDATE',targetId:id,metadata:data}});return NextResponse.json({group});}catch(error:any){return NextResponse.json({error:error?.message??'No se pudo actualizar el grupo.'},{status:400});}}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){const admin=await requireAdmin();const {id}=await params;try{await prisma.group.delete({where:{id}});await prisma.adminAction.create({data:{adminId:admin.id,action:'GROUP_DELETE',targetId:id}});return NextResponse.json({ok:true});}catch(error:any){return NextResponse.json({error:error?.message??'No se puede eliminar el grupo.'},{status:409});}}
