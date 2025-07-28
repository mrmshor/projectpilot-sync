#!/bin/bash

echo "🚀 מתחיל מצב פיתוח עם Electron..."

# התקן electron אם לא מותקן
if ! command -v npx &> /dev/null; then
    echo "❌ npx לא מותקן. אנא התקן Node.js"
    exit 1
fi

# בדיקה שקיים preload.js
if [ ! -f "preload.js" ]; then
    echo "❌ קובץ preload.js לא נמצא"
    exit 1
fi

# התקן electron באופן מקומי אם לא מותקן
if [ ! -d "node_modules/electron" ]; then
    echo "📦 מתקין Electron..."
    npm install electron@^28.0.0 --save-dev
fi

echo "⚡ מפעיל Electron במצב פיתוח..."
echo "👆 ודא שהפעלת 'npm run dev' בטרמינל נפרד"

npx electron electron-dev.js