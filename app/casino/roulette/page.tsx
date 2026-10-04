import { AppShell } from '@/components/layout/AppShell';
import { RouletteWheel } from '@/components/casino/RouletteWheel';
import { requireUser } from '@/lib/auth/session';

export default async function RoulettePage(){const user=await requireUser();return <AppShell><div className="mb-5"><div className="text-sm text-red-300">CASINO VIRTUAL</div><h1 className="text-3xl font-black">Ruleta europea</h1></div><RouletteWheel initialBalance={user.wallet?.balance??0}/></AppShell>}
