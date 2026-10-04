import Link from 'next/link';
import { ArrowRight, ChartNoAxesCombined, Gamepad2, Trophy, WalletCards } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/db/prisma';
import { formatCoins } from '@/lib/utils';
import { MotionFade } from '@/components/ui/motion-fade';

export default async function HomePage() {
  const [matches, leaderboard] = await Promise.all([
    prisma.match.findMany({ where: { status: { in: ['LIVE', 'SCHEDULED'] } }, include: { homeTeam: true, awayTeam: true, group: true }, orderBy: { date: 'asc' }, take: 4 }),
    prisma.user.findMany({ include: { wallet: true }, orderBy: { wallet: { balance: 'desc' } }, take: 5 }),
  ]);
  return <AppShell><MotionFade><section className="grid items-center gap-6 lg:grid-cols-[1.15fr_.85fr]">
    <div className="rounded-3xl border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,.18),transparent_40%),#0a1510] p-7 sm:p-10">
      <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">SIMULACIÓN · DATOS DE PRUEBA</div>
      <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">Vive el fútbol de una nueva forma.</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">Consulta partidos, analiza estadísticas y participa en experiencias deportivas virtuales. Todo con TDP Coins.</p>
      <div className="mt-7 flex flex-wrap gap-3"><Link href="/partidos" className="inline-flex h-12 items-center gap-2 rounded-xl bg-green-500 px-5 font-bold text-black">Explorar partidos <ArrowRight className="size-4" /></Link><Link href="/casino/blackjack" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 font-semibold">Probar casino <Gamepad2 className="size-4" /></Link></div>
      <div className="mt-8 grid max-w-xl grid-cols-3 gap-3"><Mini label="Moneda" value="10K" hint="TDP Coins iniciales"/><Mini label="Mercados" value="7+" hint="por partido demo"/><Mini label="Casino" value="2" hint="juegos virtuales"/></div>
    </div>
    <div className="grid gap-4"><Feature icon={ChartNoAxesCombined} title="Estadísticas" text="Forma reciente, goles, puntos y tendencias." href="/estadisticas"/><Feature icon={Trophy} title="Ranking" text="Compite por la cima con usuarios de demostración." href="/ranking"/><Feature icon={WalletCards} title="Wallet virtual" text="Historial transparente de tus TDP Coins." href="/wallet"/></div>
  </section></MotionFade>
  <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_.8fr]">
    <div><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Próximos partidos</h2><Link href="/partidos" className="text-sm text-green-400">Ver todos</Link></div><div className="grid gap-3">{matches.map((match) => <Card key={match.id}><CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-xs uppercase tracking-[0.15em] text-white/35">{match.group.name}</div><div className="mt-1 font-semibold">{match.homeTeam.name} <span className="text-white/35">vs</span> {match.awayTeam.name}</div></div><div className="text-sm text-white/50">{new Date(match.date).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</div></CardContent></Card>)}</div></div>
    <div><h2 className="mb-4 text-xl font-black">Top 5</h2><Card><CardContent className="space-y-2">{leaderboard.map((u,i)=><div key={u.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-3"><div className="flex items-center gap-3"><div className="grid size-8 place-items-center rounded-full bg-white/8 text-xs font-bold">{i+1}</div><div><div className="font-semibold">{u.username}</div><div className="text-xs text-white/35">Nivel {u.level}</div></div></div><div className="font-bold text-green-300">{formatCoins(u.wallet?.balance ?? 0)}</div></div>)}</CardContent></Card></div>
  </section></AppShell>;
}
function Mini({label,value,hint}:{label:string;value:string;hint:string}) { return <div className="rounded-2xl border border-white/8 bg-black/15 p-3"><div className="text-[10px] uppercase tracking-[0.14em] text-white/35">{label}</div><div className="mt-1 text-xl font-black">{value}</div><div className="text-[10px] text-white/35">{hint}</div></div> }
function Feature({icon:Icon,title,text,href}:{icon:any;title:string;text:string;href:string}) { return <Link href={href} className="group rounded-2xl border border-white/8 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.06]"><div className="flex size-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400"><Icon className="size-5"/></div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-white/50">{text}</p></Link> }
