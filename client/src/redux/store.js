// imports
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice.js";

// reducers
import userSliceReducer from "./user/userSlice.js";
import popupSliceReducer from "./popup/popupSlice.js";
import dashboardSliceReducer from "./dashboard/dashboardSlice.js";
import petSliceReducer from "./pet/petSlice.js";

// middleware
import { rtkMessageDisplayMiddleware } from "./middleware.js";

// config store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userSliceReducer,
    popup: popupSliceReducer,
    dashboard: dashboardSliceReducer,
    pet: petSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, rtkMessageDisplayMiddleware),
  devTools: true,
});

export default store;
