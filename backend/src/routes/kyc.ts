import { and, desc, eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';

import { db } from '../db/client';
import { kycs, users } from '../db/schema';
import { requireAuth, requireRole, type AuthRequest } from '../middleware/auth';

const router = Router();

// Submit or update KYC (user)
const submitSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  idNumber: z.string().min(4),
  country: z.string().min(2),
  documentType: z.string().min(2),
  documentNumber: z.string().min(2),
  documentUrl: z.string().url().optional(),
});

router.post('/submit', requireAuth, async (req: AuthRequest, res) => {
  const parse = submitSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.user.id;
  try {
    const existing = await db.select().from(kycs).where(eq(kycs.userId, userId));
    if (existing.length) {
      const [row] = await db
        .update(kycs)
        .set({ ...parse.data, status: 'pending', submittedAt: new Date(), reviewedAt: null as any, reviewedBy: null as any })
        .where(eq(kycs.userId, userId))
        .returning();
      return res.json(row);
    }
    const [row] = await db.insert(kycs).values({ userId, ...parse.data }).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get own KYC (user)
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.user.id;
  try {
    const [row] = await db.select().from(kycs).where(eq(kycs.userId, userId));
    res.json(row || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin: list KYC submissions
router.get('/admin/list', requireAuth, requireRole('admin'), async (_req, res) => {
  const rows = await db.select().from(kycs).orderBy(desc(kycs.submittedAt));
  res.json(rows);
});

// Admin: review KYC
const reviewSchema = z.object({ status: z.enum(['approved', 'rejected']), notes: z.string().optional() });
router.post('/admin/review/:userId', requireAuth, requireRole('admin'), async (req: AuthRequest, res) => {
  const parse = reviewSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const targetUserId = req.params.userId;
  const reviewerId = req.user?.id;
  try {
    const [row] = await db
      .update(kycs)
      .set({ status: parse.data.status, reviewedAt: new Date(), reviewedBy: reviewerId!, notes: parse.data.notes })
      .where(eq(kycs.userId, targetUserId))
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;


