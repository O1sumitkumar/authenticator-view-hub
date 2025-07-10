import { useState, useEffect } from 'react';
import { ColumnDirective, ColumnsDirective, GridComponent, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Search, 
  Clock,
  Shield,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as OTPAuth from 'otpauth';

interface UserCode {
  id: string;
  name: string;
  email: string;
  currentCode: string;
  timeRemaining: number;
  nextCode: string;
  issuer: string;
  isActive: boolean;
}

const generateTOTP = (secret: string) => {
  const totp = new OTPAuth.TOTP({
    issuer: 'Auth Dashboard',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret
  });
  return totp.generate();
};

const mockUserCodes: UserCode[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    currentCode: generateTOTP('JBSWY3DPEHPK3PXP'),
    timeRemaining: 15,
    nextCode: '',
    issuer: 'Auth Dashboard',
    isActive: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    currentCode: generateTOTP('MFRGG3DFMZTWQ2LK'),
    timeRemaining: 23,
    nextCode: '',
    issuer: 'Auth Dashboard',
    isActive: true
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    currentCode: generateTOTP('GEZDGNBVGY3TQOJQ'),
    timeRemaining: 8,
    nextCode: '',
    issuer: 'Auth Dashboard',
    isActive: true
  }
];

export default function Codes() {
  const { toast } = useToast();
  const [userCodes, setUserCodes] = useState<UserCode[]>(mockUserCodes);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const period = 30;
      const remaining = period - (now % period);
      
      setTimeLeft(remaining);
      
      // Regenerate codes when time expires
      if (remaining === 30) {
        refreshCodes();
      }
      
      // Update individual user timers
      setUserCodes(prev => prev.map(user => ({
        ...user,
        timeRemaining: remaining
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const refreshCodes = () => {
    const secrets = ['JBSWY3DPEHPK3PXP', 'MFRGG3DFMZTWQ2LK', 'GEZDGNBVGY3TQOJQ'];
    
    setUserCodes(prev => prev.map((user, index) => ({
      ...user,
      currentCode: generateTOTP(secrets[index] || 'JBSWY3DPEHPK3PXP'),
      timeRemaining: 30
    })));
    
    toast({
      title: 'Codes Refreshed',
      description: 'All TOTP codes have been updated',
    });
  };

  const copyCode = (code: string, userName: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Code Copied',
      description: `${userName}'s code copied to clipboard`,
    });
  };

  const codeTemplate = (props: UserCode) => (
    <div className="flex items-center space-x-3">
      <span className="font-mono text-2xl font-bold text-primary tracking-wider">
        {props.currentCode}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyCode(props.currentCode, props.name)}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );

  const userTemplate = (props: UserCode) => (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="font-medium text-foreground">{props.name}</p>
        <p className="text-sm text-muted-foreground">{props.email}</p>
      </div>
    </div>
  );

  const timerTemplate = (props: UserCode) => (
    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4 text-muted-foreground" />
      <span className={`font-mono ${props.timeRemaining <= 10 ? 'text-red-500' : 'text-foreground'}`}>
        {props.timeRemaining}s
      </span>
    </div>
  );

  const statusTemplate = (props: UserCode) => (
    <Badge className={props.isActive ? 'bg-green-600' : 'bg-gray-600'}>
      {props.isActive ? 'Active' : 'Inactive'}
    </Badge>
  );

  const filteredCodes = userCodes.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">TOTP Codes</h1>
          <p className="text-muted-foreground mt-2">Current authentication codes for all users</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg border">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              Refreshes in: <span className={`font-mono ${timeLeft <= 10 ? 'text-red-500' : 'text-primary'}`}>{timeLeft}s</span>
            </span>
          </div>
          <Button onClick={refreshCodes} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Codes Grid */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Key className="w-5 h-5 mr-2" />
            Active TOTP Codes ({filteredCodes.length})
          </CardTitle>
          <CardDescription>
            Current time-based one-time passwords for authenticated users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GridComponent
            dataSource={filteredCodes}
            allowPaging={true}
            allowSorting={true}
            pageSettings={{ pageSize: 10 }}
            className="codes-grid"
          >
            <ColumnsDirective>
              <ColumnDirective 
                field="name" 
                headerText="User" 
                width="250" 
                template={userTemplate}
              />
              <ColumnDirective 
                field="currentCode" 
                headerText="Current Code" 
                width="200" 
                template={codeTemplate}
                allowSorting={false}
              />
              <ColumnDirective 
                field="timeRemaining" 
                headerText="Time Left" 
                width="120" 
                template={timerTemplate}
              />
              <ColumnDirective field="issuer" headerText="Issuer" width="150" />
              <ColumnDirective 
                field="isActive" 
                headerText="Status" 
                width="120" 
                template={statusTemplate}
              />
            </ColumnsDirective>
            <Inject services={[Page]} />
          </GridComponent>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground mb-2">About TOTP Codes</h3>
              <p className="text-sm text-muted-foreground">
                These are time-based one-time passwords that refresh every 30 seconds. 
                Users can use these codes along with their regular passwords for two-factor authentication.
                Codes automatically regenerate and are synchronized across all authenticator apps.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}