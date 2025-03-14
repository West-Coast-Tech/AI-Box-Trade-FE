import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the types for the symbol data
import { SymbolData } from '../types'; // Define the initial state for the symbol slice
export interface SymbolState {
    symbols: Array<SymbolData>;
    selectedSymbol: SymbolData | null;
    loading: boolean;
    error: string | null;
}

const initialState: SymbolState = {
    symbols: [],
    selectedSymbol: {
        name: 'Advanced Micro Devices Inc',
        symbol: 'AMD',
        _id: '67529ad71d32bb942e40517f',
        country: 'United States',
        type: 'stock',
        exchange: 'NASDAQ',
        iconUrl: 'https://api.twelvedata.com/logo/amd.com',
        createdAt: null,
    },
    loading: false,
    error: null,
};

// Create the symbol slice
export const symbolSlice = createSlice({
    name: 'symbol',
    initialState,
    reducers: {
        getSymbolsSuccess: (state, action: PayloadAction<SymbolData[]>) => {
            state.symbols = action.payload;
            state.loading = false;
        },
        getSymbolsFail: (state, action: PayloadAction<string>) => {
            state.symbols = [];
            state.error = action.payload;
            state.loading = false;
        },
        getSymbolsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        selectSymbol: (state, action: PayloadAction<SymbolData>) => {
            state.selectedSymbol = action.payload;
        },
        clearSelectedSymbol: (state) => {
            state.selectedSymbol = null;
        },
    },
});

export const { getSymbolsSuccess, getSymbolsFail, getSymbolsStart, selectSymbol, clearSelectedSymbol } = symbolSlice.actions;

export default symbolSlice.reducer;
