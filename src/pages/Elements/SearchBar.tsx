import React, { useState, useEffect } from 'react';
import IconSearch from '../../components/Icon/IconSearch';
import IconXCircle from '../../components/Icon/IconXCircle';
import ClickAwayListener from 'react-click-away-listener';
import PerfectScrollbar from 'react-perfect-scrollbar';

interface SearchBarProps<T> {
    data: T[];

    /** The property to search by (must be a string or number). */
    searchKey: keyof T;

    /** Placeholder for the search bar. */
    placeholder?: string;

    /** Callback when an item is clicked. */
    onItemClick: (item: T) => void;

    /** Optional custom render function for dropdown items. */
    renderItem?: (item: T) => React.ReactNode;

    // Enable Live search for drop down items
    enableLiveSearch?: boolean;
}

export function SearchBar<T extends object>({ data, searchKey, placeholder = 'Search...', onItemClick, renderItem, enableLiveSearch = false }: SearchBarProps<T>) {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState<T[]>(data);

    useEffect(() => {
        const term = searchTerm.toLowerCase().trim();

        // If search term is empty, reset to full dataset
        if (!term) {
            setFilteredData(data);
            return;
        }

        // Filter dataset
        const filtered = data.filter((item) => {
            const value = item[searchKey];

            // Ensure value is a primitive (string/number) and check if it includes the search term
            if (typeof value === 'string' || typeof value === 'number') {
                return String(value).toLowerCase().includes(term);
            }

            // Ignore non-primitive values
            return false;
        });

        setFilteredData(filtered);
    }, [searchTerm, data, searchKey]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleItemClick = (item: T) => {
        setSearchVisible(false);
        setSearchTerm('');
        onItemClick(item);
    };

    return (
        <ClickAwayListener onClickAway={() => setSearchVisible(false)}>
            <div className="relative">
                {/* Search input */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSearchVisible(false);
                    }}
                >
                    <div className="relative">
                        <input
                            type="text"
                            className="form-input ltr:pl-9 rtl:pr-9 ltr:pr-9 rtl:pl-9 peer placeholder:tracking-widest"
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setSearchVisible(true)}
                        />
                        <button type="button" className="absolute w-9 h-9 inset-0 ltr:right-auto rtl:left-auto">
                            <IconSearch className="mx-auto" />
                        </button>
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2" onClick={() => setSearchVisible(false)}>
                            <IconXCircle />
                        </button>
                    </div>
                </form>

                {/* Dropdown results */}
                {searchVisible && (searchTerm || enableLiveSearch) && (
                    <PerfectScrollbar className="absolute z-10 dropdown rounded-md shadow-lg w-full h-60 overflow-auto">
                        {filteredData.length > 0 ? (
                            <ul className="py-2">
                                {filteredData.map((item, index) => (
                                    <li key={index} onClick={() => handleItemClick(item)} className="px-4 py-2 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-800">
                                        {renderItem ? renderItem(item) : String(item[searchKey])}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-4 py-2 text-gray-500">No results found.</p>
                        )}
                    </PerfectScrollbar>
                )}
            </div>
        </ClickAwayListener>
    );
}
