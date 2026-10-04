import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const db = new PrismaClient()
const r = (a: number, b: number) => +(a + Math.random() * (b - a)).toFixed(2)
const T = [['Atlético Costa','Colima'],['Deportivo Volcán','Colima'],['Real Palmar','Jalisco'],['Club Cuyutlán','Colima'],['Halcones del Pacífico','Michoacán'],
  ['Tigres del Valle','Jalisco'],['Unión Manzanillo','Colima'],['Costeños FC','Nayarit'],['Cañeros de Colima','Colima'],['Leones del Sur','Jalisco']]
async function main() {
  const hash = await bcrypt.hash('Demo123!', 10)
  const groups = []
  for (const name of ['Grupo A (SIMULACIÓN)','Grupo B (SIMULACIÓN)','Grupo C (SIMULACIÓN)']) groups.push(await db.group.create({ data: { name } }))
  const teams = []
  for (let i = 0; i < 10; i++) teams.push(await db.team.create({ data: { name: T[i][0], state: T[i][1], groupId: groups[i % 3].id } }))
  for (let i = 0; i < 20; i++) {
    const done = i < 4
    const m = await db.match.create({ data: {
      homeId: teams[i % 10].id, awayId: teams[(i + 1 + (i % 4)) % 10].id,
      date: new Date(Date.now() + (i - 4) * 86400000 + 3600000 * 4), stadium: `Estadio Demo ${1 + (i % 5)}`,
      status: done ? 'FINISHED' : 'SCHEDULED', homeGoals: done ? i % 4 : null, awayGoals: done ? (i + 1) % 3 : null } })
    if (!done) await db.predictionMarket.createMany({ data: [
      { matchId: m.id, type: '1X2', selection: 'HOME', odds: r(1.5, 2.6) }, { matchId: m.id, type: '1X2', selection: 'DRAW', odds: r(3, 3.6) },
      { matchId: m.id, type: '1X2', selection: 'AWAY', odds: r(2, 4) },
      { matchId: m.id, type: 'OU25', selection: 'OVER', odds: r(1.7, 2.1) }, { matchId: m.id, type: 'OU25', selection: 'UNDER', odds: r(1.7, 2.1) },
      { matchId: m.id, type: 'BTTS', selection: 'YES', odds: 1.8 }, { matchId: m.id, type: 'BTTS', selection: 'NO', odds: 1.9 }] })
  }
  await db.user.create({ data: { username: 'admin', email: 'admin@tdpplay.local', name: 'Admin Demo', role: 'ADMIN',
    passwordHash: await bcrypt.hash('Admin123!', 10), wallet: { create: {} } } })
  await db.user.create({ data: { username: 'demo', email: 'demo@tdpplay.local', name: 'Usuario Demo', passwordHash: hash, wallet: { create: {} } } })
  for (let i = 1; i <= 50; i++) await db.user.create({ data: { username: `usuario${i}`, email: `usuario${i}@demo.dev`, name: `Usuario Demo ${i}`,
    level: 1 + (i % 7), passwordHash: hash, wallet: { create: { balance: Math.floor(r(5000, 25000)) } } } })
}
main().finally(() => db.$disconnect())
