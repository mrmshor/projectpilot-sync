import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Task } from '@/types/task';
import { OptimizedTaskCard } from './OptimizedTaskCard';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  height?: number;
  itemHeight?: number;
}

// Memoized row component for virtualization
const TaskRow = memo(({ index, style, data }: any) => {
  const { tasks, onUpdateTask, onDeleteTask, onEditTask } = data;
  const task = tasks[index];

  return (
    <div style={style} className="px-2 py-1">
      <OptimizedTaskCard
        task={task}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
        onUpdate={onUpdateTask}
      />
    </div>
  );
});

export const VirtualizedTaskList = memo(({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  height = 600,
  itemHeight = 200
}: VirtualizedTaskListProps) => {
  // Memoize the data object to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    tasks,
    onUpdateTask,
    onDeleteTask,
    onEditTask
  }), [tasks, onUpdateTask, onDeleteTask, onEditTask]);

  // If tasks list is small, render normally to avoid virtualization overhead
  if (tasks.length <= 10) {
    return (
      <div className="minimal-spacing">
        {tasks.map((task) => (
          <OptimizedTaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        ))}
      </div>
    );
  }

  return (
    <List
      height={height}
      width="100%"
      itemCount={tasks.length}
      itemSize={itemHeight}
      itemData={itemData}
      className="minimal-spacing"
    >
      {TaskRow}
    </List>
  );
});

VirtualizedTaskList.displayName = 'VirtualizedTaskList';