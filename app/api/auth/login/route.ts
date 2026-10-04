import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';
import { authenticate } from '@/services/user.service';
import { signSession } from '@/lib/auth/jwt';
import { authCookie } from '@/lib/auth/session';
import { rateLimit } from '@/lib/auth/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'local';
    if (!rateLimit(`login:${ip}`, 20, 60_000).ok) return NextResponse.json({ error: 'Demasiados intentos. Espera un momento.' }, { status: 429 });
    const input = loginSchema.parse(await request.json());
    const user = await authenticate(input.email, input.password);
    if (!user) return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    const token = await signSession({ userId: user.id, email: user.email, username: user.username, role: user.role });
    const response = NextResponse.json({ user: { id: user.id, name: user.name, username: user.username, role: user.role } });
    response.cookies.set(authCookie.name, token, authCookie.options);
    return response;
  } catch { return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 }); }
}
