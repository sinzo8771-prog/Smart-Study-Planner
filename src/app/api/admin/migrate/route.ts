import { NextResponse } from 'next/server';
import { forceRunMigrations, runMigrations } from '@/lib/db';

// POST /api/admin/migrate - Force run database migration
// This endpoint adds missing columns to the database
export async function POST() {
  try {
    console.log('[Migration API] Force running database migration...');
    
    const result = await forceRunMigrations();
    
    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error,
        category: result.category,
        difficulty: result.difficulty,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database migration completed',
      category: result.category,
      difficulty: result.difficulty,
    });
  } catch (error) {
    console.error('[Migration API] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed',
    }, { status: 500 });
  }
}

// GET /api/admin/migrate - Run migration check and return status
export async function GET() {
  try {
    // Run migrations first
    await runMigrations();
    
    // Check if the columns exist by querying the database
    const { db } = await import('@/lib/db');
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
    console.error('[Migration API] Check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Check failed',
    }, { status: 500 });
  }
}
