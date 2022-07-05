import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  init: {},
  nft: 0
};

export const buyNFTSlice = createSlice({
  name: "buyNFT",
  initialState,
  reducers: {
    saveNFTData: (state, action) => {
      state.init = action.payload;
      console.log("buyNFTSlice", state.init);
    },
    saveNFT: (state, action) => {
      state.nft = action.payload;
      console.log("buyNFTSlice", state.nft);
    },
  },
});

export const buyNFT = (state) => state.init.value;

export const { saveNFTData, saveNFT } = buyNFTSlice.actions;

export default buyNFTSlice.reducer;
