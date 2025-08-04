import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function UserPermissionsCard() {
  const { userData, roles, hasRole, hasPermission } = useAuth();

  const permissionChecks = [
    { name: 'Application Management', permission: 'admin', icon: Shield },
    { name: 'User Management', permission: 'user-admin', icon: User },
    { name: 'Rights Management', permission: 'rights-admin', icon: Shield },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Your Permissions</span>
        </CardTitle>
        <CardDescription>
          Current roles and permissions in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Roles */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Assigned Roles</h4>
          <div className="flex flex-wrap gap-2">
            {roles && roles.length > 0 ? (
              roles.map((role) => (
                <Badge 
                  key={role} 
                  variant="outline" 
                  className={
                    role === 'admin' 
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : role === 'manager'
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }
                >
                  {role}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                No roles assigned
              </Badge>
            )}
          </div>
        </div>

        {/* Permission Checks */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">System Permissions</h4>
          <div className="space-y-2">
            {permissionChecks.map((check) => {
              const hasAccess = hasRole('admin') || hasPermission(check.permission);
              const Icon = check.icon;
              
              return (
                <div key={check.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{check.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle 
                      className={`h-4 w-4 ${
                        hasAccess ? 'text-green-500' : 'text-gray-300'
                      }`} 
                    />
                    <span className={`text-xs ${
                      hasAccess ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {hasAccess ? 'Granted' : 'Denied'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Info */}
        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Account: {userData.preferred_username || userData.email}</div>
            <div>Email Verified: {userData.email_verified ? 'Yes' : 'No'}</div>
            {userData.locale && <div>Locale: {userData.locale}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}