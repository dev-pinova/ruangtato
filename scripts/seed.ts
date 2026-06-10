/**
 * Seed demo studios for Ruang Tato.
 * Run: npm run db:seed
 */
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { eq } from "drizzle-orm"

import { roles, studios, subscriptions } from "../src/db/schema"
import { createDefaultPageConfig } from "../src/lib/studio/default-page-config"
import { PLACEHOLDER_IMAGES } from "../src/lib/placeholder-images"
import { mapBlocksToDbBlocks } from "../src/lib/types"

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://ruangtato:ruangtato@localhost:5432/ruangtato"

const DEMO_STUDIOS = [
  {
    slug: "ink-and-iron",
    name: "Ink & Iron Tattoo",
    city: "Jakarta",
    waNumber: "6281234567890",
    description: "Studio blackwork dan custom piece di Jakarta Selatan.",
    artist: "Rizky Pratama",
    tags: ["Blackwork", "Custom", "Jakarta"],
    image: PLACEHOLDER_IMAGES.tattooStudioA,
    isPublished: true,
    paid: true,
  },
  {
    slug: "sakura-ink",
    name: "Sakura Ink Studio",
    city: "Bandung",
    waNumber: "6289876543210",
    description: "Spesialis Japanese dan fine line tattoo.",
    artist: "Dewi Anggraini",
    tags: ["Japanese", "Fine Line", "Bandung"],
    image: PLACEHOLDER_IMAGES.tattooStudioB,
    isPublished: true,
    paid: true,
  },
  {
    slug: "bali-skin-art",
    name: "Bali Skin Art",
    city: "Denpasar",
    waNumber: "6281122334455",
    description: "Tattoo & piercing studio dengan suasana tropis.",
    artist: "Made Wijaya",
    tags: ["Realism", "Piercing", "Bali"],
    image: PLACEHOLDER_IMAGES.tattooStudioC,
    isPublished: true,
    paid: true,
  },
  {
    slug: "neon-needle",
    name: "Neon Needle",
    city: "Yogyakarta",
    waNumber: "6282233445566",
    description: "Studio tattoo modern dengan gaya neo-traditional.",
    artist: "Adit Mahendra",
    tags: ["Neo-Traditional", "Color", "Yogyakarta"],
    image: PLACEHOLDER_IMAGES.tattooWorkA,
    isPublished: true,
    paid: false,
  },
  {
    slug: "shadow-line",
    name: "Shadow Line",
    city: "Semarang",
    waNumber: "6283344556677",
    description: "Fine line dan minimal tattoo dengan konsultasi mendetail.",
    artist: "Clara Sutanto",
    tags: ["Fine Line", "Minimal", "Semarang"],
    image: PLACEHOLDER_IMAGES.tattooWorkB,
    isPublished: true,
    paid: false,
  },
  {
    slug: "iron-canvas",
    name: "Iron Canvas",
    city: "Surabaya",
    waNumber: "6284455667788",
    description: "Custom sleeve dan large-scale piece oleh tim berpengalaman.",
    artist: "Bima Kusuma",
    tags: ["Sleeve", "Custom", "Surabaya"],
    image: PLACEHOLDER_IMAGES.tattooStudioB,
    isPublished: true,
    paid: false,
  },
] as const

async function main() {
  const pool = new Pool({ connectionString })
  const db = drizzle(pool)

  let ownerRole = await db.select().from(roles).where(eq(roles.name, "owner")).limit(1)
  if (!ownerRole[0]) {
    const [created] = await db.insert(roles).values({ name: "owner" }).returning()
    ownerRole = [created]
  }

  for (const demo of DEMO_STUDIOS) {
    const existing = await db
      .select()
      .from(studios)
      .where(eq(studios.slug, demo.slug))
      .limit(1)

    if (existing[0]) {
      console.log(`Skip (exists): ${demo.slug}`)
      continue
    }

    const pageConfig = createDefaultPageConfig(demo.name)

    const [studio] = await db
      .insert(studios)
      .values({
        slug: demo.slug,
        name: demo.name,
        city: demo.city,
        waNumber: demo.waNumber,
        description: demo.description,
        image: demo.image,
        artist: demo.artist,
        tags: [...demo.tags],
        isPublished: demo.isPublished,
        pageConfig: mapBlocksToDbBlocks(pageConfig),
      })
      .returning()

    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + (demo.paid ? 1 : 0))

    await db.insert(subscriptions).values({
      studioId: studio.id,
      planType: demo.paid ? "1month" : "trial",
      status: "active",
      expiresAt: demo.paid
        ? expiresAt
        : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    })

    console.log(`Seeded: ${demo.slug}${demo.paid ? " (paid)" : " (trial)"}`)
  }

  await pool.end()
  console.log("Seed complete.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
