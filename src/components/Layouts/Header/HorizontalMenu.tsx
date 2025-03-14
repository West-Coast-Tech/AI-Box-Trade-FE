import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IconMenuApps from '../../Icon/Menu/IconMenuApps';
import IconCaretDown from '../../Icon/IconCaretDown';
import IconMenuDashboard from '../../Icon/Menu/IconMenuDashboard';
import IconLock from '../../Icon/IconLock';
import { useSelector } from 'react-redux';
import { AppState, UserData } from '../../../redux/types';
import { HashLink } from 'react-router-hash-link';

interface MenuItem {
    title: string;
    to?: string;
    icon?: React.ReactNode;
    subMenu?: MenuItem[];
    plan: 'free' | 'basic' | 'full';
}

export const HorizontalMenu: React.FC = () => {
    const { t } = useTranslation();
    const currentUser = useSelector((state: AppState) => state.user.currentUser);
    const reRouteLink = !currentUser ? '/auth/cover-login' : '/#pricingTable';
    // Define menu items using an array
    const menuItems: MenuItem[] = [
        {
            title: t('dashboard'),
            to: '/finance',
            icon: <IconMenuDashboard className="shrink-0" />,
            plan: 'free',
        },
        {
            title: t('Screeners'),
            icon: <IconMenuApps className="shrink-0" />,
            plan: 'free',
            subMenu: [
                { title: t('High Volume'), to: '/pages/screeners/high_volume', plan: 'free' },
                { title: t('Hot Stocks'), to: '/pages/screeners/hot_stocks', plan: 'free' },
                { title: t('Top Under $10'), to: '/pages/screeners/top_under_10', plan: 'free' },
                { title: t('Dividend'), to: '/pages/screeners/dividend', plan: 'free' },
                { title: t('Top Fundamentals'), to: '/pages/screeners/top_fundamentals', plan: 'basic' },
                { title: t('Top Tech'), to: '/pages/screeners/top_tech', plan: 'basic' },
                { title: t('J-Pattern'), to: '/pages/screeners/j_pattern', plan: 'basic' },
                { title: t('Golden Cross'), to: '/pages/screeners/golden_cross', plan: 'basic' },
                { title: t('Death Cross'), to: '/pages/screeners/death_cross', plan: 'basic' },
                { title: t('Consolidation'), to: '/pages/screeners/consolidation', plan: 'basic' },
                { title: t('RSI Overbought'), to: '/pages/screeners/rsi_overbought', plan: 'basic' },
                { title: t('RSI Oversold'), to: '/pages/screeners/rsi_oversold', plan: 'basic' },
                { title: t('52 Week Top Picks'), to: '/pages/screeners/52wk_toppicks', plan: 'basic' },
                { title: t('Penny Gap'), to: '/pages/screeners/penny_gap', plan: 'basic' },
                { title: t('Defensive Stocks'), to: '/pages/screeners/defensive_stock', plan: 'basic' },
                { title: t('Income Growth'), to: '/pages/screeners/income_growth', plan: 'basic' },
                { title: t('Buy Long-Term'), to: '/pages/screeners/buy_longterm', plan: 'basic' },
            ],
        },
        {
            title: t('Portfiolio Builder'),
            icon: <IconMenuApps className="shrink-0" />,
            plan: 'free',
            subMenu: [
                { title: t('7 Box Rule'), to: '/pages/portfolio/seven-box-rule', plan: 'free' },
                { title: t('Watch List'), to: '/pages/portfolio/watch-list', plan: 'free' },
                { title: t('User Holdings'), to: '/pages/portfolio/user-holdings', plan: 'basic' },
                { title: t('Design Portfolio'), to: '/pages/portfolio/design', plan: 'full' },
            ],
        },
        {
            title: t('Sector Wise PB'),
            icon: <IconMenuApps className="shrink-0" />,
            plan: 'basic',
            subMenu: [
                { title: t('Top Sector Picks'), to: '/pages/portfolio/sector-stocks', plan: 'free' },
                { title: t('Analyst Ratings'), to: '/pages/portfolio/analyst-ratings', plan: 'full' },
            ],
        },
        {
            title: t('News'),
            icon: <IconMenuApps className="shrink-0" />,
            plan: 'free',
            subMenu: [{ title: t('Latest News'), to: '/pages/news', plan: 'free' }],
        },
        {
            title: t('Calendars'),
            icon: <IconMenuApps className="shrink-0" />,
            plan: 'free',
            subMenu: [
                { title: t('Dividend Calendar'), to: '/pages/dividend-calendar', plan: 'free' },
                { title: t('Economic Calendar'), to: '/pages/economic-calendar', plan: 'free' },
                { title: t('Earnings Calendar'), to: '/pages/earnings-calendar', plan: 'free' },
            ],
        },
        {
            title: t('Stocks Filter'),
            to: '/pages/stocks/advance-search',
            icon: <IconMenuApps className="shrink-0" />,
            plan: 'basic',
        },
        {
            title: t('Education'),
            to: '/pages/education',
            plan: 'basic',
            icon: <IconMenuApps className="shrink-0" />,
        },
    ];

    const hasAccess = (requiredPlan: 'free' | 'basic' | 'full', currentUser?: UserData | null): boolean => {
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
        <div>
            {/* Horizontal Menu */}
            <ul className="horizontal-menu hidden py-1.5 font-semibold  sm:flex justify-between  bg-white border-t border-[#ebedf2] dark:border-[#191e3a] dark:bg-black text-black dark:text-white-dark">
                {menuItems.map((item, index) =>
                    item.to ? (
                        <HashLink key={index} to={hasAccess(item.plan, currentUser) ? item.to : reRouteLink} className="px-1 text-nowrap">
                            <li className="menu nav-item relative">
                                <button type="button" className="nav-link">
                                    <div className="flex items-center">
                                        {item.icon}
                                        <div className="px-1">{item.title}</div>
                                    </div>
                                    <div>{!hasAccess(item.plan, currentUser) && <IconLock className="!text-yellow-600 !w-4" fill={true} />}</div>
                                </button>
                            </li>
                        </HashLink>
                    ) : (
                        <li key={index} className="menu nav-item relative text-nowrap">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    {item.icon}
                                    <span className="px-1">{item.title}</span>
                                </div>
                                <div className="right_arrow">
                                    <IconCaretDown />
                                </div>
                            </button>
                            {item.subMenu && (
                                <ul className="sub-menu">
                                    {item.subMenu.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <HashLink smooth to={hasAccess(subItem.plan, currentUser) ? subItem.to! : reRouteLink!}>
                                                {subItem.title} <div>{!hasAccess(subItem.plan, currentUser) && <IconLock className="!text-yellow-600 !w-4" fill={true} />}</div>
                                            </HashLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};

export default HorizontalMenu;
