import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const buyNFTSlice = createSlice({
  name: "buyNFT",
  initialState,
  reducers: {
    saveNFTData: (state, action) => {
      state = action.payload;
      console.log({ state });
    },
  },
});

export const buyNFT = (state) => state.counter.value;;

export const { saveNFTData } = buyNFTSlice.actions;

export default buyNFTSlice.reducer;
