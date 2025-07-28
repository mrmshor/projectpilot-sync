import { Task } from '@/types/task';
import { toast } from 'sonner';

export const useNotesExport = () => {
  const formatTasksForNotes = (tasks: Task[]): string => {
    let notesContent = `📋 רשימת פרויקטים - ${new Date().toLocaleDateString('he-IL')}\n\n`;
    
    tasks.forEach((task, index) => {
      notesContent += `${index + 1}. 📂 ${task.projectName}\n`;
      notesContent += `   👤 לקוח: ${task.clientName}\n`;
      
      if (task.projectDescription) {
        notesContent += `   📝 תיאור: ${task.projectDescription}\n`;
      }
      
      // סטטוס
      const statusLabels = {
        'not_started': '⏳ לא החל',
        'in_progress': '🔄 בתהליך',
        'review': '👀 בבדיקה',
        'on_hold': '⏸️ מושעה',
        'completed': '✅ הושלם'
      };
      notesContent += `   📊 סטטוס: ${statusLabels[task.workStatus]}\n`;
      
      // עדיפות
      const priorityLabels = {
        'high': '🔴 גבוהה',
        'medium': '🟡 בינונית',
        'low': '🟢 נמוכה'
      };
      notesContent += `   ⚡ עדיפות: ${priorityLabels[task.priority]}\n`;
      
      // מחיר
      if (task.price > 0) {
        notesContent += `   💰 מחיר: ${task.price} ${task.currency}\n`;
        notesContent += `   💳 שולם: ${task.isPaid ? 'כן' : 'לא'}\n`;
      }
      
      // פרטי קשר
      if (task.clientPhone) {
        notesContent += `   📞 טלפון: ${task.clientPhone}\n`;
      }
      if (task.clientEmail) {
        notesContent += `   📧 אימייל: ${task.clientEmail}\n`;
      }
      
      // משימות פנימיות
      if (task.tasks && task.tasks.length > 0) {
        notesContent += `   📋 משימות:\n`;
        task.tasks.forEach((taskItem) => {
          const checkmark = taskItem.isCompleted ? '✅' : '☐';
          notesContent += `      ${checkmark} ${taskItem.text}\n`;
        });
      }
      
      notesContent += '\n';
    });
    
    notesContent += `\n📊 סיכום:\n`;
    notesContent += `• סה"כ פרויקטים: ${tasks.length}\n`;
    notesContent += `• הושלמו: ${tasks.filter(t => t.isCompleted).length}\n`;
    notesContent += `• שולמו: ${tasks.filter(t => t.isPaid).length}\n`;
    
    return notesContent;
  };

  const exportToNotes = (tasks: Task[]) => {
    try {
      const notesContent = formatTasksForNotes(tasks);
      
      // בדיקה אם זה מכשיר Apple
      const isAppleDevice = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
      
      if (isAppleDevice && 'navigator' in window && 'share' in navigator) {
        // שימוש ב-Web Share API על מכשירי Apple
        (navigator as any).share({
          title: 'רשימת פרויקטים',
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
      console.error('Error exporting to notes:', error);
      toast.error('❌ שגיאה בייצוא הרשימה');
    }
  };

  const fallbackToClipboard = async (content: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
        toast.success('📋 הרשימה הועתקה ללוח! הדבק בפתקים או בכל אפליקציה אחרת');
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
        toast.success('📋 הרשימה הועתקה ללוח! הדבק בפתקים או בכל אפליקציה אחרת');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('❌ לא ניתן להעתיק ללוח');
    }
  };

  const downloadAsFile = (tasks: Task[]) => {
    try {
      const notesContent = formatTasksForNotes(tasks);
      const blob = new Blob([notesContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `פרויקטים-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success('📁 הקובץ הורד בהצלחה!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('❌ שגיאה בהורדת הקובץ');
    }
  };

  return {
    exportToNotes,
    downloadAsFile,
    formatTasksForNotes
  };
};