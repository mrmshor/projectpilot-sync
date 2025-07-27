#!/usr/bin/env python3
"""
שרת מקומי לפתיחת תיקיות במק
להפעלה: python3 local-folder-server.py
"""

import http.server
import socketserver
import os
import webbrowser
from urllib.parse import unquote
import threading
import time

class FolderHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # פענוח הנתיב מ-URL
        path = unquote(self.path)
        
        # הסרת סלאש מהתחלה
        if path.startswith('/'):
            path = path[1:]
        
        # אם זה נתיב ריק, הראה את התיקייה הבסיסית
        if not path:
            path = '.'
        
        # בדיקה שהנתיב קיים
        if os.path.exists(path) and os.path.isdir(path):
            # שינוי לתיקייה המבוקשת
            original_dir = os.getcwd()
            try:
                os.chdir(path)
                super().do_GET()
            finally:
                os.chdir(original_dir)
        else:
            # אם הנתיב לא קיים, הראה שגיאה
            self.send_error(404, f"התיקייה לא נמצאה: {path}")

def start_server():
    PORT = 8000
    
    print("🚀 מפעיל שרת תיקיות מקומי...")
    print(f"📁 השרת יפעל על: http://localhost:{PORT}")
    print("💡 כדי לפתוח תיקיה ספציפית: http://localhost:8000/path/to/folder")
    print("⚠️  לסיום השרת לחץ Ctrl+C")
    print("-" * 50)
    
    try:
        with socketserver.TCPServer(("", PORT), FolderHandler) as httpd:
            # פתיחת הדפדפן אוטומטית
            def open_browser():
                time.sleep(1)
                webbrowser.open(f'http://localhost:{PORT}')
            
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            print(f"✅ השרת פועל בהצלחה על פורט {PORT}")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 השרת נסגר")
    except Exception as e:
        print(f"❌ שגיאה: {e}")

if __name__ == "__main__":
    start_server()