import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import IconChartSquare from '../../components/Icon/IconChartSquare';
import IconCaretsDown from '../../components/Icon/IconCaretsDown';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
import IconLock from '../../components/Icon/IconLock';

const ScreenerList = () => {
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the last segment of the path to determine the active tab
    const pathSegments = location.pathname.split('/');
    const selectedTab = pathSegments[pathSegments.length - 1];
    const currentUser = useSelector((state: AppState) => state.user.currentUser);
    // Define your screeners here
    const screeners = [
        { name: 'high_volume', label: 'High Volume', plan: 'free' },
        { name: 'hot_stocks', label: 'Hot Stocks', plan: 'free' },
        { name: 'top_under_10', label: 'Top Under $10', plan: 'free' },
        { name: 'dividend', label: 'Dividend', plan: 'free' },
        { name: 'top_fundamentals', label: 'Top Fundamentals', plan: 'basic' },
        { name: 'top_tech', label: 'Top Tech Stocks', plan: 'basic' },
        { name: 'j_pattern', label: 'J-Pattern Stocks', plan: 'basic' },
        { name: 'golden_cross', label: 'Golden Cross Stocks', plan: 'basic' },
        { name: 'death_cross', label: 'Death Cross Stocks', plan: 'basic' },
        { name: 'consolidation', label: 'Consolidating Stocks', plan: 'basic' },
        { name: 'rsi_overbought', label: 'RSI Overbought Stocks', plan: 'basic' },
        { name: 'rsi_oversold', label: 'RSI Oversold Stocks', plan: 'basic' },
        { name: '52wk_toppicks', label: '52 Week Top Picks', plan: 'basic' },
        { name: 'penny_gap', label: 'Penny Gap Stocks', plan: 'basic' },
        { name: 'defensive_stock', label: 'Defensive Stocks', plan: 'basic' },
        { name: 'income_growth', label: 'Income Growth Stocks', plan: 'basic' },
        { name: 'buy_longterm', label: 'Buy Long-Term Stocks', plan: 'basic' },
    ];
    const hasAccess = (requiredPlan: string): boolean => {
        if (requiredPlan === 'free') return true;
        if (!currentUser) return false;

        if (requiredPlan === 'basic') {
            return currentUser.subscriptionStatus === 'active' || currentUser.subscriptionStatus === 'trial';
        }

        if (requiredPlan === 'full') {
            return currentUser.subscriptionPlan === 'full' && (currentUser.subscriptionStatus === 'active' || currentUser.subscriptionStatus === 'trial');
        }

        return false;
    };
    return (
        <div className="panel pb-10 md:flex flex-col hidden">
            <div className="flex items-center mb-5">
                <IconChartSquare className="mr-3" />
                <h3
                    className="text-lg font-semibold cursor-pointer"
                    onClick={() => {
                        navigate('/pages/screeners/high_volume');
                    }}
                >
                    {' '}
                    Screeners
                </h3>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-5"></div>
            <div className="space-y-1.5">
                {screeners.map((screener) => (
                    <button
                        key={screener.name}
                        type="button"
                        className={`w-full flex items-center p-2 pl-0 rounded-md font-medium h-10 transition-colors ${
                            selectedTab === screener.name ? 'bg-gray-100 dark:bg-gray-800 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => {
                            navigate(`/pages/screeners/${screener.name}`);
                        }}
                    >
                        <IconCaretsDown className="-rotate-90 mr-3 shrink-0 text-[#a38021]" />
                        <div className="flex justify-between w-full">
                            <span>{screener.label}</span>
                            <div>{!hasAccess(screener.plan) && <IconLock className="!text-yellow-600 !w-4" fill={true} />}</div>
                        </div>
                    </button>
                ))}
            </div>
            {isShowTaskMenu && <div className="overlay bg-black/60 z-50 w-full h-full absolute top-0 left-0" onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>}
        </div>
    );
};

export default ScreenerList;
