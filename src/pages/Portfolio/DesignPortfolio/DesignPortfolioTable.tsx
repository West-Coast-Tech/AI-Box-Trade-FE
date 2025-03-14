import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useDispatch, useSelector } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { AddToWatchList } from '../../AdvancedSearch/AddToWatchList';
import { AppState } from '../../../redux/types';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import Swal from 'sweetalert2';

const PAGE_SIZES = [10, 20, 30, 50, 100];
interface DesignPortfolioTableProps {
    data: any[] | null;
    portfolioName: string;
}
const selectSymbols = (state: AppState) => state.symbols.symbols;

const DesignPortfolioTable: React.FC<DesignPortfolioTableProps> = ({ data, portfolioName }) => {
    const symbols = useSelector(selectSymbols);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

    const [recordsData, setRecordsData] = useState<any[]>();
    const [filteredDataLength, setFilteredDataLength] = useState(0);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'allocationPercentage',
        direction: 'desc',
    });

    const navigate = useNavigate();

    const addStocksToHoldings = async () => {
        if (!portfolioName || portfolioName == '' || portfolioName == null) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please save the portfolio first',
                padding: '10px 20px',
            });
            return;
        }
        try {
            const symbols = selectedRecords.map((record) => ({ ticker: record.ticker, entryPrice: record.entryPrice, quantity: record.stocksToBuy }));
            const userId = localStorage.getItem('id') || '';
            const token = localStorage.getItem('token') || '';

            const response = await PortfolioApi.addMultipleStocksToHoldings(token, userId, symbols, portfolioName);
            if (response.status === 200) {
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                toast.fire({
                    icon: 'success',
                    title: 'Stocks Added to Holdings',
                    padding: '10px 20px',
                });
                setSelectedRecords([]);
            }
        } catch (error) {
            console.error('Error adding stocks to holdings:', error);
        }
    };

    // Filter and sort transactions when the search or sort changes
    useEffect(() => {
        if (!data || data == null) {
            setRecordsData(undefined);
            return;
        }

        const filteredTransactions = data.filter((item) =>
            `${item.stockName}${item.allocation}${item.allocationPercentage}${item.entryPrice}${item.targetPrice}`.toLowerCase().includes(search.toLowerCase())
        );

        const sortedTransactions = sortBy(filteredTransactions, sortStatus.columnAccessor);
        const finalData = sortStatus.direction === 'desc' ? sortedTransactions.reverse() : sortedTransactions;

        setFilteredDataLength(finalData.length);
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(finalData.slice(from, to));
    }, [data, search, sortStatus, page, pageSize]);

    // Handle row click
    const handleRowClick = (id: string) => {
        const encodedId = btoa(id);

        navigate(`/transactions/${encodedId}`);
    };

    return (
        <div className=" dark:bg-black p-5 rounded-md mt-3 bg-white shadow-4 ">
            <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                <div>
                    <input
                        type="text"
                        className="form-input w-auto p-2 py-1.5 border border-[#bbccdd] dark:border-[#334455] rounded-md bg-opacity-40 bg-slate-300 dark:bg-black"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={!data}
                    />
                </div>
                <div>
                    <button
                        className={`btn btn-outline-success py-[0.36rem] ${selectedRecords.length == 0 ? 'hover:bg-transparent hover:text-success' : ''} `}
                        disabled={selectedRecords.length == 0}
                        onClick={addStocksToHoldings}
                    >
                        {selectedRecords.length > 0 ? 'Add To Holdings' : 'Select Stocks to add to Holdings'}
                    </button>
                </div>
            </div>
            {data && data.length < 1 ? (
                // <SkeletonDataTable rowCount={10} columnCount={10} />
                <div>Loading...</div>
            ) : (
                <div className="datatables  ">
                    <DataTable
                        highlightOnHover
                        records={recordsData}
                        // onRowClick={(record) => handleRowClick(record._id)} // Add row click event
                        columns={[
                            {
                                accessor: 'index',
                                title: '#',
                                render: (_, index) => index + 1 + (page - 1) * pageSize,
                            },
                            {
                                accessor: 'ticker',
                                title: 'Symbol',
                                sortable: true,
                                render: (record: any) => (
                                    <div className="flex justify-start items-center gap-x-2 cursor-pointer" onClick={() => navigate(`/pages/stocks/${record.ticker}`)}>
                                        {/* Stock icon & name */}
                                        {symbols.find((symbol) => symbol.symbol === record.ticker) && (
                                            <div className="flex items-center gap-2">
                                                <img src={symbols.find((symbol) => symbol.symbol === record.ticker)?.iconUrl} alt={record.ticker} className="w-8 h-8 rounded-3xl" />
                                                <span className="text-sm font-medium hidden lg:block">
                                                    {record.stockName}
                                                    <span className="text-xs ml-3">({record.ticker})</span>
                                                </span>
                                                <span className="lg:hidden">{record.symbol}</span>
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'currentPrice',
                                title: 'Current Price',
                                sortable: true,
                                render: (record) => <div>{Number(record.currentPrice).toFixed(2)} $</div>,
                            },
                            {
                                accessor: 'allocation',
                                title: 'Allocation',
                                sortable: true,
                                render: (record) => <div>{Number(record.allocation.toFixed(0)).toLocaleString()} $</div>,
                            },
                            {
                                accessor: 'allocationPercentage',
                                title: 'Allocation Percentage',
                                sortable: true,
                                textAlignment: 'center',
                                titleClassName: 'flex justify-center',
                                render: (record) => <div>{Number(record.allocationPercentage).toFixed(2)} %</div>,
                            },

                            {
                                accessor: 'entryPrice',
                                title: 'Entry Price',
                                sortable: true,
                                render: (record) => <div>{Number(record.entryPrice).toFixed(2)} $</div>,
                            },

                            {
                                accessor: 'targetPrice',
                                title: 'Target Price',
                                sortable: true,
                            },
                            {
                                accessor: 'stocksToBuy',
                                title: 'Stocks To Buy',
                            },
                            {
                                accessor: 'WatchList',
                                title: 'Follow',
                                cellsClassName: 'font-bold sticky  px-0 mx-0  right-0 dark:bg-black',
                                titleClassName: 'sticky w-0  mx-0 dark:bg-black text-xs ',
                                render: (record: any) => <AddToWatchList symbol={record.ticker} />,
                            },
                        ]}
                        totalRecords={filteredDataLength}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                    />
                </div>
            )}
        </div>
    );
};

export default DesignPortfolioTable;
