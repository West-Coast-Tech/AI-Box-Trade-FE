import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../types';

export interface UserState {
    currentUser: UserData | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loadUser: (state, action: PayloadAction<UserData>) => {
            state.currentUser = action.payload;
            state.loading = false;
        },
        addFavoriteSuccess: (state, action: PayloadAction<string[]>) => {
            if (state.currentUser) state.currentUser.favoriteSymbols = action.payload;
            state.loading = false;
        },
        removeFavoriteSuccess: (state, action: PayloadAction<string[]>) => {
            if (state.currentUser) state.currentUser.favoriteSymbols = action.payload;
            state.loading = false;
        },
    },
});

export const { loadUser, addFavoriteSuccess, removeFavoriteSuccess } = userSlice.actions;

export default userSlice.reducer;
