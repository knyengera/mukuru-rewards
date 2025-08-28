import { eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';

import { db } from '../db/client';
import { pointsLedger, transactions, users } from '../db/schema';
import { calculateBasePoints, determineTier, applyTierMultiplier } from '../lib/points';
import { sendEmail } from '../lib/email';
import { transactionSentEmail } from '../emails/templates';

const router = Router();

const sendSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('ZAR'),
});

router.post('/send', async (req, res) => {
  const parse = sendSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { userId, amount, currency } = parse.data;

  try {
    // Create transaction
    const [tx] = await db
      .insert(transactions)
      .values({ userId, amount: String(amount), currency })
      .returning();

    // Fetch user for tier
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const base = calculateBasePoints(amount);
    const tier = determineTier(user.lifetimePoints);
    const earned = applyTierMultiplier(base, tier);

    // Ledger credit
    await db.insert(pointsLedger).values({
      userId,
      transactionId: tx.id,
      type: 'credit',
      points: earned,
      reason: `Send ${currency} ${amount}`,
    });

    // Update lifetime points and tier if needed
    const newLifetime = user.lifetimePoints + earned;
    const newTier = determineTier(newLifetime);
    await db.update(users).set({ lifetimePoints: newLifetime, tier: newTier }).where(eq(users.id, userId));

    try {
      const { subject, html } = transactionSentEmail(amount, currency, earned);
      await sendEmail({ to: user.email, subject, html });
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


