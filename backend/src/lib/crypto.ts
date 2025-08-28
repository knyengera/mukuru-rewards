import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

export function generateToken(bytes: number = 32): string {
  return randomBytes(bytes).toString('hex');
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}


