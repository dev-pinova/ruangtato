import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as authSchema from "./auth-schema"
import * as schema from "./schema"

const fullSchema = { ...schema, ...authSchema }

const connectionString = process.env.DATABASE_URL

function isLocalDatabase(url: string) {
  return /localhost|127\.0\.0\.1/.test(url)
}

function buildPoolConfig(url: string) {
  const normalized = new URL(url)
  normalized.searchParams.delete("sslmode")
  normalized.searchParams.delete("ssl")

  return {
    connectionString: normalized.toString(),
    connectionTimeoutMillis: 5_000,
    ssl: isLocalDatabase(url) ? undefined : { rejectUnauthorized: false },
  }
}

const pool = connectionString ? new Pool(buildPoolConfig(connectionString)) : null

export const db = pool ? drizzle(pool, { schema: fullSchema }) : null
export { pool }

export function isDatabaseConfigured() {
  return Boolean(pool && db)
}

export type DatabaseConnectionResult =
  | { ok: true }
  | { ok: false; code?: string; error: string }

export async function checkDatabaseConnection(): Promise<DatabaseConnectionResult> {
  if (!pool) {
    return {
      ok: false,
      error:
        "DATABASE_URL belum diset. Salin .env.example ke .env dan isi connection string PostgreSQL.",
    }
  }

  try {
    const client = await pool.connect()
    try {
      await client.query("SELECT 1")
      return { ok: true }
    } finally {
      client.release()
    }
  } catch (error) {
    const pgError = error as NodeJS.ErrnoException & { code?: string }
    const code = pgError.code

    if (code === "ECONNREFUSED" || code === "ENOTFOUND") {
      return {
        ok: false,
        code,
        error:
          "PostgreSQL tidak berjalan atau tidak dapat dijangkau di DATABASE_URL. Jalankan `docker compose up -d postgres` (atau install PostgreSQL lokal), lalu `npm run db:push`.",
      }
    }

    if (code === "ETIMEDOUT" || code === "ECONNRESET") {
      return {
        ok: false,
        code,
        error:
          "Koneksi database timeout. Periksa DATABASE_URL dan pastikan PostgreSQL berjalan.",
      }
    }

    if (code === "28P01") {
      return {
        ok: false,
        code,
        error:
          "Autentikasi database gagal. Periksa username/password di DATABASE_URL.",
      }
    }

    if (code === "3D000") {
      return {
        ok: false,
        code,
        error:
          "Database tidak ditemukan. Buat database di PostgreSQL atau sesuaikan nama di DATABASE_URL.",
      }
    }

    return {
      ok: false,
      code,
      error: pgError.message || "Gagal terhubung ke database.",
    }
  }
}
