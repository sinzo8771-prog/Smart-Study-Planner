'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}


export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    
    if (typeof IntersectionObserver === 'undefined') {
      
      const timer = setTimeout(() => setIsInView(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}


export function useInViewItems<T extends HTMLElement = HTMLElement>(
  itemCount: number,
  options: UseInViewOptions = {}
): [RefObject<(T | null)[]>, boolean[]] {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const refs = useRef<(T | null)[]>([]);
  const [inViewStates, setInViewStates] = useState<boolean[]>(
    () => Array(itemCount).fill(false)
  );

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      
      const timer = setTimeout(() => setInViewStates(Array(itemCount).fill(true)), 0);
      return () => clearTimeout(timer);
    }

    const observers: IntersectionObserver[] = [];

    refs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInViewStates((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setInViewStates((prev) => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [itemCount, threshold, rootMargin, triggerOnce]);

  return [refs, inViewStates];
}

export default useInView;
