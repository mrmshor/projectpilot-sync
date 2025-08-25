import React from 'react';
import { 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrendingUpIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  tasks: any[];
  projects: any[];
  stats: any;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  projects,
  stats,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
            <div className="text-white/60">טוען נתונים...</div>
          </div>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      label: 'סה"כ משימות',
      value: stats?.totalTasks || 0,
      icon: ClipboardDocumentListIcon,
      color: 'from-blue-400 to-blue-600',
      change: '+12%'
    },
    {
      label: 'הושלמו',
      value: stats?.completedTasks || 0,
      icon: CheckCircleIcon,
      color: 'from-green-400 to-green-600',
      change: '+8%'
    },
    {
      label: 'בתהליך',
      value: stats?.inProgressTasks || 0,
      icon: ClockIcon,
      color: 'from-yellow-400 to-orange-500',
      change: '+3%'
    },
    {
      label: 'באיחור',
      value: stats?.overdueeTasks || 0,
      icon: ExclamationTriangleIcon,
      color: 'from-red-400 to-red-600',
      change: '-5%'
    }
  ];

  const recentTasks = tasks.slice(0, 5);
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          ברוך הבא למנהל המשימות
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          נהל את הפרויקטים והמשימות שלך בצורה חכמה ויעילה עם כלים מתקדמים
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card p-6 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-green-400 text-sm font-medium">
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-subtitle text-white font-semibold">
                משימות אחרונות
              </h2>
              <button className="btn btn-glass btn-small">
                צפה בהכל
              </button>
            </div>

            <div className="space-y-4">
              {recentTasks.length > 0 ? recentTasks.map((task, index) => (
                <div key={task.id || index} className="glass rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-400' :
                      task.status === 'in-progress' ? 'bg-blue-400' :
                      task.status === 'review' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {task.title || `משימה ${index + 1}`}
                      </h3>
                      <p className="text-white/60 text-sm truncate">
                        {task.description || 'אין תיאור'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {task.priority === 'high' ? 'גבוהה' :
                         task.priority === 'medium' ? 'בינונית' : 'נמוכה'}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-white/60">
                  <ClipboardDocumentListIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>אין משימות עדיין</p>
                  <p className="text-sm mt-2">צור משימה ראשונה כדי להתחיל</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Projects & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Projects */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body text-white font-semibold">
                פרויקטים פעילים
              </h3>
              <button className="btn btn-glass btn-small">
                <TrendingUpIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentProjects.length > 0 ? recentProjects.map((project, index) => (
                <div key={project.id || index} className="glass rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {(project.name || `פרויקט ${index + 1}`).charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {project.name || `פרויקט ${index + 1}`}
                      </div>
                      <div className="text-white/60 text-xs">
                        {project.taskCount || 0} משימות
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-white/60">
                  <div className="text-sm">אין פרויקטים פעילים</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-body text-white font-semibold mb-4">
              פעולות מהירות
            </h3>

            <div className="space-y-3">
              <button className="w-full btn btn-glass justify-start">
                <CalendarDaysIcon className="w-5 h-5" />
                <span>תזמן פגישה</span>
              </button>
              
              <button className="w-full btn btn-glass justify-start">
                <UsersIcon className="w-5 h-5" />
                <span>הזמן חבר צוות</span>
              </button>
              
              <button className="w-full btn btn-glass justify-start">
                <CurrencyDollarIcon className="w-5 h-5" />
                <span>דוח הכנסות</span>
              </button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="glass-card p-6">
            <h3 className="text-body text-white font-semibold mb-4">
              התקדמות השבוע
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">משימות הושלמו</span>
                  <span className="text-white">
                    {stats?.completedTasks || 0}/{stats?.totalTasks || 0}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats?.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">יעדים שבועיים</span>
                  <span className="text-white">75%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};