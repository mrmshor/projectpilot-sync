export type Priority = 'low' | 'medium' | 'high'
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed'

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  status: ProjectStatus
  priority: Priority
  client_name?: string
  client_email?: string
  client_phone?: string
  budget?: number
  currency: string
  start_date?: string
  end_date?: string
  progress: number
  color?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  assignee?: string
  due_date?: string
  estimated_hours?: number
  actual_hours?: number
  tags?: string[]
  dependencies?: string[]
  attachments?: string[]
  created_at: string
  updated_at: string
}

export interface TimeEntry {
  id: string
  user_id: string
  task_id: string
  project_id?: string
  description?: string
  start_time: string
  end_time?: string
  duration: number
  is_billable: boolean
  hourly_rate?: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  user_id: string
  project_id?: string
  task_id?: string
  content: string
  parent_id?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'task_assigned' | 'task_completed' | 'project_updated' | 'deadline_approaching' | 'comment_added'
  title: string
  message: string
  read: boolean
  data?: Record<string, any>
  created_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  timezone?: string
  preferences?: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: {
      email: boolean
      push: boolean
      desktop: boolean
    }
    dashboard: {
      layout: 'grid' | 'list'
      widgets: string[]
    }
  }
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  totalHours: number
  billableHours: number
  revenue: number
  pendingRevenue: number
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  tasks: Omit<Task, 'id' | 'user_id' | 'project_id' | 'created_at' | 'updated_at'>[]
  estimated_duration: number
  estimated_budget: number
  tags: string[]
}

export interface FilterOptions {
  status?: ProjectStatus[]
  priority?: Priority[]
  client?: string[]
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
  search?: string
}

export interface SortOptions {
  field: keyof Project | keyof Task
  direction: 'asc' | 'desc'
}

// API Response types
export interface ApiResponse<T> {
  data: T
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form types
export interface CreateProjectForm {
  title: string
  description?: string
  client_name?: string
  client_email?: string
  client_phone?: string
  budget?: number
  currency: string
  start_date?: string
  end_date?: string
  priority: Priority
  color?: string
  tags?: string[]
}

export interface CreateTaskForm {
  title: string
  description?: string
  project_id?: string
  priority: Priority
  due_date?: string
  estimated_hours?: number
  tags?: string[]
}

// Chart data types
export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  value: number
  category?: string
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  primaryColor: string
  accentColor: string
  borderRadius: number
  animations: boolean
}

// Database table types for Supabase
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at'>>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Task, 'id' | 'created_at'>>
      }
      time_entries: {
        Row: TimeEntry
        Insert: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TimeEntry, 'id' | 'created_at'>>
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>
      }
      profiles: {
        Row: User
        Insert: Omit<User, 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
    }
  }
}