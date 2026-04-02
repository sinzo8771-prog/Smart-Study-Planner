


interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}


const globalCache = new Map<string, CacheEntry<unknown>>();


export const CACHE_TTL = {
  SHORT: 30 * 1000,      
  MEDIUM: 2 * 60 * 1000, 
  LONG: 5 * 60 * 1000,   
  VERY_LONG: 15 * 60 * 1000, 
};


export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  const cached = globalCache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  
  if (cached && (now - cached.timestamp) < cached.ttl) {
    return cached.data;
  }

  
  const data = await fetcher();
  
  
  globalCache.set(key, {
    data,
    timestamp: now,
    ttl,
  });

  return data;
}


export function getCached<T>(key: string): T | null {
  const cached = globalCache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (cached && (now - cached.timestamp) < cached.ttl) {
    return cached.data;
  }

  return null;
}


export function setCache<T>(key: string, data: T, ttl: number = CACHE_TTL.MEDIUM): void {
  globalCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}


export function invalidateCache(key: string): void {
  globalCache.delete(key);
}


export function invalidateCachePattern(pattern: string): void {
  for (const key of globalCache.keys()) {
    if (key.includes(pattern)) {
      globalCache.delete(key);
    }
  }
}


export function clearCache(): void {
  globalCache.clear();
}


let cleanupCompleted = false;

export function markCleanupCompleted(): void {
  cleanupCompleted = true;
}

export function isCleanupCompleted(): boolean {
  return cleanupCompleted;
}


export const CACHE_KEYS = {
  COURSES: 'courses',
  QUIZZES: 'quizzes',
  DASHBOARD_STATS: 'dashboard_stats',
  USER_PREFIX: 'user_',
};
