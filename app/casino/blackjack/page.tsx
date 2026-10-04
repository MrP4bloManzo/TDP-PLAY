import { AppShell } from '@/components/layout/AppShell';
import { BlackjackTable } from '@/components/casino/BlackjackTable';
import { requireUser } from '@/lib/auth/session';

export default async function BlackjackPage(){const user=await requireUser();return <AppShell><div className="mb-5"><div className="text-sm text-green-400">CASINO VIRTUAL</div><h1 className="text-3xl font-black">Blackjack</h1></div><BlackjackTable initialBalance={user.wallet?.balance??0}/></AppShell>}
