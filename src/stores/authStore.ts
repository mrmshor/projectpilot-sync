import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,

      signIn: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          
          if (error) throw error
          
          set({
            user: data.user,
            session: data.session,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      signUp: async (email: string, password: string, fullName: string) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })
          
          if (error) throw error
          
          // Don't set user immediately for sign up - wait for email confirmation
          set({ loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      signOut: async () => {
        set({ loading: true })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          
          set({
            user: null,
            session: null,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
      },

      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) throw new Error('No user logged in')
        
        const { error } = await supabase.auth.updateUser({
          data: updates,
        })
        
        if (error) throw error
        
        // Refresh user data
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          set({ user: data.user })
        }
      },

      initialize: () => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
          set({
            user: session?.user ?? null,
            session,
            loading: false,
          })
        })

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          set({
            user: session?.user ?? null,
            session,
            loading: false,
          })
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
)