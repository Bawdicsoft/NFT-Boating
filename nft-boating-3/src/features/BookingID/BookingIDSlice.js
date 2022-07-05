import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  init: 0,
};

export const BookingIDSlice = createSlice({
  name: "BookingID",
  initialState,
  reducers: {
    saveBookingID: (state, action) => {
      state.init = action.payload;
      console.log("BookingSlice", state.init);
    },
  },
});

export const BookingID = (state) => state.init.value;

export const { saveBookingID } = BookingIDSlice.actions;

export default BookingIDSlice.reducer;
