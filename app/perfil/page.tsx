import { AppShell } from '@/components/layout/AppShell';
import { requireUser } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function ProfilePage(){const user=await requireUser();return <AppShell><h1 className="text-3xl font-black">Perfil</h1><div className="mt-6 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><Card><CardContent><div className="grid size-16 place-items-center rounded-2xl bg-green-500 text-xl font-black text-black">{user.username.slice(0,1).toUpperCase()}</div><div className="mt-4 text-xl font-black">{user.name}</div><div className="text-sm text-white/45">@{user.username}</div><div className="mt-4 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs">Nivel {user.level}</div></CardContent></Card><Card><CardHeader><CardTitle>Seguridad</CardTitle></CardHeader><CardContent className="space-y-3"><div className="rounded-xl bg-white/[.03] p-3 text-sm text-white/60">Sesión segura con cookie HttpOnly y JWT firmado.</div><Button variant="secondary" disabled>Cambiar contraseña (demo)</Button></CardContent></Card></div></AppShell>}
