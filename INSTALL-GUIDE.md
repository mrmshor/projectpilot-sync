# 🚀 ProjectPilot Sync - מדריך התקנה מהיר

## 💻 התקנה במחשב (Desktop)

### שלב 1: הורד את הקבצים
1. לך ל-GitHub Actions של הפרויקט
2. בחר את הbuild האחרון שהצליח
3. הורד את `desktop-package`
4. חלץ את הZIP לתיקיה כלשהי

### שלב 2: הפעל את האפליקציה
- **Windows**: לחץ פעמיים על `ProjectPilot-Sync.bat`
- **macOS**: לחץ פעמיים על `ProjectPilot-Sync.command`  
- **Linux**: לחץ פעמיים על `ProjectPilot-Sync.sh`

האפליקציה תפתח באופן אוטומטי בדפדפן שלך!

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