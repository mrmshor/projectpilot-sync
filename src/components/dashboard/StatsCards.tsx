import React from 'react'
import { motion } from 'framer-motion'
import type { DashboardStats } from '../../types'

interface StatsCardsProps {
  stats: DashboardStats
  loading?: boolean
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="apple-card p-6">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'פרויקטים פעילים',
      value: stats.activeProjects,
      total: stats.totalProjects,
      color: 'blue',
      icon: '🎯',
      trend: +12
    },
    {
      title: 'משימות הושלמו',
      value: stats.completedTasks,
      total: stats.totalTasks,
      color: 'green',
      icon: '✅',
      trend: +8
    },
    {
      title: 'משימות באיחור',
      value: stats.overdueTasks,
      color: 'red',
      icon: '⏰',
      urgent: stats.overdueTasks > 0
    },
    {
      title: 'הכנסות צפויות',
      value: `₪${stats.pendingRevenue.toLocaleString()}`,
      color: 'purple',
      icon: '💰',
      trend: +15
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`apple-card p-6 ${card.urgent ? 'ring-2 ring-red-300 dark:ring-red-700' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">{card.icon}</div>
            {card.trend && (
              <div className={`text-sm font-medium ${card.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {card.trend > 0 ? '+' : ''}{card.trend}%
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-caption mb-1">{card.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="heading-md">{card.value}</span>
              {card.total && typeof card.value === 'number' && (
                <span className="text-caption">/ {card.total}</span>
              )}
            </div>
            
            {card.total && typeof card.value === 'number' && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      card.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      card.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      card.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      'bg-gradient-to-r from-purple-500 to-purple-600'
                    }`}
                    style={{ width: `${Math.min((card.value / card.total) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}