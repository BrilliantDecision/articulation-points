import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Bound {
    id: string;
    open: boolean;
  }
// Define a type for the slice state
interface AppState {
  boundListOpen: Bound;
}

// Define the initial state using that type
const initialState: AppState = {
    boundListOpen: { id: "", open: false },
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setBoundListOpen: (state, action: PayloadAction<Bound>) => {
      state.boundListOpen = action.payload;
    },
  },
});

export const { setBoundListOpen } = appSlice.actions;
export default appSlice.reducer;
