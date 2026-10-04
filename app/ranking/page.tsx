import { prisma } from '@/lib/db'
export const dynamic = 'force-dynamic'
const MEDAL = ['🥇', '🥈', '🥉']
export default async function Ranking() {
  const users = await prisma.user.findMany({ where: { role: 'USER' }, orderBy: { wallet: { balance: 'desc' } }, take: 10,
    select: { username: true, level: true, wallet: { select: { balance: true } }, _count: { select: { predictions: { where: { status: 'WON' } } } } } })
  return (<>
    <h1 className="mb-4 text-2xl font-extrabold">Ranking <span className="ml-2 rounded bg-red-700 px-2 py-0.5 text-xs">SIMULACIÓN</span></h1>
    <div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full text-left text-sm">
      <thead className="bg-white/5 text-white/60"><tr><th className="p-3">#</th><th>Usuario</th><th>Nivel</th><th>Acertados</th><th className="pr-3 text-right">TDP Coins</th></tr></thead>
      <tbody>{users.map((u, i) => <tr key={u.username} className="border-t border-white/10"><td className="p-3 text-lg">{MEDAL[i] ?? i + 1}</td><td className="font-semibold">{u.username}</td>
        <td>{u.level}</td><td>{u._count.predictions}</td><td className="pr-3 text-right font-bold text-green-400">{(u.wallet?.balance ?? 0).toLocaleString()}</td></tr>)}</tbody></table></div>
  </>)
}
