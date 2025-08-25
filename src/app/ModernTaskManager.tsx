import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { FloatingActionButton } from './components/FloatingActionButton';
import { TaskModal } from './components/TaskModal';
import { NotificationToast } from './components/NotificationToast';
import { useTaskManager } from './hooks/useTaskManager';
import { useDeviceSync } from './hooks/useDeviceSync';
import { useNotifications } from './hooks/useNotifications';
import '../styles/apple-modern.css';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: Date;
  tags: string[];
  project: string;
  timeTracked: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ModernTaskManager: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'projects' | 'analytics'>('dashboard');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Custom hooks for functionality
  const {
    tasks,
    projects,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
  } = useTaskManager();

  const { syncStatus, lastSync } = useDeviceSync();
  const { notifications, showNotification } = useNotifications();

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask = createTask(taskData);
    showNotification('משימה נוצרה בהצלחה', 'success');
    setTaskModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      showNotification('משימה עודכנה בהצלחה', 'success');
      setEditingTask(null);
      setTaskModalOpen(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    showNotification('משימה נמחקה', 'info');
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        syncStatus={syncStatus}
        lastSync={lastSync}
        onCreateTask={() => setTaskModalOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          activeView={activeView}
          onViewChange={setActiveView}
          projects={projects}
          stats={stats}
        />

        {/* Main Content */}
        <MainContent
          activeView={activeView}
          tasks={tasks}
          projects={projects}
          stats={stats}
          loading={loading}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setTaskModalOpen(true)}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        editingTask={editingTask}
        projects={projects}
      />

      {/* Notifications */}
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
};