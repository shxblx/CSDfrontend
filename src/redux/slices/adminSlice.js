import { createSlice } from "@reduxjs/toolkit";

const storedAdminInfo = localStorage.getItem("adminInfo");

const initialState = {
  adminInfo: storedAdminInfo ? JSON.parse(storedAdminInfo) : null,
};

const adminSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminInfo: (state, action) => {
      state.adminInfo = action.payload;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    removeAdminInfo: (state) => {
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
  },
});

export const { setAdminInfo, removeAdminInfo } = adminSlice.actions;

export default adminSlice.reducer;
