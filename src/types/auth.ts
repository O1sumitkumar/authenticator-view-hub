export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'admin' | 'user' | 'manager';
  twoFactorEnabled: boolean;
  lastLogin: Date;
  status: 'active' | 'inactive' | 'suspended';
  totpSecret?: string;
  backupCodes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TotpConfig {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  issuer: string;
  accountName: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  usersWithTwoFactor: number;
  suspendedUsers: number;
  todayLogins: number;
  totalLogins: number;
  securityAlerts: number;
}

export interface SecurityAlert {
  id: string;
  type: 'failed_login' | 'new_device' | 'suspicious_activity' | 'totp_disabled';
  message: string;
  user: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

// Admin System Types
export interface AdminUser {
  id: string;
  email: string;
  accountId: string;
  userId: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  accountId: string;
  accountType: 'Temporary' | 'Personal' | 'Business';
  sharedAccounts: string[]; // List of account IDs this account shares rights with
  users: string[]; // List of user IDs associated with this account
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  name: string;
  applicationId: string; // The APP-X identifier
  description?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Rights {
  id: string;
  applicationId: string;
  accountId: string;
  rightsCode: string; // JWT token with permissions
  permissions: Permission[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  level: 'read' | 'write' | 'admin' | 'owner';
  resources: string[]; // Specific resources this permission applies to
}

export interface AccountSharing {
  id: string;
  sourceAccountId: string;
  targetAccountId: string;
  status: 'pending' | 'active' | 'revoked';
  invitedBy: string;
  invitedAt: Date;
  expiresAt?: Date;
}

export interface AccountUser {
  id: string;
  userId: string;
  accountId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'user';
  status: 'active' | 'inactive';
  addedAt: Date;
  addedBy: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalAccounts: number;
  totalApplications: number;
  totalRights: number;
  temporaryAccounts: number;
  personalAccounts: number;
  businessAccounts: number;
  activeApplications: number;
  pendingInvitations: number;
}

export interface RightsRequest {
  id: string;
  applicationId: string;
  userId: string;
  accountId: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  rightsCode?: string;
}