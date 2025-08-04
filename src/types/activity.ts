export interface ActivityLog {
  id: string;
  type: 'create' | 'update' | 'delete' | 'permission_request' | 'login' | 'logout';
  entity: 'application' | 'account' | 'rights' | 'user' | 'system';
  entityId: string;
  entityName: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  type: 'permission_request' | 'system_alert' | 'user_action' | 'security';
  title: string;
  message: string;
  userId?: string;
  userName?: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  actionUrl?: string;
}