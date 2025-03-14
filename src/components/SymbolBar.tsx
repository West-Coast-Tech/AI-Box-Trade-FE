import { useEffect, useRef, useState } from 'react';
import { fetchSymbols } from '../redux/actions/symbolActions';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, SymbolData } from '../redux/types';
import { selectSymbol } from '../redux/features/symbolSlice';
import { addFavoriteSymbols, getUserData, removeFavoriteSymbol } from '../redux/actions/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faStar as solidStar } from '@fortawesome/free-solid-svg-icons'; // Filled star
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'; // Outline star
import PerfectScrollBar from 'react-perfect-scrollbar';

const selectSymbols = (state: AppState) => state.symbols?.symbols;
const selectCurrentSymbol = (state: AppState) => state.symbols?.selectedSymbol;
const selectFavoriteSymbols = (state: AppState) => state.user?.currentUser?.favoriteSymbols || [];

const SymbolBar = () => {
    const symbols = useSelector(selectSymbols);
    const currentSymbol = useSelector(selectCurrentSymbol);
    const favoriteSymbols = useSelector(selectFavoriteSymbols);
    const dispatch = useDispatch<any>();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(currentSymbol?.symbol || '');
    const [category, setCategory] = useState<'forex' | 'crypto' | 'stock'>('stock');
    const [search, setSearch] = useState('');

    const searchRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(getUserData());
        dispatch(fetchSymbols());
    }, [dispatch]);

    useEffect(() => {
        // Focus the search input whenever the symbol bar opens
        if (isOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isOpen]);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const handleOptionClick = (symbol: SymbolData) => {
        setSelectedOption(symbol.symbol);
        dispatch(selectSymbol(symbol));
        setIsOpen(false);
    };

    const handleFavoriteToggle = (e: React.MouseEvent, symbolId: string) => {
        e.stopPropagation();
        if (favoriteSymbols.includes(symbolId)) {
            dispatch(removeFavoriteSymbol(symbolId));
        } else {
            dispatch(addFavoriteSymbols(symbolId));
        }
    };

    // Filter symbols based on category and search query
    const filteredSymbols = symbols.filter((symbol) => symbol.symbol.toLowerCase().includes(search.toLowerCase()) || symbol.name?.toLowerCase().includes(search.toLowerCase())); // filter by search

    // Close the symbol bar if clicked outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                // If click is outside the container and the bar is open, close it
                if (isOpen) {
                    setIsOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={` top-[2.9rem] z-10 pl-[0.385rem]`} ref={containerRef}>
            <div className="flex items-center">
                <button
                    className="text-tBase hover:cursor-pointer p-2.5 py-[0.01rem] rounded-lg font-bold text-lg border-2 border-solid border-gray-500 brightness-125 bg-blue-600 backdrop-blur-sm"
                    onClick={toggleOpen}
                    aria-expanded={isOpen}
                    aria-controls="symbol-table"
                >
                    {isOpen ? '×' : '+'}
                </button>

                <div className="ml-2 md:flex space-x-2 hidden">
                    {favoriteSymbols?.map((symbolId) => {
                        const isFavorited = favoriteSymbols.includes(symbolId);
                        const symbol = symbols?.find((s) => s._id === symbolId);
                        if (!symbol) return null;
                        const isSelected = currentSymbol?._id === symbolId;
                        return (
                            <div
                                key={symbolId}
                                onClick={() => handleOptionClick(symbol)}
                                className={`flex flex-row backdrop-blur-sm items-center text-xs border-2 border-solid border-gray-700 p-[0.45rem] rounded-md cursor-pointer font-bold ${
                                    isSelected ? 'border-2 border-solid border-gray-700 brightness-150 ' : ''
                                }`}
                            >
                                <div>
                                    <FontAwesomeIcon
                                        icon={isFavorited ? solidStar : regularStar}
                                        onClick={(e) => handleFavoriteToggle(e, symbolId)}
                                        className="mr-2 text-yellow-500 cursor-pointer text-[0.7rem]"
                                    />
                                </div>
                                <div className="text-gray-400 font-extrabold">{symbol.symbol}</div>
                                <div>
                                    <FontAwesomeIcon icon={faTimes} className="pl-2" onClick={(e) => handleFavoriteToggle(e, symbolId)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div
                className={`absolute z-50 md:w-[60vh] md:h-fit w-[40vh] rounded-lg shadow-2xl shadow-black transition-all duration-500 ease-in-out transform bg-zinc-950 ${
                    isOpen ? 'opacity-100 translate-y-2' : 'opacity-0 -translate-y-5 pointer-events-none'
                }`}
            >
                {isOpen && (
                    <PerfectScrollBar className="max-h-[40vh] overflow-auto">
                        <div className="flex justify-between p-2 ">
                            <h2 className="text-xl">Select a Symbol</h2>
                            <div className="text-right pt-1">
                                <input
                                    ref={searchRef}
                                    type="text"
                                    className="form-input text-xs"
                                    style={{ paddingTop: '0.1rem', paddingBottom: '0.1rem' }}
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Symbols table */}
                        <table id="symbol-table" className="table-fixed w-full mt-2 ">
                            <thead>
                                <tr>
                                    <th className="py-1 px-2 text-left text-xs">Name</th>
                                    <th className="py-1 px-2 text-left text-xs">Type</th>
                                    <th className="py-1 px-2 text-left text-xs">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSymbols?.map((item: SymbolData) => {
                                    const isFavorited = favoriteSymbols.includes(item._id);
                                    const isSelected = currentSymbol?._id === item?._id;

                                    return (
                                        <tr
                                            key={item._id}
                                            className={`cursor-pointer ${isSelected ? 'border-2 border-solid border-gray-700 brightness-150 ' : ''}`}
                                            onClick={() => handleOptionClick(item)}
                                        >
                                            <td className="py-1 px-2 text-xs flex items-center">
                                                <FontAwesomeIcon
                                                    icon={isFavorited ? solidStar : regularStar}
                                                    onClick={(e) => handleFavoriteToggle(e, item._id)}
                                                    className="mr-2 text-yellow-500 cursor-pointer text-xl"
                                                />
                                                {item.symbol}
                                            </td>
                                            <td className="py-1 px-2 text-xs">{item.type}</td>
                                            <td className="py-1 px-2 text-xs">{item.name}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </PerfectScrollBar>
                )}
            </div>
        </div>
    );
};

export default SymbolBar;
