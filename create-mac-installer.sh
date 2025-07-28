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

# העתק main.js ו-package.json מ-ready-package
cp ready-package/main.js mac-installer/
cp ready-package/package.json mac-installer/

# צור אייקון מקום מציין
touch mac-installer/assets/icon.png

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