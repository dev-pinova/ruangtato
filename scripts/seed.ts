/**
 * Seed demo studios for Ruang Tato.
 * Run: npm run db:seed
 */
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { eq } from "drizzle-orm"

import { roles, studios } from "../src/db/schema"
import { createDefaultPageConfig } from "../src/lib/default-page-config"

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
    isPublished: true,
  },
  {
    slug: "sakura-ink",
    name: "Sakura Ink Studio",
    city: "Bandung",
    waNumber: "6289876543210",
    description: "Spesialis Japanese dan fine line tattoo.",
    artist: "Dewi Anggraini",
    tags: ["Japanese", "Fine Line", "Bandung"],
    isPublished: true,
  },
  {
    slug: "bali-skin-art",
    name: "Bali Skin Art",
    city: "Denpasar",
    waNumber: "6281122334455",
    description: "Tattoo & piercing studio dengan suasana tropis.",
    artist: "Made Wijaya",
    tags: ["Realism", "Piercing", "Bali"],
    isPublished: true,
  },
]

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

    await db.insert(studios).values({
      slug: demo.slug,
      name: demo.name,
      city: demo.city,
      waNumber: demo.waNumber,
      description: demo.description,
      image:
        "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop",
      artist: demo.artist,
      tags: demo.tags,
      isPublished: demo.isPublished,
      pageConfig,
    })

    console.log(`Seeded: ${demo.slug}`)
  }

  await pool.end()
  console.log("Seed complete.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
