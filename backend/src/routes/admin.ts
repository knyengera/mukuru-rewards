import { desc, eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';

import { db } from '../db/client';
import { partners, redemptions, rewards, transactions, users } from '../db/schema';
import { requireAuth, requireRole, type AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('admin'));

// Users
router.get('/users', async (_req, res) => {
  const data = await db.select().from(users).orderBy(desc(users.createdAt));
  res.json(data);
});

// Rewards
const rewardSchema = z.object({ name: z.string(), pointsCost: z.number().int().positive(), description: z.string().optional(), imageUrl: z.string().url().optional(), category: z.string().optional(), stock: z.number().int().optional(), active: z.boolean().optional() });
router.post('/rewards', async (req, res) => {
  const parse = rewardSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const [row] = await db.insert(rewards).values(parse.data as any).returning();
  res.status(201).json(row);
});
router.patch('/rewards/:id', async (req, res) => {
  const id = req.params.id;
  const parse = rewardSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const [row] = await db.update(rewards).set(parse.data as any).where(eq(rewards.id, id)).returning();
  res.json(row);
});

// Redemptions
router.get('/redemptions', async (_req, res) => {
  const data = await db.select().from(redemptions).orderBy(desc(redemptions.createdAt));
  res.json(data);
});

// Partners
const partnerSchema = z.object({ name: z.string(), contactEmail: z.string().email().optional(), active: z.boolean().optional() });
router.get('/partners', async (_req, res) => {
  const data = await db.select().from(partners).orderBy(desc(partners.createdAt));
  res.json(data);
});
router.post('/partners', async (req, res) => {
  const parse = partnerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const [row] = await db.insert(partners).values(parse.data as any).returning();
  res.status(201).json(row);
});
router.patch('/partners/:id', async (req, res) => {
  const id = req.params.id;
  const parse = partnerSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const [row] = await db.update(partners).set(parse.data as any).where(eq(partners.id, id)).returning();
  res.json(row);
});

// Transactions
router.get('/transactions', async (_req: AuthRequest, res) => {
  const data = await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  res.json(data);
});

export default router;


