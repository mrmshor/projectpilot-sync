import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { toast } from 'sonner';

export interface FolderInfo {
  name: string;
  path: string;
  uri: string;
  type: 'folder' | 'file';
}

export const useLocalFolders = () => {
  const [isNative, setIsNative] = useState(Capacitor.isNativePlatform());
  const [currentPath, setCurrentPath] = useState<string>('');

  // פונקציה לבחירת תיקייה
  const selectFolder = useCallback(async (): Promise<string | null> => {
    try {
      if (isNative) {
        // בחירת תיקייה באפליקציה נטיבית
        const result = await Filesystem.requestPermissions();
        if (result.publicStorage === 'granted') {
          // פתיחת תיקיית Documents
          const documentsPath = await Filesystem.getUri({
            directory: Directory.Documents,
            path: ''
          });
          
          toast.success('✅ גישה לתיקיות אושרה!');
          return documentsPath.uri;
        } else {
          toast.error('❌ נדרשת הרשאה לגישה לתיקיות');
          return null;
        }
      } else {
        // בדפדפן - שתי אפשרויות: בחירת תיקיה או נתיב מלא
        const choice = confirm(`🗂️ בחירת תיקיה במחשב:

✅ אישור = בחר תיקיה (רק שם התיקיה יישמר)
❌ ביטול = הזן נתיב מלא (פתיחה ישירה אפשרית)

בחר את האפשרות המועדפת עליך:`);
        
        if (!choice) {
          // הזנת נתיב מלא ידני
          const manualPath = prompt(`📁 הזן נתיב מלא לתיקיה:

🖥️ דוגמאות:
• Windows: C:\\Users\\YourName\\Documents\\Projects
• Mac: /Users/YourName/Documents/Projects
• iCloud: ~/Library/Mobile Documents/com~apple~CloudDocs/Projects

הזן נתיב מלא:`);
          
          if (manualPath && manualPath.trim()) {
            const cleanPath = manualPath.trim();
            localStorage.setItem('selectedFolder', cleanPath);
            toast.success(`✅ נשמר נתיב: ${cleanPath}`);
            return cleanPath;
          }
          return null;
        } else {
          // בחירת תיקיה רגילה (רק שם)
          return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            (input as any).webkitdirectory = true;
            input.multiple = false;
            
            input.addEventListener('change', (event: any) => {
              const files = event.target.files;
              if (files && files.length > 0) {
                const firstFile = files[0];
                const webkitPath = firstFile.webkitRelativePath;
                const folderName = webkitPath.split('/')[0];
                
                localStorage.setItem('selectedFolder', folderName);
                toast.success(`✅ נקשרה תיקיה: ${folderName} (שם בלבד)`);
                resolve(folderName);
                
                input.value = '';
              } else {
                resolve(null);
              }
            });
            
            input.addEventListener('cancel', () => {
              resolve(null);
            });
            
            input.click();
          });
        }
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      toast.error('❌ שגיאה בבחירת התיקייה');
      return null;
    }
  }, [isNative]);

  // פונקציה לפתיחת תיקייה
  const openFolder = useCallback(async (folderPath: string) => {
    try {
      if (isNative) {
        // באפליקציה נטיבית - ניתן לפתוח בחלקם
        if (Capacitor.getPlatform() === 'ios') {
          // iOS - פתיחת Files app
          window.open(`shareddocuments://${folderPath}`, '_system');
        } else if (Capacitor.getPlatform() === 'android') {
          // Android - ניסיון פתיחת File Manager
          window.open(`content://com.android.externalstorage.documents/document/${encodeURIComponent(folderPath)}`, '_system');
        } else {
          // Desktop/Electron
          if ((window as any).electronAPI) {
            (window as any).electronAPI.openFolder(folderPath);
          } else {
            console.log('נתיב תיקייה:', folderPath);
            toast.info(`📁 נתיב: ${folderPath}`);
          }
        }
      } else {
        // בדפדפן - ניסיון פתיחת תיקיות מחשב
        if (folderPath.startsWith('http') || folderPath.startsWith('https://')) {
          // קישור רשת - פתיחה רגילה
          window.open(folderPath, '_blank');
        } else if (folderPath.startsWith('file://')) {
          // נתיב file:// - ניסיון פתיחה
          window.open(folderPath, '_blank');
        } else {
          // נתיב מקומי - בדפדפן אי אפשר לפתוח נתיבים מקומיים
          // אם זה שם תיקיה בלבד (בלי סלאש), אנחנו לא יכולים לפתוח אותה
          if (!folderPath.includes('/') && !folderPath.includes('\\')) {
            toast.info(`📁 תיקיה: "${folderPath}"

🔒 מסיבות אבטחה, דפדפנים לא מאפשרים פתיחת תיקיות מקומיות ישירות.

💡 כדי לפתוח את התיקיה:
• פתח את סייר הקבצים במחשב
• חפש את התיקיה "${folderPath}"
• או שמור נתיב מלא במקום שם התיקיה בלבד`, {
              duration: 10000
            });
            return;
          }
          
          // ניסיון פתיחת נתיב מלא
          try {
            const fileUrl = folderPath.startsWith('/') ? 
              `file://${folderPath}` : 
              `file:///${folderPath.replace(/\\/g, '/')}`;
            
            window.open(fileUrl, '_blank');
            toast.success(`🔗 נפתח קישור: ${fileUrl}`);
          } catch (error) {
            // אם לא עבד - הצגת מידע שימושי
            toast.info(`📁 נתיב תיקייה: ${folderPath}
            
💡 לפתיחה ידנית:
• Windows: פתח File Explorer והדבק את הנתיב
• Mac: פתח Finder והשתמש ב-⌘+⇧+G
• או העתק לדפדפן: file://${folderPath}`, {
              duration: 8000
            });
          }
        }
      }
    } catch (error) {
      console.error('Error opening folder:', error);
      toast.error('❌ שגיאה בפתיחת התיקייה');
    }
  }, [isNative]);

  // פונקציה לקריאת תוכן תיקייה
  const readFolderContents = useCallback(async (path: string): Promise<FolderInfo[]> => {
    try {
      if (isNative) {
        const result = await Filesystem.readdir({
          directory: Directory.Documents,
          path: path
        });

        return result.files.map(file => ({
          name: file.name,
          path: `${path}/${file.name}`,
          uri: `${path}/${file.name}`,
          type: file.type === 'directory' ? 'folder' : 'file'
        }));
      } else {
        // בדפדפן - החזרת רשימה ריקה או שימוש בAPI אחר
        return [];
      }
    } catch (error) {
      console.error('Error reading folder contents:', error);
      toast.error('❌ שגיאה בקריאת תוכן התיקייה');
      return [];
    }
  }, [isNative]);

  // פונקציה לבדיקה אם נתיב קיים
  const checkFolderExists = useCallback(async (path: string): Promise<boolean> => {
    try {
      if (isNative) {
        await Filesystem.stat({
          directory: Directory.Documents,
          path: path
        });
        return true;
      } else {
        // בדפדפן - החזרת true כברירת מחדל
        return true;
      }
    } catch (error) {
      return false;
    }
  }, [isNative]);

  // פונקציה ליצירת תיקייה חדשה
  const createFolder = useCallback(async (path: string, name: string): Promise<boolean> => {
    try {
      if (isNative) {
        await Filesystem.mkdir({
          directory: Directory.Documents,
          path: `${path}/${name}`,
          recursive: true
        });
        
        toast.success(`✅ נוצרה תיקייה: ${name}`);
        return true;
      } else {
        toast.info('💡 יצירת תיקיות זמינה רק באפליקציה המותקנת');
        return false;
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('❌ שגיאה ביצירת התיקייה');
      return false;
    }
  }, [isNative]);

  return {
    isNative,
    currentPath,
    selectFolder,
    openFolder,
    readFolderContents,
    checkFolderExists,
    createFolder,
    setCurrentPath
  };
};