'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() { const router=useRouter(); const [email,setEmail]=useState('demo@tdpplay.local'); const [password,setPassword]=useState('Demo123!'); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError('');const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});const d=await r.json();setLoading(false);if(!r.ok)return setError(d.error??'No se pudo iniciar sesión');router.push(d.user.role==='ADMIN'?'/admin':'/dashboard');router.refresh();}
  return <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(34,197,94,.14),transparent_30%),#050b08] p-4"><Card className="w-full max-w-md"><CardHeader><CardTitle className="text-2xl">Iniciar sesión</CardTitle><p className="text-sm text-white/50">Cuenta demo: demo@tdpplay.local / Demo123!</p></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4"><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo"/><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña"/>{error&&<div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}<Button type="submit" disabled={loading}>{loading?'Entrando...':'Entrar'}</Button><div className="flex justify-between text-xs text-white/45"><Link href="/forgot-password" className="hover:text-white">¿Olvidaste tu contraseña?</Link><Link href="/register" className="text-green-400">Crear cuenta</Link></div></form></CardContent></Card></div>; }
