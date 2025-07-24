import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskTable } from '@/components/TaskTable';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { Dashboard } from '@/components/Dashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Table, 
  Download, 
  Briefcase,
  Users,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, getTaskStats, exportToCSV } = useTasks();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { toast } = useToast();
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
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="glass border-b border-border/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-[var(--shadow-soft)]">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">מנהל המשימות המקצועי</h1>
                <p className="text-sm text-muted-foreground">ניהול פרויקטים מקצועי</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleExport} className="gap-2 mac-button">
                <Download className="h-4 w-4" />
                ייצא CSV
              </Button>
              <CreateTaskDialog onCreateTask={handleCreateTask} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mac-card bg-muted/30 backdrop-blur-sm p-1 rounded-2xl">
            <TabsTrigger value="dashboard" className="gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-[var(--shadow-soft)] dark:data-[state=active]:bg-white/10 transition-all duration-200">
              <LayoutDashboard className="h-4 w-4" />
              לוח בקרה
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-[var(--shadow-soft)] dark:data-[state=active]:bg-white/10 transition-all duration-200">
              <Table className="h-4 w-4" />
              פרויקטים
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard tasks={tasks} stats={stats} />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <TaskTable 
              tasks={tasks} 
              onUpdateTask={updateTask} 
              onDeleteTask={handleDeleteTask}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
