# Backend & Database Integration Tasks

This document outlines all backend, API, and database integration work required to make the Ruang Tato frontend fully functional. The frontend is built with mock data; each section below describes what needs to be wired up.

---

## 1. Database Setup (PostgreSQL)

### Schema

```sql
-- Users & Authentication (managed by BetterAuth)
-- BetterAuth auto-creates: users, sessions, accounts, verification_tokens

-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'owner', 'admin', 'member'
  permissions JSONB DEFAULT '{}'
);

-- Studios
CREATE TABLE studios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT,
  wa_number TEXT,
  description TEXT,
  view_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  is_trusted BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  page_config JSONB DEFAULT '[]', -- ordered array of block configs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Studio Memberships (links users to studios with roles)
CREATE TABLE studio_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id),
  is_primary_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, studio_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- '1month', '3months', '6months', '12months'
  status TEXT NOT NULL DEFAULT 'pending', -- 'active', 'expired', 'pending', 'cancelled'
  expires_at TIMESTAMPTZ,
  midtrans_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Migrations

- Use Drizzle ORM or Prisma for schema management and type-safe queries
- Create initial seed data with default roles (owner, admin, member)
- Index: `studios(slug)`, `studios(city)`, `studio_memberships(user_id)`, `leads(studio_id)`

---

## 2. Authentication (BetterAuth)

### Setup

Install and configure BetterAuth for Next.js App Router:

```bash
npm install better-auth
```

### Configuration (`src/lib/auth.ts`)

```typescript
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: {
    // PostgreSQL connection
    type: "postgres",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,       // refresh daily
  },
})
```

### Client (`src/lib/auth-client.ts`)

```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})
```

### API Route (`src/app/api/auth/[...all]/route.ts`)

```typescript
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

### Auth Integration Points

| Frontend Page     | Auth Requirement                                              |
|-------------------|---------------------------------------------------------------|
| `/login`          | Wire form to `authClient.signIn.email()`                     |
| `/register`       | Wire form to `authClient.signUp.email()`, then create studio |
| `/app/builder`    | Protect with session check, load user's studio                |
| `/app/dashboard`  | Protect with session check, load analytics for user's studio  |
| `/app/billing`    | Protect with session check, load subscription for studio      |
| `/app/settings`   | Protect with session check, load studio + team members        |

### Middleware (`src/middleware.ts`)

```typescript
// Protect /app/* routes (except /app/studio/[slug] which is public)
// Redirect unauthenticated users to /login
// Check subscription status for builder access
```

### Role-Based Access Control

- `owner`: Full access to studio builder, settings, billing, team management
- `admin`: Builder access, analytics, lead management (no billing/team)
- `member`: Read-only analytics, lead management only

---

## 3. API Routes

### Studio CRUD

| Method | Route                          | Purpose                            |
|--------|--------------------------------|------------------------------------|
| GET    | `/api/studios`                 | List published studios (showcase)  |
| GET    | `/api/studios/[slug]`          | Get studio public data + blocks    |
| POST   | `/api/studios`                 | Create new studio (auth required)  |
| PATCH  | `/api/studios/[id]`            | Update studio profile (auth)       |
| DELETE | `/api/studios/[id]`            | Delete studio (owner only)         |

### Builder

| Method | Route                          | Purpose                            |
|--------|--------------------------------|------------------------------------|
| GET    | `/api/studios/[id]/config`     | Load page_config JSON              |
| PUT    | `/api/studios/[id]/config`     | Save page_config JSON              |
| POST   | `/api/studios/[id]/publish`    | Set is_published = true            |
| POST   | `/api/studios/[id]/unpublish`  | Set is_published = false           |

### Analytics & Metrics

| Method | Route                              | Purpose                         |
|--------|------------------------------------|---------------------------------|
| POST   | `/api/studios/[slug]/track/view`   | Increment view_count            |
| POST   | `/api/studios/[slug]/track/click`  | Increment click_count           |
| GET    | `/api/studios/[id]/analytics`      | Get analytics data (auth)       |

### Leads

| Method | Route                          | Purpose                            |
|--------|--------------------------------|------------------------------------|
| POST   | `/api/studios/[slug]/leads`    | Submit lead form (public)          |
| GET    | `/api/studios/[id]/leads`      | List leads (auth required)         |
| PATCH  | `/api/leads/[id]`              | Update lead status (auth)          |

### Team Management

| Method | Route                             | Purpose                         |
|--------|-----------------------------------|---------------------------------|
| GET    | `/api/studios/[id]/members`       | List team members               |
| POST   | `/api/studios/[id]/members`       | Invite member (owner/admin)     |
| PATCH  | `/api/studios/[id]/members/[uid]` | Update member role              |
| DELETE | `/api/studios/[id]/members/[uid]` | Remove member                   |

