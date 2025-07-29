import { useState, useCallback, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasksOptimized';
import { useMemoryManager, useMemoryMonitor } from '@/hooks/useMemoryManager';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useAppKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { TaskTable } from '@/components/TaskTable';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { Dashboard } from '@/components/Dashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QuickTaskSidebar } from '@/components/QuickTaskSidebar';
import { ProjectNavigationSidebar } from '@/components/ProjectNavigationSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Table, 
  Download, 
  Briefcase,
  Users,
  DollarSign,
  PanelLeftOpen,
  PanelLeftClose,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuickTasksExport } from '@/hooks/useQuickTasksExport';

const Index = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, getTaskStats, exportToCSV } = useTasks();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Memory management
  const { safeSetTimeout } = useMemoryManager();
  useMemoryMonitor('Index');
  
  const { toast } = useToast();
  const { exportQuickTasksToNotes } = useQuickTasksExport();
  const stats = useMemo(() => getTaskStats, [getTaskStats]);

  // Define handlers first
  const handleExport = useCallback(() => {
    exportToCSV();
    toast({
      title: 'ייצוא הושלם',
      description: 'המשימות יוצאו לקובץ CSV.',
    });
  }, [exportToCSV, toast]);

  // Auto-save functionality
  const { saveNow } = useAutoSave({
    enabled: true,
    interval: 30000, // 30 seconds
    onSave: () => {
      // Trigger manual save if needed
      console.log('Auto-save triggered');
    },
    data: tasks
  });

  // Keyboard shortcuts
  useAppKeyboardShortcuts({
    onSave: saveNow,
    onExport: handleExport,
    onSearch: () => {
      // Focus search input if available
      const searchInput = document.querySelector('input[placeholder*="חפש"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  });
  
  const handleCreateTask = useCallback((taskData: Parameters<typeof createTask>[0]) => {
    createTask(taskData);
    toast({
      title: 'פרויקט נוצר',
      description: 'הפרויקט החדש נוצר בהצלחה.',
    });
  }, [createTask, toast]);

  const handleDeleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    deleteTask(id);
    toast({
      title: 'פרויקט נמחק',
      description: `"${task?.projectName}" נמחק.`,
      variant: 'destructive',
    });
  }, [tasks, deleteTask, toast]);

  const handleExportToNotes = useCallback(() => {
    // ממיר את המשימות הרגילות לפורמט QuickTask ושולח לפתקים
    const quickTasksFormat = tasks.map(task => ({
      id: task.id,
      title: `${task.projectName} - ${task.clientName}`,
      completed: task.isCompleted,
      createdAt: new Date()
    }));
    exportQuickTasksToNotes(quickTasksFormat);
  }, [tasks, exportQuickTasksToNotes]);

  const handleProjectSelect = useCallback((projectId: string) => {
    setActiveTab('projects');
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
      if (projectElement) {
        projectElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        // Add a brief highlight effect
        projectElement.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
        setTimeout(() => {
          projectElement.classList.remove('ring-2', 'ring-primary', 'ring-opacity-50');
        }, 2000);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background gpu-acceleration" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground animate-pulse">טוען את הפרויקטים שלך...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-surface flex" dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-info/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Left Sidebar - Projects Navigation */}
      <div className="relative">
        <ProjectNavigationSidebar 
          tasks={tasks} 
          onProjectSelect={handleProjectSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="glass border-b border-border/30 sticky top-0 z-40 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/2 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4 group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2"
                >
                  {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-2xl shadow-soft group-hover:shadow-medium transition-all duration-300 hover-lift">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display gradient-text">מנהל המשימות המקצועי</h1>
                  <p className="text-sm text-muted-foreground font-body">ניהול פרויקטים מקצועי ומתקדם</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleExport} className="gap-2 mac-button hover-lift press-scale">
                  <Download className="h-4 w-4" />
                  ייצא CSV
                </Button>
                <Button variant="outline" onClick={handleExportToNotes} className="gap-2 mac-button hover-lift press-scale">
                  <FileText className="h-4 w-4" />
                  שלח לפתקים
                </Button>
                <Button variant="outline" onClick={() => window.open('/mobile', '_blank')} className="gap-2 mac-button hover-lift press-scale">
                  <Users className="h-4 w-4" />
                  גרסת מובייל
                </Button>
                <CreateTaskDialog onCreateTask={handleCreateTask} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
            <TabsList className="grid w-full grid-cols-2 mac-card bg-muted/20 backdrop-blur-sm p-1.5 rounded-2xl shadow-soft">
              <TabsTrigger 
                value="dashboard" 
                className="gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft dark:data-[state=active]:bg-white/10 transition-all duration-300 hover-lift press-scale font-medium"
              >
                <LayoutDashboard className="h-4 w-4" />
                לוח בקרה
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-soft dark:data-[state=active]:bg-white/10 transition-all duration-300 hover-lift press-scale font-medium"
              >
                <Table className="h-4 w-4" />
                פרויקטים
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-8 animate-slide-up">
              <div className="space-y-6">
                <Dashboard tasks={tasks} stats={stats} />
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-8 animate-slide-up">
              <div className="mac-card p-6">
                <TaskTable 
                  tasks={tasks} 
                  onUpdateTask={updateTask} 
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Right Sidebar - Quick Tasks */}
      {sidebarOpen && (
        <div className="relative">
          <QuickTaskSidebar />
        </div>
      )}
      </div>
      <PerformanceMonitor />
    </ErrorBoundary>
  );
};

export default Index;
