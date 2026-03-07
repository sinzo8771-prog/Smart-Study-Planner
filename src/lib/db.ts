import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization of Prisma client
// Only create the client when actually needed, and handle errors gracefully
let _prisma: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (!_prisma) {
    try {
      _prisma = globalForPrisma.prisma ?? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
      
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma
      }
    } catch (error) {
      console.error('[DB] Failed to initialize Prisma client:', error)
      // Return a dummy client that will error on use
      // This should not happen in normal operation
      throw new Error('Database initialization failed. Check DATABASE_URL configuration.')
    }
  }
  return _prisma
}

// Export a proxy that lazily initializes the client
// This prevents errors at module load time
export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient()
    return client[prop as keyof PrismaClient]
  }
})
