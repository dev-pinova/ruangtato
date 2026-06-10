import { APIError } from "better-auth/api"
import { NextResponse } from "next/server"

import { checkDatabaseConnection, isDatabaseConfigured } from "@/db"
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
