'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { roulettePlay } from '@/lib/play'
type Bet = { type: string; value?: number; amount: number }
const OPTS: [string, string, number?][] = [['red', 'Rojo'], ['black', 'Negro'], ['even', 'Par'], ['odd', 'Impar'], ['low', '1-18'], ['high', '19-36'],
  ['dozen', '1ª docena', 1], ['dozen', '2ª docena', 2], ['dozen', '3ª docena', 3], ['column', 'Col. 1', 1], ['column', 'Col. 2', 2], ['column', 'Col. 3', 3]]
const BG: Record<string, string> = { red: 'bg-red-600', black: 'bg-zinc-800', green: 'bg-green-600' }
export default function Roulette() {
  const { balance } = useStore()
  const [shown, setShown] = useState<number | null>(null)
  const [chip, setChip] = useState(50), [bets, setBets] = useState<Bet[]>([]), [num, setNum] = useState(17)
  const [spinning, setSpinning] = useState(false), [rot, setRot] = useState(0), [res, setRes] = useState<any>(null), [msg, setMsg] = useState('')
  const total = bets.reduce((s, b) => s + b.amount, 0)
  const add = (type: string, value?: number) => setBets(b => [...b, { type, value, amount: chip }])
  const spin = async () => {
    setMsg(''); setRes(null)
    try {
      setShown(balance)
      const r = roulettePlay(bets as any)
      setSpinning(true); setRot(x => x + 1440 + Math.floor(Math.random() * 360))
      setTimeout(() => { setRes(r); setShown(null); setBets([]); setSpinning(false) }, 3200)
    } catch (e) { setShown(null); setMsg((e as Error).message) }
  }
  return (
    <div className="felt mx-auto max-w-2xl space-y-5 rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-extrabold">Ruleta europea</h1>
        <div className="rounded-lg bg-black/50 px-3 py-1 text-sm">Saldo virtual: <b className="text-green-400">{(shown ?? balance).toLocaleString()} TDP</b></div></div>
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-44 w-44 rounded-full border-4 border-yellow-600/70" style={{ background: 'conic-gradient(#16a34a 0 10deg,#dc2626 10deg 20deg,#27272a 20deg 30deg,#dc2626 30deg 40deg,#27272a 40deg 50deg,#dc2626 50deg 60deg,#27272a 60deg 70deg,#dc2626 70deg 80deg,#27272a 80deg 90deg,#dc2626 90deg 100deg,#27272a 100deg 110deg,#dc2626 110deg 120deg,#27272a 120deg 360deg)',
          transform: `rotate(${rot}deg)`, transition: spinning ? 'transform 3s cubic-bezier(.1,.7,.2,1)' : 'none' }} />
        {res && <div className={`rounded-full px-5 py-2 text-2xl font-extrabold ${BG[res.color]}`}>{res.number}</div>}
        {res && <p className="font-bold">{res.payout > res.stake ? `Ganaste +${res.payout - res.stake} TDP` : res.payout === res.stake ? 'Recuperas tu apuesta' : `Perdiste ${res.stake - res.payout} TDP`}</p>}
      </div>
      <div className="flex items-center gap-2 text-sm">Ficha: {[10, 50, 100, 500].map(v => <button key={v} onClick={() => setChip(v)} className={`rounded-full px-3 py-1 ${chip === v ? 'bg-green-600' : 'bg-black/40'}`}>{v}</button>)}</div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{OPTS.map(([t, l, v]) => <button key={l} onClick={() => add(t, v)} disabled={spinning} className="rounded-lg bg-black/40 py-2 text-sm hover:bg-green-700">{l}</button>)}</div>
      <div className="flex gap-2"><input type="number" min={0} max={36} value={num} onChange={e => setNum(Math.min(36, Math.max(0, +e.target.value)))} className="w-20 rounded-lg border border-white/10 bg-black/40 px-3 py-2" />
        <button onClick={() => add('number', num)} disabled={spinning} className="rounded-lg bg-black/40 px-4 hover:bg-green-700">Apostar al {num}</button></div>
      <p className="text-sm text-white/70">Apuestas: {bets.length ? bets.map(b => `${b.type}${b.value !== undefined ? ' ' + b.value : ''} (${b.amount})`).join(', ') : 'ninguna'} · Total {total} TDP</p>
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <div className="flex gap-3"><button onClick={() => setBets([])} disabled={spinning} className="rounded-lg bg-black/40 px-4 py-3">Limpiar</button>
        <button onClick={spin} disabled={!bets.length || spinning || total > balance} className="flex-1 rounded-lg bg-red-600 py-3 font-bold disabled:opacity-40">GIRAR</button></div>
      <p className="text-center text-xs text-white/40">Simulación · Las TDP Coins no tienen valor monetario</p>
    </div>)
}

