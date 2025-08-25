import React from 'react';
import { Dashboard } from './views/Dashboard';
import { TasksView } from './views/TasksView';
import { ProjectsView } from './views/ProjectsView';
import { AnalyticsView } from './views/AnalyticsView';

interface MainContentProps {
  activeView: 'dashboard' | 'tasks' | 'projects' | 'analytics';
  tasks: any[];
  projects: any[];
  stats: any;
  loading: boolean;
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
  sidebarOpen: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({
  activeView,
  tasks,
  projects,
  stats,
  loading,
  onEditTask,
  onDeleteTask,
  sidebarOpen
}) => {
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            projects={projects}
            stats={stats}
            loading={loading}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            loading={loading}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            tasks={tasks}
            loading={loading}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            tasks={tasks}
            projects={projects}
            stats={stats}
            loading={loading}
          />
        );
      default:
        return <Dashboard tasks={tasks} projects={projects} stats={stats} loading={loading} />;
    }
  };

  return (
    <main 
      className={`
        flex-1 min-h-screen transition-all duration-300
        ${sidebarOpen ? 'lg:mr-80' : ''}
      `}
      style={{ paddingTop: '80px' }} // Account for fixed header
    >
      <div className="container py-8 animate-fade-in">
        {renderView()}
      </div>
    </main>
  );
};