import { AlertTriangle } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

export function SimBanner() {
  return <Alert className="mb-6 flex items-start gap-3">
    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
    <div>
      <p className="font-semibold text-white">SIMULACIÓN</p>
      <p>Esta plataforma es un simulador de entretenimiento. Las TDP Coins son virtuales, no tienen valor monetario y no pueden comprarse, venderse, retirarse ni canjearse por dinero.</p>
      <p className="mt-1 text-xs text-white/50">Proyecto demostrativo independiente. No afiliado oficialmente a la Liga TDP.</p>
    </div>
  </Alert>;
}
