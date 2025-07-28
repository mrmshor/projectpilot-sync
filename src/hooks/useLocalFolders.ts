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
    const electronAPI = (window as any).electronAPI;
    setIsElectron(!!electronAPI);
    console.log('Electron detection - electronAPI exists:', !!electronAPI);
    console.log('Electron detection - setting isElectron to:', !!electronAPI);
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

  // פונקציה לבחירת תיקייה - אפליקציית שולחן
  const selectFolder = useCallback(async (): Promise<string | null> => {
    try {
      console.log('selectFolder called - desktop app');
      
      // בדיקה שelectronAPI קיים
      if (!(window as any).electronAPI) {
        console.error('electronAPI not available');
        toast.error('❌ האפליקציה לא זמינה במצב שולחני');
        return null;
      }
      
      // אפליקציית שולחן - השתמש בדיאלוג המובנה של המערכת
      console.log('Calling electronAPI.selectFolder...');
      const result = await (window as any).electronAPI.selectFolder();
      console.log('selectFolder result:', result);
      
      if (result && result.success && result.path) {
        localStorage.setItem('selectedFolder', result.path);
        toast.success(`✅ נבחרה תיקיה: ${result.path}`);
        return result.path;
      } else if (result && result.canceled) {
        return null; // משתמש ביטל
      } else {
        console.error('selectFolder failed:', result);
        toast.error('❌ שגיאה בבחירת התיקייה');
        return null;
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      toast.error('❌ שגיאה בבחירת התיקייה');
      return null;
    }
  }, []);

  // פונקציה לפתיחת תיקייה - אפליקציית שולחן
  const openFolder = useCallback(async (folderPath: string) => {
    try {
      console.log('openFolder called with path:', folderPath);
      
      // בדיקה שelectronAPI קיים
      if (!(window as any).electronAPI) {
        console.error('electronAPI not available');
        toast.error('❌ האפליקציה לא זמינה במצב שולחני');
        return;
      }
      
      // אפליקציית שולחן - פתיחה ישירה של התיקיה בסייר הקבצים
      console.log('Calling electronAPI.openFolder...');
      const result = await (window as any).electronAPI.openFolder(folderPath);
      console.log('openFolder result:', result);
      
      if (result && result.success) {
        toast.success(`✅ תיקיה נפתחה: ${folderPath}`);
      } else {
        console.error('openFolder failed:', result);
        toast.error('❌ שגיאה בפתיחת התיקייה');
      }
    } catch (error) {
      console.error('Error opening folder:', error);
      toast.error('❌ שגיאה בפתיחת התיקייה');
    }
  }, []);

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