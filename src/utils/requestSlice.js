import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequest: (state, action) => {
      return action.payload;
    },
    filterRequest: (state, action) => {
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
    removeRequest: () => {
      return [];
    },
  },
});

export const { addRequest, removeRequest, filterRequest } =
  requestSlice.actions;
export default requestSlice.reducer;
