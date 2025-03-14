import React, { useState, useEffect } from 'react';
import IconSearch from '../Icon/IconSearch';
import IconXCircle from '../Icon/IconXCircle';
import { AppState } from '../../redux/types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const selectSymbols = (state: AppState) => state.symbols.symbols;

const SearchSymbol: React.FC = () => {
    const symbols = useSelector(selectSymbols);
    const navigate = useNavigate();
    const [search, setSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSymbols, setFilteredSymbols] = useState(symbols);

    useEffect(() => {
        const filtered = symbols.filter((item) => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredSymbols(filtered);
    }, [searchTerm, symbols]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleItemClick = (symbol: string) => {
        setSearch(false); // Close the search dropdown
        setSearchTerm('');
        navigate(`/pages/stocks/${symbol}`);
    };

    return (
        <div className="w-[50%] relative">
            <form
                className={`${search ? '!block' : ''} sm:relative absolute inset-x-0 sm:top-0 top-1/2 sm:translate-y-0 -translate-y-1/2 sm:mx-0 mx-4 z-10 sm:block hidden`}
                onSubmit={(e) => {
                    e.preventDefault();
                    setSearch(false);
                }}
            >
                <div className="relative">
                    <input
                        type="text"
                        className="form-input ltr:pl-9 rtl:pr-9 ltr:sm:pr-4 rtl:sm:pl-4 ltr:pr-9 rtl:pl-9 peer sm:bg-transparent bg-gray-100 placeholder:tracking-widest"
                        placeholder="Search Stock..."
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={() => setSearch(true)} // Show search dropdown on focus
                    />
                    <button type="button" className="absolute w-9 h-9 inset-0 ltr:right-auto rtl:left-auto appearance-none peer-focus:text-primary">
                        <IconSearch className="mx-auto" />
                    </button>
                    <button type="button" className="hover:opacity-80 sm:hidden block absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2" onClick={() => setSearch(false)}>
                        <IconXCircle />
                    </button>
                </div>
            </form>
            <button type="button" onClick={() => setSearch(!search)} className="search_btn sm:hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60">
                <IconSearch className="w-4.5 h-4.5 mx-auto dark:text-[#d0d2d6]" />
            </button>

            {/* Display filtered results */}
            {search && searchTerm && (
                <div className="mt-2 absolute bg-gray-100 dark:bg-dark z-10 rounded-md w-full sm:w-full overflow-hidden max-h-[26vh]">
                    {filteredSymbols.length > 0 ? (
                        <ul className="shadow-lg rounded-md overflow-hidden">
                            {filteredSymbols.map((item) => (
                                <li key={item.symbol} onClick={() => handleItemClick(item.symbol)} className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <div className="flex justify-between">
                                        <p>{item.symbol}</p> <p>{item.name}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-4 py-2 text-gray-500">No results found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchSymbol;
