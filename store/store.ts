
import { configureStore, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dataReducer from './slices/dataSlice';

// Configure the Redux store with auth and data reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
  },
});

// RootState type for use with hooks and selectors
export type RootState = ReturnType<typeof store.getState>;

// Explicitly define AppDispatch as a ThunkDispatch to ensure that dispatch() 
// calls in components correctly handle AsyncThunkActions. This fixes the 
// "Argument of type 'AsyncThunkAction' is not assignable to parameter of type 'UnknownAction'" errors.
export type AppDispatch = ThunkDispatch<RootState, any, UnknownAction>;
