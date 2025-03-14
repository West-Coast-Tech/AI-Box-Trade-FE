import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import type { ApexOptions } from 'apexcharts';
import StockAnalystRatingCards from './StockAnalystRatingCards';
import { AppState, IAnalystRatingSymbolsData } from '../../../redux/types';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import { IRootState } from '../../../redux/store';
import AddSymbolSearch from './SearchSymbolAnalystRating';
import { random } from 'lodash';
const sevenBoxSymbolsData: IAnalystRatingSymbolsData[] = [
    {
        symbol: 'AAPL',
        close: '179.45',
        percent_change: '+1.23%',
        iconUrl: 'https://via.placeholder.com/32/000000/ffffff?text=AAPL',
    },
    {
        symbol: 'GOOGL',
        close: '129.34',
        percent_change: '-0.89%',
        iconUrl: 'https://via.placeholder.com/32/ff7777/000000?text=GOOGL',
    },
    {
        symbol: 'TSLA',
        close: '244.67',
        percent_change: '+2.35%',
        iconUrl: 'https://via.placeholder.com/32?text=TSLA',
    },
    {
        symbol: 'AMZN',
        close: '135.78',
        percent_change: '+0.45%',
        iconUrl: 'https://via.placeholder.com/32?text=AMZN',
    },
    {
        symbol: 'MSFT',
        close: '330.12',
        percent_change: '-1.12%',
        iconUrl: 'https://via.placeholder.com/32?text=MSFT',
    },
];

