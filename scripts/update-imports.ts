import * as fs from "fs"
import * as path from "path"

const mapping: Record<string, string> = {
  "admin-analytics-service": "admin/admin-analytics-service",
  "admin-auth": "admin/admin-auth",
  "admin-rate-limit": "admin/admin-rate-limit",
  "admin-service": "admin/admin-service",
  "admin-staff-service": "admin/admin-staff-service",
  "admin-suspend-service": "admin/admin-suspend-service",
  "audit-log": "admin/audit-log",
  "suspension-types": "admin/suspension-types",

  "auth": "auth/auth",
  "auth-client": "auth/auth-client",
  "session": "auth/session",

  "billing-activation": "billing/billing-activation",
  "billing-plans": "billing/billing-plans",
  "midtrans": "billing/midtrans",
  "midtrans-snap": "billing/midtrans-snap",
  "payment-service": "billing/payment-service",

  "studio-service": "studio/studio-service",
  "studio-guard": "studio/studio-guard",
  "studio-utils": "studio/studio-utils",
  "default-page-config": "studio/default-page-config",
  "showcase-demos": "studio/showcase-demos"
}

// Recursively find all files with specific extensions
function getFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, extensions))
    } else {
      if (extensions.includes(path.extname(file))) {
        results.push(fullPath)
      }
    }
  })
  return results
}

const targetExtensions = [".ts", ".tsx"]
const srcDir = path.resolve(__dirname, "../src")
const files = getFiles(srcDir, targetExtensions)

console.log(`Found ${files.length} TypeScript/TSX files. Scanning for import updates...`)

let filesUpdated = 0

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, "utf-8")
  let updated = false

  // Replace absolute alias paths: @/lib/filename -> @/lib/folder/filename
  for (const [key, val] of Object.entries(mapping)) {
    // We want to match `@/lib/key` but NOT `@/lib/val` (already replaced)
    // To be precise, match "@/lib/key" or '@/lib/key' but with optional quote/slash/etc.
    // e.g. "@/lib/auth" should not match "@/lib/auth/auth" or "@/lib/auth-client"
    // Use regex to match exact path boundaries:
    // @/lib/key followed by closing quote or slash or end of line.
    const regex = new RegExp(`@/lib/${key}(?=["'/]|$)`, "g")
    if (regex.test(content)) {
      content = content.replace(regex, `@/lib/${val}`)
      updated = true
    }
  }

  // Handle specific relative import issues in billing-activation.test.ts
  if (filePath.endsWith("billing-activation.test.ts")) {
    if (content.includes('"./studio-service"')) {
      content = content.replace('"./studio-service"', '"../studio/studio-service"')
      updated = true
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content, "utf-8")
    console.log(`Updated imports in: ${path.relative(process.cwd(), filePath)}`)
    filesUpdated++
  }
})

console.log(`Finished updating imports. ${filesUpdated} files modified.`)
