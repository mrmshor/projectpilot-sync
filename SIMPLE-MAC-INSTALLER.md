# 🚀 הוראות פשוטות ליצירת קובץ התקנה למק

## צעד 1: הורד את הקוד הבנוי
1. לחץ על כפתור **"GitHub"** למעלה ימין
2. לחץ **"Connect to GitHub"** אם עדיין לא חיברת
3. אחרי החיבור, לך לגיטהאב שלך ותמצא את הפרויקט
4. לחץ על **"Actions"** בגיטהאב
5. בחר ב-**"Build Desktop App"**
6. הורד את **"desktop-installers"** (קובץ zip)
7. פתח את הזיפ ותמצא תיקייה **"dist"**

## צעד 2: יצור תיקיית עבודה
צור תיקייה חדשה במחשב ותקרא לה `mac-installer`

## צעד 3: העתק קבצים

### העתק את התיקייה "dist"
העתק את כל התיקייה **"dist"** לתוך `mac-installer`

### צור קובץ main.js
צור קובץ חדש בשם `main.js` בתוך `mac-installer` והעתק פנימה:

```
[העתק הכל מהקובץ electron-main.js שיצרתי למעלה]
```

### צור קובץ package.json
צור קובץ חדש בשם `package.json` בתוך `mac-installer` והעתק פנימה:

```
[העתק הכל מהקובץ electron-package.json שיצרתי למעלה]
```

### צור תיקיית assets
1. צור תיקייה בשם `assets` בתוך `mac-installer`
2. תוכל לשים איקון בשם `icon.png` (לא חובה)

## צעד 4: זיפ הכל
בחר את כל התוכן בתוך `mac-installer` ועשה zip לכל התיקייה.
קרא לזיפ: `projectpilot-sync-mac.zip`

## צעד 5: העלה לאתר יצירת התקנה

### אתרים מומלצים:
1. **GitHub Codespaces** (בחינם):
   - העלה לגיטהאב שלך
   - פתח Codespaces
   - הרץ: `npm install && npx electron-builder --mac`

2. **Replit** (בחינם):
   - העלה את הזיפ
   - הרץ את הפקודות

3. **אתרי Electron Builder מקוונים** - חפש "electron builder online"

## 📁 מבנה סופי
```
mac-installer/
├── main.js
├── package.json
├── dist/
│   ├── index.html
│   └── assets/
└── assets/
    └── icon.png
```

## 🎯 זהו!
עכשיו יש לך הכל מוכן - פשוט העלה לאתר והוא יכין לך קובץ התקנה למק!