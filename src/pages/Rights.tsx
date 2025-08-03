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
  Key,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Clock,
  User,
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
import { Checkbox } from "@/components/ui/checkbox";
import type { Rights, Application, Account, Permission } from "@/types/auth";

const mockApplications: Application[] = [
  { id: "1", name: "APP-X1", applicationId: "app-x1", status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "APP-X2", applicationId: "app-x2", status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "APP-X3", applicationId: "app-x3", status: "active", createdAt: new Date(), updatedAt: new Date() },
  { id: "4", name: "APP-X4", applicationId: "app-x4", status: "active", createdAt: new Date(), updatedAt: new Date() },
];

const mockAccounts: Account[] = [
  { id: "1", name: "John Doe", accountId: "acc-101", accountType: "Personal", sharedAccounts: [], createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Jane Smith", accountId: "acc-102", accountType: "Personal", sharedAccounts: [], createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Company Corp", accountId: "acc-200", accountType: "Business", sharedAccounts: ["acc-101"], createdAt: new Date(), updatedAt: new Date() },
  { id: "4", name: "Temporary User", accountId: "acc-301", accountType: "Temporary", sharedAccounts: [], createdAt: new Date(), updatedAt: new Date() },
];

const mockRights: Rights[] = [
  {
    id: "1",
    applicationId: "app-x1",
    accountId: "acc-101",
    rightsCode: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    permissions: [
      { id: "1", name: "Admin Access", description: "Full administrative access", level: "admin", resources: ["*"] },
      { id: "2", name: "User Management", description: "Manage users and permissions", level: "write", resources: ["users", "permissions"] },
    ],
    expiresAt: new Date("2024-12-31"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    applicationId: "app-x2",
    accountId: "acc-101",
    rightsCode: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    permissions: [
      { id: "3", name: "Read Only", description: "View data only", level: "read", resources: ["data", "reports"] },
    ],
    expiresAt: new Date("2024-12-31"),
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    applicationId: "app-x1",
    accountId: "acc-200",
    rightsCode: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    permissions: [
      { id: "4", name: "Company Admin", description: "Company-wide administrative access", level: "admin", resources: ["*"] },
    ],
    expiresAt: new Date("2024-12-31"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-13"),
  },
];

const permissionLevels = [
  { value: "read", label: "Read Only", description: "Can view data only" },
  { value: "write", label: "Editor", description: "Can read and write data" },
  { value: "admin", label: "Administrator", description: "Full administrative access" },
  { value: "owner", label: "Owner", description: "Complete control over the application" },
];

export default function Rights() {
  const [rights, setRights] = useState<Rights[]>(mockRights);
  const [applications] = useState<Application[]>(mockApplications);
  const [accounts] = useState<Account[]>(mockAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRight, setSelectedRight] = useState<Rights | null>(null);
  const [newRight, setNewRight] = useState({
    applicationId: "",
    accountId: "",
    permissions: [] as Permission[],
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  });

  const filteredRights = rights.filter((right) => {
    const app = applications.find(a => a.applicationId === right.applicationId);
    const account = accounts.find(a => a.accountId === right.accountId);
    return (
      app?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      right.accountId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.accountId === accountId);
    return account?.name || accountId;
  };

  const getApplicationName = (applicationId: string) => {
    const app = applications.find(a => a.applicationId === applicationId);
    return app?.name || applicationId;
  };

  const getAccountType = (accountId: string) => {
    const account = accounts.find(a => a.accountId === accountId);
    return account?.accountType || "Unknown";
  };

  const getExpirationStatus = (expiresAt: Date) => {
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: "expired", color: "bg-red-100 text-red-800", text: "Expired" };
    } else if (daysUntilExpiry <= 30) {
      return { status: "expiring", color: "bg-yellow-100 text-yellow-800", text: `Expires in ${daysUntilExpiry} days` };
    } else {
      return { status: "valid", color: "bg-green-100 text-green-800", text: "Valid" };
    }
  };

  const getPermissionLevel = (permissions: Permission[]) => {
    if (permissions.some(p => p.level === "owner")) return "Owner";
    if (permissions.some(p => p.level === "admin")) return "Admin";
    if (permissions.some(p => p.level === "write")) return "Editor";
    if (permissions.some(p => p.level === "read")) return "Read Only";
    return "No Access";
  };

  const handleAddRight = () => {
    const newRightEntry: Rights = {
      id: Date.now().toString(),
      ...newRight,
      rightsCode: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRights([...rights, newRightEntry]);
    setNewRight({
      applicationId: "",
      accountId: "",
      permissions: [],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
    setIsAddDialogOpen(false);
  };

  const handleEditRight = () => {
    if (!selectedRight) return;
    
    const updatedRights = rights.map((right) =>
      right.id === selectedRight.id
        ? { ...selectedRight, updatedAt: new Date() }
        : right
    );
    setRights(updatedRights);
    setSelectedRight(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteRight = (id: string) => {
    setRights(rights.filter((right) => right.id !== id));
  };

  const copyRightsCode = (rightsCode: string) => {
    navigator.clipboard.writeText(rightsCode);
    // You could add a toast notification here
  };

  const rightsActionsTemplate = (props: Rights) => (
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
            setSelectedRight(props);
            setIsEditDialogOpen(true);
          }}
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => copyRightsCode(props.rightsCode)}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Rights Code
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDeleteRight(props.id)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const accountTemplate = (props: Rights) => (
    <div className="flex items-center space-x-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="font-medium">{getAccountName(props.accountId)}</div>
        <div className="text-xs text-muted-foreground">{props.accountId}</div>
      </div>
    </div>
  );

  const applicationTemplate = (props: Rights) => (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{getApplicationName(props.applicationId)}</span>
    </div>
  );

  const permissionsTemplate = (props: Rights) => (
    <Badge variant="outline">{getPermissionLevel(props.permissions)}</Badge>
  );

  const expirationTemplate = (props: Rights) => {
    const status = getExpirationStatus(props.expiresAt);
    return (
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Badge className={status.color}>{status.text}</Badge>
      </div>
    );
  };

  const actionsTemplate = (props: Rights) => rightsActionsTemplate(props);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rights Management</h1>
          <p className="text-muted-foreground">
            Manage user permissions and JWT rights codes across applications
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Rights
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Rights</DialogTitle>
              <DialogDescription>
                Create new rights for a user account in a specific application.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="application" className="text-right">
                  Application
                </Label>
                <Select
                  value={newRight.applicationId}
                  onValueChange={(value) =>
                    setNewRight({ ...newRight, applicationId: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.filter(app => app.status === "active").map((app) => (
                      <SelectItem key={app.id} value={app.applicationId}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="account" className="text-right">
                  Account
                </Label>
                <Select
                  value={newRight.accountId}
                  onValueChange={(value) =>
                    setNewRight({ ...newRight, accountId: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.accountId}>
                        {account.name} ({account.accountType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Permissions</Label>
                <div className="col-span-3 space-y-2">
                  {permissionLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={level.value}
                        checked={newRight.permissions.some(p => p.level === level.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewRight({
                              ...newRight,
                              permissions: [
                                ...newRight.permissions,
                                {
                                  id: Date.now().toString(),
                                  name: level.label,
                                  description: level.description,
                                  level: level.value as any,
                                  resources: ["*"],
                                },
                              ],
                            });
                          } else {
                            setNewRight({
                              ...newRight,
                              permissions: newRight.permissions.filter(p => p.level !== level.value),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={level.value} className="text-sm font-normal">
                        {level.label} - {level.description}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiresAt" className="text-right">
                  Expires At
                </Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={newRight.expiresAt.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setNewRight({ ...newRight, expiresAt: new Date(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRight}>Add Rights</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rights</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rights.length}</div>
            <p className="text-xs text-muted-foreground">
              Active rights entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid Rights</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rights.filter(right => getExpirationStatus(right.expiresAt).status === "valid").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Non-expired rights
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rights.filter(right => getExpirationStatus(right.expiresAt).status === "expiring").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Expire within 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Rights</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rights.filter(right => getPermissionLevel(right.permissions) === "Admin" || getPermissionLevel(right.permissions) === "Owner").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Administrative permissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Rights ({filteredRights.length} total)</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64 bg-background/50"
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
            dataSource={filteredRights}
            allowPaging={true}
            pageSettings={{ pageSize: 10, pageSizes: [5, 10, 20, 50] }}
            allowSorting={true}
            allowFiltering={true}
            height="auto"
            className="rights-grid"
          >
            <ColumnsDirective>
              <ColumnDirective
                field="accountId"
                headerText="Account"
                width="200"
                template={accountTemplate}
              />
              <ColumnDirective
                field="applicationId"
                headerText="Application"
                width="150"
                template={applicationTemplate}
              />
              <ColumnDirective
                field="permissions"
                headerText="Permissions"
                width="120"
                template={permissionsTemplate}
              />
              <ColumnDirective
                field="expiresAt"
                headerText="Expiration"
                width="150"
                template={expirationTemplate}
              />
              <ColumnDirective
                field="createdAt"
                headerText="Created"
                width="120"
                template={(props: Rights) => (
                  <span>{props.createdAt.toLocaleDateString()}</span>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Rights</DialogTitle>
            <DialogDescription>
              Update rights permissions and expiration.
            </DialogDescription>
          </DialogHeader>
          {selectedRight && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Application</Label>
                <div className="col-span-3">
                  <Badge variant="outline">{getApplicationName(selectedRight.applicationId)}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Account</Label>
                <div className="col-span-3">
                  <Badge variant="outline">{getAccountName(selectedRight.accountId)}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Permissions</Label>
                <div className="col-span-3 space-y-2">
                  {permissionLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${level.value}`}
                        checked={selectedRight.permissions.some(p => p.level === level.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRight({
                              ...selectedRight,
                              permissions: [
                                ...selectedRight.permissions,
                                {
                                  id: Date.now().toString(),
                                  name: level.label,
                                  description: level.description,
                                  level: level.value as any,
                                  resources: ["*"],
                                },
                              ],
                            });
                          } else {
                            setSelectedRight({
                              ...selectedRight,
                              permissions: selectedRight.permissions.filter(p => p.level !== level.value),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`edit-${level.value}`} className="text-sm font-normal">
                        {level.label} - {level.description}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-expiresAt" className="text-right">
                  Expires At
                </Label>
                <Input
                  id="edit-expiresAt"
                  type="date"
                  value={selectedRight.expiresAt.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setSelectedRight({ ...selectedRight, expiresAt: new Date(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRight}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 