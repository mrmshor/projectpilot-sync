import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'
import { useThemeStore } from '../stores/themeStore'
import Layout from '../components/layout/Layout'
import StatsCards from '../components/dashboard/StatsCards'
import QuickActions from '../components/dashboard/QuickActions'
import RecentProjects from '../components/dashboard/RecentProjects'
import TasksOverview from '../components/dashboard/TasksOverview'
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Zap,
  Target
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { projects, tasks, loading, fetchProjects, fetchTasks } = useProjectStore()
  const { actualTheme } = useThemeStore()

  useEffect(() => {
    fetchProjects()
    fetchTasks()
  }, [fetchProjects, fetchTasks])

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => {
      if (!t.due_date) return false
      return new Date(t.due_date) < new Date() && t.status !== 'completed'
    }).length,
    totalHours: 0, // Will be calculated from time entries
    billableHours: 0,
    revenue: 0,
    pendingRevenue: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <Layout>
      <div className="container-apple py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="heading-xl">
                שלום, {user?.user_metadata?.full_name || 'משתמש'}! 👋
              </h1>
              <p className="text-body mt-2">
                הנה מבט כללי על הפרויקטים והמשימות שלך היום
              </p>
            </div>
            <div className="text-left">
              <p className="text-caption">
                {new Date().toLocaleDateString('he-IL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              title="פרויקטים פעילים"
              value={stats.activeProjects}
              total={stats.totalProjects}
              icon={<Target className="w-6 h-6" />}
              color="blue"
              trend={+12}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="משימות הושלמו"
              value={stats.completedTasks}
              total={stats.totalTasks}
              icon={<CheckCircle className="w-6 h-6" />}
              color="green"
              trend={+8}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="משימות באיחור"
              value={stats.overdueTasks}
              icon={<Clock className="w-6 h-6" />}
              color="red"
              urgent={stats.overdueTasks > 0}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="הכנסות צפויות"
              value={`₪${stats.pendingRevenue.toLocaleString()}`}
              icon={<TrendingUp className="w-6 h-6" />}
              color="purple"
              trend={+15}
            />
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
              <RecentProjects projects={projects.slice(0, 5)} loading={loading} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <TasksOverview tasks={tasks} loading={loading} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <QuickActions />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <UpcomingDeadlines tasks={tasks} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ActivityFeed />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  total, 
  icon, 
  color, 
  trend, 
  urgent 
}: {
  title: string
  value: string | number
  total?: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'purple'
  trend?: number
  urgent?: boolean
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  }

  return (
    <div className={`apple-card p-6 ${urgent ? 'ring-2 ring-red-300 dark:ring-red-700' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-caption mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="heading-md">{value}</span>
          {total && (
            <span className="text-caption">/ {total}</span>
          )}
        </div>
        
        {total && typeof value === 'number' && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color]}`}
                style={{ width: `${(value / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Upcoming Deadlines Component
function UpcomingDeadlines({ tasks }: { tasks: any[] }) {
  const upcomingTasks = tasks
    .filter(task => task.due_date && task.status !== 'completed')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5)

  return (
    <div className="apple-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 text-orange-500" />
        <h3 className="heading-sm">דדליינים קרובים</h3>
      </div>
      
      {upcomingTasks.length === 0 ? (
        <div className="text-center py-8 text-caption">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>אין דדליינים קרובים</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="font-medium text-sm">{task.title}</p>
                <p className="text-caption">
                  {new Date(task.due_date).toLocaleDateString('he-IL')}
                </p>
              </div>
              <div className={`badge-status ${
                new Date(task.due_date) < new Date() ? 'badge-high' : 
                new Date(task.due_date) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) ? 'badge-medium' : 
                'badge-low'
              }`}>
                {new Date(task.due_date) < new Date() ? 'באיחור' :
                 new Date(task.due_date) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) ? 'דחוף' :
                 'בזמן'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Activity Feed Component
function ActivityFeed() {
  const activities = [
    { id: 1, type: 'task_completed', message: 'הושלמה משימה "עיצוב דף הבית"', time: '2 שעות' },
    { id: 2, type: 'project_created', message: 'נוצר פרויקט חדש "אתר חברה"', time: '5 שעות' },
    { id: 3, type: 'comment_added', message: 'הוספה הערה לפרויקט "אפליקציה"', time: '1 יום' },
  ]

  return (
    <div className="apple-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-5 h-5 text-blue-500" />
        <h3 className="heading-sm">פעילות אחרונה</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm">{activity.message}</p>
              <p className="text-caption">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}