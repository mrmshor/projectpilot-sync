# ProjectPilot Sync - אפליקציית ניהול פרויקטים

## תיאור
ProjectPilot Sync היא אפליקציית שולחן עבודה מתקדמת לניהול פרויקטים ומשימות, המותאמת לעברית ומיועדת למעצבים, מפתחים ועצמאיים.

## תכונות עיקריות

### 🎯 ניהול פרויקטים
- יצירה ועריכה של פרויקטים מפורטים
- מעקב אחרי סטטוס עבודה ורמת עדיפות
- ניהול פרטי לקוחות מלאים
- מעקב אחרי מחירים ותשלומים

### 📝 משימות מהירות
- רשימת משימות צדדית לניהול יומיומי
- יצירה מהירה של משימות קצרות
- ייצוא ישיר לאפליקציית הפתקים של Mac

### 📁 ניהול תיקיות
- בחירת תיקיות ישירות ממערכת ההפעלה
- פתיחה מהירה של תיקיות פרויקטים
- קישור לתיקיות iCloud Drive ושירותי אחסון אחרים

### 🎨 עיצוב מותאם
- ממשק משתמש מותאם לעברית (RTL)
- תמיכה במצב כהה ובהיר
- עיצוב מודרני ונקי

## התקנה

### דרישות מערכת
- macOS 10.14 ומעלה
- 4GB זיכרון RAM
- 100MB שטח פנוי בדיסק

### הורדה והתקנה
1. עבור לעמוד [Releases](https://github.com/yourusername/projectpilot-sync/releases)
2. הורד את קובץ ה-DMG העדכני ביותר
3. פתח את קובץ ה-DMG
4. גרור את האפליקציה לתיקיית Applications
5. פתח את האפליקציה מתיקיית Applications

### הרצה ראשונה
בהפעלה הראשונה, macOS עלול להציג אזהרת אבטחה. לפתרון:
1. לחץ ימני על האפליקציה ובחר "פתח"
2. או עבור ל: System Preferences > Security & Privacy > ולחץ "Open Anyway"

## פיתוח

### טכנולוגיות
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Desktop**: Electron 28
- **State Management**: React Hooks + Local Storage
- **Icons**: Lucide React

### התקנה למפתחים

```bash
# שכפול הפרויקט
git clone https://github.com/yourusername/projectpilot-sync.git
cd projectpilot-sync

# התקנת תלויות
npm install

# הפעלה במצב פיתוח (דפדפן)
npm run dev

# הפעלה במצב פיתוח (Electron)
npm run dev  # בטרמינל ראשון
./start-electron-dev.sh  # בטרמינל שני

# בניית אפליקציה סופית
./create-mac-installer.sh
cd mac-installer
npx electron .
```

### מבנה הפרויקט
```
src/
├── components/          # קומפוננטים של React
│   ├── ui/             # קומפוננטים בסיסיים (shadcn/ui)
│   ├── Dashboard.tsx   # דשבורד ראשי
│   ├── TaskTable.tsx   # טבלת פרויקטים
│   └── QuickTaskSidebar.tsx  # בר משימות מהירות
├── hooks/              # React Hooks מותאמים
├── types/              # הגדרות TypeScript
├── lib/                # פונקציות עזר
└── pages/              # עמודים ראשיים

electron-main.js        # תהליך ראשי של Electron
preload.js             # סקריפט preload עבור Electron
ready-package/         # קבצים מוכנים לחבילה
mac-installer/         # תיקיית בנייה למק
```

## GitHub Actions

הפרויקט כולל workflow אוטומטי ל-GitHub Actions שבונה אוטומטית קובצי DMG:

### Workflow בנייה אוטומטית
- רץ על כל push למאסטר
- בונה את האפליקציה ויוצר DMG
- שומר את הקובץ כ-Artifact

### Workflow שחרור
- רץ רק על tags (למשל `v1.0.0`)
- יוצר Release חדש ב-GitHub
- מעלה את קובץ ה-DMG לשחרור

### יצירת שחרור חדש
```bash
# יצירת tag חדש
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions יבנה ויפרסם אוטומטית
```

## תרומה לפרויקט

נשמח לתרומות! אנא:
1. צור Fork של הפרויקט
2. צור branch חדש לפיצ'ר שלך
3. בצע commit עם הודעה ברורה
4. צור Pull Request

## רישיון
MIT License - ראה קובץ LICENSE לפרטים מלאים.

## תמיכה
לתמיכה ושאלות, פתח Issue ב-GitHub או צור קשר בוואטסאפ.

---

**מפותח באהבה ל-Mac ולקהילת היוצרים הישראלית** 🇮🇱

## How can I edit this code via Lovable?

**URL**: https://lovable.dev/projects/b1cb2869-cf2d-4731-a631-2297f36707cb

Simply visit the [Lovable Project](https://lovable.dev/projects/b1cb2869-cf2d-4731-a631-2297f36707cb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.
