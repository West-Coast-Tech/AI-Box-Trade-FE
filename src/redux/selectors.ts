import { createSelector } from 'reselect';
import { AppState } from '../redux/types';

export const selectSymbols = (state: AppState) => state.symbols?.symbols;
export const selectCurrentSymbol = (state: AppState) => state.symbols?.selectedSymbol;

export const selectFavoriteSymbols = createSelector([(state: AppState) => state.user?.currentUser?.favoriteSymbols], (favoriteSymbols) => favoriteSymbols || []);
