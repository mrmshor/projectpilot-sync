import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task, WORK_STATUS_LABELS, PRIORITY_LABELS } from '@/types/task';
import { 
  FolderOpen, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  DollarSign,
  Phone,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectNavigationSidebarProps {
  tasks: Task[];
  onProjectSelect: (projectId: string) => void;
}

export function ProjectNavigationSidebar({ tasks, onProjectSelect }: ProjectNavigationSidebarProps) {
  // Group tasks by client
  const clientGroups = tasks.reduce((acc, task) => {
    const clientName = task.clientName || 'ללא שם לקוח';
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-800';
    }
  };

  const getStatusColor = (workStatus: Task['workStatus']) => {
    switch (workStatus) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'review':
        return 'text-purple-600 dark:text-purple-400';
      case 'on_hold':
        return 'text-orange-600 dark:text-orange-400';
      case 'not_started':
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleProjectClick = (projectId: string) => {
    onProjectSelect(projectId);
    // Scroll to projects tab and switch to it
    const projectsTab = document.querySelector('[data-state="inactive"][value="projects"]') as HTMLElement;
    if (projectsTab) {
      projectsTab.click();
    }
  };

  return (
    <Card className="w-64 h-[calc(100vh-2rem)] overflow-hidden mac-card sticky top-4">
      <CardHeader className="pb-3 border-b border-border/20 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <CardTitle className="text-lg font-display gradient-text flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          פרויקטים
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)] relative">
        <div className="overflow-y-auto h-full scrollbar-thin absolute inset-0">
          <div className="space-y-2 p-4">
            {tasks.map((task) => (
              <Button
                key={task.id}
                variant="ghost"
                className="w-full h-auto p-3 justify-start hover:bg-muted/50 rounded-xl group transition-all duration-200"
                onClick={() => handleProjectClick(task.id)}
              >
                <div className="w-full flex items-center justify-between">
                  {/* Project Name */}
                  <div className="flex-1 text-right">
                    <h4 className="font-medium text-sm text-foreground truncate leading-tight">
                      {task.projectName}
                    </h4>
                  </div>

                  {/* Priority Badge */}
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs px-2 py-1 mr-2", getPriorityColor(task.priority))}
                  >
                    {PRIORITY_LABELS[task.priority]}
                  </Badge>
                </div>
              </Button>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-sm">אין פרויקטים עדיין</p>
                <p className="text-muted-foreground text-xs mt-1">צור פרויקט חדש כדי להתחיל</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}