import { lazy, Suspense, ComponentType, ReactNode, useState, useEffect, useRef } from 'react';

// Loading component for lazy-loaded components
const ComponentLoader = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      <p className="text-sm text-muted-foreground">טוען {name}...</p>
    </div>
  </div>
);

// Higher-order component for lazy loading with error boundary
export const withLazyLoading = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  componentName: string,
  fallback?: ReactNode
) => {
  const LazyComponent = lazy(importFn);
  
  return (props: P) => (
    <Suspense fallback={fallback || <ComponentLoader name={componentName} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy-loaded components
export const LazyTaskTable = withLazyLoading(
  () => import('./TaskTable'),
  'טבלת משימות'
);

export const LazyOptimizedTaskTable = withLazyLoading(
  () => import('./optimized/OptimizedTaskTable').then(module => ({ default: module.OptimizedTaskTable })),
  'טבלת משימות מותאמת'
);

export const LazyCreateTaskDialog = withLazyLoading(
  () => import('./CreateTaskDialog').then(module => ({ default: module.CreateTaskDialog })),
  'יצירת משימה'
);

export const LazyTaskListDialog = withLazyLoading(
  () => import('./TaskListDialog').then(module => ({ default: module.TaskListDialog })),
  'רשימת משימות'
);

export const LazyDashboard = withLazyLoading(
  () => import('./Dashboard'),
  'לוח בקרה'
);

export const LazyOptimizedDashboard = withLazyLoading(
  () => import('./optimized/OptimizedDashboard').then(module => ({ default: module.OptimizedDashboard })),
  'לוח בקרה מותאם'
);

export const LazyVirtualizedTaskList = withLazyLoading(
  () => import('./optimized/VirtualizedTaskList').then(module => ({ default: module.VirtualizedTaskList })),
  'רשימה וירטואלית'
);

// Image lazy loading component
export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  placeholder,
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!inView && (
        <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground text-sm">טוען תמונה...</div>
        </div>
      )}
      
      {inView && (
        <>
          {!isLoaded && !isError && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="text-muted-foreground text-sm">טוען תמונה...</div>
            </div>
          )}
          
          <img
            src={src}
            alt={alt}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
            {...props}
          />
          
          {isError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-muted-foreground text-sm">שגיאה בטעינת תמונה</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Lazy loading hook for dynamic imports
export const useLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  deps: any[] = []
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    importFn()
      .then((module) => {
        if (isMounted) {
          setComponent(() => module.default);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, deps);

  return { Component, loading, error };
};