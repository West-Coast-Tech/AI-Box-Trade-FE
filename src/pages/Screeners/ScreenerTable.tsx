import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import Dropdown from '../../components/Dropdown2';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ScreenerData } from '../../redux/types';

type Column = {
    accessor: string;
    title: string;
    render?: (record: ScreenerData | any) => React.ReactNode;
    isHidden?: boolean;
};

interface ScreenerTableProps<T> {
    data: T[];
    columns: Column[];
    title: string;
    defaultSortColumn?: string;
    apiError?: string;
    loading?: boolean;
    fetchData?: () => void;
    // Any additional props you need
}

function ScreenerTable<T extends Record<string, any>>({ data, columns, title, defaultSortColumn = '', apiError = '', loading = false, fetchData }: ScreenerTableProps<T>) {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    // State for pagination, sorting, and column visibility
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<T[]>([]);
    const [recordsData, setRecordsData] = useState<T[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: defaultSortColumn,
        direction: 'desc',
    });
    const defaultHiddenCols = columns.filter((col) => col.isHidden).map((col) => col.accessor);

    const [hideCols, setHideCols] = useState<string[]>(defaultHiddenCols);

    // Update initialRecords when data or sortStatus changes
    useEffect(() => {
        let sortedRecords = sortBy(data, sortStatus.columnAccessor as keyof T);
        if (sortStatus.direction === 'desc') {
            sortedRecords = sortedRecords.reverse();
        }
        setInitialRecords(sortedRecords);
    }, [data, sortStatus]);

    // Update recordsData based on pagination
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    // Update initialRecords based on search
    useEffect(() => {
        const filtered = data.filter((item) => {
            return Object.values(item).some((value) => String(value).toLowerCase().includes(search.toLowerCase()));
        });

        let sortedFiltered = sortBy(filtered, sortStatus.columnAccessor as keyof T);
        if (sortStatus.direction === 'desc') {
            sortedFiltered = sortedFiltered.reverse();
        }

        setInitialRecords(sortedFiltered);
        setPage(1);
    }, [search, data, sortStatus]);

    // Function to toggle column visibility
    const showHideColumns = (col: string, checked: boolean) => {
        if (!checked) {
            setHideCols((prev) => [...prev, col]);
        } else {
            setHideCols((prev) => prev.filter((c) => c !== col));
        }
    };

    const formatWithLocale = new Intl.NumberFormat('en-US', {
        notation: 'compact', // Uses "compact" to abbreviate numbers
        compactDisplay: 'short', // Displays abbreviated numbers like 1K, 1M
    });

    return (
        <div className="panel h-full">
            <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">{title}</h5>

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
                                    {columns.map((col, i) => (
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
                ) : apiError ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-lg text-red-500">{apiError}</span>
                    </div>
                ) : (
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={columns.map((col) => {
                            const isHidden = hideCols.includes(col.accessor);
                            return {
                                ...col,
                                hidden: isHidden,
                                sortable: true,
                                render: col.render,
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
    );
}

export default ScreenerTable;
