import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  base: {name: null, email: null},
};

export const buyFormFeature = createSlice({
  name: "counter",
  initialState,
  reducers: {
    add: (state, action) => {
      state.base = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { add } = buyFormFeature.actions;

export default buyFormFeature.reducer;
