import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "INVENTORY_MANAGER"
    | "ORDER_MANAGER"
    | "CUSTOMER_SUPPORT"
    | "MARKETING_MANAGER"
    | "CONTENT_MANAGER";
}

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AdminUser; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
