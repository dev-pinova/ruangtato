import { NextResponse } from "next/server"

import { checkDatabaseConnection, isDatabaseConfigured } from "@/db"

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      status: "degraded",
      timestamp: new Date().toISOString(),
      database: "not_configured",
    })
  }

  const dbStatus = await checkDatabaseConnection()

  return NextResponse.json({
    status: dbStatus.ok ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    database: dbStatus.ok ? "connected" : "unreachable",
    ...(dbStatus.ok ? {} : { databaseError: dbStatus.error }),
  })
}
