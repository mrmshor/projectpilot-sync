import { useState, useEffect } from 'react';
import { QuickTask, FolderLink } from '@/types/quickTask';

const QUICK_TASKS_STORAGE_KEY = 'quick-tasks';
const FOLDER_LINKS_STORAGE_KEY = 'folder-links';

export const useQuickTasks = () => {
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
  const [folderLinks, setFolderLinks] = useState<FolderLink[]>([]);

  // טעינת נתונים מ-localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(QUICK_TASKS_STORAGE_KEY);
    const savedLinks = localStorage.getItem(FOLDER_LINKS_STORAGE_KEY);
    
    if (savedTasks) {
      setQuickTasks(JSON.parse(savedTasks));
    }
    
    if (savedLinks) {
      setFolderLinks(JSON.parse(savedLinks));
    }
  }, []);

  // שמירת משימות ב-localStorage
  const saveQuickTasks = (tasks: QuickTask[]) => {
    localStorage.setItem(QUICK_TASKS_STORAGE_KEY, JSON.stringify(tasks));
    setQuickTasks(tasks);
  };

  // שמירת קישורי תיקיות ב-localStorage
  const saveFolderLinks = (links: FolderLink[]) => {
    localStorage.setItem(FOLDER_LINKS_STORAGE_KEY, JSON.stringify(links));
    setFolderLinks(links);
  };

  const addQuickTask = (title: string, folderLink?: string) => {
    const newTask: QuickTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      folderLink
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

  const addFolderLink = (name: string, path: string) => {
    const newLink: FolderLink = {
      id: Date.now().toString(),
      name,
      path,
      createdAt: new Date()
    };
    
    const updatedLinks = [newLink, ...folderLinks];
    saveFolderLinks(updatedLinks);
    return newLink;
  };

  const deleteFolderLink = (id: string) => {
    const updatedLinks = folderLinks.filter(link => link.id !== id);
    saveFolderLinks(updatedLinks);
  };

  const openFolderLink = (path: string) => {
    // ניסיון לפתוח קישור תיקיה
    try {
      // אם זה קישור iCloud או URL
      if (path.startsWith('http') || path.startsWith('icloud://')) {
        window.open(path, '_blank');
      } else {
        // ניסיון לפתוח כ-file protocol
        window.open(`file://${path}`, '_blank');
      }
    } catch (error) {
      console.error('שגיאה בפתיחת התיקיה:', error);
    }
  };

  return {
    quickTasks,
    folderLinks,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask,
    addFolderLink,
    deleteFolderLink,
    openFolderLink
  };
};