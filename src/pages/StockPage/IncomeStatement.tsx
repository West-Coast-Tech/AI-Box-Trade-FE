import React, { useEffect, useState } from 'react';
import { StockBarChartWidget } from './StockBarChartWidget';
import { StockPageStatisticsTable } from './StockPageStatisticsTable';
import { formatNumber } from '../../utils/helper';
import API from '../../utils/API';
import { TimeFrameToggle } from './TimeFrameToggle';
interface IncomeStatement {
    symbol: string;
}
export const IncomeStatement: React.FC<IncomeStatement> = ({ symbol }) => {
    const [revenueSeries, setRevenueSeries] = useState<any>();
    const [netIncomeSeries, setNetIncomeSeries] = useState<any>();
    const [years, setYears] = useState();
    const [latestData, setLatestData] = useState();
    const [previousData, setPreviousData] = useState();
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('annual');
    const fields = [
        { key: 'revenue', label: 'Revenue' },
        { key: 'opex', label: 'Operating Expense' },
        { key: 'netinc', label: 'Net Income' },
        { key: 'profitMargin', label: 'Net Profit Margin' },
        { key: 'epsBasic', label: 'Earnings Per Share' },
        { key: 'ebitda', label: 'EBITDA' },
        { key: 'taxrate', label: 'Effective Tax Rate' },
    ];

    // Calculate Y/Y change

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const module = 'income-statement';
                if (!symbol || !module) return;
                const response = await API.getStockPageStatisticsTable(symbol, module, selectedTimeFrame);
                const data = response.data;
                const revenueData = data.map((item: any) => item.revenue);
                const netIncomeData = data.map((item: any) => item.netinc);
                const sortedData = data.sort((a: any, b: any) => b.date - a.date);
                const latestData = sortedData[0];
                const previousData = sortedData[1];
                if (selectedTimeFrame === 'annual') {
                    setYears(data.map((item: any) => item.fiscalYear));
                } else {
                    setYears(data.map((item: any) => new Date(item.date).toLocaleDateString('default', { month: 'short' })));
                }
                setNetIncomeSeries({ name: 'Net Income', series: netIncomeData });
                setRevenueSeries({ name: 'Revenue', series: revenueData });
                setLatestData(latestData);
                setPreviousData(previousData);
                console.log('Stock Statistics', data, netIncomeData, years);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, [symbol, selectedTimeFrame]);
    return (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-6 gap-4 dark:bg-black lg:dark:bg-transparent rounded-md ">
            <div className="relative p-5 dark:bg-black rounded-md lg:shadow-md lg:col-span-4">
                <div className="flex items-center flex-row justify-between">
                    <h2 className="font-bold text-2xl">Income Statement</h2>
                    <TimeFrameToggle selectedTimeFrame={selectedTimeFrame} onToggle={setSelectedTimeFrame} />
                </div>
                <div>
                    <StockBarChartWidget years={years} rightBar={revenueSeries} leftBar={netIncomeSeries} />
                </div>
            </div>
            <StockPageStatisticsTable latestData={latestData} previousData={previousData} fields={fields} />
        </div>
    );
};
