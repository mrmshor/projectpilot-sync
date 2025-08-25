import React from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, Calendar, User, MoreHorizontal } from 'lucide-react'
import type { Project } from '../../types'

interface RecentProjectsProps {
  projects: Project[]
  loading?: boolean
}

export default function RecentProjects({ projects, loading }: RecentProjectsProps) {
  if (loading) {
    return (
      <div className="apple-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-48" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
    return colors[status as keyof typeof colors] || colors.planning
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      planning: 'תכנון',
      active: 'פעיל',
      on_hold: 'המתנה',
      completed: 'הושלם',
      cancelled: 'בוטל'
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="apple-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-5 h-5 text-blue-500" />
          <h3 className="heading-sm">פרויקטים אחרונים</h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          הצג הכל
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">אין פרויקטים עדיין</h4>
          <p className="text-gray-500 mb-4">התחל על ידי יצירת הפרויקט הראשון שלך</p>
          <button className="btn-primary">
            <FolderKanban className="w-4 h-4 ml-2" />
            צור פרויקט חדש
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-3 h-3 rounded-full ${
                  project.color ? `bg-${project.color}-500` : 'bg-blue-500'
                }`} />
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{project.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {project.client_name && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{project.client_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(project.created_at).toLocaleDateString('he-IL')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
                
                <div className="flex items-center gap-1">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-left">{project.progress}%</span>
                </div>

                <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}