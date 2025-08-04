import { ActivityLog, Notification } from '@/types/activity';

class ActivityService {
  private readonly ACTIVITY_STORAGE_KEY = 'admin_activity_logs';
  private readonly NOTIFICATIONS_STORAGE_KEY = 'admin_notifications';

  // Activity Logs
  getActivityLogs(): ActivityLog[] {
    try {
      const stored = localStorage.getItem(this.ACTIVITY_STORAGE_KEY);
      if (!stored) return this.getDefaultActivityLogs();
      
      const logs = JSON.parse(stored);
      return logs.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      }));
    } catch (error) {
      console.error('Error loading activity logs:', error);
      return this.getDefaultActivityLogs();
    }
  }

  addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    try {
      const logs = this.getActivityLogs();
      const newLog: ActivityLog = {
        ...log,
        id: this.generateId(),
        timestamp: new Date(),
      };
      
      logs.unshift(newLog); // Add to beginning
      
      // Keep only last 100 logs
      const trimmedLogs = logs.slice(0, 100);
      
      localStorage.setItem(this.ACTIVITY_STORAGE_KEY, JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('Error saving activity log:', error);
    }
  }

  // Notifications
  getNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem(this.NOTIFICATIONS_STORAGE_KEY);
      if (!stored) return this.getDefaultNotifications();
      
      const notifications = JSON.parse(stored);
      return notifications.map((notification: any) => ({
        ...notification,
        timestamp: new Date(notification.timestamp),
      }));
    } catch (error) {
      console.error('Error loading notifications:', error);
      return this.getDefaultNotifications();
    }
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    try {
      const notifications = this.getNotifications();
      const newNotification: Notification = {
        ...notification,
        id: this.generateId(),
        timestamp: new Date(),
      };
      
      notifications.unshift(newNotification); // Add to beginning
      
      // Keep only last 50 notifications
      const trimmedNotifications = notifications.slice(0, 50);
      
      localStorage.setItem(this.NOTIFICATIONS_STORAGE_KEY, JSON.stringify(trimmedNotifications));
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }

  markNotificationAsRead(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      
      localStorage.setItem(this.NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  markAllNotificationsAsRead(): void {
    try {
      const notifications = this.getNotifications();
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true,
      }));
      
      localStorage.setItem(this.NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  getUnreadNotificationCount(): number {
    return this.getNotifications().filter(n => !n.isRead).length;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDefaultActivityLogs(): ActivityLog[] {
    const defaultLogs: ActivityLog[] = [
      {
        id: '1',
        type: 'create',
        entity: 'application',
        entityId: 'app-1',
        entityName: 'Customer Portal',
        action: 'Created application',
        description: 'New application "Customer Portal" was created with code APP-CUSTOMER-PORTAL',
        userId: '1',
        userName: 'John Admin',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: '2',
        type: 'create',
        entity: 'account',
        entityId: 'acc-1',
        entityName: 'Jane Smith',
        action: 'Created account',
        description: 'New personal account created for Jane Smith',
        userId: '1',
        userName: 'John Admin',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: '3',
        type: 'create',
        entity: 'rights',
        entityId: 'rights-1',
        entityName: 'Admin Rights',
        action: 'Granted rights',
        description: 'Admin rights granted to Jane Smith for Customer Portal',
        userId: '1',
        userName: 'John Admin',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        id: '4',
        type: 'permission_request',
        entity: 'system',
        entityId: 'req-1',
        entityName: 'Permission Request',
        action: 'Permission requested',
        description: 'Bob Wilson requested admin access to Analytics Platform',
        userId: '3',
        userName: 'Bob Wilson',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      },
    ];

    localStorage.setItem(this.ACTIVITY_STORAGE_KEY, JSON.stringify(defaultLogs));
    return defaultLogs;
  }

  private getDefaultNotifications(): Notification[] {
    const defaultNotifications: Notification[] = [
      {
        id: '1',
        type: 'permission_request',
        title: 'New Permission Request',
        message: 'Bob Wilson requested admin access to Analytics Platform',
        userId: '3',
        userName: 'Bob Wilson',
        entityType: 'application',
        entityId: 'app-3',
        isRead: false,
        priority: 'high',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        actionUrl: '/rights',
      },
      {
        id: '2',
        type: 'permission_request',
        title: 'Permission Request Approved',
        message: 'Alice Johnson\'s request for user access to Customer Portal has been approved',
        userId: '4',
        userName: 'Alice Johnson',
        entityType: 'application',
        entityId: 'app-1',
        isRead: false,
        priority: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actionUrl: '/rights',
      },
      {
        id: '3',
        type: 'system_alert',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
        isRead: true,
        priority: 'medium',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: '4',
        type: 'user_action',
        title: 'New User Registration',
        message: 'Charlie Brown has registered and is awaiting approval',
        userId: '5',
        userName: 'Charlie Brown',
        entityType: 'user',
        entityId: '5',
        isRead: true,
        priority: 'low',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        actionUrl: '/users',
      },
      {
        id: '5',
        type: 'security',
        title: 'Security Alert',
        message: 'Multiple failed login attempts detected for user john.doe@company.com',
        userId: '1',
        userName: 'John Doe',
        isRead: false,
        priority: 'urgent',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
    ];

    localStorage.setItem(this.NOTIFICATIONS_STORAGE_KEY, JSON.stringify(defaultNotifications));
    return defaultNotifications;
  }
}

export const activityService = new ActivityService();