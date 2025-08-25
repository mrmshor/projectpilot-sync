import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types'

// For demo purposes, we'll use a mock setup
// In production, you would use real Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Mock authentication for demo
class MockAuth {
  private currentUser: any = null
  private listeners: ((event: string, session: any) => void)[] = []

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    // Mock successful login
    const user = {
      id: 'demo-user-id',
      email,
      user_metadata: { full_name: 'Demo User' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const session = {
      user,
      access_token: 'demo-token',
      refresh_token: 'demo-refresh',
      expires_at: Date.now() + 3600000,
      expires_in: 3600
    }

    this.currentUser = user
    this.notifyListeners('SIGNED_IN', session)
    
    return { data: { user, session }, error: null }
  }

  async signUp({ email, password, options }: any) {
    // Mock successful signup
    const user = {
      id: 'demo-user-id-new',
      email,
      user_metadata: options?.data || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return { data: { user, session: null }, error: null }
  }

  async signOut() {
    this.currentUser = null
    this.notifyListeners('SIGNED_OUT', null)
    return { error: null }
  }

  async getSession() {
    if (this.currentUser) {
      const session = {
        user: this.currentUser,
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_at: Date.now() + 3600000,
        expires_in: 3600
      }
      return { data: { session }, error: null }
    }
    return { data: { session: null }, error: null }
  }

  async getUser() {
    return { data: { user: this.currentUser }, error: null }
  }

  async updateUser(updates: any) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates }
      return { data: { user: this.currentUser }, error: null }
    }
    return { data: { user: null }, error: new Error('No user') }
  }

  async resetPasswordForEmail(email: string, options?: any) {
    // Mock password reset
    console.log('Password reset requested for:', email)
    return { error: null }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.listeners.push(callback)
    return { data: { subscription: { unsubscribe: () => {} } } }
  }

  private notifyListeners(event: string, session: any) {
    this.listeners.forEach(listener => listener(event, session))
  }
}

// Mock database operations
class MockDatabase {
  private data: { [key: string]: any[] } = {
    projects: [],
    tasks: [],
    time_entries: [],
    comments: [],
    notifications: [],
    profiles: []
  }

  from(table: string) {
    return new MockTable(table, this.data)
  }
}

class MockTable {
  constructor(private table: string, private data: { [key: string]: any[] }) {}

  select(columns = '*') {
    return new MockQuery(this.table, this.data, 'select', columns)
  }

  insert(values: any[]) {
    return new MockQuery(this.table, this.data, 'insert', values)
  }

  update(values: any) {
    return new MockQuery(this.table, this.data, 'update', values)
  }

  delete() {
    return new MockQuery(this.table, this.data, 'delete')
  }
}

class MockQuery {
  private filters: any[] = []
  private orderBy: { column: string; ascending: boolean } | null = null
  private limitCount: number | null = null

  constructor(
    private table: string,
    private data: { [key: string]: any[] },
    private operation: string,
    private operationData?: any
  ) {}

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value })
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy = { column, ascending: options?.ascending ?? true }
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  single() {
    return this.then(data => data?.[0] || null)
  }

  async then(resolve?: (value: any) => any) {
    let result: any = null
    let error: any = null

    try {
      switch (this.operation) {
        case 'select':
          result = this.executeSelect()
          break
        case 'insert':
          result = this.executeInsert()
          break
        case 'update':
          result = this.executeUpdate()
          break
        case 'delete':
          result = this.executeDelete()
          break
      }
    } catch (e) {
      error = e
    }

    const response = { data: result, error }
    return resolve ? resolve(response) : response
  }

  private executeSelect() {
    let results = [...(this.data[this.table] || [])]

    // Apply filters
    this.filters.forEach(filter => {
      if (filter.type === 'eq') {
        results = results.filter(item => item[filter.column] === filter.value)
      }
    })

    // Apply ordering
    if (this.orderBy) {
      results.sort((a, b) => {
        const aVal = a[this.orderBy!.column]
        const bVal = b[this.orderBy!.column]
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return this.orderBy!.ascending ? comparison : -comparison
      })
    }

    // Apply limit
    if (this.limitCount) {
      results = results.slice(0, this.limitCount)
    }

    return results
  }

  private executeInsert() {
    const items = Array.isArray(this.operationData) ? this.operationData : [this.operationData]
    const newItems = items.map(item => ({
      ...item,
      id: `${this.table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    this.data[this.table] = [...(this.data[this.table] || []), ...newItems]
    return newItems
  }

  private executeUpdate() {
    const results = []
    this.data[this.table] = (this.data[this.table] || []).map(item => {
      const shouldUpdate = this.filters.every(filter => {
        if (filter.type === 'eq') {
          return item[filter.column] === filter.value
        }
        return true
      })

      if (shouldUpdate) {
        const updated = { ...item, ...this.operationData, updated_at: new Date().toISOString() }
        results.push(updated)
        return updated
      }
      return item
    })
    return results
  }

  private executeDelete() {
    const toDelete = []
    this.data[this.table] = (this.data[this.table] || []).filter(item => {
      const shouldDelete = this.filters.every(filter => {
        if (filter.type === 'eq') {
          return item[filter.column] === filter.value
        }
        return true
      })

      if (shouldDelete) {
        toDelete.push(item)
        return false
      }
      return true
    })
    return toDelete
  }
}

// Replace supabase with mock for demo
if (supabaseUrl === 'https://demo.supabase.co') {
  ;(supabase as any).auth = new MockAuth()
  ;(supabase as any).from = (table: string) => new MockDatabase().from(table)
}

export default supabase