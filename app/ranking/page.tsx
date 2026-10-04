import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/db/prisma';
import { formatCoins } from '@/lib/utils';

export default async function RankingPage(){const users=await prisma.user.findMany({where:{role:'USER'},include:{wallet:true},orderBy:{wallet:{balance:'desc'}},take:10});return <AppShell><h1 className="text-3xl font-black">Ranking</h1><p className="mt-1 text-sm text-white/45">Top 10 de la simulación por TDP Coins.</p><Card className="mt-6"><CardContent className="space-y-2">{users.map((u,i)=><div key={u.id} className="grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-xl border border-white/5 bg-white/[.025] p-3"><div className={`grid size-9 place-items-center rounded-full font-black ${i===0?'bg-amber-300 text-black':i===1?'bg-white text-black':i===2?'bg-orange-400 text-black':'bg-white/8 text-white'}`}>{i+1}</div><div><div className="font-semibold">{u.username}</div><div className="text-xs text-white/35">Nivel {u.level}</div></div><div className="font-black text-green-300">{formatCoins(u.wallet?.balance??0)}</div></div>)}</CardContent></Card></AppShell>}
