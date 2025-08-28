import { eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';

import { db } from '../db/client';
import { achievements, pointsLedger, transactions, userAchievements, users } from '../db/schema';
import { calculateBasePoints, determineTier, applyTierMultiplier } from '../lib/points';
import { sendEmail } from '../lib/email';
import { transactionSentEmail } from '../emails/templates';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

const sendSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('ZAR'),
});

router.post('/send', requireAuth, async (req: AuthRequest, res) => {
  const parse = sendSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { amount, currency } = parse.data;
  const authedUserId = req.user?.id;
  if (!authedUserId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Create transaction
    const [tx] = await db
      .insert(transactions)
      .values({ userId: authedUserId, amount: String(amount), currency })
      .returning();

    // Fetch user for tier
    const [user] = await db.select().from(users).where(eq(users.id, authedUserId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const base = calculateBasePoints(amount);
    const tier = determineTier(user.lifetimePoints);
    const earned = applyTierMultiplier(base, tier);

    // Ledger credit
    await db.insert(pointsLedger).values({
      userId: authedUserId,
      transactionId: tx.id,
      type: 'credit',
      points: earned,
      reason: `Send ${currency} ${amount}`,
    });

    // Update lifetime points and tier if needed
    const newLifetime = user.lifetimePoints + earned;
    const newTier = determineTier(newLifetime);
    await db.update(users).set({ lifetimePoints: newLifetime, tier: newTier }).where(eq(users.id, authedUserId));

    try {
      const { subject, html } = transactionSentEmail(amount, currency, earned);
      await sendEmail({ to: user.email, subject, html });
    } catch (_ignored) {}

    // Simple achievement unlocks
    try {
      // First Flight!: first transaction
      const priorTx = await db.select().from(transactions).where(eq(transactions.userId, authedUserId));
      if (priorTx.length === 1) {
        const [ach] = await db.select().from(achievements).where(eq(achievements.code, 'first_flight'));
        if (ach) {
          await db.insert(userAchievements).values({ userId: authedUserId, achievementId: ach.id });
        }
      }
      // High Flier!: send over R1000 in one go
      if (amount >= 1000) {
        const [ach] = await db.select().from(achievements).where(eq(achievements.code, 'high_flier'));
        if (ach) {
          await db.insert(userAchievements).values({ userId: authedUserId, achievementId: ach.id });
        }
      }
      // Frequent Flyer!: 5+ sends
      if (priorTx.length >= 5) {
        const [ach] = await db
          .select()
          .from(achievements)
          .where(eq(achievements.code, 'frequent_flyer'));
        if (ach) {
          await db.insert(userAchievements).values({ userId: authedUserId, achievementId: ach.id });
        }
      }
    } catch (_ignored) {}

    res.json({
      transaction: tx,
      pointsEarned: earned,
      tier: newTier,
      message: 'Transaction processed and points awarded',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;


