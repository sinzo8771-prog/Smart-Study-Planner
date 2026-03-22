import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file and override system environment variables
config({ path: resolve(process.cwd(), '.env'), override: true })

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
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
