import React, { useEffect, useState } from 'react';
import { StockBarChartWidget } from './StockBarChartWidget';
import { StockPageStatisticsTable } from './StockPageStatisticsTable';
import { formatNumber } from '../../utils/helper';
import API from '../../utils/API';
import { TimeFrameToggle } from './TimeFrameToggle';
interface CashflowStatement {
    symbol: string;
}
export const CashflowStatement: React.FC<CashflowStatement> = ({ symbol }) => {
    const [changeInCash, setChangeInCash] = useState<any>();
    const [years, setYears] = useState();
    const [latestData, setLatestData] = useState();
    const [previousData, setPreviousData] = useState();
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('annual');
    const fields = [
        { key: 'netIncomeCF', label: 'Net Income' },
        { key: 'ncfo', label: 'Operating Cash Flow' },
        { key: 'ncfi', label: 'Investing Cash Flow' },
        { key: 'ncff', label: 'Financing Cash Flow' },
        { key: 'fcf', label: 'Free Cash Flow' },
    ];

    // Calculate Y/Y change

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const module = 'cashflow';
                if (!symbol || !module) return;
                const response = await API.getStockPageStatisticsTable(symbol, module, selectedTimeFrame);
                const data = response.data;
                const changeInCashData = data.map((item: any) => item.ncf);
                const sortedData = data.sort((a: any, b: any) => b.date - a.date);
                const latestData = sortedData[0];
                const previousData = sortedData[1];
                if (selectedTimeFrame === 'annual') {
                    setYears(data.map((item: any) => item.fiscalYear));
                } else {
                    setYears(data.map((item: any) => new Date(item.date).toLocaleDateString('default', { month: 'short' })));
                }
                const changeInCash = { name: 'Change In Cash', series: changeInCashData };
                setChangeInCash(changeInCash);
                setLatestData(latestData);
                setPreviousData(previousData);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, [symbol, selectedTimeFrame]);
    return (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-6 gap-4 dark:bg-black lg:dark:bg-transparent rounded-md">
            <div className="relative p-5 dark:bg-black rounded-md lg:shadow-md lg:col-span-4">
                <div className="flex items-center flex-row justify-between">
                    <h2 className="font-bold text-2xl">Cashflow Statement</h2>
                    <TimeFrameToggle selectedTimeFrame={selectedTimeFrame} onToggle={setSelectedTimeFrame} />
                </div>{' '}
                <div>
                    <StockBarChartWidget years={years} rightBar={changeInCash} />
                </div>
            </div>
            <StockPageStatisticsTable latestData={latestData} previousData={previousData} fields={fields} />
        </div>
    );
};
