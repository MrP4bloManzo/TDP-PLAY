'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { blackjackStart, blackjackAct } from '@/lib/play'
import { score, type Card as C } from '@/services/casino/blackjack'
const Card = ({ c }: { c: C | null }) => (
  <div className={`card-in flex h-24 w-16 flex-col items-center justify-center rounded-lg border text-lg font-bold shadow-lg ${c ? 'bg-white ' + ('♥♦'.includes(c.s) ? 'text-red-600' : 'text-black') : 'bg-green-900 border-green-500'}`}>
    {c ? <><span>{c.r}</span><span>{c.s}</span></> : <span className="text-green-500">?</span>}
  </div>)
export default function Blackjack() {
  const { balance, bj: g } = useStore(), [bet, setBet] = useState(100), [msg, setMsg] = useState('')
  const run = (fn: () => void) => { setMsg(''); try { fn() } catch (e) { setMsg((e as Error).message) } }
  const active = !!g && !g.done
  const dealer: (C | null)[] = g ? (g.done ? g.dealer : [g.dealer[0], null]) : []
  return (
    <div className="felt mx-auto max-w-2xl space-y-6 rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-extrabold">Blackjack</h1>
        <div className="rounded-lg bg-black/50 px-3 py-1 text-sm">Saldo virtual: <b className="text-green-400">{balance.toLocaleString()} TDP</b></div></div>
      {g && <>
        <div><p className="mb-2 text-sm text-white/60">Dealer {g.done && `· ${score(g.dealer)}`}</p><div className="flex gap-2">{dealer.map((c, i) => <Card key={i} c={c} />)}</div></div>
        <div><p className="mb-2 text-sm text-white/60">Tú · {score(g.player)} · Apuesta {g.bet} TDP</p><div className="flex flex-wrap gap-2">{g.player.map((c, i) => <Card key={i} c={c} />)}</div></div>
      </>}
      {g?.done && <p className="text-center text-xl font-bold">{g.result} {g.payout ? `· +${g.payout - g.bet} TDP` : `· −${g.bet} TDP`}</p>}
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      {active ? (
        <div className="grid grid-cols-3 gap-3">
          {(['hit', 'stand', 'double'] as const).map(a => <button key={a} onClick={() => run(() => blackjackAct(a))} disabled={a === 'double' && g.player.length !== 2}
            className="rounded-lg bg-green-600 py-3 font-bold disabled:opacity-30">{{ hit: 'PEDIR', stand: 'PLANTARSE', double: 'DOBLAR' }[a]}</button>)}
        </div>) : (
        <div className="flex gap-3"><input type="number" min={10} max={5000} step={10} value={bet} onChange={e => setBet(+e.target.value)} className="w-32 rounded-lg border border-white/10 bg-black/40 px-3 py-2" />
          <button onClick={() => run(() => blackjackStart(bet))} className="flex-1 rounded-lg bg-red-600 py-3 font-bold">REPARTIR</button></div>)}
      <p className="text-center text-xs text-white/40">Simulación · Las TDP Coins no tienen valor monetario</p>
    </div>)
}
