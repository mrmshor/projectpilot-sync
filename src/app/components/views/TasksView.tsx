import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface TasksViewProps {
  tasks: any[];
  loading: boolean;
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  loading,
  onEditTask,
  onDeleteTask
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <ClockIcon className="w-5 h-5 text-blue-400" />;
      case 'review':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-title text-white font-bold mb-2">
            ניהול משימות
          </h1>
          <p className="text-body text-white/70">
            נהל את כל המשימות שלך במקום אחד
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>

          <button className="btn btn-primary">
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">משימה חדשה</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="חיפוש משימות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 bg-white/10 border-white/20 text-white placeholder-white/40"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input bg-white/10 border-white/20 text-white"
          >
            <option value="all" className="bg-gray-800">כל הסטטוסים</option>
            <option value="todo" className="bg-gray-800">לביצוע</option>
            <option value="in-progress" className="bg-gray-800">בתהליך</option>
            <option value="review" className="bg-gray-800">בסקירה</option>
            <option value="completed" className="bg-gray-800">הושלם</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="input bg-white/10 border-white/20 text-white"
          >
            <option value="all" className="bg-gray-800">כל העדיפויות</option>
            <option value="high" className="bg-gray-800">גבוהה</option>
            <option value="medium" className="bg-gray-800">בינונית</option>
            <option value="low" className="bg-gray-800">נמוכה</option>
          </select>

          <button className="btn btn-glass">
            <FunnelIcon className="w-5 h-5" />
            <span className="hidden sm:inline">מסננים</span>
          </button>
        </div>
      </div>

      {/* Tasks Grid/List */}
      {filteredTasks.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredTasks.map((task, index) => (
            <div
              key={task.id || index}
              className={`glass-card p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group ${
                viewMode === 'list' ? 'flex items-center gap-6' : ''
              }`}
              onClick={() => onEditTask(task)}
            >
              {/* Task Icon/Status */}
              <div className={`flex-shrink-0 ${viewMode === 'list' ? '' : 'mb-4'}`}>
                {getStatusIcon(task.status)}
              </div>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-lg truncate">
                    {task.title || `משימה ${index + 1}`}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0 mr-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? 'גבוהה' :
                       task.priority === 'medium' ? 'בינונית' : 'נמוכה'}
                    </span>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {task.description || 'אין תיאור למשימה זו'}
                </p>

                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status === 'completed' ? 'הושלם' :
                     task.status === 'in-progress' ? 'בתהליך' :
                     task.status === 'review' ? 'בסקירה' : 'לביצוע'}
                  </div>

                  {task.dueDate && (
                    <div className="text-white/60 text-xs">
                      {new Date(task.dueDate).toLocaleDateString('he-IL')}
                    </div>
                  )}
                </div>

                {/* Task Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {task.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {task.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-md">
                        +{task.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions (appear on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  className="btn btn-glass btn-small"
                >
                  ערוך
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  className="btn btn-small bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon className="w-12 h-12 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            אין משימות להצגה
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'נסה לשנות את המסננים או החיפוש'
              : 'צור משימה ראשונה כדי להתחיל'
            }
          </p>
          <button className="btn btn-primary">
            <PlusIcon className="w-5 h-5" />
            צור משימה חדשה
          </button>
        </div>
      )}
    </div>
  );
};