import { configureStore } from "@reduxjs/toolkit";
import userPreferenceReducer from "./userPreferenceSlice";
import { userApi } from "./api/userSlice";

export const store = configureStore({
  reducer: {
    userPreferences: userPreferenceReducer,
    // Add your reducers here
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
