// Mock keycloak object for development
const keycloak = {
  token: null as string | null,
  isTokenExpired: (minValidity?: number) => false,
  updateToken: (minValidity?: number) => Promise.resolve(false),
  login: () => console.log('Login required'),
};

/**
 * Base API URL from environment variable or default
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Debug mode for development environments
const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
const logLevel = import.meta.env.VITE_LOG_LEVEL || 'error';

/**
 * Logger function that respects environment settings
 */
const logger = {
  debug: (message: string, ...args: any[]) => {
    if (isDebugMode && (logLevel === 'debug')) {
      console.debug(`[API] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (isDebugMode && ['debug', 'info'].includes(logLevel)) {
      console.info(`[API] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(logLevel)) {
      console.warn(`[API] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (['debug', 'info', 'warn', 'error'].includes(logLevel)) {
      console.error(`[API] ${message}`, ...args);
    }
  }
};

/**
 * Generic fetch function with authentication token
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get the current token
  const token = keycloak.token;
  
  // Prepare headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    logger.debug(`Request to ${url}`, { method: options.method || 'GET' });
    
    // Check if token is about to expire (within 30 seconds) and refresh if needed
    if (token && keycloak.isTokenExpired(30)) {
      logger.info('Token is about to expire, refreshing...');
      await keycloak.updateToken(30);
    }
    
    // Make the API call
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
    
    // Handle unauthorized responses
    if (response.status === 401) {
      logger.warn('Unauthorized request, attempting token refresh');
      // Token might be invalid, try to refresh
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
          // Retry the request with new token
          logger.info('Token refreshed successfully, retrying request');
          return fetchWithAuth(url, options);
        } else {
          // If refresh fails, redirect to login
          logger.error('Token refresh failed, redirecting to login');
          keycloak.login();
          throw new Error('Authentication required');
        }
      } catch (error) {
        // If refresh token is expired, redirect to login
        logger.error('Token refresh error, redirecting to login', error);
        keycloak.login();
        throw new Error('Authentication required');
      }
    }
    
    // Handle other error responses
    if (!response.ok) {
      logger.error(`API error: ${response.status}`, { url, status: response.status });
      throw new Error(`API error: ${response.status}`);
    }
    
    // Return the response data
    const data = await response.json();
    logger.debug(`Response from ${url}`, { status: response.status });
    return data;
  } catch (error) {
    logger.error('API request failed', error);
    throw error;
  }
}

/**
 * API service with common HTTP methods
 */
export const apiService = {
  get: (url: string) => fetchWithAuth(url),
  
  post: (url: string, data: any) => fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (url: string, data: any) => fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  patch: (url: string, data: any) => fetchWithAuth(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  delete: (url: string) => fetchWithAuth(url, {
    method: 'DELETE',
  }),
};

export default apiService; 