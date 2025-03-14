// src/actions/symbolActions.ts
import { Dispatch } from 'redux';
import { getSymbolsStart, getSymbolsSuccess, getSymbolsFail, selectSymbol, clearSelectedSymbol } from '../features/symbolSlice';
import { SymbolData } from '../types';
import API from '../../utils/API';

// Action to fetch symbols
export const fetchSymbols = () => async (dispatch: Dispatch) => {
    try {
        dispatch(getSymbolsStart());
        const token = localStorage.getItem('token') || '';
        const response = await API.getSymbols(token); // API call to get symbols

        dispatch(getSymbolsSuccess(response.data));
    } catch (err: any) {
        dispatch(getSymbolsFail(err.response.data));
    }
};

// Action to select a symbol
export const selectSymbolAction = (symbol: SymbolData) => (dispatch: Dispatch) => {
    dispatch(selectSymbol(symbol));
};

// Action to clear the selected symbol
export const clearSelectedSymbolAction = () => (dispatch: Dispatch) => {
    dispatch(clearSelectedSymbol());
};
