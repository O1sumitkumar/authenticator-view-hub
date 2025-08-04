import axios, { AxiosResponse } from 'axios';
import { 
  Application, 
  ApplicationRequest, 
  Rights, 
  RightsRequest, 
  Account, 
  AccountRequest, 
  AccountSharing, 
  SharingRequest,
  ApiResponse,
  PermissionRequest,
  PermissionResponse,
  DashboardMetrics
} from '@/types/admin';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class AdminApiService {
  // Applications API
  static async getApplications(): Promise<Application[]> {
    const response: AxiosResponse<ApiResponse<Application[]>> = await api.get('/applications');
    return response.data.data || [];
  }

  static async createApplication(applicationData: ApplicationRequest): Promise<Application> {
    const response: AxiosResponse<ApiResponse<Application>> = await api.post('/applications', applicationData);
    return response.data.data!;
  }

  static async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    const response: AxiosResponse<ApiResponse<Application>> = await api.put(`/applications/${id}`, updates);
    return response.data.data!;
  }

  static async deleteApplication(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  }

  // Rights API
  static async getRights(): Promise<Rights[]> {
    const response: AxiosResponse<ApiResponse<Rights[]>> = await api.get('/rights');
    return response.data.data || [];
  }

  static async createRights(rightsData: RightsRequest): Promise<Rights> {
    const response: AxiosResponse<ApiResponse<Rights>> = await api.post('/rights', rightsData);
    return response.data.data!;
  }

  static async updateRights(id: string, updates: Partial<Rights>): Promise<Rights> {
    const response: AxiosResponse<ApiResponse<Rights>> = await api.put(`/rights/${id}`, updates);
    return response.data.data!;
  }

  static async revokeRights(id: string): Promise<Rights> {
    const response: AxiosResponse<ApiResponse<Rights>> = await api.post(`/rights/${id}/revoke`);
    return response.data.data!;
  }

  // Accounts API
  static async getAccounts(): Promise<Account[]> {
    const response: AxiosResponse<ApiResponse<Account[]>> = await api.get('/accounts');
    return response.data.data || [];
  }

  static async createAccount(accountData: AccountRequest): Promise<Account> {
    const response: AxiosResponse<ApiResponse<Account>> = await api.post('/accounts', accountData);
    return response.data.data!;
  }

  static async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const response: AxiosResponse<ApiResponse<Account>> = await api.put(`/accounts/${id}`, updates);
    return response.data.data!;
  }

  static async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  }

  // Account Sharing API
  static async getAccountSharing(): Promise<AccountSharing[]> {
    const response: AxiosResponse<ApiResponse<AccountSharing[]>> = await api.get('/accounts/sharing');
    return response.data.data || [];
  }

  static async createSharing(sharingData: SharingRequest): Promise<AccountSharing> {
    const response: AxiosResponse<ApiResponse<AccountSharing>> = await api.post('/accounts/sharing', sharingData);
    return response.data.data!;
  }

  static async updateSharing(id: string, updates: Partial<AccountSharing>): Promise<AccountSharing> {
    const response: AxiosResponse<ApiResponse<AccountSharing>> = await api.put(`/accounts/sharing/${id}`, updates);
    return response.data.data!;
  }

  static async revokeSharing(id: string): Promise<AccountSharing> {
    const response: AxiosResponse<ApiResponse<AccountSharing>> = await api.post(`/accounts/sharing/${id}/revoke`);
    return response.data.data!;
  }

  // Dashboard API
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response: AxiosResponse<ApiResponse<DashboardMetrics>> = await api.get('/dashboard/metrics');
    return response.data.data!;
  }

  // Cross-application permission API
  static async requestPermissions(request: PermissionRequest): Promise<PermissionResponse> {
    const response: AxiosResponse<PermissionResponse> = await api.post('/permissions/request', request);
    return response.data;
  }

  static async bulkRequestPermissions(requests: PermissionRequest[]): Promise<{ [userToken: string]: PermissionResponse }> {
    const response: AxiosResponse<{ results: { [userToken: string]: PermissionResponse } }> = 
      await api.post('/permissions/bulk-check', { requests });
    return response.data.results;
  }

  // Application registration for external apps
  static async registerExternalApplication(applicationData: ApplicationRequest): Promise<Application> {
    const response: AxiosResponse<ApiResponse<Application>> = await api.post('/applications/register', applicationData);
    return response.data.data!;
  }
}

export default AdminApiService;