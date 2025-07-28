#!/bin/bash

echo "🍎 מכין את הפרויקט ל-DMG Canvas..."

# שלב 1: בנה את הפרויקט
echo "📦 בונה את הפרויקט..."
npm install
npm run build

# בדיקה שהבנייה הצליחה
if [ ! -d "dist" ]; then
    echo "❌ שגיאה: תיקיית dist לא נוצרה. הבנייה נכשלה."
    exit 1
fi

# שלב 2: צור תיקיית mac-installer
echo "📁 יוצר תיקיית mac-installer..."
rm -rf mac-installer
mkdir -p mac-installer

# שלב 3: העתק קבצים
echo "📋 מעתיק קבצים..."

# העתק dist
cp -r dist mac-installer/

# העתק main.js ו-package.json מ-ready-package
cp ready-package/main.js mac-installer/
cp ready-package/package.json mac-installer/

# העתק assets
cp -r ready-package/assets mac-installer/

# שלב 4: צור קובץ ZIP
echo "🗜️ יוצר קובץ ZIP..."
cd mac-installer
zip -r ../ProjectPilot-Sync-Mac.zip .
cd ..

echo "✅ הכל מוכן!"
echo ""
echo "📦 קובץ ZIP נוצר: ProjectPilot-Sync-Mac.zip"
echo "🚀 עכשיו העלה את הקובץ ל-DMG Canvas"
echo ""
echo "📁 תוכן mac-installer:"
ls -la mac-installer/

echo ""
echo "🎯 השלבים הבאים:"
echo "1. פתח את DMG Canvas"
echo "2. העלה את ProjectPilot-Sync-Mac.zip"
echo "3. הגדר את ההגדרות (שם, אייקון, רקע)"
echo "4. צור את ה-DMG"