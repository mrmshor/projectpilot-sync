# 🍎 ProjectPilot Sync - הוראות בנייה ל-macOS

## 📋 דרישות מקדימות
- macOS 12+ 
- Xcode 14+
- Node.js 18+
- Git

## 🚀 הוראות מהירות

### 1. העבר את הפרויקט לגיטהאב
```bash
# לחץ על כפתור "GitHub" בצד ימין של Lovable
# לחץ "Connect to GitHub" ואשר הרשאות
```

### 2. הורד את הפרויקט למק שלך
```bash
git clone https://github.com/[USERNAME]/[REPOSITORY-NAME]
cd [REPOSITORY-NAME]
npm install
```

### 3. הכן את האפליקציה ל-iOS
```bash
# בנה את הפרויקט
npm run build

# הוסף פלטפורמת iOS
npx cap add ios

# סנכרן את הקבצים
npx cap sync ios
```

### 4. פתח ב-Xcode ובנה
```bash
# פתח את הפרויקט ב-Xcode
npx cap open ios
```

**ב-Xcode:**
1. בחר את ה-Team שלך ב-Signing & Capabilities
2. שנה את ה-Bundle Identifier לייחודי
3. לחץ על Product → Archive
4. Export → App Store Connect או Development

## 🔄 בנייה אוטומטית עם GitHub Actions

GitHub Actions יבנה אוטומטית:
- ✅ **אפליקציית רשת** (Desktop)
- ✅ **אפליקציית iOS** (עם Xcode Cloud)

הקבצים יהיו זמינים ב-Actions → Artifacts

## 🛠️ פקודות מועילות

### בנייה מקומית
```bash
# בנייה מהירה לבדיקה
npm run build
npx cap sync ios
npx cap run ios

# בנייה לפרסום
npm run build
npx cap sync ios
npx cap open ios
```

### עדכון התלויות
```bash
# עדכון Capacitor
npm update @capacitor/core @capacitor/ios
npx cap sync ios
```

### ניפוי שגיאות
```bash
# ניקוי cache
npx cap clean ios
npm run build
npx cap sync ios

# בדיקת בריאות הפרויקט
npx cap doctor
```

## 📱 הפצה

### App Store
1. בנה Archive ב-Xcode
2. Export → App Store Connect
3. העלה דרך Xcode או Transporter

### TestFlight (בדיקות)
1. Export → App Store Connect
2. העלה ל-App Store Connect
3. הוסף בודקים ב-TestFlight

## 🚨 פתרון בעיות נפוצות

### שגיאת Signing
```bash
# ודא שיש לך Apple Developer Account
# בחר Team נכון ב-Xcode
# שנה Bundle Identifier לייחודי
```

### שגיאת Build
```bash
# נקה והתחל מחדש
npx cap clean ios
rm -rf node_modules
npm install
npm run build
npx cap sync ios
```

### שגיאת Simulator
```bash
# הפעל iOS Simulator
open -a Simulator
npx cap run ios
```

## ⚡ טיפים למהירות

1. **Hot Reload**: השתמש ב-Live Reload בזמן פיתוח
2. **GitHub Actions**: תן ל-GitHub לבנות בשבילך
3. **Xcode Cloud**: הגדר בנייה אוטומטית

**הכל מוכן! GitHub יעשה את הבנייה בשבילך! 🎉**