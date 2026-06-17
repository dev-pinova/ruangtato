import { SITE_URL } from "@/lib/site"

type PaymentSuccessEmailParams = {
  studioName: string
  ownerName: string
  planName: string
  planDuration: string
  amount: number
  orderId: string
  startsAt: Date
  expiresAt: Date
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function buildPaymentSuccessEmail(params: PaymentSuccessEmailParams): {
  subject: string
  html: string
  text: string
} {
  const {
    studioName,
    ownerName,
    planName,
    planDuration,
    amount,
    orderId,
    startsAt,
    expiresAt,
  } = params

  const subject = `✅ Pembayaran Berhasil — ${planName} untuk ${studioName}`

  const dashboardUrl = `${SITE_URL}/app/dashboard`
  const builderUrl = `${SITE_URL}/app/builder`

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <span style="font-size:22px;font-weight:700;letter-spacing:-0.5px;color:#ffffff;">
                  Ruang<span style="color:#e63946;">Tato</span>
                </span>
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

              <!-- Green header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#1a3a2a,#0f2a1a);padding:36px 32px 32px;">
                    <!-- Checkmark -->
                    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:rgba(34,197,94,0.15);border:2px solid rgba(34,197,94,0.3);margin-bottom:16px;">
                      <span style="font-size:28px;">✅</span>
                    </div>
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                      Pembayaran Berhasil!
                    </h1>
                    <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.65);">
                      Halo ${ownerName}, langganan studio Anda telah aktif.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 32px;">
                <tr>
                  <td>
                    <!-- Studio name -->
                    <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">
                      Detail Langganan
                    </p>

                    <!-- Table details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;">
                      <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                        <td style="padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.5);">Studio</td>
                        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#ffffff;text-align:right;">${studioName}</td>
                      </tr>
                      <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                        <td style="padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.5);">Paket</td>
                        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#ffffff;text-align:right;">${planName} — ${planDuration}</td>
                      </tr>
                      <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                        <td style="padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.5);">Total Bayar</td>
                        <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#22c55e;text-align:right;">${formatIDR(amount)}</td>
                      </tr>
                      <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                        <td style="padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.5);">Berlaku Mulai</td>
                        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#ffffff;text-align:right;">${formatDate(startsAt)}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.5);">Berlaku Hingga</td>
                        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#ffffff;text-align:right;">${formatDate(expiresAt)}</td>
                      </tr>
                    </table>

                    <!-- Order ID -->
                    <p style="margin:16px 0 0;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;font-family:monospace;">
                      Order ID: ${orderId}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTAs -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px;">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="${builderUrl}"
                       style="display:inline-block;background:#e63946;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.2px;">
                      Mulai Desain Studio →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}"
                       style="display:inline-block;color:rgba(255,255,255,0.5);text-decoration:underline;font-size:13px;padding:4px;">
                      Atau buka Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Footer note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.07);padding:20px 32px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);line-height:1.6;">
                      Email ini dikirim otomatis sebagai konfirmasi pembayaran.
                      Simpan email ini sebagai bukti transaksi Anda.
                      Jika ada pertanyaan, hubungi kami di
                      <a href="mailto:billing@ruangtato.com" style="color:rgba(255,255,255,0.5);">billing@ruangtato.com</a>.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
                © ${new Date().getFullYear()} Ruang Tato. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Pembayaran Berhasil — ${studioName}

Halo ${ownerName},

Pembayaran Anda telah berhasil diproses. Detail langganan:

Studio     : ${studioName}
Paket      : ${planName} — ${planDuration}
Total Bayar: ${formatIDR(amount)}
Mulai      : ${formatDate(startsAt)}
Berakhir   : ${formatDate(expiresAt)}
Order ID   : ${orderId}

Mulai desain studio Anda: ${builderUrl}
Dashboard: ${dashboardUrl}

Ada pertanyaan? Hubungi billing@ruangtato.com

© ${new Date().getFullYear()} Ruang Tato`

  return { subject, html, text }
}
