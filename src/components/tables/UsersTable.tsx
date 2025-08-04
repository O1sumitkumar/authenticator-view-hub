import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Shield, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { User } from '@/types/admin';

interface UsersTableProps {
  data: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onManageRights?: (user: User) => void;
  onSendInvite?: (user: User) => void;
}

export function UsersTable({ data, onEdit, onDelete, onManageRights, onSendInvite }: UsersTableProps) {
  const getRoleBadgeClass = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'border-red-200 bg-red-50 text-red-700';
      case 'member':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'viewer':
        return 'border-gray-200 bg-gray-50 text-gray-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'inactive':
        return 'border-gray-200 bg-gray-50 text-gray-700';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'user_role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('user_role') as string;
        return (
          <Badge
            variant="outline"
            className={getRoleBadgeClass(role)}
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant="outline"
            className={getStatusBadgeClass(status)}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'last_login',
      header: 'Last Login',
      cell: ({ row }) => {
        const lastLogin = row.getValue('last_login') as string;
        if (!lastLogin) return <div className="text-sm text-gray-400">Never</div>;
        
        return <div className="text-sm">{new Date(lastLogin).toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageRights?.(user)}>
                <Shield className="mr-2 h-4 w-4" />
                Manage Rights
              </DropdownMenuItem>
              {user.status === 'pending' && (
                <DropdownMenuItem onClick={() => onSendInvite?.(user)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Invite
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete?.(user)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search users..."
    />
  );
}

// Export the User type for use in other components
export type { User };