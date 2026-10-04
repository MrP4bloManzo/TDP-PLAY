import { randomInt } from 'crypto'
export type RBet = { type: 'red'|'black'|'even'|'odd'|'low'|'high'|'dozen'|'column'|'number'; value?: number; amount: number }
const REDS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36])
export const colorOf = (n: number) => n === 0 ? 'green' : REDS.has(n) ? 'red' : 'black'
/** Devuelve el total regresado (apuesta + ganancia) de una apuesta, 0 si pierde. */
export function payoutOf(b: RBet, n: number) {
  const v = b.value ?? 0
  const win = n !== 0 && (
    b.type === 'red' ? colorOf(n) === 'red' : b.type === 'black' ? colorOf(n) === 'black' :
    b.type === 'even' ? n % 2 === 0 : b.type === 'odd' ? n % 2 === 1 : b.type === 'low' ? n <= 18 : b.type === 'high' ? n >= 19 :
    b.type === 'dozen' ? Math.ceil(n / 12) === v : b.type === 'column' ? ((n - 1) % 3) + 1 === v : false)
  if (b.type === 'number') return n === v ? b.amount * 36 : 0
  if (!win) return 0
  return b.amount * (b.type === 'dozen' || b.type === 'column' ? 3 : 2)
}
export const spin = () => randomInt(37)
