import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const userPreferenceSlice = createSlice({
  name: "userPreference",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = userPreferenceSlice.actions;

export default userPreferenceSlice.reducer;
