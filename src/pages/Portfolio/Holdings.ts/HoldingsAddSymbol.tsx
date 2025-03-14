import React, { useState, useEffect } from 'react';
import { AppState, IHoldingsData } from '../../../redux/types';
import { useSelector } from 'react-redux';
import IconSearch from '../../../components/Icon/IconSearch';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';

const selectSymbols = (state: AppState) => state.symbols.symbols;

interface HoldingsAddSymbolProps {
    onAddHolding: (newHolding: IHoldingsData) => void;
}

const HoldingsAddSymbol: React.FC<HoldingsAddSymbolProps> = ({ onAddHolding }) => {
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
        setSearch(false);
        setSearchTerm('');
        console.log(symbol);

        try {
            const userId = localStorage.getItem('id') || '';
            const token = localStorage.getItem('token') || '';
            const response = await PortfolioApi.addStockToHoldings(token, userId, symbol);
            if (response.status === 200) {
                console.log('Successfully added holding', symbol);
                const newHolding: IHoldingsData = response.data;
                onAddHolding(newHolding);
            }
        } catch (error) {
            console.error('Error adding holding:', error);
        }
    };

    return (
        <div className="relative">
            <form
                className={`${search ? '!block' : ''} relative inset-x-0 translate-y-0 mx-0 z-10 block`}
                onSubmit={(e) => {
                    e.preventDefault();
                    setSearch(false);
                }}
            >
                <div className="relative">
                    <input
                        type="text"
                        className="form-input pl-9 peer sm:bg-transparent bg-gray-100 placeholder:tracking-widest"
                        placeholder="Add new holding..."
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={() => setSearch(true)}
                    />
                    <button type="button" className="absolute w-9 h-9 inset-0 ltr:right-auto rtl:left-auto appearance-none peer-focus:text-primary">
                        <IconSearch className="mx-auto" />
                    </button>
                </div>
            </form>

            {/* Display filtered results */}
            {search && searchTerm && (
                <div className="mt-2 absolute bg-gray-100 dark:bg-dark z-10 rounded-md w-full sm:w-full">
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

export default HoldingsAddSymbol;
