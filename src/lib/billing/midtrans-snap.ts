const SNAP_SCRIPT_SANDBOX = "https://app.sandbox.midtrans.com/snap/snap.js"
const SNAP_SCRIPT_PRODUCTION = "https://app.midtrans.com/snap/snap.js"
const SNAP_LOAD_TIMEOUT_MS = 15_000

function getSnapScriptSrc() {
  return process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? SNAP_SCRIPT_PRODUCTION
    : SNAP_SCRIPT_SANDBOX
}

let loadPromise: Promise<void> | null = null

function waitForSnapApi(timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap?.pay) {
      resolve()
      return
    }

    const started = Date.now()
    const tick = () => {
      if (window.snap?.pay) {
        resolve()
        return
      }
      if (Date.now() - started >= timeoutMs) {
        reject(
          new Error("Midtrans Snap tidak merespons. Muat ulang halaman."),
        )
        return
      }
      window.setTimeout(tick, 50)
    }
    tick()
  })
}

/** Muat Snap.js sekali untuk seluruh halaman (hindari banyak tag <Script> identik). */
export function loadMidtransSnap(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  if (window.snap?.pay) {
    return Promise.resolve()
  }

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
  if (!clientKey) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY tidak diset"),
    )
  }

  if (loadPromise) {
    return loadPromise
  }

  const src = getSnapScriptSrc()

  loadPromise = new Promise<void>((resolve, reject) => {
    let settled = false

    const settle = (action: "resolve" | "reject", error?: Error) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      if (action === "resolve") {
        resolve()
        return
      }
      loadPromise = null
      reject(error ?? new Error("Gagal memuat Snap.js"))
    }

    const timeoutId = window.setTimeout(() => {
      settle(
        "reject",
        new Error(
          "Waktu muat Midtrans Snap habis. Periksa koneksi internet lalu coba lagi.",
        ),
      )
    }, SNAP_LOAD_TIMEOUT_MS)

    const finish = () => {
      waitForSnapApi(3_000)
        .then(() => settle("resolve"))
        .catch((err) => settle("reject", err))
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    )

    if (existing) {
      finish()
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.setAttribute("data-client-key", clientKey)
    script.onload = finish
    script.onerror = () =>
      settle("reject", new Error("Gagal memuat Snap.js"))
    document.body.appendChild(script)
  })

  return loadPromise
}
