import { act, deal } from '../services/casino/blackjack'
import { RBet, payoutOf, spin, colorOf } from '../services/casino/roulette'
import { randInt } from './rng'
import type { Market } from './data'
import { debit, settle, patch, getState } from './store'
const range = (n: number) => { if (!Number.isInteger(n) || n < 10 || n > 5000) throw new Error('La apuesta debe ser de 10 a 5,000 TDP') }

export function blackjackStart(bet: number) {
  const s = getState()
  if (s.bj && !s.bj.done) throw new Error('Ya tienes una partida activa')
  range(bet); debit(bet)
  const g = deal(bet); patch({ bj: g })
  if (g.done) settle('BLACKJACK', g.bet, g.payout!)
}
export function blackjackAct(a: 'hit' | 'stand' | 'double') {
  const g = structuredClone(getState().bj)
  if (!g || g.done) throw new Error('No hay partida activa')
  if (a === 'double') { if (g.player.length !== 2) throw new Error('Solo puedes doblar con 2 cartas'); debit(g.bet) }
  act(g, a); patch({ bj: g })
  if (g.done) settle('BLACKJACK', g.bet, g.payout!)
}
export function roulettePlay(bets: RBet[]) {
  if (!bets.length || bets.some(b => !Number.isInteger(b.amount) || b.amount <= 0)) throw new Error('Apuestas inválidas')
  const stake = bets.reduce((s, b) => s + b.amount, 0)
  debit(stake)
  const n = spin(), payout = bets.reduce((s, b) => s + payoutOf(b, n), 0)
  settle('RULETA', stake, payout)
  return { number: n, color: colorOf(n), stake, payout }
}
export function placePrediction(matchId: number, k: Market, stake: number) {
  const s = getState()
  if (s.finished[matchId]) throw new Error('El partido ya terminó')
  range(stake); debit(stake)
  const code = `TDP-2026-${String(s.preds.length + 1).padStart(6, '0')}`
  patch({ preds: [{ code, matchId, type: k.type, selection: k.selection, label: k.label, odds: k.odds, stake, status: 'PENDING', payout: 0 }, ...getState().preds] })
  return code
}
const wins = (t: string, s: string, h: number, a: number) =>
  t === '1X2' ? s === (h > a ? 'HOME' : h < a ? 'AWAY' : 'DRAW') : t === 'OU25' ? s === (h + a > 2 ? 'OVER' : 'UNDER') : t === 'BTTS' ? s === (h > 0 && a > 0 ? 'YES' : 'NO') : false
const goals = () => [0, 0, 1, 1, 1, 2, 2, 3][randInt(8)]
/** Simula el resultado del partido y liquida los pronósticos pendientes. */
export function simulateMatch(matchId: number) {
  if (getState().finished[matchId]) return
  const h = goals(), a = goals()
  const pending = getState().preds.filter(p => p.matchId === matchId && p.status === 'PENDING')
  const res = new Map(pending.map(p => [p.code, wins(p.type, p.selection, h, a) ? Math.floor(p.stake * p.odds) : 0]))
  patch({ finished: { ...getState().finished, [matchId]: [h, a] }, preds: getState().preds.map(p => res.has(p.code) ? { ...p, status: res.get(p.code)! > 0 ? 'WON' : 'LOST', payout: res.get(p.code)! } : p) })
  pending.forEach(p => settle('PRONÓSTICO', p.stake, res.get(p.code)!))
}
