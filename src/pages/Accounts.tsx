import React, { useState } from 'react';
import { AccountsTable } from '@/components/tables/AccountsTable';
import { AddAccountModal } from '@/components/modals/AddAccountModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Building, User, Clock } from 'lucide-react';
import { Account } from '@/types/admin';
import { toast } from 'sonner';
import { 
  useGetAccountsQuery, 
  useDeleteAccountMutation 
} from '@/redux/api/adminApi';

export function Accounts() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // RTK Query hooks
  const { data: accounts = [], isLoading, error } = useGetAccountsQuery();
  const [deleteAccount] = useDeleteAccountMutation();

  const handleEdit = (account: Account) => {
    toast.info(`Edit account: ${account.account_name}`);
    // TODO: Open edit dialog
  };

  const handleDelete = async (account: Account) => {
    try {
      await deleteAccount(account.account_id).unwrap();
      toast.success(`Account "${account.account_name}" deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete account: ${error}`);
    }
  };

  const handleManageSharing = (account: Account) => {
    toast.info(`Manage sharing for: ${account.account_name}`);
    // TODO: Open sharing management dialog
  };

  const handleAddAccount = () => {
    setShowAddModal(true);
  };

  // Calculate statistics from RTK Query data
  const stats = {
    total: accounts.length,
    personal: accounts.filter(acc => acc.account_type === 'Personal').length,
    business: accounts.filter(acc => acc.account_type === 'Business').length,
    temporary: accounts.filter(acc => acc.account_type === 'Temporary').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading accounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading accounts</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-2">
            Manage user accounts and their sharing relationships across applications
          </p>
        </div>
        <Button onClick={handleAddAccount} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Account</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All account types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.personal}</div>
            <p className="text-xs text-muted-foreground">
              Individual users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.business}</div>
            <p className="text-xs text-muted-foreground">
              Organization accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temporary</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.temporary}</div>
            <p className="text-xs text-muted-foreground">
              Limited access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Account Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-600" />
              <span>Personal Accounts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Individual user accounts with basic permissions. Can receive shared rights from Business accounts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>Business Accounts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Organization accounts that can share their rights with Personal accounts. Enhanced permission management.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Temporary Accounts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Time-limited accounts for temporary access. Automatically expire after a specified duration.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            All accounts that can be assigned rights across applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountsTable
            data={accounts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageSharing={handleManageSharing}
          />
        </CardContent>
      </Card>

      {/* Add Account Modal */}
      <AddAccountModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}