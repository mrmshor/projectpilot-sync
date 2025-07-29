import { useState } from 'react';
import { useOptimizedTasks } from '@/hooks/useOptimizedTasks';
import { VirtualizedTaskList } from '@/components/optimized/VirtualizedTaskList';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { OptimizedDashboard } from '@/components/optimized/OptimizedDashboard';
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
  const { 
    tasks, 
    loading, 
    createTask, 
    updateTask, 
    deleteTask, 
    stats, 
    exportToCSV,
    searchTerm,
    setSearchTerm,
    priorityFilter,
    setPriorityFilter
  } = useOptimizedTasks();

  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTask, setEditingTask] = useState<any>(null);

  const handleCreateTask = (taskData: any) => {
    createTask(taskData);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
  };

  const handleExport = () => {
    exportToCSV();
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
    <div className="min-h-screen bg-background no-select performance-mode" dir="rtl">
      {/* Minimal Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-secondary border-r border-border">
        <ProjectNavigationSidebar 
          tasks={tasks} 
          onProjectSelect={handleProjectSelect}
        />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Ultra Clean Header */}
        <header className="bg-white border-b border-border">
          <div className="minimal-container">
            <div className="clean-flex h-12 justify-between">
              <div className="clean-flex">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2"
                >
                  {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-title">מנהל משימות</h1>
              </div>
              
              <div className="clean-flex">
                <Button variant="outline" size="sm" onClick={handleExport} className="minimal-button text-xs">
                  <Download className="h-3 w-3 ml-1" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Export to notes')} className="minimal-button text-xs">
                  <FileText className="h-3 w-3 ml-1" />
                  פתקים
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open('/mobile', '_blank')} className="minimal-button text-xs">
                  <Users className="h-3 w-3 ml-1" />
                  מובייל
                </Button>
                <CreateTaskDialog onCreateTask={handleCreateTask} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Clean Main Content */}
        <main className="flex-1 minimal-container py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="clean-grid grid-cols-2 w-full bg-secondary p-1 rounded">
              <TabsTrigger 
                value="dashboard" 
                className="minimal-button data-[state=active]:bg-white data-[state=active]:shadow-soft text-sm"
              >
                <LayoutDashboard className="h-4 w-4 ml-1" />
                לוח בקרה
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="minimal-button data-[state=active]:bg-white data-[state=active]:shadow-soft text-sm"
              >
                <Table className="h-4 w-4 ml-1" />
                פרויקטים
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <OptimizedDashboard tasks={tasks} stats={stats} />
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <div className="minimal-card minimal-padding">
                <VirtualizedTaskList
                  tasks={tasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={handleEditTask}
                  height={600}
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Clean Right Sidebar */}
      {sidebarOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-secondary border-l border-border">
          <QuickTaskSidebar />
        </div>
      )}
    </div>
  );
};

export default Index;
