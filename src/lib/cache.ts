// Simple in-memory cache with TTL for serverless environments
// This helps reduce database queries on Vercel

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Global cache store that persists across invocations in the same instance
const globalCache = new Map<string, CacheEntry<unknown>>();

// Default TTL values (in milliseconds)
export const CACHE_TTL = {
  SHORT: 30 * 1000,      // 30 seconds - for frequently changing data
  MEDIUM: 2 * 60 * 1000, // 2 minutes - for moderately changing data
  LONG: 5 * 60 * 1000,   // 5 minutes - for relatively static data
  VERY_LONG: 15 * 60 * 1000, // 15 minutes - for rarely changing data
};

/**
 * Get data from cache or fetch it
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  const cached = globalCache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  // Return cached data if still valid
  if (cached && (now - cached.timestamp) < cached.ttl) {
    return cached.data;
  }

  // Fetch fresh data
  const data = await fetcher();
  
  // Cache the result
  globalCache.set(key, {
    data,
    timestamp: now,
    ttl,
  });

  return data;
}

/**
 * Get cached data if available (without fetching)
 */
export function getCached<T>(key: string): T | null {
  const cached = globalCache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (cached && (now - cached.timestamp) < cached.ttl) {
    return cached.data;
  }

  return null;
}

/**
 * Set cache data directly
 */
export function setCache<T>(key: string, data: T, ttl: number = CACHE_TTL.MEDIUM): void {
  globalCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Invalidate a specific cache key
 */
export function invalidateCache(key: string): void {
  globalCache.delete(key);
}

/**
 * Invalidate all cache keys matching a pattern
 */
export function invalidateCachePattern(pattern: string): void {
  for (const key of globalCache.keys()) {
    if (key.includes(pattern)) {
      globalCache.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  globalCache.clear();
}

/**
 * Check if cleanup has been done this deployment
 * Uses a persistent flag in the cache
 */
let cleanupCompleted = false;

export function markCleanupCompleted(): void {
  cleanupCompleted = true;
}

export function isCleanupCompleted(): boolean {
  return cleanupCompleted;
}

// Cache keys
export const CACHE_KEYS = {
  COURSES: 'courses',
  QUIZZES: 'quizzes',
  DASHBOARD_STATS: 'dashboard_stats',
  USER_PREFIX: 'user_',
};
