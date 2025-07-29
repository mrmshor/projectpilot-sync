import { useState } from 'react';
import { useQuickTasks } from '@/hooks/useQuickTasks';
import { useQuickTasksExport } from '@/hooks/useQuickTasksExport';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  CheckSquare,
  Square,
  FileText
} from 'lucide-react';

export const QuickTaskSidebar = () => {
  const {
    quickTasks,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask
  } = useQuickTasks();

  const { exportQuickTasksToNotes } = useQuickTasksExport();
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
    <div className="w-80 h-[calc(100vh-2rem)] bg-background border-l border-border flex flex-col sticky top-4 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">משימות מהירות</h2>
          {pendingTasks.length > 0 && (
            <Button 
              onClick={() => exportQuickTasksToNotes(quickTasks)}
              size="sm"
              variant="outline"
              className="gap-1 text-xs"
            >
              <FileText className="h-3 w-3" />
              שלח לפתקים
            </Button>
          )}
        </div>
        
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-8rem)]">
        
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-300/30 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Square className="h-4 w-4" />
                משימות ממתינות ({pendingTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 group p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleQuickTask(task.id)}
                    className="border-2 border-blue-400 data-[state=checked]:bg-blue-500"
                  />
                  <span className="flex-1 text-base font-medium text-foreground">{task.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuickTask(task.id)}
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
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
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-300/30 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckSquare className="h-4 w-4" />
                הושלמו ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 group p-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/5 transition-colors opacity-70">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleQuickTask(task.id)}
                    className="border-2 border-green-400 data-[state=checked]:bg-green-500"
                  />
                  <span className="flex-1 text-base font-medium line-through text-muted-foreground">{task.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuickTask(task.id)}
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
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