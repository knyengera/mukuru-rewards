import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';

import { db } from '../db/client';
import { pointsLedger, redemptions, users } from '../db/schema';

const router = Router();

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  type: z.enum(['earned', 'redeemed']).optional(),
  range: z.enum(['weekly', 'all']).optional(),
});

// Leaderboard by rewards count (completed redemptions)
router.get('/rewards', async (req, res) => {
  const parse = querySchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const limit = parse.data.limit ?? 50;
  const type = parse.data.type ?? 'earned';
  const range = parse.data.range ?? 'weekly';

  try {
    if (type === 'redeemed') {
      const countExpr = sql<number>`count(${redemptions.id})`;
      const rows = await db
        .select({ userId: users.id, name: users.name, email: users.email, rewardsCount: countExpr })
        .from(users)
        .leftJoin(
          redemptions,
          and(eq(redemptions.userId, users.id), eq(redemptions.status, 'completed')),
        )
        .groupBy(users.id)
        .orderBy(desc(countExpr))
        .limit(limit);
      return res.json(rows);
    }

    // type === 'earned' (default): sum of credited points, weekly by default
    const sumExpr = sql<number>`coalesce(sum(${pointsLedger.points}), 0)`;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const whereJoin =
      range === 'weekly'
        ? and(
            eq(pointsLedger.userId, users.id),
            eq(pointsLedger.type, 'credit'),
            gte(pointsLedger.createdAt, weekAgo),
          )
        : and(eq(pointsLedger.userId, users.id), eq(pointsLedger.type, 'credit'));

    const rows = await db
      .select({ userId: users.id, name: users.name, email: users.email, pointsEarned: sumExpr })
      .from(users)
      .leftJoin(pointsLedger, whereJoin)
      .groupBy(users.id)
      .orderBy(desc(sumExpr))
      .limit(limit);

    return res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;


