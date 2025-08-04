import React, { useState } from 'react';
import { RightsTable } from '@/components/tables/RightsTable';
import { AddRightsModal } from '@/components/modals/AddRightsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Shield, Clock, AlertTriangle } from 'lucide-react';
import type { Rights } from '@/types/admin';
import { toast } from 'sonner';
import {
  useGetRightsQuery,
  useRevokeRightsMutation
} from '@/redux/api/adminApi';

export function Rights() {
  const [showAddModal, setShowAddModal] = useState(false);

  // RTK Query hooks
  const { data: rights = [], isLoading, error } = useGetRightsQuery();
  const [revokeRights] = useRevokeRightsMutation();

  const handleEdit = (rights: Rights) => {
    toast.info(`Edit rights for: ${rights.account_id}`);
    // TODO: Open edit dialog
  };

  const handleRevoke = async (rights: Rights) => {
    try {
      await revokeRights({ id: rights.rights_id, revokedBy: 1 }).unwrap(); // TODO: Use actual current user ID
      toast.success(`Rights revoked successfully`);
    } catch (error) {
      toast.error(`Failed to revoke rights: ${error}`);
    }
  };

  const handleCopyCode = (rightsCode: string) => {
    navigator.clipboard.writeText(rightsCode);
    toast.success('Rights code copied to clipboard');
  };

  const handleAddRights = () => {
    setShowAddModal(true);
  };

  // Calculate statistics from RTK Query data
  const stats = {
    total: rights.length,
    active: rights.filter(right => right.is_active && new Date(right.expires_at) > new Date()).length,
    expiringSoon: rights.filter(right => {
      if (!right.is_active) return false;
      const expirationDate = new Date(right.expires_at);
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      return expirationDate <= sevenDaysFromNow && expirationDate > new Date();
    }).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading rights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading rights</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rights Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage JWT-based rights codes for user access across applications
          </p>
        </div>
        <Button onClick={handleAddRights} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Rights</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rights</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              JWT rights codes created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rights</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently valid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">
              Within 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rights Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rights Assignments</CardTitle>
          <CardDescription>
            All JWT rights codes with their permissions and expiration dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RightsTable
            data={rights}
            onEdit={handleEdit}
            onRevoke={handleRevoke}
            onCopyCode={handleCopyCode}
          />
        </CardContent>
      </Card>

      {/* Add Rights Modal */}
      <AddRightsModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}