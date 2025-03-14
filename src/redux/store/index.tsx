import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '../features/themeConfigSlice';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/usersSlice';
import symbolReducer from '../features/symbolSlice';
export const store = configureStore({
    reducer: {
        themeConfig: themeConfigSlice,
        symbols: symbolReducer,
        user: userReducer,
        auth: authReducer,
    },
});

export type IRootState = ReturnType<typeof store.getState>;
