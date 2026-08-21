import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import categoryReducer from "./categorySlice";

export const adminStore = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
  },
});

export type AdminRootState = ReturnType<typeof adminStore.getState>;
export type AdminAppDispatch = typeof adminStore.dispatch;
