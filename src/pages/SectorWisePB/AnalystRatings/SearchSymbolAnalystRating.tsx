import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState, IWatchLists } from '../../../redux/types';
import IconSearch from '../../../components/Icon/IconSearch';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import PerfectScrollbar from 'react-perfect-scrollbar';

const selectSymbols = (state: AppState) => state.symbols.symbols;

interface AddSymbolSearchProps {
    onUpdateSymbol: (updateSymbol: string) => void;
}

const AddSymbolSearch: React.FC<AddSymbolSearchProps> = ({ onUpdateSymbol }) => {
    const symbols = useSelector(selectSymbols);
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

    const handleItemClick = async (symbol: string) => {
        setSearch(false); // Close the search dropdown
        setSearchTerm('');
        console.log(symbol);

        onUpdateSymbol(symbol);
    };

    return (
        <div className="relative">
            <form
                className={`${search ? '!block' : ''} relative  inset-x-0  translate-y-0  mx-0  z-10 block`}
                onSubmit={(e) => {
                    e.preventDefault();
                    setSearch(false);
                }}
            >
                <div className="relative">
                    <input
                        type="text"
                        className="form-input pl-9 peer sm:bg-transparent bg-gray-100 placeholder:tracking-widest"
                        placeholder="Search new stock..."
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={() => setSearch(true)} // Show search dropdown on focus
                    />
                    <button type="button" className="absolute w-9 h-9 inset-0 ltr:right-auto rtl:left-auto appearance-none peer-focus:text-primary">
                        <IconSearch className="mx-auto" />
                    </button>
                </div>
            </form>

            {/* Display filtered results */}
            {search && searchTerm && (
                <PerfectScrollbar className="absolute overflow-auto h-[26vh] hidden z-10">
                    <div className="mt-2 bg-gray-100 dark:bg-dark z-10 rounded-md w-full sm:w-full">
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
                </PerfectScrollbar>
            )}
        </div>
    );
};

export default AddSymbolSearch;
