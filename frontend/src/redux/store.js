import { configureStore } from '@reduxjs/toolkit';
import shopReducer from './slices/shopSlice';

const store = configureStore({
  reducer: {
    shop: shopReducer,
  },
});

export default store;
