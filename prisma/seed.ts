import { PrismaClient, Role, MatchStatus, WalletTransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const groupSeed = [
  ['Grupo Centro', 'Centro'],
  ['Grupo Occidente', 'Occidente'],
  ['Grupo Pacífico', 'Pacífico'],
] as const;

const teamNames = [
  'Atléticos del Valle',
  'Deportivo Horizonte',
  'Fuerza Colimense',
  'Unión del Pacífico',
  'Rojos del Volcán',
  'Tigres del Río',
  'Halcones del Centro',
  'Guerreros de Occidente',
  'Leones del Bajío',
  'Titanes del Sur',
];

function addDays(days: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  await prisma.walletTransaction.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.predictionMarket.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.group.deleteMany();
  await prisma.blackjackGame.deleteMany();
  await prisma.rouletteGame.deleteMany();
  await prisma.leaderboard.deleteMany();
  await prisma.adminAction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  const groups = [];
  for (const [name, region] of groupSeed) {
    groups.push(await prisma.group.create({ data: { name, region } }));
  }

  const teams = [];
  for (let i = 0; i < teamNames.length; i++) {
    const group = groups[i % groups.length];
    teams.push(
      await prisma.team.create({
        data: {
          name: teamNames[i],
          shortName: teamNames[i].split(' ').map((x) => x[0]).join('').slice(0, 3).toUpperCase(),
          badgeColor: ['#16a34a', '#dc2626', '#2563eb', '#f59e0b'][i % 4],
          groupId: group.id,
          wins: (i * 3) % 8,
          draws: i % 4,
          losses: (i + 2) % 5,
          goalsFor: 10 + i * 2,
          goalsAgainst: 7 + i,
          points: ((i * 3) % 8) * 3 + (i % 4),
        },
      }),
    );
  }

  const demoHash = await bcrypt.hash('Demo123!', 12);
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const demo = await prisma.user.create({
    data: {
      name: 'Usuario Demo',
      username: 'demo',
      email: 'demo@tdpplay.local',
      passwordHash: demoHash,
      role: Role.USER,
      wallet: { create: { balance: 10000 } },
    },
    include: { wallet: true },
  });
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Demo',
      username: 'admin',
      email: 'admin@tdpplay.local',
      passwordHash: adminHash,
      role: Role.ADMIN,
      wallet: { create: { balance: 10000 } },
    },
    include: { wallet: true },
  });

  const users = [demo, admin];
  for (let i = 1; i <= 48; i++) {
    users.push(
      await prisma.user.create({
        data: {
          name: `Jugador Demo ${i}`,
          username: `jugador${i}`,
          email: `jugador${i}@tdpplay.local`,
          passwordHash: demoHash,
          role: Role.USER,
          level: 1 + (i % 10),
          wallet: { create: { balance: 5000 + i * 177 } },
        },
        include: { wallet: true },
      }),
    );
  }

  for (let i = 0; i < users.length; i++) {
    const wallet = users[i].wallet!;
    if (i % 3 === 0) {
      const amount = 250 + i * 10;
      const updated = await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount }, totalWon: { increment: amount } },
      });
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.BONUS,
          amount,
          balanceAfter: updated.balance,
          description: 'Bono de bienvenida de desarrollo',
        },
      });
    }
  }

  const matches = [];
  for (let i = 0; i < 20; i++) {
    const home = teams[i % teams.length];
    const away = teams[(i + 3) % teams.length];
    const group = groups[i % groups.length];
    const status = i < 3 ? MatchStatus.LIVE : i < 6 ? MatchStatus.FINISHED : MatchStatus.SCHEDULED;
    matches.push(
      await prisma.match.create({
        data: {
          homeTeamId: home.id,
          awayTeamId: away.id,
          groupId: group.id,
          date: addDays(i - 2, 17 + (i % 3)),
          stadium: ['Estadio Municipal', 'Unidad Deportiva Central', 'Campo Las Palmas'][i % 3],
          status,
          homeScore: status === MatchStatus.FINISHED || status === MatchStatus.LIVE ? 1 + (i % 3) : null,
          awayScore: status === MatchStatus.FINISHED || status === MatchStatus.LIVE ? i % 2 : null,
          markets: {
            create: [
              { market: 'winner', selection: 'HOME', odds: 1.8 + (i % 3) * 0.12 },
              { market: 'winner', selection: 'DRAW', odds: 3.4 + (i % 2) * 0.2 },
              { market: 'winner', selection: 'AWAY', odds: 2.1 + (i % 4) * 0.1 },
              { market: 'goals', selection: 'OVER_2_5', odds: 1.9 },
              { market: 'goals', selection: 'UNDER_2_5', odds: 1.75 },
              { market: 'btts', selection: 'YES', odds: 1.85 },
              { market: 'btts', selection: 'NO', odds: 1.9 },
              { market: 'exact', selection: '1-0', odds: 7.5 },
            ],
          },
        },
      }),
    );
  }

  for (let i = 0; i < 12; i++) {
    const user = users[(i + 2) % users.length];
    const match = matches[(i + 7) % matches.length];
    const odds = 1.8 + (i % 4) * 0.15;
    const stake = 50 + i * 10;
    const wallet = await prisma.wallet.findUniqueOrThrow({ where: { userId: user.id } });
    if (wallet.balance >= stake) {
      const updatedWallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: stake }, totalLost: { increment: stake } },
      });
      const prediction = await prisma.prediction.create({
        data: {
          code: `TDP-SEED-${String(i + 1).padStart(4, '0')}`,
          userId: user.id,
          matchId: match.id,
          market: 'winner',
          selection: i % 2 === 0 ? 'HOME' : 'AWAY',
          odds,
          stake,
          potentialPrize: Math.floor(stake * odds),
          status: i < 4 ? 'PENDING' : i % 3 === 0 ? 'WON' : 'LOST',
          settledAt: i < 4 ? null : new Date(),
        },
      });
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.BET,
          amount: -stake,
          balanceAfter: updatedWallet.balance,
          description: 'Pronóstico de prueba',
          reference: prediction.code,
        },
      });
      if (prediction.status === 'WON') {
        const payout = prediction.potentialPrize;
        const afterWin = await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: payout }, totalWon: { increment: payout } },
        });
        await prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: WalletTransactionType.WIN,
            amount: payout,
            balanceAfter: afterWin.balance,
            description: 'Premio de pronóstico de prueba',
            reference: prediction.code,
          },
        });
      }
    }
  }

  const leaderboardUsers = await prisma.user.findMany({ include: { wallet: true }, orderBy: { wallet: { balance: 'desc' } }, take: 10 });
  for (let i = 0; i < leaderboardUsers.length; i++) {
    await prisma.leaderboard.upsert({
      where: { userId: leaderboardUsers[i].id },
      update: { score: leaderboardUsers[i].wallet?.balance ?? 0, rank: i + 1 },
      create: { userId: leaderboardUsers[i].id, score: leaderboardUsers[i].wallet?.balance ?? 0, rank: i + 1 },
    });
  }

  console.log('Seed completado. Usuarios:', await prisma.user.count(), 'equipos:', await prisma.team.count(), 'partidos:', await prisma.match.count());
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
