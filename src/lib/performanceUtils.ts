// Performance utilities and optimizations

// Debounce function for performance optimization
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

// Throttle function for scroll and resize events
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

// Memory-safe localStorage operations
export const safeLSOperations = {
  // Check localStorage size and clean up if needed
  checkStorageSize: (): number => {
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return totalSize;
  },

  // Clean up old data if storage is getting full (> 4MB)
  cleanupIfNeeded: (): void => {
    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
    const currentSize = safeLSOperations.checkStorageSize();
    
    if (currentSize > MAX_SIZE) {
      console.warn('localStorage is getting full, cleaning up old data');
      
      // Keep only the most recent 500 tasks and 50 quick tasks
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const quickTasks = JSON.parse(localStorage.getItem('quickTasks') || '[]');
        
        if (tasks.length > 500) {
          const recentTasks = tasks
            .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 500);
          localStorage.setItem('tasks', JSON.stringify(recentTasks));
        }
        
        if (quickTasks.length > 50) {
          const recentQuickTasks = quickTasks
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 50);
          localStorage.setItem('quickTasks', JSON.stringify(recentQuickTasks));
        }
      } catch (error) {
        console.error('Error cleaning up localStorage:', error);
      }
    }
  },

  // Safe set with cleanup
  setItem: (key: string, value: string): boolean => {
    try {
      safeLSOperations.cleanupIfNeeded();
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      safeLSOperations.cleanupIfNeeded();
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return false;
      }
    }
  }
};

// Request animation frame optimization
export const raf = (callback: () => void): void => {
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 16);
  }
};

// Performance monitoring
export const perfMonitor = {
  start: (label: string): void => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${label}-start`);
    }
  },

  end: (label: string): void => {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label)[0];
      if (measure && measure.duration > 100) {
        console.warn(`Performance warning: ${label} took ${measure.duration.toFixed(2)}ms`);
      }
    }
  }
};

// Memory usage monitoring
export const memoryMonitor = {
  check: (): void => {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      const limit = memory.jsHeapSizeLimit;
      
      const usagePercent = (used / limit) * 100;
      
      if (usagePercent > 80) {
        console.warn(`High memory usage: ${usagePercent.toFixed(2)}% (${used} / ${limit})`);
      }
    }
  }
};
