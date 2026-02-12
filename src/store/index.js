import { configureStore } from "@reduxjs/toolkit";
import userPreferenceReducer from "./userPreferenceSlice";
import { userApi } from "./api/userSlice";
import { categoryApi } from "./api/categorySlice";
import { transactionApi } from "./api/transactionSlice";

export const store = configureStore({
  reducer: {
    userPreferences: userPreferenceReducer,
    // Add your reducers here
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(categoryApi.middleware)
      .concat(transactionApi.middleware),
});
