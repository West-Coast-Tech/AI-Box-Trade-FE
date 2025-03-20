import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { AppState, IHoldingsData } from '../../../redux/types';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import IconTrash from '../../../components/Icon/IconTrash';
import HoldingsAddSymbol from './HoldingsAddSymbol';
import IconPencil from '../../../components/Icon/IconPencil';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const selectSymbols = (state: AppState) => state.symbols.symbols;

interface HoldingsTableProps {
    holdings: IHoldingsData[];
    setHoldings: React.Dispatch<React.SetStateAction<IHoldingsData[]>>;
    showPortfolioName: boolean;
    showAddHoldingSearchBar: boolean;
}
const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings, setHoldings, showPortfolioName, showAddHoldingSearchBar }) => {
    const [selectedRecords, setSelectedRecords] = useState<IHoldingsData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<'quantity' | 'purchasePrice' | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const symbols = useSelector(selectSymbols);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token') || '';
            const idsToDelete = selectedRecords.map((record) => record._id);

            await PortfolioApi.deleteStockFromHoldings(token, idsToDelete);
            const remainingData = holdings.filter((record) => !idsToDelete.includes(record._id));
            setHoldings(remainingData);
            setSelectedRecords([]);
        } catch (error) {
            console.error('Error deleting holdings:', error);
        }
    };

    const startEditing = (id: string, field: 'quantity' | 'purchasePrice', currentValue: number | null) => {
        setEditingId(id);
        setEditingField(field);
        setEditingValue(currentValue !== null ? currentValue.toString() : '');
    };
    const stopEditing = async () => {
        console.log('Stop editing');
        if (!editingId || !editingField) return;
        try {
            const token = localStorage.getItem('token') || '';
            const updatedValue = parseFloat(editingValue);
            const updateData: { quantity?: number; price?: number } = {};

            if (editingField === 'quantity') {
                updateData.quantity = updatedValue;
            } else if (editingField === 'purchasePrice') {
                updateData.price = updatedValue;
            }
            console.log('Sending api request to update holdings');
            const response = await PortfolioApi.updateStockInHoldings(token, editingId, updateData);
            console.log(response);

            setHoldings((prevHoldings) => prevHoldings.map((holding) => (holding._id === editingId ? { ...holding, [editingField]: updatedValue } : holding)));
        } catch (error) {
            console.error('Error updating holding:', error);
        } finally {
            setEditingId(null);
            setEditingField(null);
            setEditingValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            stopEditing();
        }
    };

    const handleBlur = () => {
        stopEditing();
    };

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {showAddHoldingSearchBar && (
                    <div className="pb-3 w-64">
                        <HoldingsAddSymbol
                            onAddHolding={(newHolding: IHoldingsData) => {
                                setHoldings([...holdings, newHolding]);
                            }}
                        />
                    </div>
                )}
                {selectedRecords.length > 0 && (
                    <button onClick={handleDelete} className="mb-4 bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded w-7">
                        <IconTrash />
                    </button>
                )}
            </div>

            <DataTable
                records={holdings}
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
                    { accessor: 'currentPrice', title: 'Current Price', render: ({ currentPrice }) => <span>{Number(currentPrice).toFixed(2)}</span> },
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
                    {
                        accessor: 'quantity',
                        title: 'Quantity',
                        render: (record) =>
                            editingId === record._id && editingField === 'quantity' ? (
                                <input
                                    type="number"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    onBlur={handleBlur}
                                    className="form-input !w-28 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            ) : record.quantity !== undefined && record.quantity !== null ? (
                                <div>
                                    {record.quantity}{' '}
                                    <button className="pl-1 mt-1" onClick={() => startEditing(record._id, 'quantity', Number(record.quantity))}>
                                        <IconPencil />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => startEditing(record._id, 'quantity', Number(record.quantity))}>
                                    <IconPencil />
                                </button>
                            ),
                    },
                    {
                        accessor: 'purchasePrice',
                        title: 'Purchase Price',
                        render: (record) =>
                            editingId === record._id && editingField === 'purchasePrice' ? (
                                <input
                                    type="number"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    onBlur={handleBlur}
                                    className="form-input !w-28 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min={0}
                                />
                            ) : record.purchasePrice !== undefined && record.purchasePrice !== null ? (
                                <div>
                                    {record.purchasePrice}{' '}
                                    <button className="pl-1 mt-1" onClick={() => startEditing(record._id, 'purchasePrice', Number(record.purchasePrice))}>
                                        <IconPencil />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => startEditing(record._id, 'purchasePrice', Number(record.purchasePrice))}>
                                    <IconPencil />
                                </button>
                            ),
                    },
                    {
                        accessor: 'Profit/Loss',
                        title: 'Profit/Loss',

                        render: (record) => (
                            <div>
                                {Number((Number(record.currentPrice) - Number(record.purchasePrice)) * Number(record.quantity)) >= 0 ? (
                                    <span className="text-green-500">▲ {Number((Number(record.currentPrice) - Number(record.purchasePrice)) * Number(record.quantity)).toFixed(2)}</span>
                                ) : (
                                    <span className="text-red-500">▼ {Number((Number(record.currentPrice) - Number(record.purchasePrice)) * Number(record.quantity)).toFixed(2)}</span>
                                )}
                            </div>
                        ),
                    },
                    {
                        accessor: 'marketValue',
                        title: 'Market Value',
                        render: (record) => (
                            <div>
                                {Number(Number(record.currentPrice) * Number(record.quantity)) >= 0 ? (
                                    <span className="text-green-500">▲ {Number(Number(record.currentPrice) * Number(record.quantity)).toFixed(2)}</span>
                                ) : (
                                    <span className="text-red-500">▼ {Number(Number(record.currentPrice) * Number(record.quantity)).toFixed(2)}</span>
                                )}
                            </div>
                        ),
                    },
                    ...(showPortfolioName
                        ? [
                              {
                                  accessor: 'portfolioName',
                                  title: 'Portfolio Name',
                              },
                          ]
                        : []),
                ]}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={setSelectedRecords}
                highlightOnHover
            />
        </div>
    );
};

export default HoldingsTable;
