import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useQuickTasks } from '@/hooks/useQuickTasks';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  List,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Briefcase,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const Mobile = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, getTaskStats } = useTasks();
  const { quickTasks, addQuickTask, toggleQuickTask, deleteQuickTask } = useQuickTasks();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [newQuickTask, setNewQuickTask] = useState('');
  
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

  const handleAddQuickTask = () => {
    if (newQuickTask.trim()) {
      addQuickTask(newQuickTask.trim());
      setNewQuickTask('');
      toast({
        title: 'משימה נוספה',
        description: 'המשימה המהירה נוספה בהצלחה.',
      });
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingQuickTasks = quickTasks.filter(task => !task.completed);
  const completedQuickTasks = quickTasks.filter(task => task.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface" dir="rtl">
      {/* Header */}
      <header className="glass border-b border-border/30 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl shadow-soft">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">מנהל משימות</h1>
                <p className="text-xs text-muted-foreground">גרסת מובייל</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CreateTaskDialog onCreateTask={handleCreateTask} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="px-4 py-2 bg-background/50 backdrop-blur-sm border-b border-border/30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/20 p-1 rounded-xl">
            <TabsTrigger value="dashboard" className="text-xs">
              <LayoutDashboard className="h-4 w-4 mb-1" />
              לוח בקרה
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs">
              <List className="h-4 w-4 mb-1" />
              פרויקטים
            </TabsTrigger>
            <TabsTrigger value="quick" className="text-xs">
              <Zap className="h-4 w-4 mb-1" />
              מהירות
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-4 space-y-4">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="mac-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">פרויקטים</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </Card>

              <Card className="mac-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">הושלמו</p>
                    <p className="text-xl font-bold">{stats.completed}</p>
                  </div>
                </div>
              </Card>

              <Card className="mac-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">הכנסות</p>
                    <p className="text-lg font-bold">₪{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="mac-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">שיעור השלמה</p>
                    <p className="text-lg font-bold">{stats.completionRate}%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="mac-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  פרויקטים אחרונים
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.projectName}</p>
                      <p className="text-xs text-muted-foreground">{task.clientName}</p>
                    </div>
                    <div className="text-left">
                      <Badge variant={task.isCompleted ? 'default' : task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {task.isCompleted ? 'הושלם' : task.priority === 'high' ? 'דחוף' : 'רגיל'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש פרויקטים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 mac-input"
              />
            </div>

            {/* Projects List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="mac-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{task.projectName}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{task.clientName}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={task.isCompleted ? 'default' : 'secondary'} className="text-xs">
                            {task.isCompleted ? 'הושלם' : 'בתהליך'}
                          </Badge>
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                            {task.priority === 'high' ? 'דחוף' : task.priority === 'medium' ? 'בינוני' : 'נמוך'}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        {format(new Date(task.createdAt), 'dd/MM/yyyy', { locale: he })}
                      </span>
                      <span className="font-medium text-info">
                        ₪{task.price ? task.price.toLocaleString() : '0'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quick Tasks Tab */}
          <TabsContent value="quick" className="mt-4 space-y-4">
            {/* Add Quick Task */}
            <Card className="mac-card">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="הוסף משימה מהירה..."
                    value={newQuickTask}
                    onChange={(e) => setNewQuickTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddQuickTask()}
                    className="flex-1 mac-input"
                  />
                  <Button onClick={handleAddQuickTask} size="sm" className="px-3">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            {pendingQuickTasks.length > 0 && (
              <Card className="mac-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    משימות ממתינות ({pendingQuickTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pendingQuickTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQuickTask(task.id)}
                        className="p-1 h-6 w-6"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <span className="flex-1 text-sm">{task.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuickTask(task.id)}
                        className="p-1 h-6 w-6 text-destructive"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Completed Tasks */}
            {completedQuickTasks.length > 0 && (
              <Card className="mac-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    הושלמו ({completedQuickTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {completedQuickTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2 bg-success/5 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQuickTask(task.id)}
                        className="p-1 h-6 w-6 text-success"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <span className="flex-1 text-sm line-through text-muted-foreground">{task.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuickTask(task.id)}
                        className="p-1 h-6 w-6 text-destructive"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Mobile;