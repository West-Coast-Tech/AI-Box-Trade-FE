// src/utils/API.ts
import { Axios, AxiosPromise, AxiosResponse } from 'axios';

import apiClient from '../../utils/apiClient';
import { UserParameters } from '../../pages/Portfolio/DesignPortfolio/DesignPortfolioPage';

// Define the API service with TypeScript
export default {
    // ############# API for  Design portfolio ################# //
    getStocksForUserParameters(userParameters: UserParameters): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/builder`,
            { userParameters },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
    },
    getStocksMarketCapDivision(stocks: string[]): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/builder/market-cap`,
            { stocks },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
    },

    getStocksSectorDistribution(stocks: string[]): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/builder/sectors`,
            { stocks },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
    },

    saveDesignPortfolio(userId: string, portfolioParameters: any, symbols: any[]): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/builder/save',
            { userId, portfolioParameters, symbols },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
    },

    getAllDesignPortfolios(userId: string): Promise<AxiosResponse> {
        return apiClient.get(`/portfolio/builder/load/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
    },
    loadDesignPortfolio(userId: string, portfolioId: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/builder/load',
            { userId, portfolioId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
    },
    updateDesignPortfolio(userId: string, portfolioId: string, newPortfolioName: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/builder/update',
            { userId, portfolioId, newPortfolioName },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
    },
    deleteDesignPortfolio(userId: string, portfolioId: string): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/builder/delete`,
            { userId, portfolioId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
    },

    // ############# API for  watch list ################# //
    getWatchLists(token: string, userId: string): Promise<AxiosPromise> {
        return apiClient.get(`/portfolio/watchlist/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
    createWatchList(token: string, userId: string, watchListName: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/watchlist',
            { userId, watchListName },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    addSymbolToWatchList(token: string, watchListId: string, symbol: string): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/watchlist/add-symbol`,
            { watchListId, symbol },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    removeSymbolFromWatchList(token: string, symbolsToDelete: string[], watchListId: string): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/watchlist/remove-symbol/${watchListId}`,
            {
                symbolsToDelete,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    updateWatchList(token: string, watchListId: string, watchListName: string): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/watchlist/update`,
            {
                watchListId,
                watchListName,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    deleteWatchList(token: string, watchListId: string): Promise<AxiosResponse> {
        return apiClient.delete(`/portfolio/watchlist/${watchListId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
    getWatchListData(token: string, symbols: string[]): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/watchlist/data`,
            {
                symbols,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    // ############# API for  holdings list ################# //
    getStockHoldings(token: string, userId: string): Promise<AxiosResponse> {
        return apiClient.get(`/portfolio/holdings/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
    addStockToHoldings(token: string, userId: string, symbol: string): Promise<AxiosResponse> {
        console.log('addStockToHoldings', userId, symbol);
        return apiClient.post(
            `/portfolio/holdings/create/${userId}`,
            { symbol },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    addMultipleStocksToHoldings(token: string, userId: string, symbols: any[], portfolioName: string): Promise<AxiosResponse> {
        console.log('addStockToHoldings', symbols);
        return apiClient.post(
            `/portfolio/holdings/create/multiple/${userId}`,
            { symbols, portfolioName },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    updateStockInHoldings(token: string, holdingId: string, updateData: { quantity?: number; price?: number }): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/holdings/update/${holdingId}`,
            { updateData },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    deleteStockFromHoldings(token: string, idsToDelete: string[]): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/holdings/delete',
            { idsToDelete },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },

    // ############# API for  holdings list ################# //
    getSevenBoxRuleSymbols(token: string, fields: string[]): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/seven-box-rule',
            { fields },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    getSevenBoxSymbolsData(token: string, symbols: string[]): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/seven-box-rule/symbols',
            { symbols },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    getCustomBoxRuleSymbols(token: string, fields: string[], marketCapType: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/custom-box-rule',
            { fields, marketCapType },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    // ############# API for top sector picks list ################# //
    getTopStocksBySector(token: string, sector: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/stocks/sector/',
            { sector },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },

    // ############# API for analyst rating ################# //
    getStockAnalystRating(token: string, symbol: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/portfolio/analyst-ratings',
            { symbol },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },

    // ############# API for stocks filter ################# //
    getStocksByFilter(filters: any[]): Promise<AxiosResponse> {
        return apiClient.post(
            '/stocks/filter',
            { filters },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
            }
        );
    },
};
