import { configureStore } from '@reduxjs/toolkit';
import documentReducer from './slices/documentSlices'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    document: documentReducer,
    auth: authReducer,
  },
});

