import { and, desc, eq } from 'drizzle-orm';
import { Router } from 'express';

import { db } from '../db/client';
import { pointsLedger, transactions, users } from '../db/schema';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/:id/balance', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.params.id;
  const authed = req.user;
  if (!authed) return res.status(401).json({ error: 'Unauthorized' });
  if (authed.role !== 'admin' && authed.id !== userId) return res.status(403).json({ error: 'Forbidden' });
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const credits = await db
      .select({ points: pointsLedger.points })
      .from(pointsLedger)
      .where(and(eq(pointsLedger.userId, userId), eq(pointsLedger.type, 'credit')));
    const debits = await db
      .select({ points: pointsLedger.points })
      .from(pointsLedger)
      .where(and(eq(pointsLedger.userId, userId), eq(pointsLedger.type, 'debit')));

    const balance = credits.reduce((sum, r) => sum + r.points, 0) - debits.reduce((sum, r) => sum + r.points, 0);

    res.json({ balance, tier: user.tier, lifetimePoints: user.lifetimePoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id/history', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.params.id;
  const limit = Number(req.query.limit ?? 50);
  const authed = req.user;
  if (!authed) return res.status(401).json({ error: 'Unauthorized' });
  if (authed.role !== 'admin' && authed.id !== userId) return res.status(403).json({ error: 'Forbidden' });
  try {
    const txs = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);

    const ledger = await db
      .select()
      .from(pointsLedger)
      .where(eq(pointsLedger.userId, userId))
      .orderBy(desc(pointsLedger.createdAt))
      .limit(limit);

    res.json({ transactions: txs, ledger });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;


