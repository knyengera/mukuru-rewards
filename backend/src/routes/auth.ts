import { Router } from 'express';
import { z } from 'zod';
import { and, eq, gt } from 'drizzle-orm';

import { db } from '../db/client';
import { users } from '../db/schema';
import { comparePassword, generateToken, hashPassword } from '../lib/crypto';
import { sendEmail } from '../lib/email';
import { signJwt } from '../lib/jwt';
import { forgotPasswordEmail, registrationVerifyEmail, resetPasswordConfirmationEmail } from '../emails/templates';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { name, email, password } = parse.data;
  try {
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await hashPassword(password);
    const verificationToken = generateToken(24);
    const [user] = await db
      .insert(users)
      .values({ name, email, passwordHash, verificationToken, role: 'client' })
      .returning();

    const appBase = process.env.APP_BASE_URL || 'http://localhost:3000';
    const verifyUrl = `${appBase}/verify?token=${verificationToken}`;
    try {
      const { subject, html } = registrationVerifyEmail(verifyUrl);
      await sendEmail({ to: email, subject, html });
    } catch (e) {
      // Non-fatal in dev; keep user created
    }
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
router.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.emailVerifiedAt) return res.status(403).json({ error: 'Email not verified' });
    const token = signJwt({ sub: user.id, role: user.role, scope: user.role });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/verify', async (req, res) => {
  const token = String(req.query.token || '');
  if (!token) return res.status(400).json({ error: 'Missing token' });
  try {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    if (!user) return res.status(400).json({ error: 'Invalid token' });
    await db
      .update(users)
      .set({ emailVerifiedAt: new Date(), verificationToken: null as any })
      .where(eq(users.id, user.id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const forgotSchema = z.object({ email: z.string().email() });
router.post('/forgot-password', async (req, res) => {
  const parse = forgotSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email } = parse.data;
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.json({ success: true });
    const token = generateToken(24);
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await db
      .update(users)
      .set({ passwordResetToken: token, passwordResetExpires: expires })
      .where(eq(users.id, user.id));
    const appBase = process.env.APP_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${appBase}/reset-password?token=${token}`;
    try {
      const { subject, html } = forgotPasswordEmail(resetUrl);
      await sendEmail({ to: email, subject, html });
    } catch (_ignored) {}
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const resetSchema = z.object({ token: z.string().min(10), password: z.string().min(8) });
router.post('/reset-password', async (req, res) => {
  const parse = resetSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { token, password } = parse.data;
  try {
    const now = new Date();
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.passwordResetToken, token), gt(users.passwordResetExpires, now)));
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    const passwordHash = await hashPassword(password);
    await db
      .update(users)
      .set({ passwordHash, passwordResetToken: null as any, passwordResetExpires: null as any })
      .where(eq(users.id, user.id));
    try {
      const { subject, html } = resetPasswordConfirmationEmail();
      await sendEmail({ to: user.email, subject, html });
    } catch (_ignored) {}
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;


