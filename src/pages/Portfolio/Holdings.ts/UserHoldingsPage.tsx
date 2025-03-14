import React, { useEffect, useState } from 'react';
import { IHoldingsData, IWatchLists } from '../../../redux/types';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
import HoldingsTable from './HoldingsTable';
const UserHoldingsPage = () => {
    const [manualHoldings, setManualHoldings] = useState<IHoldingsData[]>([]);
    const [portfolioHoldings, setPortfolioHoldings] = useState<IHoldingsData[]>([]);

    useEffect(() => {
        const fetchHoldings = async () => {
            try {
                const userId = localStorage.getItem('id') || '';
                const token = localStorage.getItem('token') || '';
                if (!userId || !token) {
                    console.warn('User ID or token is missing from localStorage');
                    return;
                }

                const response = await PortfolioApi.getStockHoldings(token, userId);
                const holdingsData: IHoldingsData[] = response.data;
                console.log('Holdings', holdingsData);
                //Save manual holdings to state
                setManualHoldings(holdingsData.filter((holding: IHoldingsData) => !holding.portfolioName || holding.portfolioName == ''));
                //Save portfolio holdings to state
                setPortfolioHoldings(holdingsData.filter((holding: IHoldingsData) => holding.portfolioName && holding.portfolioName != ''));
            } catch (error) {
                console.error('Error fetching holdings:', error);
            }
        };
        fetchHoldings();
    }, []);

    return (
        <div>
            <div className="panel w-full">
                <div>
                    <h1 className="font-bold text-2xl">User Manual Holdings</h1>
                </div>
                <div>
                    <HoldingsTable holdings={manualHoldings} setHoldings={setManualHoldings} showPortfolioName={false} showAddHoldingSearchBar={true} />
                </div>
            </div>
            <div className="panel w-full mt-10">
                <div>
                    <h1 className="font-bold text-2xl">Portfolio Holdings</h1>
                </div>
                <div>
                    <HoldingsTable holdings={portfolioHoldings} setHoldings={setPortfolioHoldings} showPortfolioName={true} showAddHoldingSearchBar={false} />
                </div>
            </div>
        </div>
    );
};

export default UserHoldingsPage;
