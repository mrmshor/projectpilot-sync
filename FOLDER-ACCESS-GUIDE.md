# 📁 מדריך גישה לתיקיות מקומיות - ProjectPilot Sync

## 🎯 דרכים לגישה לתיקיות (לפי סדר יעילות)

### 1. 🖥️ אפליקציה מותקנת (מומלץ ביותר!)
**יתרונות:**
- ✅ פתיחה ישירה של תיקיות מקומיות
- ✅ בחירת תיקיות דרך דיאלוג מערכת
- ✅ גישה מלאה לכל התיקיות במחשב
- ✅ עבודה ללא אינטרנט

**איך להתקין:**
1. הורד את האפליקציה מ-GitHub Actions
2. התקן את קובץ ה-.exe (Windows) / .dmg (Mac) / .AppImage (Linux)
3. הפעל את האפליקציה
4. השתמש בכפתור "📁 בחר" ליבחור תיקיות ישירות

### 2. 🌐 דפדפן Chrome/Edge (File System Access API)
**דרישות:** Chrome 86+ או Edge 86+

**יתרונות:**
- ✅ בחירת תיקיות דרך דיאלוג מערכת
- ✅ זיכרון תיקיות שנבחרו
- ⚠️ הרשאות נדרשות לכל תיקייה

**איך להשתמש:**
1. פתח את האפליקציה ב-Chrome/Edge
2. לחץ "📁 בחר" ליד שדה נתיב התיקייה
3. אשר הרשאות גישה לתיקייה
4. התיקייה תישמר ותיפתח באמצעות מנהל הקבצים

### 3. 📱 PWA במובייל
**יתרונות:**
- ✅ קישורים לשירותי ענן (iCloud, Google Drive)
- ✅ גישה לתיקיות שיתוף
- ⚠️ מוגבל לקישורים חיצוניים

**איך להשתמש:**
1. הוסף את האפליקציה למסך הבית
2. השתמש בשדה "קישור תיקיה" עם:
   - `https://icloud.com/iclouddrive/...`
   - `https://drive.google.com/...`
   - קישורים אחרים לתיקיות ענן

## 🔧 פתרונות לבעיות נפוצות

### ❌ "לא ניתן לפתוח נתיבים מקומיים מהדפדפן"
**פתרונות:**
1. **עדכן לדפדפן תומך:**
   - Chrome 86+
   - Edge 86+
   - Firefox לא תומך (השתמש באפליקציה המותקנת)

2. **השתמש באפליקציה המותקנת:**
   - הורד מ-GitHub Actions
   - התקן כאפליקציה עצמאית
   - גישה מלאה לכל התיקיות

### 🔒 בעיות הרשאות
**Windows:**
```cmd
# הפעל כמנהל מערכת
Right-click → "Run as administrator"
```

**Mac:**
```bash
# תן הרשאות מלאות
System Preferences → Security & Privacy → Files and Folders
```

**Linux:**
```bash
# הוסף הרשאות לתיקיות
chmod 755 /path/to/folder
```

### 📋 העתקה ידנית של נתיבים
**Windows:**
1. לחץ `Win + R`
2. הדבק את הנתיב
3. לחץ Enter

**Mac:**
1. פתח Finder
2. לחץ `Cmd + Shift + G`
3. הדבק את הנתיב
4. לחץ Enter

**Linux:**
1. פתח File Manager
2. לחץ `Ctrl + L`
3. הדבק את הנתיב
4. לחץ Enter

## 🚀 דוגמאות שימוש

### תיקיות מקומיות
```
Windows: C:\Users\YourName\Projects\MyProject
Mac: /Users/YourName/Projects/MyProject
Linux: /home/yourname/Projects/MyProject
```

### קישורי ענן
```
iCloud: https://icloud.com/iclouddrive/0XXX...
Google Drive: https://drive.google.com/drive/folders/1XXX...
OneDrive: https://onedrive.live.com/...
Dropbox: https://dropbox.com/sh/...
```

### קישורים מקומיים (לדפדפנים תומכים)
```
file:///C:/Users/YourName/Projects/
file:///Users/YourName/Projects/
file:///home/yourname/Projects/
```

## 💡 טיפים לשימוש יעיל

### 1. ארגון תיקיות
```
📁 Projects/
├── 📁 Active/
│   ├── 📁 Client1-Website/
│   └── 📁 Client2-App/
├── 📁 Completed/
│   └── 📁 Old-Projects/
└── 📁 Templates/
    └── 📁 Project-Template/
```

### 2. שמות תיקיות עם תאריכים
```
2024-01-ProjectName
Client-ProjectName-v2
ProjectName-Final-20240127
```

### 3. שימוש בקיצורי דרך
- שמור תיקיות נפוצות ב-Bookmarks
- צור קיצורי דרך על שולחן העבודה
- השתמש בכלים כמו Alfred/PowerToys לגישה מהירה

## 🔄 סנכרון עם שירותי ענן

### iCloud Drive
1. הפעל סנכרון Desktop & Documents
2. התיקיות יהיו זמינות באופן אוטומטי
3. השתמש בקישורי שיתוף ל-ProjectPilot

### Google Drive
1. התקן Google Drive Desktop
2. תיקיות מסונכרנות יופיעו כמקומיות
3. צור קישורי שיתוף לפרויקטים

### Dropbox
1. התקן Dropbox Desktop
2. תיקיות מופיעות במחשב
3. השתמש בקישורי שיתוף

## 🚨 אבטחה וגיבויים

### גיבויים אוטומטיים
- ודא שתיקיות הפרויקט מגובות
- השתמש בשירותי ענן לגיבוי
- צור גיבויים מקומיים נוספים

### בטיחות נתונים
- אל תשתף נתיבים מקומיים בקישורים ציבוריים
- השתמש בהרשאות מוגבלות
- עדכן את האפליקציה בקביעות

---

## 🎉 סיכום

**לשימוש מיטבי:**
1. **במחשב:** השתמש באפליקציה המותקנת
2. **במובייל:** השתמש ב-PWA עם קישורי ענן
3. **בדפדפן:** Chrome/Edge עם File System Access API

**זכור:** האפליקציה המותקנת נותנת את החוויה הטובה ביותר עם גישה מלאה לתיקיות מקומיות!