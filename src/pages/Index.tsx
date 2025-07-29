import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
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
import { useNotesExport } from '@/hooks/useNotesExport';

const Index = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, getTaskStats, exportToCSV } = useTasks();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { toast } = useToast();
  const { exportToNotes, downloadAsFile } = useNotesExport();
  const stats = getTaskStats();

  const handleCreateTask = (taskData: Parameters<typeof createTask>[0]) => {
    createTask(taskData);
    toast({
      title: 'פרויקט נוצר',
      description: 'הפרויקט החדש נוצר בהצלחה.',
    });
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    deleteTask(id);
    toast({
      title: 'פרויקט נמחק',
      description: `"${task?.projectName}" נמחק.`,
      variant: 'destructive',
    });
  };

  const handleExport = () => {
    exportToCSV();
    toast({
      title: 'ייצוא הושלם',
      description: 'המשימות יוצאו לקובץ CSV.',
    });
  };

  const handleExportToNotes = () => {
    exportToNotes(tasks);
  };

  const handleDownloadFile = () => {
    downloadAsFile(tasks);
  };

  const handleProjectSelect = (projectId: string) => {
    setActiveTab('projects');
    // Scroll to the specific project in the table
    setTimeout(() => {
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
    }, 150);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען את הפרויקטים שלך...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Left Sidebar - Projects Navigation */}
      <div className="relative">
        <ProjectNavigationSidebar 
          tasks={tasks} 
          onProjectSelect={handleProjectSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Compact Header */}
        <header className="glass clean-border border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 hover-lift"
                >
                  {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg shadow-soft">
                  <Briefcase className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">מנהל משימות</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5 mac-button text-xs hover-lift">
                  <Download className="h-3.5 w-3.5" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportToNotes} className="gap-1.5 mac-button text-xs hover-lift">
                  <FileText className="h-3.5 w-3.5" />
                  פתקים
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open('/mobile', '_blank')} className="gap-1.5 mac-button text-xs hover-lift">
                  <Users className="h-3.5 w-3.5" />
                  מובייל
                </Button>
                <CreateTaskDialog onCreateTask={handleCreateTask} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Compact Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mac-card bg-muted/30 p-1 rounded-lg clean-border">
              <TabsTrigger 
                value="dashboard" 
                className="gap-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-soft dark:data-[state=active]:bg-white/10 transition-all duration-200 hover-lift text-sm font-medium"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                לוח בקרה
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="gap-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-soft dark:data-[state=active]:bg-white/10 transition-all duration-200 hover-lift text-sm font-medium"
              >
                <Table className="h-3.5 w-3.5" />
                פרויקטים
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-4">
              <div className="compact-spacing">
                <Dashboard tasks={tasks} stats={stats} />
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              <div className="mac-card compact-padding">
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

      {/* Compact Right Sidebar - Quick Tasks */}
      {sidebarOpen && (
        <div className="relative">
          <QuickTaskSidebar />
        </div>
      )}
    </div>
  );
};

export default Index;
