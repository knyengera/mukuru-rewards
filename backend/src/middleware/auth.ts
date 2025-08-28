import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../lib/jwt';

export interface AuthRequest extends Request {
  user?: { id: string; role?: 'client' | 'admin' };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = verifyJwt<{ sub: string; role?: 'client' | 'admin' }>(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireRole(role: 'admin' | 'client') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (role === 'admin' && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}


