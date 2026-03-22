import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file and override system environment variables
config({ path: resolve(process.cwd(), '.env'), override: true })

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  migrationsRan: boolean
}

// Check if we're using Supabase pooler (transaction mode)
// Supabase pooler URLs contain 'pooler.supabase.com' and need pgbouncer=true
const databaseUrl = process.env.DATABASE_URL || ''
const isSupabasePooler = databaseUrl.includes('pooler.supabase.com')

// Add pgbouncer=true parameter if using Supabase pooler and not already present
if (isSupabasePooler && !databaseUrl.includes('pgbouncer=true')) {
  const separator = databaseUrl.includes('?') ? '&' : '?'
  process.env.DATABASE_URL = `${databaseUrl}${separator}pgbouncer=true`
  console.log('[DB] Added pgbouncer=true to DATABASE_URL for Supabase pooler')
}

// Create Prisma client with appropriate settings for serverless
const createPrismaClient = () => {
  const clientOptions = {
    log: ['query', 'error', 'warn'] as const,
  }

  return new PrismaClient(clientOptions)
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Run migrations once per process
let migrationPromise: Promise<void> | null = null

export async function runMigrations(): Promise<void> {
  if (globalForPrisma.migrationsRan) {
    return
  }

  if (!migrationPromise) {
    migrationPromise = (async () => {
      try {
        console.log('[Migration] Checking Quiz table columns...')

        // Check if Quiz table has the required columns
        const columns = await db.$queryRaw<Array<{ column_name: string }>>`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'Quiz'
          AND column_name IN ('category', 'difficulty')
        `

        const columnNames = columns.map(c => c.column_name)
        const hasCategory = columnNames.includes('category')
        const hasDifficulty = columnNames.includes('difficulty')

        console.log(`[Migration] Quiz table columns: category=${hasCategory}, difficulty=${hasDifficulty}`)

        // Add missing columns
        if (!hasCategory) {
          console.log('[Migration] Adding category column to Quiz table...')
          await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`)
          console.log('[Migration] Added category column')
        }

        if (!hasDifficulty) {
          console.log('[Migration] Adding difficulty column to Quiz table...')
          await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`)
          console.log('[Migration] Added difficulty column')
        }

        globalForPrisma.migrationsRan = true
        console.log('[Migration] Database migration check completed')
      } catch (error) {
        console.error('[Migration] Error during migration:', error)
        // Mark as ran to avoid infinite retry
        globalForPrisma.migrationsRan = true
      }
    })()
  }

  await migrationPromise
}

// Auto-run migrations in production when database is accessed
// This ensures migrations run before any Quiz queries
if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
  // Run migrations in background
  runMigrations().catch(err => console.error('[Migration] Background migration error:', err))
}
