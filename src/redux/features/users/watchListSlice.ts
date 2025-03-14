import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IWatchLists } from '../../types';

export interface WatchListState {
    watchLists: IWatchLists[];
    loading: boolean;
    error: string | null;
}

const initialState: WatchListState = {
    watchLists: [],
    loading: false,
    error: null,
};

export const WatchListSlice = createSlice({
    name: 'watchList',
    initialState,
    reducers: {
        getWatchListSuccess: (state, action: PayloadAction<IWatchLists[]>) => {
            state.watchLists = action.payload;
            state.loading = false;
        },
        updateWatchListsSuccess: (state, action: PayloadAction<IWatchLists>) => {
            state.watchLists.push(action.payload);
        },
    },
});
