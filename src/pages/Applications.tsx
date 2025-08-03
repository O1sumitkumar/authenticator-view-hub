import { useState, useEffect } from "react";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Toolbar,
  Edit,
  Page,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Key,
  Globe,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Application } from "@/types/auth";

const mockApplications: Application[] = [
  {
    id: "1",
    name: "APP-X1",
    applicationId: "app-x1",
    description: "Main business application for data management",
    status: "active",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "APP-X2",
    applicationId: "app-x2",
    description: "Customer relationship management system",
    status: "active",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    name: "APP-X3",
    applicationId: "app-x3",
    description: "Financial reporting and analytics platform",
    status: "inactive",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "4",
    name: "APP-X4",
    applicationId: "app-x4",
    description: "Human resources management system",
    status: "active",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-13"),
  },
];

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [newApplication, setNewApplication] = useState({
    name: "",
    applicationId: "",
    description: "",
    status: "active" as "active" | "inactive",
  });

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAddApplication = () => {
    const newApp: Application = {
      id: Date.now().toString(),
      ...newApplication,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setApplications([...applications, newApp]);
    setNewApplication({
      name: "",
      applicationId: "",
      description: "",
      status: "active",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditApplication = () => {
    if (!selectedApplication) return;
    
    const updatedApplications = applications.map((app) =>
      app.id === selectedApplication.id
        ? { ...selectedApplication, updatedAt: new Date() }
        : app
    );
    setApplications(updatedApplications);
    setSelectedApplication(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const applicationActionsTemplate = (props: Application) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedApplication(props);
            setIsEditDialogOpen(true);
          }}
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDeleteApplication(props.id)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const statusTemplate = (props: Application) => getStatusBadge(props.status);
  const actionsTemplate = (props: Application) => applicationActionsTemplate(props);
  const dateTemplate = (props: Application) => (
    <span>{props.createdAt.toLocaleDateString()}</span>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Manage APP-X applications and their registration status
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
              <DialogDescription>
                Register a new APP-X application to the admin system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newApplication.name}
                  onChange={(e) =>
                    setNewApplication({ ...newApplication, name: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="APP-X1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applicationId" className="text-right">
                  App ID
                </Label>
                <Input
                  id="applicationId"
                  value={newApplication.applicationId}
                  onChange={(e) =>
                    setNewApplication({ ...newApplication, applicationId: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="app-x1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newApplication.description}
                  onChange={(e) =>
                    setNewApplication({ ...newApplication, description: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Application description..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newApplication.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setNewApplication({ ...newApplication, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddApplication}>Add Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered APP-X applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter((app) => app.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Applications</CardTitle>
            <ShieldOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter((app) => app.status === "inactive").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Disabled applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter((app) => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return app.updatedAt > oneWeekAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Updated in last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Applications ({filteredApplications.length} total)</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <GridComponent
            dataSource={filteredApplications}
            allowPaging={true}
            pageSettings={{ pageSize: 10, pageSizes: [5, 10, 20, 50] }}
            allowSorting={true}
            allowFiltering={true}
            height="auto"
            className="applications-grid"
          >
            <ColumnsDirective>
              <ColumnDirective
                field="name"
                headerText="Name"
                width="150"
                template={(props: Application) => (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{props.name}</span>
                  </div>
                )}
              />
              <ColumnDirective
                field="applicationId"
                headerText="Application ID"
                width="150"
              />
              <ColumnDirective
                field="description"
                headerText="Description"
                width="200"
              />
              <ColumnDirective
                field="status"
                headerText="Status"
                width="100"
                template={statusTemplate}
              />
              <ColumnDirective
                field="createdAt"
                headerText="Created"
                width="120"
                template={dateTemplate}
              />
              <ColumnDirective
                field="updatedAt"
                headerText="Updated"
                width="120"
                template={(props: Application) => (
                  <span>{props.updatedAt.toLocaleDateString()}</span>
                )}
              />
              <ColumnDirective
                field="actions"
                headerText="Actions"
                width="100"
                template={actionsTemplate}
              />
            </ColumnsDirective>
            <Inject services={[Page, Toolbar, Edit]} />
          </GridComponent>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>
              Update application details and status.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedApplication.name}
                  onChange={(e) =>
                    setSelectedApplication({ ...selectedApplication, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-applicationId" className="text-right">
                  App ID
                </Label>
                <Input
                  id="edit-applicationId"
                  value={selectedApplication.applicationId}
                  onChange={(e) =>
                    setSelectedApplication({ ...selectedApplication, applicationId: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedApplication.description || ""}
                  onChange={(e) =>
                    setSelectedApplication({ ...selectedApplication, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedApplication.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setSelectedApplication({ ...selectedApplication, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditApplication}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 