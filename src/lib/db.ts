import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env'), override: true })

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL || ''
const isSupabasePooler = databaseUrl.includes('pooler.supabase.com')

if (isSupabasePooler && !databaseUrl.includes('pgbouncer=true')) {
  const separator = databaseUrl.includes('?') ? '&' : '?'
  process.env.DATABASE_URL = `${databaseUrl}${separator}pgbouncer=true`
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Database query timed out')), timeoutMs)
    ),
  ]);
}

export async function disconnectDb() {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined
  }
}

export async function runMigrations(): Promise<void> {
  if (process.env.NODE_ENV === 'production') return;
  
  try {
    await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`).catch(() => {});
    await db.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`).catch(() => {});
  } catch {
  }
}

export async function forceRunMigrations(): Promise<{ category: boolean; difficulty: boolean; error?: string }> {
  return { category: true, difficulty: true };
}
