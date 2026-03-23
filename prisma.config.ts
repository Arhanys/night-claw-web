import { defineConfig } from "prisma/config"
import { config } from "dotenv"

// Load .env.local for Prisma CLI commands (Next.js handles this at runtime)
config({ path: ".env.local" })

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/nightclaw",
  },
})
