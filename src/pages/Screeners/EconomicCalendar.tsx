import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';

type Column = {
    accessor: string;
    title: string;
    render?: (record: any) => React.ReactNode;
    isHidden?: boolean;
};

interface GroupedData<T> {
    date: string;
    records: T[];
}

interface EconomicCalendarProps<T> {
    groupedData: GroupedData<T>[];
    columns: Column[];
    title: string;
    apiError?: string;
    loading?: boolean;
}

function EconomicCalendar<T extends Record<string, any>>({ groupedData, columns, apiError = '', loading = false }: EconomicCalendarProps<T>) {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const defaultHiddenCols = columns.filter((col) => col.isHidden).map((col) => col.accessor);
    const [hideCols, setHideCols] = useState<string[]>(defaultHiddenCols);
    const [search, setSearch] = useState('');

    // Toggle column visibility
    const showHideColumns = (col: string, checked: boolean) => {
        if (!checked) {
            setHideCols((prev) => [...prev, col]);
        } else {
            setHideCols((prev) => prev.filter((c) => c !== col));
        }
    };

    // Filter grouped data based on search query
    const filteredGroupedData = useMemo(() => {
        if (!search.trim()) {
            return groupedData;
        }

        const lowerCaseSearch = search.toLowerCase();

        return groupedData
            .map((group) => {
                const filteredRecords = group.records.filter((record) =>
                    columns.some((col) => {
                        const value = record[col.accessor];
                        return value && String(value).toLowerCase().includes(lowerCaseSearch);
                    })
                );

                return { ...group, records: filteredRecords };
            })
            .filter((group) => group.records.length > 0);
    }, [groupedData, search, columns]);

    return (
        <div className="">
            <div className="w-[35vh] md:w-[80vh] overflow-auto">
                <div className="flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                        <div className="text-right pt-2">
                            <input
                                type="text"
                                className="form-input text-xs"
                                style={{ paddingTop: '0.1rem', paddingBottom: '0.1rem' }}
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
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
                    ) : filteredGroupedData.length === 0 ? (
                        <div className="flex justify-center items-center py-10">
                            <span className="text-lg">No data available.</span>
                        </div>
                    ) : (
                        <table className="divide-y divide-gray-200 dark:divide-gray-700 mt-2">
                            {/* Table Head */}
                            <thead>
                                <tr>
                                    {columns
                                        .filter((col) => !hideCols.includes(col.accessor))
                                        .map((col) => (
                                            <th key={col.accessor} className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider dark:text-gray-300">
                                                {col.title}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredGroupedData.map((group) => (
                                    <React.Fragment key={group.date}>
                                        {/* Date Header */}
                                        <tr className="bg-gray-100 dark:bg-black">
                                            <td
                                                colSpan={columns.filter((col) => !hideCols.includes(col.accessor)).length}
                                                className="px-6 py-2 text-left text-lg font-extrabold text-gray-700 dark:text-gray-200"
                                            >
                                                {group.date}
                                            </td>
                                        </tr>
                                        {/* Data Rows */}
                                        {group.records.map((record, idx) => (
                                            <tr key={idx}>
                                                {columns.map((col) =>
                                                    !hideCols.includes(col.accessor) ? (
                                                        <td key={col.accessor} className="whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                                                            {col.render ? col.render(record) : record[col.accessor]}
                                                        </td>
                                                    ) : null
                                                )}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EconomicCalendar;
