import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IAnalystRatingSymbolsData } from '../../../redux/types';

interface StockAnalystRatingCards {
    symbolsData: IAnalystRatingSymbolsData[];
    onUpdateSymbol: (symbol: string) => void;
}

const StockAnalystRatingCards: React.FC<StockAnalystRatingCards> = ({ symbolsData, onUpdateSymbol }) => {
    const navigate = useNavigate();

    return (
        <>
            {symbolsData && symbolsData.length > 0 && (
                <div className="mt-10">
                    <h2 className="font-bold text-xl mb-4">Stocks</h2>
                    <div className="flex flex-wrap gap-5">
                        {symbolsData.map(
                            (symbolData: IAnalystRatingSymbolsData, index) =>
                                symbolData && (
                                    <div
                                        key={index}
                                        className="w-full sm:w-auto lg:flex-1 flex cursor-pointer hover:scale-105 transition-transform duration-500"
                                        onClick={() => {
                                            onUpdateSymbol(symbolData?.symbol);
                                        }}
                                    >
                                        <div className=" shadow-lg dark:bg-gray-800 rounded-lg p-4 w-full max-w-xs text-dark dark:text-white">
                                            <div className="flex items-center mb-2">
                                                <img width={40} src={symbolData?.iconUrl} className="p-1 rounded-full" alt={symbolData?.symbol} />
                                                <h3 className="font-bold text-lg pl-2">{symbolData?.symbol}</h3>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>
                                                    <span className="font-semibold">Close:</span> {Number(symbolData?.close).toFixed(2)}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">% Change:</span> <span className={`font-semibold `}>{symbolData?.percent_change}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default StockAnalystRatingCards;
