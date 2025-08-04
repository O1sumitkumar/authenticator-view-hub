// Core data models matching the database structure

export interface User {
  user_id: number;
  name: string;
  email: string;
  account_id?: number;
  user_role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  [x: string]: string;
  account_id: number;
  account_name: string;
  account_type: 'Business' | 'Temporary' | 'Personal';
  right_code: string;
  owner_id: number;
  status: 'active' | 'suspended' | 'trial';
  created_at: string;
  updated_at: string;
}

export interface Application {
  application_id: number;
  application_name: string;
  application_code: string; // Unique identifier (APP-X, APP-Y, etc.)
  rights_code: string;
  status: 'active' | 'maintenance' | 'deprecated';
  version: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  level: 'read' | 'write' | 'admin' | 'owner';
  scope: string;
  features: string[];
}

export interface Rights {
  rights_id: number;
  user_id: number;
  account_id: number;
  application_id: number;
  rights_code_jwt: string;
  permissions: Permission[];
  is_active: boolean;
  expires_at: string;
  created_at: string;
  updated_at: string;
  granted_by: number;
  revoked_by?: number;
  revoked_at?: string;
}

export interface Invitation {
  invitation_id: number;
  email: string;
  account_id: number;
  invited_by: number;
  token: string;
  user_role: 'admin' | 'member' | 'viewer';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

// JWT payload structure for rights codes
export interface RightsJWTPayload {
  // Standard JWT claims
  iss: string; // Issuer (centralized admin system)
  sub: string; // Subject (account ID)
  aud: string; // Audience (application ID)
  exp: number; // Expiration time
  iat: number; // Issued at
  jti: string; // JWT ID (rights ID)

  // Custom claims
  permissions: Permission[];
  accountType: 'Temporary' | 'Personal' | 'Business';
  sharedFrom?: string; // If rights are shared from another account
  applicationId: string; // Target application identifier
  accountId: string; // Account identifier
}

// Statistics interfaces
export interface ApplicationStatistics {
  total: number;
  active: number;
  inactive: number;
}

export interface DashboardMetrics {
  applicationStats: ApplicationStatistics;
  rightsStats: {
    totalActive: number;
    expiringSoon: number;
  };
  accountStats: {
    personal: number;
    business: number;
    temporary: number;
  };
  pendingInvitations: number;
}

// Form interfaces for creating/updating data
export interface ApplicationRequest {
  application_name: string;
  application_code: string;
  rights_code: string;
  status: 'active' | 'maintenance' | 'deprecated';
  version: string;
}

export interface AccountRequest {
  account_name: string;
  account_type: 'Business' | 'Temporary' | 'Personal';
  right_code: string;
  owner_id: number;
  status: 'active' | 'suspended' | 'trial';
}

export interface UserRequest {
  name: string;
  email: string;
  account_id?: number;
  user_role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
}

export interface RightsRequest {
  user_id: number;
  account_id: number;
  application_id: number;
  permissions: Permission[];
  expires_at: string;
  granted_by: number;
}

export interface InvitationRequest {
  email: string;
  account_id: number;
  invited_by: number;
  user_role: 'admin' | 'member' | 'viewer';
  expires_at: string;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PermissionRequest {
  applicationId: string;
  userToken: string; // Keycloak JWT
}

export interface PermissionResponse {
  success: boolean;
  rightsCode?: string; // JWT rights code
  permissions?: Permission[];
  accountType?: 'Temporary' | 'Personal' | 'Business';
  expiresAt?: Date;
  error?: string;
}

// Grid column definitions for Syncfusion
export interface GridColumn {
  field: string;
  headerText: string;
  width?: number;
  type?: string;
  format?: string;
  template?: string;
}