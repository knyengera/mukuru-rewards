import 'dotenv/config';
import { eq } from 'drizzle-orm';

import { db, pool } from '../db/client';
import {
  kycs,
  partners,
  pointsLedger,
  redemptions,
  rewards,
  transactions,
  users,
} from '../db/schema';
import { hashPassword } from '../lib/crypto';
import { calculateBasePoints, determineTier, applyTierMultiplier } from '../lib/points';

async function upsertUser(name: string, email: string, role: 'client' | 'admin') {
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length) return existing[0];
  const passwordHash = await hashPassword('Password123!');
  const [row] = await db
    .insert(users)
    .values({ name, email, passwordHash, role, tier: 'bronze', lifetimePoints: 0 })
    .returning();
  return row;
}

async function awardPoints(userId: string, amount: number, currency: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return;
  const base = calculateBasePoints(amount);
  const tier = determineTier(user.lifetimePoints);
  const earned = applyTierMultiplier(base, tier);
  const [tx] = await db
    .insert(transactions)
    .values({ userId, amount: String(amount), currency })
    .returning();
  await db.insert(pointsLedger).values({
    userId,
    transactionId: tx.id,
    type: 'credit',
    points: earned,
    reason: `Seed earn ${currency} ${amount}`,
  });
  const newLifetime = user.lifetimePoints + earned;
  const newTier = determineTier(newLifetime);
  await db.update(users).set({ lifetimePoints: newLifetime, tier: newTier }).where(eq(users.id, userId));
}

async function redeemReward(userId: string, rewardId: string) {
  const [reward] = await db.select().from(rewards).where(eq(rewards.id, rewardId));
  if (!reward || !reward.active) return;
  await db
    .insert(redemptions)
    .values({ userId, rewardId, pointsSpent: reward.pointsCost, status: 'completed' })
    .returning();
  await db.insert(pointsLedger).values({
    userId,
    type: 'debit',
    points: reward.pointsCost,
    reason: `Seed redeem ${reward.name}`,
  });
}

async function main() {
  console.log('Seeding database...');

  // Users
  const admin = await upsertUser('Admin User', 'admin@mukuru.local', 'admin');
  const alice = await upsertUser('Alice Client', 'alice@mukuru.local', 'client');
  const bob = await upsertUser('Bob Client', 'bob@mukuru.local', 'client');

  // Partners
  const existingPartners = await db.select().from(partners);
  if (existingPartners.length === 0) {
    await db.insert(partners).values([
      { name: 'AirtimeCo', contactEmail: 'ops@airtime.co', active: true },
      { name: 'DataBundle Inc.', contactEmail: 'support@data.example', active: true },
    ]);
  }

  // Rewards
  const existingRewards = await db.select().from(rewards);
  if (existingRewards.length === 0) {
    await db.insert(rewards).values([
      { name: 'R10 Airtime', description: 'Mobile top-up', pointsCost: 50, category: 'airtime', active: true },
      { name: 'R5 Data', description: 'Data bundle', pointsCost: 30, category: 'data', active: true },
      { name: 'Sticker Pack', description: 'Digital goodies', pointsCost: 20, category: 'digital', active: true },
    ]);
  }
  const rewardsList = await db.select().from(rewards);

  // Transactions and earning
  await awardPoints(alice.id, 500, 'ZAR');
  await awardPoints(alice.id, 1200, 'ZAR');
  await awardPoints(bob.id, 300, 'ZAR');
  await awardPoints(bob.id, 900, 'ZAR');

  // Redemptions
  if (rewardsList.length) {
    await redeemReward(alice.id, rewardsList[0].id);
  }

  // KYC
  const existingKycAlice = await db.select().from(kycs).where(eq(kycs.userId, alice.id));
  if (existingKycAlice.length === 0) {
    await db.insert(kycs).values({
      userId: alice.id,
      status: 'approved',
      firstName: 'Alice',
      lastName: 'Client',
      idNumber: 'ALC123456',
      country: 'ZA',
      documentType: 'ID',
      documentNumber: 'ID-ALC-123',
      documentUrl: 'https://example.com/docs/alice-id.pdf',
      notes: 'Seed approved',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    });
  }
  const existingKycBob = await db.select().from(kycs).where(eq(kycs.userId, bob.id));
  if (existingKycBob.length === 0) {
    await db.insert(kycs).values({
      userId: bob.id,
      status: 'pending',
      firstName: 'Bob',
      lastName: 'Client',
      idNumber: 'BOB987654',
      country: 'ZA',
      documentType: 'Passport',
      documentNumber: 'P-BOB-987',
      documentUrl: 'https://example.com/docs/bob-passport.pdf',
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });


