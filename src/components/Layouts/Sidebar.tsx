import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AnimateHeight from 'react-animate-height';
import { AppState, UserData } from '../../redux/types';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuApps from '../Icon/Menu/IconMenuApps';
import IconCaretDown from '../Icon/IconCaretDown';
import IconLock from '../Icon/IconLock';

interface MenuItem {
    title: string;
    to?: string;
    icon?: React.ReactNode;
    subMenu?: MenuItem[];
    plan: 'free' | 'basic' | 'full';
}

const SidebarMenu: React.FC = () => {
    const { t } = useTranslation();
    const currentUser = useSelector((state: AppState) => state.user.currentUser);
    // Re-route link if user does not have access
    const reRouteLink = !currentUser ? '/auth/cover-login' : '/#pricingTable';

    // Define menu items (from your HorizontalMenu)
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

    // Access control helper
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

    // State to track which menu (by title) is currently expanded
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const toggleMenu = (menuTitle: string) => setCurrentMenu((prev) => (prev === menuTitle ? '' : menuTitle));

    return (
        <nav className="sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-lg z-50 transition-all duration-300 bg-white dark:bg-black">
            <div className="h-full">
                <PerfectScrollbar className="h-full relative">
                    <ul className="relative font-semibold space-y-2 p-4">
                        {menuItems.map((item, index) => (
                            <li key={index} className="menu nav-item">
                                {item.to ? (
                                    <NavLink to={hasAccess(item.plan, currentUser) ? item.to : reRouteLink} className="nav-link flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                                        {item.icon}
                                        <span className="ltr:pl-3 rtl:pr-3">{item.title}</span>
                                        {!hasAccess(item.plan, currentUser) && <IconLock className="!text-yellow-600 !w-4 ml-auto" fill={true} />}
                                    </NavLink>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => toggleMenu(item.title)} className="nav-link flex items-center w-full p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                                            {item.icon}
                                            <span className="ltr:pl-3 rtl:pr-3">{item.title}</span>
                                            <IconCaretDown className={`ml-auto transition-transform duration-300 ${currentMenu === item.title ? 'rotate-180' : ''}`} />
                                        </button>
                                        {item.subMenu && (
                                            <AnimateHeight duration={300} height={currentMenu === item.title ? 'auto' : 0}>
                                                <ul className="sub-menu pl-8 mt-1 space-y-1">
                                                    {item.subMenu.map((subItem, subIndex) => (
                                                        <li key={subIndex}>
                                                            <NavLink
                                                                to={hasAccess(subItem.plan, currentUser) ? subItem.to! : reRouteLink}
                                                                className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                                                            >
                                                                {subItem.title}
                                                                {!hasAccess(subItem.plan, currentUser) && <IconLock className="!text-yellow-600 !w-4 inline-block ml-2" fill={true} />}
                                                            </NavLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AnimateHeight>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </PerfectScrollbar>
            </div>
        </nav>
    );
};

export default SidebarMenu;
