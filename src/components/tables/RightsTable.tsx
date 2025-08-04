import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Rights } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';

interface RightsTableProps {
  data: Rights[];
  onEdit?: (rights: Rights) => void;
  onRevoke?: (rights: Rights) => void;
  onCopyCode?: (rightsCode: string) => void;
}

export function RightsTable({ data, onEdit, onRevoke, onCopyCode }: RightsTableProps) {
  const handleCopyCode = (rightsCode: string) => {
    navigator.clipboard.writeText(rightsCode);
    toast.success('Rights code copied to clipboard');
    onCopyCode?.(rightsCode);
  };

  const isExpiringSoon = (expiresAt: Date): boolean => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    return new Date(expiresAt) <= sevenDaysFromNow;
  };

  const columns: ColumnDef<Rights>[] = [
    {
      accessorKey: 'application_id',
      header: 'Application',
      cell: ({ row }) => (
        <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          APP-{row.getValue('application_id')}
        </code>
      ),
    },
    {
      accessorKey: 'account_id',
      header: 'Account',
      cell: ({ row }) => (
        <div className="font-medium">Account-{row.getValue('account_id')}</div>
      ),
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const permissions = row.getValue('permissions') as any[];
        return (
          <div className="flex flex-wrap gap-1">
            {permissions.map((permission, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {permission.level}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'rights_code_jwt',
      header: 'Rights Code',
      cell: ({ row }) => {
        const rightsCode = row.getValue('rights_code_jwt') as string;
        return (
          <div className="flex items-center space-x-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-xs max-w-[100px] truncate">
              {rightsCode.substring(0, 20)}...
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyCode?.(rightsCode)}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean;
        const expiresAt = new Date(row.original.expires_at);
        const isExpired = expiresAt < new Date();
        
        return (
          <Badge
            variant={isActive && !isExpired ? 'default' : 'destructive'}
            className={
              isActive && !isExpired
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }
          >
            {isActive && !isExpired ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'expires_at',
      header: 'Expires',
      cell: ({ row }) => {
        const expiresAt = new Date(row.getValue('expires_at'));
        const expiringSoon = isExpiringSoon(expiresAt);
        const isExpired = expiresAt < new Date();
        
        return (
          <div className="flex items-center space-x-2">
            <div className="text-sm">{expiresAt.toLocaleDateString()}</div>
            {isExpired && (
              <Badge variant="destructive" className="text-xs">
                Expired
              </Badge>
            )}
            {!isExpired && expiringSoon && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                Soon
              </Badge>
            )}
          </div>
        );
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
        const rights = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(rights)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyCode(rights.rightsCode)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onRevoke?.(rights)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Revoke
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
      searchKey="application_id"
      searchPlaceholder="Search rights..."
    />
  );
}