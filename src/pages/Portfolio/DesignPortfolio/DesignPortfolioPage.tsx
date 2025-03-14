// DesignPortfolioPage.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { UserParameterBar } from './UserParameterBar';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import DesignPortfolioTable from './DesignPortfolioTable';
import { PortfolioStatsDonutChart } from './PortfolioStatsDonutChart';
import { deleteDesignPortfolio, saveDesignPortfolio, updateDesignPortfolio } from './designPortfolioUtils';
import ModalReusable from '../../../components/ModalReusable';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { PortfoliosList } from './PortfoliosList';

// Define types for improved type safety
export interface UserParameters {
    mode: string; // Risk factor
    investment: number; // Investment capital
    type: string; // Investment duration
}

interface StockData {
    allocation: number;
    stockName: string;
    ticker: string;
    // Add other properties as needed
}

const DesignPortfolioPage: React.FC = () => {
    // Main state variables
    const [userParameters, setUserParameters] = useState<UserParameters>();
    const [data, setData] = useState<StockData[] | null>(null);
    const [stockMarketCaps, setStockMarketCaps] = useState<{ labels: string[]; series: number[] } | undefined>(undefined);
    const [stockSectorDistribution, setStockSectorDistribution] = useState<{ labels: string[]; series: number[] } | undefined>(undefined);
    const [isSaveModalOpen, setSaveModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedPortfolio, setSelectedPortfolio] = useState<{ _id: string; portfolioName: string }>({ _id: '', portfolioName: '' });
    // Derived values using useMemo
    const stocksAllocation = useMemo(() => {
        if (!data) return undefined;
        return {
            series: data.map((stock) => Number(stock.allocation.toFixed(2))),
            labels: data.map((stock) => stock.stockName),
        };
    }, [data]);

    const stockSymbols = useMemo(() => {
        return data ? data.map((stock) => stock.ticker) : [];
    }, [data]);

    // Data fetch function wrapped in useCallback
    const fetchData = useCallback(async (userParams: UserParameters) => {
        if (!userParams) return;
        setSelectedPortfolio({ _id: '', portfolioName: '' });
        try {
            const response = await PortfolioApi.getStocksForUserParameters(userParams);
            if (response.data.stocks.length > 0) {
                setData(response.data.stocks);
            } else {
                setData(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData(null);
        }
    }, []);

    // Fetch additional chart data based on derived stockSymbols.
    useEffect(() => {
        if (!stockSymbols || stockSymbols.length === 0) return;

        const fetchMarketCapDivision = async () => {
            try {
                const response = await PortfolioApi.getStocksMarketCapDivision(stockSymbols);
                const seriesData = response.data.map((stock: any) => stock.value);
                const labelsData = response.data.map((stock: any) => stock.label);
                setStockMarketCaps({ labels: labelsData, series: seriesData });
            } catch (error) {
                setStockMarketCaps(undefined);
                console.error('Error fetching market cap division:', error);
            }
        };

        const fetchSectorDistribution = async () => {
            try {
                const response = await PortfolioApi.getStocksSectorDistribution(stockSymbols);
                const seriesData = response.data.map((stock: any) => stock.count);
                const labelsData = response.data.map((stock: any) => stock.sector);
                setStockSectorDistribution({ labels: labelsData, series: seriesData });
            } catch (error) {
                setStockSectorDistribution(undefined);
                console.error('Error fetching sector distribution:', error);
            }
        };

        fetchMarketCapDivision();
        fetchSectorDistribution();
    }, [stockSymbols]);

    // Save portfolio handler wrapped in useCallback
    const handleSavePortfolio = useCallback(async () => {
        if (!data || !userParameters || !selectedPortfolio.portfolioName) return;
        try {
            // saveDesignPortfolio is assumed to return a portfolio ID string on success or a falsy value on failure
            const result = await saveDesignPortfolio(userParameters, data, selectedPortfolio.portfolioName);
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            if (result && typeof result === 'string') {
                setSelectedPortfolio({ ...selectedPortfolio, _id: result });
                setSaveModalOpen(false);
                setRefreshTrigger((prev) => prev + 1);

                toast.fire({
                    icon: 'success',
                    title: 'Portfolio saved successfully',
                    padding: '10px 20px',
                });
            } else {
                toast.fire({
                    icon: 'error',
                    title: 'Failed to save portfolio',
                    padding: '10px 20px',
                });
            }
        } catch (error) {
            console.error('Error in handleSavePortfolio:', error);
        }
    }, [data, userParameters, selectedPortfolio.portfolioName]);

    // Edit portfolio handler wrapped in useCallback; triggers refresh of the portfolio list
    const handleEditPortfolio = useCallback(async () => {
        if (!selectedPortfolio.portfolioName || !selectedPortfolio._id) return;
        try {
            const result = await updateDesignPortfolio(selectedPortfolio._id, selectedPortfolio.portfolioName);
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            if (result) {
                setRefreshTrigger((prev) => prev + 1);
                setEditModalOpen(false);
                toast.fire({
                    icon: 'success',
                    title: 'Portfolio updated successfully',
                    padding: '10px 20px',
                });
            } else {
                toast.fire({
                    icon: 'error',
                    title: 'Failed to update portfolio',
                    padding: '10px 20px',
                });
            }
        } catch (error) {
            console.error('Error in handleEditPortfolio:', error);
        }
    }, [selectedPortfolio]);

    // Edit portfolio handler wrapped in useCallback; triggers refresh of the portfolio list
    const handleDeletePortfolio = useCallback(async () => {
        if (!selectedPortfolio.portfolioName || !selectedPortfolio._id) return;

        try {
            const result = await deleteDesignPortfolio(selectedPortfolio._id);
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            if (result) {
                setRefreshTrigger((prev) => prev + 1);
                setEditModalOpen(false);
                setSelectedPortfolio({ _id: '', portfolioName: '' });
                toast.fire({
                    icon: 'success',
                    title: 'Portfolio deleted successfully',
                    padding: '10px 20px',
                });
            } else {
                toast.fire({
                    icon: 'error',
                    title: 'Failed to delete portfolio',
                    padding: '10px 20px',
                });
            }
        } catch (error) {
            console.error('Error in handleEditPortfolio:', error);
        }
    }, [selectedPortfolio]);

    // Memoize the expensive chart component to avoid unnecessary re-renders.
    // Note: We wrap the component once via React.memo in the child file and here we memoize its usage.
    const MemoizedDonut = useMemo(() => React.memo(PortfolioStatsDonutChart), []);

    return (
        <div>
            <div className="panel w-full flex justify-between items-center">
                <h1 className="text-2xl font-bold">Design Portfolio</h1>
                <PortfoliosList
                    setData={setData}
                    refreshTrigger={refreshTrigger}
                    setUserParameters={setUserParameters}
                    setSelectedPortfolio={setSelectedPortfolio}
                    selectedPortfolio={selectedPortfolio}
                />
                <div>
                    <button
                        className={`${!userParameters || !data || data.length < 1 ? 'cursor-not-allowed' : 'cursor-pointer'} px-2`}
                        onClick={() => setSaveModalOpen(true)}
                        disabled={!userParameters || !data || data.length < 1}
                    >
                        <FontAwesomeIcon icon={faSave} size="xl" />
                    </button>
                    <button className={`${!selectedPortfolio._id ? 'cursor-not-allowed' : 'cursor-pointer'} px-2`} onClick={() => setEditModalOpen(true)} disabled={!selectedPortfolio._id}>
                        <FontAwesomeIcon icon={faEdit} size="xl" />
                    </button>
                    <button
                        className={`${!selectedPortfolio._id ? 'cursor-not-allowed' : 'cursor-pointer'} text-red-500 px-2`}
                        onClick={() => handleDeletePortfolio()}
                        disabled={!selectedPortfolio._id}
                    >
                        <FontAwesomeIcon icon={faTrash} size="xl" />
                    </button>
                </div>

                {/* Save Portfolio Modal */}
                <ModalReusable title="Save Portfolio" isOpen={isSaveModalOpen} onClose={() => setSaveModalOpen(false)} onSave={handleSavePortfolio}>
                    <input
                        type="text"
                        title="Portfolio Name"
                        placeholder="Type here"
                        className="form-input w-full"
                        value={selectedPortfolio.portfolioName}
                        onChange={(e) => setSelectedPortfolio({ ...selectedPortfolio, portfolioName: e.target.value })}
                    />
                </ModalReusable>
                {/* Edit Portfolio Modal */}
                <ModalReusable title="Edit Portfolio" isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleEditPortfolio}>
                    <input
                        type="text"
                        title="Portfolio Name"
                        placeholder="Type here"
                        className="form-input w-full"
                        value={selectedPortfolio.portfolioName}
                        onChange={(e) => setSelectedPortfolio({ ...selectedPortfolio, portfolioName: e.target.value })}
                    />
                </ModalReusable>
            </div>

            <div className="my-5 grid lg:grid-cols-11 xl:grid-cols-11 gap-4">
                <div className="col-span-2 panel">
                    <UserParameterBar setUserParameters={setUserParameters} onSubmit={fetchData} userParameters={userParameters} />
                </div>
                <div className="col-span-3">
                    <MemoizedDonut series={stocksAllocation?.series} labels={stocksAllocation?.labels} title="Capital Distribution Percentage" />
                </div>
                <div className="col-span-3">
                    <MemoizedDonut series={stockSectorDistribution?.series} labels={stockSectorDistribution?.labels} title="Sector Distribution" />
                </div>
                <div className="col-span-3">
                    <MemoizedDonut series={stockMarketCaps?.series} labels={stockMarketCaps?.labels} title="Market Cap Division" type="pie" />
                </div>
            </div>

            <div>
                <DesignPortfolioTable data={data} portfolioName={selectedPortfolio.portfolioName} />
            </div>
        </div>
    );
};

export default DesignPortfolioPage;
