import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, WorkStatus, Priority } from '@/types/task';
import { handleStorageError, safeJSONParse, generateId } from '@/lib/errorHandling';
import { useMemoryManager, useMemoryMonitor } from './useMemoryManager';

const STORAGE_KEY = 'task_management_data';
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
const SAVE_DEBOUNCE_MS = 500; // Debounce saves

// Performance optimizations
const useTasksOptimized = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Memory management
  const { safeSetTimeout, cleanup } = useMemoryManager();
  useMemoryMonitor('useTasksOptimized');

  // Load tasks from localStorage on mount with error handling
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (savedTasks) {
          // Check data size before parsing
          if (savedTasks.length > MAX_STORAGE_SIZE) {
            console.warn('Tasks data exceeds size limit, removing old data');
            localStorage.removeItem(STORAGE_KEY);
            setTasks([]);
          } else {
            const parsed = safeJSONParse(savedTasks, []);
            // Validate data structure
            if (Array.isArray(parsed)) {
              const tasksWithDates = parsed.map((task: any) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt)
              }));
              setTasks(tasksWithDates);
            }
          }
        }
      } catch (error) {
        handleStorageError(error, 'load tasks');
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEY);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Debounced save function to prevent excessive localStorage writes
  const debouncedSave = useCallback((tasksToSave: Task[]) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = safeSetTimeout(() => {
      try {
        const dataToSave = JSON.stringify(tasksToSave);
        
        // Check storage size limit
        if (dataToSave.length > MAX_STORAGE_SIZE) {
          console.warn('Data too large, removing old tasks');
          // Keep only recent tasks if data is too large
          const recentTasks = tasksToSave
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, Math.floor(tasksToSave.length * 0.7)); // Keep 70% most recent
          
          const reducedData = JSON.stringify(recentTasks);
          localStorage.setItem(STORAGE_KEY, reducedData);
          // DO NOT call setTasks here to avoid infinite loop
        } else {
          localStorage.setItem(STORAGE_KEY, dataToSave);
        }
      } catch (error) {
        handleStorageError(error, 'save tasks');
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          // Handle storage quota exceeded
          const recentTasks = tasksToSave.slice(0, Math.floor(tasksToSave.length * 0.5));
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recentTasks));
            // DO NOT call setTasks here to avoid infinite loop
          } catch (e) {
            console.error('Unable to save even reduced data:', e);
          }
        }
      }
    }, SAVE_DEBOUNCE_MS);

    setSaveTimeout(timeout);
  }, []); // Remove saveTimeout dependency to prevent infinite loop

  // Save tasks with debouncing - simplified to prevent infinite loops
  useEffect(() => {
    if (!loading && tasks.length >= 0) {
      debouncedSave(tasks);
    }
  }, [tasks, loading]); // Remove debouncedSave from dependencies

  // Optimized create task function
  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }, []);

  // Optimized update task function
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  // Optimized delete task function
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  // Memoized stats calculation
  const getTaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const inProgress = tasks.filter(task => task.workStatus === 'in_progress').length;
    const paid = tasks.filter(task => task.isPaid).length;
    const unpaid = tasks.filter(task => !task.isPaid).length;
    const totalRevenue = tasks.filter(task => task.isPaid).reduce((sum, task) => sum + task.price, 0);
    const pendingRevenue = tasks.filter(task => !task.isPaid).reduce((sum, task) => sum + task.price, 0);

    return {
      total,
      completed,
      inProgress,
      paid,
      unpaid,
      totalRevenue,
      pendingRevenue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      paymentRate: total > 0 ? Math.round((paid / total) * 100) : 0
    };
  }, [tasks]);

  // Enhanced CSV export with proper UTF-8 encoding for Hebrew
  const exportToCSV = useCallback(() => {
    try {
      const headers = [
        'שם הפרויקט',
        'תיאור הפרויקט', 
        'שם הלקוח',
        'טלפון לקוח',
        'טלפון נוסף',
        'וואטסאפ',
        'וואטסאפ נוסף',
        'אימייל לקוח',
        'סטטוס עבודה',
        'רמת עדיפות',
        'מחיר',
        'מטבע',
        'סטטוס תשלום',
        'סטטוס השלמה',
        'תאריך יצירה',
        'תאריך עדכון',
        'נתיב תיקייה',
        'קישור תיקייה',
        'מספר משימות',
        'משימות שהושלמו'
      ];

      const rows = tasks.map(task => {
        const completedTasks = task.tasks.filter(t => t.isCompleted).length;
        return [
          task.projectName,
          task.projectDescription,
          task.clientName,
          task.clientPhone || '',
          task.clientPhone2 || '',
          task.clientWhatsapp || '',
          task.clientWhatsapp2 || '',
          task.clientEmail || '',
          task.workStatus,
          task.priority,
          task.price.toString(),
          task.currency,
          task.isPaid ? 'שולם' : 'לא שולם',
          task.isCompleted ? 'הושלם' : 'לא הושלם',
          task.createdAt.toLocaleDateString('he-IL'),
          task.updatedAt.toLocaleDateString('he-IL'),
          task.folderPath || '',
          task.folderLink || '',
          task.tasks.length.toString(),
          `${completedTasks}/${task.tasks.length}`
        ];
      });

      // Create CSV with proper UTF-8 BOM for Hebrew support
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

      // Add BOM for proper UTF-8 encoding in Excel
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      const blob = new Blob([csvWithBOM], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `projects_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('CSV export completed successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  }, [tasks]);

  // Memory cleanup
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    exportToCSV
  };
};

export { useTasksOptimized as useTasks };
