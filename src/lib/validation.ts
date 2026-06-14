import { NextResponse } from "next/server"
import { z } from "zod"

/**
 * Validation helpers for API route request bodies.
 *
 * Usage in a route handler:
 *
 *   const parsed = await parseJsonBody(request, MySchema)
 *   if (!parsed.ok) return parsed.response
 *   const data = parsed.data // fully typed
 *
 * Keeps validation consistent across endpoints and returns a structured 400
 * with field-level issues instead of ad-hoc `typeof` checks.
 */
export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse }

function formatIssues(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "(root)",
    message: issue.message,
  }))
}

/**
 * Reads and validates a JSON request body against a Zod schema.
 * On failure, returns a 400 response with `{ error, details }`.
 */
export async function parseJsonBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ParseResult<T>> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Validation failed", details: formatIssues(result.error) },
        { status: 400 },
      ),
    }
  }

  return { ok: true, data: result.data }
}

export { z }
