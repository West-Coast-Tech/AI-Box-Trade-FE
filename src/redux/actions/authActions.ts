// src/actions/authActions.ts
import { Dispatch } from 'redux';
import {
    loginSuccess,
    registerFail,
    loginFail,
    authError,
    userLoaded,
    logoutSuccess,
    refreshSuccess,
    otpLoaded,
    otpFailed,
    loadingStart,
    resetVerificationSuccess,
    resetState,
} from '../features/auth/authSlice';
import { LoginData, OtpData, RegisterData, ResetData } from '../types';
import API from '../../utils/API';

// Action to register new users
export const registerUser = (data: RegisterData) => async (dispatch: Dispatch) => {
    try {
        dispatch(loadingStart());
        localStorage.setItem('registerData', JSON.stringify(data));
        const response = await API.register(data.email);
        dispatch(otpLoaded(response.data));
    } catch (err: any) {
        dispatch(authError(err.message));
        dispatch(registerFail(err.response.data));
    }
};

export const verifyRegisterOtp = (otp: OtpData) => async (dispatch: Dispatch<any>) => {
    try {
        dispatch(loadingStart());
        const data = JSON.parse(localStorage.getItem('registerData')!);
        if (data === null) {
            throw new Error('Data not found in localStorage');
        }
        const response = await API.registerWithOtp(data, otp);
        dispatch(loginSuccess(response.data));
        console.log('Verify register with otp data', response.data);
        return response.data.id;
    } catch (err: any) {
        dispatch(otpFailed(err.response.data));
    }
};
export const registerWithOtp = (data: RegisterData, otp: OtpData) => async (dispatch: Dispatch) => {
    try {
        dispatch(loadingStart());
        const response = await API.registerWithOtp(data, otp);
        dispatch(loginSuccess(response.data));
    } catch (err: any) {
        dispatch(otpFailed(err.response.data));
    }
};

// Action to login users
export const loginUser = (data: LoginData) => async (dispatch: Dispatch) => {
    try {
        dispatch(loadingStart());
        const response = await API.login(data);

        dispatch(otpLoaded(response.data));
    } catch (err: any) {
        dispatch(loginFail(err.response.data));
    }
};

export const verifyOtp = (data: OtpData) => async (dispatch: Dispatch) => {
    try {
        dispatch(loadingStart());
        const response = await API.verifyOtp(data);
        dispatch(loginSuccess(response.data));
    } catch (err: any) {
        dispatch(otpFailed(err.response.data));
    }
};

export const sendOtpForPasswordReset = (email: string) => async (dispatch: Dispatch) => {
    try {
        const response = await API.sendOtpForPasswordReset(email);
        dispatch(otpLoaded(response.data));
    } catch (err: any) {
        dispatch(otpFailed(err.response.data));
    }
};
export const verifyPasswordResetOtp = (data: OtpData) => async (dispatch: Dispatch) => {
    try {
        const response = await API.verifyPasswordResetOtp(data);
        dispatch(resetVerificationSuccess(response.data));

        // dispatch(loginSuccess(response.data));
    } catch (err: any) {
        dispatch(otpFailed(err.response.data));
    }
};
export const resetPassword = (data: ResetData) => async (dispatch: Dispatch) => {
    try {
        const response = await API.resetPassword(data);

        // dispatch(loginSuccess(response.data));
    } catch (err: any) {
        dispatch(otpFailed(err.response.data));
    }
};

// Action to logout user
export const logoutUser = () => (dispatch: Dispatch) => {
    dispatch(logoutSuccess());
};

// Action to refresh token
export const refreshToken = () => async (dispatch: Dispatch) => {
    // Retrieve the user's ID from localStorage
    const id = localStorage.getItem('id');

    if (!id) {
        // Handle the case where the ID is not found in localStorage
        // This could mean the user is not logged in, or the ID was not properly saved
        dispatch(authError());
        return;
    }

    try {
        // Call the refresh token API endpoint, passing the user's ID as needed
        // Note: You might need to adjust this based on how your API expects the ID to be passed
        const response = await API.refreshToken(id);
        // Assuming the response includes the refreshed token and possibly other user details

        // Dispatch the loginSuccess action with the refreshed token and user details
        dispatch(refreshSuccess(response.data));
    } catch (err) {
        // Handle errors, such as network issues or invalid tokens
        dispatch(authError());
    }
};

export const changePassword = (oldPassword: string, newPassword: string) => async (dispatch: Dispatch) => {
    try {
        const id = localStorage.getItem('id') || '';
        const token = localStorage.getItem('token') || '';
        const payload = {
            id,
            oldPassword,
            newPassword,
        };
        const response = await API.changePassword(token, payload);
    } catch (error) {
        console.error('Error changing password', error);
    }
};
