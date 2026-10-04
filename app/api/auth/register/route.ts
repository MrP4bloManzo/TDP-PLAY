import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/auth';
import { registerUser } from '@/services/user.service';
import { signSession } from '@/lib/auth/jwt';
import { authCookie } from '@/lib/auth/session';
import { rateLimit } from '@/lib/auth/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'local';
    if (!rateLimit(`register:${ip}`, 10, 60_000).ok) return NextResponse.json({ error: 'Demasiadas solicitudes.' }, { status: 429 });
    const input = registerSchema.parse(await request.json());
    const user = await registerUser(input.name, input.username, input.email, input.password);
    const token = await signSession({ userId: user.id, email: user.email, username: user.username, role: user.role });
    const response = NextResponse.json({ user: { id: user.id, name: user.name, username: user.username, role: user.role } }, { status: 201 });
    response.cookies.set(authCookie.name, token, authCookie.options);
    return response;
  } catch (error: any) {
    const message = error?.code === 'P2002' ? 'El email o username ya está registrado.' : error?.issues ? error.issues[0]?.message : 'No se pudo crear la cuenta.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
