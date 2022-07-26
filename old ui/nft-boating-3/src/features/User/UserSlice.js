import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  init: {}
};

export const userSlice = createSlice({
  name: "buyNFT",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.init = action.payload;
      console.log("from state: ", state.init);
    },
  },
});

export const user = (state) => state.init.value;

export const { saveUser } = userSlice.actions;

export default userSlice.reducer;
