// src/store/navigationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
  selectedSection: string;
}

const initialState: NavigationState = {
  selectedSection: "",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setSelectedSection: (state, action: PayloadAction<string>) => {
      state.selectedSection = action.payload;
    },
  },
});

export const { setSelectedSection } = navigationSlice.actions;
export default navigationSlice.reducer;
