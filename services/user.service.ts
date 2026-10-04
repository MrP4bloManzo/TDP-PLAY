import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email }, include: { wallet: true } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function registerUser(name: string, username: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: { name, username, email, passwordHash, wallet: { create: { balance: 10_000 } } },
    include: { wallet: true },
  });
}
