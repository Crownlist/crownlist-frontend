import { configureStore } from "@reduxjs/toolkit";
import adminDataSlice from "./slices/admin/adminDataSlice";
import userDataSlice from "./slices/user/userDataSlice";
export const store = configureStore({
  reducer: {
    adminData: adminDataSlice,
    userData: userDataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
