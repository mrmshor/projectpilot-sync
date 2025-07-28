import { QuickTask } from '@/types/quickTask';
import { toast } from 'sonner';

export const useQuickTasksExport = () => {
  const formatQuickTasksForNotes = (tasks: QuickTask[]): string => {
    const pendingTasks = tasks.filter(task => !task.completed);
    
    if (pendingTasks.length === 0) {
      return `📝 רשימת משימות - ${new Date().toLocaleDateString('he-IL')}

🎉 כל המשימות הושלמו!`;
    }

    let notesContent = `📝 רשימת משימות - ${new Date().toLocaleDateString('he-IL')}\n\n`;
    
    pendingTasks.forEach((task, index) => {
      notesContent += `${index + 1}. ☐ ${task.title}\n`;
    });
    
    notesContent += `\n📊 סיכום:\n`;
    notesContent += `• סה"כ משימות פתוחות: ${pendingTasks.length}\n`;
    
    return notesContent;
  };

  const exportQuickTasksToNotes = async (tasks: QuickTask[]) => {
    try {
      console.log('exportQuickTasksToNotes called with tasks:', tasks);
      const pendingTasks = tasks.filter(task => !task.completed);
      
      if (pendingTasks.length === 0) {
        toast.success('🎉 כל המשימות הושלמו! אין משימות ליצירת פתקים');
        return;
      }

      // בדיקה שelectronAPI קיים
      if (!(window as any).electronAPI) {
        console.error('electronAPI not available');
        toast.error('❌ האפליקציה לא זמינה במצב שולחני');
        // יצירת פתק אחד עם כל המשימות כ-fallback
        const notesContent = formatQuickTasksForNotes(tasks);
        await fallbackToClipboard(notesContent);
        return;
      }
      
      // יצירת פתק נפרד לכל משימה
      console.log(`Creating ${pendingTasks.length} separate notes...`);
      let successCount = 0;
      
      for (const task of pendingTasks) {
        const taskNoteContent = `☐ ${task.title}

📅 נוצר: ${new Date().toLocaleDateString('he-IL')}

✅ כדי לסמן כהושלם - סמן את התיבה למעלה`;
        
        try {
          const success = await (window as any).electronAPI.createNote(taskNoteContent);
          if (success) {
            successCount++;
          }
        } catch (error) {
          console.error(`Failed to create note for task ${task.id}:`, error);
        }
      }
      
      if (successCount > 0) {
        toast.success(`📝 נוצרו ${successCount} פתקים באפליקציית הפתקים`);
      } else {
        console.log('Failed to create any notes, fallback to clipboard');
        const notesContent = formatQuickTasksForNotes(tasks);
        await fallbackToClipboard(notesContent);
        toast.success('📝 הועתק ללוח - הדבק באפליקציית הפתקים');
      }
    } catch (error) {
      console.error('Error exporting quick tasks to notes:', error);
      toast.error('❌ שגיאה בייצוא הרשימה');
    }
  };

  const fallbackToClipboard = async (content: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
        toast.success('📋 רשימת המשימות הועתקה ללוח! הדבק בפתקים או בכל אפליקציה אחרת');
      } else {
        // Fallback ישן יותר
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('📋 רשימת המשימות הועתקה ללוח! הדבק בפתקים או בכל אפליקציה אחרת');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('❌ לא ניתן להעתיק ללוח');
    }
  };

  return {
    exportQuickTasksToNotes,
    formatQuickTasksForNotes
  };
};