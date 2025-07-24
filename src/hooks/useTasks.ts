import { useState, useEffect } from 'react';
import { Task, WorkStatus, Priority } from '@/types/task';

const STORAGE_KEY = 'task_management_data';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getTaskStats = () => {
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
  };

  const exportToCSV = () => {
    const headers = [
      'Project Name',
      'Description', 
      'Client Name',
      'Client Phone',
      'Client Email',
      'Work Status',
      'Priority',
      'Price',
      'Currency',
      'Payment Status',
      'Completion Status',
      'Created Date',
      'Updated Date'
    ];

    const rows = tasks.map(task => [
      task.projectName,
      task.projectDescription,
      task.clientName,
      task.clientPhone || '',
      task.clientEmail || '',
      task.workStatus,
      task.priority,
      task.price,
      task.currency,
      task.isPaid ? 'Paid' : 'Unpaid',
      task.isCompleted ? 'Done' : 'Not Done',
      task.createdAt.toLocaleDateString(),
      task.updatedAt.toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

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