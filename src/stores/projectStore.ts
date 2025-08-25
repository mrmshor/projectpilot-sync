import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { Project, Task, ProjectStatus, Priority } from '../types'

interface ProjectState {
  projects: Project[]
  tasks: Task[]
  loading: boolean
  error: string | null
  selectedProject: Project | null
  
  // Actions
  fetchProjects: () => Promise<void>
  fetchTasks: (projectId?: string) => Promise<void>
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setSelectedProject: (project: Project | null) => void
  clearError: () => void
}

export const useProjectStore = create<ProjectState>()(
  subscribeWithSelector((set, get) => ({
    projects: [],
    tasks: [],
    loading: false,
    error: null,
    selectedProject: null,

    fetchProjects: async () => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        set({ projects: data || [], loading: false })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch projects',
          loading: false 
        })
      }
    },

    fetchTasks: async (projectId) => {
      set({ loading: true, error: null })
      try {
        let query = supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })

        if (projectId) {
          query = query.eq('project_id', projectId)
        }

        const { data, error } = await query
        if (error) throw error
        set({ tasks: data || [], loading: false })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch tasks',
          loading: false 
        })
      }
    },

    createProject: async (project) => {
      set({ loading: true, error: null })
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data, error } = await supabase
          .from('projects')
          .insert([{ ...project, user_id: user.id }])
          .select()
          .single()

        if (error) throw error
        
        const { projects } = get()
        set({ 
          projects: [data, ...projects],
          loading: false 
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create project',
          loading: false 
        })
        throw error
      }
    },

    updateProject: async (id, updates) => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('projects')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        
        const { projects } = get()
        set({ 
          projects: projects.map(p => p.id === id ? data : p),
          loading: false 
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update project',
          loading: false 
        })
        throw error
      }
    },

    deleteProject: async (id) => {
      set({ loading: true, error: null })
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)

        if (error) throw error
        
        const { projects } = get()
        set({ 
          projects: projects.filter(p => p.id !== id),
          loading: false 
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete project',
          loading: false 
        })
        throw error
      }
    },

    createTask: async (task) => {
      set({ loading: true, error: null })
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data, error } = await supabase
          .from('tasks')
          .insert([{ ...task, user_id: user.id }])
          .select()
          .single()

        if (error) throw error
        
        const { tasks } = get()
        set({ 
          tasks: [data, ...tasks],
          loading: false 
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create task',
          loading: false 
        })
        throw error
      }
    },

    updateTask: async (id, updates) => {
      set({ loading: true, error: null })
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        
        const { tasks } = get()
        set({ 
          tasks: tasks.map(t => t.id === id ? data : t),
          loading: false 
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update task',
          loading: false 
        })
        throw error
      }
    },

    deleteTask: async (id) => {
      set({ loading: true, error: null })
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)

        if (error) throw error
        
        const { tasks } = get()
        set({ 
          tasks: tasks.filter(t => t.id !== id),
          loading: false 
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete task',
          loading: false 
        })
        throw error
      }
    },

    setSelectedProject: (project) => {
      set({ selectedProject: project })
    },

    clearError: () => {
      set({ error: null })
    },
  }))
)