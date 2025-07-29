import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Database, Clock } from 'lucide-react';

interface PerformanceMetrics {
  memoryUsage: number;
  memoryLimit: number;
  renderTime: number;
  componentCount: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    memoryLimit: 0,
    renderTime: 0,
    componentCount: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1048576), // MB
          memoryLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
        }));
      }

      // Measure render performance
      const startTime = performance.now();
      requestAnimationFrame(() => {
        const endTime = performance.now();
        setMetrics(prev => ({
          ...prev,
          renderTime: Math.round(endTime - startTime * 100) / 100
        }));
      });

      // Count React components (approximate)
      const componentCount = document.querySelectorAll('[data-reactroot], [data-react-component]').length;
      setMetrics(prev => ({
        ...prev,
        componentCount
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);

    // Show/hide with Ctrl+Shift+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const memoryUsagePercent = (metrics.memoryUsage / metrics.memoryLimit) * 100;
  const getMemoryStatus = () => {
    if (memoryUsagePercent < 50) return 'good';
    if (memoryUsagePercent < 80) return 'warning';
    return 'danger';
  };

  const memoryStatus = getMemoryStatus();

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Monitor
            <Badge variant="outline" className="text-xs">DEV</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-3 w-3" />
              <span>Memory</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge 
                variant={memoryStatus === 'good' ? 'default' : memoryStatus === 'warning' ? 'secondary' : 'destructive'}
                className="text-xs"
              >
                {metrics.memoryUsage}MB / {metrics.memoryLimit}MB
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Render Time</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {metrics.renderTime}ms
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3" />
              <span>Components</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {metrics.componentCount}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            Press Ctrl+Shift+P to toggle
          </div>
        </CardContent>
      </Card>
    </div>
  );
};