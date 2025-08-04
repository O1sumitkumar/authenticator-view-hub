import { useState } from 'react';
import { ApplicationsTable } from '@/components/tables/ApplicationsTable';
import { AddApplicationModal } from '@/components/modals/AddApplicationModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, AppWindow, Activity, Pause } from 'lucide-react';
import { Application } from '@/types/admin';
import { toast } from 'sonner';
import { 
  useGetApplicationsQuery, 
  useDeleteApplicationMutation 
} from '@/redux/api/adminApi';

export function Applications() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // RTK Query hooks
  const { data: applications = [], isLoading, error } = useGetApplicationsQuery();
  const [deleteApplication] = useDeleteApplicationMutation();
  const handleEdit = (application: Application) => {
    toast.info(`Edit application: ${application.application_name}`);
    // TODO: Open edit dialog
  };

  const handleDelete = async (application: Application) => {
    try {
      await deleteApplication(application.application_id).unwrap();
      toast.success(`Application "${application.application_name}" deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete application: ${error}`);
    }
  };

  const handleAddApplication = () => {
    setShowAddModal(true);
  };

  // Calculate statistics from RTK Query data
  const stats = {
    total: applications.length,
    active: applications.filter(app => app.status === 'active').length,
    inactive: applications.filter(app => app.status === 'maintenance' || app.status === 'deprecated').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading applications</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all registered applications in your ecosystem
          </p>
        </div>
        <Button onClick={handleAddApplication} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Application</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <AppWindow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registered in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Applications</CardTitle>
            <Pause className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Temporarily disabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Applications</CardTitle>
          <CardDescription>
            All applications that can request permissions from this admin system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationsTable
            data={applications}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Add Application Modal */}
      <AddApplicationModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}