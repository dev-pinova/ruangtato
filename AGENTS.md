<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single Next.js 16 app ("Ruang Tato") backed by PostgreSQL (Drizzle ORM + Better Auth). Standard commands live in `README.md`/`package.json` (`npm run dev|build|lint`, `npx vitest run`, `npm run db:push`). Non-obvious caveats for this environment:

- **PostgreSQL runs natively, not via Docker.** Docker is not available here, so the `docker compose up -d postgres` step in `README.md` does not apply. A local cluster is installed with DB/user/password all `ruangtato`. If the DB is not reachable on a fresh VM, start it with `sudo pg_ctlcluster 16 main start` (the dependency update script does not start services).
- **`.env` is required and gitignored** (there is no committed `.env.example`). The db scripts use `node --env-file=.env`, and `next dev` auto-loads `.env`. If `.env` is missing, recreate it with: `DATABASE_URL=postgresql://ruangtato:ruangtato@127.0.0.1:5432/ruangtato`, a `BETTER_AUTH_SECRET` (>=32 chars, e.g. `openssl rand -base64 32`), and `BETTER_AUTH_URL`/`NEXT_PUBLIC_APP_URL=http://localhost:3000`.
- **After editing `src/db/schema.ts` or `src/db/auth-schema.ts`, run `npm run db:push`** to sync the schema (no separate auth migration step — auth tables are part of `db:push`).
- Midtrans, Resend, and S3/R2 env vars are optional; the app runs without them (billing/email/upload features degrade gracefully).
- `npm run lint` currently reports pre-existing errors/warnings unrelated to environment setup; a clean exit is not expected on an unmodified checkout.
- Verify the stack is healthy via `curl http://localhost:3000/api/health` — it returns `"database":"connected"` when Postgres is reachable.
