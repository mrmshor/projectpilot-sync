export interface TaskItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  projectName: string;
  projectDescription: string;
  folderPath?: string;
  tasks: TaskItem[];
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  workStatus: WorkStatus;
  priority: Priority;
  price: number;
  currency: string;
  isPaid: boolean;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkStatus = 'not_started' | 'in_progress' | 'review' | 'completed' | 'on_hold';

export type Priority = 'low' | 'medium' | 'high';

export const WORK_STATUS_LABELS: Record<WorkStatus, string> = {
  not_started: 'לא התחיל',
  in_progress: 'בתהליך', 
  review: 'בסקירה',
  completed: 'הושלם',
  on_hold: 'ממתין'
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'נמוכה',
  medium: 'בינונית',
  high: 'גבוהה'
};

export const CURRENCIES = ['USD', 'EUR', 'ILS', 'GBP', 'CAD'];