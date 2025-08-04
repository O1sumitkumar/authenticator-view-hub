import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthProp, initialState } from './auth.init';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthProp>) => {
      Object.assign(state, action.payload);
    },
    updateAuthData: (state, action: PayloadAction<Partial<AuthProp>>) => {
      if (action.payload.userData) {
        state.userData = { ...state.userData, ...action.payload.userData };
      }
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      if (action.payload.roles) {
        state.roles = action.payload.roles;
      }
      if (action.payload.isAuthenticated !== undefined) {
        state.isAuthenticated = action.payload.isAuthenticated;
      }
    },
    setUserFromKeycloak: (state, action: PayloadAction<any>) => {
      const keycloakUser = action.payload;
      state.isAuthenticated = true;
      state.token = keycloakUser.access_token;
      state.userData = {
        ...state.userData,
        email: keycloakUser.profile?.email || '',
        email_verified: keycloakUser.profile?.email_verified || false,
        family_name: keycloakUser.profile?.family_name || '',
        given_name: keycloakUser.profile?.given_name || '',
        name: keycloakUser.profile?.name || keycloakUser.profile?.preferred_username || '',
        preferred_username: keycloakUser.profile?.preferred_username || '',
        sub: keycloakUser.profile?.sub || '',
        iss: keycloakUser.profile?.iss || '',
        locale: keycloakUser.profile?.locale || 'en',
        realm_access: keycloakUser.profile?.realm_access || { roles: [] },
        resource_access: keycloakUser.profile?.resource_access || {},
        groups: keycloakUser.profile?.groups || [],
        lastLogin: new Date().toISOString(),
      };
      // Extract roles from Keycloak token
      const realmRoles = keycloakUser.profile?.realm_access?.roles || [];
      const resourceRoles = Object.values(keycloakUser.profile?.resource_access || {})
        .flatMap((resource: any) => resource.roles || []);
      state.roles = [...realmRoles, ...resourceRoles];
      state.role = realmRoles.includes('admin') ? 'admin' : realmRoles[0] || 'user';
    },
    // this will return initial state
    clearAuthData: (state) => {
      return initialState;
    },
  },

  // Add extra reducers to handle loading states if needed
  extraReducers: (builder) => {},
});

export const { setAuthData, updateAuthData, clearAuthData, setUserFromKeycloak } = authSlice.actions;
export default authSlice.reducer;
