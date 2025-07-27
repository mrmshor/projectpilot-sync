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
    <Card className="w-80 h-[calc(100vh-8rem)] overflow-hidden mac-card">
      <CardHeader className="pb-3 border-b border-border/20">
        <CardTitle className="text-lg font-display gradient-text flex items-center gap-2">
          <User className="h-5 w-5" />
          לקוחות ופרויקטים
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <div className="overflow-y-auto h-full scrollbar-thin">
          <div className="space-y-4 p-4">
            {Object.entries(clientGroups).map(([clientName, clientTasks]) => (
              <div key={clientName} className="space-y-2">
                {/* Client Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-border/10">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-foreground truncate">{clientName}</h3>
                    <p className="text-xs text-muted-foreground">{clientTasks.length} פרויקטים</p>
                  </div>
                </div>

                {/* Client Projects */}
                <div className="space-y-2 pr-2">
                  {clientTasks.map((task) => (
                    <Button
                      key={task.id}
                      variant="ghost"
                      className="w-full h-auto p-3 justify-start hover:bg-muted/50 rounded-xl group transition-all duration-200"
                      onClick={() => handleProjectClick(task.id)}
                    >
                      <div className="w-full space-y-2">
                        {/* Project Header */}
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-gradient-subtle rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FolderOpen className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <div className="flex-1 text-right">
                            <h4 className="font-medium text-xs text-foreground truncate leading-tight">
                              {task.projectName}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {task.projectDescription}
                            </p>
                          </div>
                        </div>

                        {/* Project Status & Info */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs px-1.5 py-0.5", getPriorityColor(task.priority))}
                            >
                              {PRIORITY_LABELS[task.priority]}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {task.isCompleted ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <Clock className={cn("h-3 w-3", getStatusColor(task.workStatus))} />
                            )}
                            <span className={cn("text-xs", getStatusColor(task.workStatus))}>
                              {WORK_STATUS_LABELS[task.workStatus]}
                            </span>
                          </div>
                        </div>

                        {/* Price & Payment Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {task.price.toLocaleString()} {task.currency}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {task.isPaid ? (
                              <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-green-500/10 text-green-600 border-green-200">
                                שולם
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-red-500/10 text-red-600 border-red-200">
                                לא שולם
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Contact Info */}
                        {(task.clientPhone || task.clientEmail) && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {task.clientPhone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span className="truncate">{task.clientPhone}</span>
                              </div>
                            )}
                            {task.clientEmail && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{task.clientEmail}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
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