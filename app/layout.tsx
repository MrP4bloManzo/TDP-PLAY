import './globals.css'
import Link from 'next/link'
export const metadata = { title: 'TDP PLAY | Simulador Deportivo', description: 'Simulador de entretenimiento con TDP Coins virtuales' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es"><body className="min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-baseline gap-2"><span className="text-xl font-extrabold tracking-tight text-green-500">TDP <span className="text-red-600">PLAY</span></span><span className="hidden text-xs text-white/50 sm:inline">Fútbol. Pronósticos. Diversión.</span></Link>
          <nav className="flex gap-5 text-sm font-medium text-white/80"><Link href="/">Partidos</Link><Link href="/casino/blackjack">Blackjack</Link><Link href="/casino/roulette">Ruleta</Link><Link href="/ranking">Ranking</Link></nav>
        </div>
        <div className="bg-red-700 py-1 text-center text-xs font-semibold">SIMULACIÓN · TDP Coins sin valor monetario</div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/60">
        <p>Esta plataforma es un simulador de entretenimiento. Las TDP Coins no tienen valor monetario y no pueden comprarse, venderse, retirarse ni canjearse por dinero.</p>
        <p className="mt-1">Proyecto demostrativo no afiliado oficialmente a la Liga TDP.</p>
      </footer>
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-white/10 bg-black py-3 text-sm md:hidden"><Link href="/">Inicio</Link><Link href="/">Partidos</Link><Link href="/casino/blackjack">Casino</Link></nav>
    </body></html>
  )
}
