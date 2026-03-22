import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file and override system environment variables
config({ path: resolve(process.cwd(), '.env'), override: true })

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  migrationsRan: boolean
  migrationInProgress: boolean
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

// Run migrations once per process with proper locking
let migrationPromise: Promise<void> | null = null

export async function runMigrations(): Promise<void> {
  // If already ran, return immediately
  if (globalForPrisma.migrationsRan) {
    console.log('[Migration] Already completed, skipping')
    return
  }

  // If migration is in progress, wait for it
  if (globalForPrisma.migrationInProgress && migrationPromise) {
    console.log('[Migration] Waiting for in-progress migration...')
    return migrationPromise
  }

  // Start migration
  globalForPrisma.migrationInProgress = true
  migrationPromise = executeMigration()

  try {
    await migrationPromise
  } finally {
    globalForPrisma.migrationInProgress = false
  }
}

async function executeMigration(): Promise<void> {
  console.log('[Migration] Starting Quiz table migration check...')

  try {
    // Simple approach: just try to add the columns, catch errors if they exist
    // This works better with Supabase pooler than DO blocks

    // First, try to add category column
    try {
      console.log('[Migration] Attempting to add category column...')
      await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`)
      console.log('[Migration] ✅ category column added or already exists')
    } catch (catError) {
      const errMsg = catError instanceof Error ? catError.message : String(catError)
      if (errMsg.includes('already exists') || errMsg.includes('duplicate')) {
        console.log('[Migration] ✅ category column already exists')
      } else {
        console.log('[Migration] category column result:', errMsg)
      }
    }

    // Then, try to add difficulty column
    try {
      console.log('[Migration] Attempting to add difficulty column...')
      await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`)
      console.log('[Migration] ✅ difficulty column added or already exists')
    } catch (diffError) {
      const errMsg = diffError instanceof Error ? diffError.message : String(diffError)
      if (errMsg.includes('already exists') || errMsg.includes('duplicate')) {
        console.log('[Migration] ✅ difficulty column already exists')
      } else {
        console.log('[Migration] difficulty column result:', errMsg)
      }
    }

    // Verify the columns exist
    try {
      const columns = await db.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'Quiz'
        AND column_name IN ('category', 'difficulty')
      `
      const columnNames = columns.map(c => c.column_name)
      console.log(`[Migration] Verification - Quiz table columns: ${columnNames.join(', ')}`)

      if (columnNames.includes('category') && columnNames.includes('difficulty')) {
        console.log('[Migration] ✅ Database migration completed successfully')
      } else {
        console.log('[Migration] ⚠️ Some columns may still be missing:', { columnNames })
      }
    } catch (verifyError) {
      console.log('[Migration] Could not verify columns:', verifyError instanceof Error ? verifyError.message : String(verifyError))
    }

    globalForPrisma.migrationsRan = true
  } catch (error) {
    console.error('[Migration] ❌ Migration error:', error)
    // Mark as ran to prevent infinite retries
    globalForPrisma.migrationsRan = true
  }
}

// Force run migration - used by API endpoint
export async function forceRunMigrations(): Promise<{ category: boolean; difficulty: boolean; error?: string }> {
  console.log('[Migration] Force running migrations...')

  const result = { category: false, difficulty: false, error: undefined as string | undefined }

  try {
    // Reset the migration flag to force re-run
    globalForPrisma.migrationsRan = false

    // Try to add category column
    try {
      await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`)
      result.category = true
      console.log('[Migration] Force: category column added/confirmed')
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e)
      if (errMsg.includes('already exists') || errMsg.includes('duplicate')) {
        result.category = true
        console.log('[Migration] Force: category column already exists')
      } else {
        console.log('[Migration] Force: category error:', errMsg)
      }
    }

    // Try to add difficulty column
    try {
      await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`)
      result.difficulty = true
      console.log('[Migration] Force: difficulty column added/confirmed')
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e)
      if (errMsg.includes('already exists') || errMsg.includes('duplicate')) {
        result.difficulty = true
        console.log('[Migration] Force: difficulty column already exists')
      } else {
        console.log('[Migration] Force: difficulty error:', errMsg)
      }
    }

    // Verify columns exist
    try {
      const columns = await db.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'Quiz'
        AND column_name IN ('category', 'difficulty')
      `
      const columnNames = columns.map(c => c.column_name)
      result.category = columnNames.includes('category')
      result.difficulty = columnNames.includes('difficulty')
      console.log('[Migration] Force: verification -', columnNames.join(', '))
    } catch (verifyErr) {
      console.log('[Migration] Force: could not verify columns')
    }

    globalForPrisma.migrationsRan = true
    console.log('[Migration] Force migration result:', result)
    return result
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error)
    console.error('[Migration] Force migration error:', error)
    globalForPrisma.migrationsRan = true
    return result
  }
}
