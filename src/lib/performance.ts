// Performance monitoring utilities
// Tracks bundle size, load times, and runtime performance

import { useState, useEffect } from 'react';

export interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
  renderTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

class PerformanceMonitor {
  private startTime: number;
  private metrics: Partial<PerformanceMetrics> = {};

  constructor() {
    this.startTime = performance.now();
    this.initializeMetrics();
  }

  private initializeMetrics() {
    // Memory usage (Chrome only)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
    }

    // Web Vitals
    this.observeWebVitals();
  }

  private observeWebVitals() {
    // First Contentful Paint
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observation not supported');
    }

    // Largest Contentful Paint
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observation not supported');
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observation not supported');
    }

    // First Input Delay
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observation not supported');
    }
  }

  // Measure component render time
  measureRender<T>(componentName: string, renderFn: () => T): T {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
    return result;
  }

  // Measure async operation time
  async measureAsync<T>(operationName: string, asyncFn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await asyncFn();
    const end = performance.now();
    
    console.log(`${operationName} time: ${(end - start).toFixed(2)}ms`);
    return result;
  }

  // Get current performance metrics
  getMetrics(): PerformanceMetrics {
    const loadTime = performance.now() - this.startTime;
    
    return {
      bundleSize: this.getBundleSize(),
      loadTime: Math.round(loadTime),
      renderTime: Math.round(performance.now()),
      ...this.metrics,
    } as PerformanceMetrics;
  }

  // Estimate bundle size from loaded resources
  private getBundleSize(): number {
    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let totalSize = 0;
      
      resources.forEach((resource) => {
        if (resource.name.includes('.js') || resource.name.includes('.css')) {
          totalSize += resource.transferSize || 0;
        }
      });
      
      return Math.round(totalSize / 1024); // KB
    } catch (e) {
      return 0;
    }
  }

  // Log performance report
  logReport() {
    const metrics = this.getMetrics();
    console.group('🚀 Performance Report');
    console.log('Bundle Size:', `${metrics.bundleSize} KB`);
    console.log('Load Time:', `${metrics.loadTime} ms`);
    console.log('Render Time:', `${metrics.renderTime} ms`);
    
    if (metrics.memoryUsage) {
      console.log('Memory Usage:', `${metrics.memoryUsage.used}/${metrics.memoryUsage.total} MB`);
    }
    
    if (metrics.firstContentfulPaint) {
      console.log('First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)} ms`);
    }
    
    if (metrics.largestContentfulPaint) {
      console.log('Largest Contentful Paint:', `${metrics.largestContentfulPaint.toFixed(2)} ms`);
    }
    
    if (metrics.cumulativeLayoutShift !== undefined) {
      console.log('Cumulative Layout Shift:', metrics.cumulativeLayoutShift.toFixed(4));
    }
    
    if (metrics.firstInputDelay) {
      console.log('First Input Delay:', `${metrics.firstInputDelay.toFixed(2)} ms`);
    }
    
    console.groupEnd();
  }

  // Check if performance is within acceptable thresholds
  isPerformanceGood(): boolean {
    const metrics = this.getMetrics();
    
    const checks = {
      loadTime: metrics.loadTime < 3000, // Less than 3 seconds
      bundleSize: metrics.bundleSize < 1000, // Less than 1MB
      fcp: !metrics.firstContentfulPaint || metrics.firstContentfulPaint < 1800, // Less than 1.8s
      lcp: !metrics.largestContentfulPaint || metrics.largestContentfulPaint < 2500, // Less than 2.5s
      cls: metrics.cumulativeLayoutShift === undefined || metrics.cumulativeLayoutShift < 0.1, // Less than 0.1
      fid: !metrics.firstInputDelay || metrics.firstInputDelay < 100, // Less than 100ms
    };
    
    return Object.values(checks).every(Boolean);
  }

  // Get performance grade
  getPerformanceGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    const metrics = this.getMetrics();
    let score = 0;
    
    // Load time (30 points)
    if (metrics.loadTime < 1000) score += 30;
    else if (metrics.loadTime < 2000) score += 25;
    else if (metrics.loadTime < 3000) score += 20;
    else if (metrics.loadTime < 5000) score += 10;
    
    // Bundle size (25 points)
    if (metrics.bundleSize < 500) score += 25;
    else if (metrics.bundleSize < 800) score += 20;
    else if (metrics.bundleSize < 1000) score += 15;
    else if (metrics.bundleSize < 1500) score += 10;
    
    // FCP (20 points)
    if (!metrics.firstContentfulPaint || metrics.firstContentfulPaint < 1000) score += 20;
    else if (metrics.firstContentfulPaint < 1800) score += 15;
    else if (metrics.firstContentfulPaint < 3000) score += 10;
    
    // LCP (15 points)
    if (!metrics.largestContentfulPaint || metrics.largestContentfulPaint < 2000) score += 15;
    else if (metrics.largestContentfulPaint < 2500) score += 10;
    else if (metrics.largestContentfulPaint < 4000) score += 5;
    
    // CLS (10 points)
    if (metrics.cumulativeLayoutShift === undefined || metrics.cumulativeLayoutShift < 0.1) score += 10;
    else if (metrics.cumulativeLayoutShift < 0.25) score += 5;
    
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    logReport: () => performanceMonitor.logReport(),
    isGood: () => performanceMonitor.isPerformanceGood(),
    grade: () => performanceMonitor.getPerformanceGrade(),
  };
};

// Development helper
if (import.meta.env.DEV) {
  // Log performance report after page load
  window.addEventListener('load', () => {
    setTimeout(() => performanceMonitor.logReport(), 2000);
  });
}