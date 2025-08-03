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
      state.userData = { ...state.userData, ...action.payload.userData };
    },
    // this will return initial state
    clearAuthData: (state) => {
      return initialState;
    },
  },

  // Add extra reducers to handle loading states if needed
  extraReducers: (builder) => {},
});

export const { setAuthData, updateAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
