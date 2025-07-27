#!/bin/bash

# שרת תיקיות למק
# הפעלה: ./start-server.sh

echo "🍎 מפעיל שרת תיקיות למק..."

# בדיקה אם Python3 מותקן
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 לא מותקן. מתקן עם Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew לא מותקן. התקן אותו מ: https://brew.sh"
        exit 1
    fi
    brew install python3
fi

# מתן הרשאות להפעלה
chmod +x local-folder-server.py

# הפעלת השרת
python3 local-folder-server.py