import React from 'react';
import { FolderIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ProjectsViewProps {
  projects: any[];
  tasks: any[];
  loading: boolean;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  loading
}) => {
  if (loading) {
    return <div className="text-white">טוען פרויקטים...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-title text-white font-bold">פרויקטים</h1>
        <button className="btn btn-primary">
          <PlusIcon className="w-5 h-5" />
          פרויקט חדש
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={project.id || index} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <FolderIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {project.name || `פרויקט ${index + 1}`}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {project.taskCount || 0} משימות
                  </p>
                </div>
              </div>
              <p className="text-white/70 text-sm">
                {project.description || 'אין תיאור'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <FolderIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">אין פרויקטים</h3>
          <p className="text-white/60 mb-4">צור פרויקט ראשון כדי להתחיל</p>
          <button className="btn btn-primary">
            <PlusIcon className="w-5 h-5" />
            צור פרויקט
          </button>
        </div>
      )}
    </div>
  );
};