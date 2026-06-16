import "server-only"

type SendEmailParams = {
  to: string
  subject: string
  html: string
  text?: string
}

const DEFAULT_FROM = "Ruang Tato <onboarding@resend.dev>"

/**
 * Sends a transactional email. Uses Resend when RESEND_API_KEY is configured.
 * Falls back to logging the message to the server console for local development
 * so flows like password reset stay testable without SMTP/Resend credentials.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY
  // Strip surrounding quotes if accidentally included in .env
  let from = process.env.EMAIL_FROM || DEFAULT_FROM
  from = from.replace(/^["']|["']$/g, "")

  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY is not set. Falling back to console logging.",
    )
    console.info("[email:dev]", {
      from,
      to,
      subject,
      text: text ?? stripHtml(html),
      html,
    })
    return { id: "dev-fallback", delivered: false as const }
  }

  const { Resend } = await import("resend")
  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  })

  if (error) {
    console.error("[email] Resend error", error)
    throw new Error(error.message || "Failed to send email")
  }

  return { id: data?.id ?? "unknown", delivered: true as const }
}

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}
