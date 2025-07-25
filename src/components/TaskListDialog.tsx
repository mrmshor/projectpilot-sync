import { useState } from 'react';
import { TaskItem } from '@/types/task';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListDialogProps {
  tasks: TaskItem[];
  onUpdateTasks: (tasks: TaskItem[]) => void;
  projectName: string;
}

export const TaskListDialog = ({ tasks = [], onUpdateTasks, projectName }: TaskListDialogProps) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: TaskItem = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        isCompleted: false
      };
      onUpdateTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const toggleTask = (taskId: string) => {
    onUpdateTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    onUpdateTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskText = (taskId: string, text: string) => {
    onUpdateTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, text } : task
      )
    );
  };

  const completedCount = tasks.filter(task => task.isCompleted).length;
  const totalCount = tasks.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div 
          className="flex items-center gap-2 cursor-pointer hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-600/30 rounded-lg px-3 py-2 transition-all duration-300 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/50 shadow-md"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">משימות</span>
          {totalCount > 0 && (
            <Badge variant="secondary" className="text-xs bg-blue-500/30 text-blue-700 dark:text-blue-300 border-blue-500/50">
              {completedCount}/{totalCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-4 z-50 bg-gradient-to-br from-accent/5 to-accent/15 border-accent/30 shadow-lg" 
        dir="rtl"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="space-y-4">
          <div className="font-medium text-sm text-accent-foreground">משימות - {projectName}</div>
          
          {/* Add new task */}
          <div className="flex gap-2">
            <Input
              placeholder="הוסף משימה חדשה..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1 h-8 text-sm"
            />
            <Button onClick={addTask} size="sm" className="h-8 w-8 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Task list */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 text-sm">
                אין משימות עדיין
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 rounded border bg-background/50"
                >
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="h-3 w-3"
                  />
                  <Input
                    value={task.text}
                    onChange={(e) => updateTaskText(task.id, e.target.value)}
                    className={cn(
                      "flex-1 border-none bg-transparent h-6 text-sm p-1",
                      task.isCompleted && "line-through text-muted-foreground"
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="p-1 h-6 w-6 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {totalCount > 0 && (
            <div className="text-xs text-muted-foreground text-center border-t pt-2">
              הושלמו {completedCount} מתוך {totalCount} משימות
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};