import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file and override system environment variables
config({ path: resolve(process.cwd(), '.env'), override: true })

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
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
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    // Connection timeout settings for serverless
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

// Helper to run queries with timeout
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Database query timed out')), timeoutMs)
    ),
  ]);
}

// Graceful shutdown helper (not really needed in serverless but good for local dev)
export async function disconnectDb() {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined
  }
}

// Migration functions kept for compatibility (simplified)
export async function runMigrations(): Promise<void> {
  // Skip migrations in production - they should be done via prisma migrate deploy
  if (process.env.NODE_ENV === 'production') return;
  
  try {
    await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`).catch(() => {});
    await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`).catch(() => {});
  } catch {
    // Ignore migration errors
  }
}

export async function forceRunMigrations(): Promise<{ category: boolean; difficulty: boolean; error?: string }> {
  return { category: true, difficulty: true };
}
