# 🍎 הוראות התקנה למק - ProjectPilot Sync

## 🚨 פתרון לשגיאת "Apple לא הצליחה לוודא"

### שיטה 1: פתיחה דרך לחיצה ימנית (מומלץ)
1. **אל תלחץ לחיצה כפולה על הקובץ**
2. **לחץ לחיצה ימנית על הקובץ .dmg**
3. **בחר "פתח" מהתפריט**
4. **לחץ "פתח" בחלון האזהרה**

### שיטה 2: דרך הגדרות המערכת
1. פתח **הגדרות מערכת** (System Preferences)
2. עבור ל**אבטחה ופרטיות** (Security & Privacy)
3. תחת **כללי** (General), לחץ **"פתח בכל זאת"** (Open Anyway)

### שיטה 3: דרך Terminal (למתקדמים)
```bash
# הסר את ה-quarantine attribute
xattr -rd com.apple.quarantine "/path/to/ProjectPilot\ Sync.app"

# או לקובץ ה-DMG
xattr -rd com.apple.quarantine "/path/to/ProjectPilot-Sync.dmg"
```

## 📋 שלבי התקנה מלאים

1. **הורד את הקובץ** מ-GitHub Actions
2. **פתח את קובץ ה-DMG** באמצעות לחיצה ימנית → פתח
3. **גרור את האפליקציה** לתיקיית Applications
4. **פתח את האפליקציה** באמצעות לחיצה ימנית → פתח

## ⚠️ מדוע זה קורה?

- האפליקציה לא חתומה דיגיטלית על ידי מפתח רשום של Apple
- זוהי בעיה נפוצה באפליקציות קוד פתוח
- האפליקציה בטוחה לחלוטין - היא נבנתה מקוד המקור שלך

## ✅ האפליקציה תעבוד נכון לאחר הפתיחה הראשונה

לאחר הפתיחה הראשונה, macOS יזכור את האפליקציה ותוכל לפתוח אותה בלחיצה כפולה רגילה.

## 🆘 עדיין לא עובד?

נסה את הפקודות הבאות ב-Terminal:
```bash
# אפשר הרצה של אפליקציות לא חתומות זמנית
sudo spctl --master-disable

# לאחר ההתקנה, החזר את ההגנה
sudo spctl --master-enable
```

---
**💡 טיפ**: שמור את הקובץ הזה למשתמשים אחרים שיורידו את האפליקציה!