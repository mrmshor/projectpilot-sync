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
    <div className="h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-l border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="clean-subtitle mb-4">כלים מהירים</h2>
        
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="modern-tabs w-full">
            <TabsTrigger value="tasks" className="modern-tab data-[state=active]:modern-tab-active text-xs">
              <Zap className="h-3 w-3 ml-1" />
              משימות
            </TabsTrigger>
            <TabsTrigger value="timer" className="modern-tab data-[state=active]:modern-tab-active text-xs">
              <Timer className="h-3 w-3 ml-1" />
              זמן
            </TabsTrigger>
          </TabsList>
          
          {/* Content */}
          <div className="mt-6 space-y-4">
            <TabsContent value="tasks" className="mt-0 space-y-4">
              {/* Add new task */}
              <div className="flex gap-2">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="הוסף משימה מהירה..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  className="clean-input flex-1"
                />
                <Button onClick={handleAddTask} size="sm" disabled={!newTaskTitle.trim()} className="clean-btn clean-btn-primary">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {pendingTasks.length > 0 && (
                <Button 
                  onClick={() => exportQuickTasksToNotes(quickTasks)}
                  size="sm"
                  variant="outline"
                  className="clean-btn clean-btn-secondary w-full text-xs"
                >
                  <FileText className="h-3 w-3 ml-1" />
                  יצא לפתקים
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="timer" className="mt-0">
              <div className="text-sm clean-text">
                מעקב זמן עבור פרויקטים
              </div>
            </TabsContent>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto mt-6 space-y-4 max-h-[calc(100vh-20rem)]">
            <TabsContent value="tasks" className="mt-0 space-y-4">
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <Card className="clean-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Square className="h-4 w-4" />
                      ממתין ({pendingTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="tight-spacing">
                    {pendingTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleQuickTask(task.id)}
                          className="border-2 border-blue-400 data-[state=checked]:bg-blue-500"
                        />
                        <span className="flex-1 text-sm font-medium">{task.title}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuickTask(task.id)}
                          className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
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
                <Card className="clean-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckSquare className="h-4 w-4" />
                      הושלם ({completedTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="tight-spacing">
                    {completedTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors opacity-70">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleQuickTask(task.id)}
                          className="border-2 border-green-400 data-[state=checked]:bg-green-500"
                        />
                        <span className="flex-1 text-sm font-medium line-through clean-text">{task.title}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuickTask(task.id)}
                          className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
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
                <div className="text-center clean-text py-12">
                  <Square className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">אין משימות מהירות</p>
                  <p className="text-xs mt-1">הוסף משימה כדי להתחיל</p>
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