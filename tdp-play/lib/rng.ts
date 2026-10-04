/** Entero aleatorio en [0, n) con el generador criptográfico del navegador/Node. */
export function randInt(n: number) {
  const a = new Uint32Array(1)
  crypto.getRandomValues(a)
  return a[0] % n
}
