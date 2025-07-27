export interface QuickTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  folderLink?: string; // קישור לתיקיה
}

export interface FolderLink {
  id: string;
  name: string;
  path: string; // נתיב לתיקיה או iCloud shortcut
  createdAt: Date;
}