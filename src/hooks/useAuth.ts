import { useAuth as useOidcAuth } from "react-oidc-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserFromKeycloak, clearAuthData } from "@/redux/auth/auth.slice";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect, user } = useOidcAuth();
  const authState = useSelector((state: RootState) => state.auth);

  // Update Redux state when Keycloak user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(setUserFromKeycloak(user));
    } else if (!isAuthenticated) {
      dispatch(clearAuthData());
    }
  }, [isAuthenticated, user, dispatch]);

  const hasRole = (roles: string | string[]): boolean => {
    if (!user || !isAuthenticated || !authState.roles) {
      return false;
    }
    
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.some(role => authState.roles?.includes(role));
  };

  const hasPermission = (permission: string): boolean => {
    // Check if user has specific permission
    return hasRole(['admin']) || hasRole([permission]);
  };

  const getUserInitials = (): string => {
    const name = authState.userData.name || authState.userData.preferred_username || '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRole = (): string => {
    if (hasRole('admin')) return 'System Administrator';
    if (hasRole('manager')) return 'Manager';
    if (hasRole('user')) return 'User';
    return 'Viewer';
  };

  return {
    isAuthenticated: isAuthenticated && authState.isAuthenticated,
    isLoading,
    login: () => signinRedirect(),
    logout: () => {
      dispatch(clearAuthData());
      signoutRedirect();
    },
    token: user?.access_token || authState.token,
    userData: authState.userData,
    roles: authState.roles || [],
    hasRole,
    hasPermission,
    getUserInitials,
    getUserRole,
    user: {
      id: authState.userData.sub || '',
      name: authState.userData.name || '',
      email: authState.userData.email || '',
      role: getUserRole(),
      avatar: authState.userData.avatar,
      permissions: authState.roles || [],
      lastLogin: authState.userData.lastLogin ? new Date(authState.userData.lastLogin) : undefined,
    },
  };
};

export default useAuth;
