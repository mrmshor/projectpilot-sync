import { useState } from 'react';
import { useQuickTasks } from '@/hooks/useQuickTasks';
import { useQuickTasksExport } from '@/hooks/useQuickTasksExport';
import { useOptimizedTasks } from '@/hooks/useOptimizedTasks';
import { TimeTracker } from '@/components/TimeTracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  CheckSquare,
  Square,
  FileText,
  Timer,
  Zap
} from 'lucide-react';

export const QuickTaskSidebar = () => {
  const {
    quickTasks,
    addQuickTask,
    toggleQuickTask,
    deleteQuickTask
  } = useQuickTasks();

  const { tasks } = useOptimizedTasks();
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
      {/* Header with Tabs */}
      <div className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <h2 className="text-lg font-semibold mb-4">כלים מהירים</h2>
        
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks" className="text-xs">
              <Zap className="h-3 w-3 ml-1" />
              משימות
            </TabsTrigger>
            <TabsTrigger value="timer" className="text-xs">
              <Timer className="h-3 w-3 ml-1" />
              זמן
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="tasks" className="mt-0 space-y-0">
              {/* Add new task */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="הוסף משימה מהירה..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  className="flex-1"
                />
                <Button onClick={handleAddTask} size="sm" disabled={!newTaskTitle.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {pendingTasks.length > 0 && (
                <Button 
                  onClick={() => exportQuickTasksToNotes(quickTasks)}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs w-full"
                >
                  <FileText className="h-3 w-3" />
                  יצא לפתקים
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="timer" className="mt-0">
              <div className="text-sm text-muted-foreground">
                מעקב זמן עבור פרויקטים
              </div>
            </TabsContent>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 h-[calc(100vh-16rem)]">
            <TabsContent value="tasks" className="mt-0 space-y-4">
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

              {/* Empty state */}
              {quickTasks.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Square className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">אין משימות מהירות</p>
                  <p className="text-xs">הוסף משימה כדי להתחיל</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="timer" className="mt-0">
              <TimeTracker tasks={tasks} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};