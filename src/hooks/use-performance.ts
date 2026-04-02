'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to debounce a value
 * Useful for search inputs, resize handlers, etc.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to throttle a value
 * Useful for scroll handlers, mouse move, etc.
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timeoutId = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastUpdate);

      return () => clearTimeout(timeoutId);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Hook to track scroll position with throttling
 */
export function useScrollPosition(throttleMs: number = 100) {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const lastUpdate = useRef<number>(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdate.current >= throttleMs) {
        lastUpdate.current = now;
        setScrollPosition({
          x: window.scrollX,
          y: window.scrollY,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial position after mount
    const timer = setTimeout(() => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [throttleMs]);

  return scrollPosition;
}

/**
 * Hook to track window size with debouncing
 */
export function useWindowSize(debounceMs: number = 150) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceMs]);

  return windowSize;
}

/**
 * Hook to detect slow connection
 * Useful for serving lighter content on slow connections
 */
export function useConnectionSpeed() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    // @ts-expect-error - connection API is not in standard types
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const checkSpeed = () => {
        const slowTypes = ['slow-2g', '2g', '3g'];
        setIsSlowConnection(
          slowTypes.includes(connection.effectiveType) || 
          (connection.downlink && connection.downlink < 1.5)
        );
      };

      checkSpeed();
      connection.addEventListener('change', checkSpeed);

      return () => {
        connection.removeEventListener('change', checkSpeed);
      };
    }
  }, []);

  return { isSlowConnection };
}

/**
 * Hook to measure component render time
 * Useful for performance debugging
 */
export function useRenderTime(componentName: string) {
  const renderStart = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStart.current;
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  });
}

export default useDebounce;
