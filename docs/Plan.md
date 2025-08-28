### Mukuru Rewards – Implementation Plan

---

## Scope and Objectives
- Build a loyalty rewards experience where users simulate remittance sends, earn points, manage balances/history, and redeem rewards in a marketplace.
- Prioritize a smooth, fun UX with animations and brand-aligned visuals.
- Clean separation: Next.js frontend + Express TypeScript backend + Supabase Postgres.

## Success Criteria (aligned to judging)
- Functionality: End-to-end send → earn → manage → spend works reliably.
- UX/Creativity: Engaging send animation, polished dashboard, delightful redemption.
- Technical: Clear API boundaries, typed code, sensible schema, robust points ledger.
- Presentation: 5–7 min demo with a tight narrative and seeded data.

## Architecture Overview
- Frontend: Next.js (TypeScript, Tailwind), Framer Motion/Lottie for animations, charting for history/progress.
- Backend: Express (TypeScript), Drizzle ORM.
- Database: Supabase Postgres (managed). Drizzle connects via `DATABASE_URL`.
- Optional Supabase features: Auth (if needed), Storage for reward images.
- Communication: REST JSON over HTTPS. CORS restricted to frontend origin.

### Repository Structure (expected)
- Frontend repo: Next.js app (already created by you).
- Backend repo: Express TypeScript app (to be created).
- Shared docs: This `docs/` folder with plan and references.

## Data Model (Drizzle/Supabase)
- User: `id`, `name`, `email`, `tier`, `lifetimePoints`, `createdAt`
- Transaction: `id`, `userId`, `amount`, `currency`, `channel`, `createdAt`
- PointsLedger: `id`, `userId`, `transactionId?`, `type` ('credit'|'debit'), `points`, `reason`, `createdAt`
- Reward: `id`, `name`, `description`, `pointsCost`, `imageUrl`, `stock?`, `category`, `active`
- Redemption: `id`, `userId`, `rewardId`, `pointsSpent`, `status`, `createdAt`
- (Optional) Achievement: `id`, `code`, `name`, `description`, `icon`
- (Optional) UserAchievement: `userId`, `achievementId`, `createdAt`

### Points & Tiers
- Earning: `points = floor(amount / 100)` base; tier multipliers apply.
- Tiers: Bronze (0–499, 1.0x), Silver (500–1999, 1.1x), Gold (2000+, 1.25x).
- Terminology: refer to points in UI as "Mukuru Miles" for brand/story tie-in.
- Achievements (from Ideas.md): "First Flight!" (first transaction), "High Flier!" (send > R1000), "Frequent Flyer!" (5+ transactions).
- Balance is derived from ledger: sum(credits) − sum(debits).

## API (REST)
Base URL: `/api`

RBAC
- Roles: `client`, `admin`. JWT includes role; middleware enforces admin access.
- Admin namespace: `/admin/*` endpoints require admin role.

Auth
- POST `/auth/register` { name, email, password } → create user, email verify link via Resend
- POST `/auth/login` { email, password } → JWT token + user
- GET `/auth/verify?token=...` → verify email
- POST `/auth/forgot-password` { email } → send reset email
- POST `/auth/reset-password` { token, password } → reset password

Transactions/Points
- POST `/transactions/send` { userId, amount, currency } → create transaction, award points, return updated balance, tier, points-earned.
- GET `/users/:id/balance` → { balance, tier, lifetimePoints }
- GET `/users/:id/history?limit=50` → transactions and ledger entries (most recent first)

Rewards
- GET `/rewards` → list active rewards
- POST `/redeem` { userId, rewardId } → debit points, create redemption, return updated balance

Admin
- GET `/admin/users` → list users
- POST `/admin/rewards` → create reward; PATCH `/admin/rewards/:id` → update
- GET `/admin/redemptions` → list redemptions
- GET `/admin/partners` → list; POST `/admin/partners`; PATCH `/admin/partners/:id`
- GET `/admin/transactions` → list transactions

Gamification (optional)
- GET `/leaderboard?range=weekly` → top users by weekly points
- GET `/users/:id/achievements` → list unlocked achievements

## Environments & Secrets
- Backend `.env` (server-only):
  - `DATABASE_URL` (Supabase Postgres connection string)
  - `JWT_SECRET` (JWT signing secret)
  - `SUPABASE_URL` (if using Supabase client/server features)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only, never exposed)
  - `RESEND_API_KEY` (email provider)
  - `APP_BASE_URL` (e.g., http://localhost:3000 for email links)
  - `PORT` (default 4000)
- Frontend `.env.local`:
  - `NEXT_PUBLIC_API_BASE_URL` (backend base URL)

## Milestones & Timeline
Day 1
- Backend scaffold (Express TS), Drizzle schema/migrations, seed data.
- Endpoints: send transaction, balance, history.
- Frontend: connect API base URL; stub pages/components.

Day 2
- Rewards marketplace endpoints + redeem.
- Frontend: marketplace UI, redemption flow.
- Dashboard visuals: balance card, tier progress, chart, timeline.
- Animations: send map animation, confetti, toasts.

Day 3
- Leaderboard + achievements (optional) and polish.
- Error/loading states, responsive, brand theme alignment.
- Seed compelling demo data and finalize demo script.

## Demo Flow (5–7 minutes)
1. Intro: goal and user journey.
2. Send: perform a send → map animation → points awarded.
3. Dashboard: balance, tier progress, recent activity chart.
4. Marketplace: browse and redeem a reward.
5. Gamification/Leaderboard (if enabled).
6. Tech overview: architecture and stack choices.

## Local Development (quick reference)
Backend
1) `cp .env.example .env` and set `DATABASE_URL` + Supabase secrets.
2) `npm i`, `npm run db:generate && npm run db:push`, `npm run dev`.

Frontend (Next.js)
1) `cp .env.local.example .env.local` and set `NEXT_PUBLIC_API_BASE_URL`.
2) `npm i`, `npm run dev`.

## Risks & Mitigations
- Time: keep scope tight; seed data; mock auth if needed.
- Animation complexity: use Lottie or lightweight motion; optimize assets.
- Data integrity: immutable ledger; derive balance; migrations tracked in Git.

## Todo Roadmap (high level)
Backend
- Bootstrap Express backend with TypeScript, ESLint and Prettier
- Configure Supabase project and environment secrets for backend
- Define Drizzle schema for users, transactions, ledger, rewards, redemptions
- Run Drizzle migrations against Supabase Postgres
- Seed database with mock users, rewards, and sample activity
- Implement send transaction endpoint and points awarding
- Implement balance and history endpoints
- Implement rewards list and redeem endpoints
- Implement achievements and leaderboard endpoints (optional)

Frontend
- Wire Next.js frontend to backend base URL and API hooks
- Build Send UI with map animation and success feedback
- Build dashboard: balance card, tier progress, charts, timeline
- Build marketplace UI and redemption flow
- Add achievements toasts, confetti, and tier upgrade visuals (optional)
- Add leaderboard page/section with weekly rankings (optional)
- Polish UX: loading, error states, responsive, brand theme

Demo/Release
- Prepare demo script and seed realistic demo data
- Deploy backend and configure CORS (optional)
- Set up simple auth or mock user switching

---

This plan is intentionally concise and actionable. We will update this document if scope changes.


