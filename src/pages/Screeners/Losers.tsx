// src/components/LosersTable.tsx

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import Dropdown from '../../components/Dropdown2';
import { setPageTitle } from '../../redux/features/themeConfigSlice';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import API from '../../utils/API';
import { Gainers_Losers } from '../../redux/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown, faArrowDown19, faArrowDownUpLock, faArrowUp } from '@fortawesome/free-solid-svg-icons';
type Column = {
    accessor: string;
    title: string;
};

const LosersTable = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Stock Losers Table'));
    }, [dispatch]);

    // State for gainer data, loading, and error
    const [Losers, setLosers] = useState<Gainers_Losers[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Fetch Losers data from API
    useEffect(() => {
        const fetchLosers = async () => {
            setLoading(true);
            try {
                const response = await API.getLosers();
                setLosers(response.data);
            } catch (err: any) {
                console.error('Error fetching Losers:', err);
                setError('Failed to fetch Losers data.');
            } finally {
                setLoading(false);
            }
        };

        fetchLosers();
    }, []);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    // Pagination and sorting states
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<Gainers_Losers[]>([]);
    const [recordsData, setRecordsData] = useState<Gainers_Losers[]>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'dayChangePercent',
        direction: 'desc',
    });

    const [hideCols, setHideCols] = useState<string[]>(['marketCap', 'avgAnalystRating', 'volume']); // Adjust columns to hide by default

    const formatPercentage = (num: number) => {
        return `${num?.toFixed(2)}%`;
    };

    const formatWithLocale = new Intl.NumberFormat('en-US', {
        notation: 'compact', // Uses "compact" to abbreviate numbers
        compactDisplay: 'short', // Displays abbreviated numbers like 1K, 1M
    });
    // Function to toggle column visibility
    const showHideColumns = (col: string, checked: boolean) => {
        if (!checked) {
            setHideCols((prev) => [...prev, col]);
        } else {
            setHideCols((prev) => prev.filter((c) => c !== col));
        }
    };

    // Update initialRecords when Losers or sortStatus changes
    useEffect(() => {
        let sortedRecords = sortBy(Losers, sortStatus.columnAccessor as keyof Gainers_Losers);
        if (sortStatus.direction === 'desc') {
            sortedRecords = sortedRecords.reverse();
        }
        setInitialRecords(sortedRecords);
    }, [Losers, sortStatus]);

    // Update recordsData based on pagination
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    // Update initialRecords based on search
    useEffect(() => {
        const filtered = Losers.filter((item) => {
            return (
                item.stockName.toLowerCase().includes(search.toLowerCase()) || item.ticker.toLowerCase().includes(search.toLowerCase()) || item.exchange.toLowerCase().includes(search.toLowerCase())
                // Add more fields if needed
            );
        });

        let sortedFiltered = sortBy(filtered, sortStatus.columnAccessor as keyof Gainers_Losers);
        if (sortStatus.direction === 'desc') {
            sortedFiltered = sortedFiltered.reverse();
        }

        setInitialRecords(sortedFiltered);
        setPage(1);
    }, [search, Losers, sortStatus]);

    // Function to calculate progress percentage based on previous close
    const calculateProgress = (prevClose: number, low: number, high: number): number => {
        if (high === low) return 0;
        return ((prevClose - low) / (high - low)) * 100;
    };

    // Define table columns
    const cols: Column[] = [
        { accessor: 'stockName', title: 'Stock Name' },
        { accessor: 'price', title: 'Price' },
        { accessor: 'dayChangePercent', title: 'Day Change %' },
        { accessor: 'dayChange', title: 'Day Change' },
        { accessor: 'marketCap', title: 'Market Cap' },
        { accessor: 'volume', title: 'Volume' },
        { accessor: 'avgAnalystRating', title: 'Avg Analyst Rating' },
        { accessor: 'progress', title: 'Progress' }, // Custom column for progress bar
    ];

    // Random status color function (if needed)
    const randomStatusColor = () => {
        const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
        const random = Math.floor(Math.random() * color.length);
        return color[random];
    };
    const statusColor = (price: number, low: number, high: number) => {
        if (price - low >= high - price) {
            return 'success';
        }
    };
    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Stock Losers</h5>
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                        <div className="flex md:items-center md:flex-row flex-col gap-5">
                            <div className="dropdown">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                    btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                                    button={
                                        <>
                                            <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                                            <IconCaretDown className="w-5 h-5" />
                                        </>
                                    }
                                >
                                    <ul className="w-auto whitespace-nowrap">
                                        {cols.map((col, i) => (
                                            <li key={i} className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center px-4 py-1">
                                                    <label className="cursor-pointer mb-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={!hideCols.includes(col.accessor)}
                                                            className="form-checkbox"
                                                            value={col.accessor}
                                                            onChange={(event) => {
                                                                const { checked } = event.target;
                                                                showHideColumns(col.accessor, checked);
                                                            }}
                                                        />
                                                        <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="text-right">
                            <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="datatables">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <span className="text-lg">Loading...</span>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center py-10">
                            <span className="text-lg text-red-500">{error}</span>
                        </div>
                    ) : (
                        <DataTable
                            noRecordsText="No results match your search query"
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={cols.map((col) => {
                                const isHidden = hideCols.includes(col.accessor);
                                if (col.accessor === 'stockName') {
                                    return {
                                        ...col,
                                        sortable: true,
                                        textAlign: 'center',
                                        hidden: isHidden,
                                        render: (record: Gainers_Losers) => (
                                            <span>
                                                <h4 className="font-bold text-base"> {record.stockName} </h4> <span className="p-4">{record.ticker}</span>
                                            </span>
                                        ),
                                    };
                                }
                                if (col.accessor === 'progress') {
                                    return {
                                        accessor: 'progress',
                                        title: '52 Week Progress',
                                        sortable: false,
                                        hidden: isHidden,
                                        render: (record: Gainers_Losers) => {
                                            const progress = calculateProgress(record.price, record.fiftyTwoWeekLow, record.fiftyTwoWeekHigh);
                                            return (
                                                <div className="flex ">
                                                    <span className="ltr:mr-5 rtl:ml-5 dark:text-white-light">{record.fiftyTwoWeekLow.toFixed(2)}</span>
                                                    <div className="w-[10vh] md:[15vh] rounded-full h-4 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                                                        <div
                                                            className={`bg-gradient-to-r from-danger to-red-300 w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto`}
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">{record.fiftyTwoWeekHigh.toFixed(2)}</span>
                                                </div>
                                            );
                                        },
                                    };
                                }
                                if (col.accessor === 'marketCap') {
                                    return {
                                        ...col,
                                        sortable: true,
                                        hidden: isHidden,
                                        render: ({ marketCap }: Gainers_Losers) => <span>{formatWithLocale.format(marketCap)}</span>,
                                    };
                                }
                                if (col.accessor === 'volume') {
                                    return {
                                        ...col,
                                        sortable: true,
                                        hidden: isHidden,
                                        render: ({ volume }: Gainers_Losers) => <span>{formatWithLocale.format(volume)}</span>,
                                    };
                                }
                                if (col.accessor === 'avgAnalystRating') {
                                    return {
                                        ...col,
                                        sortable: true,
                                        hidden: isHidden,
                                        render: ({ avgAnalystRating }: Gainers_Losers) => <span>{avgAnalystRating || 'N/A'}</span>,
                                    };
                                }
                                if (col.accessor === 'dayChangePercent') {
                                    return {
                                        ...col,
                                        sortable: true,
                                        hidden: isHidden,
                                        render: ({ dayChangePercent }: Gainers_Losers) => (
                                            <span className="text-danger">
                                                {' '}
                                                <FontAwesomeIcon icon={faArrowDown} /> {formatPercentage(dayChangePercent)}
                                            </span>
                                        ),
                                    };
                                }
                                if (col.accessor === 'dayChange') {
                                    return {
                                        ...col,
                                        sortable: true,
                                        hidden: isHidden,
                                        render: ({ dayChange }: Gainers_Losers) => <span className="text-danger">{dayChange?.toFixed(2)}</span>,
                                    };
                                }
                                if (col.accessor === 'fiftyTwoWeekChangePercent' || col.accessor === 'fiftyDayAvgChgPercent' || col.accessor === 'twoHundredDayAvgChgPercent') {
                                    return {
                                        ...col,
                                        sortable: true,
                                        hidden: isHidden,
                                        render: ({ [col.accessor]: value }: any) => <span>{formatPercentage(value)}</span>,
                                    };
                                }
                                return {
                                    accessor: col.accessor as keyof Gainers_Losers,
                                    title: col.title,
                                    sortable: true,
                                    hidden: isHidden,
                                };
                            })}
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LosersTable;
