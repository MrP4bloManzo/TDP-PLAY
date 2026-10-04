import { randInt } from '../../lib/rng'
export type Card = { r: string; s: string }
export type BJ = { deck: Card[]; player: Card[]; dealer: Card[]; bet: number; done: boolean; result?: string; payout?: number }
const R = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'], S = ['♠','♥','♦','♣']
function shuffled(): Card[] {
  const d = S.flatMap(s => R.map(r => ({ r, s })))
  for (let i = d.length - 1; i > 0; i--) { const j = randInt(i + 1); [d[i], d[j]] = [d[j], d[i]] }
  return d
}
export function score(h: Card[]) {
  let t = 0, a = 0
  for (const c of h) { if (c.r === 'A') { a++; t += 11 } else t += 'JQK'.includes(c.r) ? 10 : +c.r }
  while (t > 21 && a) { t -= 10; a-- }
  return t
}
export function deal(bet: number): BJ {
  const deck = shuffled()
  const g: BJ = { deck, player: [deck.pop()!, deck.pop()!], dealer: [deck.pop()!, deck.pop()!], bet, done: false }
  if (score(g.player) === 21) {
    g.done = true
    if (score(g.dealer) === 21) { g.result = 'EMPATE'; g.payout = bet }
    else { g.result = 'BLACKJACK'; g.payout = Math.floor(bet * 2.5) } // apuesta + 1.5x
  }
  return g
}
function finish(g: BJ) {
  g.done = true
  if (score(g.player) > 21) { g.result = 'DERROTA'; g.payout = 0; return }
  while (score(g.dealer) < 17) g.dealer.push(g.deck.pop()!)
  const p = score(g.player), d = score(g.dealer)
  if (d > 21 || p > d) { g.result = 'VICTORIA'; g.payout = g.bet * 2 }
  else if (p === d) { g.result = 'EMPATE'; g.payout = g.bet }
  else { g.result = 'DERROTA'; g.payout = 0 }
}
export function act(g: BJ, a: 'hit' | 'stand' | 'double') {
  if (g.done) throw new Error('La partida ya terminó')
  if (a === 'double') { if (g.player.length !== 2) throw new Error('Solo puedes doblar con 2 cartas'); g.bet *= 2; g.player.push(g.deck.pop()!); return finish(g) }
  if (a === 'hit') { g.player.push(g.deck.pop()!); if (score(g.player) >= 21) finish(g); return }
  finish(g)
}
/** Vista segura para el cliente: oculta la baraja y la carta tapada del dealer. */
export const view = (g: BJ) => ({ player: g.player, dealer: g.done ? g.dealer : [g.dealer[0], null], playerScore: score(g.player),
  dealerScore: g.done ? score(g.dealer) : null, bet: g.bet, done: g.done, result: g.result, payout: g.payout })
