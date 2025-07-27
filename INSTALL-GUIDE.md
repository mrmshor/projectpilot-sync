# 🚀 ProjectPilot Sync - מדריך התקנה מהיר

## 💻 התקנה במחשב (Desktop)

### שלב 1: הורד את קבצי ההתקנה
1. לך ל-GitHub Actions של הפרויקט
2. בחר את הbuild האחרון שהצליח  
3. הורד את `desktop-installers`
4. חלץ את הZIP

### שלב 2: התקן את האפליקציה
- **Windows**: הפעל את קובץ ה-.exe והתקן כרגיל
- **macOS**: פתח את קובץ ה-.dmg וגרור לתיקיית Applications
- **Linux**: הפעל את קובץ ה-.AppImage (אין צורך בהתקנה)

### שלב 3: הפעל את האפליקציה
האפליקציה תופיע בתפריט הראשי של המערכת שלך ותפעל כאפליקציה עצמאית!

## 📱 התקנה במובייל

### אופציה 1: PWA (מומלץ - פשוט ומהיר)
1. פתח את האפליקציה בדפדפן הנייד
2. לחץ על "הוסף למסך הבית" / "Add to Home Screen"
3. האפליקציה תהיה זמינה כאפליקציה נטיבית

### אופציה 2: בנייה נטיבית (מתקדמים)
```bash
# הורד את הפרויקט
git clone [YOUR-REPO-URL]
cd [REPO-NAME]
npm install

# בנה את האפליקציה
npm run build

# הוסף פלטפורמות
npx cap add ios     # עבור iOS
npx cap add android # עבור Android

# סנכרן והרץ
npx cap sync
npx cap run ios     # עבור iOS (דרוש Mac + Xcode)
npx cap run android # עבור Android (דרוש Android Studio)
```

## 🔧 דרישות מערכת

### עבור Desktop:
- Python 3 (בדרך כלל כבר מותקן)
- דפדפן מודרני

### עבור Mobile (PWA):
- דפדפן מודרני בנייד
- iOS 11.3+ או Android 5+

### עבור Mobile (Native):
- **iOS**: Mac + Xcode 14+
- **Android**: Android Studio + SDK

## ⚡ פקודות מהירות

```bash
# התקנה מהירה במחשב
curl -O [DOWNLOAD-LINK] && unzip ProjectPilot-Sync-Desktop.zip && cd desktop-app && ./ProjectPilot-Sync.command

# בדיקת בניה מקומית
npm install && npm run build && npm run preview
```

## 🚨 פתרון בעיות

### הדפדפן לא נפתח?
- הפעל ידנית: `http://localhost:3000`
- בדוק חומת אש

### Python לא נמצא?
- הורד מ: [python.org](https://python.org)
- או השתמש ב-`python3` במקום `python`

### בעיות הרשאות?
```bash
chmod +x ProjectPilot-Sync.command  # macOS
chmod +x ProjectPilot-Sync.sh       # Linux
```

## ✅ הכל מוכן!
האפליקציה שלך מוכנה לשימוש בכל מקום! 🎉

---
*עבור תמיכה נוספת, פתח issue בגיטהאב*