# Project Pilot Sync - אפליקציה נייטיבית לניהול פרויקטים

## 🚀 אפליקציה נייטיבית מלאה עם Tauri

אפליקציה מודרנית לניהול פרויקטים ומשימות עם יכולות מערכת מתקדמות:

### ✨ תכונות עיקריות
- 📁 **פתיחת תיקיות ב-Finder/Explorer** - גישה ישירה לתיקיות הפרויקט
- 💬 **WhatsApp שולחני** - פתיחת צ'אטים ישירות מהאפליקציה  
- 📧 **מייל אוטומטי** - שליחת מיילים עם פרטי פרויקט
- 📞 **חיוג טלפוני** - התקשרות ישירה לאנשי קשר
- 🎨 **עיצוב Apple מודרני** - ממשק משתמש מלוטש ומקצועי
- 🌙 **מצב כהה/בהיר** - תמיכה מלאה בשני מצבים
- 🇮🇱 **תמיכה בעברית** - RTL מלא וטקסט בעברית

### 🛠 טכנולוגיות

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Query (state management)
- React Router (navigation)

**Backend:**
- Tauri 2.0 (Rust)
- Native system integration
- Cross-platform support

**Styling:**
- Apple Design System inspired
- Modern glass effects
- Responsive design
- Hebrew RTL support

## 🔧 התקנה ופיתוח

### דרישות מערכת
- Node.js 20+ 
- Rust (latest stable)
- npm או yarn

### הגדרה מקומית

```bash
# שכפול הפרויקט
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# התקנת תלויות
npm install

# פיתוח (web version)
npm run dev

# פיתוח (Tauri desktop app)
npm run tauri:dev

# בנייה לפרודקשן
npm run build
npm run tauri:build
```

### פקודות שימושיות

```bash
# בדיקת קוד
npm run lint

# בנייה לבדיקה
npm run tauri:build:debug

# בדיקת תצורת Tauri
npm run tauri info
```

## 📱 אפליקציות מותקנות

הפרויקט בונה אוטומטית אפליקציות מותקנות עבור כל הפלטפורמות!

### הורדת אפליקציות
1. עבור ל-[GitHub Actions](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
2. בחר את הרצה האחרונה של "Build Desktop Apps"
3. הורד את הקובץ המתאים:
   - **Mac**: `ProjectPilot-Sync-Mac.dmg`
   - **Windows**: `ProjectPilot-Sync-Windows.exe` 
   - **Linux**: `ProjectPilot-Sync-Linux.AppImage`

### התקנה
- **Mac**: פתח את קובץ ה-DMG וגרור את האפליקציה לתיקיית Applications
- **Windows**: הפעל את קובץ ה-EXE ועקוב אחר הוראות ההתקנה
- **Linux**: הפעל את קובץ ה-AppImage (או הוסף הרשאות הפעלה)

### יתרונות האפליקציה המותקנת
✅ פתיחה ישירה של תיקיות מקומיות  
✅ בחירת תיקיות דרך דיאלוג מערכת  
✅ גישה מלאה לכל התיקיות במחשב  
✅ עבודה ללא אינטרנט  
✅ ביצועים מהירים יותר  

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b1cb2869-cf2d-4731-a631-2297f36707cb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
