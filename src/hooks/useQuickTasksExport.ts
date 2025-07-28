import { QuickTask } from '@/types/quickTask';
import { toast } from 'sonner';

export const useQuickTasksExport = () => {
  const formatQuickTasksForNotes = (tasks: QuickTask[]): string => {
    if (tasks.length === 0) {
      return `📝 רשימת משימות - ${new Date().toLocaleDateString('he-IL')}

🎉 כל המשימות הושלמו!`;
    }

    // יצירת כותרת הפתק
    let notesContent = `📝 רשימת משימות - ${new Date().toLocaleDateString('he-IL')}\n\n`;
    
    // הוספת המשימות כרשימת checklist
    tasks.forEach((task) => {
      notesContent += `${task.title}\n`;
    });
    
    notesContent += `\n📊 סה"כ משימות: ${tasks.length}\n`;
    notesContent += `📅 נוצר: ${new Date().toLocaleDateString('he-IL')}`;
    
    return notesContent;
  };

  const exportQuickTasksToNotes = async (tasks: QuickTask[]) => {
    try {
      console.log('exportQuickTasksToNotes called with tasks:', tasks);
      const notesContent = formatQuickTasksForNotes(tasks);
      console.log('formatted content:', notesContent);
      
      // בדיקה שelectronAPI קיים
      if (!(window as any).electronAPI) {
        console.error('electronAPI not available');
        toast.error('❌ האפליקציה לא זמינה במצב שולחני');
        await fallbackToClipboard(notesContent);
        return;
      }
      
      // אפליקציית שולחן - יצירה ישירה של פתק אחד
      console.log('Attempting to create note via electronAPI...');
      try {
        const success = await (window as any).electronAPI.createNote(notesContent);
        console.log('createNote result:', success);
        if (success) {
          console.log('Note created successfully');
          toast.success('📝 נוצר פתק חדש באפליקציית הפתקים');
        } else {
          console.log('Failed to create note, fallback to clipboard');
          await fallbackToClipboard(notesContent);
          toast.success('📝 הועתק ללוח - הדבק באפליקציית הפתקים');
        }
      } catch (error) {
        console.error('Failed to create note:', error);
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