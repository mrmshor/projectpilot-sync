# 📦 הכנת הקוד לאתר יצירת התקנה - Mac

## 🚀 שלבים מהירים

### 1. בנה את הפרויקט
```bash
npm install
npm run build
```

### 2. הכן את מבנה הקבצים לElectron
```bash
mkdir mac-installer-package
cd mac-installer-package

# העתק את הקבצים הבנויים
cp -r ../dist ./

# צור את main.js
cat > main.js << 'EOF'
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
EOF

# צור את package.json
cat > package.json << 'EOF'
{
  "name": "projectpilot-sync",
  "version": "1.0.0",
  "description": "ProjectPilot Sync Desktop App",
  "main": "main.js",
  "homepage": "./",
  "build": {
    "appId": "app.lovable.projectpilot.sync",
    "productName": "ProjectPilot Sync",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "main.js",
      "package.json", 
      "dist/**/*",
      "assets/**/*"
    ],
    "mac": {
      "target": {
        "target": "dmg",
        "arch": ["x64", "arm64"]
      },
      "category": "public.app-category.productivity",
      "identity": null,
      "gatekeeperAssess": false,
      "hardenedRuntime": false,
      "entitlements": null,
      "entitlementsInherit": null
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.13.3"
  }
}
EOF

# צור תיקיית assets ואיקון זמני
mkdir -p assets
touch assets/icon.png
```

## 📁 מבנה הקבצים שיווצר
```
mac-installer-package/
├── main.js              (קובץ הElectron הראשי)
├── package.json         (הגדרות הפרויקט)
├── dist/               (האפליקציה הבנויה)
│   ├── index.html
│   ├── assets/
│   └── ...
└── assets/
    └── icon.png        (איקון האפליקציה)
```

## 🌐 לאתרי יצירת התקנה חיצוניים

### אופציה 1: Electron Forge Online
1. לך ל: https://electronforge.io/
2. העלה את התיקייה `mac-installer-package`
3. בחר "macOS DMG"
4. הורד את הקובץ המוכן

### אופציה 2: GitHub Codespaces
1. העלה לGitHub repository
2. פתח GitHub Codespaces
3. הרץ:
```bash
cd mac-installer-package
npm install
npx electron-builder --mac
```

### אופציה 3: זיפ את התיקייה
```bash
zip -r projectpilot-sync-source.zip mac-installer-package/
```
העלה את הזיפ לכל אתר שתומך ביצירת installers.

## ⚠️ הערות חשובות
- הקובץ `icon.png` זמני - תוכל להחליף באיקון אמיתי
- הפרויקט מוכן לבנייה ללא חתימה דיגיטלית
- הגדרות Gatekeeper מבוטלות לבדיקה מקומית

## 🎯 הכל מוכן!
התיקייה `mac-installer-package` מכילה את כל מה שצריך ליצירת installer למק.