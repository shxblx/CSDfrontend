import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";

const store = configureStore({
  reducer: {
    auth: userSlice,
  },
});

export default store;
