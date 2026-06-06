/**
 * Seed demo published studios for load testing / showcase.
 * Usage: node scripts/seed-studios.mjs [count]
 * Requires DATABASE_URL in environment.
 */

import pg from "pg"

const count = Math.min(parseInt(process.argv[2] ?? "10", 10), 100)
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL is required")
  process.exit(1)
}

const pool = new pg.Pool({ connectionString })

const DEFAULT_BLOCKS = [
  {
    id: "header-1",
    type: "Header",
    data: { title: "Demo Studio", ctaText: "Book Now" },
    visible: true,
  },
  {
    id: "heroslider-1",
    type: "HeroSlider",
    data: {
      slides: [
        {
          headline: "Eyes Wide Open",
          subheadline: "Studio tattoo profesional dengan desain unik.",
          ctaText: "Get a Tattoo",
          image:
            "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    visible: true,
  },
  {
    id: "footer-1",
    type: "Footer",
    data: { title: "Demo Studio", address: "Jakarta, Indonesia" },
    visible: true,
  },
]

async function main() {
  const client = await pool.connect()
  try {
    let [ownerRole] = (
      await client.query(`SELECT id FROM roles WHERE name = 'owner' LIMIT 1`)
    ).rows

    if (!ownerRole) {
      const inserted = await client.query(
        `INSERT INTO roles (name) VALUES ('owner') RETURNING id`,
      )
      ownerRole = inserted.rows[0]
    }

    for (let i = 1; i <= count; i++) {
      const slug = `demo-studio-${i}`
      const name = `Demo Studio ${i}`

      const existing = await client.query(
        `SELECT id FROM studios WHERE slug = $1`,
        [slug],
      )
      if (existing.rows.length > 0) {
        console.log(`Skip ${slug} (exists)`)
        continue
      }

      const studioRes = await client.query(
        `INSERT INTO studios (slug, name, city, wa_number, description, image, artist, tags, is_published, page_config)
         VALUES ($1, $2, 'Jakarta', '6281234567890', $3, $4, 'Demo Artist', '["Custom"]'::jsonb, true, $5::jsonb)
         RETURNING id`,
        [
          slug,
          name,
          `Landing page demo ${name}`,
          "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop",
          JSON.stringify(
            DEFAULT_BLOCKS.map((b) => ({
              ...b,
              data: { ...b.data, title: b.type === "Header" || b.type === "Footer" ? name : b.data.title },
            })),
          ),
        ],
      )

      const studioId = studioRes.rows[0].id
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 1)

      await client.query(
        `INSERT INTO subscriptions (studio_id, plan_type, status, expires_at)
         VALUES ($1, '1month', 'active', $2)`,
        [studioId, expiresAt.toISOString()],
      )

      console.log(`Created ${slug} (${studioId})`)
    }

    console.log(`Done. Seeded up to ${count} demo studios.`)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
