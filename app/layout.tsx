import './globals.css'
import Link from 'next/link'
import BalanceBadge from '@/components/BalanceBadge'
export const metadata = { title: 'TDP PLAY | Simulador Deportivo', description: 'Fútbol. Pronósticos. Diversión. Simulador con TDP Coins virtuales.' }
const NAV = [['/', 'Inicio'], ['/pronosticos', 'Pronósticos'], ['/casino/blackjack', 'Blackjack'], ['/casino/roulette', 'Ruleta'], ['/ranking', 'Ranking'], ['/wallet', 'Wallet']]
const MOBILE = [['/', 'Inicio'], ['/pronosticos', 'Pronósticos'], ['/casino/blackjack', 'Casino'], ['/ranking', 'Ranking'], ['/wallet', 'Wallet']]
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es"><body className="min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-baseline gap-2"><span className="text-xl font-extrabold tracking-tight text-green-500">TDP <span className="text-red-600">PLAY</span></span><span className="hidden text-xs text-white/50 lg:inline">Fútbol. Pronósticos. Diversión.</span></Link>
          <nav className="hidden gap-5 text-sm font-medium text-white/80 md:flex">{NAV.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
          <BalanceBadge />
        </div>
        <div className="bg-red-700 py-1 text-center text-xs font-semibold">SIMULACIÓN · TDP Coins sin valor monetario</div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/60">
        <p>Esta plataforma es un simulador de entretenimiento. Las TDP Coins son virtuales, no tienen valor monetario y no pueden comprarse, venderse, retirarse ni canjearse por dinero.</p>
        <p className="mt-1">Proyecto demostrativo independiente. No afiliado oficialmente a la Liga TDP.</p>
      </footer>
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-white/10 bg-black py-3 text-xs md:hidden">{MOBILE.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
    </body></html>
  )
}
