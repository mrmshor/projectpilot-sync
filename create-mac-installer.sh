#!/bin/bash

echo "🍎 יוצר חבילת התקנה מלאה למק..."

# שלב 1: בנה את הפרויקט
echo "📦 בונה את הפרויקט..."
npm install
npm run build

# בדיקה שהבנייה הצליחה
if [ ! -d "dist" ]; then
    echo "❌ שגיאה: תיקיית dist לא נוצרה. הבנייה נכשלה."
    exit 1
fi

# שלב 2: נקה ויצור תיקיית mac-installer
echo "🧹 מנקה ויוצר תיקיית mac-installer..."
rm -rf mac-installer
mkdir -p mac-installer/dist
mkdir -p mac-installer/assets

# שלב 3: העתק קבצים
echo "📋 מעתיק קבצים..."

# העתק את תוכן dist המובנה
cp -r dist/* mac-installer/dist/

# העתק הקבצים העדכניים מהשורש
cp electron-main.js mac-installer/main.js
cp preload.js mac-installer/preload.js
cp electron-package.json mac-installer/package.json

# בדוק שהקבצים הועתקו
echo "בדיקת קבצים שהועתקו:"
ls -la mac-installer/main.js mac-installer/preload.js mac-installer/package.json

# העתק assets מ-ready-package
cp -r ready-package/assets mac-installer/ 2>/dev/null || echo "אין תיקיית assets - ממשיך"

# צור אייקון מקום מציין אם אין
if [ ! -f "mac-installer/assets/icon.png" ]; then
    mkdir -p mac-installer/assets
    touch mac-installer/assets/icon.png
fi

# שלב 4: התקן תלויות Electron
echo "⚡ מתקין תלויות Electron..."
cd mac-installer
npm install electron@^28.0.0 electron-builder@^24.13.3
cd ..

# שלב 5: צור קובץ ZIP
echo "🗜️ יוצר קובץ ZIP..."
cd mac-installer
zip -r ../ProjectPilot-Sync-Mac-Complete.zip .
cd ..

echo "✅ הכל מוכן!"
echo ""
echo "📦 קובץ ZIP נוצר: ProjectPilot-Sync-Mac-Complete.zip"
echo "🚀 עכשיו העלה את הקובץ ל-DMG Canvas או לשירות בנייה אונליין"
echo ""
echo "📁 תוכן mac-installer:"
ls -la mac-installer/