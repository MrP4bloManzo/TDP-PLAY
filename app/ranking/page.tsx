'use client'
import { demoUsers } from '@/lib/data'
import { useStore } from '@/lib/store'
const MEDAL = ['🥇', '🥈', '🥉']
export default function Ranking() {
  const s = useStore()
  const me = { username: 'Tú', level: 1, won: s.preds.filter(p => p.status === 'WON').length, coins: s.balance }
  const top = [...demoUsers, me].sort((a, b) => b.coins - a.coins).slice(0, 10)
  return (<>
    <h1 className="mb-1 text-2xl font-extrabold">Ranking <span className="ml-2 rounded bg-red-700 px-2 py-0.5 text-xs">SIMULACIÓN</span></h1>
    <p className="mb-4 text-sm text-white/50">Los demás jugadores son datos de prueba.</p>
    <div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full text-left text-sm">
      <thead className="bg-white/5 text-white/60"><tr><th className="p-3">#</th><th>Usuario</th><th>Nivel</th><th>Acertados</th><th className="pr-3 text-right">TDP Coins</th></tr></thead>
      <tbody>{top.map((u, i) => <tr key={u.username} className={`border-t border-white/10 ${u === me ? 'bg-green-900/30' : ''}`}><td className="p-3 text-lg">{MEDAL[i] ?? i + 1}</td><td className="font-semibold">{u.username}</td>
        <td>{u.level}</td><td>{u.won}</td><td className="pr-3 text-right font-bold text-green-400">{u.coins.toLocaleString()}</td></tr>)}</tbody></table></div>
  </>)
}
