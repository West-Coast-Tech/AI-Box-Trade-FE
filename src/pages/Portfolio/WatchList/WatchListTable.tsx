import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import AddSymbolSearch from './SearchSymbolWatchList';
import WatchListDropdown from './WatchListDropdown';
import { AppState, IWatchLists, LiveQuoteData } from '../../../redux/types';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import AddWatchList from './AddWatchList';
import { set } from 'lodash';
import IconTrash from '../../../components/Icon/IconTrash';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ISymbolData {
    symbol: string;
    data: LiveQuoteData;
}

const selectSymbols = (state: AppState) => state.symbols.symbols;

const WatchlistTable: React.FC = () => {
    const [selectedRecords, setSelectedRecords] = useState<LiveQuoteData[]>([]);
    const [watchLists, setWatchLists] = useState<IWatchLists[]>([]);
    const [selectedWatchList, setSelectedWatchList] = useState<IWatchLists>(watchLists[0]);
    const [symbolData, setSymbolData] = useState<ISymbolData[]>([]);
    const symbols = useSelector(selectSymbols);

    const navigate = useNavigate();

    const fetchWatchLists = async () => {
        try {
            const userId = localStorage.getItem('id') || '';
            const token = localStorage.getItem('token') || '';
            if (!userId || !token) {
                console.warn('User ID or token is missing from localStorage');
                return;
            }

            const response = await PortfolioApi.getWatchLists(token, userId);
            const watchListsData = response.data;
            console.log('watch list', watchListsData);
            setWatchLists(watchListsData);
            if (watchListsData.length > 0) {
                setSelectedWatchList(watchListsData[0]);
            }
        } catch (error) {
            console.error('Error fetching watch lists:', error);
        }
    };

    useEffect(() => {
        fetchWatchLists();
    }, []);

    const fetchSymbolsData = async () => {
        setSymbolData([]);
        try {
            const token = localStorage.getItem('token') || '';
            const response = await PortfolioApi.getWatchListData(token, selectedWatchList?.symbols);
            console.log('Symbol Data for watch list', response.data);
            setSymbolData(response.data);
        } catch (error) {
            console.error('Error fetching symbol data for watch lists', error);
        }
    };

    useEffect(() => {
        fetchSymbolsData();
    }, [selectedWatchList]);

    const transformData = (): LiveQuoteData[] => {
        return symbolData.map(({ symbol, data }) => ({
            id: symbol,
            symbol: symbol || '-',
            name: data?.name || '-',
            exchange: data?.exchange || '-',
            currency: data?.currency || '-',
            datetime: data?.datetime || '-',
            timestamp: data?.timestamp || 0,
            open: data?.open || '-',
            high: data?.high || '-',
            low: data?.low || '-',
            close: data?.close || '-',
            volume: data?.volume || '-',
            previous_close: data?.previous_close || '-',
            change: data?.change || '-',
            percent_change: data?.percent_change || '-',
            average_volume: data?.average_volume || '-',

            fifty_two_week: {
                low: data?.fifty_two_week?.low || '-',
                high: data?.fifty_two_week?.high || '-',
                low_change: data?.fifty_two_week?.low_change || '-',
                high_change: data?.fifty_two_week?.high_change || '-',
                low_change_percent: data?.fifty_two_week?.low_change_percent || '-',
                high_change_percent: data?.fifty_two_week?.high_change_percent || '-',
                range: data?.fifty_two_week?.range || '-',
            },
        }));
    };

    const handleWatchListSelect = (watchList: IWatchLists) => {
        setSelectedWatchList(watchList);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token') || '';
            const symbolsToDelete = selectedRecords.map((record) => record.symbol);
            const watchListId = selectedWatchList?._id;
            const response = await PortfolioApi.removeSymbolFromWatchList(token, symbolsToDelete, watchListId);
            const remainingData = transformData().filter((record) => !symbolsToDelete.includes(record.symbol));
            console.log('Remaining data', remainingData);
            setSelectedWatchList(response.data);
            setSelectedRecords([]);
        } catch (error) {
            console.error('Error deleting symbols from watch list:', error);
        }
    };

    const handleCreateWatchList = async (watchListName: string) => {
        try {
            const userId = localStorage.getItem('id') || '';
            const token = localStorage.getItem('token') || '';
            const response = await PortfolioApi.createWatchList(token, userId, watchListName);
            const newWatchList: IWatchLists = response.data;
            setWatchLists([...watchLists, newWatchList]);
            console.log('New watch list added:', newWatchList);

            if (!selectedWatchList) {
                setSelectedWatchList(newWatchList);
            }
        } catch (error) {
            console.error('Failed to add new list');
        }
    };

    const handleEditWatchList = async (watchListId: string, watchListName: string) => {
        try {
            const token = localStorage.getItem('token') || '';
            const response = await PortfolioApi.updateWatchList(token, watchListId, watchListName);
            const updatedWatchList = response.data;
            setWatchLists(watchLists.map((list) => (list._id === watchListId ? { ...list, listName: updatedWatchList.listName } : list)));
            if (selectedWatchList?._id === watchListId) {
                setSelectedWatchList(updatedWatchList);
            }
        } catch (error) {
            console.error('Failed to edit watch list:', error);
        }
    };

    const handleDeleteWatchList = async (watchListId: string) => {
        try {
            const token = localStorage.getItem('token') || '';
            await PortfolioApi.deleteWatchList(token, watchListId);
            setWatchLists(watchLists.filter((list) => list._id !== watchListId));
            if (selectedWatchList?._id === watchListId) {
                setSelectedWatchList(watchLists[0] || null);
            }
        } catch (error) {
            console.error('Failed to delete watch list:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <WatchListDropdown
                        watchLists={watchLists}
                        selectedWatchList={selectedWatchList || { _id: '', userId: '', listName: '', symbols: [] }}
                        onWatchListSelect={handleWatchListSelect}
                        onDeleteWatchList={handleDeleteWatchList}
                        onEditWatchList={handleEditWatchList}
                    />
                </div>
                <div>
                    <AddWatchList onSave={handleCreateWatchList} />
                </div>
                <div className="pb-3 w-64">
                    <AddSymbolSearch
                        watchList={selectedWatchList}
                        onUpdateWatchList={(updatedWatchList) => {
                            setSelectedWatchList(updatedWatchList);
                            setWatchLists((prevWatchLists) => prevWatchLists.map((list) => (list._id === updatedWatchList._id ? updatedWatchList : list)));
                        }}
                    />
                </div>
                {selectedRecords.length > 0 && (
                    <button onClick={handleDelete} className="mb-4 bg-red-500 hover:bg-red-600 dark:text-white px-1  py-1 rounded w-7">
                        <IconTrash />
                    </button>
                )}
            </div>

            <DataTable
                records={transformData()} // Use the transformed data
                className="datatables min-h-[20vh]"
                columns={[
                    {
                        accessor: 'symbol',
                        title: 'Symbol',
                        sortable: true,
                        render: (record: any) => (
                            <div
                                className="flex justify-start items-center gap-x-2 cursor-pointer hover:scale-105 transition-transform duration-500 font-bold"
                                onClick={(e) => navigate(`/stocks/${record.symbol}`)}
                            >
                                {symbols.find((symbol) => symbol.symbol === record.symbol) && (
                                    <div className="flex items-center gap-2">
                                        <img src={symbols.find((symbol) => symbol.symbol === record.symbol)?.iconUrl} alt={record.symbol} className="w-8 h-8 rounded-3xl" />
                                        <span className="text-sm font-medium hidden lg:block">
                                            {symbols.find((symbol) => symbol.symbol === record.symbol)?.name}
                                            <span className="text-xs ml-3">({record.symbol})</span>
                                        </span>
                                        <span className="lg:hidden">{record.symbol}</span>
                                    </div>
                                )}
                            </div>
                        ),
                    },
                    { accessor: 'close', title: 'Price', render: ({ close }) => <span>{Number(close).toFixed(2)}</span> },
                    {
                        accessor: 'percent_change',
                        title: 'Change %',
                        render: ({ percent_change }) => (
                            <div>
                                {Number(percent_change) >= 0 ? (
                                    <span className="text-green-500">▲ {Number(percent_change).toFixed(2)}</span>
                                ) : (
                                    <span className="text-red-500">▼ {Number(percent_change).toFixed(2)}</span>
                                )}
                            </div>
                        ),
                    },
                    { accessor: 'volume', title: 'Volume' },
                    { accessor: 'peRatio', title: 'P/E Ratio' },
                    { accessor: 'earningsDate', title: 'Earnings Date' },
                    {
                        accessor: 'fifty_two_week.high_change_percent',
                        title: '% from 52w High',
                        render: ({ fifty_two_week }) => (
                            <div>
                                {Number(fifty_two_week?.high_change_percent) >= 0 ? (
                                    <span className="text-green-500">▲ {Number(fifty_two_week?.high_change_percent).toFixed(2)}</span>
                                ) : (
                                    <span className="text-red-500">▼ {Number(fifty_two_week?.high_change_percent).toFixed(2)}</span>
                                )}
                            </div>
                        ),
                    },
                    {
                        accessor: 'fifty_two_week.low_change_percent',
                        title: '% from 52w Low',
                        render: ({ fifty_two_week }) => (
                            <div>
                                {Number(fifty_two_week?.low_change_percent) >= 0 ? (
                                    <span className="text-green-500">▲ {Number(fifty_two_week?.low_change_percent).toFixed(2)}</span>
                                ) : (
                                    <span className="text-red-500">▼ {Number(fifty_two_week?.low_change_percent).toFixed(2)}</span>
                                )}
                            </div>
                        ),
                    },
                ]}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={setSelectedRecords}
                highlightOnHover
            />
        </div>
    );
};

export default WatchlistTable;

// {
//     accessor: 'symbol',
//     title: 'Symbol',
//     sortable: true,
//     render: (record) => (
//         <div
//             className="cursor-pointer hover:scale-105 transition-transform duration-500 font-bold"
//             onClick={(e) => {
//                 navigate(`/stocks/${record.symbol}`);
//             }}
//         >
//             {/* {record.symbol} */}
//         </div>
//     ),
// }
