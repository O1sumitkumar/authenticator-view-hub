import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Account } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';

interface AccountsTableProps {
  data: Account[];
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
  onManageSharing?: (account: Account) => void;
}

export function AccountsTable({ data, onEdit, onDelete, onManageSharing }: AccountsTableProps) {
  const getAccountTypeBadgeClass = (accountType: string): string => {
    switch (accountType.toLowerCase()) {
      case 'business':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'personal':
        return 'border-purple-200 bg-purple-50 text-purple-700';
      case 'temporary':
        return 'border-orange-200 bg-orange-50 text-orange-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const columns: ColumnDef<Account>[] = [
    {
      accessorKey: 'account_name',
      header: 'Account Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('account_name')}</div>
      ),
    },
    {
      accessorKey: 'right_code',
      header: 'Rights Code',
      cell: ({ row }) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          {row.getValue('right_code')}
        </code>
      ),
    },
    {
      accessorKey: 'account_type',
      header: 'Type',
      cell: ({ row }) => {
        const accountType = row.getValue('account_type') as string;
        return (
          <Badge
            variant="outline"
            className={getAccountTypeBadgeClass(accountType)}
          >
            {accountType}
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
            variant={status === 'active' ? 'default' : 'secondary'}
            className={
              status === 'active'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : status === 'trial'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }
          >
            {status}
          </Badge>
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
        const account = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(account)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageSharing?.(account)}>
                <Users className="mr-2 h-4 w-4" />
                Manage Sharing
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(account)}
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
      searchKey="account_name"
      searchPlaceholder="Search accounts..."
    />
  );
}