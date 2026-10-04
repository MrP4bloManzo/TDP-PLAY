import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TDP PLAY | Simulador Deportivo',
  description: 'Simulador deportivo y de casino con TDP Coins virtuales.',
  openGraph: { title: 'TDP PLAY | Simulador Deportivo', description: 'Fútbol · Pronósticos · Diversión.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
