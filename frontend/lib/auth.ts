import { getAuthToken } from '@/lib/api';

export type JwtPayload = { sub?: string; role?: string; scope?: string; [k: string]: unknown } | null;

export function getTokenPayload(): JwtPayload {
  if (typeof window === 'undefined') return null;
  const token = getAuthToken();
  if (!token) return null;
  try {
    const base64 = token.split('.')[1] || '';
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}


