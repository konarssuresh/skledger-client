import { configureStore } from "@reduxjs/toolkit";
import userPreferenceReducer from "./userPreferenceSlice";
import calendarReducer from "./calendarSlice";
import dashboardReducer from "./dashboardSlice";
import { userApi } from "./api/userSlice";
import { categoryApi } from "./api/categorySlice";
import { transactionApi } from "./api/transactionSlice";
import { analyticsApi } from "./api/analyticsSlice";

export const store = configureStore({
  reducer: {
    userPreferences: userPreferenceReducer,
    calendar: calendarReducer,
    dashboard: dashboardReducer,
    // Add your reducers here
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(categoryApi.middleware)
      .concat(transactionApi.middleware)
      .concat(analyticsApi.middleware),
});
