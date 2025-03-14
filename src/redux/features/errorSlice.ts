// src/features/errors/errorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ErrorState {
  message: string;
}

const initialState: ErrorState = {
  message: '',
};

export const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    getErrors: (state, action: PayloadAction<{ msg: string }>) => {
      state.message = action.payload.msg;
    },
    clearErrors: state => {
      state.message = '';
    },
  },
});

export const { getErrors, clearErrors } = errorSlice.actions;

export default errorSlice.reducer;
