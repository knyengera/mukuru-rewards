import { and, desc, eq } from 'drizzle-orm';
import { Router } from 'express';

import { db } from '../db/client';
import { pointsLedger, transactions, users } from '../db/schema';

const router = Router();

router.get('/:id/balance', async (req, res) => {
  const userId = req.params.id;
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

router.get('/:id/history', async (req, res) => {
  const userId = req.params.id;
  const limit = Number(req.query.limit ?? 50);
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


