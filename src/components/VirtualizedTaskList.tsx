import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  height: number;
  width?: number | string;
}

interface TaskItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    tasks: Task[];
    onUpdateTask: (id: string, updates: Partial<Task>) => void;
    onDeleteTask: (id: string) => void;
  };
}

const TaskItem = React.memo(({ index, style, data }: TaskItemProps) => {
  const { tasks, onUpdateTask, onDeleteTask } = data;
  const task = tasks[index];

  if (!task) return null;

  return (
    <div style={style} className="px-4">
      <Card className="mac-card hover-lift mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{task.projectName}</h3>
              <p className="text-sm text-muted-foreground">{task.clientName}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">
                {task.price.toFixed(2)} {task.currency}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export const VirtualizedTaskList = React.memo(({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  height,
  width = '100%'
}: VirtualizedTaskListProps) => {
  const itemData = useMemo(() => ({
    tasks,
    onUpdateTask,
    onDeleteTask
  }), [tasks, onUpdateTask, onDeleteTask]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">אין פרויקטים</h3>
        <p className="text-muted-foreground">התחל על ידי יצירת פרויקט חדש</p>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <List
        height={height}
        width={width}
        itemCount={tasks.length}
        itemSize={120}
        itemData={itemData}
        className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {TaskItem}
      </List>
    </div>
  );
});