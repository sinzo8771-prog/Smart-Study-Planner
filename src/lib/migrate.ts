// Database migration utilities
// This module handles automatic schema migrations for Supabase

import { PrismaClient } from '@prisma/client';

const globalForMigration = globalThis as unknown as {
  migrationRan: boolean;
};

// Run database migrations
export async function runMigrations(): Promise<void> {
  // Only run once per process
  if (globalForMigration.migrationRan) {
    console.log('[Migration] Already ran in this process, skipping');
    return;
  }
  
  console.log('[Migration] Starting automatic database migration check...');
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
  
  try {
    // Check if Quiz table has the required columns
    const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Quiz' 
      AND column_name IN ('category', 'difficulty')
    `;
    
    const columnNames = columns.map(c => c.column_name);
    const hasCategory = columnNames.includes('category');
    const hasDifficulty = columnNames.includes('difficulty');
    
    console.log(`[Migration] Quiz table columns: category=${hasCategory}, difficulty=${hasDifficulty}`);
    
    // Add missing columns
    if (!hasCategory) {
      console.log('[Migration] Adding category column to Quiz table...');
      await prisma.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`);
      console.log('[Migration] Added category column');
    }
    
    if (!hasDifficulty) {
      console.log('[Migration] Adding difficulty column to Quiz table...');
      await prisma.$executeRawUnsafe(`ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`);
      console.log('[Migration] Added difficulty column');
    }
    
    globalForMigration.migrationRan = true;
    console.log('[Migration] Database migration check completed successfully');
  } catch (error) {
    console.error('[Migration] Error during migration:', error);
    // Don't throw - this allows the app to start even if migration fails
  } finally {
    await prisma.$disconnect();
  }
}

// Run migrations lazily when needed
let migrationPromise: Promise<void> | null = null;

export async function ensureMigrations(): Promise<void> {
  if (globalForMigration.migrationRan) {
    return;
  }
  
  if (!migrationPromise) {
    migrationPromise = runMigrations();
  }
  
  await migrationPromise;
}
