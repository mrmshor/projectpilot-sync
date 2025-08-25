import React from 'react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Bell, 
  BellRing, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Info, 
  Trophy,
  Check,
  CheckCheck,
  Trash2,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface NotificationCenterProps {
  tasks: Task[];
}

export const NotificationCenter = ({ tasks }: NotificationCenterProps) => {
  const {
    notifications,
    unreadCount,
    urgentCount,
    showNotifications,
    setShowNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications(tasks);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'milestone':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return 'border-r-red-500 bg-red-50 dark:bg-red-950';
      case 'payment':
        return 'border-r-green-500 bg-green-50 dark:bg-green-950';
      case 'overdue':
        return 'border-r-orange-500 bg-orange-50 dark:bg-orange-950';
      case 'milestone':
        return 'border-r-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      default:
        return 'border-r-blue-500 bg-blue-50 dark:bg-blue-950';
    }
  };

  const sortedNotifications = notifications.sort((a, b) => {
    // Sort by read status (unread first), then by priority, then by timestamp
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Popover open={showNotifications} onOpenChange={setShowNotifications}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative apple-button"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0" 
        align="end" 
        dir="rtl"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">התראות</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-3 w-3 ml-1" />
                סמן הכל כנקרא
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">אין התראות חדשות</p>
            </div>
          ) : (
            <div className="space-y-0">
              {sortedNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`
                      relative p-4 border-r-4 hover:bg-muted/50 transition-colors cursor-pointer
                      ${getNotificationColor(notification.type)}
                      ${notification.isRead ? 'opacity-60' : ''}
                    `}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm leading-tight">
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {format(notification.timestamp, 'dd/MM HH:mm', { locale: he })}
                          </span>
                          
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-6 text-xs"
                            >
                              <Check className="h-3 w-3 ml-1" />
                              סמן כנקרא
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {!notification.isRead && (
                      <div className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {urgentCount > 0 && (
          <div className="p-3 border-t bg-red-50 dark:bg-red-950">
            <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
              <AlertTriangle className="h-4 w-4" />
              <span>יש לך {urgentCount} התראות דחופות</span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};