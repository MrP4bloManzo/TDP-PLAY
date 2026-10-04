import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { resolvePrediction } from '@/services/prediction.service';
const schema=z.object({homeTeamId:z.string().min(1).optional(),awayTeamId:z.string().min(1).optional(),groupId:z.string().min(1).optional(),date:z.coerce.date().optional(),stadium:z.string().min(2).max(120).optional(),status:z.enum(['SCHEDULED','LIVE','FINISHED','CANCELLED']).optional(),homeScore:z.number().int().min(0).nullable().optional(),awayScore:z.number().int().min(0).nullable().optional()});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const admin=await requireAdmin();const {id}=await params;try{const data=schema.parse(await request.json());const match=await prisma.match.update({where:{id},data});
    if(data.status==='FINISHED' && data.homeScore!==undefined && data.awayScore!==undefined && data.homeScore!==null && data.awayScore!==null){
      const pending=await prisma.prediction.findMany({where:{matchId:id,status:'PENDING'}});
      const winner=data.homeScore>data.awayScore?'HOME':data.homeScore<data.awayScore?'AWAY':'DRAW';
      const total=data.homeScore+data.awayScore;
      const btts=data.homeScore>0 && data.awayScore>0?'YES':'NO';
      for(const prediction of pending){
        const won=prediction.market==='winner'?prediction.selection===winner:prediction.market==='goals'?((prediction.selection==='OVER_2_5'&&total>2.5)||(prediction.selection==='UNDER_2_5'&&total<2.5)):prediction.market==='btts'?prediction.selection===btts:prediction.market==='exact'?prediction.selection===`${data.homeScore}-${data.awayScore}`:false;
        await resolvePrediction(prediction.id,won);
      }
    }
    await prisma.adminAction.create({data:{adminId:admin.id,action:'MATCH_UPDATE',targetId:id,metadata:{...data,date:data.date instanceof Date ? data.date.toISOString() : data.date}}});return NextResponse.json({match});}catch(error:any){return NextResponse.json({error:error?.message??'No se pudo actualizar el partido.'},{status:400});}}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){const admin=await requireAdmin();const {id}=await params;try{await prisma.match.delete({where:{id}});await prisma.adminAction.create({data:{adminId:admin.id,action:'MATCH_DELETE',targetId:id}});return NextResponse.json({ok:true});}catch(error:any){return NextResponse.json({error:error?.message??'No se puede eliminar el partido.'},{status:409});}}
