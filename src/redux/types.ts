//src/actions/types.ts

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const USER_LOADED = 'USER_LOADED';
export const USER_LOADING = 'USER_LOADING';
export const AUTH_ERROR = 'AUTH_ERROR';
export const GET_ERRORS = 'GET_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAIL = 'GET_USERS_FAIL';

import { AuthState } from './features/auth/authSlice';
import { ErrorState } from './features/errorSlice';
import { SymbolState } from './features/symbolSlice';
import { UserState } from './features/users/usersSlice';
// User data interface
export interface UserData {
    _id: string;
    id: string;
    fullName: string;
    email: string;
    token: string;
    country: string;
    subStatus: string;
    subType: string;
    favoriteSymbols: string[] | null;
    subscriptionPlan?: 'basic' | 'full';
    subscriptionStatus?: 'trial' | 'active' | 'canceled' | 'expired';
}

// Error data interface
export interface ErrorData {
    msg: string;
    status: number;
}

// Login data interface
export interface LoginData {
    email: string;
    password: string;
}
export interface OtpData {
    otp: string;
    otpToken: string;
}

export interface ResetData {
    resetToken: string;
    id: string;
    newPassword: string;
}
// Register data interface
export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    country: string;
}

export interface SymbolData {
    _id: string;
    symbol: string;
    iconUrl: string;
    type: 'stock';
    name: string;
    country: string;
    exchange: string;
    createdAt: string | null;
}

export interface LiveQuoteData {
    symbol: string;
    name?: string;
    exchange?: string;
    mic_code?: string;
    currency?: string;
    datetime?: string;
    timestamp?: number;
    open?: string;
    high?: string;
    low?: string;
    close?: string;
    volume?: string;
    previous_close?: string;
    change?: string;
    percent_change?: string;
    average_volume?: string;
    rolling_1d_change?: string;
    rolling_7d_change?: string;
    rolling_period_change?: string;
    is_market_open?: boolean;
    fifty_two_week?: {
        low: string;
        high: string;
        low_change: string;
        high_change: string;
        low_change_percent: string;
        high_change_percent: string;
        range: string;
    };
    extended_change?: string;
    extended_percent_change?: string;
    extended_price?: string;
    extended_timestamp?: number;
}
export interface StockProfile {
    symbol: string;
    name: string;
    exchange: string;
    mic_code: string;
    sector: string;
    industry: string;
    employees: number;
    website: string;
    description: string;
    type: string;
    CEO: string;
    address: string;
    address2?: string; // Optional, as not all companies may have a second address line
    city: string;
    zip: string;
    state: string;
    country: string;
    phone: string;
}

export interface NewsBySymbol {
    symbol: string;
    url: string;
    img: string;
    title: string;
    text: string;
    source: string;
    type: string;
    tickers: string[];
    time: string | number;
    ago: string;
}
export interface TradingData {
    timeStamps: string;
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
}

export interface TradesData {
    ticketNo: string;
    symbol: string;
    currency: string;
    tradeDirection: string;
    amountInvested: number;
    openingPrice: number | null;
    closingPrice: number | null;
    openingTime: string;
    closingTime: string;
    isComplete: boolean;
    pnlValue: number | null;
}

export interface Gainers_Losers {
    stockName: string;
    ticker: string;
    exchange: string;
    dayHigh: number;
    dayLow: number;
    dayChange: number;
    price: number;
    volume: number;
    dayChangePercent: number;
    prevClose: number;
    regularMarketVolume: number;
    avgDailyVol3Month: number;
    avgDailyVol10Day: number;
    fiftyTwoWeekLow: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekChangePercent: number;
    fiftyDayAvgChgPercent: number;
    twoHundredDayAvgChgPercent: number;
    marketCap: number;
    avgAnalystRating?: string;
}

