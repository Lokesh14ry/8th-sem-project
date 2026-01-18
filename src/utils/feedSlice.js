import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: () => null,
    removeUserFromFeed: (state, action) => {
      const newUsers = state.filter((user) => user._id !== action.payload);
      return newUsers;
    },
  },
});

export const { addFeed, removeFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
