import React from 'react';

// Performance optimization utilities

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memory cleanup for large arrays
export const cleanupArray = <T>(array: T[], maxSize: number = 1000): T[] => {
  if (array.length <= maxSize) return array;
  
  // Keep most recent items
  return array.slice(-maxSize);
};

// Efficient object comparison for React.memo
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (!obj1 || !obj2) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Lazy loading helper
export const createLazyComponent = (importFn: () => Promise<any>, fallback?: React.ComponentType) => {
  return React.lazy(() => 
    importFn().catch(err => {
      console.error('Failed to load component:', err);
      return { default: fallback || (() => React.createElement('div', null, 'Failed to load component')) };
    })
  );
};
