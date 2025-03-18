// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterData } from '../../types';
export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    currentUser: { email: string } | null;
    id: string | null;
    otpToken: string | null;
    error: string | null;
    loading: boolean;
    resetToken: string | null;
    registerData: RegisterData | null;
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token') && !!localStorage.getItem('id'),
    id: localStorage.getItem('id'), // Initialize with value from localStorage
    currentUser: null,
    otpToken: null,
    error: null,
    loading: false,
    resetToken: null,
    registerData: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loadingStart: (state) => {
            state.loading = true;
        },
        registerSuccess: (state, action: PayloadAction<{ token: string; email: string; id: string }>) => {
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('id', action.payload.id);
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.currentUser = { email: action.payload.email };
            state.isAuthenticated = true;
            state.error = null;
            state.loading = false;
        },

        resetState: (state) => {
            return initialState;
        },
        resetVerificationSuccess: (state, action: PayloadAction<{ id: string; passwordResetToken: string }>) => {
            state.resetToken = action.payload.passwordResetToken;

            state.id = action.payload.id;
            state.error = null;
            state.loading = false;
        },
        otpLoaded: (state, action: PayloadAction<{ otpToken: string }>) => {
            state.otpToken = action.payload.otpToken;
            state.error = null;
            state.loading = false;
        },
        otpFailed: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },

        loginSuccess: (state, action: PayloadAction<{ token: string; email: string; id: string }>) => {
            console.log('Token email and id', action.payload);
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('id', action.payload.id); // Save user ID to localStorage
            state.token = action.payload.token;
            state.id = action.payload.id; // Update state with user ID
            state.currentUser = { email: action.payload.email };
            state.isAuthenticated = true;
            state.otpToken = null;
            state.error = null;
            state.loading = false;
        },
        registerFail: (state, action: PayloadAction<string>) => {
            localStorage.removeItem('token');
            localStorage.removeItem('id'); // Remove user ID from localStorage
            state.token = null;
            state.id = null; // Reset user ID in state
            state.isAuthenticated = false;
            state.currentUser = null;
            state.error = action.payload;
            state.loading = false;
        },
        loginFail: (state, action: PayloadAction<string>) => {
            localStorage.removeItem('token');
            localStorage.removeItem('id'); // Remove user ID from localStorage
            state.token = null;
            state.id = null; // Reset user ID in state
            state.isAuthenticated = false;
            state.currentUser = null;

            state.error = action.payload;
            state.loading = false;
        },
        authError: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('id'); // Remove user ID from localStorage
            state.token = null;
            state.id = null; // Reset user ID in state
            state.isAuthenticated = false;
            state.currentUser = null;
            state.loading = false;
        },
        logoutSuccess: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('id'); // Remove user ID from localStorage
            state.token = null;
            state.id = null; // Reset user ID in state
            state.isAuthenticated = false;
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        refreshSuccess: (state, action: PayloadAction<{ token: string }>) => {
            localStorage.setItem('token', action.payload.token);
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
            state.loading = false;
        },
        userLoaded: (state, action: PayloadAction<{ email: string; id: string }>) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            state.id = action.payload.id; // Update user ID in state
        },
    },
});

export const {
    loadingStart,
    registerSuccess,
    loginSuccess,
    registerFail,
    loginFail,
    authError,
    logoutSuccess,
    userLoaded,
    refreshSuccess,
    otpLoaded,
    otpFailed,
    resetVerificationSuccess,
    resetState,
    setError,
} = authSlice.actions;

export default authSlice.reducer;
