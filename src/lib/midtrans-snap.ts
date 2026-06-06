const SNAP_SCRIPT_SANDBOX = "https://app.sandbox.midtrans.com/snap/snap.js"
const SNAP_SCRIPT_PRODUCTION = "https://app.midtrans.com/snap/snap.js"

function getSnapScriptSrc() {
  return process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? SNAP_SCRIPT_PRODUCTION
    : SNAP_SCRIPT_SANDBOX
}

let loadPromise: Promise<void> | null = null

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
    return Promise.reject(new Error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY tidak diset"))
  }

  if (loadPromise) {
    return loadPromise
  }

  const src = getSnapScriptSrc()

  loadPromise = new Promise((resolve, reject) => {
    const finish = () => {
      if (window.snap?.pay) {
        resolve()
      } else {
        reject(new Error("Midtrans Snap tidak tersedia setelah script dimuat"))
      }
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    )

    if (existing) {
      if (window.snap?.pay) {
        resolve()
        return
      }
      existing.addEventListener("load", finish, { once: true })
      existing.addEventListener("error", () => reject(new Error("Gagal memuat Snap.js")), {
        once: true,
      })
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.setAttribute("data-client-key", clientKey)
    script.onload = finish
    script.onerror = () => reject(new Error("Gagal memuat Snap.js"))
    document.body.appendChild(script)
  })

  return loadPromise
}
