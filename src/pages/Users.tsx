import { useState, useEffect } from 'react';
import { ColumnDirective, ColumnsDirective, GridComponent, Toolbar, Edit, Page, Inject } from '@syncfusion/ej2-react-grids';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Shield, 
  ShieldCheck, 
  ShieldOff,
  MoreHorizontal,
  Edit2,
  Trash2,
  Key
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types/auth';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    role: 'admin',
    twoFactorEnabled: true,
    lastLogin: new Date('2024-01-15T10:30:00'),
    status: 'active',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'Marketing',
    role: 'user',
    twoFactorEnabled: true,
    lastLogin: new Date('2024-01-15T09:15:00'),
    status: 'active',
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    department: 'Sales',
    role: 'manager',
    twoFactorEnabled: false,
    lastLogin: new Date('2024-01-14T16:45:00'),
    status: 'active',
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'HR',
    role: 'user',
    twoFactorEnabled: true,
    lastLogin: new Date('2024-01-12T14:20:00'),
    status: 'inactive',
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@company.com',
    department: 'Finance',
    role: 'user',
    twoFactorEnabled: false,
    lastLogin: new Date('2024-01-10T11:30:00'),
    status: 'suspended',
    createdAt: new Date('2023-11-12'),
    updatedAt: new Date('2024-01-10'),
  },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(user => {
        switch (selectedFilter) {
          case 'active': return user.status === 'active';
          case 'inactive': return user.status === 'inactive';
          case 'suspended': return user.status === 'suspended';
          case '2fa-enabled': return user.twoFactorEnabled;
          case '2fa-disabled': return !user.twoFactorEnabled;
          default: return true;
        }
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-600 hover:bg-purple-700">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Manager</Badge>;
      case 'user':
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const get2FAStatus = (enabled: boolean) => {
    return enabled ? (
      <div className="flex items-center text-green-600">
        <ShieldCheck className="w-4 h-4 mr-1" />
        <span className="text-sm">Enabled</span>
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        <ShieldOff className="w-4 h-4 mr-1" />
        <span className="text-sm">Disabled</span>
      </div>
    );
  };

  const userActionsTemplate = (props: User) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Key className="mr-2 h-4 w-4" />
          Reset 2FA
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Shield className="mr-2 h-4 w-4" />
          View Security
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const statusTemplate = (props: User) => getStatusBadge(props.status);
  const roleTemplate = (props: User) => getRoleBadge(props.role);
  const twoFactorTemplate = (props: User) => get2FAStatus(props.twoFactorEnabled);
  const actionsTemplate = (props: User) => userActionsTemplate(props);
  const dateTemplate = (props: User) => (
    <span className="text-sm text-muted-foreground">
      {props.lastLogin.toLocaleDateString()} {props.lastLogin.toLocaleTimeString()}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-2">Manage user accounts and authentication settings</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="2fa-enabled">2FA Enabled</option>
                <option value="2fa-disabled">2FA Disabled</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            User Directory ({filteredUsers.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GridComponent
            dataSource={filteredUsers}
            allowPaging={true}
            allowSorting={true}
            pageSettings={{ pageSize: 10 }}
            className="user-grid"
          >
            <ColumnsDirective>
              <ColumnDirective field="name" headerText="Name" width="180" />
              <ColumnDirective field="email" headerText="Email" width="220" />
              <ColumnDirective field="department" headerText="Department" width="140" />
              <ColumnDirective 
                field="role" 
                headerText="Role" 
                width="120" 
                template={roleTemplate}
              />
              <ColumnDirective 
                field="status" 
                headerText="Status" 
                width="120" 
                template={statusTemplate}
              />
              <ColumnDirective 
                field="twoFactorEnabled" 
                headerText="2FA Status" 
                width="140" 
                template={twoFactorTemplate}
              />
              <ColumnDirective 
                field="lastLogin" 
                headerText="Last Login" 
                width="180" 
                template={dateTemplate}
              />
              <ColumnDirective 
                headerText="Actions" 
                width="100" 
                template={actionsTemplate}
                allowSorting={false}
              />
            </ColumnsDirective>
            <Inject services={[Page, Toolbar, Edit]} />
          </GridComponent>
        </CardContent>
      </Card>
    </div>
  );
}