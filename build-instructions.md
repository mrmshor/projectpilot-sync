# 🚀 ProjectPilot Sync - הוראות בנייה והתקנה

## 📋 דרישות מקדימות
- Node.js 18+ 
- Git
- חשבון GitHub

## 🔧 הכנה ראשונית

### 1. העבר את הפרויקט לגיטהאב
1. לחץ על כפתור **"GitHub"** בצד ימין של Lovable
2. לחץ **"Connect to GitHub"** 
3. אשר הרשאות והמתן לסיום

### 2. הורד את הפרויקט למחשב שלך
```bash
git clone https://github.com/[USERNAME]/[REPOSITORY-NAME]
cd [REPOSITORY-NAME]
npm install
```

## 🏗️ בנייה אוטומטית דרך GitHub Actions

### אופציה 1: בנייה אוטומטית בכל דחיפה
GitHub Actions יבנה אוטומטית את האפליקציה לכל מערכות ההפעלה כשתדחוף קוד.

הקבצים מוכנים להורדה בלשונית **"Actions"** → **"Build Desktop App"** → **"Artifacts"**

### אופציה 2: יצירת Release
```bash
# צור tag חדש
git tag v1.0.0
git push origin v1.0.0
```

GitHub ייצור אוטומטית release עם קבצי התקנה עבור:
- ✅ Windows (.exe)
- ✅ macOS (.dmg) 
- ✅ Linux (.AppImage)

## 💻 בנייה מקומית

### הוסף Electron
```bash
npm install @capacitor/electron --save-dev
npx cap add electron
```

### בנה את האפליקציה
```bash
npm run build
npx cap sync
```

### בנה עבור המערכת שלך
```bash
cd electron
npm install

# Windows
npx electron-builder --windows

# macOS  
npx electron-builder --mac

# Linux
npx electron-builder --linux
```

## 📦 קבצי ההתקנה יהיו ב:
```
electron/dist/
├── ProjectPilot-Sync-Setup.exe      (Windows)
├── ProjectPilot-Sync.dmg            (macOS)
└── ProjectPilot-Sync.AppImage       (Linux)
```

## 🌟 יתרונות האפליקציה המקורית
- ✅ **פתיחת תיקיות אוטומטית** במקום העתקה לזיכרון
- ✅ **ביצועים מהירים יותר**
- ✅ **עבודה ללא אינטרנט**
- ✅ **הודעות מערכת**
- ✅ **אפליקציה עצמאית** ללא דפדפן

## 🚨 פתרון בעיות

### בעיות בנייה?
1. ודא ש-Node.js 18+ מותקן
2. הרץ `npm install` מחדש
3. נקה cache: `npm run clean` ו-`npx cap clean`

### בעיות הרשאות?
- Windows: הרץ כמנהל מערכת
- macOS/Linux: השתמש ב-`sudo` במידת הצורך

## 🎯 השלבים הפשוטים
1. **העבר לגיטהאב** ← זה יצור את כל הקבצים
2. **הורד פרויקט** ← `git clone`
3. **הרץ build** ← הקבצים מוכנים!

**הכל מוכן! GitHub יעשה את העבודה בשבילך! 🎉**