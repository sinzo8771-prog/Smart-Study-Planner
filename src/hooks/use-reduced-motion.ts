'use client';

import { useState, useEffect } from 'react';


export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    
    const timer = setTimeout(() => {
      setPrefersReducedMotion(mediaQuery.matches);
    }, 0);

    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation props based on reduced motion preference
 * Use this to conditionally apply animations
 */
export function useAnimationProps() {
  const prefersReducedMotion = useReducedMotion();

  return {
    
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3 },
    
    whileHover: prefersReducedMotion ? {} : { scale: 1.02 },
    whileTap: prefersReducedMotion ? {} : { scale: 0.98 },
  };
}

export default useReducedMotion;
