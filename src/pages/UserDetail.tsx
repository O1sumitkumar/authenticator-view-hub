import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Shield, 
  ShieldCheck, 
  ShieldOff, 
  Key, 
  QrCode,
  Copy,
  RefreshCw,
  AlertTriangle,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import type { User, TotpConfig } from '@/types/auth';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@company.com',
  department: 'Engineering',
  role: 'admin',
  twoFactorEnabled: true,
  lastLogin: new Date('2024-01-15T10:30:00'),
  status: 'active',
  totpSecret: 'JBSWY3DPEHPK3PXP',
  backupCodes: ['123456', '789012', '345678', '901234', '567890'],
  createdAt: new Date('2023-06-15'),
  updatedAt: new Date('2024-01-15'),
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User>(mockUser);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [newSecret, setNewSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    if (user.totpSecret) {
      generateQRCode();
    }
  }, [user.totpSecret]);

  const generateQRCode = async () => {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: 'Auth Dashboard',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: user.totpSecret || ''
      });

      const qrCodeDataUrl = await QRCode.toDataURL(totp.toString());
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive'
      });
    }
  };

  const generateNewSecret = () => {
    const secret = OTPAuth.Secret.fromLatin1(Math.random().toString(36).substring(2, 15)).base32;
    setNewSecret(secret);
    
    // Generate QR code for new secret
    const totp = new OTPAuth.TOTP({
      issuer: 'Auth Dashboard',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });

    QRCode.toDataURL(totp.toString()).then(setQrCodeUrl);
    setShowQrCode(true);
  };

  const enable2FA = () => {
    if (!verificationCode) {
      toast({
        title: 'Error',
        description: 'Please enter the verification code',
        variant: 'destructive'
      });
      return;
    }

    // Verify the code (in real app, this would be sent to backend)
    const totp = new OTPAuth.TOTP({
      issuer: 'Auth Dashboard',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: newSecret || user.totpSecret || ''
    });

    const currentToken = totp.generate();
    
    if (verificationCode === currentToken) {
      setUser({
        ...user,
        twoFactorEnabled: true,
        totpSecret: newSecret || user.totpSecret,
        updatedAt: new Date()
      });
      setShowQrCode(false);
      setVerificationCode('');
      setNewSecret('');
      
      toast({
        title: 'Success',
        description: '2FA has been enabled successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Invalid verification code',
        variant: 'destructive'
      });
    }
  };

  const disable2FA = () => {
    setUser({
      ...user,
      twoFactorEnabled: false,
      updatedAt: new Date()
    });
    
    toast({
      title: 'Success',
      description: '2FA has been disabled',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Text copied to clipboard',
    });
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    
    setUser({
      ...user,
      backupCodes: codes,
      updatedAt: new Date()
    });
    
    toast({
      title: 'Success',
      description: 'New backup codes generated',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/users')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <UserIcon className="w-5 h-5 mr-2" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">
                {user.status === 'active' && <Badge className="bg-green-600">Active</Badge>}
                {user.status === 'inactive' && <Badge variant="secondary">Inactive</Badge>}
                {user.status === 'suspended' && <Badge variant="destructive">Suspended</Badge>}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Role</Label>
              <div className="mt-1">
                {user.role === 'admin' && <Badge className="bg-purple-600">Admin</Badge>}
                {user.role === 'manager' && <Badge className="bg-blue-600">Manager</Badge>}
                {user.role === 'user' && <Badge variant="outline">User</Badge>}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Department</Label>
              <p className="text-sm text-muted-foreground mt-1">{user.department}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Last Login</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {user.lastLogin.toLocaleString()}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Created</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {user.createdAt.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2FA Management */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Shield className="w-5 h-5 mr-2" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="status">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="status">Status</TabsTrigger>
                  <TabsTrigger value="setup">Setup</TabsTrigger>
                  <TabsTrigger value="backup">Backup Codes</TabsTrigger>
                </TabsList>

                <TabsContent value="status" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {user.twoFactorEnabled ? (
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                      ) : (
                        <ShieldOff className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.twoFactorEnabled 
                            ? 'Enabled and protecting this account' 
                            : 'Disabled - account is not fully protected'
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={user.twoFactorEnabled ? "destructive" : "default"}
                      onClick={user.twoFactorEnabled ? disable2FA : () => generateNewSecret()}
                    >
                      {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>

                  {!user.twoFactorEnabled && (
                    <div className="flex items-center space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <p className="text-sm text-yellow-200">
                        This account is not protected by two-factor authentication
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="setup" className="space-y-4 mt-6">
                  {showQrCode || (!user.twoFactorEnabled && qrCodeUrl) ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          Scan QR Code
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Use Google Authenticator or another TOTP app to scan this code
                        </p>
                        {qrCodeUrl && (
                          <div className="inline-block p-4 bg-white rounded-lg">
                            <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secret">Manual Entry Key</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="secret"
                            value={newSecret || user.totpSecret || ''}
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(newSecret || user.totpSecret || '')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="verification">Verification Code</Label>
                        <Input
                          id="verification"
                          placeholder="Enter 6-digit code from your app"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                        />
                      </div>

                      <Button onClick={enable2FA} className="w-full">
                        Verify and Enable 2FA
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Set up Two-Factor Authentication
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Generate a new secret key to set up 2FA for this user
                      </p>
                      <Button onClick={generateNewSecret}>
                        <Key className="w-4 h-4 mr-2" />
                        Generate New Secret
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="backup" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">Backup Codes</h3>
                        <p className="text-sm text-muted-foreground">
                          Use these codes to access the account if the authenticator app is unavailable
                        </p>
                      </div>
                      <Button variant="outline" onClick={generateBackupCodes}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate New
                      </Button>
                    </div>

                    {user.backupCodes && user.backupCodes.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {user.backupCodes.map((code, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                          >
                            <span className="font-mono text-sm">{code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(code)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No backup codes generated</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-blue-400" />
                      <p className="text-sm text-blue-200">
                        Store these codes in a safe place. Each code can only be used once.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}