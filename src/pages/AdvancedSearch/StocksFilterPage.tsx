import React, { useEffect, useState } from 'react';
import PortfolioApi from '../../utils/APIs/PortfolioApi';
import StocksFilterSelector from './StocksFilterSelector';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { AppState } from '../../redux/types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconXCircle from '../../components/Icon/IconXCircle';
import { formatNumber } from '../../utils/helper';
import IconSettings from '../../components/Icon/IconSettings';
import { sortBy } from 'lodash';
import { AddToWatchList } from './AddToWatchList';

export interface IFilters {
    field: string;
    name: string;
    desc: string;
    example?: string;
    min?: string;
    max?: string;
}

const selectSymbols = (state: AppState) => state.symbols.symbols;

const StocksFilterPage = () => {
    // Toggle for showing/hiding the filter selector
    const [showFilterSelector, setShowFilterSelector] = useState(false);

    // The list of currently used filters
    const [filtersUsed, setFiltersUsed] = useState<IFilters[]>([{ field: 'marketCap', name: 'Market Cap', desc: 'desc', min: '1000000000', example: '10M' }]);

    // All fetched records (unpaginated)
    const [initialRecords, setInitialRecords] = useState<any[]>([]);
    // Records for the current page
    const [recordsData, setRecordsData] = useState<any[]>([]);
    // Pagination states
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);

    // Sorting state
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: '',
        direction: 'desc',
    });
    const symbols = useSelector(selectSymbols);
    const navigate = useNavigate();

    // Fetch data whenever filtersUsed changes
    useEffect(() => {
        async function fetchStocksByFilters() {
            console.log('Filters Used', filtersUsed);
            try {
                if (!filtersUsed || filtersUsed.length === 0) {
                    console.log('No filters selected');
                    setInitialRecords([]);
                    setRecordsData([]);
                    return;
                }
                const response = await PortfolioApi.getStocksByFilter(filtersUsed);
                console.log('Filter data', response.data);
                // Store the result in initialRecords, then slice for pagination
                setInitialRecords(response.data);
            } catch (error) {
                console.error('Error fetching record data:', error);
            }
        }
        fetchStocksByFilters();
    }, [filtersUsed]);

    // Re-slice data on pagination changes
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);
    function processInput(value: number, example: string | undefined) {
        console.log('Processing', value, example);
        if (example === '10M') {
            return formatNumber(value);
        } else if (example === '10%') {
            return (value * 100).toFixed(2) + ' %';
        }
        return value;
    }
    // Update initialRecords when data or sortStatus changes
    useEffect(() => {
        let sortedRecords = sortBy(recordsData, sortStatus.columnAccessor);
        if (sortStatus.direction === 'desc') {
            sortedRecords = sortedRecords.reverse();
        }
        setRecordsData(sortedRecords);
    }, [sortStatus]);

    return (
        <div className="panel">
            <div>
                <h2 className="font-bold text-xl mb-4 ml-5 mt-2">Most Active Stocks</h2>
            </div>

            {/* Filters Button */}
            <div className="flex flex-wrap">
                <button
                    className="btn btn-info ml-5 font-bold tracking-wider shadow-none px-6 rounded-full gap-2 hover:scale-[1.02] active:scale-100 transform transition-transform group"
                    onClick={() => {
                        setShowFilterSelector(!showFilterSelector);
                    }}
                >
                    <IconSettings duotone={false} className="group-hover:rotate-180 transform transition-transform " />
                    <p>Select Filters</p>
                </button>

                {/* Display active filters */}
                <div className="flex gap-2 ml-5">
                    {filtersUsed.map((filter) => (
                        <div key={filter.field} className="btn shadow-none btn-outline-primary">
                            {filter.name} {/* Show Min/Max if present */}
                            {filter.min ? ` / Min: ${processInput(Number(filter.min), filter.example)}` : ''}
                            {filter.max ? ` / Max: ${processInput(Number(filter.max), filter.example)}` : ''}
                            {/* Remove Filter Icon */}
                            <div className="ml-2 cursor-pointer" onClick={() => setFiltersUsed(filtersUsed.filter((item) => item.field !== filter.field))}>
                                <IconXCircle />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Selector Modal */}
            {showFilterSelector && (
                <StocksFilterSelector
                    filtersUsed={filtersUsed}
                    setFiltersUsed={setFiltersUsed}
                    toggleVisibility={(visible) => {
                        setShowFilterSelector(visible);
                    }}
                />
            )}

            {/* Data Table */}
            {initialRecords.length > 0 && (
                <DataTable
                    className="datatables min-h-[70vh] flex justify-center p-5"
                    // The current page's records
                    records={recordsData}
                    // Table columns
                    columns={[
                        {
                            accessor: 'symbol',
                            title: 'Symbol',
                            sortable: true,
                            render: (record: any) => (
                                <div className="flex justify-start items-center gap-x-2 cursor-pointer" onClick={() => navigate(`/stocks/${record.symbol}`)}>
                                    {/* Stock icon & name */}
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
                        { accessor: 'marketCap', title: 'Market Cap', sortable: true, render: (record: any) => <span>{formatNumber(Number(record.marketCap))}</span> },
                        { accessor: 'price', title: 'Price', sortable: true, render: (record: any) => <span>{formatNumber(record.price)}</span> },
                        { accessor: 'peRatio', title: 'P/E Ratio', sortable: true, render: (record: any) => <span>{Number(record.peRatio).toFixed(2)}</span> },
                        { accessor: 'revenueGrowth', title: 'Revenue Growth', sortable: true, render: (record: any) => <span>{(Number(record.revenueGrowth) * 100).toFixed(2)} %</span> },
                        { accessor: 'dividendYield', title: 'Dividend Yield', sortable: true, render: (record: any) => <span>{(Number(record.dividendYield) * 100).toFixed(2)} %</span> },
                        {
                            accessor: 'freeCashFlow',
                            title: 'Free Cash Flow',

                            sortable: true,
                            render: (record: any) => <span>{formatNumber(record.freeCashFlow)}</span>,
                        },
                        {
                            accessor: 'WatchList',
                            title: 'Follow',
                            cellsClassName: 'font-bold sticky  px-0 mx-0  right-0 dark:bg-black',
                            titleClassName: 'sticky w-0  mx-0 dark:bg-black text-xs ',
                            render: (record: any) => <AddToWatchList symbol={record.symbol} />,
                        },
                    ]}
                    highlightOnHover
                    // Pagination Props
                    totalRecords={initialRecords.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    // Sorting Props
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                />
            )}
        </div>
    );
};

export default StocksFilterPage;
