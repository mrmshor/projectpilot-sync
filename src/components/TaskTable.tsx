import React, { useState, useCallback, useMemo, memo } from 'react';
import { Task, Priority } from '@/types/task';
import ProjectCard from './ProjectCard';
import TaskFilters from './TaskFilters';
import { debounce } from '@/lib/optimizations';

interface TaskTableProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

type SortField = keyof Task;
type SortDirection = 'asc' | 'desc';

export const TaskTable = memo(({ tasks, onUpdateTask, onDeleteTask }: TaskTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  // Debounced search function for better performance
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  const filteredTasks = useMemo(() => {
    if (tasks.length === 0) return [];
    
    const filtered = tasks.filter(task => {
      const matchesSearch = !searchTerm || (
        task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.projectDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, searchTerm, priorityFilter, sortField, sortDirection]);

  const handleEdit = useCallback((taskId: string) => {
    setEditingId(taskId);
  }, []);

  const handleSave = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">אין פרויקטים</h3>
        <p className="text-muted-foreground">התחל על ידי יצירת פרויקט חדש</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <TaskFilters
        searchTerm={searchTerm}
        onSearchChange={debouncedSetSearchTerm}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {/* Project Cards View */}
      <div className="space-y-6" dir="rtl">
        {filteredTasks.map((task) => (
          <ProjectCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            isEditing={editingId === task.id}
            onEdit={() => handleEdit(task.id)}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ))}
        
        {filteredTasks.length === 0 && searchTerm && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">אין תוצאות</h3>
            <p className="text-muted-foreground">לא נמצאו פרויקטים התואמים לחיפוש "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
});

TaskTable.displayName = 'TaskTable';