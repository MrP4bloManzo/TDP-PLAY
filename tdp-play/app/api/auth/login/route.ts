import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { sign, err, limited } from '@/lib/auth'
export async function POST(req: NextRequest) {
  if (limited('login:' + (req.headers.get('x-forwarded-for') ?? 'local'), 10)) return err('Demasiados intentos', 429)
  const p = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(await req.json().catch(() => null))
  if (!p.success) return err('Datos inválidos')
  const u = await prisma.user.findUnique({ where: { email: p.data.email } })
  if (!u || !(await bcrypt.compare(p.data.password, u.passwordHash))) return err('Credenciales incorrectas', 401)
  return NextResponse.json({ token: sign({ id: u.id, role: u.role }), user: { username: u.username } })
}
