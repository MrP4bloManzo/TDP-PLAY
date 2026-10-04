import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SimBanner } from './SimBanner';

export function AppShell({ children, showBanner = true }: { children: ReactNode; showBanner?: boolean }) {
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,.09),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,.06),transparent_25%),#050b08] text-white">
    <Header />
    <main className="mx-auto max-w-[1500px] px-4 py-6 pb-24 lg:px-6">{showBanner && <SimBanner />}{children}</main>
    <BottomNav />
  </div>;
}
