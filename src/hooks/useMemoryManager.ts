import { useEffect, useRef } from 'react';

// Hook for managing memory and preventing leaks
export const useMemoryManager = () => {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const eventListenersRef = useRef<Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
  }>>([]);

  // Safe timeout
  const safeSetTimeout = (callback: () => void, delay: number): NodeJS.Timeout => {
    const timeoutId = setTimeout(() => {
      timeoutsRef.current.delete(timeoutId);
      callback();
    }, delay);
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  };

  // Safe interval
  const safeSetInterval = (callback: () => void, delay: number): NodeJS.Timeout => {
    const intervalId = setInterval(callback, delay);
    intervalsRef.current.add(intervalId);
    return intervalId;
  };

  // Safe event listener with cleanup tracking
  const safeAddEventListener = (
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
  ) => {
    try {
      element.addEventListener(event, handler, options);
      eventListenersRef.current.push({ element, event, handler });
    } catch (error) {
      console.warn('Failed to add event listener:', error);
    }
  };

  // Cleanup function
  const cleanup = () => {
    // Clear timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current.clear();

    // Clear intervals
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current.clear();

    // Remove event listeners safely
    eventListenersRef.current.forEach(({ element, event, handler }) => {
      try {
        element.removeEventListener(event, handler);
      } catch (error) {
        console.warn('Failed to remove event listener:', error);
      }
    });
    eventListenersRef.current = [];
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  return {
    safeSetTimeout,
    safeSetInterval,
    safeAddEventListener,
    cleanup
  };
};

// Memory monitoring hook
export const useMemoryMonitor = (componentName: string) => {
  useEffect(() => {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
        
        if (usedMB > limitMB * 0.8) {
          console.warn(`${componentName}: High memory usage: ${usedMB}MB / ${limitMB}MB`);
        }
      };

      const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [componentName]);
};