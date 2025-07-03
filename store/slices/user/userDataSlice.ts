import { UserSignin } from "@/types/admin/auth";
import { createSlice } from "@reduxjs/toolkit";

interface Props {
  userData: UserSignin | null;
}

const initialState: Props = {
  userData: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    updateUserData: (state, action) => {
      state.userData = action.payload;
      return state;
    },
  },
});

export const { updateUserData } = userDataSlice.actions;
export default userDataSlice.reducer;