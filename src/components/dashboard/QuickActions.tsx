import React from 'react'
import { motion } from 'framer-motion'
import { Plus, FolderPlus, Users, Calendar, FileText, Zap } from 'lucide-react'

export default function QuickActions() {
  const actions = [
    {
      title: 'פרויקט חדש',
      description: 'צור פרויקט חדש',
      icon: <FolderPlus className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      action: () => console.log('New Project')
    },
    {
      title: 'משימה מהירה',
      description: 'הוסף משימה',
      icon: <Plus className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      action: () => console.log('Quick Task')
    },
    {
      title: 'הזמן פגישה',
      description: 'קבע פגישה עם לקוח',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      action: () => console.log('Schedule Meeting')
    },
    {
      title: 'צור דוח',
      description: 'דוח התקדמות',
      icon: <FileText className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      action: () => console.log('Generate Report')
    }
  ]

  return (
    <div className="apple-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-5 h-5 text-yellow-500" />
        <h3 className="heading-sm">פעולות מהירות</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-right group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <h4 className="font-medium text-sm mb-1">{action.title}</h4>
            <p className="text-xs text-gray-500">{action.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}