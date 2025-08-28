import jwt, { type JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';

function getJwtSecret(): Secret {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET not set');
  return s as Secret;
}

export function signJwt(payload: object, expiresIn: SignOptions['expiresIn'] = '7d') : string {
  const secret: Secret = getJwtSecret();
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

export function verifyJwt<T extends object | string = JwtPayload>(token: string): T {
  const secret: Secret = getJwtSecret();
  return jwt.verify(token, secret) as T;
}


