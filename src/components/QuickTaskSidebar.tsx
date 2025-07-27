import { useState } from 'react';
import { useQuickTasks } from '@/hooks/useQuickTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  CheckSquare,
  Square
} from 'lucide-react';

export const QuickTaskSidebar = () => {
  const {
    quickTasks,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask
  } = useQuickTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addQuickTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const completedTasks = quickTasks.filter(task => task.completed);
  const pendingTasks = quickTasks.filter(task => !task.completed);

  return (
    <div className="w-80 h-full bg-background border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">משימות מהירות</h2>
        
        {/* Add Task */}
        <div className="flex gap-2">
          <Input
            placeholder="הוסף משימה חדשה..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-1"
          />
          <Button 
            onClick={handleAddTask} 
            size="sm"
            disabled={!newTaskTitle.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Square className="h-4 w-4" />
                משימות ממתינות ({pendingTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleQuickTask(task.id)}
                  />
                  <span className="flex-1 text-sm">{task.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuickTask(task.id)}
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <CheckSquare className="h-4 w-4" />
                הושלמו ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 group opacity-60">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleQuickTask(task.id)}
                  />
                  <span className="flex-1 text-sm line-through">{task.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuickTask(task.id)}
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};