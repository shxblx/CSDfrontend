import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "../slices/adminSlice";
import agentSlice from "../slices/agentSlice";

const store = configureStore({
  reducer: {
    agent: agentSlice,
    admin: adminSlice,
  },
});

export default store;
