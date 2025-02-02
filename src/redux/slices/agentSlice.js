import { createSlice } from "@reduxjs/toolkit";

const storedAgentInfo = localStorage.getItem("agentInfo");

const initialState = {
  agentInfo: storedAgentInfo ? JSON.parse(storedAgentInfo) : null,
};

const agentSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAgentInfo: (state, action) => {
      state.agentInfo = action.payload;
      localStorage.setItem("agentInfo", JSON.stringify(action.payload));
    },
    removeAgentInfo: (state) => {
      state.agentInfo = null;
      localStorage.removeItem("agentInfo");
    },
  },
});

export const { setAgentInfo, removeAgentInfo } = agentSlice.actions;

export default agentSlice.reducer;
