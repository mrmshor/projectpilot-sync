import React, { useState, useCallback } from 'react';
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
  const [isElectron, setIsElectron] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');

  // Check if running in Electron
  React.useEffect(() => {
    setIsElectron(!!(window as any).electronAPI);
  }, []);

  // פונקציה להעתקת טקסט ללוח
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      throw error;
    }
  };

  // פונקציה לפתיחה מתקדמת עם קבצי עזר
  const downloadHelperFiles = () => {
    const isWindows = navigator.platform.toLowerCase().includes('win');
    const helperFileName = isWindows ? 'folder-opener.bat' : 'folder-opener.sh';
    
    const link = document.createElement('a');
    link.href = `/${helperFileName}`;
    link.download = helperFileName;
    link.click();
    
    if (isWindows) {
      // גם הורדת קובץ registry
      setTimeout(() => {
        const regLink = document.createElement('a');
        regLink.href = '/setup-folder-protocol.reg';
        regLink.download = 'setup-folder-protocol.reg';
        regLink.click();
      }, 500);
    }
  };

  // פונקציה לניסיון פתיחה אוטומטית משופרת
  const attemptAutoOpen = async (folderPath: string): Promise<boolean> => {
    const cleanPath = folderPath.trim();
    
    // ניסיון 1: Custom folder protocol (אם הותקן)
    try {
      window.location.href = `folder://${encodeURIComponent(cleanPath)}`;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (e) {
      console.log('Custom folder protocol not available');
    }
    
    // ניסיון 2: Native file manager protocols
    const isWindows = cleanPath.includes('\\') || cleanPath.match(/^[A-Z]:/);
    const isMac = cleanPath.startsWith('/');
    
    if (isWindows) {
      try {
        // Windows protocols
        const winPath = cleanPath.replace(/\//g, '\\');
        const protocols = [
          `ms-appinstaller:?source=file:///${winPath}`,
          `shell:${winPath}`,
          `file:///${winPath}`
        ];
        
        for (const protocol of protocols) {
          try {
            window.open(protocol, '_blank');
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (e) {
            continue;
          }
        }
        return true;
      } catch (e) {
        console.log('Windows protocols failed');
      }
    }
    
    if (isMac) {
      try {
        // Mac protocols
        const protocols = [
          `finder:${cleanPath}`,
          `file://${cleanPath}`,
          `shareddocuments://${cleanPath}`
        ];
        
        for (const protocol of protocols) {
          try {
            window.open(protocol, '_blank');
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (e) {
            continue;
          }
        }
        return true;
      } catch (e) {
        console.log('Mac protocols failed');
      }
    }
    
    return false;
  };

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
      if (isElectron) {
        // באפליקציית Electron - פתיחה ישירה של תיקיות
        try {
          const result = await (window as any).electronAPI.openFolder(folderPath);
          if (result.success) {
            toast.success(`✅ נפתחה תיקיה: ${folderPath}`);
          } else {
            toast.error(`❌ לא ניתן לפתוח תיקיה: ${result.error}`);
          }
        } catch (error) {
          toast.error(`❌ שגיאה בפתיחת תיקיה: ${error}`);
        }
      } else if (isNative) {
        // באפליקציה נטיבית - ניתן לפתוח בחלקם
        if (Capacitor.getPlatform() === 'ios') {
          // iOS - פתיחת Files app
          window.open(`shareddocuments://${folderPath}`, '_system');
        } else if (Capacitor.getPlatform() === 'android') {
          // Android - ניסיון פתיחת File Manager
          window.open(`content://com.android.externalstorage.documents/document/${encodeURIComponent(folderPath)}`, '_system');
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
          // נתיב מקומי - פתרון פשוט ויעיל
          // אם זה שם תיקיה בלבד (בלי סלאש), הראה הודעה ברורה
          if (!folderPath.includes('/') && !folderPath.includes('\\')) {
            copyToClipboard(folderPath);
            toast.info(`📁 תיקיה: "${folderPath}"

📋 השם הועתק ללוח!

💡 איך לפתוח:
• פתח את סייר הקבצים במחשב
• חפש את התיקיה "${folderPath}"
• או לחץ Ctrl+F והדבק את השם

🔒 דפדפנים לא מאפשרים פתיחת תיקיות ישירות מסיבות אבטחה`, {
              duration: 8000
            });
            return;
          }
          
          // עבור נתיב מלא - הצגת פרטים ברורים והעתקה
          try {
            copyToClipboard(folderPath);
            
            const isWindows = folderPath.includes('\\') || folderPath.match(/^[A-Z]:/);
            const isMac = folderPath.startsWith('/') || folderPath.startsWith('~');
            
            let osInstructions = '';
            if (isWindows) {
              osInstructions = `🪟 Windows:
• לחץ Win+R
• הדבק את הנתיב והקש Enter
• או פתח File Explorer והדבק בשורת הכתובת`;
            } else if (isMac) {
              osInstructions = `🍎 Mac:
• פתח Finder
• לחץ ⌘+⇧+G (Go to Folder)
• הדבק את הנתיב והקש Enter`;
            } else {
              osInstructions = `🐧 Linux:
• פתח את File Manager
• הדבק את הנתיב בשורת הכתובת`;
            }
            
            toast.success(`📋 הנתיב הועתק ללוח! 

${osInstructions}

📁 נתיב: ${folderPath}

💡 טיפ: שמור קיצורי דרך לתיקיות נפוצות בדסקטופ`, {
              duration: 12000
            });
            
          } catch (error) {
            // אם העתקה נכשלה - לפחות הצג את הנתיב
            toast.info(`📁 נתיב התיקיה:

${folderPath}

💡 העתק את הנתיב ופתח את סייר הקבצים:
• Windows: Win+R ← הדבק ← Enter  
• Mac: ⌘+⇧+G ב-Finder ← הדבק ← Enter
• Linux: Ctrl+L ב-File Manager ← הדבק ← Enter`, {
              duration: 10000
            });
          }
        }
      }
    } catch (error) {
      console.error('Error opening folder:', error);
      toast.error('❌ שגיאה בפתיחת התיקייה');
    }
  }, [isNative, isElectron]);

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
    isElectron,
    currentPath,
    selectFolder,
    openFolder,
    readFolderContents,
    checkFolderExists,
    createFolder,
    setCurrentPath
  };
};