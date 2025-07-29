import { useState, useEffect, useCallback } from 'react';
import { QuickTask } from '@/types/quickTask';
import { handleStorageError, safeJSONParse, generateId } from '@/lib/errorHandling';

const QUICK_TASKS_STORAGE_KEY = 'quick-tasks';
const MAX_QUICK_TASKS = 100; // Limit number of quick tasks
const SAVE_DEBOUNCE_MS = 300;

export const useQuickTasksOptimized = () => {
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load data from localStorage with error handling
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(QUICK_TASKS_STORAGE_KEY);
      
      if (savedTasks) {
        const parsed = safeJSONParse(savedTasks, []);
        
        if (Array.isArray(parsed)) {
          const tasksWithDates = parsed.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt)
          }));
          // Limit the number of tasks loaded
          const limitedTasks = tasksWithDates.slice(0, MAX_QUICK_TASKS);
          setQuickTasks(limitedTasks);
        }
      }
    } catch (error) {
      handleStorageError(error, 'load quick tasks');
      localStorage.removeItem(QUICK_TASKS_STORAGE_KEY);
      setQuickTasks([]);
    }
  }, []);

  // Debounced save function
  const debouncedSave = useCallback((tasks: QuickTask[]) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      try {
        // Remove old completed tasks if we have too many
        let tasksToSave = tasks;
        if (tasks.length > MAX_QUICK_TASKS) {
          // Keep all uncompleted tasks and some recent completed ones
          const uncompleted = tasks.filter(task => !task.completed);
          const completed = tasks.filter(task => task.completed).slice(0, 20);
          tasksToSave = [...uncompleted, ...completed];
        }

        localStorage.setItem(QUICK_TASKS_STORAGE_KEY, JSON.stringify(tasksToSave));
        
        // Update state if we had to limit tasks
        if (tasksToSave.length !== tasks.length) {
          setQuickTasks(tasksToSave);
        }
      } catch (error) {
        console.error('Error saving quick tasks:', error);
      }
    }, SAVE_DEBOUNCE_MS);

    setSaveTimeout(timeout);
  }, [saveTimeout]);

  // Save tasks whenever they change
  useEffect(() => {
    if (quickTasks.length >= 0) {
      debouncedSave(quickTasks);
    }
  }, [quickTasks, debouncedSave]);

  const addQuickTask = useCallback((title: string) => {
    if (!title.trim()) return;

    const newTask: QuickTask = {
      id: generateId(), // Use secure UUID with fallback
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setQuickTasks(prev => [newTask, ...prev]);
  }, []);

  const toggleQuickTask = useCallback((id: string) => {
    setQuickTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const deleteQuickTask = useCallback((id: string) => {
    setQuickTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  return {
    quickTasks,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask
  };
};

export { useQuickTasksOptimized as useQuickTasks };
