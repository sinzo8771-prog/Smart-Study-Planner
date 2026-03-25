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
const databaseUrl = process.env.DATABASE_URL || ''
const isSupabasePooler = databaseUrl.includes('pooler.supabase.com')

// Add pgbouncer=true parameter if using Supabase pooler and not already present
if (isSupabasePooler && !databaseUrl.includes('pgbouncer=true')) {
  const separator = databaseUrl.includes('?') ? '&' : '?'
  process.env.DATABASE_URL = `${databaseUrl}${separator}pgbouncer=true`
}

// Optimized Prisma client for serverless (Vercel)
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Connection pooling for serverless
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

// Use global singleton in development to prevent multiple connections
// In production (Vercel), create new client per invocation but reuse within same invocation
export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Graceful shutdown helper
export async function disconnectDb() {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect()
    globalForPrisma.prisma = undefined
  }
}

// Migration functions kept for compatibility
let migrationPromise: Promise<void> | null = null

export async function runMigrations(): Promise<void> {
  if (globalForPrisma.migrationsRan) return

  if (globalForPrisma.migrationInProgress && migrationPromise) {
    return migrationPromise
  }

  globalForPrisma.migrationInProgress = true
  migrationPromise = executeMigration()

  try {
    await migrationPromise
  } finally {
    globalForPrisma.migrationInProgress = false
  }
}

async function executeMigration(): Promise<void> {
  try {
    // Try to add columns if they don't exist
    try {
      await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`)
    } catch { /* Column exists */ }

    try {
      await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`)
    } catch { /* Column exists */ }

    globalForPrisma.migrationsRan = true
  } catch (error) {
    globalForPrisma.migrationsRan = true
  }
}

export async function forceRunMigrations(): Promise<{ category: boolean; difficulty: boolean; error?: string }> {
  const result = { category: false, difficulty: false, error: undefined as string | undefined }

  try {
    globalForPrisma.migrationsRan = false

    try {
      await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`)
      result.category = true
    } catch (e) {
      if ((e as Error).message?.includes('already exists')) result.category = true
    }

    try {
      await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`)
      result.difficulty = true
    } catch (e) {
      if ((e as Error).message?.includes('already exists')) result.difficulty = true
    }

    globalForPrisma.migrationsRan = true
    return result
  } catch (error) {
    result.error = (error as Error).message
    globalForPrisma.migrationsRan = true
    return result
  }
}
