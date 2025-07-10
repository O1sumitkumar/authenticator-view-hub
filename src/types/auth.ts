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