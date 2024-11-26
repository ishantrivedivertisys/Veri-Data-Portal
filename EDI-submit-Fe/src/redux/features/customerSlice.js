/*React-based Libraries */
import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customer: [],
    customerId: null,
  },
  reducers: {
    setCustomer: (state, action) => {
      state.customer = [...action.payload];
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
  },
});

export const { setCustomer, setCustomerId } = customerSlice.actions;

export default customerSlice.reducer;
