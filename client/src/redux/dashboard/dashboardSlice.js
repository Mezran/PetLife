// slice to hold the selected tab value

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: 0,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload.selectedTab;
    },
  },
});

export const { setSelectedTab } = dashboardSlice.actions;

export default dashboardSlice.reducer;
