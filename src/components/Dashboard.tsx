import React from 'react';
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

export const Dashboard = React.memo(({ tasks, stats }: DashboardProps) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="mac-card hover-lift p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-display font-medium text-muted-foreground">סך הכל פרויקטים</h3>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-display font-semibold text-foreground">{stats.total}</div>
            <p className="text-sm text-muted-foreground">
              {stats.completed} הושלמו
            </p>
          </div>
        </div>

        <div className="mac-card hover-lift p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-display font-medium text-muted-foreground">אחוז השלמה</h3>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-display font-semibold text-foreground">{stats.completionRate}%</div>
            <p className="text-sm text-muted-foreground">
              {stats.inProgress} בתהליך
            </p>
          </div>
        </div>

        <div className="mac-card hover-lift p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-display font-medium text-muted-foreground">סך הכנסות</h3>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-display font-semibold text-foreground">
              ₪{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.paymentRate}% אחוז תשלום
            </p>
          </div>
        </div>

        <div className="mac-card hover-lift p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-display font-medium text-muted-foreground">הכנסות ממתינות</h3>
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-display font-semibold text-foreground">
              ₪{stats.pendingRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.unpaid} פרויקטים לא שולמו
            </p>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 mac-card p-6">
          <div className="mb-6">
            <h2 className="font-display text-lg font-semibold flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              פעילות אחרונה
            </h2>
          </div>
          <div>
            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gradient-muted rounded-xl border border-border/30 hover-lift">
                    <div>
                      <p className="font-display font-medium text-foreground">{task.projectName}</p>
                      <p className="text-sm text-muted-foreground font-body">{task.clientName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={task.isCompleted ? 'default' : 'secondary'} className="shadow-soft">
                        {task.isCompleted ? 'הושלם' : 'בתהליך'}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
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
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="space-y-4">
          {/* Urgent Tasks */}
          <div className="mac-card p-6">
            <div className="mb-4">
              <h3 className="font-display text-base font-semibold flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                משימות דחופות
              </h3>
            </div>
            <div>
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
            </div>
          </div>

          {/* Payment Pending */}
          <div className="mac-card p-6">
            <div className="mb-4">
              <h3 className="font-display text-base font-semibold flex items-center gap-2 text-warning">
                <DollarSign className="h-5 w-5" />
                תשלומים ממתינים
              </h3>
            </div>
            <div>
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
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mac-card p-6">
            <div className="mb-4">
              <h3 className="font-display text-base font-semibold flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                סטטיסטיקות מהירות
              </h3>
            </div>
            <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});