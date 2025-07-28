const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false
  });
  
  // טען את האפליקציה כ-URL מלא
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  win.loadURL(`file://${indexPath}`);
  
  win.once('ready-to-show', () => {
    win.show();
  });

  // Handle folder opening
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('file://') || url.startsWith('folder://')) {
      const folderPath = url.replace('folder://', '').replace('file://', '');
      shell.openPath(decodeURIComponent(folderPath));
      return { action: 'deny' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle IPC messages for folder operations
ipcMain.handle('open-folder', async (event, folderPath) => {
  try {
    await shell.openPath(folderPath);
    return { success: true };
  } catch (error) {
    console.error('Error opening folder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('show-item-in-folder', async (event, itemPath) => {
  try {
    shell.showItemInFolder(itemPath);
    return { success: true };
  } catch (error) {
    console.error('Error showing item in folder:', error);
    return { success: false, error: error.message };
  }
});

// Handle folder selection dialog
ipcMain.handle('select-folder', async (event) => {
  const { dialog } = require('electron');
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'בחר תיקיה',
      buttonLabel: 'בחר תיקיה זו'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, path: result.filePaths[0] };
    } else {
      return { success: false, canceled: true };
    }
  } catch (error) {
    console.error('Error selecting folder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-note', async (event, content) => {
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    // פיצול התוכן לכותרת ומשימות
    const lines = content.split('\n');
    const title = lines[0] || 'רשימת משימות';
    const tasks = [];
    
    // חילוץ המשימות מהתוכן
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.includes('📝') && !line.includes('📊') && !line.includes('📅') && !line.includes('🎉') && line !== '') {
        tasks.push(line);
      }
    }
    
    if (tasks.length === 0) {
      // אם אין משימות, צור פתק רגיל
      const simpleScript = `osascript -e 'tell application "Notes"
        activate
        tell account "iCloud"
          make new note with properties {body:"${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"}
        end tell
      end tell'`;
      
      exec(simpleScript, (error, stdout, stderr) => {
        if (error) {
          console.error('AppleScript error:', error);
          resolve(false);
        } else {
          console.log('AppleScript success:', stdout);
          resolve(true);
        }
      });
      return;
    }
    
    // יצירת AppleScript ליצירת פתק עם checklist
    let appleScript = `osascript -e 'tell application "Notes"
      activate
      tell account "iCloud"
        set theNote to make new note with properties {body:"${title.replace(/"/g, '\\"')}"}
        tell theNote`;
    
    // הוספת כל משימה כפריט checklist
    tasks.forEach((task, index) => {
      const cleanTask = task.replace(/"/g, '\\"');
      appleScript += `
          make new checkbox item with properties {body:"${cleanTask}", checked:false}`;
    });
    
    appleScript += `
        end tell
      end tell
    end tell'`;
    
    console.log('AppleScript being executed:', appleScript);
    
    exec(appleScript, (error, stdout, stderr) => {
      if (error) {
        console.error('AppleScript error:', error);
        console.error('stderr:', stderr);
        resolve(false);
      } else {
        console.log('AppleScript success:', stdout);
        resolve(true);
      }
    });
  });
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});