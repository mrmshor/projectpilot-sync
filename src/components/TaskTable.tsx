import React, { useState, useCallback, useMemo, memo } from 'react';
import { Task, Priority } from '@/types/task';
import TaskFilters from './TaskFilters';
import { PaginatedTaskList } from './PaginatedTaskList';
import { debounce } from '@/lib/optimizations';

interface TaskTableProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

type SortField = keyof Task;
type SortDirection = 'asc' | 'desc';

export const TaskTable = memo(({ tasks, onUpdateTask, onDeleteTask }: TaskTableProps) => {
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
    debounce((value: string) => setSearchTerm(value), 200),
    []
  );

  const filteredTasks = useMemo(() => {
    if (tasks.length === 0) return [];
    
    let filtered = tasks;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.projectName.toLowerCase().includes(searchLower) ||
        task.clientName.toLowerCase().includes(searchLower) ||
        task.projectDescription.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, searchTerm, priorityFilter, sortField, sortDirection]);

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

      {/* Paginated Task List */}
      <PaginatedTaskList
        tasks={tasks}
        filteredTasks={filteredTasks}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        searchTerm={searchTerm}
      />
    </div>
  );
});

TaskTable.displayName = 'TaskTable';