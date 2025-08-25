import React, { useMemo } from 'react';
import { Task, WORK_STATUS_LABELS, PRIORITY_LABELS } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users,
  Calendar,
  Target,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { he } from 'date-fns/locale';

interface AdvancedAnalyticsProps {
  tasks: Task[];
}

export const AdvancedAnalytics = ({ tasks }: AdvancedAnalyticsProps) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const lastWeek = subDays(now, 7);
    const lastMonth = subDays(now, 30);
    
    // Revenue Analytics
    const totalRevenue = tasks.filter(t => t.isPaid).reduce((sum, t) => sum + t.price, 0);
    const pendingRevenue = tasks.filter(t => !t.isPaid).reduce((sum, t) => sum + t.price, 0);
    const avgProjectValue = tasks.length > 0 ? (totalRevenue + pendingRevenue) / tasks.length : 0;
    
    // Time Analytics
    const completedThisWeek = tasks.filter(t => 
      t.isCompleted && new Date(t.updatedAt) >= lastWeek
    ).length;
    const completedThisMonth = tasks.filter(t => 
      t.isCompleted && new Date(t.updatedAt) >= lastMonth
    ).length;
    
    // Status Distribution
    const statusDistribution = Object.keys(WORK_STATUS_LABELS).map(status => ({
      name: WORK_STATUS_LABELS[status as keyof typeof WORK_STATUS_LABELS],
      value: tasks.filter(t => t.workStatus === status).length,
      color: getStatusColor(status)
    }));
    
    // Priority Distribution
    const priorityDistribution = Object.keys(PRIORITY_LABELS).map(priority => ({
      name: PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS],
      value: tasks.filter(t => t.priority === priority).length,
      color: getPriorityColor(priority)
    }));
    
    // Weekly Progress
    const weekDays = eachDayOfInterval({
      start: startOfWeek(now, { weekStartsOn: 0 }),
      end: endOfWeek(now, { weekStartsOn: 0 })
    });
    
    const weeklyProgress = weekDays.map(day => ({
      day: format(day, 'EEE', { locale: he }),
      completed: tasks.filter(t => 
        t.isCompleted && 
        format(new Date(t.updatedAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length,
      created: tasks.filter(t => 
        format(new Date(t.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length
    }));
    
    // Client Analytics
    const clientStats = tasks.reduce((acc, task) => {
      if (!acc[task.clientName]) {
        acc[task.clientName] = {
          projects: 0,
          revenue: 0,
          completed: 0
        };
      }
      acc[task.clientName].projects += 1;
      acc[task.clientName].revenue += task.isPaid ? task.price : 0;
      if (task.isCompleted) acc[task.clientName].completed += 1;
      return acc;
    }, {} as Record<string, { projects: number; revenue: number; completed: number }>);
    
    const topClients = Object.entries(clientStats)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([name, stats]) => ({
        name,
        ...stats,
        completionRate: stats.projects > 0 ? Math.round((stats.completed / stats.projects) * 100) : 0
      }));
    
    // Performance Metrics
    const avgCompletionTime = tasks.filter(t => t.isCompleted).reduce((acc, task) => {
      const days = Math.ceil((new Date(task.updatedAt).getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return acc + days;
    }, 0) / tasks.filter(t => t.isCompleted).length || 0;
    
    return {
      totalRevenue,
      pendingRevenue,
      avgProjectValue,
      completedThisWeek,
      completedThisMonth,
      statusDistribution,
      priorityDistribution,
      weeklyProgress,
      topClients,
      avgCompletionTime
    };
  }, [tasks]);

  const getStatusColor = (status: string) => {
    const colors = {
      'not_started': '#64748b',
      'in_progress': '#3b82f6',
      'review': '#f59e0b',
      'completed': '#10b981',
      'on_hold': '#ef4444'
    };
    return colors[status as keyof typeof colors] || '#64748b';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': '#10b981',
      'medium': '#f59e0b',
      'high': '#ef4444'
    };
    return colors[priority as keyof typeof colors] || '#64748b';
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">הכנסות שולמו</p>
                <p className="text-2xl font-bold text-green-600">
                  ${analytics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">הכנסות ממתינות</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${analytics.pendingRevenue.toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">הושלמו השבוע</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.completedThisWeek}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">זמן השלמה ממוצע</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(analytics.avgCompletionTime)} ימים
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="charts">תרשימים</TabsTrigger>
          <TabsTrigger value="clients">לקוחות</TabsTrigger>
          <TabsTrigger value="trends">מגמות</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-lg">התפלגות סטטוס פרויקטים</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {analytics.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-lg">התפלגות עדיפות</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.priorityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress */}
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-lg">התקדמות שבועית</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" name="הושלמו" />
                  <Area type="monotone" dataKey="created" stackId="2" stroke="#3b82f6" fill="#3b82f6" name="נוצרו" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                לקוחות מובילים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topClients.map((client, index) => (
                  <div key={client.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {client.projects} פרויקטים
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-green-600">
                        ${client.revenue.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={client.completionRate} className="w-16" />
                        <span className="text-xs text-muted-foreground">
                          {client.completionRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="apple-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">השלמות החודש</span>
                </div>
                <p className="text-2xl font-bold">{analytics.completedThisMonth}</p>
                <p className="text-xs text-muted-foreground">
                  +{analytics.completedThisWeek} השבוע
                </p>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">ערך פרויקט ממוצע</span>
                </div>
                <p className="text-2xl font-bold">
                  ${Math.round(analytics.avgProjectValue).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  כולל פרויקטים ממתינים
                </p>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">פרויקטים דחופים</span>
                </div>
                <p className="text-2xl font-bold">
                  {tasks.filter(t => t.priority === 'high' && !t.isCompleted).length}
                </p>
                <p className="text-xs text-muted-foreground">
                  עדיפות גבוהה לא הושלמו
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};