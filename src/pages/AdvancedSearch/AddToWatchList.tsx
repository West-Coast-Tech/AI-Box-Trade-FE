import React, { useEffect, useState, useRef, useCallback } from 'react';
import PortfolioApi from '../../utils/APIs/PortfolioApi';
import { IWatchLists } from '../../redux/types';
import IconStar from '../../components/Icon/IconStar';
import IconChecks from '../../components/Icon/IconChecks';
import IconPlusCircle from '../../components/Icon/IconPlusCircle';

interface AddToWatchListProps {
    symbol: string;
}

export const AddToWatchList: React.FC<AddToWatchListProps> = ({ symbol }) => {
    const [watchLists, setWatchLists] = useState<IWatchLists[]>([]);
    const [activeDropdownSymbol, setActiveDropdownSymbol] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /**
     * Determine if this record’s symbol exists in any watch list
     * Used to fill the star icon immediately
     */
    const symbolInAnyWatchList = useCallback((symbol: string, lists: IWatchLists[]) => {
        return lists.some((wl) => wl.symbols.includes(symbol));
    }, []);

    // Star fill state
    const [isFilled, setIsFilled] = useState<boolean>(false);

    /**
     * Initial fetch of watch lists on mount
     */
    useEffect(() => {
        const fetchWatchLists = async () => {
            try {
                const userId = localStorage.getItem('id') || '';
                const token = localStorage.getItem('token') || '';
                if (!userId || !token) {
                    console.warn('User ID or token is missing from localStorage');
                    return;
                }

                const response = await PortfolioApi.getWatchLists(token, userId);
                const watchListsData = response.data as IWatchLists[];
                setWatchLists(watchListsData);
                setIsFilled(symbolInAnyWatchList(symbol, watchListsData));
            } catch (error) {
                console.error('Error fetching watch lists:', error);
            }
        };
        fetchWatchLists();
    }, [symbol, symbolInAnyWatchList]);

    /**
     * Close dropdown if user clicks outside
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdownSymbol(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /**
     * Toggle the dropdown for a specific symbol
     */
    const toggleDropdown = (symbol: string) => {
        setActiveDropdownSymbol((prev) => (prev === symbol ? null : symbol));
    };

    /**
     * Handle adding a symbol to a watch list with optimistic UI
     */
    const handleItemClick = async (symbol: string, watchlistId: string) => {
        if (watchLists.find((watchlist) => watchlist._id === watchlistId)?.symbols.includes(symbol)) return;
        // 1) Immediately update local state so user sees changes right away
        setWatchLists((prevLists) => {
            // Copy the arrays
            const updated = structuredClone(prevLists) as IWatchLists[];

            // Find the watch list
            const targetWatchList = updated.find((wl) => wl._id === watchlistId);
            if (targetWatchList) {
                targetWatchList.symbols.push(symbol);
            }

            return updated;
        });
        setIsFilled(true); // The star should fill because the symbol is now in at least one watch list

        // 2) Attempt the server call
        try {
            const token = localStorage.getItem('token') || '';
            const response = await PortfolioApi.addSymbolToWatchList(token, watchlistId, symbol);
            if (response.status !== 200) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            console.log('Successfully added symbol to watchlist:', symbol, watchlistId);
        } catch (error) {
            console.error('Error adding symbol to watchlist, reverting changes:', error);

            // 3) Revert local state on error
            setWatchLists((prevLists) => {
                const reverted = structuredClone(prevLists) as IWatchLists[];

                // Remove symbol from the watchlist that we just tried to add
                const targetWatchList = reverted.find((wl) => wl._id === watchlistId);
                if (targetWatchList) {
                    targetWatchList.symbols = targetWatchList.symbols.filter((s) => s !== symbol);
                }
                return reverted;
            });

            // If the symbol is no longer in any watchlist after revert, unfill the star
            setIsFilled((prevFilled) => {
                // Check if symbol is in any watchlist after revert
                const stillInList = symbolInAnyWatchList(symbol, watchLists);
                return stillInList ? prevFilled : false;
            });
        }
    };

    /**
     * Render the star icon and dropdown if this row is active
     */
    const renderStarAndDropdown = () => {
        return (
            <div className="relative flex" ref={dropdownRef}>
                {/* Star Icon */}
                <div className="cursor-pointer" onClick={() => toggleDropdown(symbol)}>
                    <IconStar fill={isFilled} />
                </div>

                {/* Dropdown */}
                {activeDropdownSymbol === symbol && watchLists?.length > 0 && (
                    <div className="absolute -top-4 right-16 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-[10000]">
                        <ul className="py-2 px-4">
                            {watchLists.map((watchList) => {
                                const alreadyIncluded = watchList.symbols.includes(symbol);
                                return (
                                    <li
                                        key={watchList._id}
                                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded flex justify-between items-center"
                                        onClick={() => {
                                            handleItemClick(symbol, watchList._id);
                                            console.log(`Added ${symbol} to ${watchList.listName}`);
                                        }}
                                    >
                                        <span>{watchList.listName}</span>
                                        {alreadyIncluded ? <IconChecks /> : <IconPlusCircle />}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return <div>{renderStarAndDropdown()}</div>;
};
