import { configureStore } from "@reduxjs/toolkit";
import buyFormFeature from "./features/buyFormFeature";

export const store = configureStore({
  reducer: {
    // counter: buyFormFeature,
  },
});
