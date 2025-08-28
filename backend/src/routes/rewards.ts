import { eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';

import { db } from '../db/client';
import { pointsLedger, redemptions, rewards, users } from '../db/schema';
import { sendEmail } from '../lib/email';
import { rewardRedeemedEmail } from '../emails/templates';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await db.select().from(rewards).where(eq(rewards.active, true));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const redeemSchema = z.object({ rewardId: z.string().uuid() });

router.post('/redeem', requireAuth, async (req: AuthRequest, res) => {
  const parse = redeemSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { rewardId } = parse.data;
  const authedUserId = req.user?.id;
  if (!authedUserId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const [user] = await db.select().from(users).where(eq(users.id, authedUserId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [reward] = await db.select().from(rewards).where(eq(rewards.id, rewardId));
    if (!reward || !reward.active) return res.status(404).json({ error: 'Reward not available' });

    const credits = await db.select({ p: pointsLedger.points }).from(pointsLedger).where(eq(pointsLedger.userId, authedUserId));
    const debits = await db
      .select({ p: pointsLedger.points })
      .from(pointsLedger)
      .where(eq(pointsLedger.userId, authedUserId));
    const currentBalance = credits.reduce((s, r) => s + r.p, 0) - debits.reduce((s, r) => s + r.p, 0);
    if (currentBalance < reward.pointsCost) return res.status(400).json({ error: 'Insufficient points' });

    const [redemption] = await db
      .insert(redemptions)
      .values({ userId: authedUserId, rewardId, pointsSpent: reward.pointsCost, status: 'completed' })
      .returning();

    await db.insert(pointsLedger).values({
      userId: authedUserId,
      type: 'debit',
      points: reward.pointsCost,
      reason: `Redeem ${reward.name}`,
    });

    try {
      const { subject, html } = rewardRedeemedEmail(reward.name, reward.pointsCost);
      await sendEmail({ to: user.email, subject, html });
    } catch (_ignored) {}

    res.json({ redemption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;


