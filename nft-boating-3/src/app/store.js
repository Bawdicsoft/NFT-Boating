import { configureStore } from '@reduxjs/toolkit';
import buyNFTReducer from "../features/BuyNFT/BuySlice";
import userSlice from "../features/User/UserSlice";

export const store = configureStore({
  reducer: {
    buyNFT: buyNFTReducer,
    user: userSlice,
  },
});
