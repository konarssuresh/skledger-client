import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  theme:
    window.localStorage.getItem("skledger-theme") === "dark" ? "dark" : "light",
};

const userPreferenceSlice = createSlice({
  name: "userPreference",
  initialState,
  reducers: {
    setTheme(state, action) {
      window.localStorage.setItem("skledger-theme", action.payload);
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = userPreferenceSlice.actions;

const userPreferenceSelector = (state) => state?.userPreferences;

export const themeSelector = createSelector(
  userPreferenceSelector,
  (data) => data?.theme || "light",
);

export default userPreferenceSlice.reducer;
