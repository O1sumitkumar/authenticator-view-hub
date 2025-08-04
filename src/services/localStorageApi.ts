// LocalStorage utility functions for RTK Query
import { Application, Account, User, Rights, Invitation } from '@/types/admin';

const STORAGE_KEYS = {
  APPLICATIONS: 'admin_applications',
  ACCOUNTS: 'admin_accounts',
  USERS: 'admin_users',
  RIGHTS: 'admin_rights',
  INVITATIONS: 'admin_invitations',
} as const;

// Generic localStorage utilities
export class LocalStorageService {
  static get<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return [];
    }
  }

  static set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
    }
  }

  static generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
}

// Application operations
export class ApplicationStorage {
  static getAll(): Application[] {
    return LocalStorageService.get<Application>(STORAGE_KEYS.APPLICATIONS);
  }

  static create(data: Omit<Application, 'application_id' | 'created_at' | 'updated_at'>): Application {
    const applications = this.getAll();
    const newApplication: Application = {
      ...data,
      application_id: LocalStorageService.generateId(),
      created_at: LocalStorageService.getCurrentTimestamp(),
      updated_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    applications.push(newApplication);
    LocalStorageService.set(STORAGE_KEYS.APPLICATIONS, applications);
    return newApplication;
  }

  static update(id: number, updates: Partial<Application>): Application | null {
    const applications = this.getAll();
    const index = applications.findIndex(app => app.application_id === id);
    
    if (index === -1) return null;
    
    applications[index] = {
      ...applications[index],
      ...updates,
      updated_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    LocalStorageService.set(STORAGE_KEYS.APPLICATIONS, applications);
    return applications[index];
  }

  static delete(id: number): boolean {
    const applications = this.getAll();
    const filteredApplications = applications.filter(app => app.application_id !== id);
    
    if (filteredApplications.length === applications.length) return false;
    
    LocalStorageService.set(STORAGE_KEYS.APPLICATIONS, filteredApplications);
    return true;
  }

  static getById(id: number): Application | null {
    const applications = this.getAll();
    return applications.find(app => app.application_id === id) || null;
  }
}

// Account operations
export class AccountStorage {
  static getAll(): Account[] {
    return LocalStorageService.get<Account>(STORAGE_KEYS.ACCOUNTS);
  }

  static create(data: Omit<Account, 'account_id' | 'created_at' | 'updated_at'>): Account {
    const accounts = this.getAll();
    const newAccount: Account = {
      ...data,
      account_id: LocalStorageService.generateId(),
      created_at: LocalStorageService.getCurrentTimestamp(),
      updated_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    accounts.push(newAccount);
    LocalStorageService.set(STORAGE_KEYS.ACCOUNTS, accounts);
    return newAccount;
  }

  static update(id: number, updates: Partial<Account>): Account | null {
    const accounts = this.getAll();
    const index = accounts.findIndex(acc => acc.account_id === id);
    
    if (index === -1) return null;
    
    accounts[index] = {
      ...accounts[index],
      ...updates,
      updated_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    LocalStorageService.set(STORAGE_KEYS.ACCOUNTS, accounts);
    return accounts[index];
  }

  static delete(id: number): boolean {
    const accounts = this.getAll();
    const filteredAccounts = accounts.filter(acc => acc.account_id !== id);
    
    if (filteredAccounts.length === accounts.length) return false;
    
    LocalStorageService.set(STORAGE_KEYS.ACCOUNTS, filteredAccounts);
    return true;
  }

  static getById(id: number): Account | null {
    const accounts = this.getAll();
    return accounts.find(acc => acc.account_id === id) || null;
  }
}

// User operations
export class UserStorage {
  static getAll(): User[] {
    return LocalStorageService.get<User>(STORAGE_KEYS.USERS);
  }

  static create(data: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): User {
    const users = this.getAll();
    const newUser: User = {
      ...data,
      user_id: LocalStorageService.generateId(),
      created_at: LocalStorageService.getCurrentTimestamp(),
      updated_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    users.push(newUser);
    LocalStorageService.set(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  static update(id: number, updates: Partial<User>): User | null {
    const users = this.getAll();
    const index = users.findIndex(user => user.user_id === id);
    
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updates,
      updated_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    LocalStorageService.set(STORAGE_KEYS.USERS, users);
    return users[index];
  }

  static delete(id: number): boolean {
    const users = this.getAll();
    const filteredUsers = users.filter(user => user.user_id !== id);
    
    if (filteredUsers.length === users.length) return false;
    
    LocalStorageService.set(STORAGE_KEYS.USERS, filteredUsers);
    return true;
  }

  static getById(id: number): User | null {
    const users = this.getAll();
    return users.find(user => user.user_id === id) || null;
  }
}

// Rights operations
export class RightsStorage {
  static getAll(): Rights[] {
    return LocalStorageService.get<Rights>(STORAGE_KEYS.RIGHTS);
  }

  static create(data: Omit<Rights, 'rights_id' | 'created_at' | 'updated_at'>): Rights {
    const rights = this.getAll();
    const newRights: Rights = {
      ...data,
      rights_id: LocalStorageService.generateId(),
      created_at: LocalStorageService.getCurrentTimestamp(),
      updated_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    rights.push(newRights);
    LocalStorageService.set(STORAGE_KEYS.RIGHTS, rights);
    return newRights;
  }

  static update(id: number, updates: Partial<Rights>): Rights | null {
    const rights = this.getAll();
    const index = rights.findIndex(right => right.rights_id === id);
    
    if (index === -1) return null;
    
    rights[index] = {
      ...rights[index],
      ...updates,
      updated_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    LocalStorageService.set(STORAGE_KEYS.RIGHTS, rights);
    return rights[index];
  }

  static delete(id: number): boolean {
    const rights = this.getAll();
    const filteredRights = rights.filter(right => right.rights_id !== id);
    
    if (filteredRights.length === rights.length) return false;
    
    LocalStorageService.set(STORAGE_KEYS.RIGHTS, filteredRights);
    return true;
  }

  static revoke(id: number, revokedBy: number): Rights | null {
    return this.update(id, {
      is_active: false,
      revoked_by: revokedBy,
      revoked_at: LocalStorageService.getCurrentTimestamp(),
    });
  }

  static getById(id: number): Rights | null {
    const rights = this.getAll();
    return rights.find(right => right.rights_id === id) || null;
  }

  static getByUserId(userId: number): Rights[] {
    const rights = this.getAll();
    return rights.filter(right => right.user_id === userId);
  }

  static getByAccountId(accountId: number): Rights[] {
    const rights = this.getAll();
    return rights.filter(right => right.account_id === accountId);
  }

  static getByApplicationId(applicationId: number): Rights[] {
    const rights = this.getAll();
    return rights.filter(right => right.application_id === applicationId);
  }
}

// Invitation operations
export class InvitationStorage {
  static getAll(): Invitation[] {
    return LocalStorageService.get<Invitation>(STORAGE_KEYS.INVITATIONS);
  }

  static create(data: Omit<Invitation, 'invitation_id' | 'created_at' | 'token'>): Invitation {
    const invitations = this.getAll();
    const newInvitation: Invitation = {
      ...data,
      invitation_id: LocalStorageService.generateId(),
      token: this.generateToken(),
      created_at: LocalStorageService.getCurrentTimestamp(),
    };
    
    invitations.push(newInvitation);
    LocalStorageService.set(STORAGE_KEYS.INVITATIONS, invitations);
    return newInvitation;
  }

  static update(id: number, updates: Partial<Invitation>): Invitation | null {
    const invitations = this.getAll();
    const index = invitations.findIndex(inv => inv.invitation_id === id);
    
    if (index === -1) return null;
    
    invitations[index] = {
      ...invitations[index],
      ...updates,
    };
    
    LocalStorageService.set(STORAGE_KEYS.INVITATIONS, invitations);
    return invitations[index];
  }

  static delete(id: number): boolean {
    const invitations = this.getAll();
    const filteredInvitations = invitations.filter(inv => inv.invitation_id !== id);
    
    if (filteredInvitations.length === invitations.length) return false;
    
    LocalStorageService.set(STORAGE_KEYS.INVITATIONS, filteredInvitations);
    return true;
  }

  static getById(id: number): Invitation | null {
    const invitations = this.getAll();
    return invitations.find(inv => inv.invitation_id === id) || null;
  }

  static getByToken(token: string): Invitation | null {
    const invitations = this.getAll();
    return invitations.find(inv => inv.token === token) || null;
  }

  private static generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// Initialize with sample data if localStorage is empty
export const initializeSampleData = () => {
  if (ApplicationStorage.getAll().length === 0) {
    ApplicationStorage.create({
      application_name: 'Customer Portal',
      application_code: 'APP-X',
      rights_code: 'customer-portal-rights',
      status: 'active',
      version: '1.0.0',
    });

    ApplicationStorage.create({
      application_name: 'Admin Dashboard',
      application_code: 'APP-Y',
      rights_code: 'admin-dashboard-rights',
      status: 'active',
      version: '2.1.0',
    });

    ApplicationStorage.create({
      application_name: 'Analytics Platform',
      application_code: 'APP-Z',
      rights_code: 'analytics-platform-rights',
      status: 'maintenance',
      version: '1.5.2',
    });
  }

  if (AccountStorage.getAll().length === 0) {
    const businessAccount = AccountStorage.create({
      account_name: 'Business Account',
      account_type: 'Business',
      right_code: 'business-rights-code',
      owner_id: 1,
      status: 'active',
    });

    AccountStorage.create({
      account_name: 'Personal Account - John',
      account_type: 'Personal',
      right_code: 'personal-john-rights',
      owner_id: 2,
      status: 'active',
    });

    AccountStorage.create({
      account_name: 'Temporary Access',
      account_type: 'Temporary',
      right_code: 'temp-access-rights',
      owner_id: 3,
      status: 'trial',
    });
  }

  if (UserStorage.getAll().length === 0) {
    UserStorage.create({
      name: 'John Doe',
      email: 'john.doe@company.com',
      account_id: 1,
      user_role: 'admin',
      status: 'active',
      last_login: new Date('2024-01-20').toISOString(),
    });

    UserStorage.create({
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      account_id: 2,
      user_role: 'member',
      status: 'active',
      last_login: new Date('2024-01-19').toISOString(),
    });

    UserStorage.create({
      name: 'Bob Wilson',
      email: 'bob.wilson@company.com',
      account_id: 3,
      user_role: 'viewer',
      status: 'inactive',
      last_login: new Date('2024-01-10').toISOString(),
    });

    UserStorage.create({
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      user_role: 'member',
      status: 'pending',
    });

    UserStorage.create({
      name: 'Charlie Brown',
      email: 'charlie.brown@company.com',
      account_id: 1,
      user_role: 'admin',
      status: 'active',
      last_login: new Date('2024-01-21').toISOString(),
    });
  }
};