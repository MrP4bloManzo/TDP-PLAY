import { AppShell } from '@/components/layout/AppShell';
import { PredictionBoard } from '@/components/sports/PredictionBoard';
import { Badge } from '@/components/ui/badge';

export default function PredictionsPage(){return <AppShell><div className="flex items-end justify-between"><div><div className="text-sm text-green-400">Mercados virtuales</div><h1 className="text-3xl font-black">Pronósticos</h1></div><Badge variant="warning">TDP Coins</Badge></div><div className="mt-6"><PredictionBoard /></div></AppShell>}
