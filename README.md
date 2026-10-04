# TDP PLAY

**TDP PLAY** es una aplicación web full stack de demostración que combina portal deportivo, pronósticos, ranking, estadísticas y casino con una moneda exclusivamente virtual llamada **TDP Coins**.

> **SIMULACIÓN:** Esta plataforma es un simulador de entretenimiento. Las TDP Coins son virtuales, no tienen valor monetario y no pueden comprarse, venderse, retirarse ni canjearse por dinero.
>
> **Proyecto demostrativo independiente. No afiliado oficialmente a la Liga TDP.**

No se incluyen pagos, depósitos, retiros, criptomonedas, Stripe, PayPal, Mercado Pago ni conversión de créditos a dinero. Los datos deportivos son de prueba y los equipos/escudos de demostración son ficticios.

## Características

- Next.js App Router + TypeScript + Tailwind CSS.
- Autenticación con JWT en cookie HttpOnly y contraseñas hasheadas con bcryptjs.
- PostgreSQL + Prisma.
- Dashboard de usuario y wallet virtual.
- Partidos, equipos, grupos y estadísticas de demostración.
- Pronósticos y Bet Slip con cuotas simuladas.
- Blackjack y ruleta europea con autoridad del servidor.
- Ranking Top 10.
- Panel de administración protegido por rol.
- Validación con Zod y rate limiting básico.
- Vitest + Playwright.
- Docker Compose para PostgreSQL.
- GitHub Actions para lint, tests y build.
- Metadata SEO, manifest, robots y sitemap.
- Responsive desktop/mobile con navegación inferior en móvil.

## Tecnologías

Next.js 16+, React 19, TypeScript, Tailwind CSS, componentes inspirados en shadcn/ui, Lucide, Framer Motion-ready architecture, Recharts, Prisma, PostgreSQL, JWT/Jose, bcryptjs, Zod, Vitest y Playwright.

## Requisitos

- Node.js 20.9+ (recomendado Node 22 LTS).
- PostgreSQL 16+ o Docker.
- npm 10+.

## Instalación

```bash
git clone <repository-url>
cd tdp-play
npm install
```

## Variables de entorno

```bash
cp .env.example .env.local
```

Variables:

- `DATABASE_URL`: URL de PostgreSQL.
- `AUTH_SECRET`: secreto usado para firmar sesiones JWT.
- `NEXT_PUBLIC_APP_NAME`: nombre visible de la app.
- `NEXT_PUBLIC_APP_URL`: URL pública/local para metadata y sitemap.

## Base de datos con Docker

```bash
docker compose up -d
```

Después:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## Ejecutar

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Cuentas de desarrollo

Cuenta usuario:

```text
email: demo@tdpplay.local
password: Demo123!
```

Cuenta administrador:

```text
email: admin@tdpplay.local
password: Admin123!
```

Estas cuentas son exclusivamente de desarrollo y no contienen credenciales reales.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:check
npm run test
npm run test:watch
npm run test:e2e
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
```

## Seguridad

- Passwords con bcryptjs.
- Sesiones JWT con cookie HttpOnly, `sameSite=lax` y `secure` en producción.
- Autorización server-side por rol.
- Validación Zod de payloads.
- Rate limiting para login/registro.
- Los resultados de Blackjack y Ruleta se generan en servidor.
- El saldo nunca se acepta desde el frontend como fuente de verdad.
- Las operaciones de wallet se hacen con transacciones Prisma.
- Secretos solo vía variables de entorno.
- Errores internos no se muestran al usuario.

## Estructura

```text
tdp-play/
├── app/
│   ├── admin/
│   ├── api/
│   ├── casino/
│   ├── equipos/
│   ├── partidos/
│   ├── pronosticos/
│   ├── ranking/
│   ├── perfil/
│   ├── dashboard/
│   ├── login/
│   ├── registro/
│   ├── wallet/
│   ├── estadisticas/
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.ts
│   ├── robots.ts
│   ├── sitemap.ts
│   └── page.tsx
├── components/
├── lib/
├── services/
├── prisma/
├── public/
├── tests/
├── .github/workflows/ci.yml
├── docker-compose.yml
├── package.json
└── README.md
```

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/matches`
- `GET /api/matches/:id`
- `POST /api/predictions`
- `GET /api/predictions`
- `GET /api/wallet`
- `GET /api/wallet/history`
- `POST /api/casino/blackjack/start`
- `POST /api/casino/blackjack/action`
- `POST /api/casino/roulette/play`
- `GET /api/ranking`
- `GET /api/admin/users`
- `GET /api/admin/matches`
- `GET /api/admin/statistics`
- `POST /api/admin/users`
- `PATCH/DELETE /api/admin/users/:id`
- `GET/POST /api/admin/teams`
- `PATCH/DELETE /api/admin/teams/:id`
- `GET/POST /api/admin/groups`
- `PATCH/DELETE /api/admin/groups/:id`
- `GET/POST /api/admin/matches`
- `PATCH/DELETE /api/admin/matches/:id` (al marcar un partido como FINISHED, resuelve los pronósticos PENDING según el marcador)

## Testing

Unit tests:

```bash
npm run test
```

E2E:

```bash
npm run test:e2e
```

## Build

```bash
npm run build
npm run start
```

## Docker

Docker se usa para PostgreSQL. La aplicación Next.js se ejecuta localmente con Node para mantener el flujo de desarrollo sencillo.

## GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <GITHUB_REPOSITORY_URL>
git push -u origin main
```

`.gitignore` bloquea `.env`, `.env.local`, `node_modules`, `.next`, coverage, logs y artefactos de pruebas.

## Aviso legal

TDP PLAY es un proyecto demostrativo independiente. Las referencias públicas a la estructura de la Liga TDP se usan exclusivamente como inspiración para la organización deportiva. El proyecto no afirma pertenencia, patrocinio, autorización ni asociación oficial. No utiliza logotipos oficiales ni fotografías protegidas.

> **Nota de CI:** el entorno de construcción usado para preparar esta entrega no pudo acceder al registro npm para generar `package-lock.json`. Por ello, el workflow usa `npm install` en vez de `npm ci`. Después de ejecutar `npm install` en un entorno con acceso al registro y confirmar el `package-lock.json`, puedes cambiar esa línea del workflow a `npm ci` para un CI determinista.
