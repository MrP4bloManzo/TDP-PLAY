import Link from 'next/link';
import { Shield, Trophy } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';
import { formatCoins } from '@/lib/utils';

export async function Header() {
  const user = await getCurrentUser();
  return <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07110c]/85 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 lg:px-6">
      <Link href="/" className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-green-500 font-black text-black">T</div>
        <div><div className="font-black tracking-tight">TDP PLAY</div><div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Fútbol · Pronósticos · Diversión</div></div>
      </Link>
      <nav className="hidden items-center gap-5 md:flex">
        {['Partidos', 'Pronósticos', 'Casino', 'Equipos', 'Ranking', 'Estadísticas'].map((label) => {
          const map: Record<string, string> = { Partidos: '/partidos', Pronósticos: '/pronosticos', Casino: '/casino/blackjack', Equipos: '/equipos', Ranking: '/ranking', Estadísticas: '/estadisticas' };
          return <Link key={label} href={map[label]} className="text-sm text-white/60 transition hover:text-white">{label}</Link>;
        })}
      </nav>
      {user ? <div className="flex items-center gap-2">
        <Link href="/wallet" className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm sm:flex"><Trophy className="size-4 text-green-400" /> {formatCoins(user.wallet?.balance ?? 0)} TDP</Link>
        <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="grid size-10 place-items-center rounded-xl bg-white/8 hover:bg-white/12"><Shield className="size-4" /></Link>
      </div> : <div className="flex gap-2"><Link href="/login" className="rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/5">Entrar</Link><Link href="/register" className="rounded-xl bg-green-500 px-3 py-2 text-sm font-bold text-black">Crear cuenta</Link></div>}
    </div>
  </header>;
}
