import React from 'react';
interface TimeFrameToggleProps {
    selectedTimeFrame: string;
    onToggle: (timeFrame: string) => void;
}

export const TimeFrameToggle: React.FC<TimeFrameToggleProps> = ({ selectedTimeFrame = 'annual', onToggle }) => {
    return (
        <div className=" rounded-md dark:bg-gray-800 flex bg-gray-200  p-1">
            <div className={`${selectedTimeFrame == 'annual' ? 'dark:bg-black bg-gray-300' : ''} p-1.5 rounded cursor-pointer`} onClick={(e) => onToggle('annual')}>
                Annual
            </div>
            <div className={`${selectedTimeFrame == 'quarterly' ? 'dark:bg-black bg-gray-300' : ''} p-1.5 rounded cursor-pointer`} onClick={(e) => onToggle('quarterly')}>
                Quarterly
            </div>
        </div>
    );
};
