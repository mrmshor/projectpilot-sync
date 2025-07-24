import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    paid: number;
    unpaid: number;
    totalRevenue: number;
    pendingRevenue: number;
    completionRate: number;
    paymentRate: number;
  };
}

export const Dashboard = ({ tasks, stats }: DashboardProps) => {
  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const urgentTasks = tasks.filter(
    task => task.priority === 'high' && !task.isCompleted
  );

  const overdueTasks = tasks.filter(
    task => !task.isPaid && task.isCompleted
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך הכל פרויקטים</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} הושלמו
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">אחוז השלמה</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.inProgress} בתהליך
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך הכנסות</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₪{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.paymentRate}% אחוז תשלום
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות ממתינות</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₪{stats.pendingRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.unpaid} פרויקטים לא שולמו
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              פעילות אחרונה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/25 rounded-lg">
                    <div>
                      <p className="font-medium">{task.projectName}</p>
                      <p className="text-sm text-muted-foreground">{task.clientName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={task.isCompleted ? 'default' : 'secondary'}>
                        {task.isCompleted ? 'הושלם' : 'בתהליך'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.updatedAt).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  אין פעילות אחרונה
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <div className="space-y-4">
          {/* Urgent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                משימות דחופות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {urgentTasks.length > 0 ? (
                  urgentTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="font-medium text-sm">{task.projectName}</p>
                      <p className="text-xs text-muted-foreground">{task.clientName}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">אין משימות דחופות</p>
                )}
                {urgentTasks.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{urgentTasks.length - 3} משימות דחופות נוספות
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Pending */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <DollarSign className="h-5 w-5" />
                תשלומים ממתינים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {overdueTasks.length > 0 ? (
                  overdueTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="font-medium text-sm">{task.projectName}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.currency} {task.price.toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">כל התשלומים מעודכנים</p>
                )}
                {overdueTasks.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{overdueTasks.length - 3} תשלומים ממתינים נוספים
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                סטטיסטיקות מהירות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>פרויקטים פעילים:</span>
                  <span className="font-medium">{stats.inProgress}</span>
                </div>
                <div className="flex justify-between">
                  <span>לקוחות:</span>
                  <span className="font-medium">
                    {new Set(tasks.map(t => t.clientName)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ערך ממוצע לפרויקט:</span>
                  <span className="font-medium">
                    ₪{stats.total > 0 ? Math.round(stats.totalRevenue / stats.total).toLocaleString() : '0'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};