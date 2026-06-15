# CONTINUE.md — Ruang Tato (studiotato)

Project guide for developers working on the Ruang Tato platform. Review and adjust any section marked _(verify)_ as the codebase evolves.

## 1. Project Overview

Ruang Tato is a SaaS platform that lets tattoo studios in Indonesia build and publish marketing landing pages. Studio owners assemble pages from reusable content blocks (Webflow-style), publish them at a public slug, capture leads, and pay via subscription. A separate platform admin panel lets staff manage tenants, payments, suspensions, and analytics.

Key technologies:

- **Next.js 16** (App Router, Turbopack dev, standalone build) + **React 19**
- **TypeScript 5**
- **Drizzle ORM** over **PostgreSQL** (`pg` / `postgres` drivers), schema in `src/db`
- **Better Auth** for email/password auth and sessions
- **Midtrans** (Snap) for payments, with a webhook endpoint
- **Tailwind CSS v4** + **shadcn** components + Radix/Base UI primitives
- **Resend** for transactional email, **Cloudflare R2 / S3** for uploads (`@aws-sdk/client-s3`, `sharp`)
- **Vitest** + Testing Library for tests
- **Docker / Coolify** for deployment

High-level architecture:

- **Builder** (`/app/builder`) — drag-and-drop section ordering and content editing, saved to `studios.page_config` (JSONB).
- **Public studio pages** (`/app/studio/[slug]`) — SSR rendered from the published `page_config`.
- **Tenant app** (`/app/*`) — dashboard, settings, billing for studio owners.
- **Platform admin** (`/admin/*`) — staff-only management, gated by `platform_role` on the user.
- **API routes** (`/api/*`) — REST-style handlers for studios, billing, admin, auth, uploads, and analytics tracking.

## 2. Getting Started

### Prerequisites

- Node.js 20+ (`@types/node` targets v20)
- npm (repo ships `package-lock.json`)
- Docker (for local PostgreSQL via `docker-compose.yml`)
- A PostgreSQL database (local or hosted)

### Installation

```bash
# 1. Environment
cp .env.example .env.local
# Edit .env.local — see env vars below

# 2. Database (local Postgres via Docker)
docker compose up -d postgres
npm run db:push        # push Drizzle schema
npm run auth:migrate   # auth tables are included in db:push (no-op confirmation)

# 3. Install + run
npm install
npm run dev            # http://localhost:3000
```

### Required environment variables

- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — 32+ random chars (`openssl rand -base64 32`)
- `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` locally

Optional:

- `MIDTRANS_SERVER_KEY` / `MIDTRANS_CLIENT_KEY` — payments
- `S3_*` — Cloudflare R2 uploads
- `PLATFORM_ADMIN_EMAIL` — used by `npm run admin:seed`

### Seed data (optional)

```bash
node scripts/seed-studios.mjs 20         # 20 demo studios at /app/studio/demo-studio-N
PLATFORM_ADMIN_EMAIL=admin@ruangtato.com npm run admin:seed   # grant super_admin
```

### Running tests

```bash
npx vitest          # watch mode
npx vitest run      # single run
```

Test setup lives in `vitest.config.ts` and `vitest.setup.ts`. Existing tests: `src/lib/billing/billing-activation.test.ts`, `src/lib/admin/admin-auth.test.ts`.

