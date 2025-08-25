import React from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Clock, AlertCircle, Calendar } from 'lucide-react'
import type { Task } from '../../types'

interface TasksOverviewProps {
  tasks: Task[]
  loading?: boolean
}

export default function TasksOverview({ tasks, loading }: TasksOverviewProps) {
  if (loading) {
    return (
      <div className="apple-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-32" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      todo: <Clock className="w-4 h-4 text-gray-500" />,
      in_progress: <Clock className="w-4 h-4 text-blue-500" />,
      review: <AlertCircle className="w-4 h-4 text-yellow-500" />,
      completed: <CheckSquare className="w-4 h-4 text-green-500" />
    }
    return icons[status as keyof typeof icons] || icons.todo
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      todo: 'לביצוע',
      in_progress: 'בתהליך',
      review: 'בסקירה',
      completed: 'הושלם'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: 'נמוכה',
      medium: 'בינונית',
      high: 'גבוהה'
    }
    return labels[priority as keyof typeof labels] || priority
  }

  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="apple-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-5 h-5 text-green-500" />
          <h3 className="heading-sm">סקירת משימות</h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          הצג הכל
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">אין משימות עדיין</h4>
          <p className="text-gray-500 mb-4">התחל על ידי יצירת המשימה הראשונה שלך</p>
          <button className="btn-primary">
            <CheckSquare className="w-4 h-4 ml-2" />
            צור משימה חדשה
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 8).map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group ${
                isOverdue(task.due_date) && task.status !== 'completed' ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  {getStatusIcon(task.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm mb-1 ${
                    task.status === 'completed' ? 'line-through text-gray-500' : ''
                  }`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{getStatusLabel(task.status)}</span>
                    {task.due_date && (
                      <div className={`flex items-center gap-1 ${
                        isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600 font-medium' : ''
                      }`}>
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.due_date).toLocaleDateString('he-IL')}</span>
                        {isOverdue(task.due_date) && task.status !== 'completed' && (
                          <span className="text-red-600 font-medium">(באיחור)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
            </motion.div>
          ))}
          
          {tasks.length > 8 && (
            <div className="text-center pt-4">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                הצג {tasks.length - 8} משימות נוספות
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}