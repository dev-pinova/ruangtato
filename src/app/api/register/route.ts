import { APIError } from "better-auth/api"
import { NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"

import { checkDatabaseConnection, isDatabaseConfigured, getDb } from "@/db"
import { user } from "@/db/auth-schema"
import { studios, studioMemberships } from "@/db/schema"
import { auth } from "@/lib/auth/auth"
import { createStudioForUser } from "@/lib/studio/studio-service"

function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message || "Gagal mendaftar."
  }
  if (error instanceof Error) {
    const cause = error.cause as { code?: string } | undefined
    const code = cause?.code

    if (
      code === "ECONNREFUSED" ||
      code === "ENOTFOUND" ||
      code === "ETIMEDOUT"
    ) {
      return "PostgreSQL tidak berjalan atau tidak dapat dijangkau. Jalankan `docker compose up -d postgres`, lalu `npm run db:push`."
    }

    if (
      code === "42P01" ||
      error.message.includes("relation") ||
      error.message.includes("Failed query")
    ) {
      return "Tabel database belum ada. Jalankan `npm run db:push` setelah PostgreSQL berjalan."
    }

    return error.message
  }
  return "Gagal mendaftar."
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Database belum dikonfigurasi. Salin .env.example ke .env, set DATABASE_URL, lalu jalankan npm run db:push.",
      },
      { status: 503 },
    )
  }

  const dbStatus = await checkDatabaseConnection()
  if (!dbStatus.ok) {
    return NextResponse.json({ error: dbStatus.error }, { status: 503 })
  }

  if (!process.env.BETTER_AUTH_SECRET) {
    return NextResponse.json(
      { error: "BETTER_AUTH_SECRET belum diset di .env." },
      { status: 503 },
    )
  }

  const body = await request.json().catch(() => ({}))
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const password = typeof body.password === "string" ? body.password : ""
  const studioName = typeof body.studioName === "string" ? body.studioName.trim() : ""
  const city = typeof body.city === "string" ? body.city.trim() : ""
  const waNumber =
    typeof body.waNumber === "string" ? body.waNumber.replace(/[^\d]/g, "") : ""

  if (!name || !email || !password || !studioName || !city || !waNumber) {
    return NextResponse.json(
      {
        error:
          "Nama, email, password, nomor WhatsApp, kota, dan nama studio wajib diisi.",
      },
      { status: 400 },
    )
  }

  try {
    const db = getDb()

    // Check if the email already exists in the database
    const [existingUser] = await db
      .select({ id: user.id, status: user.status })
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    if (existingUser) {
      let isSuspended = existingUser.status === "suspended"

      if (!isSuspended) {
        const [membership] = await db
          .select({ status: studios.status })
          .from(studioMemberships)
          .innerJoin(studios, eq(studioMemberships.studioId, studios.id))
          .where(
            and(
              eq(studioMemberships.userId, existingUser.id),
              eq(studios.status, "suspended")
            )
          )
          .limit(1)

        if (membership) {
          isSuspended = true
        }
      }

      if (isSuspended) {
        return NextResponse.json(
          { error: "Akun Anda telah ditangguhkan. Silakan hubungi admin." },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: "Email sudah terdaftar." },
        { status: 400 }
      )
    }

    const signUpResult = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: request.headers,
    })

    const studio = await createStudioForUser({
      userId: signUpResult.user.id,
      studioName,
      ownerName: name,
      city,
      waNumber,
    })

    return NextResponse.json({ studio }, { status: 201 })
  } catch (error) {
    console.error("Registration failed:", error)

    if (error instanceof APIError) {
      const status = error.status === "UNPROCESSABLE_ENTITY" ? 422 : 400
      return NextResponse.json({ error: getErrorMessage(error) }, { status })
    }

    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    )
  }
}
