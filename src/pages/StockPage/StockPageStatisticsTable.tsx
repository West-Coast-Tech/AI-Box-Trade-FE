import React, { useEffect } from 'react';
import API from '../../utils/API';
import { formatNumber } from '../../utils/helper';
interface StockPageStatisticsTableProps {
    latestData: any;
    previousData: any;
    fields: { key: string; label: string }[];
}
export const StockPageStatisticsTable: React.FC<StockPageStatisticsTableProps> = ({ latestData, previousData, fields }) => {
    if (!latestData || !previousData) return null;
    const calculateYoYChange = (latest: number, previous: number) => {
        if (previous === 0 || previous === null || latest === null) return 'N/A';
        const result = ((latest - previous) / previous) * 100;
        return <div className={`${result > 0 ? 'text-success' : 'text-danger'}`}>{result.toFixed(2) + '%'}</div>;
    };
    return (
        <div className="lg:col-span-2 dark:bg-black lg:shadow-md relative rounded-md grid grid-cols-3 gap-y-4 p-5">
            <div className="col-span-2 flex justify-between font-extrabold text-lg">
                <div className="">Metrics</div>
                <div className="">Current</div>
            </div>
            <div className="col-span-1 text-end font-extrabold text-lg">Change</div>

            {fields.map(({ key, label }) => (
                <React.Fragment key={key}>
                    <div className="col-span-2 flex justify-between border-b border-gray-700">
                        <div>{label}</div>
                        <div>{latestData[key] !== undefined ? formatNumber(Number(latestData[key])) : 'N/A'}</div>
                    </div>
                    <div className="col-span-1 text-end border-b border-gray-700">{calculateYoYChange(latestData[key], previousData[key])}</div>
                </React.Fragment>
            ))}
        </div>
    );
};
