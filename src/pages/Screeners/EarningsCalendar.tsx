// DividendCalendar.tsx

import React, { useEffect, useState } from 'react';
import { IEarningsCalendar } from '../../redux/types';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../redux/features/themeConfigSlice';
import API from '../../utils/API';
import EconomicCalendar from './EconomicCalendar';
import { Tabs } from '@mantine/core'; // Import Mantine Tabs
import { sortBy } from 'lodash'; // Import sortBy from lodash

// Helper Functions

/**
 * Determines the start of the week based on a given date.
 * Assumes the week starts on Sunday. Adjust if needed.
 * @param date - The reference Date object.
 * @returns A new Date object set to the start of the week.
 */
const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = date.getDate() - day;
    return new Date(date.getFullYear(), date.getMonth(), diff);
};

/**
 * Determines the end of the week based on a given date.
 * Assumes the week ends on Saturday. Adjust if needed.
 * @param date - The reference Date object.
 * @returns A new Date object set to the end of the week.
 */
const getEndOfWeek = (date: Date): Date => {
    const startOfWeek = getStartOfWeek(date);
    return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
};

/**
 * Adds a specified number of days to a Date object.
 * @param date - The original Date object.
 * @param days - Number of days to add.
 * @returns A new Date object with added days.
 */
const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * Checks if two Date objects represent the same calendar day.
 * @param date1 - First Date object.
 * @param date2 - Second Date object.
 * @returns True if both dates are the same day, else false.
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

/**
 * Checks if a Date object is between two other dates (inclusive).
 * @param date - The Date to check.
 * @param start - Start Date.
 * @param end - End Date.
 * @returns True if date is between start and end, else false.
 */
const isBetween = (date: Date, start: Date, end: Date): boolean => {
    return date >= start && date <= end;
};

// Columns Definition

type Column = {
    accessor: string;
    title: string;
    render?: (record: IEarningsCalendar['earnings'][0]) => React.ReactNode;
    isHidden?: boolean;
};

const columns: Column[] = [
    {
        accessor: 'symbolName',
        title: 'Company Name',
        render: (record) => (
            <span>
                <h4 className="font-bold text-xs w-[9rem] overflow-auto text-wrap">
                    {record.symbolName} ({record.symbol})
                </h4>
            </span>
        ),
    },

    {
        accessor: 'nextEarningsDate',
        title: 'nextEarningsDate',
        render: ({ nextEarningsDate }) => nextEarningsDate,
    },
    {
        accessor: 'timeCode',
        title: 'Time Code',
        render: ({ timeCode }) => timeCode,
    },
    {
        accessor: 'estimatedEarnings',
        title: 'estimatedEarnings',
        render: ({ estimatedEarnings }) => estimatedEarnings,
    },
    {
        accessor: 'lastReportedEarnings',
        title: 'lastReportedEarnings',
        render: ({ lastReportedEarnings }) => lastReportedEarnings,
    },
    {
        accessor: 'lastEarningsSurpriseAmount',
        title: 'lastEarningsSurpriseAmount',
        render: ({ lastEarningsSurpriseAmount }) => lastEarningsSurpriseAmount,
    },
    {
        accessor: 'lastEarningsSurprisePercent',
        title: 'lastEarningsSurprisePercent',
        render: ({ lastEarningsSurprisePercent }) => lastEarningsSurprisePercent,
    },
];

interface GroupedData<T> {
    date: string;
    records: T[];
}

