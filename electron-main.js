const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron');
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
    icon: path.join(__dirname, 'assets/icon.png')
  });
  
  win.loadFile('dist/index.html');
  
  win.webContents.setWindowOpenHandler(({ url }) => {
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

// IPC handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  
  if (result.canceled) {
    return { canceled: true };
  }
  
  return { success: true, path: result.filePaths[0] };
});

ipcMain.handle('open-folder', async (event, folderPath) => {
  return shell.openPath(folderPath);
});

ipcMain.handle('show-item-in-folder', async (event, itemPath) => {
  return shell.showItemInFolder(itemPath);
});

ipcMain.handle('create-note', async (event, content) => {
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    // יצירת AppleScript ליצירת פתק חדש
    const appleScript = `osascript -e 'tell application "Notes"
      activate
      tell account "iCloud"
        make new note with properties {body:"${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"}
      end tell
    end tell'`;
    
    exec(appleScript, (error, stdout, stderr) => {
      if (error) {
        console.error('AppleScript error:', error);
        resolve(false);
      } else {
        console.log('AppleScript success:', stdout);
        resolve(true);
      }
    });
  });
});