# TDP PLAY
*Fútbol. Pronósticos. Diversión.* — Simulador deportivo y de casino con **TDP Coins** (moneda virtual sin valor monetario).

> Esta plataforma es un simulador de entretenimiento. Las TDP Coins son virtuales, no tienen valor monetario y no pueden comprarse, venderse, retirarse ni canjearse por dinero.
> Proyecto demostrativo independiente. No afiliado oficialmente a la Liga TDP.

## Tecnologías
Next.js (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Zod · JWT + bcrypt · Vitest · Playwright

## Instalación
Requisitos: Node.js LTS, npm, Docker (o PostgreSQL local).
```bash
npm install
cp .env.example .env.local   # DATABASE_URL, AUTH_SECRET
cp .env.local .env           # Prisma CLI lee .env
docker compose up -d
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev                  # http://localhost:3000
```
Cuentas de desarrollo: `demo@tdpplay.local / Demo123!` · `admin@tdpplay.local / Admin123!`

## Scripts
`npm run lint` · `npm run test` · `npm run test:e2e` · `npm run build && npm run start`

## Estructura
- `services/wallet` — único punto que modifica saldo (transacciones Prisma, historial)
- `services/casino` — blackjack y ruleta (el servidor es la autoridad; baraja y resultado nunca salen del backend)
- `services/sports` — liquidación de pronósticos
- `app/api` — API REST · `components/` — UI · `prisma/` — esquema y seed · `tests/` — unit y e2e

## Seguridad
Contraseñas con bcrypt, JWT firmado con `AUTH_SECRET`, validación Zod en cada endpoint, rate limiting en login/registro (en memoria; usa Redis al desplegar en varias instancias), roles USER/ADMIN, headers de seguridad en `next.config.ts`. Nunca subas `.env`.

## Estado
Implementado: API completa de juego/pronósticos, blackjack, ruleta, ranking, inicio, seed, CI y Docker.
Pendiente: pantallas de pronósticos/boleto, wallet, dashboard, equipos, estadísticas y admin; PWA/SEO; más tests.
