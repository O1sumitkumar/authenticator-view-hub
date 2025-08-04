import { useAuth } from './useAuth';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions: string[];
  lastLogin?: Date;
}

export function useCurrentUser() {
  const { 
    isAuthenticated, 
    isLoading, 
    userData, 
    roles, 
    hasPermission, 
    getUserInitials, 
    getUserRole,
    logout: authLogout,
    user: authUser
  } = useAuth();

  const updateUser = (updates: Partial<CurrentUser>) => {
    // In a real implementation, you might want to update the user profile
    // through an API call and then update the Redux state
    console.log('Update user:', updates);
  };

  const logout = () => {
    authLogout();
  };

  return {
    user: isAuthenticated ? authUser : null,
    loading: isLoading,
    updateUser,
    logout,
    hasPermission,
    getUserInitials: getUserInitials(),
    isAuthenticated,
  };
}