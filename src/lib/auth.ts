import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/db"
import * as authSchema from "@/db/auth-schema"
import { sendEmail } from "@/lib/email"

if (!process.env.BETTER_AUTH_SECRET) {
  console.warn("BETTER_AUTH_SECRET is not set. Auth will not work until configured.")
}

const authBaseURL =
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL

export const auth = betterAuth({
  database: db
    ? drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema,
      })
    : undefined,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: authBaseURL,
  trustedOrigins: [
    authBaseURL,
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
    "https://studiotato.vercel.app",
    "https://*.vercel.app",
  ].filter((value): value is string => Boolean(value)),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    resetPasswordTokenExpiresIn: 60 * 60,
    async sendResetPassword({ user, url }) {
      const subject = "Reset password akun Ruang Tato Anda"
      const html = buildResetPasswordEmail({ name: user.name, url })
      const text =
        `Halo ${user.name || ""},\n\n` +
        `Kami menerima permintaan untuk mereset password akun Ruang Tato Anda.\n` +
        `Buka tautan berikut untuk membuat password baru (berlaku 1 jam):\n${url}\n\n` +
        `Jika Anda tidak meminta reset password, abaikan email ini.\n`

      try {
        await sendEmail({ to: user.email, subject, html, text })
      } catch (err) {
        console.error("[auth] Failed to send reset password email", err)
        throw err
      }
    },
  },
  plugins: [nextCookies()],
})

function buildResetPasswordEmail({ name, url }: { name: string; url: string }) {
  const greeting = name ? `Halo ${escapeHtml(name)},` : "Halo,"
  return `<!doctype html>
<html lang="id">
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0a0a0a;">
    <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
      <div style="background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:32px;">
        <h1 style="font-size:18px;font-weight:600;margin:0 0 16px;">Reset password Ruang Tato</h1>
        <p style="font-size:14px;line-height:1.6;margin:0 0 16px;color:#404040;">${greeting}</p>
        <p style="font-size:14px;line-height:1.6;margin:0 0 24px;color:#404040;">
          Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk membuat password baru. Tautan ini berlaku selama 1 jam.
        </p>
        <p style="margin:0 0 24px;">
          <a href="${url}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500;">Reset password</a>
        </p>
        <p style="font-size:12px;line-height:1.6;margin:0 0 12px;color:#737373;">
          Atau salin tautan berikut ke browser Anda:
        </p>
        <p style="font-size:12px;line-height:1.6;margin:0 0 24px;color:#525252;word-break:break-all;">${url}</p>
        <p style="font-size:12px;line-height:1.6;margin:0;color:#737373;">
          Jika Anda tidak meminta reset password, abaikan email ini — password Anda tidak akan berubah.
        </p>
      </div>
      <p style="font-size:11px;text-align:center;color:#a3a3a3;margin:16px 0 0;">© Ruang Tato</p>
    </div>
  </body>
</html>`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
