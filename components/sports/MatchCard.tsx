import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';

export function MatchCard({ match }: { match: any }) {
  const status = match.status === 'FINISHED' ? ['Finalizado', 'muted'] : match.status === 'LIVE' ? ['En vivo', 'danger'] : ['Próximo', 'success'];
  return <Card className="transition hover:-translate-y-0.5 hover:border-white/15">
    <CardContent>
      <div className="mb-4 flex items-center justify-between gap-2"><Badge variant={status[1] as any}>{status[0]}</Badge><span className="text-xs text-white/40">{match.group?.name}</span></div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-right"><div className="font-semibold">{match.homeTeam?.name}</div><div className="mt-1 text-xs text-white/40">{match.homeTeam?.shortName}</div></div>
        <div className="rounded-full bg-white/5 px-3 py-2 font-black">{match.status === 'SCHEDULED' ? 'VS' : `${match.homeScore ?? 0} — ${match.awayScore ?? 0}`}</div>
        <div><div className="font-semibold">{match.awayTeam?.name}</div><div className="mt-1 text-xs text-white/40">{match.awayTeam?.shortName}</div></div>
      </div>
      <div className="mt-5 grid gap-2 text-xs text-white/50 sm:grid-cols-2"><span className="flex items-center gap-2"><CalendarDays className="size-3.5" />{formatDateTime(match.date)}</span><span className="flex items-center gap-2"><MapPin className="size-3.5" />{match.stadium}</span></div>
      <Link href={`/partidos#${match.id}`} className="mt-4 block rounded-xl border border-white/8 px-3 py-2 text-center text-xs font-semibold hover:bg-white/5">Ver partido</Link>
    </CardContent>
  </Card>;
}
