// This file runs when the Next.js server starts
// It's used to run database migrations automatically

export async function register() {
  // Only run on server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server starting, checking database migrations...');
    
    try {
      // Import and run migrations from db.ts
      const { runMigrations } = await import('./src/lib/db');
      await runMigrations();
      console.log('[Instrumentation] Migrations completed successfully');
    } catch (error) {
      console.error('[Instrumentation] Migration error:', error);
      // Don't throw - let the app start anyway
    }
  }
}
