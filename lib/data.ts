// DATOS DE PRUEBA · SIMULACIÓN. Equipos y partidos ficticios, generados de forma determinista.
export type Market = { id: string; type: '1X2' | 'OU25' | 'BTTS'; selection: string; label: string; odds: number }
export type Match = { id: number; home: string; away: string; group: string; date: string; stadium: string; markets: Market[] }
const T = ['Atlético Costa', 'Deportivo Volcán', 'Real Palmar', 'Club Cuyutlán', 'Halcones del Pacífico', 'Tigres del Valle', 'Unión Manzanillo', 'Costeños FC', 'Cañeros de Colima', 'Leones del Sur']
const G = ['Grupo A', 'Grupo B', 'Grupo C']
let seed = 7
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const odd = (a: number, b: number) => +(a + rnd() * (b - a)).toFixed(2)
export const matches: Match[] = Array.from({ length: 20 }, (_, i) => {
  const id = i + 1, h = i % 10, a = (i + 1 + (i % 4)) % 10
  const mk = (type: Market['type'], selection: string, label: string, odds: number): Market => ({ id: `${id}:${type}:${selection}`, type, selection, label, odds })
  return { id, home: T[h], away: T[a], group: G[h % 3], date: new Date(Date.UTC(2026, 9, 10 + i, 20, 0)).toISOString(), stadium: `Estadio Demo ${1 + (i % 5)}`,
    markets: [mk('1X2', 'HOME', 'Local', odd(1.5, 2.6)), mk('1X2', 'DRAW', 'Empate', odd(3, 3.6)), mk('1X2', 'AWAY', 'Visitante', odd(2, 4)),
      mk('OU25', 'OVER', 'Más de 2.5', odd(1.7, 2.1)), mk('OU25', 'UNDER', 'Menos de 2.5', odd(1.7, 2.1)), mk('BTTS', 'YES', 'Ambos marcan: Sí', 1.8), mk('BTTS', 'NO', 'Ambos marcan: No', 1.9)] }
})
export const demoUsers = Array.from({ length: 50 }, (_, i) => ({ username: `usuario${i + 1}`, level: 1 + (i % 7), won: (i * 7) % 23, coins: Math.floor(5000 + rnd() * 20000) }))
export const fmt = (iso: string) => new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Mexico_City' })
