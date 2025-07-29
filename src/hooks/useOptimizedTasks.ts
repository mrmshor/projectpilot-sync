import { useState, useCallback, useMemo, useEffect } from 'react';
import { Task } from '@/types/task';
import { useTasks } from './useTasks';

// Debounce hook for performance
function useDebounce<T>(value: T, delay: number): T {
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

export const useOptimizedTasks = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, getTaskStats, exportToCSV } = useTasks();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  // Debounced search for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Memoized filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.projectName.toLowerCase().includes(searchLower) ||
        task.clientName.toLowerCase().includes(searchLower) ||
        task.projectDescription?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Apply status filter
    if (statusFilter === 'completed') {
      filtered = filtered.filter(task => task.isCompleted);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter(task => !task.isCompleted);
    }
    
    // Sort by update date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [tasks, debouncedSearchTerm, priorityFilter, statusFilter]);
  
  // Optimized update function with batching
  const optimizedUpdateTask = useCallback((id: string, updates: Partial<Task>) => {
    // Add timestamp for sorting
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date()
    };
    updateTask(id, updatesWithTimestamp);
  }, [updateTask]);
  
  // Batch delete function
  const batchDeleteTasks = useCallback((ids: string[]) => {
    ids.forEach(id => deleteTask(id));
  }, [deleteTask]);
  
  // Optimized create function
  const optimizedCreateTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    };
    createTask(newTask);
  }, [createTask]);
  
  // Memoized stats calculation
  const optimizedStats = useMemo(() => getTaskStats(), [tasks]);
  
  // Performance monitoring
  const getPerformanceMetrics = useCallback(() => ({
    totalTasks: tasks.length,
    filteredTasks: filteredTasks.length,
    memoryUsage: 'performance' in window && 'memory' in performance ? {
      used: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
      total: Math.round((performance as any).memory.totalJSHeapSize / 1048576)
    } : null
  }), [tasks.length, filteredTasks.length]);
  
  return {
    // Data
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    stats: optimizedStats,
    
    // Filters
    searchTerm,
    setSearchTerm,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    
    // Actions
    createTask: optimizedCreateTask,
    updateTask: optimizedUpdateTask,
    deleteTask,
    batchDeleteTasks,
    exportToCSV,
    
    // Performance
    getPerformanceMetrics
  };
};