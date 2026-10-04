'use client'
import { ReactNode, useEffect, useState } from 'react'
import { api } from '@/lib/client'
export default function AuthGate({ children }: { children: (balance: number, setBalance: (n: number) => void) => ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null), [reg, setReg] = useState(false), [msg, setMsg] = useState('')
  const [f, setF] = useState({ email: '', password: '', name: '', username: '' })
  const load = () => api('/api/wallet').then(w => setBalance(w.balance)).catch(() => setBalance(null))
  useEffect(() => { load() }, [])
  const submit = async () => { try { const r = await api(reg ? '/api/auth/register' : '/api/auth/login', f); localStorage.setItem('tk', r.token); load() } catch (e) { setMsg((e as Error).message) } }
  const input = 'w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2'
  if (balance !== null) return <>{children(balance, setBalance)}</>
  return (
    <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-xl font-bold">{reg ? 'Crea tu cuenta' : 'Inicia sesión'}</h1>
      <p className="text-xs text-white/50">Demo: demo@tdpplay.local / Demo123!</p>
      {reg && <><input className={input} placeholder="Nombre" onChange={e => setF({ ...f, name: e.target.value })} /><input className={input} placeholder="Usuario" onChange={e => setF({ ...f, username: e.target.value })} /></>}
      <input className={input} placeholder="Correo" onChange={e => setF({ ...f, email: e.target.value })} />
      <input className={input} type="password" placeholder="Contraseña" onChange={e => setF({ ...f, password: e.target.value })} />
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <button onClick={submit} className="w-full rounded-lg bg-green-600 py-2 font-bold">{reg ? 'Registrarme' : 'Entrar'}</button>
      <button onClick={() => setReg(!reg)} className="w-full text-sm text-white/60">{reg ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}</button>
    </div>)
}
