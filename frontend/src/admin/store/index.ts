import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export const adminStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type AdminRootState = ReturnType<typeof adminStore.getState>;
export type AdminAppDispatch = typeof adminStore.dispatch;
