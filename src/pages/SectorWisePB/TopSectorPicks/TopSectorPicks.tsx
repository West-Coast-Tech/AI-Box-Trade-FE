import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { number } from 'yup';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import { AppState } from '../../../redux/types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const sectors = [
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
interface ISectors {
    name: string;
    count: number;
    emoji?: string;
}
const selectSymbols = (state: AppState) => state.symbols.symbols;
const TopSectorPicks = () => {
    const [selectedSector, setSelectedSector] = useState<ISectors>(sectors[0]);
    const [recordsData, setRecordsData] = useState<any>([]);

    const symbols = useSelector(selectSymbols);
    const navigate = useNavigate();

    // Sorting a table
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: '',
        direction: 'desc',
    });

    const formatNumber = (num: number): string => {
        if (num >= 1e12) {
            return (num / 1e12).toFixed(1) + 'T'; // Trillion
        } else if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B'; // Billion
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M'; // Million
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K'; // Thousand
        } else {
            return num.toFixed(1); // Less than thousand
        }
    };

    const records = recordsData.map((item: any) => ({
        symbol: item.symbol,
        marketCap: formatNumber(item.marketCap),
        peRatio: Number(item.peRatio).toFixed(2),
        revenueGrowth: (
            <span className={`flex items-center gap-1 ${item.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>{item.revenueGrowth >= 0 ? '▲' : '▼'}</span>
                <span> {Number(item.revenueGrowth).toFixed(2)}</span>
            </span>
        ),
        netIncomeGrowth: (
            <span className={`flex items-center gap-1 ${item.netIncomeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>{item.netIncomeGrowth >= 0 ? '▲' : '▼'}</span>
                <span> {Number(item.netIncomeGrowth).toFixed(2)}</span>
            </span>
        ),
    }));

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token') || '';
                if (!selectedSector) {
                    console.log('No selected sector, Unable to retreive data');
                    return;
                }
                const response = await PortfolioApi.getTopStocksBySector(token, selectedSector?.name);
                setRecordsData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [selectedSector]);

    // Update initialRecords when data or sortStatus changes
    useEffect(() => {
        let sortedRecords = sortBy(recordsData, sortStatus.columnAccessor);
        if (sortStatus.direction === 'desc') {
            sortedRecords = sortedRecords.reverse();
        }
        setRecordsData(sortedRecords);
    }, [sortStatus]);

    return (
        <div>
            {/* Sectors */}
            <h1 className="text-xl font-semibold mb-5 dark:text-white">All Sectors</h1>
            <div className="flex flex-wrap gap-4 justify-start mb-5">
                {/* Heading */}

                {sectors.map((item, index) => (
                    <div
                        onClick={() => {
                            if (selectedSector == item) {
                                setSelectedSector(sectors[0]);
                            } else {
                                setSelectedSector(item);
                            }
                        }}
                        key={index}
                        className={`h-14 btn shadow-none hover:shadow-gray-500 hover:shadow  w-1/4 sm:w-1/4 md:w-1/5 lg:w-1/6 min-w-44 dark:bg-slate-900 rounded-2xl flex items-center  justify-between px-4 dark:text-white cursor-pointer ${
                            selectedSector === item ? 'border-2 border-blue-500 ' : 'border border-transparent'
                        }`}
                    >
                        <span className="text-left">{item.emoji}</span>
                        <span className="text-center">{item.name}</span>
                        <span className="text-right">({item.count})</span>
                    </div>
                ))}
            </div>

            {/* Data Table */}
            <div className="font-bold text-lg mb-1">Top Stocks in {selectedSector.name} Sector</div>
            {recordsData.length > 0 && (
                <DataTable
                    records={records}
                    className="datatables min-h-[20vh] flex justify-center panel"
                    columns={[
                        {
                            accessor: 'symbol',
                            title: 'Symbol',
                            sortable: true,
                            render: (record: any) => (
                                <div className="flex justify-start items-center gap-x-2 cursor-pointer" onClick={(e) => navigate(`/stocks/${record.symbol}`)}>
                                    {symbols.find((symbol) => symbol.symbol === record.symbol) && (
                                        <div className="flex items-center gap-2">
                                            <img src={symbols.find((symbol) => symbol.symbol === record.symbol)?.iconUrl} alt={record.symbol} className="w-8 h-8 rounded-3xl" />
                                            <span className="text-sm font-medium hidden lg:block">
                                                {symbols.find((symbol) => symbol.symbol === record.symbol)?.name}
                                                <span className="text-xs ml-3">({record.symbol})</span>
                                            </span>
                                            <span className="lg:hidden">{record.symbol}</span>
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                        { accessor: 'marketCap', title: 'Market Cap', sortable: true },
                        { accessor: 'peRatio', title: 'P/E Ratio', sortable: true },
                        { accessor: 'revenueGrowth', title: 'Revenue Growth', sortable: true, render: (record) => <div className="">{record.revenueGrowth}</div> },
                        { accessor: 'netIncomeGrowth', title: 'Net Income Growth', sortable: true, render: (record) => <div className="">{record.netIncomeGrowth}</div> },
                    ]}
                    highlightOnHover
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                />
            )}
        </div>
    );
};

export default TopSectorPicks;
