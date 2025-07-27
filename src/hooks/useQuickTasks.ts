import { useState, useEffect } from 'react';
import { QuickTask } from '@/types/quickTask';

const QUICK_TASKS_STORAGE_KEY = 'quick-tasks';

export const useQuickTasks = () => {
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);

  // טעינת נתונים מ-localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(QUICK_TASKS_STORAGE_KEY);
    
    if (savedTasks) {
      setQuickTasks(JSON.parse(savedTasks));
    }
  }, []);

  // שמירת משימות ב-localStorage
  const saveQuickTasks = (tasks: QuickTask[]) => {
    localStorage.setItem(QUICK_TASKS_STORAGE_KEY, JSON.stringify(tasks));
    setQuickTasks(tasks);
  };

  const addQuickTask = (title: string) => {
    const newTask: QuickTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date()
    };
    
    const updatedTasks = [newTask, ...quickTasks];
    saveQuickTasks(updatedTasks);
  };

  const toggleQuickTask = (id: string) => {
    const updatedTasks = quickTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveQuickTasks(updatedTasks);
  };

  const deleteQuickTask = (id: string) => {
    const updatedTasks = quickTasks.filter(task => task.id !== id);
    saveQuickTasks(updatedTasks);
  };

  return {
    quickTasks,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask
  };
};