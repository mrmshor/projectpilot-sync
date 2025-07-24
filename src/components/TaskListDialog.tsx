import { useState } from 'react';
import { TaskItem } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

export const TaskListDialog = ({ tasks, onUpdateTasks, projectName }: TaskListDialogProps) => {
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CheckSquare className="h-4 w-4" />
          משימות
          {totalCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {completedCount}/{totalCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>משימות - {projectName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Add new task */}
          <div className="flex gap-2">
            <Input
              placeholder="הוסף משימה חדשה..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Task list */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                אין משימות עדיין
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 rounded-lg border bg-card"
                >
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <Input
                    value={task.text}
                    onChange={(e) => updateTaskText(task.id, e.target.value)}
                    className={cn(
                      "flex-1 border-none bg-transparent",
                      task.isCompleted && "line-through text-muted-foreground"
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="p-1 h-auto text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {totalCount > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              הושלמו {completedCount} מתוך {totalCount} משימות
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};