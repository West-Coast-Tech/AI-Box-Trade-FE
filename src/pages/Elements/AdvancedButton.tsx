import React from 'react';

// Define the props type
interface AdvancedButtonProps {
    text?: string; // Optional prop
}

export const AdvancedButton: React.FC<AdvancedButtonProps> = ({ text = 'Learn More' }) => {
    return (
        <button className="relative inline-flex items-center justify-start w-48 pb-3 pr-4 overflow-hidden font-medium text-gray-900 bg-transparent border-0 cursor-pointer group focus:outline-none">
            {/* Circle Background */}
            <span className="absolute left-0 top-0 w-12 h-12 bg-[#282936] rounded-full transition-all duration-500 ease-in-out group-hover:w-full"></span>

            {/* Arrow Icon */}
            <span className="relative z-10 flex items-center justify-center w-12 h-12 transition-all duration-500 ease-in-out group-hover:translate-x-4">
                {/* Inline SVG for Arrow */}
                <svg
                    className="w-4 h-4 text-white transition-transform duration-500 ease-in-out transform group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </span>

            {/* Button Text */}
            <span className="relative z-10 flex-1 text-center uppercase font-bold transition-all duration-500 ease-in-out group-hover:text-white">{text}</span>
        </button>
    );
};
