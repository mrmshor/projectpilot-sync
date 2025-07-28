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

  const exportQuickTasksToNotes = (tasks: QuickTask[]) => {
    try {
      const notesContent = formatQuickTasksForNotes(tasks);
      
      // בדיקה אם זה מכשיר Apple
      const isAppleDevice = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
      
      if (isAppleDevice && 'navigator' in window && 'share' in navigator) {
        // שימוש ב-Web Share API על מכשירי Apple
        (navigator as any).share({
          title: 'רשימת משימות',
          text: notesContent
        }).then(() => {
          toast.success('📝 הרשימה נשלחה לשיתוף - בחר באפליקציית הפתקים');
        }).catch((error: any) => {
          console.log('Share failed:', error);
          // אם השיתוף נכשל, נעבור להעתקה ללוח
          fallbackToClipboard(notesContent);
        });
      } else {
        // Fallback להעתקה ללוח
        fallbackToClipboard(notesContent);
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