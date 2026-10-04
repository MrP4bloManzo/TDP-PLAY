import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage(){return <div className="grid min-h-screen place-items-center bg-[#050b08] p-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>Recuperación de cuenta</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm leading-6 text-white/55">En esta demo no se envían correos reales. Escribe tu email para validar la interfaz de recuperación.</p><Input placeholder="Correo" type="email"/><Button className="w-full" onClick={() => undefined}>Solicitar enlace</Button><Link href="/login" className="block text-center text-xs text-white/45">Volver al login</Link></CardContent></Card></div>}
