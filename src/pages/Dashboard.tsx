import { useState, useEffect } from 'react';
import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Category, Legend, Tooltip, DataLabel, Inject } from '@syncfusion/ej2-react-charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Shield, Activity, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import type { DashboardStats, SecurityAlert } from '@/types/auth';

const statsData: DashboardStats = {
  totalUsers: 1247,
  activeUsers: 1089,
  usersWithTwoFactor: 892,
  suspendedUsers: 15,
  todayLogins: 324,
  totalLogins: 45672,
  securityAlerts: 3
};

const recentAlerts: SecurityAlert[] = [
  {
    id: '1',
    type: 'failed_login',
    message: 'Multiple failed login attempts detected',
    user: 'john.doe@company.com',
    timestamp: new Date('2024-01-15T10:30:00'),
    severity: 'high',
    resolved: false
  },
  {
    id: '2',
    type: 'new_device',
    message: 'New device login detected',
    user: 'jane.smith@company.com',
    timestamp: new Date('2024-01-15T09:15:00'),
    severity: 'medium',
    resolved: true
  },
  {
    id: '3',
    type: 'totp_disabled',
    message: '2FA was disabled by user',
    user: 'mike.wilson@company.com',
    timestamp: new Date('2024-01-15T08:45:00'),
    severity: 'medium',
    resolved: false
  }
];

const chartData = [
  { month: 'Jan', active: 980, total: 1200 },
  { month: 'Feb', active: 1045, total: 1220 },
  { month: 'Mar', active: 1089, total: 1247 },
];

const loginData = [
  { time: '00:00', logins: 12 },
  { time: '04:00', logins: 8 },
  { time: '08:00', logins: 145 },
  { time: '12:00', logins: 89 },
  { time: '16:00', logins: 67 },
  { time: '20:00', logins: 34 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(statsData);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const alertTemplate = (props: SecurityAlert) => (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${getSeverityColor(props.severity)}`} />
        <div>
          <p className="text-sm font-medium text-foreground">{props.message}</p>
          <p className="text-xs text-muted-foreground">{props.user} • {props.timestamp.toLocaleTimeString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {props.resolved ? (
          <Badge variant="secondary">Resolved</Badge>
        ) : (
          <Badge variant="destructive">Active</Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor your authentication system and user activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">2FA Enabled</CardTitle>
            <Shield className="h-4 w-4 text-primary-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.usersWithTwoFactor.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.usersWithTwoFactor / stats.totalUsers) * 100).toFixed(1)}% coverage
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Today's Logins</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.todayLogins.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +8% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">User Growth</CardTitle>
            <CardDescription>Active vs Total Users Over Time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent
              id="user-growth-chart"
              height="300px"
              primaryXAxis={{ valueType: 'Category' }}
              primaryYAxis={{ title: 'Users' }}
              tooltip={{ enable: true }}
              background="transparent"
            >
              <Inject services={[Category, Legend, Tooltip, DataLabel]} />
              <SeriesCollectionDirective>
                <SeriesDirective
                  dataSource={chartData}
                  xName="month"
                  yName="total"
                  name="Total Users"
                  type="Column"
                  fill="#3B82F6"
                />
                <SeriesDirective
                  dataSource={chartData}
                  xName="month"
                  yName="active"
                  name="Active Users"
                  type="Column"
                  fill="#8B5CF6"
                />
              </SeriesCollectionDirective>
            </ChartComponent>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Login Activity</CardTitle>
            <CardDescription>Daily Login Pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent
              id="login-activity-chart"
              height="300px"
              primaryXAxis={{ valueType: 'Category' }}
              primaryYAxis={{ title: 'Logins' }}
              tooltip={{ enable: true }}
              background="transparent"
            >
              <Inject services={[Category, Legend, Tooltip]} />
              <SeriesCollectionDirective>
                <SeriesDirective
                  dataSource={loginData}
                  xName="time"
                  yName="logins"
                  name="Logins"
                  type="Line"
                  fill="#3B82F6"
                  width={2}
                />
              </SeriesCollectionDirective>
            </ChartComponent>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-foreground">
              <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
              Security Alerts
            </CardTitle>
            <CardDescription>Recent security events requiring attention</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentAlerts.map((alert) => alertTemplate(alert))}
        </CardContent>
      </Card>
    </div>
  );
}