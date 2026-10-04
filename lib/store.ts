'use client'
import { useSyncExternalStore } from 'react'
import type { BJ } from '../services/casino/blackjack'
// Billetera y datos en localStorage. TDP Coins son ficticias: aquí no hay dinero real ni servidor.
export type Tx = { id: number; at: string; game: string; stake: number; payout: number; net: number; balanceAfter: number }
export type Pred = { code: string; matchId: number; type: string; selection: string; label: string; odds: number; stake: number; status: 'PENDING' | 'WON' | 'LOST'; payout: number }
export type State = { username: string; balance: number; txs: Tx[]; preds: Pred[]; finished: Record<number, [number, number]>; bj: BJ | null }
const KEY = 'tdp-play-v1'
const init: State = { username: 'Jugador', balance: 10000, txs: [], preds: [], finished: {}, bj: null }
let state = init, loaded = false
const subs = new Set<() => void>()
function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try { const r = localStorage.getItem(KEY); if (r) state = { ...init, ...JSON.parse(r) } } catch {}
}
function commit(s: State) {
  state = s
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {}
  subs.forEach(f => f())
}
export const getState = () => { load(); return state }
export const useStore = () => useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb) }, getState, () => init)
export const patch = (p: Partial<State>) => commit({ ...getState(), ...p })
export const reset = () => commit(init)
/** Resta TDP Coins. Falla si el saldo no alcanza. */
export function debit(n: number) {
  const s = getState()
  if (!Number.isInteger(n) || n <= 0) throw new Error('Monto inválido')
  if (s.balance < n) throw new Error('Saldo insuficiente')
  commit({ ...s, balance: s.balance - n })
}
/** Acredita el premio y guarda el movimiento. stake = total apostado, payout = total devuelto. */
export function settle(game: string, stake: number, payout: number) {
  const s = getState(), balance = s.balance + payout
  commit({ ...s, balance, txs: [{ id: Date.now() + Math.random(), at: new Date().toISOString(), game, stake, payout, net: payout - stake, balanceAfter: balance }, ...s.txs].slice(0, 100) })
}
