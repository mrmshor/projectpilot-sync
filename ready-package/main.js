const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false
  });
  
  // נסה קודם עם URL מקומי לטיפול בנתיבים יחסיים
  win.loadFile('dist/index.html').catch(() => {
    // אם זה לא עובד, נסה עם file:// protocol
    win.loadURL(`file://${path.join(__dirname, 'dist', 'index.html')}`);
  });
  
  win.once('ready-to-show', () => {
    win.show();
  });
  
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

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});