import { useState } from 'react';
import { useOptimizedTasks } from '@/hooks/useOptimizedTasks';
import { VirtualizedTaskList } from '@/components/optimized/VirtualizedTaskList';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { OptimizedDashboard } from '@/components/optimized/OptimizedDashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QuickTaskSidebar } from '@/components/QuickTaskSidebar';
import { ProjectNavigationSidebar } from '@/components/ProjectNavigationSidebar';
import { BackupManager } from '@/components/BackupManager';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { NotificationCenter } from '@/components/NotificationCenter';
import { ProjectTemplates } from '@/components/ProjectTemplates';
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
  FileText,
  BarChart3
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
    setPriorityFilter,
    restoreData
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

  const handleDataRestore = (data: { tasks: any[]; quickTasks: any[] }) => {
    restoreData(data.tasks);
  };

  const handleCreateFromTemplate = (template: any, customData: any) => {
    const taskItems = template.tasks.map((task: any, index: number) => ({
      id: `task_${Date.now()}_${index}`,
      text: task.text,
      isCompleted: task.isCompleted
    }));

    const newProject = {
      projectName: template.name,
      projectDescription: customData.customDescription || template.description,
      clientName: customData.clientName,
      price: customData.customPrice ? parseInt(customData.customPrice) : template.price,
      currency: template.currency,
      priority: template.priority,
      workStatus: 'not_started' as const,
      isPaid: false,
      isCompleted: false,
      tasks: taskItems
    };

    createTask(newProject);
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
    <div className="clean-layout" dir="rtl">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 clean-sidebar z-40">
        <ProjectNavigationSidebar 
          tasks={tasks} 
          onProjectSelect={handleProjectSelect}
        />
      </div>

      {/* Main Content */}
      <div className="mr-64 ml-80 flex-1 flex flex-col min-h-screen">
        {/* Clean Header */}
        <header className="modern-header">
          <div className="spacious-container">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="clean-btn clean-btn-secondary"
                >
                  {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h1 className="clean-title">מנהל משימות ופרויקטים</h1>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleExport} className="clean-btn clean-btn-secondary">
                  <Download className="h-4 w-4 ml-2" />
                  יצוא CSV
                </Button>
                <BackupManager 
                  tasks={tasks} 
                  onDataRestore={handleDataRestore}
                />
                <NotificationCenter tasks={tasks} />
                <ProjectTemplates onCreateFromTemplate={handleCreateFromTemplate} />
                <Button variant="outline" size="sm" onClick={() => window.open('/mobile', '_blank')} className="clean-btn clean-btn-secondary">
                  <Users className="h-4 w-4 ml-2" />
                  מובייל
                </Button>
                <CreateTaskDialog onCreateTask={handleCreateTask} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 spacious-container breathing-room">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="modern-tabs w-full max-w-md mx-auto">
              <TabsTrigger 
                value="dashboard" 
                className="modern-tab data-[state=active]:modern-tab-active"
              >
                <LayoutDashboard className="h-4 w-4 ml-2" />
                לוח בקרה
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="modern-tab data-[state=active]:modern-tab-active"
              >
                <Table className="h-4 w-4 ml-2" />
                פרויקטים
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="modern-tab data-[state=active]:modern-tab-active"
              >
                <BarChart3 className="h-4 w-4 ml-2" />
                אנליטיקה
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="fade-in">
              <OptimizedDashboard tasks={tasks} stats={stats} />
            </TabsContent>

            <TabsContent value="projects" className="fade-in">
              <div className="clean-card p-6">
                <VirtualizedTaskList
                  tasks={tasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={handleEditTask}
                  height={600}
                />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="fade-in">
              <AdvancedAnalytics tasks={tasks} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Right Sidebar */}
      {sidebarOpen && (
        <div className="fixed right-0 top-0 h-full w-80 clean-sidebar z-40">
          <QuickTaskSidebar />
        </div>
      )}
    </div>
  );
};

export default Index;
