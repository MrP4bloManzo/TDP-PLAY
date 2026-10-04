'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function BlackjackTable({ initialBalance }: { initialBalance: number }) {
  const [bet, setBet] = useState(100);
  const [game, setGame] = useState<any>(null);
  const [message, setMessage] = useState('Haz tu apuesta para comenzar.');
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true); setMessage('Barajando...');
    const response = await fetch('/api/casino/blackjack/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bet }) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setMessage(data.error ?? 'No se pudo iniciar.');
    setGame(data.game); setMessage(statusMessage(data.game.status));
  }
  async function action(action: 'hit' | 'stand' | 'double') {
    if (!game) return;
    setLoading(true);
    const response = await fetch('/api/casino/blackjack/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId: game.id, action }) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setMessage(data.error ?? 'No se pudo ejecutar.');
    setGame(data.game); setMessage(statusMessage(data.game.status));
  }
  return <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
    <Card className="overflow-hidden"><div className="min-h-[500px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,.15),transparent_50%),#08140d] p-6">
      <div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[0.2em] text-green-400">Casino virtual</div><h2 className="mt-1 text-2xl font-black">Blackjack</h2></div><div className="text-xs text-white/50">52 cartas · Dealer planta en 17</div></div>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <Hand title="Dealer" cards={game?.dealerCards ?? []} hidden={game?.status === 'ACTIVE'} />
        <Hand title="Jugador" cards={game?.playerCards ?? []} />
      </div>
      <div className="mt-10 text-center"><p className="text-sm text-white/70">{message}</p></div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {!game || game.status !== 'ACTIVE' ? <Button size="lg" onClick={start} disabled={loading}>Nueva partida</Button> : <><Button onClick={() => action('hit')} disabled={loading}>Pedir</Button><Button variant="secondary" onClick={() => action('stand')} disabled={loading}>Plantarse</Button><Button variant="secondary" onClick={() => action('double')} disabled={loading}>Doblar</Button></>}
      </div>
    </div></Card>
    <Card><CardHeader><CardTitle>Configuración</CardTitle></CardHeader><CardContent><label className="text-xs text-white/50">Apuesta (TDP Coins)</label><Input type="number" min={10} max={100000} value={bet} onChange={(e) => setBet(Number(e.target.value))} className="mt-2" /><div className="mt-4 text-sm text-white/60">Saldo al cargar: <span className="font-bold text-white">{initialBalance.toLocaleString('es-MX')}</span> TDP</div><div className="mt-6 rounded-xl bg-white/5 p-3 text-xs leading-5 text-white/50">Blackjack paga 1.5x; victoria 2x; empate devuelve la apuesta. Todo es virtual.</div></CardContent></Card>
  </div>;
}

function Hand({ title, cards, hidden = false }: { title: string; cards: any[]; hidden?: boolean }) {
  return <div><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{title}</h3><span className="text-xs text-white/40">{hidden ? 'carta oculta' : `${score(cards)} puntos`}</span></div><div className="flex flex-wrap gap-3">{cards.map((card, index) => <div key={`${card.rank}-${card.suit}-${index}`} className={`grid h-28 w-20 place-items-center rounded-xl border text-black shadow-lg ${hidden && index === 1 ? 'border-white/10 bg-[#14301d] text-transparent' : 'border-white/80 bg-white'}`}><span className="text-xl font-black">{hidden && index === 1 ? '?' : card.rank}</span><span className="text-xs uppercase">{hidden && index === 1 ? '' : card.suit.slice(0, 1)}</span></div>)}</div></div>;
}
function score(cards: any[]) { let total = 0; let aces = 0; for (const card of cards) { if (card.rank === 'A') { total += 11; aces++; } else total += ['K','Q','J'].includes(card.rank) ? 10 : Number(card.rank); } while (total > 21 && aces > 0) { total -= 10; aces--; } return total; }
function statusMessage(status: string) { const map: Record<string,string> = { ACTIVE: 'Tu turno.', PLAYER_WIN: '¡Ganaste!', DEALER_WIN: 'El dealer gana.', PUSH: 'Empate: devolución.', BLACKJACK: '¡Blackjack!', PLAYER_BUST: 'Te pasaste.' }; return map[status] ?? status; }