## 3. Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (public marketing) page.tsx, pricing/, privacy/, terms/, help/, cookies/
│   ├── login/ register/ forgot-password/ reset-password/   # auth pages
│   ├── checkout/ subscription/                             # purchase flow
│   ├── app/              # tenant app (owner-facing)
│   │   ├── builder/      # page builder
│   │   ├── dashboard/    # studio dashboard
│   │   ├── settings/     # studio settings
│   │   ├── billing/      # subscription + invoices
│   │   ├── studio/[slug] # public SSR studio page
│   │   └── account-suspended/
│   ├── admin/            # platform admin (staff only)
│   │   ├── login/
│   │   └── (panel)/      # tenants, payments, transactions, users, analytics,
│   │                     # audit-log, suspensions, studios, settings
│   └── api/              # route handlers (see below)
├── components/
│   ├── ui/               # shadcn / primitive components
│   ├── blocks/           # builder content blocks (Hero, Gallery, FAQ, Footer, ...)
│   ├── builder/          # builder UI (layers, property panels, image upload)
│   ├── admin/            # admin panels + admin/ui design system
│   ├── billing/ showcase/ marketing/ studio/ seo/ brand/ design/
├── db/
│   ├── schema.ts         # app tables (studios, subscriptions, invoices, payments, leads, ...)
│   ├── auth-schema.ts    # Better Auth tables
│   └── index.ts          # Drizzle client
├── lib/
│   ├── auth/             # auth.ts, auth-client.ts, session.ts
│   ├── billing/          # plans, midtrans, payment-service, billing-activation
│   ├── admin/            # admin auth, services, audit log, rate limit, suspensions
│   ├── studio/           # studio-service, studio-guard, page config defaults
│   ├── types.ts          # core domain types + block model
│   └── (r2, email, seo, upload, utils, site, brand)
├── types/                # ambient type declarations
└── middleware.ts         # route protection
```

### API routes (`src/app/api`)

- `auth/[...all]` — Better Auth handler
- `register`, `studios/register`, `studios/me`, `studios/me/dashboard`
- `studios/[id]/config` — save builder page config
- `studios/[id]/publish` — publish/unpublish
- `studios/[slug]/leads`, `studios/[slug]/track/view`, `studios/[slug]/track/click`
- `studios/showcase` — public studio listing
- `billing/create-order`, `billing/confirm`, `billing/webhook`, `billing/invoices`
- `admin/*` — tenants, payments, users, staff, analytics, audit-logs, suspensions, studios, me
- `upload` — image upload to R2/S3
- `health` — `GET /api/health` (Docker/Coolify health check)

### Key config files

- `drizzle.config.ts` — Drizzle Kit config
- `next.config.ts` — standalone output, Next 16 config
- `vitest.config.ts` / `vitest.setup.ts` — test setup
- `eslint.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json` (shadcn)
- `docker-compose.yml`, `Dockerfile`, `vercel.json` — deploy

## 4. Development Workflow

### Next.js 16 caution

`AGENTS.md` flags that this Next.js version has breaking changes from earlier releases. Before writing routing, caching, or server-component code, consult the bundled docs in `node_modules/next/dist/docs/` and heed deprecation notices.

### Coding conventions

- TypeScript throughout; domain types centralized in `src/lib/types.ts`.
- Path alias `@/*` maps to `src/*`.
- UI built from shadcn primitives in `components/ui`; the admin panel has its own design-system layer in `components/admin/ui`.
- `server-only` is used to keep server code out of client bundles.
- Comments and product copy are frequently in Indonesian — match the surrounding language. _(verify per file)_
- See `designsystem.md` and `.cursorrules` for design and editor conventions.

### Linting and tests

```bash
npm run lint        # eslint (flat config)
npx vitest run      # tests
```

Add tests alongside the code as `*.test.ts` (see existing billing/admin tests). Run the build before shipping non-trivial changes:

```bash
npm run build
```

### Build and deployment

- Production build is standalone (`npm run build` → `npm run start`).
- Docker image: `docker build -t ruangtato .`; Postgres via `docker compose up -d`.
- Deployed on Coolify. Required env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` (+ optional Midtrans / S3).

### Database changes

1. Edit `src/db/schema.ts` (or `auth-schema.ts`).
2. `npm run db:push` to apply.
3. Tables use `.enableRLS()` — review `npm run db:rls` (`scripts/enable-rls.ts`) when adding tables.
4. Useful: `npm run db:studio`, `npm run db:check`, `npm run db:clean`.

## 5. Key Concepts

### Block model (the core abstraction)

A studio page is an ordered list of typed blocks. There are two representations:

- `Block` — the in-app/editor shape: `{ id, type, data, visible }`.
- `DbBlock` — the persisted shape stored in `studios.page_config` JSONB: `{ block_id, type, order, content }`.

`mapBlocksToDbBlocks` / `mapDbBlocksToBlocks` (in `src/lib/types.ts`) convert between them. `visible` is folded into `content` on save and extracted on load. `BlockType` enumerates all ~20 block kinds (Header, Hero, Gallery, FAQ, Footer, AppointmentForm, etc.), each with a typed `*Data` interface.

### Tenancy and roles

- A **studio** is a tenant. Users link to studios through `studio_memberships` with a `roleId` (`roles` table) and an `isPrimaryOwner` flag.
- **Studio-level roles** _(verify exact set)_: owner / admin / member.
- **Platform-level roles** live on the Better Auth `user` as `platform_role`:
  - `super_admin` — full access incl. settings, suspend/reactivate
  - `admin` — tenants, payments, analytics, audit read
  - `support` — tenants, payments read
  - `finance` — payments, analytics

### Subscriptions and billing

- Plans are defined in `src/lib/billing/billing-plans.ts` (Starter 1mo, Growth 3mo, Pro 6mo, Enterprise 12mo) — the single source for billing and pricing.
- New studios get a trial on registration; an active subscription is required to access `/app/builder`. Expired subs redirect to billing (see `src/lib/studio/studio-guard.ts`).
- Payment flow: `billing/create-order` → Midtrans Snap → `billing/webhook` updates `payments` / `invoices` / `subscriptions`. Activation logic in `src/lib/billing/billing-activation.ts`.

### Data model (`src/db/schema.ts`)

`studios`, `studio_memberships`, `roles`, `subscriptions`, `invoices`, `payments`, `leads`, `audit_logs`, `suspension_logs`. Status constraints enforced via CHECK (e.g. studio `active|suspended`, subscription `active|expired|pending|cancelled`). All tables enable Postgres RLS.

### Analytics

View/click counters on `studios` plus tracking endpoints (`/api/studios/[slug]/track/*`). Admin analytics service aggregates platform-wide metrics.

## 6. Common Tasks

### Add a new content block

1. Add the type to `BlockType` and a `*Data` interface in `src/lib/types.ts`; include it in the `BlockData` union.
2. Create the renderer in `src/components/blocks/<block>.tsx`.
3. Register it in the block renderer/registry and add a property panel in `src/components/builder/property-panels.tsx`.
4. Add a default config entry in `src/lib/studio/default-page-config.ts`.
5. Verify it renders in the builder and on the public SSR page.

### Add an API route

Create `src/app/api/<path>/route.ts` exporting `GET`/`POST`/etc. Guard tenant routes with the studio/session helpers in `src/lib/auth` and `src/lib/studio/studio-guard.ts`; guard admin routes with `src/lib/admin/admin-auth.ts`.

### Add a subscription plan

Edit `SUBSCRIPTION_PLANS` in `src/lib/billing/billing-plans.ts`. The plan-type helpers (`monthsToPlanType`, `getPlanByType`) derive everything else.

### Add or change a table

Edit `src/db/schema.ts`, run `npm run db:push`, and update RLS via `scripts/enable-rls.ts` if needed.

### Seed local data

`node scripts/seed-studios.mjs N` for demo studios; `npm run admin:seed` for a platform admin.

## 7. Troubleshooting

- **Builder redirects to billing** — the studio's subscription is not active. Seed/activate a subscription or check `studio-guard.ts`.
- **Auth tables missing** — run `npm run db:push` (auth tables ship with the Drizzle schema; `auth:migrate` is just a confirmation no-op).
- **Webhook not updating subscription** — confirm `MIDTRANS_SERVER_KEY`/`CLIENT_KEY` are set and the Midtrans dashboard points to `/api/billing/webhook`. Use `npm run admin:backfill-payments` to backfill historic invoices into `payments`.
- **Admin panel access denied** — the user needs a `platform_role`. Run `PLATFORM_ADMIN_EMAIL=... npm run admin:seed`.
- **Next.js API behaves unexpectedly** — this is Next 16 with breaking changes; check `node_modules/next/dist/docs/`.
- **DB connection issues locally** — ensure `docker compose up -d postgres` is running and `DATABASE_URL` matches.
- **Health check** — `GET /api/health` should return OK; used by Docker/Coolify.

## 8. References

- `README.md` — quick start, scripts, architecture, roles
- `AGENTS.md` / `CLAUDE.md` — assistant + Next.js 16 guidance
- `designsystem.md` — design system
- `prd.md`, `prd-2.md`, `task.md`, `super-admin.md` — product requirements and planning
- `.cursorrules` — editor/AI conventions
- External docs: Next.js (`node_modules/next/dist/docs/`), Drizzle ORM, Better Auth, Midtrans (Snap), Tailwind v4, shadcn

---

_Generated from codebase analysis. Sections marked (verify) and any role/permission details should be confirmed against the latest code before relying on them._