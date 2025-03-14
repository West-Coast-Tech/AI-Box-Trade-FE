import React, { useEffect, useState } from 'react';
import Dropdown2 from '../../../components/Dropdown2';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import { getAllDesignPortfolios, loadDesignPortfolio } from './designPortfolioUtils';
import { UserParameters } from './DesignPortfolioPage';

interface PortfolioListProps {
    setData: (data: any) => void;
    setSelectedPortfolio: (selectedPortfolio: { _id: string; portfolioName: string }) => void;
    selectedPortfolio: { _id: string; portfolioName: string } | null;

    setUserParameters: (userParameters: UserParameters) => void;
    refreshTrigger?: number;
}

export const PortfoliosList: React.FC<PortfolioListProps> = ({ setData, refreshTrigger, setUserParameters, selectedPortfolio, setSelectedPortfolio }) => {
    // Initialize portfolios as an empty array for type safety.
    const [portfolios, setPortfolios] = useState<Array<{ _id: string; portfolioName: string }> | null>([]);
    console.log('rerender');
    // Fetch the list of portfolios; re-run when refreshTrigger changes.
    useEffect(() => {
        const fetchPortfolios = async () => {
            const allPortfolios = await getAllDesignPortfolios();
            setPortfolios(allPortfolios);
            if (allPortfolios && allPortfolios.length > 0 && selectedPortfolio?._id == '') {
                setSelectedPortfolio(allPortfolios[0]);
            }
        };
        fetchPortfolios();
    }, [refreshTrigger]);

    // When a portfolio is selected, update parent state and fetch its data.
    useEffect(() => {
        if (!selectedPortfolio) return;

        // Update the parent's portfolio ID and name.

        const fetchPortfolioData = async () => {
            try {
                const portfolioData = await loadDesignPortfolio(selectedPortfolio._id);
                const seriesData = portfolioData.symbols.map((stock: any) => Number(stock.allocation.toFixed(2)));
                const labelsData = portfolioData.symbols.map((stock: any) => stock.stockName);
                setData(portfolioData.symbols);
                const userParameters: UserParameters = { mode: portfolioData.riskFactor, investment: portfolioData.investmentCapital, type: portfolioData.investmentDuration };
                setUserParameters(userParameters);
                console.log('Response for fetch portfolio data', portfolioData);
            } catch (error) {
                console.error('Failed to get Portfolio Data', error);
            }
        };
        fetchPortfolioData();
    }, [selectedPortfolio, setData, setUserParameters]);

    if (!portfolios || portfolios.length === 0) {
        return <div>No saved Portfolios yet</div>;
    }

    return (
        <div className="dropdown flex flex-row gap-4">
            <Dropdown2
                placement="bottom-start"
                btnClassName="btn btn-outline-info btn-sm dropdown-toggle w-full"
                button={
                    <>
                        {selectedPortfolio?.portfolioName || 'Select Portfolio'}
                        <span>
                            <IconCaretDown className="ltr:ml-1 rtl:mr-1 inline-block" />
                        </span>
                    </>
                }
            >
                <ul className="w-full">
                    {portfolios.map((item) => (
                        <li key={item._id} onClick={() => setSelectedPortfolio(item)}>
                            <button className="button flex justify-center w-full">{item.portfolioName}</button>
                        </li>
                    ))}
                </ul>
            </Dropdown2>
        </div>
    );
};
