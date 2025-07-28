# 🍎 הכנת הפרויקט ל-DMG Canvas

## שלב 1: בנה את הפרויקט
```bash
npm install
npm run build
```

## שלב 2: הכן את תיקיית ההתקנה
1. צור תיקייה חדשה בשם `mac-installer`
2. העתק את התיקיות והקבצים הבאים לתוך `mac-installer`:
   - `dist/` (מהבנייה)
   - `ready-package/main.js`
   - `ready-package/package.json`
   - `ready-package/assets/`

## שלב 3: המבנה הסופי
```
mac-installer/
├── main.js
├── package.json
├── dist/
│   ├── index.html
│   └── assets/...
└── assets/
    └── icon-placeholder.txt
```

## שלב 4: דחס לקובץ ZIP
1. בחר את כל התוכן של תיקיית `mac-installer` (לא את התיקייה עצמה)
2. צור קובץ ZIP בשם `ProjectPilot-Sync-Mac.zip`

## שלב 5: העלה ל-DMG Canvas
1. פתח את DMG Canvas
2. העלה את קובץ ה-ZIP
3. בחר הגדרות DMG
4. צור את ה-DMG

## 📋 רשימת בדיקה:
- [ ] הפרויקט נבנה בהצלחה
- [ ] תיקיית dist קיימת ומכילה קבצים
- [ ] main.js ו-package.json מועתקים
- [ ] תיקיית assets קיימת
- [ ] קובץ ZIP נוצר בהצלחה
- [ ] הכל מוכן להעלאה ל-DMG Canvas

## ⚠️ חשוב!
וודא שאתה מעלה את **תוכן** התיקייה ולא את התיקייה עצמה ל-DMG Canvas.