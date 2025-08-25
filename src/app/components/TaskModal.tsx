import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  editingTask?: any;
  projects: any[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
  projects
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project: '',
    dueDate: '',
    tags: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'todo',
        priority: editingTask.priority || 'medium',
        project: editingTask.project || '',
        dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '',
        tags: editingTask.tags ? editingTask.tags.join(', ') : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project: '',
        dueDate: '',
        tags: ''
      });
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    };

    onSave(taskData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative glass-strong rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-subtitle text-white font-bold">
            {editingTask ? 'עריכת משימה' : 'משימה חדשה'}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-glass btn-small"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              כותרת המשימה *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input bg-white/10 border-white/20 text-white placeholder-white/40"
              placeholder="הכנס כותרת למשימה"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              תיאור
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input bg-white/10 border-white/20 text-white placeholder-white/40 h-24 resize-none"
              placeholder="תאר את המשימה..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                סטטוס
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input bg-white/10 border-white/20 text-white"
              >
                <option value="todo" className="bg-gray-800">לביצוע</option>
                <option value="in-progress" className="bg-gray-800">בתהליך</option>
                <option value="review" className="bg-gray-800">בסקירה</option>
                <option value="completed" className="bg-gray-800">הושלם</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                עדיפות
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input bg-white/10 border-white/20 text-white"
              >
                <option value="low" className="bg-gray-800">נמוכה</option>
                <option value="medium" className="bg-gray-800">בינונית</option>
                <option value="high" className="bg-gray-800">גבוהה</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                פרויקט
              </label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="input bg-white/10 border-white/20 text-white"
              >
                <option value="" className="bg-gray-800">בחר פרויקט</option>
                {projects.map((project, index) => (
                  <option key={project.id || index} value={project.id || project.name} className="bg-gray-800">
                    {project.name || `פרויקט ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                תאריך יעד
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              תגיות
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="input bg-white/10 border-white/20 text-white placeholder-white/40"
              placeholder="הפרד תגיות בפסיקים"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-glass"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingTask ? 'עדכן' : 'צור'} משימה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};