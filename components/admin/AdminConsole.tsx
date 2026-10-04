'use client';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function AdminConsole(){
  const [users,setUsers]=useState<any[]>([]); const [groups,setGroups]=useState<any[]>([]); const [teams,setTeams]=useState<any[]>([]); const [msg,setMsg]=useState('');
  const [group,setGroup]=useState({name:'',region:''}); const [team,setTeam]=useState({name:'',shortName:'',badgeColor:'#16a34a',groupId:''});
  const load=async()=>{const [u,g,t]=await Promise.all([fetch('/api/admin/users').then(r=>r.json()),fetch('/api/admin/groups').then(r=>r.json()),fetch('/api/admin/teams').then(r=>r.json())]);setUsers(u.users??[]);setGroups(g.groups??[]);setTeams(t.teams??[]);};
  useEffect(()=>{void load();},[]);
  const groupOptions=useMemo(()=>groups,[groups]);
  async function createGroup(){const r=await fetch('/api/admin/groups',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(group)});const d=await r.json();setMsg(r.ok?'Grupo creado.':d.error??'Error');if(r.ok){setGroup({name:'',region:''});await load();}}
  async function createTeam(){const r=await fetch('/api/admin/teams',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(team)});const d=await r.json();setMsg(r.ok?'Equipo creado.':d.error??'Error');if(r.ok){setTeam({name:'',shortName:'',badgeColor:'#16a34a',groupId:team.groupId});await load();}}
  async function remove(kind:string,id:string){const r=await fetch(`/api/admin/${kind}/${id}`,{method:'DELETE'});const d=await r.json();setMsg(r.ok?'Eliminado.':d.error??'No se pudo eliminar.');if(r.ok)await load();}
  async function toggleRole(user:any){const next=user.role==='ADMIN'?'USER':'ADMIN';const r=await fetch(`/api/admin/users/${user.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:next})});const d=await r.json();setMsg(r.ok?`Rol actualizado: ${next}`:d.error??'No se pudo actualizar.');if(r.ok)await load();}
  return <div className="mt-6 grid gap-5 lg:grid-cols-2">
    <Card><CardHeader><CardTitle>Crear grupo</CardTitle></CardHeader><CardContent className="grid gap-2"><Input placeholder="Nombre" value={group.name} onChange={e=>setGroup({...group,name:e.target.value})}/><Input placeholder="Región" value={group.region} onChange={e=>setGroup({...group,region:e.target.value})}/><Button onClick={createGroup}>Crear grupo</Button></CardContent></Card>
    <Card><CardHeader><CardTitle>Crear equipo</CardTitle></CardHeader><CardContent className="grid gap-2"><Input placeholder="Nombre" value={team.name} onChange={e=>setTeam({...team,name:e.target.value})}/><Input placeholder="Abreviatura" value={team.shortName} onChange={e=>setTeam({...team,shortName:e.target.value.toUpperCase()})}/><Input type="color" value={team.badgeColor} onChange={e=>setTeam({...team,badgeColor:e.target.value})}/><select value={team.groupId} onChange={e=>setTeam({...team,groupId:e.target.value})} className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white"><option value="">Selecciona grupo</option>{groupOptions.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select><Button onClick={createTeam} disabled={!team.groupId}>Crear equipo</Button></CardContent></Card>
    <Card><CardHeader><CardTitle>Usuarios</CardTitle></CardHeader><CardContent className="space-y-2">{users.slice(0,12).map(u=><div key={u.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[.03] p-3"><div><div className="font-semibold">{u.username}</div><div className="text-xs text-white/35">{u.role} · {u.wallet?.balance??0} TDP</div></div><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={()=>toggleRole(u)}>Cambiar rol</Button><Button size="sm" variant="danger" onClick={()=>remove('users',u.id)}>Eliminar</Button></div></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle>Equipos</CardTitle></CardHeader><CardContent className="space-y-2">{teams.slice(0,12).map(t=><div key={t.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[.03] p-3"><div><div className="font-semibold">{t.name}</div><div className="text-xs text-white/35">{t.group?.name}</div></div><Button size="sm" variant="danger" onClick={()=>remove('teams',t.id)}>Eliminar</Button></div>)}</CardContent></Card>
    {msg&&<div className="lg:col-span-2 rounded-xl bg-green-500/10 p-3 text-sm text-green-300">{msg}</div>}
  </div>;
}
