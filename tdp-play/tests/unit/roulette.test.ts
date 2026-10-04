import { describe, it, expect } from 'vitest'
import { colorOf, payoutOf } from '../../services/casino/roulette'
describe('ruleta europea', () => {
  it('colores', () => { expect([colorOf(0), colorOf(1), colorOf(2)]).toEqual(['green', 'red', 'black']) })
  it('rojo y negro', () => { expect(payoutOf({ type: 'red', amount: 100 }, 1)).toBe(200); expect(payoutOf({ type: 'black', amount: 100 }, 1)).toBe(0) })
  it('el cero pierde en apuestas externas', () => { for (const t of ['red', 'black', 'even', 'odd', 'low', 'high'] as const) expect(payoutOf({ type: t, amount: 100 }, 0)).toBe(0) })
  it('par e impar', () => { expect(payoutOf({ type: 'even', amount: 50 }, 8)).toBe(100); expect(payoutOf({ type: 'odd', amount: 50 }, 8)).toBe(0) })
  it('número exacto paga 36x', () => { expect(payoutOf({ type: 'number', value: 17, amount: 100 }, 17)).toBe(3600); expect(payoutOf({ type: 'number', value: 17, amount: 100 }, 18)).toBe(0) })
  it('docena y columna pagan 3x', () => { expect(payoutOf({ type: 'dozen', value: 2, amount: 100 }, 14)).toBe(300); expect(payoutOf({ type: 'column', value: 1, amount: 100 }, 4)).toBe(300) })
})
