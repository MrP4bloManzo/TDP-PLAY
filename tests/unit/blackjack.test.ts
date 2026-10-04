import { describe, it, expect } from 'vitest'
import { score, act, BJ, Card } from '../../services/casino/blackjack'
const c = (r: string): Card => ({ r, s: '♠' })
const game = (p: string[], d: string[], deck: string[] = [], bet = 100): BJ => ({ player: p.map(c), dealer: d.map(c), deck: deck.map(c), bet, done: false })
describe('puntuación', () => {
  it('as vale 11 u 1 según convenga', () => {
    expect(score([c('A'), c('K')])).toBe(21)
    expect(score([c('A'), c('A'), c('9')])).toBe(21)
    expect(score([c('K'), c('Q'), c('5')])).toBe(25)
  })
})
describe('resultados', () => {
  it('victoria paga 2x', () => { const g = game(['K', 'Q'], ['K', '8']); act(g, 'stand'); expect([g.result, g.payout]).toEqual(['VICTORIA', 200]) })
  it('empate devuelve la apuesta', () => { const g = game(['K', '8'], ['10', '8']); act(g, 'stand'); expect([g.result, g.payout]).toEqual(['EMPATE', 100]) })
  it('derrota paga 0', () => { const g = game(['K', '7'], ['K', '9']); act(g, 'stand'); expect([g.result, g.payout]).toEqual(['DERROTA', 0]) })
  it('bust pierde sin que juegue el dealer', () => { const g = game(['K', '6'], ['K', '8'], ['K']); act(g, 'hit'); expect([g.result, g.payout, g.dealer.length]).toEqual(['DERROTA', 0, 2]) })
  it('doblar duplica apuesta y entrega una carta', () => { const g = game(['5', '6'], ['K', '7'], ['K']); act(g, 'double'); expect([g.bet, g.payout]).toEqual([200, 400]) })
  it('no permite doblar con más de 2 cartas', () => { expect(() => act(game(['2', '3', '4'], ['K', '7']), 'double')).toThrow() })
})
