// src/components/Pagination.tsx

import React from 'react';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconCaretsDown from '../../components/Icon/IconCaretsDown';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handleFirst = () => onPageChange(1);
    const handlePrev = () => onPageChange(Math.max(currentPage - 1, 1));
    const handleNext = () => onPageChange(Math.min(currentPage + 1, totalPages));
    const handleLast = () => onPageChange(totalPages);

    // Generate page numbers (you can enhance this to show a subset if totalPages is large)
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex w-full justify-center pt-4">
            <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto mb-4">
                {/* First Page Button */}
                <li>
                    <button
                        type="button"
                        onClick={handleFirst}
                        disabled={currentPage === 1}
                        aria-label="First Page"
                        className={`flex justify-center items-center font-semibold p-2 rounded-full transition
                ${
                    currentPage === 1
                        ? 'bg-white-light text-gray-400 cursor-not-allowed dark:bg-[#191e3a] dark:text-gray-500'
                        : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:bg-[#191e3a] dark:hover:bg-primary'
                }
              `}
                    >
                        <IconCaretsDown className="rotate-90 rtl:-rotate-90" />
                    </button>
                </li>
                {/* Previous Page Button */}
                <li>
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        aria-label="Previous Page"
                        className={`flex justify-center items-center font-semibold p-2 rounded-full transition
                ${
                    currentPage === 1
                        ? 'bg-white-light text-gray-400 cursor-not-allowed dark:bg-[#191e3a] dark:text-gray-500'
                        : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:bg-[#191e3a] dark:hover:bg-primary'
                }
              `}
                    >
                        <IconCaretDown className="rotate-90 rtl:-rotate-90" />
                    </button>
                </li>
                <div className="flex flex-row flex-wrap">
                    {/* Page Numbers */}
                    {pageNumbers.map((number) => (
                        <li key={number}>
                            <button
                                type="button"
                                onClick={() => onPageChange(number)}
                                className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition
                      ${
                          currentPage === number
                              ? 'bg-primary text-white dark:bg-primary dark:text-white-light'
                              : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary'
                      }
                    `}
                                aria-current={currentPage === number ? 'page' : undefined}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </div>
                {/* Next Page Button */}
                <li>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        aria-label="Next Page"
                        className={`flex justify-center items-center font-semibold p-2 rounded-full transition
                ${
                    currentPage === totalPages
                        ? 'bg-white-light text-gray-400 cursor-not-allowed dark:bg-[#191e3a] dark:text-gray-500'
                        : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:bg-[#191e3a] dark:hover:bg-primary'
                }
              `}
                    >
                        <IconCaretDown className="-rotate-90 rtl:rotate-90" />
                    </button>
                </li>
                {/* Last Page Button */}
                <li>
                    <button
                        type="button"
                        onClick={handleLast}
                        disabled={currentPage === totalPages}
                        aria-label="Last Page"
                        className={`flex justify-center items-center font-semibold p-2 rounded-full transition
                ${
                    currentPage === totalPages
                        ? 'bg-white-light text-gray-400 cursor-not-allowed dark:bg-[#191e3a] dark:text-gray-500'
                        : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:bg-[#191e3a] dark:hover:bg-primary'
                }
              `}
                    >
                        <IconCaretsDown className="-rotate-90 rtl:rotate-90" />
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
