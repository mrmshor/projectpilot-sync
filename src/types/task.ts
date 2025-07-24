export interface Task {
  id: string;
  projectName: string;
  projectDescription: string;
  folderPath?: string;
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
  not_started: 'Not Started',
  in_progress: 'In Progress', 
  review: 'Review',
  completed: 'Completed',
  on_hold: 'On Hold'
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];