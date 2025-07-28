#!/bin/bash

echo "🍎 יוצר חבילת התקנה למק..."

# שלב 1: בנה את הפרויקט
echo "📦 בונה את הפרויקט..."
npm run build

# בדיקה שהבנייה הצליחה
if [ ! -d "dist" ]; then
    echo "❌ שגיאה: תיקיית dist לא נוצרה. הבנייה נכשלה."
    exit 1
fi

# שלב 2: נקה ויצור תיקיית mac-installer
echo "🧹 מנקה ויוצר תיקיית mac-installer..."
rm -rf mac-installer/dist
mkdir -p mac-installer/dist

# שלב 3: העתק קבצים
echo "📋 מעתיק קבצים..."

# העתק את תוכן dist המובנה לתוך mac-installer/dist
cp -r dist/* mac-installer/dist/

# שלב 4: צור קובץ ZIP
echo "🗜️ יוצר קובץ ZIP..."
cd mac-installer
zip -r ../ProjectPilot-Sync-Mac-Ready.zip .
cd ..

echo "✅ הכל מוכן!"
echo ""
echo "📦 קובץ ZIP נוצר: ProjectPilot-Sync-Mac-Ready.zip"
echo "🚀 עכשיו העלה את הקובץ ל-DMG Canvas"
echo ""
echo "📁 תוכן mac-installer:"
ls -la mac-installer/