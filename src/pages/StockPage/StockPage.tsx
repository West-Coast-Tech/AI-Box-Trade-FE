import React, { lazy, Suspense, useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LiveQuoteData, NewsBySymbol, StockProfile, SymbolData } from '../../redux/types';
import API from '../../utils/API';
import IncrementalChart from '../../components/AmChart/IncrementalChart';
import { useDispatch } from 'react-redux';
import { selectSymbol } from '../../redux/features/symbolSlice';
import { setPageTitle } from '../../redux/features/themeConfigSlice';

import { StockPageStatisticsTable } from './StockPageStatisticsTable';
import { IncomeStatement } from './IncomeStatement';
import { BalanceSheet } from './BalanceSheet';
import { CashflowStatement } from './CashflowStatement';
// import StockChartWidget from './StockChartWidget';
const StockChartWidget = lazy(() => import('./StockAreaChartWidget'));
import TradingViewWidget from '../../components/TradingView/TradingViewWidget';
const StockPage = () => {
    let { symbol } = useParams();
    const [latestData, setLatestData] = useState();
    const [previousData, setPreviousData] = useState();
    if (!symbol) {
        return <div>No Symbol Found</div>;
    }
    const dispatch = useDispatch();

    const [stockData, setStockData] = useState<SymbolData>();
    const [quoteData, setQuoteData] = useState<LiveQuoteData>();
    const [stockProfile, setStockProfile] = useState<StockProfile>();
    const [stockNews, setStockNews] = useState<NewsBySymbol[]>();
    const fetchSymbolData = async () => {
        if (!symbol) return;
        const response = await API.getSymbolData(symbol);
        if (response) {
            dispatch(selectSymbol(response.data.symbolData));
        }
        setStockData(response.data.symbolData);
        setQuoteData(response.data.quoteData);
    };
    const fetchProfileData = async () => {
        if (!symbol) return;
        const response = await API.getStockProfile(symbol);
        if (response) {
            setStockProfile(response.data);
        }
    };
    const fetchNewsData = async () => {
        if (!symbol) return;
        const response = await API.getStockNews(symbol);
        if (response) {
            setStockNews(response.data);
        }
    };
    useEffect(() => {
        dispatch(setPageTitle(`${symbol} Stocks `));
    });

    useEffect(() => {
        fetchProfileData();
        fetchNewsData();
        fetchSymbolData();
    }, [symbol]);
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                if (!symbol) return;
                const response = await API.getTableDataForRatiosAndFundamentals(symbol);
                const data = response.data;
                console.log('Table Data', data);
                const sortedData = data.sort((a: any, b: any) => b.year - a.year);
                const latestData = sortedData[0];
                const previousData = sortedData[1];
                console.log('table data latest', latestData);
                console.log('table data previous', previousData);
                setLatestData(latestData);
                setPreviousData(previousData);
                // console.log('Stock Statistics', data, netIncomeData, years);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchTableData();
    }, [symbol]);
    const formatTime = (timeInMillis: string | number): string => {
        const date = new Date(Number(timeInMillis));
        return date.toDateString();
    };
    if (!stockData || !quoteData) return <p>Loading...</p>;
    console.log(stockNews);

    //Total Orders
    const fields = [
        { key: 'peRatio', label: 'P/E Ratio' },
        { key: 'evRevenue', label: 'EV Revenue' },
        { key: 'roic', label: 'ROIC' },
        { key: 'priceToFreeCashFlow', label: 'Price to Free Cash Flow' },
        { key: 'revenueGrowth', label: 'Revenue Growth' },
        { key: 'netIncomeGrowth', label: 'Net Income Growth' },
        { key: 'longTermLiabilities', label: 'Long Term Liabilities' },
        { key: 'freeCashFlow', label: 'Free Cash Flow' },
    ];

    return (
        <>
            <div className="w-full grid grid-cols-1 md:grid-cols-6 xl:grid-cols-8 gap-6 grid-auto-rows ">
                {/* Stock Overview */}
                <div className="panel col-span-2 space-y-5 h-full">
                    <div className="border-b border-gray-300 dark:border-gray-600 pb-4 space-y-2">
                        <h1 className="text-2xl font-bold">
                            {stockData.name} ({stockData.symbol})
                        </h1>
                        <p>Country: {stockData.country}</p>
                        <p>Exchange: {stockData.exchange}</p>
                    </div>
                    {/* Company Profile */}
                    <div className="rounded-lg  space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="font-bold text-base">Symbol</p>
                                <p>{stockProfile?.symbol}</p>
                            </div>
                            <div>
                                <p className="font-bold text-base">Name</p>
                                <p>{stockProfile?.name}</p>
                            </div>
                            <div>
                                <p className="font-bold text-base">CEO</p>
                                <p>{stockProfile?.CEO}</p>
                            </div>
                            <div>
                                <p className="font-bold text-base">Industry</p>
                                <p>{stockProfile?.industry}</p>
                            </div>
                            <div>
                                <p className="font-bold text-base">Sector</p>
                                <p>{stockProfile?.sector}</p>
                            </div>
                            <div>
                                <p className="font-bold text-base">Employees</p>
                                <p>{stockProfile?.employees.toLocaleString()}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="font-bold text-base">Website</p>
                                <p className="text-blue-500 underline truncate">
                                    <a title={stockProfile?.website} href={stockProfile?.website} target="_blank" rel="noopener noreferrer" className="truncate">
                                        {stockProfile?.website}
                                    </a>
                                </p>
                            </div>
                            <div className="col-span-2 overflow-hidden">
                                <p className="font-bold text-base">Description</p>
                                <p className="max-h-48">{stockProfile?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart and relevant data */}
                <div className="panel col-span-1 md:col-span-4 xl:col-span-6 h-full">
                    {/* <IncrementalChart showSymbolBar={false} /> */}
                    <div className="h-[70%]">
                        <TradingViewWidget />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 text-sm pt-4 rounded-lg space-x-3 [&>*]:border-b [&>*]:border-dashed  [&>*]:border-gray-600 ">
                        <div className="flex justify-between ml-3">
                            <h3 className="font-bold text-base">Previous Close</h3>
                            <p>{Number(quoteData.previous_close).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">Open</h3>
                            <p>{Number(quoteData.open).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">Close</h3>
                            <p>{Number(quoteData.close).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">Change</h3>
                            <p>{Number(quoteData.change).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">Day's Range</h3>
                            <p>
                                {Number(quoteData.low).toFixed(2)} - {Number(quoteData.high).toFixed(2)}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">Volume</h3>
                            <p>{quoteData.volume}</p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">Avg. Volume</h3>
                            <p>{quoteData.average_volume}</p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">52 Week Range</h3>
                            <p>
                                {Number(quoteData.fifty_two_week?.high).toFixed(2)} - {Number(quoteData.fifty_two_week?.low).toFixed(2)}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">52 Week Low Change %</h3>
                            <p>{Number(quoteData.fifty_two_week?.low_change_percent).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="font-bold text-base">52 Week High Change %</h3>
                            <p>{Number(quoteData.fifty_two_week?.high_change_percent).toFixed(2)}</p>
                        </div>
                        {/* <div className="flex justify-between">
                            <p className="font-bold text-base">Rolling Period Change</p>
                            <p>{quoteData.rolling_period_change}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-bold text-base">EPS (TTM)</p>
                            <p>{quoteData.close}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-bold text-base">Earnings Date</p>
                            <p>{quoteData.close}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-bold text-base">Forward Dividend & Yield</p>
                            <p>{quoteData.close}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-bold text-base">Ex-Dividend Date</p>
                            <p>{quoteData.close}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-bold text-base">1y Target Est</p>
                            <p>{quoteData.close}</p>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-8 gap-6 mt-10">
                {/* News */}
                <div className="panel gap-3 flex flex-col h-full col-span-1 md:col-span-2">
                    <h3 className="font-bold text-lg text-center">Latest News</h3>
                    {stockNews?.map((item, index) => (
                        <Link
                            key={index}
                            to={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex rounded-md border w-100 border-white-light dark:border-[#1b2e4b] px-4 py-1 hover:bg-[#eee] dark:hover:bg-[#eee]/10"
                        >
                            {/* <div className="ltr:mr-3 rtl:ml-3">
                            <img src={item.img || '/assets/images/default-news.jpg'} alt={item.title} className="rounded-full w-3 h-3 object-cover" />
                        </div> */}
                            <div className="flex-1">
                                <h6 className="text-sm font-extrabold text-green-600/90"> {item.title.length > 80 ? `${item.title.slice(0, 90)}...` : item.title}</h6>
                                <p className="text-xs">Source: {item.source}</p>
                                <p className="text-xs">{item.ago}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                {/* Area Chart */}

                <div className="panel col-span-4 gap-4 ">
                    <Suspense fallback={<div>Loading..</div>}>
                        <StockChartWidget symbol={symbol} />
                    </Suspense>
                </div>

                <StockPageStatisticsTable latestData={latestData} previousData={previousData} fields={fields} />
            </div>
            {/* <div className="w-full flex flex-wrap justify-between gap-4 mt-10">
                {fundamentals.map((item) => (
                    <Suspense fallback={<div>Loading..</div>}>
                        <StockChartWidget title={item.title} field={item.url} symbol={symbol} />
                    </Suspense>
                ))}
            </div> */}
            {/* Income Statement */}
            <IncomeStatement symbol={symbol} />
            <BalanceSheet symbol={symbol} />
            <CashflowStatement symbol={symbol} />
        </>
    );
};

export default StockPage;
