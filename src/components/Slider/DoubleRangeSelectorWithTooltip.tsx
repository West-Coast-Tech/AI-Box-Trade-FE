import React, { useState } from 'react';
import './DoubleRange.css'; // <-- We'll define custom CSS here

const DoubleRangeSelectorWithTooltip: React.FC = () => {
    // Slider boundaries
    const MIN = 0;
    const MAX = 100;

    // Initial values for the two thumbs
    const [leftValue, setLeftValue] = useState(20);
    const [rightValue, setRightValue] = useState(80);

    // States to toggle tooltips on hover
    const [showLeftTooltip, setShowLeftTooltip] = useState(false);
    const [showRightTooltip, setShowRightTooltip] = useState(false);

    // Ensure leftValue <= rightValue
    const handleLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (val <= rightValue) setLeftValue(val);
    };

    // Ensure rightValue >= leftValue
    const handleRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (val >= leftValue) setRightValue(val);
    };

    return (
        <div className="flex flex-col items-center p-4 w-full max-w-sm mx-auto">
            {/* Slider container */}
            <div className="relative w-full h-8">
                {/* Gray track (background) */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-300 rounded"></div>

                {/* Highlighted range between left and right thumbs */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded"
                    style={{
                        left: `${(leftValue / (MAX - MIN)) * 100}%`,
                        width: `${((rightValue - leftValue) / (MAX - MIN)) * 100}%`,
                    }}
                />

                {/* Left Thumb */}
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={leftValue}
                    onChange={handleLeftChange}
                    onMouseEnter={() => setShowLeftTooltip(true)}
                    onMouseLeave={() => setShowLeftTooltip(false)}
                    className="range-thumb absolute top-1/2 -translate-y-1/2 w-full z-[3] cursor-pointer"
                />
                {/* Left Tooltip */}
                {showLeftTooltip && (
                    <div
                        className="pointer-events-none absolute bottom-6 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded"
                        style={{
                            left: `${(leftValue / (MAX - MIN)) * 100}%`,
                        }}
                    >
                        {leftValue}
                    </div>
                )}

                {/* Right Thumb */}
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={rightValue}
                    onChange={handleRightChange}
                    onMouseEnter={() => setShowRightTooltip(true)}
                    onMouseLeave={() => setShowRightTooltip(false)}
                    className="range-thumb absolute top-1/2 -translate-y-1/2 w-full z-[4] cursor-pointer"
                />
                {/* Right Tooltip */}
                {showRightTooltip && (
                    <div
                        className="pointer-events-none absolute bottom-6 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded"
                        style={{
                            left: `${(rightValue / (MAX - MIN)) * 100}%`,
                        }}
                    >
                        {rightValue}
                    </div>
                )}
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
                <span>{MIN}</span>
                <span>{MAX}</span>
            </div>
        </div>
    );
};

export default DoubleRangeSelectorWithTooltip;
