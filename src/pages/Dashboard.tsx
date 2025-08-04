import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserPermissionsCard } from '@/components/UserPermissionsCard';
import { 
  AppWindow, 
  Shield, 
  Users, 
  Clock,
  TrendingUp,
  AlertTriangle,
  User
} from 'lucide-react';
import { 
  useGetApplicationsQuery, 
  useGetRightsQuery, 
  useGetAccountsQuery 
} from '@/redux/api/adminApi';

export function Dashboard() {
  const { user } = useCurrentUser();
  
  // Get data from RTK Query
  const { data: applications = [], isLoading: applicationsLoading } = useGetApplicationsQuery();
  const { data: rights = [], isLoading: rightsLoading } = useGetRightsQuery();
  const { data: accounts = [], isLoading: accountsLoading } = useGetAccountsQuery();

  // Calculate dashboard metrics
  const dashboardMetrics = {
    applicationStats: {
      total: applications.length,
      active: applications.filter(app => app.status === 'active').length,
      inactive: applications.filter(app => app.status === 'maintenance' || app.status === 'deprecated').length,
    },
    rightsStats: {
      totalActive: rights.filter(right => right.is_active && new Date(right.expires_at) > new Date()).length,
      expiringSoon: rights.filter(right => {
        if (!right.is_active) return false;
        const expirationDate = new Date(right.expires_at);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        return expirationDate <= sevenDaysFromNow && expirationDate > new Date();
      }).length,
    },
    accountStats: {
      personal: accounts.filter(acc => acc.account_type === 'Personal').length,
      business: accounts.filter(acc => acc.account_type === 'Business').length,
      temporary: accounts.filter(acc => acc.account_type === 'Temporary').length,
    },
    pendingInvitations: 0, // TODO: Implement when invitations are added
  };

  // Show loading state
  if (applicationsLoading || rightsLoading || accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {user && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {user.role}
            </Badge>
          )}
        </div>
        <p className="text-gray-600 mt-2">
          {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Overview of your centralized permission management system'}
        </p>
        {user?.lastLogin && (
          <p className="text-sm text-gray-500 mt-1">
            Last login: {user.lastLogin.toLocaleDateString()} at {user.lastLogin.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Applications Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <AppWindow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.applicationStats.total}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <Badge variant="secondary" className="text-xs">
                {dashboardMetrics.applicationStats.active} Active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {dashboardMetrics.applicationStats.inactive} Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Rights Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rights</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.rightsStats.totalActive}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
              {dashboardMetrics.rightsStats.expiringSoon > 0 && (
                <>
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  <span className="text-orange-600">
                    {dashboardMetrics.rightsStats.expiringSoon} expiring soon
                  </span>
                </>
              )}
              {dashboardMetrics.rightsStats.expiringSoon === 0 && (
                <span className="text-green-600">All rights current</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Accounts Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
              <div className="flex space-x-1">
                <Badge variant="secondary" className="text-xs">
                  {dashboardMetrics.accountStats.business} Business
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {dashboardMetrics.accountStats.personal} Personal
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes in your permission system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app.application_id} className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Application registered</p>
                    <p className="text-xs text-muted-foreground">
                      {app.application_name} ({app.application_code})
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No recent activity. Start by registering your first application.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              Key metrics for your permission management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Applications</span>
                <Badge variant="secondary">{dashboardMetrics.applicationStats.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Rights</span>
                <Badge variant="secondary">{dashboardMetrics.rightsStats.totalActive}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Accounts</span>
                <Badge variant="secondary">{accounts.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Account Types</span>
                <div className="flex space-x-1">
                  <Badge variant="outline" className="text-xs">
                    B: {dashboardMetrics.accountStats.business}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    P: {dashboardMetrics.accountStats.personal}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    T: {dashboardMetrics.accountStats.temporary}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Permissions */}
        <UserPermissionsCard />
      </div>
    </div>
  );
}