const sectors = [
    { name: 'All', count: 10, emoji: '🌐' },
    { name: 'Financial Services', count: 10, emoji: '💸' },
    { name: 'Consumer Defensive', count: 10, emoji: '🛒' },
    { name: 'Technology', count: 10, emoji: '💻' },
    { name: 'Basic Materials', count: 10, emoji: '🏗️' },
    { name: 'Utilities', count: 10, emoji: '🛠️' },
    { name: 'Real Estate', count: 10, emoji: '🏠' },
    { name: 'Communication Services', count: 10, emoji: '📡' },
    { name: 'Energy', count: 10, emoji: '⚡' },
    { name: 'Healthcare', count: 10, emoji: '🏥' },
];
const StockAnalystRating: React.FC = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [symbol, setSymbol] = useState<string>(sevenBoxSymbolsData[random(sevenBoxSymbolsData.length - 1)]?.symbol || 'AAPL');
    const [data, setData] = useState<any>();
    const [selectedSector, setSelectedSector] = useState(sectors[random(sectors.length - 1)]);
    const [loading] = useState(false);
    const symbols = useSelector((state: AppState) => state.symbols.symbols);
    console.log('Symbols', symbols);
    useEffect(() => {
        async function fetchStockAnalystRating() {
            try {
                const token = localStorage.getItem('token') || '';
                const response = await PortfolioApi.getStockAnalystRating(token, symbol);
                setData(response.data[0]);
                console.log('response', response.data[0]);
            } catch (error) {
                console.error('Failed to fetch Stock analyst rating for symbol', error);
            }
        }
        fetchStockAnalystRating();
    }, [symbol]);

    const DonutOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 460,
            fontFamily: 'Nunito, sans-serif',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 12,
            colors: isDark ? ['#0e1726'] : ['#fff'],
        },
        colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px',
            markers: {
                width: 10,
                height: 10,
                offsetX: -2,
            },
            height: 50,
            offsetY: 20,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '29px',
                            offsetY: -10,
                        },
                        value: {
                            show: true,
                            fontSize: '26px',
                            color: isDark ? '#bfc9d4' : undefined,
                            offsetY: 16,
                            formatter: (val: string) => {
                                return val.toString();
                            },
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#888ea8',
                            fontSize: '29px',
                            formatter: (w: any) => {
                                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                            },
                        },
                    },
                },
            },
        },
        labels: [`Buy`, `Sell`, `Hold`],
        states: {
            hover: {
                filter: {
                    type: 'none',
                    value: 0.15,
                },
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0.15,
                },
            },
        },
    };
    const donutData = {
        series: [data?.consensusOverview?.buy, data?.consensusOverview?.sell, data?.consensusOverview?.hold],
        options: DonutOptions,
    };

    const series = [
        {
            name: 'Price',
            data: data?.historicalConsensus?.map((item: any) => ({
                x: new Date(item.timestamp * 1000),
                y: item.price,
                buy: item.details.buy,
                sell: item.details.sell,
            })),
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 325,
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        grid: {
            position: 'back',
            borderColor: isDark ? '#222244' : '#ccccff',
        },
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'MM/dd/yyyy',
            },
        },
        yaxis: {
            title: {
                text: 'Price',
            },
        },
        title: {
            text: 'Historical Price Target',
            align: 'center',
        },
        tooltip: {
            enabled: true,
            shared: false, // Ensure the series name doesn't appear
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const dataPoint = w?.config?.series?.[seriesIndex]?.data?.[dataPointIndex] as {
                    y: number;
                    buy: number;
                    sell: number;
                };

                const price = dataPoint?.y || 0;
                const buyValue = dataPoint?.buy || 0;
                const sellValue = dataPoint?.sell || 0;

                return `
                    <div class="p-2 bg-white text-black dark:text-white-light dark:bg-gray-900 rounded shadow-md">
                        <div><strong>Price:</strong> $${price.toFixed(2)}</div>
                        <div><strong>Buy:</strong> ${buyValue}</div>
                        <div><strong>Sell:</strong> ${sellValue}</div>
                    </div>
                `;
            },
        },
    };

    return (
        <>
            {' '}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {/* Donut Chart */}

                <div className="flex flex-col col-span-1  items-center justify-center gap-3">
                    <div className=" w-full">
                        <AddSymbolSearch
                            onUpdateSymbol={(symbol) => {
                                setSymbol(symbol);
                            }}
                        />
                    </div>
                    <div className="panel">
                        <div className="dark:bg-black rounded-md py-2">
                            <div className="flex items-center mb-3">
                                <h5 className="font-semibold text-center w-full text-lg dark:text-white-light">Analyst Ratings</h5>
                            </div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                <ReactApexChart series={donutData.series} options={donutData.options} type="donut" height={460} />
                            </div>
                            <div className="text-center mt-5">
                                Based on <strong>{data?.consensusOverview?.buy + data?.consensusOverview?.sell + data?.consensusOverview?.hold}</strong> analysts giving stock ratings to{' '}
                                <strong>{data?.symbol}</strong> in the past <strong>3</strong> months
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="flex md:col-span-3 ">
                    <div className="panel h-full">
                        <div className="p-2 flex justify-center">
                            <strong className="text-2xl font-bold dark:text-white-light">{data?.symbol} Stock 12 Month Forecast</strong>
                        </div>
                        <div className="flex">
                            <h1 className="text-3xl p-2 border-r border-gray-700 border-solid text-info">${data?.consensusOverview?.highPriceTarget}</h1>
                            <div className="p-2">
                                Based on <span className="font-bold ">{data?.consensusOverview?.buy + data?.consensusOverview?.sell + data?.consensusOverview?.hold}</span> Wall Street analysts
                                offering 12 month price targets for {data?.symbol}. in the last 3 months. The average price target is ${Number(data?.consensusOverview?.priceTarget).toFixed(2)} with a
                                high forecast of ${Number(data?.consensusOverview?.highPriceTarget).toFixed(2)} and a low forecast of ${Number(data?.consensusOverview?.lowPriceTarget).toFixed(2)}. The
                                average price target represents a {data?.consensusOverview?.priceTarget} change from the last price of $242.86.
                            </div>
                        </div>

                        <div className="relative mt-3">
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                <ReactApexChart series={series} options={options} type="area" height={325} />
                            </div>
                        </div>
                        <div className="justify-around flex font-bold">
                            <p>
                                Highest Price Target <span className=" text-info text-2xl pl-1"> ${data?.consensusOverview?.highPriceTarget}</span>
                            </p>
                            <p>
                                Price Target <span className=" text-warning text-2xl pl-1"> ${data?.consensusOverview?.priceTarget}</span>
                            </p>
                            <p>
                                Lowest Price Target <span className=" text-danger text-2xl pl-1"> ${data?.consensusOverview?.lowPriceTarget}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <StockAnalystRatingCards
                    symbolsData={sevenBoxSymbolsData}
                    onUpdateSymbol={(symbol: string) => {
                        setSymbol(symbol);
                    }}
                />
            </div>
        </>
    );
};

export default StockAnalystRating;
