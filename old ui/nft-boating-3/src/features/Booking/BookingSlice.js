import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  init: {}
};

export const BookingSlice = createSlice({
  name: "Booking",
  initialState,
  reducers: {
    saveBooking: (state, action) => {
      state.init = action.payload;
      console.log("BookingSlice", state.init);
    },
  },
});

export const Booking = (state) => state.init.value;

export const { saveBooking } = BookingSlice.actions;

export default BookingSlice.reducer;
