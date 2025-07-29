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
    <div className="compact-spacing" dir="rtl">
      {/* Compact Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="mac-card hover-lift compact-padding">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-muted-foreground">פרויקטים</h3>
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} הושלמו
            </p>
          </div>
        </div>

        <div className="mac-card hover-lift compact-padding">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-muted-foreground">השלמה</h3>
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.inProgress} בתהליך
            </p>
          </div>
        </div>

        <div className="mac-card hover-lift compact-padding">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-muted-foreground">הכנסות</h3>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">
              ₪{(stats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.paymentRate}% שולם
            </p>
          </div>
        </div>

        <div className="mac-card hover-lift compact-padding">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-muted-foreground">ממתין</h3>
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">
              ₪{(stats.pendingRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.unpaid} לא שולמו
            </p>
          </div>
        </div>
      </div>

      {/* Compact Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Compact Recent Activity */}
        <div className="mac-card compact-padding">
          <div className="mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              פעילות אחרונה
            </h2>
          </div>
          <div className="compact-spacing">
            {recentTasks.length > 0 ? (
              recentTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg hover-lift">
                  <div>
                    <p className="font-medium text-sm">{task.projectName}</p>
                    <p className="text-xs text-muted-foreground">{task.clientName}</p>
                  </div>
                  <Badge variant={task.isCompleted ? 'default' : 'secondary'} className="text-xs">
                    {task.isCompleted ? 'הושלם' : 'בתהליך'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-2">
                אין פעילות
              </p>
            )}
          </div>
        </div>

        {/* Compact Alerts & Stats */}
        <div className="compact-spacing">
          {/* Compact Urgent Tasks */}
          <div className="mac-card compact-padding">
            <div className="mb-2">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                דחוף ({urgentTasks.length})
              </h3>
            </div>
            <div>
              {urgentTasks.length > 0 ? (
                <div className="compact-spacing">
                  {urgentTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="p-2 bg-destructive/10 rounded text-xs">
                      <p className="font-medium">{task.projectName}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-xs">ללא משימות דחופות</p>
              )}
            </div>
          </div>

          {/* Compact Payment Status */}
          <div className="mac-card compact-padding">
            <div className="mb-2">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-warning">
                <DollarSign className="h-4 w-4" />
                תשלומים ({overdueTasks.length})
              </h3>
            </div>
            <div>
              {overdueTasks.length > 0 ? (
                <div className="compact-spacing">
                  {overdueTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="p-2 bg-warning/10 rounded text-xs">
                      <p className="font-medium">{task.projectName}</p>
                      <p className="text-muted-foreground">
                        {task.currency} {(task.price / 1000).toFixed(0)}K
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-xs">הכל מעודכן</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};