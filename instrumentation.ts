// This file runs when the Next.js server starts
// It's used to run database migrations automatically

export async function register() {
  // Only run on server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server starting, checking database migrations...');
    
    try {
      // Run migrations in the background
      // We import dynamically to avoid circular dependencies
      const { runMigrations } = await import('./src/lib/migrate');
      await runMigrations();
    } catch (error) {
      console.error('[Instrumentation] Migration error:', error);
      // Don't throw - let the app start anyway
    }
  }
}
