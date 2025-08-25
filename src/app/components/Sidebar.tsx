import React from 'react';
import { 
  HomeIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  activeView: 'dashboard' | 'tasks' | 'projects' | 'analytics';
  onViewChange: (view: 'dashboard' | 'tasks' | 'projects' | 'analytics') => void;
  projects: any[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueeTasks: number;
  };
}

const navigationItems = [
  { id: 'dashboard', label: 'לוח בקרה', icon: HomeIcon },
  { id: 'tasks', label: 'משימות', icon: ClipboardDocumentListIcon },
  { id: 'projects', label: 'פרויקטים', icon: FolderIcon },
  { id: 'analytics', label: 'אנליטיקה', icon: ChartBarIcon }
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeView,
  onViewChange,
  projects,
  stats
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50 w-80 
        glass-strong border-l border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <div className="mb-8">
              <h2 className="text-subtitle text-white font-semibold mb-4">
                ניווט ראשי
              </h2>
              
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id as any)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        text-right transition-all duration-200
                        ${isActive 
                          ? 'bg-white/20 text-white shadow-lg border border-white/20' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                      
                      {/* Badge for tasks count */}
                      {item.id === 'tasks' && stats.inProgressTasks > 0 && (
                        <div className="mr-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {stats.inProgressTasks}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mb-8">
              <h3 className="text-body text-white/80 font-medium mb-4">
                סטטיסטיקות מהירות
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.totalTasks}
                  </div>
                  <div className="text-xs text-white/60">
                    סה"כ משימות
                  </div>
                </div>
                
                <div className="glass rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {stats.completedTasks}
                  </div>
                  <div className="text-xs text-white/60">
                    הושלמו
                  </div>
                </div>
                
                <div className="glass rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.inProgressTasks}
                  </div>
                  <div className="text-xs text-white/60">
                    בתהליך
                  </div>
                </div>
                
                <div className="glass rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {stats.overdueeTasks}
                  </div>
                  <div className="text-xs text-white/60">
                    באיחור
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="mb-8">
              <h3 className="text-body text-white/80 font-medium mb-4">
                פרויקטים אחרונים
              </h3>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {projects.slice(0, 5).map((project, index) => (
                  <div
                    key={project.id || index}
                    className="glass rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <FolderIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {project.name || `פרויקט ${index + 1}`}
                        </div>
                        <div className="text-xs text-white/60">
                          {project.taskCount || 0} משימות
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <FolderIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">אין פרויקטים עדיין</p>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-white/10">
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all">
                <ClockIcon className="w-5 h-5" />
                <span>מעקב זמן</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all">
                <UserGroupIcon className="w-5 h-5" />
                <span>צוות</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all">
                <Cog6ToothIcon className="w-5 h-5" />
                <span>הגדרות</span>
              </button>
            </div>
            
            {/* User Profile */}
            <div className="mt-4 glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    ח
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">
                    חיים כהן
                  </div>
                  <div className="text-xs text-white/60">
                    מנהל פרויקטים
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};