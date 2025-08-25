import { useState } from 'react';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

interface BackupData {
  tasks: Task[];
  quickTasks: any[];
  exportDate: string;
  version: string;
}

export const useDataBackup = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const exportData = async (tasks: Task[], quickTasks: any[] = []) => {
    setIsExporting(true);
    try {
      const backupData: BackupData = {
        tasks,
        quickTasks,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'גיבוי הושלם',
        description: 'הנתונים יוצאו בהצלחה לקובץ JSON',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'שגיאה בגיבוי',
        description: 'אירעה שגיאה בעת יצוא הנתונים',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async (file: File): Promise<BackupData | null> => {
    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as BackupData;

      // Validate backup data structure
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Invalid backup file format');
      }

      // Convert date strings back to Date objects
      const processedTasks = data.tasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }));

      toast({
        title: 'שחזור הושלם',
        description: `שוחזרו ${processedTasks.length} פרויקטים בהצלחה`,
      });

      return {
        ...data,
        tasks: processedTasks
      };
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'שגיאה בשחזור',
        description: 'קובץ הגיבוי לא תקין או פגום',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsImporting(false);
    }
  };

  const createAutoBackup = (tasks: Task[], quickTasks: any[] = []) => {
    try {
      const backupData = {
        tasks,
        quickTasks,
        timestamp: Date.now(),
        date: new Date().toISOString()
      };
      
      localStorage.setItem('auto-backup', JSON.stringify(backupData));
      
      // Keep only last 5 auto-backups
      const existingBackups = JSON.parse(localStorage.getItem('backup-history') || '[]');
      const newBackups = [backupData, ...existingBackups].slice(0, 5);
      localStorage.setItem('backup-history', JSON.stringify(newBackups));
    } catch (error) {
      console.error('Auto backup error:', error);
    }
  };

  const restoreAutoBackup = (): BackupData | null => {
    try {
      const backup = localStorage.getItem('auto-backup');
      if (!backup) return null;

      const data = JSON.parse(backup);
      return {
        tasks: data.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        })),
        quickTasks: data.quickTasks || [],
        exportDate: data.date,
        version: '1.0.0'
      };
    } catch (error) {
      console.error('Auto restore error:', error);
      return null;
    }
  };

  const getBackupHistory = () => {
    try {
      const history = localStorage.getItem('backup-history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting backup history:', error);
      return [];
    }
  };

  return {
    exportData,
    importData,
    createAutoBackup,
    restoreAutoBackup,
    getBackupHistory,
    isExporting,
    isImporting
  };
};