import { useState, useEffect, useMemo } from 'react';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'urgent' | 'payment' | 'overdue' | 'milestone' | 'info';
  title: string;
  message: string;
  taskId?: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const useNotifications = (tasks: Task[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  // Generate notifications based on tasks
  const generatedNotifications = useMemo(() => {
    const now = new Date();
    const newNotifications: Notification[] = [];

    // High priority incomplete tasks
    const urgentTasks = tasks.filter(
      task => task.priority === 'high' && !task.isCompleted
    );
    
    if (urgentTasks.length > 0) {
      newNotifications.push({
        id: `urgent-${Date.now()}`,
        type: 'urgent',
        title: 'משימות דחופות',
        message: `יש לך ${urgentTasks.length} משימות בעדיפות גבוהה שטרם הושלמו`,
        timestamp: now,
        isRead: false,
        priority: 'high'
      });
    }

    // Unpaid completed projects
    const unpaidCompleted = tasks.filter(
      task => task.isCompleted && !task.isPaid
    );
    
    if (unpaidCompleted.length > 0) {
      const totalAmount = unpaidCompleted.reduce((sum, task) => sum + task.price, 0);
      newNotifications.push({
        id: `payment-${Date.now()}`,
        type: 'payment',
        title: 'תשלומים ממתינים',
        message: `${unpaidCompleted.length} פרויקטים הושלמו וממתינים לתשלום (${totalAmount.toLocaleString()} $)`,
        timestamp: now,
        isRead: false,
        priority: 'medium'
      });
    }

    // Projects in review for too long (more than 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const stuckInReview = tasks.filter(
      task => task.workStatus === 'review' && new Date(task.updatedAt) < sevenDaysAgo
    );
    
    if (stuckInReview.length > 0) {
      newNotifications.push({
        id: `overdue-${Date.now()}`,
        type: 'overdue',
        title: 'פרויקטים תקועים בסקירה',
        message: `${stuckInReview.length} פרויקטים בסקירה מעל 7 ימים`,
        timestamp: now,
        isRead: false,
        priority: 'medium'
      });
    }

    // Projects on hold
    const onHoldProjects = tasks.filter(task => task.workStatus === 'on_hold');
    
    if (onHoldProjects.length > 0) {
      newNotifications.push({
        id: `hold-${Date.now()}`,
        type: 'info',
        title: 'פרויקטים ממתינים',
        message: `${onHoldProjects.length} פרויקטים במצב המתנה`,
        timestamp: now,
        isRead: false,
        priority: 'low'
      });
    }

    // Milestone: First project completion
    if (tasks.length === 1 && tasks[0].isCompleted) {
      newNotifications.push({
        id: `milestone-first-${Date.now()}`,
        type: 'milestone',
        title: '🎉 הפרויקט הראשון הושלם!',
        message: 'ברכות על השלמת הפרויקט הראשון שלך',
        timestamp: now,
        isRead: false,
        priority: 'medium'
      });
    }

    // Milestone: Revenue milestones
    const totalRevenue = tasks.filter(t => t.isPaid).reduce((sum, t) => sum + t.price, 0);
    const milestones = [1000, 5000, 10000, 25000, 50000, 100000];
    
    for (const milestone of milestones) {
      if (totalRevenue >= milestone && !localStorage.getItem(`milestone-${milestone}`)) {
        newNotifications.push({
          id: `milestone-revenue-${milestone}`,
          type: 'milestone',
          title: `🎯 אבן דרך: $${milestone.toLocaleString()}`,
          message: `הגעת להכנסות של $${totalRevenue.toLocaleString()}!`,
          timestamp: now,
          isRead: false,
          priority: 'medium'
        });
        localStorage.setItem(`milestone-${milestone}`, 'true');
      }
    }

    return newNotifications;
  }, [tasks]);

  // Load notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Update notifications when tasks change
  useEffect(() => {
    const existingIds = new Set(notifications.map(n => n.id));
    const newNotifications = generatedNotifications.filter(n => !existingIds.has(n.id));
    
    if (newNotifications.length > 0) {
      setNotifications(prev => {
        const updated = [...newNotifications, ...prev].slice(0, 50); // Keep only 50 latest
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });

      // Show toast for high priority notifications
      newNotifications
        .filter(n => n.priority === 'high')
        .forEach(notification => {
          toast({
            title: notification.title,
            description: notification.message,
            variant: notification.type === 'urgent' ? 'destructive' : 'default',
          });
        });
    }
  }, [generatedNotifications, notifications, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.isRead).length;

  return {
    notifications,
    unreadCount,
    urgentCount,
    showNotifications,
    setShowNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};