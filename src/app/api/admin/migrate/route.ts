import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

// POST /api/admin/migrate - Run database migration
// This endpoint adds missing columns to the database
export async function POST() {
  try {
    console.log('[Migration] Starting database migration...');
    
    // Try to add missing columns if they don't exist
    const migrations = [
      {
        name: 'quiz_category_column',
        sql: `ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'General'`,
      },
      {
        name: 'quiz_difficulty_column', 
        sql: `ALTER TABLE "Quiz" ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'beginner'`,
      },
    ];
    
    const results = [];
    
    for (const migration of migrations) {
      try {
        await db.$executeRawUnsafe(migration.sql);
        results.push({ name: migration.name, status: 'success' });
        console.log(`[Migration] ${migration.name}: success`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Column might already exist, which is fine
        if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
          results.push({ name: migration.name, status: 'already_exists' });
          console.log(`[Migration] ${migration.name}: already exists`);
        } else {
          results.push({ name: migration.name, status: 'error', error: errorMessage });
          console.error(`[Migration] ${migration.name}: error -`, errorMessage);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database migration completed',
      results,
    });
  } catch (error) {
    console.error('[Migration] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed',
    }, { status: 500 });
  }
}

// GET /api/admin/migrate - Check migration status
export async function GET() {
  try {
    // Check if the columns exist by querying the database
    const result = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Quiz' 
      AND column_name IN ('category', 'difficulty')
    `;
    
    const columns = Array.isArray(result) ? result.map((r: { column_name: string }) => r.column_name) : [];
    
    return NextResponse.json({
      success: true,
      quizTable: {
        hasCategory: columns.includes('category'),
        hasDifficulty: columns.includes('difficulty'),
        columns,
      },
    });
  } catch (error) {
    console.error('[Migration] Check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Check failed',
    }, { status: 500 });
  }
}
