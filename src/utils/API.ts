// src/utils/API.ts
import { Axios, AxiosPromise, AxiosResponse } from 'axios';
import {
    RegisterData,
    LoginData,
    UserData,
    OtpData,
    ResetData,
    SymbolData,
    TradingData,
    TradesData,
    ScreenerData,
    Gainers_Losers,
    INews,
    IDividendsCalendar,
    IEcoEventCalendar,
    IEarningsCalendar,
} from '../redux/types';
import apiClient from '../utils/apiClient';

// Define the API service with TypeScript
export default {
    // API request to register a new user
    register(email: string): Promise<AxiosResponse<OtpData>> {
        return apiClient.post('/auth/register', { email });
    },
    registerWithOtp(data: RegisterData, otp: OtpData): Promise<AxiosResponse<{ token: string; email: string; id: string }>> {
        return apiClient.post('/auth/verify-register-otp', { ...data, ...otp });
    },

    // API request to login a user
    login(data: LoginData): Promise<AxiosResponse<OtpData>> {
        return apiClient.post('/auth/login', data);
    },

    // API request to load user data
    loadUser(token: string, userId: string): Promise<AxiosResponse<UserData>> {
        const response = apiClient.post(
            '/user',
            { userId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response;
    },
    // API request to fetch users
    getUsers(token: string): Promise<AxiosResponse<UserData[]>> {
        return apiClient.get('/users', { headers: { Authorization: `Bearer ${token}` } });
    },

    //API request to refresh token
    refreshToken(id: string): Promise<AxiosResponse<UserData>> {
        return apiClient.get('/auth/refresh', { headers: { Authorization: `Bearer ${id}` } });
    },

    verifyOtp(data: OtpData): Promise<AxiosResponse<UserData>> {
        return apiClient.post('/auth/verify-login-otp', data);
    },
    // API request to send OTP for password reset
    sendOtpForPasswordReset(email: string): Promise<AxiosResponse<{ otpToken: string }>> {
        return apiClient.post('/auth/send-password-reset-otp', { email });
    },

    // API request to verify OTP for password reset
    verifyPasswordResetOtp(data: OtpData): Promise<AxiosResponse<{ id: string; passwordResetToken: string }>> {
        return apiClient.post('/auth/verify-password-reset-otp', data);
    },

    // API request to reset password
    resetPassword(data: ResetData): Promise<AxiosResponse<void>> {
        return apiClient.post('/auth/reset-password', data, {
            headers: {
                Authorization: `Bearer ${data.resetToken}`,
            },
        });
    },
    changePassword(token: string, payload: any): Promise<AxiosResponse<void>> {
        return apiClient.post('/auth/change-password', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
    //API to update user data
    updateUser(token: string, userId: string, name: String, country: string): Promise<AxiosResponse<UserData>> {
        return apiClient.post(
            '/update-user',
            { userId, name, country },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    // API request to get gaienrs
    getGainers(): Promise<AxiosResponse<Gainers_Losers[]>> {
        return apiClient.get('/stocks/gainers');
    },
    getLosers(): Promise<AxiosResponse<Gainers_Losers[]>> {
        return apiClient.get('/stocks/losers');
    },

    // API request to get gaienrs
    getScreener(screenerName: string): Promise<AxiosResponse<ScreenerData[]>> {
        return apiClient.post('/stocks/screeners', { screenerName });
    },

    //API Request to get news
    getNews(): Promise<AxiosResponse<INews[]>> {
        return apiClient.get('/stocks/news');
    },
    //API Request to get dividends Calendar
    getDividendCalendar(): Promise<AxiosResponse<IDividendsCalendar[]>> {
        return apiClient.get('/stocks/dividendsCalender/');
    },
    //API Request to get Eco Event Calendar
    getEcoEventCalendar(): Promise<AxiosResponse<IEcoEventCalendar[]>> {
        return apiClient.get('/stocks/ecoEvents/');
    },
    //API Request to get Earnings Calendar
    getEarningsCalendar(): Promise<AxiosResponse<IEarningsCalendar[]>> {
        return apiClient.get('/stocks/earnings/');
    },
    getSymbols(token: string): Promise<AxiosResponse<SymbolData[]>> {
        return apiClient.get('/symbols', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    //APIs for stock page
    getSymbolData(symbol: string): Promise<AxiosResponse> {
        return apiClient.get(`/symbols/${symbol}`);
    },
    getStockProfile(symbol: string): Promise<AxiosResponse> {
        return apiClient.get(`symbols/profile/${symbol}`);
    },
    getStockNews(symbol: string): Promise<AxiosResponse> {
        return apiClient.get(`symbols/news/${symbol}`);
    },
    getStockChartWidget(symbol: string, field: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/stocks/stock-chart-widget',
            { symbol, field },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
    },

    //API to handle favorite symbols

    addFavoriteSymbol(token: string, symbolId: string, userId: string): Promise<AxiosResponse<string[]>> {
        return apiClient.post(
            '/users/favorite-symbol',
            { symbolId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    removeFavoriteSymbol(token: string, symbolId: string, userId: string): Promise<AxiosResponse<string[]>> {
        return apiClient.delete(`/users/favorite-symbol/${symbolId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    //

    // ############# API for portoflio and watch list ################# //
    getWatchLists(token: string, userId: string): Promise<AxiosPromise> {
        return apiClient.get(`/portfolio/watchlist/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
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
    removeSymbolFromWatchList(token: string, watchListId: string, symbol: string): Promise<AxiosResponse> {
        return apiClient.post(
            `/portfolio/watchlist/remove-symbol`,
            {
                watchListId,
                symbol,
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

    // ############# API For Stock Page ################# //
    getStockPageStatisticsTable(symbol: string, module: string, timeframe: string): Promise<AxiosResponse> {
        return apiClient.post(
            `/stock-page/${timeframe}/${module}`,
            {
                symbol,
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        );
    },

    getTableDataForRatiosAndFundamentals(symbol: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/stock-page/ratios-and-fundamentals',
            { symbol },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        );
    },

    // ############# API For STRIPE ################# //
    getTrialSetupSession(userId: string, plan: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/stripe/create-trial-setup-session',
            { userId, plan },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        );
    },
    getDirectSubscriptionSession(userId: string, plan: string): Promise<AxiosResponse> {
        return apiClient.post(
            '/stripe/create-direct-subscription-session',
            { userId, plan },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        );
    },

    cancelSubscription(userId: string, changeSubStatus: 'canceled'): Promise<AxiosResponse> {
        return apiClient.post(
            '/stripe/cancel-subscription',
            { userId, changeSubStatus },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        );
    },

    renewSubscription(userId: string, changeSubStatus: 'active'): Promise<AxiosResponse> {
        return apiClient.post(
            '/stripe/reactivate-subscription',
            { userId, changeSubStatus },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        );
    },
};
