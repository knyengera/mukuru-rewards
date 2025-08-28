import { and, count, desc, eq } from 'drizzle-orm';
import { Router } from 'express';

import { db } from '../db/client';
import { achievements, transactions, userAchievements, users } from '../db/schema';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

// Get unlocked achievements for self
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.user.id;
  const rows = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));
  res.json(rows);
});

export default router;


