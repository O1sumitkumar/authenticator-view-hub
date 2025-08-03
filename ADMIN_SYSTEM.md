# Admin System Frontend

This frontend implements the APP-ADMIN system as described in the simplified admin docs. It provides a comprehensive interface for managing user permissions across multiple APP-X applications.

## Features

### 1. Applications Management (`/applications`)
- **Register APP-X applications** with unique identifiers
- **View application status** (active/inactive)
- **Manage application details** including descriptions
- **Statistics dashboard** showing total, active, and inactive applications

### 2. Rights Management (`/rights`)
- **Create JWT rights codes** for user permissions
- **Assign permissions** by level (read, write, admin, owner)
- **Set expiration dates** for security
- **Copy rights codes** for distribution to APP-X applications
- **Track permission levels** across different applications
- **Monitor expiring rights** with visual indicators

### 3. Accounts Management (`/accounts`)
- **Manage account types**: Temporary, Personal, Business
- **Account sharing functionality** - invite accounts to share rights
- **Visual indicators** for account types and sharing status
- **Statistics** for each account type
- **Sharing management dialog** to configure account relationships

### 4. Enhanced Dashboard (`/`)
- **Admin system overview** with key metrics
- **Application statistics** showing registered APP-X apps
- **Rights tracking** with total active permissions
- **Account type breakdown** (Personal, Business, Temporary)
- **Pending invitations** for account sharing

## Key Components

### Data Models
- **Application**: APP-X registration with status tracking
- **Account**: User accounts with types and sharing relationships
- **Rights**: JWT-based permissions with expiration
- **AccountSharing**: Relationships between accounts for rights sharing

### User Interface
- **Modern React components** with shadcn/ui
- **Data grids** with sorting, filtering, and pagination
- **Modal dialogs** for adding/editing records
- **Real-time statistics** and visual indicators
- **Responsive design** for all screen sizes

### Navigation
- **Applications**: `/applications`
- **Rights**: `/rights`
- **Accounts**: `/accounts`
- **Users**: `/users` (existing)
- **Dashboard**: `/` (enhanced with admin stats)

## Workflow Examples

### 1. Registering a New APP-X Application
1. Navigate to Applications page
2. Click "Add Application"
3. Enter application name, ID, and description
4. Set status to "Active"
5. Save - application is now registered and can receive rights requests

### 2. Creating User Rights
1. Navigate to Rights page
2. Click "Add Rights"
3. Select target application and account
4. Choose permission levels (read, write, admin, owner)
5. Set expiration date
6. Save - JWT rights code is generated and stored

### 3. Setting Up Account Sharing
1. Navigate to Accounts page
2. Find the business account
3. Click "Manage Sharing"
4. Invite personal accounts to share business account rights
5. Both accounts now share the same permissions

### 4. APP-X Integration
1. APP-X receives user JWT from Keycloak
2. APP-X requests permissions from APP-ADMIN
3. APP-ADMIN checks Rights table and account sharing
4. Returns appropriate JWT rights code
5. APP-X updates local account with received permissions

## Security Features

- **JWT-based rights codes** with expiration
- **Permission levels** (read, write, admin, owner)
- **Account type restrictions** (Business accounts can share with Personal)
- **Expiration tracking** with visual warnings
- **Audit trail** with creation and update timestamps

## Technical Implementation

- **React 18** with TypeScript
- **shadcn/ui** components for consistent design
- **Syncfusion Grid** for data management
- **Redux** for state management
- **Keycloak integration** for authentication
- **Responsive design** with Tailwind CSS

## Database Schema (Frontend Models)

### Applications Table
```typescript
interface Application {
  id: string;
  name: string;
  applicationId: string; // APP-X identifier
  description?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Accounts Table
```typescript
interface Account {
  id: string;
  name: string;
  accountId: string;
  accountType: 'Temporary' | 'Personal' | 'Business';
  sharedAccounts: string[]; // Account IDs this account shares with
  createdAt: Date;
  updatedAt: Date;
}
```

### Rights Table
```typescript
interface Rights {
  id: string;
  applicationId: string;
  accountId: string;
  rightsCode: string; // JWT token
  permissions: Permission[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Account Sharing Table
```typescript
interface AccountSharing {
  id: string;
  sourceAccountId: string;
  targetAccountId: string;
  status: 'pending' | 'active' | 'revoked';
  invitedBy: string;
  invitedAt: Date;
  expiresAt?: Date;
}
```

## Next Steps

1. **Backend Integration**: Connect to actual API endpoints
2. **Real-time Updates**: Implement WebSocket for live data
3. **Advanced Filtering**: Add more sophisticated search and filter options
4. **Bulk Operations**: Support for bulk rights assignment
5. **Audit Logging**: Track all permission changes
6. **Export Features**: CSV/PDF export of rights and accounts
7. **Notification System**: Alerts for expiring rights and pending invitations

This frontend provides a complete interface for the APP-ADMIN system, enabling centralized management of user permissions across all APP-X applications while maintaining security through JWT tokens and proper account type restrictions. 