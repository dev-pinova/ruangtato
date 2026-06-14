# Ruang Tato

Platform SaaS landing page untuk studio tato di Indonesia. Section-based template builder (ala Webflow tattoo-128), PostgreSQL `page_config` JSONB, Better Auth, Midtrans (stub), Coolify deploy.

## Quick start (local)

### 1. Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — min 32 random chars (`openssl rand -base64 32`)
- `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` — `http://localhost:3000`

### 2. Database

```bash
docker compose up -d postgres
npm run db:push
npm run auth:migrate
```

For local development, `db:push` syncs the schema directly. For production, use
versioned migrations instead — see [Database migrations](#database-migrations).

### 3. Run app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Demo seed (optional)

```bash
node scripts/seed-studios.mjs 20
```

Creates published demo studios at `/app/studio/demo-studio-1`, etc.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (standalone) |
| `npm run start` | Start production server |
| `npm run db:push` | Push Drizzle schema directly (dev only) |
| `npm run db:generate` | Generate a versioned SQL migration from schema changes |
| `npm run db:migrate` | Apply pending migrations (production-safe) |
| `npm run auth:migrate` | Better Auth tables migration |
| `node scripts/seed-studios.mjs N` | Seed N demo studios |
| `npm run admin:seed` | Assign `super_admin` ke `PLATFORM_ADMIN_EMAIL` |
| `npm run admin:backfill-payments` | Backfill histori invoice ke tabel `payments` |

## Database migrations

Two workflows are supported:

- **Local development** — `npm run db:push` syncs the schema straight to your
  local database. Fast, but no history and not safe for shared/production data.
- **Production** — versioned SQL migrations in `./drizzle`:
  1. After editing `src/db/schema.ts`, run `npm run db:generate` to create a new
     timestamped SQL file in `./drizzle`.
  2. Review the generated SQL, commit it.
  3. Run `npm run db:migrate` (in CI or on the server) to apply pending
     migrations. Drizzle records applied migrations in
     `drizzle.__drizzle_migrations` and skips ones already run.

### Baseline adoption (existing databases)

`drizzle/0000_baseline.sql` is a full snapshot of the current schema. A fresh
database can apply it directly with `npm run db:migrate`.

A database that was originally created with `db:push` already has these tables,
so applying the `0000` baseline as-is would fail on `CREATE TABLE`. To adopt
migrations on such a database **without recreating tables**, run the baseline
helper once — it records the current migrations as already applied (matching
Drizzle's SHA256 hashing) without executing their SQL:

```bash
npm run db:baseline
```

After that, only new migrations (`0001+`) will be applied by `npm run db:migrate`.

## Docker / Coolify

```bash
docker compose up -d          # PostgreSQL only
docker build -t ruangtato .   # App image (standalone)
```

Health check: `GET /api/health`

### Coolify env vars

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (production URL)
- `NEXT_PUBLIC_APP_URL`
- `MIDTRANS_SERVER_KEY` / `MIDTRANS_CLIENT_KEY` (optional)
- `S3_*` for Cloudflare R2 (optional, phase 2)

## Architecture

- **Builder** — `/app/builder` — drag section order, edit content, save to `studios.page_config`
- **Public pages** — `/app/studio/[slug]` — SSR from published `page_config`
- **Auth** — Better Auth email/password at `/api/auth/*`
- **Billing** — `/app/billing` + Midtrans webhook stub at `/api/billing/webhook`
- **Leads** — `POST /api/studios/[slug]/leads`
- **Analytics** — `POST /api/studios/[slug]/track/view` and `/track/click`
- **Admin panel** — `/admin` — platform staff only (`platform_role` on `user`)

### Platform admin roles

| Role | Permissions |
|------|-------------|
| `super_admin` | Full access including settings and suspend/reactivate |
| `admin` | Tenants, payments, analytics, audit read |
| `support` | Tenants, payments read |
| `finance` | Payments, analytics |

Seed super admin after creating the account:

```bash
PLATFORM_ADMIN_EMAIL=admin@ruangtato.com npm run admin:seed
```

## Subscription gate

`/app/builder` requires an active subscription. New studios get a 1-month trial on registration. Expired subs redirect to `/app/billing`.
