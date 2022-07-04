import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "buyNFT",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state = action.payload;
      console.log("from state: ", state);
    },
  },
});

export const user = (state) => state.counter.value;

export const { saveUser } = userSlice.actions;

export default userSlice.reducer;
