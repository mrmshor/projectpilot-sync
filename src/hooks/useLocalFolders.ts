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
        // בדפדפן - בדיקה אם אנחנו ב-iframe
        const isInIframe = window.self !== window.top;
        
        if (isInIframe) {
          // אנחנו ב-iframe (כמו Lovable) - השתמש בקלט ידני
          const folderPath = prompt('🗂️ הזן נתיב תיקייה או קישור:\n(לדוגמה: C:\\Documents\\Projects או https://drive.google.com/...)');
          if (folderPath && folderPath.trim()) {
            const cleanPath = folderPath.trim();
            localStorage.setItem('selectedFolder', cleanPath);
            toast.success(`📁 נשמר נתיב: ${cleanPath}`);
            return cleanPath;
          }
          return null;
        } else if ('showDirectoryPicker' in window) {
          // דפדפן רגיל עם תמיכה ב-File System Access API
          try {
            const dirHandle = await (window as any).showDirectoryPicker();
            const folderPath = dirHandle.name;
            
            // שמירת הכוונה בזיכרון
            localStorage.setItem('selectedFolder', folderPath);
            
            toast.success(`✅ נבחרה תיקייה: ${folderPath}`);
            return folderPath;
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Folder selection error:', error);
              toast.error('❌ שגיאה בבחירת התיקייה');
            }
            return null;
          }
        } else {
          // Fallback - קלט ידני
          const folderPath = prompt('🗂️ הזן נתיב תיקייה או קישור:\n(לדוגמה: C:\\Documents\\Projects או https://drive.google.com/...)');
          if (folderPath && folderPath.trim()) {
            const cleanPath = folderPath.trim();
            localStorage.setItem('selectedFolder', cleanPath);
            toast.success(`📁 נשמר נתיב: ${cleanPath}`);
            return cleanPath;
          }
          return null;
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
        // בדפדפן - בדיקה אם זה קישור או נתיב מקומי
        if (folderPath.startsWith('http') || folderPath.startsWith('file://')) {
          window.open(folderPath, '_blank');
        } else {
          // נתיב מקומי - הצגת הודעה מועילה
          toast.error(`❌ לא ניתן לפתוח נתיבים מקומיים מהדפדפן.

💡 פתרונות:
• העבר לאפליקציה המותקנת במחשב
• השתמש בקישור HTTP/HTTPS
• השתמש בקישור iCloud Drive
• השתמש ב-file:// URLs (במקרים מסוימים)

📁 נתיב: ${folderPath}`, {
            duration: 6000
          });
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