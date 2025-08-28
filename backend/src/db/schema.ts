import { pgEnum, pgTable, text, timestamp, integer, boolean, numeric, uuid } from 'drizzle-orm/pg-core';

export const ledgerTypeEnum = pgEnum('ledger_type', ['credit', 'debit']);
export const redemptionStatusEnum = pgEnum('redemption_status', ['pending', 'completed', 'cancelled']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  tier: text('tier').notNull().default('bronze'),
  lifetimePoints: integer('lifetime_points').notNull().default(0),
  emailVerifiedAt: timestamp('email_verified_at').$type<Date | null>(),
  verificationToken: text('verification_token'),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires').$type<Date | null>(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('ZAR'),
  channel: text('channel'),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
});

export const pointsLedger = pgTable('points_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  transactionId: uuid('transaction_id').references(() => transactions.id),
  type: ledgerTypeEnum('type').notNull(),
  points: integer('points').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
});

export const rewards = pgTable('rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  pointsCost: integer('points_cost').notNull(),
  category: text('category'),
  stock: integer('stock'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
});

export const redemptions = pgTable('redemptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  rewardId: uuid('reward_id').notNull().references(() => rewards.id),
  pointsSpent: integer('points_spent').notNull(),
  status: redemptionStatusEnum('status').notNull().default('completed'),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
});

export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
});

export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  achievementId: uuid('achievement_id').notNull().references(() => achievements.id),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
});


