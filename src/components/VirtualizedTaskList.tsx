import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <div style={style} className="px-2 will-change-transform">
      <Card className="mb-2 border-muted-foreground/20 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-colors duration-200">
        <CardContent className="p-3">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground truncate">{task.projectName}</h3>
              <p className="text-sm text-muted-foreground truncate">{task.clientName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={task.isCompleted ? "default" : "secondary"} className="text-xs">
                  {task.isCompleted ? "הושלם" : "בתהליך"}
                </Badge>
                <Badge variant={task.isPaid ? "outline" : "destructive"} className="text-xs">
                  {task.isPaid ? "שולם" : "לא שולם"}
                </Badge>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <span className="text-lg font-bold text-primary">
                {task.price.toFixed(0)} ₪
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
    <div dir="rtl" className="w-full">
      <List
        height={height}
        width={width}
        itemCount={tasks.length}
        itemSize={100}
        itemData={itemData}
        className="scrollbar-thin scrollbar-thumb-muted/30 scrollbar-track-transparent"
        overscanCount={5}
      >
        {TaskItem}
      </List>
    </div>
  );
});