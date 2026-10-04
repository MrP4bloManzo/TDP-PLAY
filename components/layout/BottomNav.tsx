import Link from 'next/link';
import { Gamepad2, Home, Medal, Swords, UserRound } from 'lucide-react';

export function BottomNav() {
  const items = [
    ['/dashboard', Home, 'Inicio'],
    ['/partidos', Swords, 'Partidos'],
    ['/pronosticos', Medal, 'Pronósticos'],
    ['/casino/blackjack', Gamepad2, 'Casino'],
    ['/perfil', UserRound, 'Perfil'],
  ] as const;
  return <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-white/8 bg-[#07110c]/95 px-2 py-2 backdrop-blur-xl md:hidden">
    {items.map(([href, Icon, label]) => <Link key={href} href={href} className="flex flex-col items-center gap-1 py-1 text-[10px] text-white/55"><Icon className="size-4" />{label}</Link>)}
  </nav>;
}
