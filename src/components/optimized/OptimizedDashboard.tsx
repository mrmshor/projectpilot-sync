import React, { memo, useMemo } from 'react';
import { Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  BarChart3,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface OptimizedDashboardProps {
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

// Memoized stat card component
const StatCard = memo(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'text-primary' 
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color?: string;
}) => (
  <div className="minimal-card minimal-padding performance-mode">
    <div className="clean-flex justify-between mb-2">
      <span className="text-subtitle">{title}</span>
      <Icon className={`h-4 w-4 ${color}`} />
    </div>
    <div className="text-2xl font-semibold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground">{subtitle}</div>
  </div>
));

// Memoized recent activity item
const ActivityItem = memo(({ task }: { task: Task }) => (
  <div className="clean-flex justify-between p-3 bg-secondary/50 rounded">
    <div className="flex-1">
      <div className="text-body font-medium">{task.projectName}</div>
      <div className="text-subtitle">{task.clientName}</div>
    </div>
    <Badge variant={task.isCompleted ? 'default' : 'secondary'} className="text-xs">
      {task.isCompleted ? 'הושלם' : 'בתהליך'}
    </Badge>
  </div>
));

// Memoized urgent task item
const UrgentTaskItem = memo(({ task }: { task: Task }) => (
  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
    <div className="font-medium">{task.projectName}</div>
    <div className="text-muted-foreground">{task.clientName}</div>
  </div>
));

// Memoized payment pending item
const PaymentPendingItem = memo(({ task }: { task: Task }) => (
  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
    <div className="font-medium">{task.projectName}</div>
    <div className="text-muted-foreground">
      {task.currency} {(task.price / 1000).toFixed(0)}K
    </div>
  </div>
));

export const OptimizedDashboard = memo(({ tasks, stats }: OptimizedDashboardProps) => {
  // Memoized data calculations
  const { recentTasks, urgentTasks, overdueTasks } = useMemo(() => {
    const recent = tasks
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
    
    const urgent = tasks.filter(task => task.priority === 'high' && !task.isCompleted);
    const overdue = tasks.filter(task => !task.isPaid && task.isCompleted);
    
    return { recentTasks: recent, urgentTasks: urgent, overdueTasks: overdue };
  }, [tasks]);

  // Memoized revenue formatting
  const formattedRevenue = useMemo(() => ({
    total: (stats.totalRevenue / 1000).toFixed(0) + 'K',
    pending: (stats.pendingRevenue / 1000).toFixed(0) + 'K'
  }), [stats.totalRevenue, stats.pendingRevenue]);

  return (
    <div className="minimal-spacing performance-mode" dir="rtl">
      {/* Stats Grid - Ultra Compact */}
      <div className="clean-grid grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="פרויקטים"
          value={stats.total}
          subtitle={`${stats.completed} הושלמו`}
          icon={BarChart3}
        />
        
        <StatCard
          title="השלמה"
          value={`${stats.completionRate}%`}
          subtitle={`${stats.inProgress} בתהליך`}
          icon={CheckCircle}
          color="text-green-600"
        />
        
        <StatCard
          title="הכנסות"
          value={`₪${formattedRevenue.total}`}
          subtitle={`${stats.paymentRate}% שולם`}
          icon={DollarSign}
          color="text-blue-600"
        />
        
        <StatCard
          title="ממתין"
          value={`₪${formattedRevenue.pending}`}
          subtitle={`${stats.unpaid} לא שולמו`}
          icon={Clock}
          color="text-yellow-600"
        />
      </div>

      {/* Activity & Alerts Grid */}
      <div className="clean-grid grid-cols-1 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="minimal-card minimal-padding">
          <div className="clean-flex mb-3">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-title">פעילות אחרונה</span>
          </div>
          <div className="minimal-spacing">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <ActivityItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-subtitle text-center py-4">אין פעילות</div>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="minimal-spacing">
          {/* Urgent Tasks */}
          <div className="minimal-card minimal-padding">
            <div className="clean-flex mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold">דחוף ({urgentTasks.length})</span>
            </div>
            {urgentTasks.length > 0 ? (
              <div className="minimal-spacing">
                {urgentTasks.slice(0, 2).map((task) => (
                  <UrgentTaskItem key={task.id} task={task} />
                ))}
                {urgentTasks.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{urgentTasks.length - 2} נוספים
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">ללא משימות דחופות</div>
            )}
          </div>

          {/* Payment Pending */}
          <div className="minimal-card minimal-padding">
            <div className="clean-flex mb-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold">תשלומים ({overdueTasks.length})</span>
            </div>
            {overdueTasks.length > 0 ? (
              <div className="minimal-spacing">
                {overdueTasks.slice(0, 2).map((task) => (
                  <PaymentPendingItem key={task.id} task={task} />
                ))}
                {overdueTasks.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{overdueTasks.length - 2} נוספים
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">הכל מעודכן</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';