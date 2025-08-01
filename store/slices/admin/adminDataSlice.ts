import {  AdminSigninNew } from "@/types/admin/auth";
import { createSlice } from "@reduxjs/toolkit";

interface Props {
  adminData: AdminSigninNew | null;
}

const initialState: Props = {
  adminData: null,
};

const adminDataSlice = createSlice({
  name: "adminData",
  initialState,
  reducers: {
    updateAdminData: (state, action) => {
      state.adminData = action.payload;
      return state;
    },
  },
});

export const { updateAdminData } = adminDataSlice.actions;
export default adminDataSlice.reducer;