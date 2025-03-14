import { Dispatch } from 'redux';
import API from '../../utils/API';
import { UserData } from '../types';
import { loadUser, addFavoriteSuccess, removeFavoriteSuccess } from '../features/users/usersSlice';

export const getUserData = () => async (dispatch: Dispatch) => {
    try {
        const token = localStorage.getItem('token') || '';
        const userId = localStorage.getItem('id') || '';
        const response = await API.loadUser(token, userId);

        dispatch(loadUser(response.data));
        return response.data;
    } catch (error) {
        console.error('Error fetching User Data', error);
    }
};

export const updateUser = (name: string, country: string) => async (dispatch: Dispatch) => {
    try {
        const token = localStorage.getItem('token') || '';
        const userId = localStorage.getItem('id') || '';
        const response = await API.updateUser(token, userId, name, country);
        dispatch(loadUser(response.data));
    } catch (error) {
        console.error('Error updating user');
    }
};
export const addFavoriteSymbols = (symbolId: string) => async (dispatch: Dispatch) => {
    try {
        const token = localStorage.getItem('token') || '';
        const userId = localStorage.getItem('id') || '';
        const response = await API.addFavoriteSymbol(token, symbolId, userId);

        dispatch(addFavoriteSuccess(response.data));
    } catch (error) {
        console.error('Error adding Symbol to Favorite', error);
    }
};
export const removeFavoriteSymbol = (symbolId: string) => async (dispatch: Dispatch) => {
    try {
        const token = localStorage.getItem('token') || '';
        const userId = localStorage.getItem('id') || '';
        const response = await API.removeFavoriteSymbol(token, symbolId, userId);
        dispatch(removeFavoriteSuccess(response.data));
    } catch (error) {
        console.error('Error adding Symbol to Favorite', error);
    }
};
