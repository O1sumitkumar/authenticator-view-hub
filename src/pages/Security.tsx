import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Ban,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import type { SecurityAlert } from '@/types/auth';

const securityAlerts: SecurityAlert[] = [
  {
    id: '1',
    type: 'failed_login',
    message: 'Multiple failed login attempts from IP 192.168.1.100',
    user: 'john.doe@company.com',
    timestamp: new Date('2024-01-15T10:30:00'),
    severity: 'high',
    resolved: false
  },
  {
    id: '2',
    type: 'new_device',
    message: 'New device login detected from Chrome on Windows',
    user: 'jane.smith@company.com',
    timestamp: new Date('2024-01-15T09:15:00'),
    severity: 'medium',
    resolved: true
  },
  {
    id: '3',
    type: 'suspicious_activity',
    message: 'Login from unusual location: Russia',
    user: 'mike.wilson@company.com',
    timestamp: new Date('2024-01-15T08:45:00'),
    severity: 'critical',
    resolved: false
  },
  {
    id: '4',
    type: 'totp_disabled',
    message: '2FA was disabled by user',
    user: 'sarah.johnson@company.com',
    timestamp: new Date('2024-01-15T07:20:00'),
    severity: 'medium',
    resolved: false
  }
];

export default function Security() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(securityAlerts);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 hover:bg-red-700';
      case 'high': return 'bg-orange-600 hover:bg-orange-700';
      case 'medium': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'low': return 'bg-blue-600 hover:bg-blue-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      case 'low': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const markAsResolved = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unresolved': return !alert.resolved;
      case 'resolved': return alert.resolved;
      default: return true;
    }
  });

  const stats = {
    total: alerts.length,
    unresolved: alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
    high: alerts.filter(a => a.severity === 'high' && !a.resolved).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Center</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage security events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unresolved</p>
                <p className="text-2xl font-bold text-foreground">{stats.unresolved}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-foreground">{stats.high}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All Alerts
            </Button>
            <Button 
              variant={filter === 'unresolved' ? 'default' : 'outline'}
              onClick={() => setFilter('unresolved')}
              size="sm"
            >
              Unresolved
            </Button>
            <Button 
              variant={filter === 'resolved' ? 'default' : 'outline'}
              onClick={() => setFilter('resolved')}
              size="sm"
            >
              Resolved
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Security Alerts ({filteredAlerts.length})</CardTitle>
          <CardDescription>Recent security events requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {getSeverityIcon(alert.severity)}
                      <span className="ml-1 capitalize">{alert.severity}</span>
                    </Badge>
                    {alert.resolved && (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolved
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-xs text-muted-foreground">User: {alert.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!alert.resolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsResolved(alert.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  {filter === 'all' 
                    ? 'No security alerts to display' 
                    : `No ${filter} alerts at this time`
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}