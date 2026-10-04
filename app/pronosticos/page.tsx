'use client'
import { useState } from 'react'
import { matches, fmt, Market } from '@/lib/data'
import { useStore } from '@/lib/store'
import { placePrediction, simulateMatch } from '@/lib/play'
const ST = { PENDING: 'Pendiente', WON: 'Ganado', LOST: 'Perdido' }
export default function Pronosticos() {
  const s = useStore()
  const [sel, setSel] = useState<{ m: number; k: Market } | null>(null), [stake, setStake] = useState(100), [msg, setMsg] = useState('')
  const m = sel && matches.find(x => x.id === sel.m)
  const confirm = () => { if (!sel) return; try { setMsg(`Pronóstico ${placePrediction(sel.m, sel.k, stake)} confirmado`); setSel(null) } catch (e) { setMsg((e as Error).message) } }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="space-y-4">
        <h1 className="text-2xl font-extrabold">Pronósticos <span className="ml-2 rounded bg-red-700 px-2 py-0.5 text-xs">SIMULACIÓN</span></h1>
        {matches.map(x => { const fin = s.finished[x.id]; return (
          <article key={x.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex justify-between text-xs text-white/50"><span>{x.group} · {x.stadium}</span><span>{fmt(x.date)}</span></div>
            <div className="my-2 text-lg font-bold">{x.home} {fin ? `${fin[0]} - ${fin[1]}` : 'vs'} {x.away}</div>
            {fin ? <p className="text-sm text-white/50">Finalizado (resultado simulado)</p> : <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{x.markets.map(k => (
                <button key={k.id} onClick={() => setSel({ m: x.id, k })} className={`rounded-lg px-2 py-2 text-sm ${sel?.k.id === k.id ? 'bg-green-600' : 'bg-black/40 hover:bg-green-900'}`}>
                  <span className="block text-xs text-white/60">{k.label}</span><b>{k.odds.toFixed(2)}</b></button>))}</div>
              <button onClick={() => simulateMatch(x.id)} className="mt-3 text-xs text-white/50 underline">Simular partido</button></>}
          </article>) })}
      </section>
      <aside className="h-fit space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 lg:sticky lg:top-28">
        <h2 className="font-bold">Mi boleto</h2>
        {sel && m ? <div className="space-y-2 text-sm">
          <p>{m.home} vs {m.away}</p><p className="text-white/60">{sel.k.label} · cuota {sel.k.odds.toFixed(2)}</p>
          <input type="number" min={10} max={5000} step={10} value={stake} onChange={e => setStake(+e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2" />
          <p>Premio potencial: <b className="text-green-400">{Math.floor(stake * sel.k.odds)} TDP</b></p>
          <button onClick={confirm} className="w-full rounded-lg bg-red-600 py-2 font-bold">CONFIRMAR PRONÓSTICO</button>
        </div> : <p className="text-sm text-white/50">Elige una cuota para armar tu boleto.</p>}
        {msg && <p className="text-sm text-green-400">{msg}</p>}
        <h3 className="pt-2 text-sm font-bold">Mis pronósticos</h3>
        {s.preds.length === 0 ? <p className="text-sm text-white/50">Aún no tienes pronósticos.</p> : s.preds.slice(0, 10).map(p => (
          <div key={p.code} className="flex justify-between border-t border-white/10 pt-2 text-xs"><span>{p.code}<br /><span className="text-white/50">{p.label} · {p.stake} TDP</span></span>
            <span className={p.status === 'WON' ? 'text-green-400' : p.status === 'LOST' ? 'text-red-400' : 'text-white/60'}>{ST[p.status]}</span></div>))}
      </aside>
    </div>)
}
