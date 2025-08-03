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
  Users,
  MoreHorizontal,
  Edit2,
  Trash2,
  User,
  Building,
  Clock,
  Share2,
  Mail,
  Settings,
  Globe,
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
import type { Account, AccountSharing, AccountUser } from "@/types/auth";

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "John Doe",
    accountId: "acc-101",
    accountType: "Personal",
    sharedAccounts: [],
    users: ["user-101"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    accountId: "acc-102",
    accountType: "Personal",
    sharedAccounts: ["acc-200"],
    users: ["user-102"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    name: "Company Corp",
    accountId: "acc-200",
    accountType: "Business",
    sharedAccounts: ["acc-101", "acc-102"],
    users: ["user-201", "user-202", "user-203"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "4",
    name: "Temporary User",
    accountId: "acc-301",
    accountType: "Temporary",
    sharedAccounts: [],
    users: ["user-301"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    name: "Marketing Team",
    accountId: "acc-400",
    accountType: "Business",
    sharedAccounts: ["acc-500"],
    users: ["user-401", "user-402"],
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: "6",
    name: "Sarah Johnson",
    accountId: "acc-500",
    accountType: "Personal",
    sharedAccounts: ["acc-400"],
    users: ["user-501"],
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-10"),
  },
];

const mockAccountUsers: AccountUser[] = [
  {
    id: "1",
    userId: "user-101",
    accountId: "acc-101",
    email: "john.doe@company.com",
    name: "John Doe",
    role: "owner",
    status: "active",
    addedAt: new Date("2024-01-01"),
    addedBy: "admin@company.com",
  },
  {
    id: "2",
    userId: "user-102",
    accountId: "acc-102",
    email: "jane.smith@company.com",
    name: "Jane Smith",
    role: "owner",
    status: "active",
    addedAt: new Date("2024-01-05"),
    addedBy: "admin@company.com",
  },
  {
    id: "3",
    userId: "user-201",
    accountId: "acc-200",
    email: "ceo@company.com",
    name: "CEO Company",
    role: "owner",
    status: "active",
    addedAt: new Date("2024-01-01"),
    addedBy: "admin@company.com",
  },
  {
    id: "4",
    userId: "user-202",
    accountId: "acc-200",
    email: "manager@company.com",
    name: "Manager User",
    role: "admin",
    status: "active",
    addedAt: new Date("2024-01-02"),
    addedBy: "ceo@company.com",
  },
  {
    id: "5",
    userId: "user-203",
    accountId: "acc-200",
    email: "employee@company.com",
    name: "Employee User",
    role: "user",
    status: "active",
    addedAt: new Date("2024-01-03"),
    addedBy: "manager@company.com",
  },
];

const mockAccountSharing: AccountSharing[] = [
  {
    id: "1",
    sourceAccountId: "acc-200",
    targetAccountId: "acc-101",
    status: "active",
    invitedBy: "admin@company.com",
    invitedAt: new Date("2024-01-05"),
  },
  {
    id: "2",
    sourceAccountId: "acc-200",
    targetAccountId: "acc-102",
    status: "active",
    invitedBy: "admin@company.com",
    invitedAt: new Date("2024-01-06"),
  },
  {
    id: "3",
    sourceAccountId: "acc-400",
    targetAccountId: "acc-500",
    status: "active",
    invitedBy: "admin@company.com",
    invitedAt: new Date("2024-01-08"),
  },
];

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [accountSharing] = useState<AccountSharing[]>(mockAccountSharing);
  const [accountUsers] = useState<AccountUser[]>(mockAccountUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false);
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: "",
    accountId: "",
    accountType: "Temporary" as "Temporary" | "Personal" | "Business",
    sharedAccounts: [] as string[],
    users: [] as string[],
  });
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "user" as "owner" | "admin" | "user",
  });

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAccountTypeBadge = (accountType: string) => {
    switch (accountType) {
      case "Temporary":
        return <Badge variant="secondary">Temporary</Badge>;
      case "Personal":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Personal</Badge>;
      case "Business":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Business</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAccountIcon = (accountType: string) => {
    switch (accountType) {
      case "Temporary":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "Personal":
        return <User className="h-4 w-4 text-muted-foreground" />;
      case "Business":
        return <Building className="h-4 w-4 text-muted-foreground" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSharedAccountsCount = (accountId: string) => {
    return accountSharing.filter(sharing => 
      sharing.sourceAccountId === accountId && sharing.status === "active"
    ).length;
  };

  const getSharedWithCount = (accountId: string) => {
    return accountSharing.filter(sharing => 
      sharing.targetAccountId === accountId && sharing.status === "active"
    ).length;
  };

  const handleAddAccount = () => {
    const newAccountEntry: Account = {
      id: Date.now().toString(),
      ...newAccount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAccounts([...accounts, newAccountEntry]);
    setNewAccount({
      name: "",
      accountId: "",
      accountType: "Temporary",
      sharedAccounts: [],
    });
    setIsAddDialogOpen(false);
  };

  const handleEditAccount = () => {
    if (!selectedAccount) return;
    
    const updatedAccounts = accounts.map((account) =>
      account.id === selectedAccount.id
        ? { ...selectedAccount, updatedAt: new Date() }
        : account
    );
    setAccounts(updatedAccounts);
    setSelectedAccount(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const getUsersForAccount = (accountId: string) => {
    return accountUsers.filter(user => user.accountId === accountId);
  };

  const handleAddUserToAccount = () => {
    if (!selectedAccount || !newUser.email || !newUser.name) return;
    
    const newAccountUser: AccountUser = {
      id: Date.now().toString(),
      userId: `user-${Date.now()}`,
      accountId: selectedAccount.accountId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: "active",
      addedAt: new Date(),
      addedBy: "admin@company.com",
    };
    
    // In a real app, you'd update the backend here
    console.log("Adding user to account:", newAccountUser);
    
    setNewUser({
      email: "",
      name: "",
      role: "user",
    });
    setIsUsersDialogOpen(false);
  };

  const handleRemoveUserFromAccount = (userId: string, accountId: string) => {
    // In a real app, you'd update the backend here
    console.log("Removing user from account:", { userId, accountId });
  };

  const accountActionsTemplate = (props: Account) => (
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
            setSelectedAccount(props);
            setIsEditDialogOpen(true);
          }}
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedAccount(props);
            setIsUsersDialogOpen(true);
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          Manage Users
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedAccount(props);
            setIsSharingDialogOpen(true);
          }}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Manage Sharing
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDeleteAccount(props.id)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const accountTemplate = (props: Account) => (
    <div className="flex items-center space-x-2">
      {getAccountIcon(props.accountType)}
      <div>
        <div className="font-medium">{props.name}</div>
        <div className="text-xs text-muted-foreground">{props.accountId}</div>
      </div>
    </div>
  );

  const typeTemplate = (props: Account) => getAccountTypeBadge(props.accountType);
  const sharingTemplate = (props: Account) => (
    <div className="flex items-center space-x-2">
      <div className="text-center">
        <div className="text-sm font-medium">{getSharedAccountsCount(props.accountId)}</div>
        <div className="text-xs text-muted-foreground">Shared</div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium">{getSharedWithCount(props.accountId)}</div>
        <div className="text-xs text-muted-foreground">Shared With</div>
      </div>
    </div>
  );

  const usersTemplate = (props: Account) => {
    const userCount = getUsersForAccount(props.accountId).length;
    return (
      <div className="text-center">
        <div className="text-sm font-medium">{userCount}</div>
        <div className="text-xs text-muted-foreground">Users</div>
      </div>
    );
  };
  const actionsTemplate = (props: Account) => accountActionsTemplate(props);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage account types and sharing permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>
                Create a new account with specific type and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Account name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountId" className="text-right">
                  Account ID
                </Label>
                <Input
                  id="accountId"
                  value={newAccount.accountId}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, accountId: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="acc-xxx"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountType" className="text-right">
                  Type
                </Label>
                <Select
                  value={newAccount.accountType}
                  onValueChange={(value: "Temporary" | "Personal" | "Business") =>
                    setNewAccount({ ...newAccount, accountType: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAccount}>Add Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground">
              All account types
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Accounts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(account => account.accountType === "Personal").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Individual user accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Accounts</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(account => account.accountType === "Business").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Corporate accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temporary Accounts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(account => account.accountType === "Temporary").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-created accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Accounts ({filteredAccounts.length} total)</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
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
            dataSource={filteredAccounts}
            allowPaging={true}
            pageSettings={{ pageSize: 10, pageSizes: [5, 10, 20, 50] }}
            allowSorting={true}
            allowFiltering={true}
            height="auto"
            className="accounts-grid"
          >
            <ColumnsDirective>
              <ColumnDirective
                field="name"
                headerText="Account"
                width="200"
                template={accountTemplate}
              />
              <ColumnDirective
                field="accountType"
                headerText="Type"
                width="120"
                template={typeTemplate}
              />
              <ColumnDirective
                field="sharedAccounts"
                headerText="Sharing"
                width="150"
                template={sharingTemplate}
              />
              <ColumnDirective
                field="users"
                headerText="Users"
                width="100"
                template={usersTemplate}
              />
              <ColumnDirective
                field="createdAt"
                headerText="Created"
                width="120"
                template={(props: Account) => (
                  <span>{props.createdAt.toLocaleDateString()}</span>
                )}
              />
              <ColumnDirective
                field="updatedAt"
                headerText="Updated"
                width="120"
                template={(props: Account) => (
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
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update account details and type.
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedAccount.name}
                  onChange={(e) =>
                    setSelectedAccount({ ...selectedAccount, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-accountId" className="text-right">
                  Account ID
                </Label>
                <Input
                  id="edit-accountId"
                  value={selectedAccount.accountId}
                  onChange={(e) =>
                    setSelectedAccount({ ...selectedAccount, accountId: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-accountType" className="text-right">
                  Type
                </Label>
                <Select
                  value={selectedAccount.accountType}
                  onValueChange={(value: "Temporary" | "Personal" | "Business") =>
                    setSelectedAccount({ ...selectedAccount, accountType: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAccount}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sharing Management Dialog */}
      <Dialog open={isSharingDialogOpen} onOpenChange={setIsSharingDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Account Sharing</DialogTitle>
            <DialogDescription>
              Configure which accounts can share rights with this account.
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getAccountIcon(selectedAccount.accountType)}
                <div>
                  <div className="font-medium">{selectedAccount.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedAccount.accountId}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Accounts that can share with this account:</h4>
                  <div className="space-y-2">
                    {accountSharing
                      .filter(sharing => sharing.targetAccountId === selectedAccount.accountId && sharing.status === "active")
                      .map(sharing => {
                        const sourceAccount = accounts.find(a => a.accountId === sharing.sourceAccountId);
                        return (
                          <div key={sharing.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              {getAccountIcon(sourceAccount?.accountType || "Personal")}
                              <span>{sourceAccount?.name || sharing.sourceAccountId}</span>
                              <Badge variant="outline">{sourceAccount?.accountType}</Badge>
                            </div>
                            <Button variant="outline" size="sm">Remove</Button>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Accounts this account shares with:</h4>
                  <div className="space-y-2">
                    {accountSharing
                      .filter(sharing => sharing.sourceAccountId === selectedAccount.accountId && sharing.status === "active")
                      .map(sharing => {
                        const targetAccount = accounts.find(a => a.accountId === sharing.targetAccountId);
                        return (
                          <div key={sharing.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              {getAccountIcon(targetAccount?.accountType || "Personal")}
                              <span>{targetAccount?.name || sharing.targetAccountId}</span>
                              <Badge variant="outline">{targetAccount?.accountType}</Badge>
                            </div>
                            <Button variant="outline" size="sm">Remove</Button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSharingDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Management Dialog */}
      <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Account Users</DialogTitle>
            <DialogDescription>
              Add and manage users for this account.
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getAccountIcon(selectedAccount.accountType)}
                <div>
                  <div className="font-medium">{selectedAccount.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedAccount.accountId}</div>
                </div>
              </div>
              
              {/* Add New User */}
              <div className="space-y-4">
                <h4 className="font-medium">Add New User</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="user@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-name">Name</Label>
                    <Input
                      id="user-name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="User Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: "owner" | "admin" | "user") =>
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddUserToAccount} disabled={!newUser.email || !newUser.name}>
                  Add User
                </Button>
              </div>

              {/* Current Users */}
              <div className="space-y-4">
                <h4 className="font-medium">Current Users</h4>
                <div className="space-y-2">
                  {getUsersForAccount(selectedAccount.accountId).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveUserFromAccount(user.userId, user.accountId)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  {getUsersForAccount(selectedAccount.accountId).length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No users assigned to this account
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUsersDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 