### Billing (Midtrans)

| Method | Route                          | Purpose                            |
|--------|--------------------------------|------------------------------------|
| POST   | `/api/billing/create-order`    | Create Midtrans payment order      |
| POST   | `/api/billing/webhook`         | Handle Midtrans payment callback   |
| GET    | `/api/billing/invoices`        | List invoices for studio           |

---

## 4. Asset Upload

### Image Upload

- Endpoint: `POST /api/upload`
- Accept multipart/form-data for portfolio images
- Store on VPS local storage or integrate CDN (e.g., Cloudflare R2, Bunny CDN)
- Return public URL to store in `page_config` JSON
- Max file size: 5MB, formats: JPEG, PNG, WebP
- Generate thumbnails for showcase grid cards

### File Structure

```
/uploads/
  /studios/[studio_id]/
    /portfolio/   -- hero and gallery images
    /avatar/      -- creator bio photo
    /logo/        -- studio logo
```

---

## 5. Midtrans Payment Integration

### Setup

```bash
npm install midtrans-client
```

### Configuration

```typescript
// src/lib/midtrans.ts
import midtransClient from "midtrans-client"

export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})
```

### Payment Flow

1. User selects plan on `/app/billing`
2. Frontend calls `POST /api/billing/create-order` with plan details
3. Backend creates Midtrans Snap token, returns to frontend
4. Frontend opens Midtrans Snap popup via `snap.pay(token)`
5. User completes payment in popup
6. Midtrans sends webhook to `POST /api/billing/webhook`
7. Backend validates signature, activates subscription, updates `subscriptions` table
8. Frontend polls or receives real-time update of subscription status

### Subscription Plans

| Plan       | Duration | Price (IDR) |
|------------|----------|-------------|
| Starter    | 1 month  | 99,000      |
| Growth     | 3 months | 249,000     |
| Pro        | 6 months | 449,000     |
| Enterprise | 12 months| 799,000     |

---

## 6. View/Click Tracking

### Implementation

- Track page views via server-side middleware or client-side beacon on studio page load
- Track CTA clicks (WhatsApp button) via client-side event handler
- Debounce/deduplicate by IP + session to prevent inflation
- Store daily aggregates for analytics charts:

```sql
CREATE TABLE analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID NOT NULL REFERENCES studios(id),
  date DATE NOT NULL,
  views INT DEFAULT 0,
  clicks INT DEFAULT 0,
  leads INT DEFAULT 0,
  UNIQUE(studio_id, date)
);
```

---

## 7. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ruangtato

# BetterAuth
BETTER_AUTH_SECRET=<random-32-char-secret>
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Midtrans
MIDTRANS_SERVER_KEY=<midtrans-server-key>
MIDTRANS_CLIENT_KEY=<midtrans-client-key>

# File Upload
UPLOAD_DIR=/var/www/uploads
NEXT_PUBLIC_CDN_URL=https://cdn.ruangtato.com
```

---

## 8. Deployment Notes

- **VPS + Coolify**: Self-hosted for cost efficiency
- **PostgreSQL**: Run as Docker container via Coolify
- **Next.js**: Deploy with `output: 'standalone'` in next.config.ts
- **File storage**: Local VPS disk or mount external volume
- **SSL**: Managed by Coolify/Caddy reverse proxy
- **Backups**: Daily pg_dump to external storage

---

## 9. Integration Checklist

- [ ] Set up PostgreSQL database and run migrations
- [ ] Install and configure BetterAuth
- [ ] Create API route for BetterAuth (`/api/auth/[...all]`)
- [ ] Create auth middleware for `/app/*` routes
- [ ] Wire `/login` form to BetterAuth signIn
- [ ] Wire `/register` form to BetterAuth signUp + studio creation
- [ ] Implement Studio CRUD API routes
- [ ] Implement page_config save/load API for builder
- [ ] Implement publish/unpublish API
- [ ] Replace mock studio data in showcase with API calls
- [ ] Replace mock studio data in landing page renderer with API calls
- [ ] Implement lead form submission API
- [ ] Implement view/click tracking API
- [ ] Implement analytics aggregation and API
- [ ] Set up Midtrans integration
- [ ] Implement billing create-order and webhook
- [ ] Implement team management API
- [ ] Implement file upload API
- [ ] Add role-based access checks to all protected routes
- [ ] Set up environment variables for production
- [ ] Deploy with Coolify on VPS
