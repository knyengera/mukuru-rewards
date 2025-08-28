### Mukuru Rewards Monorepo

This repository contains a Next.js frontend and an Express + TypeScript backend. The project implements a loyalty rewards experience for remittance sends, backed by Supabase Postgres and Drizzle ORM.

---

## Structure

frontend/
- Next.js 14 app router
- Tailwind CSS
- Pages: send, dashboard, rewards, auth (login/sign-up)
- API base: `NEXT_PUBLIC_API_BASE_URL`

backend/
- Express (TypeScript)
- Drizzle ORM (Postgres via Supabase)
- Routes: `/api/auth`, `/api/transactions`, `/api/users`, `/api/rewards`, `/api/admin/*`
- RBAC: roles `client` (default) and `admin`; admin routes require JWT with admin role
- Email via Resend
- Lint/format: ESLint (flat) + Prettier

docs/
- Plan.md, Ideas.md, brief

---

## Prerequisites
- Node 18+
- Supabase Postgres (connection string)
- Resend account (for emails)

---

## Environment

Create `backend/.env`:
```
DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db>?sslmode=require
JWT_SECRET=change-me
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
RESEND_API_KEY=<resend-api-key>
RESEND_FROM="Mukuru Rewards <no-reply@mukuru-rewards.local>"
APP_BASE_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
PORT=4000
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

## Install & Run

Backend:
```
cd backend
npm i
npm run db:generate
npm run db:push
npm run dev
```

Frontend:
```
cd frontend
npm i
npm run dev
```

---

## Backend Routes (summary)

Public (no auth required)
- GET `/api/health`
- POST `/api/auth/register` → verify email via Resend
- POST `/api/auth/login` → JWT token (payload contains `sub`, `role`, `scope`)
- GET `/api/auth/verify?token=...` → confirm email
- POST `/api/auth/forgot-password` → reset link
- POST `/api/auth/reset-password` → set new password
- GET `/api/rewards` → list active rewards
- GET `/api/leaderboard/rewards?limit=50&type=earned|redeemed&range=weekly|all`
  - Default: `type=earned&range=weekly` (sum of credited points in last 7 days)
  - `type=redeemed`: order by count of completed redemptions

Authenticated (user) endpoints
- POST `/api/transactions/send` → create tx, award points, email notification
- GET `/api/users/:id/balance` → points balance + tier (self or admin)
- GET `/api/users/:id/history` → transactions & ledger (self or admin)
- POST `/api/rewards/redeem` → spend points, email confirmation

Admin (JWT admin role required)
- GET `/api/admin/users`
- POST `/api/admin/rewards`, PATCH `/api/admin/rewards/:id`
- GET `/api/admin/redemptions`
- GET `/api/admin/partners`, POST `/api/admin/partners`, PATCH `/api/admin/partners/:id`
- GET `/api/admin/transactions`

---

## Notes
- Points are tracked via an immutable ledger; balance = credits − debits.
- Tiers: bronze, silver, gold with multipliers applied on earn.
- Emails are best-effort (non-blocking) and run via Resend.


