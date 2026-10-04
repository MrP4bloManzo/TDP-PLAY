'use client'
import { useStore, reset } from '@/lib/store'
export default function Wallet() {
  const s = useStore(), net = s.txs.reduce((a, t) => a + t.net, 0)
  return (<>
    <h1 className="mb-4 text-2xl font-extrabold">Saldo virtual</h1>
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-white/50">Saldo</p><p className="text-3xl font-extrabold text-green-400">{s.balance.toLocaleString()} TDP</p></div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-white/50">Ganancia / pérdida acumulada</p><p className={`text-3xl font-extrabold ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>{net >= 0 ? '+' : ''}{net.toLocaleString()}</p></div>
    </div>
    {s.txs.length === 0 ? <p className="text-white/50">Aún no hay movimientos. Haz un pronóstico o juega en el casino.</p> : (
      <div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-white/60"><tr><th className="p-3">Fecha</th><th>Juego</th><th>Apuesta</th><th>Resultado</th><th className="pr-3 text-right">Saldo final</th></tr></thead>
        <tbody>{s.txs.map(t => <tr key={t.id} className="border-t border-white/10"><td className="p-3">{new Date(t.at).toLocaleString('es-MX')}</td><td>{t.game}</td><td>{t.stake}</td>
          <td className={t.net >= 0 ? 'text-green-400' : 'text-red-400'}>{t.net >= 0 ? '+' : ''}{t.net}</td><td className="pr-3 text-right">{t.balanceAfter.toLocaleString()}</td></tr>)}</tbody></table></div>)}
    <button onClick={() => { if (confirm('¿Reiniciar saldo e historial a 10,000 TDP?')) reset() }} className="mt-6 rounded-lg bg-black/40 px-4 py-2 text-sm hover:bg-red-700">Reiniciar simulación</button>
  </>)
}
