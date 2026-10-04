import { AppShell } from '@/components/layout/AppShell';
import { MatchCard } from '@/components/sports/MatchCard';
import { prisma } from '@/lib/db/prisma';
import { Badge } from '@/components/ui/badge';

export default async function MatchesPage(){const matches=await prisma.match.findMany({include:{homeTeam:true,awayTeam:true,group:true},orderBy:{date:'asc'}});return <AppShell><div className="flex items-end justify-between gap-4"><div><div className="text-sm text-green-400">SIMULACIÓN</div><h1 className="text-3xl font-black">Partidos</h1><p className="mt-1 text-sm text-white/50">Calendario ficticio para demostración.</p></div><Badge variant="muted">{matches.length} partidos</Badge></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{matches.map(m=><MatchCard key={m.id} match={m}/>)}</div></AppShell>}
