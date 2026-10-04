import Link from 'next/link'
import { matches, fmt } from '@/lib/data'
export default function Home() {
  return (<>
    <section className="felt rounded-2xl border border-white/10 p-8 md:p-14">
      <h1 className="max-w-xl text-4xl font-extrabold leading-tight md:text-6xl">Vive la Liga TDP de una nueva forma</h1>
      <p className="mt-4 max-w-lg text-white/70">Consulta partidos, analiza estadísticas y participa en experiencias deportivas virtuales.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/pronosticos" className="rounded-lg bg-green-600 px-5 py-3 font-bold hover:bg-green-500">VER PARTIDOS</Link>
        <Link href="/casino/blackjack" className="rounded-lg bg-red-600 px-5 py-3 font-bold hover:bg-red-500">ENTRAR AL CASINO</Link>
      </div>
    </section>
    <h2 className="mb-3 mt-10 text-xl font-bold">Próximos partidos <span className="ml-2 rounded bg-red-700 px-2 py-0.5 text-xs">DATOS DE PRUEBA</span></h2>
    <div className="grid gap-4 md:grid-cols-2">
      {matches.slice(0, 8).map(m => (
        <article key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs text-white/50"><span>{m.group}</span><span>{fmt(m.date)}</span></div>
          <div className="my-3 flex items-center justify-between text-lg font-bold"><span>{m.home}</span><span className="text-sm text-white/40">VS</span><span className="text-right">{m.away}</span></div>
          <p className="mb-3 text-xs text-white/50">{m.stadium}</p>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            {m.markets.slice(0, 3).map(k => <div key={k.id} className="rounded-lg bg-black/40 py-2"><div className="text-xs text-white/50">{k.label}</div><div className="font-bold text-green-400">{k.odds.toFixed(2)}</div></div>)}
          </div>
        </article>))}
    </div>
  </>)
}
