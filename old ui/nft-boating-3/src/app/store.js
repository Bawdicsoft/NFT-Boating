import { configureStore } from '@reduxjs/toolkit';
import buyNFTReducer from "../features/BuyNFT/BuySlice";
import BookingReducer from "../features/Booking/BookingSlice";
import userSlice from "../features/User/UserSlice";
import BookingIDSlice from "../features/BookingID/BookingIDSlice";

export const store = configureStore({
  reducer: {
    buyNFT: buyNFTReducer,
    Booking: BookingReducer,
    user: userSlice,
    BookingID: BookingIDSlice,
  },
});
