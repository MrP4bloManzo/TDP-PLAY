# TDP PLAY
*Fútbol. Pronósticos. Diversión.* — Simulador deportivo y de casino con **TDP Coins** (moneda virtual).

> Esta plataforma es un simulador de entretenimiento. Las TDP Coins son virtuales, no tienen valor monetario y no pueden comprarse, venderse, retirarse ni canjearse por dinero.
> Proyecto demostrativo independiente. No afiliado oficialmente a la Liga TDP.

Sitio 100% estático (Next.js + Tailwind): **sin servidor ni base de datos**. Tu saldo, historial y pronósticos se guardan en el `localStorage` de tu navegador (reinicia desde `/wallet`). Equipos y partidos son datos de prueba.

## Correr local
```bash
npm install
npm run dev        # http://localhost:3000
npm test           # pruebas de blackjack y ruleta
```

## Subir a GitHub y publicar (GitHub Pages)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <URL_DEL_REPO>
git push -u origin main
```
1. En GitHub: **Settings → Pages → Source: GitHub Actions**.
2. Cada push a `main` corre lint, tests y build, y publica en `https://<usuario>.github.io/<repo>/`.
3. Si el repo se llama `<usuario>.github.io`, cambia `NEXT_PUBLIC_BASE_PATH` en `.github/workflows/deploy.yml` a vacío (`""`).
4. Tras tu primer `npm install`, sube también `package-lock.json`.

## Estructura
- `lib/store.ts` — billetera en localStorage (`debit`, `settle`, historial)
- `lib/play.ts` — acciones de blackjack, ruleta y pronósticos
- `services/casino` — lógica pura de blackjack y ruleta (con pruebas en `tests/unit`)
- `lib/data.ts` — equipos y partidos de prueba
- `app/` — páginas: inicio, pronósticos, blackjack, ruleta, ranking, wallet
