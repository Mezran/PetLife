// slice to hold the selected tab value

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: "info",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = dashboardSlice.actions;

export default dashboardSlice.reducer;
