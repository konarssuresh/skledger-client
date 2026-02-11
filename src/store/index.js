import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
