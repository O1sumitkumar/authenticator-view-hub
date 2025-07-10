import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Users, 
  Database,
  Mail,
  Key,
  Clock,
  AlertTriangle,
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

interface AppSettings {
  companyName: string;
  adminEmail: string;
  sessionTimeout: number;
  requireTwoFactor: boolean;
  allowSelfRegistration: boolean;
  emailNotifications: boolean;
  securityAlerts: boolean;
  loginAttempts: number;
  lockoutDuration: number;
  backupCodesCount: number;
  totpIssuer: string;
}

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<AppSettings>({
    companyName: 'Acme Corporation',
    adminEmail: 'admin@company.com',
    sessionTimeout: 8,
    requireTwoFactor: false,
    allowSelfRegistration: true,
    emailNotifications: true,
    securityAlerts: true,
    loginAttempts: 5,
    lockoutDuration: 15,
    backupCodesCount: 8,
    totpIssuer: 'Auth Dashboard'
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof AppSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your authentication system</p>
        </div>
        {hasChanges && (
          <Button onClick={saveSettings} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="bg-gradient-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs orientation="vertical" defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-1 h-auto space-y-1">
                <TabsTrigger value="general" className="justify-start">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="users" className="justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  User Management
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="general" className="w-full">
            <TabsContent value="general">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">General Settings</CardTitle>
                  <CardDescription>Basic configuration for your authentication system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => handleSettingChange('companyName', e.target.value)}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Administrator Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                      placeholder="admin@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="1"
                      max="24"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Users will be automatically logged out after this period of inactivity
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totpIssuer">TOTP Issuer Name</Label>
                    <Input
                      id="totpIssuer"
                      value={settings.totpIssuer}
                      onChange={(e) => handleSettingChange('totpIssuer', e.target.value)}
                      placeholder="Auth Dashboard"
                    />
                    <p className="text-sm text-muted-foreground">
                      This name appears in authenticator apps
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label>Appearance Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        onClick={() => setTheme('light')}
                        className="justify-start"
                      >
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => setTheme('dark')}
                        className="justify-start"
                      >
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        onClick={() => setTheme('system')}
                        className="justify-start"
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        System
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme for the dashboard
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure security policies and requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Force all users to enable 2FA
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireTwoFactor}
                      onCheckedChange={(checked) => handleSettingChange('requireTwoFactor', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={settings.loginAttempts}
                      onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Number of failed attempts before account lockout
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      min="5"
                      max="60"
                      value={settings.lockoutDuration}
                      onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      How long to lock accounts after failed attempts
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupCodes">Backup Codes Count</Label>
                    <Input
                      id="backupCodes"
                      type="number"
                      min="5"
                      max="20"
                      value={settings.backupCodesCount}
                      onChange={(e) => handleSettingChange('backupCodesCount', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Number of backup codes to generate for each user
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <p className="text-sm text-yellow-200">
                      Security changes will affect all users. Notify your team before making changes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Configure email and alert preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about security events and suspicious activity
                      </p>
                    </div>
                    <Switch
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Email Types</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Failed Login Attempts', description: 'Notify when users fail to login multiple times' },
                        { label: 'New Device Logins', description: 'Alert when users login from new devices' },
                        { label: '2FA Changes', description: 'Notify when 2FA is enabled or disabled' },
                        { label: 'Account Lockouts', description: 'Alert when accounts are locked due to security' },
                        { label: 'Weekly Security Report', description: 'Summary of security events and user activity' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <Switch defaultChecked={index < 3} />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Users className="w-5 h-5 mr-2" />
                    User Management
                  </CardTitle>
                  <CardDescription>Configure user registration and management policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Self Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Let users create their own accounts
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowSelfRegistration}
                      onCheckedChange={(checked) => handleSettingChange('allowSelfRegistration', checked)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Default User Permissions</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Access Dashboard', description: 'View their own authentication settings' },
                        { label: 'Manage 2FA', description: 'Enable/disable their own two-factor authentication' },
                        { label: 'Generate Backup Codes', description: 'Create new backup codes for their account' },
                        { label: 'View Login History', description: 'See their recent login activity' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Bulk Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Send 2FA Setup Email to All
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Key className="w-4 h-4 mr-2" />
                        Force 2FA Reset for All
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Export User Data
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Clock className="w-4 h-4 mr-2" />
                        Clear Old Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}