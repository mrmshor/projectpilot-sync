import { useState, useEffect, useCallback } from 'react';
import { QuickTask } from '@/types/quickTask';

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
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) {
          // Limit the number of tasks loaded
          const limitedTasks = parsed.slice(0, MAX_QUICK_TASKS);
          setQuickTasks(limitedTasks);
        }
      }
    } catch (error) {
      console.error('Error loading quick tasks:', error);
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

  // Optimized save function
  const saveQuickTasks = useCallback((tasks: QuickTask[]) => {
    setQuickTasks(tasks);
    debouncedSave(tasks);
  }, [debouncedSave]);

  const addQuickTask = useCallback((title: string) => {
    if (!title.trim()) return;

    const newTask: QuickTask = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setQuickTasks(prev => {
      const updatedTasks = [newTask, ...prev];
      debouncedSave(updatedTasks);
      return updatedTasks;
    });
  }, [debouncedSave]);

  const toggleQuickTask = useCallback((id: string) => {
    setQuickTasks(prev => {
      const updatedTasks = prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      debouncedSave(updatedTasks);
      return updatedTasks;
    });
  }, [debouncedSave]);

  const deleteQuickTask = useCallback((id: string) => {
    setQuickTasks(prev => {
      const updatedTasks = prev.filter(task => task.id !== id);
      debouncedSave(updatedTasks);
      return updatedTasks;
    });
  }, [debouncedSave]);

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
