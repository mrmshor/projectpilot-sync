# 📦 איך להשתמש ב-Packages - הוראות צעד אחר צעד

## 🚀 שלב 1: הורד ותתקן את Packages
1. לך ל: http://s.sudre.free.fr/Software/Packages/about.html
2. לחץ **"Download"**
3. פתח את הקובץ שהורדת והתקן

## 📁 שלב 2: הכן את הקבצים
### צור תיקייה חדשה בשם `ProjectPilot-Mac`
### בתוך התיקייה צור:
1. **קובץ `main.js`** - העתק מתוך `electron-main.js` שיצרתי
2. **קובץ `package.json`** - העתק מתוך `electron-package.json` שיצרתי  
3. **תיקייה `dist`** - הורד מ-GitHub Actions (Build Desktop App → desktop-installers)
4. **תיקייה `assets`** - צור תיקייה ריקה

### המבנה צריך להיראות ככה:
```
ProjectPilot-Mac/
├── main.js
├── package.json
├── dist/
│   ├── index.html
│   └── assets/...
└── assets/
```

## ⚙️ שלב 3: עבוד עם Packages

### פתח את Packages
1. פתח את תוכנת **Packages**
2. יופיע חלון חדש

### צור פרויקט חדש
1. לחץ **"File"** → **"New"**
2. בחר **"Distribution"** 
3. שמור בשם `ProjectPilot-Installer`

### הוסף את האפליקציה שלך
1. בחלון השמאלי תראה **"Project"**
2. לחץ על **"+"** (Add Package)
3. בחר **"Package"**
4. תן שם: `ProjectPilot Sync`

### הגדר את הקבצים
1. לחץ על השם שיצרת (`ProjectPilot Sync`)
2. לחץ על לשונית **"Payload"**
3. גרור את כל התיקייה `ProjectPilot-Mac` לאזור הגדול
4. בחר **"Applications"** כמיקום היעד

### הגדרות נוספות
1. לשונית **"Settings"**:
   - **Identifier**: `app.lovable.projectpilot.sync`
   - **Version**: `1.0.0`
   - **Install Location**: `/Applications`

2. לשונית **"Scripts"** - אפשר לדלג

## 🏗️ שלב 4: בנה את המתקין
1. לחץ **"Build"** → **"Build"**
2. בחר מיקום לשמירה
3. המתן לסיום הבנייה
4. יווצר קובץ `.pkg` מוכן להתקנה!

## ✅ סיימת!
עכשיו יש לך קובץ התקנה מקצועי שכל אחד יכול להתקין פשוט בלחיצה כפולה!

## 🎯 טיפים
- אם יש שגיאה - ודא שכל הקבצים בתיקייה
- אפשר לשנות איקון בלשונית **"Presentation"**
- המתקין יתקין את האפליקציה ב-Applications