const EarningsCalendar = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<IEarningsCalendar[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string | null>('today'); // Adjusted type

    useEffect(() => {
        dispatch(setPageTitle('Earnings Calendar'));
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await API.getEarningsCalendar();
                // Ensure data is sorted by date ascending
                const sortedData = sortBy(response.data, (item) => new Date(item.date).getTime());

                setData(sortedData);
                console.log('sortedData', response.data);
            } catch (err: any) {
                console.error(`Error fetching earnings data:`, err);
                setError(`Failed to fetch earnings calendar data.`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Utility functions to filter data based on active tab and search
    const getFilteredData = (): GroupedData<IEarningsCalendar['earnings'][0]>[] => {
        if (data.length === 0) return [];

        // Extract unique sorted dates from data
        const uniqueDates = data.map((item) => new Date(item.date));
        uniqueDates.sort((a, b) => a.getTime() - b.getTime());

        const firstDate = uniqueDates[0];
        const startOfFirstWeek = getStartOfWeek(firstDate);
        const endOfFirstWeek = getEndOfWeek(firstDate);
        const startOfSecondWeek = getStartOfWeek(addDays(startOfFirstWeek, 8));
        const endOfSecondWeek = getEndOfWeek(addDays(startOfFirstWeek, 14));

        let filtered: IEarningsCalendar[] = [];

        switch (activeTab) {
            case 'yesterday':
                filtered = data.filter((item) => isSameDay(new Date(item?.date), uniqueDates[0]));
                break;
            case 'today':
                filtered = data.filter((item) => isSameDay(new Date(item?.date), uniqueDates[1]));
                break;
            case 'tomorrow':
                if (uniqueDates.length >= 2) {
                    filtered = data.filter((item) => isSameDay(new Date(item?.date), uniqueDates[2]));
                } else {
                    filtered = [];
                }
                break;
            case 'thisWeek':
                filtered = data.filter((item) => {
                    const itemDate = new Date(item?.date);
                    return isBetween(itemDate, startOfFirstWeek, endOfFirstWeek);
                });
                break;
            case 'nextWeek':
                filtered = data.filter((item) => {
                    const itemDate = new Date(item?.date);
                    return isBetween(itemDate, startOfSecondWeek, endOfSecondWeek);
                });
                break;
            default:
                filtered = [];
        }

        // Transform the filtered data into grouped format
        const groupedDataMap: { [key: string]: any[] } = {};

        filtered?.forEach((item) => {
            if (!item?.earnings) return;
            const itemDate = new Date(item.date);
            const formattedDate = itemDate.toDateString(); // e.g., "October 22, 2024"
            if (!groupedDataMap[formattedDate]) {
                groupedDataMap[formattedDate] = [];
            }
            groupedDataMap[formattedDate]?.push(...item?.earnings);
        });

        // Convert the map to an array of grouped data
        let groupedData: GroupedData<IEarningsCalendar['earnings'][0]>[] = Object.entries(groupedDataMap)?.map(([date, records]) => ({
            date,
            records,
        }));

        // Sort the grouped data by date ascending
        groupedData = sortBy(groupedData, (group) => new Date(group.date).getTime());

        return groupedData;
    };

    const groupedData = getFilteredData();

    return (
        <div className="items-center justify-center flex">
            <div className="panel">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Earnings Calendar</h5>
                {/* Tabs for selecting the time frame */}
                <Tabs value={activeTab} onTabChange={setActiveTab} variant="outline" className="dark:text-white-light">
                    <Tabs.List>
                        <Tabs.Tab className="dark:text-white-light" value="yesterday">
                            Yesterday
                        </Tabs.Tab>
                        <Tabs.Tab className="dark:text-white-light" value="today">
                            Today
                        </Tabs.Tab>
                        <Tabs.Tab className="dark:text-white-light" value="tomorrow">
                            Tomorrow
                        </Tabs.Tab>
                        <Tabs.Tab className="dark:text-white-light" value="thisWeek">
                            This Week
                        </Tabs.Tab>
                        <Tabs.Tab className="dark:text-white-light" value="nextWeek">
                            Next Week
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                <EconomicCalendar<IEarningsCalendar['earnings'][0]>
                    groupedData={groupedData}
                    columns={columns}
                    title={`Earnings - ${activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : 'All'}`}
                    loading={loading}
                    apiError={error}
                />
            </div>
        </div>
    );
};

export default EarningsCalendar;
