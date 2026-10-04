import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { sign, err, limited } from '@/lib/auth'
const S = z.object({ name: z.string().min(2).max(60), username: z.string().regex(/^[a-z0-9_]{3,20}$/i), email: z.string().email(), password: z.string().min(8).max(100) })
export async function POST(req: NextRequest) {
  if (limited('reg:' + (req.headers.get('x-forwarded-for') ?? 'local'), 5)) return err('Demasiados intentos', 429)
  const p = S.safeParse(await req.json().catch(() => null))
  if (!p.success) return err('Datos inválidos')
  try {
    const u = await prisma.user.create({ data: { ...p.data, password: undefined, passwordHash: await bcrypt.hash(p.data.password, 10), wallet: { create: {} } } as never })
    return NextResponse.json({ token: sign({ id: u.id, role: u.role }), user: { username: u.username } })
  } catch { return err('Usuario o correo ya registrado', 409) }
}
