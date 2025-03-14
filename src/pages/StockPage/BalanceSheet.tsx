import React, { useEffect, useState } from 'react';
import { StockBarChartWidget } from './StockBarChartWidget';
import { StockPageStatisticsTable } from './StockPageStatisticsTable';
import { formatNumber } from '../../utils/helper';
import API from '../../utils/API';
import { TimeFrameToggle } from './TimeFrameToggle';
interface BalanceSheet {
    symbol: string;
}
export const BalanceSheet: React.FC<BalanceSheet> = ({ symbol }) => {
    const [assets, setAssets] = useState<any>();
    const [liabilities, setLiabilites] = useState<any>();
    const [years, setYears] = useState();
    const [latestData, setLatestData] = useState();
    const [previousData, setPreviousData] = useState();
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('annual');
    const fields = [
        { key: 'assets', label: 'Assets' },
        { key: 'liabilities', label: 'Liabilites' },
        { key: 'equity', label: 'Equity' },
        { key: 'totalcash', label: 'Total Cash' },
    ];

    // Calculate Y/Y change

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const module = 'balance-sheet';
                if (!symbol || !module) return;
                const response = await API.getStockPageStatisticsTable(symbol, module, selectedTimeFrame);
                const data = response.data;
                const assetsData = data.map((item: any) => item.assets);
                const liablitiesData = data.map((item: any) => item.liabilities);
                const sortedData = data.sort((a: any, b: any) => b.date - a.date);
                const latestData = sortedData[0];
                const previousData = sortedData[1];
                if (selectedTimeFrame === 'annual') {
                    setYears(data.map((item: any) => item.fiscalYear));
                } else {
                    setYears(data.map((item: any) => new Date(item.date).toLocaleDateString('default', { month: 'short' })));
                }
                const assets = { name: 'Assets', series: assetsData };
                const liabilities = { name: 'Liabilities', series: liablitiesData };
                setLiabilites(liabilities);
                setAssets(assets);
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
                    <h2 className="font-bold text-2xl">Balance Sheet</h2>
                    <TimeFrameToggle selectedTimeFrame={selectedTimeFrame} onToggle={setSelectedTimeFrame} />
                </div>
                <div>
                    <StockBarChartWidget years={years} leftBar={assets} rightBar={liabilities} colors={['#1a80bb', '#b8b8b8']} />
                </div>
            </div>
            <StockPageStatisticsTable latestData={latestData} previousData={previousData} fields={fields} />
        </div>
    );
};