export interface ScreenerData {
    screenerName: string;
    stockName: string;
    ticker: string;
    lastPrice: number;
    opinion: string;
    relativeStrength20d: string;
    historicVolatility20d: string;
    averageVolume20d: string;
    lowPrice1y: number;
    highPrice1y: number;
    symbolCode: string;
    symbolType: string;
}
// Define the TypeScript interface for a News
export interface INews {
    url: string;
    img: string;
    title: string;
    text: string;
    source: string;
    type: string;
    tickers: string[];
    time: string | number;
    ago: string;
}

// Define the TypeScript interface for Dividends Calender
export interface IDividendsCalendar {
    date: string;
    dividends: [
        {
            symbol: string;
            symbolName: string;
            lastPrice: string;
            priceChange: string;
            amount: string;
            yield: string;
            exDivDate: string;
            payableDate: string;
            symbolType: string;
        }
    ];
}

export interface IEcoEventCalendar {
    date: string;
    ecoEvents: [
        {
            date: number;
            gmt: string;
            country: string;
            eventName: string;
            actual: string;
            consensus: string;
            previous: string;
            description: string;
        }
    ];
}
export interface IEarningsCalendar {
    date: string;
    earnings: [
        {
            symbol: string;
            symbolName: string;
            nextEarningsDate: string;
            timeCode: string;
            lastPrice: string;
            priceChange: string;
            percentChange: string;
            highPrice: string;
            lowPrice: string;
            volume: string;
            tradeTime: string;
            symbolCode: string;
            symbolType: number;
            estimatedEarnings: string;
            lastReportedEarnings: string;
            lastEarningsSurpriseAmount: string;
            lastEarningsSurprisePercent: string;
            hasOptions: string;
            date: number;
        }
    ];
}

//Types interfaces for portfiolio and watchlists

export interface IWatchLists {
    _id: string;
    userId: string;
    listName: string;
    symbols: string[];
}

export interface IHoldingsData {
    id: string;
    _id: string;
    symbol: string;
    quantity?: string;
    purchasePrice?: string;
    currentPrice?: string;
    percent_change?: string;
    portfolioName?: string;
}

export interface ISevenBoxSymbolsData {
    symbol: string;
    close: string;
    percent_change: string;
    iconUrl: string;
}

// we use here this symbols: Sector Wise PB/Analyst Ratings
export interface IAnalystRatingSymbolsData {
    symbol: string;
    close: string;
    percent_change: string;
    iconUrl: string;
}

// Define the overall shape of your Redux store state
export interface AppState {
    auth: AuthState;
    user: UserState;
    symbols: SymbolState;
    errors: ErrorState;
}

// Action type interfaces
interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS;
    payload: UserData;
}

interface RegisterSuccessAction {
    type: typeof REGISTER_SUCCESS;
    payload: UserData;
}

interface LoginFailAction {
    type: typeof LOGIN_FAIL;
}

interface RegisterFailAction {
    type: typeof REGISTER_FAIL;
}

interface LogoutSuccessAction {
    type: typeof LOGOUT_SUCCESS;
}

interface UserLoadedAction {
    type: typeof USER_LOADED;
    payload: UserData;
}

interface AuthErrorAction {
    type: typeof AUTH_ERROR;
}

interface GetErrorsAction {
    type: typeof GET_ERRORS;
    payload: ErrorData;
}

interface ClearErrorsAction {
    type: typeof CLEAR_ERRORS;
}

interface GetUsersSuccessAction {
    type: typeof GET_USERS_SUCCESS;
    payload: UserData[];
}

interface GetUsersFailAction {
    type: typeof GET_USERS_FAIL;
    payload: string;
}

// Exporting action types
export type AuthActionTypes = LoginSuccessAction | RegisterSuccessAction | LoginFailAction | RegisterFailAction | LogoutSuccessAction | UserLoadedAction | AuthErrorAction;

export type ErrorActionTypes = GetErrorsAction | ClearErrorsAction;

export type UserActionTypes = GetUsersSuccessAction | GetUsersFailAction;
