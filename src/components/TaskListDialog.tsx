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
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-5 rounded-xl border-2 border-accent/40 shadow-lg">
            <Input
              placeholder="הוסף משימה חדשה ולחץ Enter..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="w-full h-14 text-lg bg-background/90 border-2 border-accent/40 focus:border-accent focus:ring-4 focus:ring-accent/20 rounded-xl shadow-sm font-medium placeholder:text-muted-foreground/70 px-6"
              dir="rtl"
            />
          </div>

          {/* Task list */}
          <div 
            className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 text-sm">
                אין משימות עדיין
              </div>
            ) : (
              [...tasks].reverse().map((task, index) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 hover:shadow-md animate-fade-in",
                    index % 2 === 0 
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50" 
                      : "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50 dark:border-purple-700/50"
                  )}
                >
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="h-4 w-4 border-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <Input
                    value={task.text}
                    onChange={(e) => updateTaskText(task.id, e.target.value)}
                    className={cn(
                      "flex-1 border-none bg-transparent h-7 text-sm p-2 font-medium rounded focus:ring-2 focus:ring-accent/50",
                      task.isCompleted 
                        ? "line-through text-muted-foreground" 
                        : "text-foreground"
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="p-1 h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200 hover-scale"
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