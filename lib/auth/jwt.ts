import { SignJWT, jwtVerify } from 'jose';

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error('AUTH_SECRET no está configurado');
  return new TextEncoder().encode(value);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret());
  return payload as unknown as SessionPayload;
}
