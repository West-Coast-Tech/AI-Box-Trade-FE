import React from 'react';
import { ISevenBoxSymbolsData } from '../../../redux/types';
import { useNavigate } from 'react-router-dom';
interface SevenBoxSymbolsProps {
    symbolsData: ISevenBoxSymbolsData[];
}
export const SevenBoxSymbols: React.FC<SevenBoxSymbolsProps> = ({ symbolsData }) => {
    const navigate = useNavigate();
    return (
        <div>
            {symbolsData && symbolsData.length > 0 && (
                <div className="mt-10 mr-10">
                    <h2 className="font-bold text-xl mb-4">Stocks</h2>
                    <div className="flex flex-wrap -mx-2">
                        {symbolsData.map(
                            (symbolData: ISevenBoxSymbolsData, index) =>
                                symbolData && (
                                    <div
                                        key={index}
                                        className="w-full sm:w-full md:w-full lg:w-1/2 px-2 mb-4 flex cursor-pointer hover:scale-105 transition-transform duration-500"
                                        onClick={() => {
                                            navigate(`/pages/stocks/${symbolData?.symbol}`);
                                        }}
                                    >
                                        <div className="border shadow-  shadow-xl bg-gray-300 rounded-lg p-4 w-full text-dark max-w-96">
                                            <div className="flex justify-start items-center">
                                                <img width={40} src={symbolData?.iconUrl} className="p-1 rounded-3xl" />
                                                <h3 className="font-bold text-lg mb-2 pl-1 pt-1.5">{symbolData?.symbol}</h3>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>
                                                    <span className="font-semibold pl-1">Close:</span> {Number(symbolData?.close).toFixed(2)}
                                                </p>
                                                <p className="mb-1">
                                                    <span className="font-semibold">% Change:</span>{' '}
                                                    <span className={`font-semibold ${Number(symbolData.percent_change) > 0 ? 'text-success' : 'text-danger'}`}>
                                                        {Number(symbolData?.percent_change).toFixed(2)}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
