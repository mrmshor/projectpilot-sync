import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  Bell,
  Search,
  Plus
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()
  const { theme, setTheme, actualTheme } = useThemeStore()

  const navigation = [
    { name: 'לוח בקרה', href: '/', icon: LayoutDashboard },
    { name: 'פרויקטים', href: '/projects', icon: FolderKanban },
    { name: 'אנליטיקה', href: '/analytics', icon: BarChart3 },
    { name: 'הגדרות', href: '/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 z-50 w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-apple-blue to-apple-purple rounded-2xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">מנהל משימות</h1>
                <p className="text-xs text-gray-500">גרסה 2.0</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-200 ${
                      isActive
                        ? 'bg-apple-blue text-white shadow-lg'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-500 mb-4">פעולות מהירות</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>פרויקט חדש</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                  <Search className="w-5 h-5" />
                  <span>חיפוש</span>
                </button>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-apple-green to-apple-teal rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium text-sm">{user?.user_metadata?.full_name || 'משתמש'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full right-0 mb-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-apple border border-gray-200 dark:border-gray-700 p-2"
                >
                  <div className="space-y-1">
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">התנתק</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:mr-80">
        {/* Top Bar */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="חיפוש פרויקטים ומשימות..."
                  className="w-80 pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-apple-blue focus:bg-white dark:focus:bg-gray-700 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>
              
              <button className="btn-primary">
                <Plus className="w-4 h-4 ml-2" />
                חדש
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}

// Theme Selector Component
function ThemeSelector({ theme, setTheme }: { theme: string, setTheme: (theme: any) => void }) {
  const themes = [
    { value: 'light', label: 'בהיר', icon: Sun },
    { value: 'dark', label: 'כהה', icon: Moon },
    { value: 'system', label: 'מערכת', icon: Monitor },
  ]

  return (
    <div className="space-y-1">
      <div className="px-3 py-2 text-xs font-medium text-gray-500">תמה</div>
      {themes.map((item) => (
        <button
          key={item.value}
          onClick={() => setTheme(item.value)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            theme === item.value
              ? 'bg-apple-blue text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <item.icon className="w-4 h-4" />
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </div>
  )
}