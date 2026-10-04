import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_APP_URL??'http://localhost:3000'; return ['/','/partidos','/equipos','/pronosticos','/ranking','/estadisticas','/casino/blackjack','/casino/roulette'].map(path=>({url:`${base}${path}`,lastModified:new Date()})); }
