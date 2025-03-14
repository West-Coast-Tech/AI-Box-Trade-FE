import React, { useState } from 'react';

const RangeSelectorWithTooltip: React.FC = () => {
    // Configure slider range
    const min = 0;
    const max = 100;
    const [value, setValue] = useState(50);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex flex-col items-center">
            {/* Slider Container */}
            <div className="relative w-full ">
                {/* Range Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step="1"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className=" w-full cursor-pointer accent-blue-600"
                />

                {/* Tooltip */}
                {showTooltip && (
                    <div
                        className="pointer-events-none absolute bottom-6 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap"
                        style={{ left: `${value}%` }} // Position tooltip above the thumb
                    >
                        {value}
                    </div>
                )}
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between w-full max-w-sm mt-2 text-xs text-gray-500">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default RangeSelectorWithTooltip;
