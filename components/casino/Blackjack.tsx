'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/client'
type C = { r: string; s: string } | null
type G = { player: C[]; dealer: C[]; playerScore: number; dealerScore: number | null; bet: number; done: boolean; result?: string; payout?: number }
const Card = ({ c }: { c: C }) => (
  <div className={`card-in flex h-24 w-16 flex-col items-center justify-center rounded-lg border text-lg font-bold shadow-lg ${c ? 'bg-white ' + ('♥♦'.includes(c.s) ? 'text-red-600' : 'text-black') : 'bg-green-900 border-green-500'}`}>
    {c ? <><span>{c.r}</span><span>{c.s}</span></> : <span className="text-green-500">?</span>}
  </div>)
export default function Blackjack() {
  const [logged, setLogged] = useState(false), [balance, setBalance] = useState<number | null>(null)
  const [bet, setBet] = useState(100), [id, setId] = useState(''), [g, setG] = useState<G | null>(null), [msg, setMsg] = useState('')
  const [f, setF] = useState({ email: '', password: '', name: '', username: '' }), [reg, setReg] = useState(false)
  const load = () => api('/api/wallet').then(w => { setLogged(true); setBalance(w.balance) }).catch(() => setLogged(false))
  useEffect(() => { load() }, [])
  const run = async (fn: () => Promise<any>) => { setMsg(''); try { const r = await fn(); setId(r.id); setG(r.game); setBalance(r.balance) } catch (e) { setMsg((e as Error).message) } }
  const login = async () => { try { const r = await api(reg ? '/api/auth/register' : '/api/auth/login', f); localStorage.setItem('tk', r.token); load() } catch (e) { setMsg((e as Error).message) } }
  const input = 'w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2'
  if (!logged) return (
    <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-xl font-bold">{reg ? 'Crea tu cuenta' : 'Inicia sesión'}</h1>
      <p className="text-xs text-white/50">Demo: demo@tdpplay.local / Demo123!</p>
      {reg && <><input className={input} placeholder="Nombre" onChange={e => setF({ ...f, name: e.target.value })} /><input className={input} placeholder="Usuario" onChange={e => setF({ ...f, username: e.target.value })} /></>}
      <input className={input} placeholder="Correo" onChange={e => setF({ ...f, email: e.target.value })} />
      <input className={input} type="password" placeholder="Contraseña" onChange={e => setF({ ...f, password: e.target.value })} />
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <button onClick={login} className="w-full rounded-lg bg-green-600 py-2 font-bold">{reg ? 'Registrarme' : 'Entrar'}</button>
      <button onClick={() => setReg(!reg)} className="w-full text-sm text-white/60">{reg ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}</button>
    </div>)
  const active = g && !g.done
  return (
    <div className="felt mx-auto max-w-2xl space-y-6 rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-extrabold">Blackjack</h1>
        <div className="rounded-lg bg-black/50 px-3 py-1 text-sm">Saldo virtual: <b className="text-green-400">{balance?.toLocaleString()} TDP</b></div></div>
      {g && <>
        <div><p className="mb-2 text-sm text-white/60">Dealer {g.dealerScore !== null && `· ${g.dealerScore}`}</p><div className="flex gap-2">{g.dealer.map((c, i) => <Card key={i} c={c} />)}</div></div>
        <div><p className="mb-2 text-sm text-white/60">Tú · {g.playerScore} · Apuesta {g.bet} TDP</p><div className="flex flex-wrap gap-2">{g.player.map((c, i) => <Card key={i} c={c} />)}</div></div>
      </>}
      {g?.done && <p className="text-center text-xl font-bold">{g.result} {g.payout ? `· +${g.payout - g.bet} TDP` : `· −${g.bet} TDP`}</p>}
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      {active ? (
        <div className="grid grid-cols-3 gap-3">
          {(['hit', 'stand', 'double'] as const).map(a => <button key={a} onClick={() => run(() => api('/api/casino/blackjack/action', { gameId: id, action: a }))}
            disabled={a === 'double' && g!.player.length !== 2} className="rounded-lg bg-green-600 py-3 font-bold disabled:opacity-30">{{ hit: 'PEDIR', stand: 'PLANTARSE', double: 'DOBLAR' }[a]}</button>)}
        </div>) : (
        <div className="flex gap-3"><input type="number" min={10} max={5000} step={10} value={bet} onChange={e => setBet(+e.target.value)} className={input + ' max-w-32'} />
          <button onClick={() => run(() => api('/api/casino/blackjack/start', { bet }))} className="flex-1 rounded-lg bg-red-600 py-3 font-bold">REPARTIR</button></div>)}
      <p className="text-center text-xs text-white/40">Simulación · Las TDP Coins no tienen valor monetario</p>
    </div>)
}
