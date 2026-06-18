import type { Metadata } from "next"

import { LegalShell, LegalSection } from "@/components/marketing/legal-shell"
import { staticPageMetadata } from "@/lib/seo"
import { PRIVACY_EMAIL, SITE_DOMAIN } from "@/lib/site"
import { getLocale } from "@/lib/i18n/actions"

export const metadata: Metadata = staticPageMetadata("/cookies")

export default async function CookiesPage() {
  const locale = await getLocale()
  const isEn = locale === "en"

  return (
    <LegalShell
      eyebrow="Legal"
      title={isEn ? "Cookie Policy" : "Kebijakan Cookie"}
      description={
        isEn
          ? `How ${SITE_DOMAIN} uses cookies to improve your experience.`
          : `Bagaimana ${SITE_DOMAIN} menggunakan cookie untuk meningkatkan pengalaman Anda.`
      }
      updatedAt={isEn ? "June 1, 2026" : "1 Juni 2026"}
    >
      {isEn ? (
        <>
          <LegalSection title="1. What are Cookies?">
            <p>
              Cookies are small text files stored on your device when you
              access a website. Cookies help the site remember preferences,
              login status, and other information to provide a better
              experience.
            </p>
            <p>
              This policy explains the types of cookies we use, why we use
              them, and how you can control them.
            </p>
          </LegalSection>

          <LegalSection title="2. Types of Cookies We Use">
            <p>We use four main categories of cookies:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Essential Cookies:</span>{" "}
                required for basic platform functions such as login, session
                management, and security. These cookies cannot be disabled.
              </li>
              <li>
                <span className="font-medium text-foreground">Preference Cookies:</span>{" "}
                store your choices such as language, display mode, and the
                last filter used in the directory.
              </li>
              <li>
                <span className="font-medium text-foreground">Analytical Cookies:</span>{" "}
                help us understand how users interact with the platform so we
                can improve features. Data is collected anonymously.
              </li>
              <li>
                <span className="font-medium text-foreground">Marketing Cookies:</span>{" "}
                we currently do not use third-party marketing cookies. If
                activated in the future, we will ask for your consent first.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Third-Party Cookies">
            <p>
              Some features use third-party services that may place their own
              cookies:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Midtrans:</span>{" "}
                to securely process subscription payments.
              </li>
              <li>
                <span className="font-medium text-foreground">Analytics Providers:</span>{" "}
                to collect aggregate data about platform usage.
              </li>
            </ul>
            <p>
              Third-party cookies are subject to the respective provider's
              policies. We have no control over the data they collect.
            </p>
          </LegalSection>

          <LegalSection title="4. Controlling Cookies">
            <p>
              You can control or delete cookies through your browser settings.
              Most browsers allow you to:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>See what cookies are stored.</li>
              <li>Delete specific cookies or all cookies.</li>
              <li>Block third-party cookies.</li>
              <li>Block all cookies (not recommended).</li>
            </ul>
            <p>
              Please keep in mind that if you disable essential cookies, some
              platform features will not function properly - for example, you
              cannot remain logged in across pages.
            </p>
            <p>
              Guides for disabling cookies are available on your browser's
              official site:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Google Chrome: Settings &rarr; Privacy and security &rarr; Cookies</li>
              <li>Mozilla Firefox: Settings &rarr; Privacy &amp; Security</li>
              <li>Safari: Preferences &rarr; Privacy</li>
              <li>Microsoft Edge: Settings &rarr; Cookies and site permissions</li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Local Storage & Similar Technologies">
            <p>
              In addition to cookies, we use local storage technologies such as
              localStorage and sessionStorage to store UI preferences (such as
              form drafts or panel states in the builder). This data remains on
              your device and is not automatically sent to our servers.
            </p>
          </LegalSection>

          <LegalSection title="6. Changes to the Cookie Policy">
            <p>
              We may update this policy in accordance with technological or
              regulatory changes. The latest version is always available on
              this page, with the last update date listed at the top.
            </p>
          </LegalSection>

          <LegalSection title="7. Contact">
            <p>
              Questions regarding the Cookie Policy can be sent to{" "}
              <span className="font-medium text-foreground">{PRIVACY_EMAIL}</span>.
            </p>
          </LegalSection>
        </>
      ) : (
        <>
          <LegalSection title="1. Apa itu Cookie?">
            <p>
              Cookie adalah file teks kecil yang disimpan di perangkat Anda saat
              mengakses situs web. Cookie membantu situs mengingat preferensi,
              status login, dan informasi lain untuk memberikan pengalaman yang
              lebih baik.
            </p>
            <p>
              Kebijakan ini menjelaskan jenis cookie yang kami gunakan, mengapa
              kami menggunakannya, dan bagaimana Anda dapat mengontrolnya.
            </p>
          </LegalSection>

          <LegalSection title="2. Jenis Cookie yang Kami Gunakan">
            <p>Kami menggunakan empat kategori cookie utama:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Cookie Esensial:</span>{" "}
                wajib untuk fungsi dasar platform seperti login, session
                management, dan keamanan. Cookie ini tidak dapat dinonaktifkan.
              </li>
              <li>
                <span className="font-medium text-foreground">Cookie Preferensi:</span>{" "}
                menyimpan pilihan Anda seperti bahasa, mode tampilan, dan filter
                terakhir yang digunakan di direktori.
              </li>
              <li>
                <span className="font-medium text-foreground">Cookie Analitik:</span>{" "}
                membantu kami memahami bagaimana pengguna berinteraksi dengan
                platform sehingga kami dapat meningkatkan fitur. Data dikumpulkan
                secara anonim.
              </li>
              <li>
                <span className="font-medium text-foreground">Cookie Marketing:</span>{" "}
                saat ini kami tidak menggunakan cookie marketing pihak ketiga.
                Jika di kemudian hari diaktifkan, kami akan meminta persetujuan
                Anda terlebih dahulu.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Cookie Pihak Ketiga">
            <p>
              Beberapa fitur menggunakan layanan pihak ketiga yang dapat memasang
              cookie mereka sendiri:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Midtrans:</span>{" "}
                untuk memproses pembayaran langganan dengan aman.
              </li>
              <li>
                <span className="font-medium text-foreground">Penyedia Analitik:</span>{" "}
                untuk mengumpulkan data agregat tentang penggunaan platform.
              </li>
            </ul>
            <p>
              Cookie pihak ketiga tunduk pada kebijakan masing-masing penyedia. Kami
              tidak memiliki kontrol atas data yang mereka kumpulkan.
            </p>
          </LegalSection>

          <LegalSection title="4. Mengontrol Cookie">
            <p>
              Anda dapat mengontrol atau menghapus cookie melalui pengaturan
              browser Anda. Sebagian besar browser memungkinkan Anda untuk:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Melihat cookie apa saja yang tersimpan.</li>
              <li>Menghapus cookie tertentu atau semua cookie.</li>
              <li>Memblokir cookie pihak ketiga.</li>
              <li>Memblokir semua cookie (tidak direkomendasikan).</li>
            </ul>
            <p>
              Perlu diingat, jika Anda menonaktifkan cookie esensial, beberapa
              fitur platform tidak akan berfungsi dengan baik - misalnya Anda tidak
              dapat tetap login antar halaman.
            </p>
            <p>
              Panduan menonaktifkan cookie tersedia di situs resmi browser Anda:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Google Chrome: Settings &rarr; Privacy and security &rarr; Cookies</li>
              <li>Mozilla Firefox: Settings &rarr; Privacy &amp; Security</li>
              <li>Safari: Preferences &rarr; Privacy</li>
              <li>Microsoft Edge: Settings &rarr; Cookies and site permissions</li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Local Storage & Teknologi Serupa">
            <p>
              Selain cookie, kami menggunakan teknologi penyimpanan lokal seperti
              localStorage dan sessionStorage untuk menyimpan preferensi UI
              (seperti draft form atau panel state di builder). Data ini tetap di
              perangkat Anda dan tidak dikirim ke server kami secara otomatis.
            </p>
          </LegalSection>

          <LegalSection title="6. Perubahan Kebijakan Cookie">
            <p>
              Kami dapat memperbarui kebijakan ini sesuai dengan perubahan teknologi
              atau peraturan. Versi terbaru selalu tersedia di halaman ini, dengan
              tanggal pembaruan terakhir tercantum di bagian atas.
            </p>
          </LegalSection>

          <LegalSection title="7. Kontak">
            <p>
              Pertanyaan terkait Kebijakan Cookie dapat dikirim ke{" "}
              <span className="font-medium text-foreground">{PRIVACY_EMAIL}</span>.
            </p>
          </LegalSection>
        </>
      )}
    </LegalShell>
  )
}
