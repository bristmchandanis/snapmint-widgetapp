import { createSlice } from "@reduxjs/toolkit";

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    storeDetails: null,
    loading: true,
    error: null,
  },
  reducers: {
    setStoreDetails: (state, action) => {
      state.storeDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setStoreDetails, setLoading, setError, clearError } =
  shopSlice.actions;
export default shopSlice.reducer;
