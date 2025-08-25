import { useState, useEffect, useCallback } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: Date;
  tags: string[];
  project: string;
  timeTracked: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  createdAt: Date;
}

const STORAGE_KEY = 'modern_task_manager_data';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const { tasks: savedTasks, projects: savedProjects } = JSON.parse(savedData);
        
        // Convert date strings back to Date objects
        const processedTasks = savedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null
        }));

        const processedProjects = savedProjects.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt)
        }));

        setTasks(processedTasks);
        setProjects(processedProjects);
      } else {
        // Initialize with sample data
        initializeSampleData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      initializeSampleData();
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage whenever tasks or projects change
  useEffect(() => {
    if (!loading) {
      const dataToSave = {
        tasks,
        projects,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [tasks, projects, loading]);

  const initializeSampleData = () => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'עיצוב ממשק משתמש',
        description: 'יצירת עיצוב מודרני לאפליקציית ניהול המשימות',
        status: 'in-progress',
        priority: 'high',
        assignee: 'חיים כהן',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Week from now
        tags: ['עיצוב', 'UI/UX', 'דחוף'],
        project: 'אפליקציית משימות',
        timeTracked: 180,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'פיתוח API',
        description: 'בניית שרת עבור סנכרון נתונים בין מכשירים',
        status: 'todo',
        priority: 'medium',
        assignee: 'שרה לוי',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        tags: ['פיתוח', 'API', 'סנכרון'],
        project: 'אפליקציית משימות',
        timeTracked: 0,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'בדיקות אוטומטיות',
        description: 'כתיבת בדיקות לכל הפונקציונליות החדשה',
        status: 'completed',
        priority: 'low',
        assignee: 'דני אברהם',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        tags: ['בדיקות', 'QA'],
        project: 'אפליקציית משימות',
        timeTracked: 240,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date()
      }
    ];

    const sampleProjects: Project[] = [
      {
        id: '1',
        name: 'אפליקציית משימות',
        description: 'פרויקט פיתוח אפליקציה מודרנית לניהול משימות',
        taskCount: 3,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Week ago
      },
      {
        id: '2',
        name: 'אתר חברה',
        description: 'עיצוב ופיתוח אתר חדש לחברה',
        taskCount: 0,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    setTasks(sampleTasks);
    setProjects(sampleProjects);
  };

  const createTask = useCallback((taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || 'חיים כהן',
      dueDate: taskData.dueDate || new Date(),
      tags: taskData.tags || [],
      project: taskData.project || '',
      timeTracked: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const createProject = useCallback((projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name || '',
      description: projectData.description || '',
      taskCount: 0,
      createdAt: new Date()
    };

    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, []);

  const getTaskStats = useCallback(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const overdueeTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueeTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }, [tasks]);

  return {
    tasks,
    projects,
    loading,
    createTask,
    updateTask,
    deleteTask,
    createProject,
    getTaskStats
  };
};