// src/components/screeners.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../redux/features/themeConfigSlice';
import API from '../../utils/API';
import ScreenerTable from './ScreenerTable';
import { ScreenerData } from '../../redux/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import IconClipboardText from '../../components/Icon/IconClipboardText';
import IconStar from '../../components/Icon/IconStar';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconSquareRotated from '../../components/Icon/IconSquareRotated';
import PerfectScrollbar from 'react-perfect-scrollbar';
import IconListCheck from '../../components/Icon/IconListCheck';
import IconThumbUp from '../../components/Icon/IconThumbUp';
import IconPlus from '../../components/Icon/IconPlus';
import ScreenerList from './ScreenerList';

type Column = {
    accessor: string;
    title: string;
    render?: (record: ScreenerData) => React.ReactNode;
    isHidden?: boolean;
};

/**
 * Helper function to create Screener components
 */
const createScreenerComponent = (title: string, screenerName: string, columns: Column[]) => {
    const ScreenerComponent: React.FC = () => {
        const dispatch = useDispatch();
        const [data, setData] = useState<ScreenerData[]>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string>('');

        useEffect(() => {
            dispatch(setPageTitle(title));
        }, [dispatch, title]);

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await API.getScreener(screenerName);
                    setData(response.data);
                } catch (err: any) {
                    console.error(`Error fetching ${screenerName} data:`, err);
                    setError(`Failed to fetch ${screenerName} data.`);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [screenerName]);

        return (
            <div className=" grid grid-cols-6 gap-6">
                <div className=" col-span-1">
                    <ScreenerList />
                </div>
                <div className="relative col-span-5 ">
                    <ScreenerTable<ScreenerData> data={data} columns={columns} title={title} loading={loading} apiError={error} />
                </div>
            </div>
        );
    };

    return ScreenerComponent;
};

// Define columns for each screener
const commonColumns: Column[] = [
    {
        accessor: 'stockName',
        title: 'Stock Name',
        render: (record: ScreenerData) => (
            <span>
                <h4 className="font-bold text-base">{record.stockName}</h4>
                <span className="p-4">{record.ticker}</span>
            </span>
        ),
    },
    {
        accessor: 'lastPrice',
        title: 'Price',
        render: ({ lastPrice }) => `$${lastPrice.toLocaleString()}`,
    },
    // {
    //     accessor: 'opinion',
    //     title: 'Opinion',
    //     render: ({ opinion }) => <p>{opinion}</p>,
    // },
    {
        accessor: 'opinion',
        title: 'Opinion',
        render: (record: ScreenerData) => {
            if (record.opinion == 'N/A') {
                return <div>Not Available</div>;
            }
            // Extract numeric progress value and decision text
            const progressNumber = record.opinion.split(' ')[0]; // e.g., "100" from "100% Sell"
            const progressDecision = record.opinion.split(' ')[1]; // e.g., "Sell"

            // Determine the progress bar color based on the decision
            const isBuy = progressDecision?.toLowerCase() === 'buy';
            const barColor = isBuy
                ? 'bg-gradient-to-r from-green-500 to-green-300' // Green for "Buy"
                : 'bg-gradient-to-r from-red-500 to-red-300'; // Red for "Sell"

            return (
                <div className="flex flex-col items-center">
                    {/* Progress Bar */}
                    <div className="w-[10vh] rounded-full h-3 p-1 overflow-hidden shadow-3xl dark:shadow-none bg-dark-light dark:bg-dark-light/10">
                        <div className={`${barColor} w-full h-1 rounded-full relative`} style={{ width: `${progressNumber}` }}></div>
                    </div>

                    {/* Text Below the Progress Bar */}
                    <div className={`text-xs mt-2 ${isBuy ? 'text-green-500' : 'text-red-500'}`}>{progressDecision}</div>
                </div>
            );
        },
    },
    {
        accessor: 'relativeStrength20d',
        title: 'Rel Strength 20d',
        render: ({ relativeStrength20d }) => <p> {relativeStrength20d}</p>,
        isHidden: true,
    },
    {
        accessor: 'historicVolatility20d',
        title: 'Hist Volatility 20d',
        render: ({ historicVolatility20d }) => <span> {historicVolatility20d}</span>,
    },
    {
        accessor: 'averageVolume20d',
        title: 'Avg Vol 20d',
        render: ({ averageVolume20d }) => <span> {averageVolume20d}</span>,
    },
    // {
    //     accessor: 'lowPrice1y',
    //     title: 'Low Price 1y',
    //     render: ({ lowPrice1y }) => <span> {lowPrice1y}</span>,
    // },
    // {
    //     accessor: 'highPrice1y',
    //     title: 'High Price 1y',
    //     render: ({ highPrice1y }) => <span> {highPrice1y}</span>,
    // },
    {
        accessor: 'progress',
        title: '52 Week Progress',
        render: (record: ScreenerData) => {
            const progress = ((record.lastPrice - record.lowPrice1y) / (record.highPrice1y - record.lowPrice1y)) * 100;
            return (
                <div className="grid grid-cols-3 items-center">
                    {/* Low Price Column */}
                    <div className="text-center">
                        <span className="dark:text-white-light">{record.lowPrice1y}</span>
                        <p className="text-xs">Low</p>
                    </div>

                    {/* Progress Bar Column */}
                    <div className="w-[10vh] rounded-full h-4 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10 mx-auto">
                        <div
                            className={`bg-gradient-to-r from-gray-500 to-gray-300 w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* High Price Column */}
                    <div className="text-center">
                        <span className="dark:text-white-light">{record.highPrice1y}</span>
                        <p className="text-xs">High</p>
                    </div>
                </div>
            );
        },
    },
];

// Define Screener Components
export const HighVolumeTable = createScreenerComponent('High Volume Stocks', 'high_volume', commonColumns);

export const HotStocksTable = createScreenerComponent('Hot Stocks', 'hot_stocks', commonColumns);

export const TopUnderTenTable = createScreenerComponent('Top Under $10 Screener', 'top_under_10', commonColumns);

export const DividendTable = createScreenerComponent('Dividend Screener', 'dividend', commonColumns);

export const TopFundamentalsTable = createScreenerComponent('Top Fundamentals', 'top_fundamentals', commonColumns);

export const TopTechTable = createScreenerComponent('Top Tech Stocks', 'top_tech', commonColumns);

export const JPatternTable = createScreenerComponent('J-Pattern Stocks', 'j_pattern', commonColumns);

export const GoldenCrossTable = createScreenerComponent('Golden Cross Stocks', 'golden_cross', commonColumns);

export const DeathCrossTable = createScreenerComponent('Death Cross Stocks', 'death_cross', commonColumns);

export const ConsolidationTable = createScreenerComponent('Consolidating Stocks', 'consolidation', commonColumns);

export const RsiOverboughtTable = createScreenerComponent('RSI Overbought Stocks', 'rsi_overbought', commonColumns);

export const RsiOversoldTable = createScreenerComponent('RSI Oversold Stocks', 'rsi_oversold', commonColumns);

export const FiftyTwoWeekTopPicksTable = createScreenerComponent('52 Week Top Picks', '52wk_toppicks', commonColumns);

export const PennyGapTable = createScreenerComponent('Penny Gap Stocks', 'penny_gap', commonColumns);

export const DefensiveStockTable = createScreenerComponent('Defensive Stocks', 'defensive_stock', commonColumns);

export const IncomeGrowthTable = createScreenerComponent('Income Growth Stocks', 'income_growth', commonColumns);

export const BuyLongtermTable = createScreenerComponent('Buy Long-Term Stocks', 'buy_longterm', commonColumns);
