import { useState } from 'react';
import { ColumnDirective, ColumnsDirective, GridComponent, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Activity as ActivityIcon, 
  Search, 
  Filter, 
  Download,
  LogIn,
  LogOut,
  Shield,
  Key,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ActivityLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  type: 'login' | 'logout' | '2fa_enabled' | '2fa_disabled' | 'password_change' | 'failed_login' | 'account_locked';
  ipAddress: string;
  userAgent: string;
  location: string;
  status: 'success' | 'failed' | 'warning';
}

const mockActivity: ActivityLog[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T10:30:00'),
    user: 'john.doe@company.com',
    action: 'User logged in successfully',
    type: 'login',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    location: 'San Francisco, CA',
    status: 'success'
  },
  {
    id: '2',
    timestamp: new Date('2024-01-15T10:25:00'),
    user: 'jane.smith@company.com',
    action: 'Two-factor authentication enabled',
    type: '2fa_enabled',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox 121.0',
    location: 'New York, NY',
    status: 'success'
  },
  {
    id: '3',
    timestamp: new Date('2024-01-15T10:20:00'),
    user: 'mike.wilson@company.com',
    action: 'Failed login attempt',
    type: 'failed_login',
    ipAddress: '203.0.113.1',
    userAgent: 'Chrome 120.0.0.0',
    location: 'Unknown',
    status: 'failed'
  },
  {
    id: '4',
    timestamp: new Date('2024-01-15T10:15:00'),
    user: 'sarah.johnson@company.com',
    action: 'Password changed successfully',
    type: 'password_change',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari 17.1',
    location: 'Los Angeles, CA',
    status: 'success'
  },
  {
    id: '5',
    timestamp: new Date('2024-01-15T10:10:00'),
    user: 'david.brown@company.com',
    action: 'Account locked due to multiple failed attempts',
    type: 'account_locked',
    ipAddress: '203.0.113.2',
    userAgent: 'Chrome 120.0.0.0',
    location: 'Unknown',
    status: 'warning'
  },
  {
    id: '6',
    timestamp: new Date('2024-01-15T10:05:00'),
    user: 'alice.cooper@company.com',
    action: 'User logged out',
    type: 'logout',
    ipAddress: '192.168.1.103',
    userAgent: 'Edge 120.0.0.0',
    location: 'Chicago, IL',
    status: 'success'
  }
];

export default function Activity() {
  const [activities, setActivities] = useState<ActivityLog[]>(mockActivity);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <LogIn className="w-4 h-4 text-green-500" />;
      case 'logout': return <LogOut className="w-4 h-4 text-blue-500" />;
      case '2fa_enabled': return <Shield className="w-4 h-4 text-green-500" />;
      case '2fa_disabled': return <Shield className="w-4 h-4 text-red-500" />;
      case 'password_change': return <Key className="w-4 h-4 text-yellow-500" />;
      case 'failed_login': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'account_locked': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <ActivityIcon className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600 hover:bg-green-700">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Warning</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const actionTemplate = (props: ActivityLog) => (
    <div className="flex items-center space-x-2">
      {getActivityIcon(props.type)}
      <span className="text-sm">{props.action}</span>
    </div>
  );

  const statusTemplate = (props: ActivityLog) => getStatusBadge(props.status);
  
  const timestampTemplate = (props: ActivityLog) => (
    <span className="text-sm text-muted-foreground">
      {props.timestamp.toLocaleDateString()} {props.timestamp.toLocaleTimeString()}
    </span>
  );

  const locationTemplate = (props: ActivityLog) => (
    <div className="text-sm">
      <div>{props.location}</div>
      <div className="text-xs text-muted-foreground">{props.ipAddress}</div>
    </div>
  );

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchTerm === '' || 
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.ipAddress.includes(searchTerm);
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const stats = {
    total: activities.length,
    success: activities.filter(a => a.status === 'success').length,
    failed: activities.filter(a => a.status === 'failed').length,
    warnings: activities.filter(a => a.status === 'warning').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
        <p className="text-muted-foreground mt-2">Monitor user activities and system events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <ActivityIcon className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-foreground">{stats.success}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-foreground">{stats.warnings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by user, action, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Types</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="2fa_enabled">2FA Enabled</option>
                <option value="2fa_disabled">2FA Disabled</option>
                <option value="password_change">Password Change</option>
                <option value="failed_login">Failed Login</option>
                <option value="account_locked">Account Locked</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Activity Events ({filteredActivities.length})
          </CardTitle>
          <CardDescription>Detailed log of user activities and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <GridComponent
            dataSource={filteredActivities}
            allowPaging={true}
            allowSorting={true}
            pageSettings={{ pageSize: 15 }}
            className="activity-grid"
          >
            <ColumnsDirective>
              <ColumnDirective 
                field="timestamp" 
                headerText="Time" 
                width="160" 
                template={timestampTemplate}
              />
              <ColumnDirective field="user" headerText="User" width="200" />
              <ColumnDirective 
                field="action" 
                headerText="Action" 
                width="300" 
                template={actionTemplate}
              />
              <ColumnDirective 
                field="status" 
                headerText="Status" 
                width="120" 
                template={statusTemplate}
              />
              <ColumnDirective 
                field="location" 
                headerText="Location" 
                width="180" 
                template={locationTemplate}
              />
              <ColumnDirective field="userAgent" headerText="User Agent" width="200" />
            </ColumnsDirective>
            <Inject services={[Page]} />
          </GridComponent>
        </CardContent>
      </Card>
    </div>
  );
}