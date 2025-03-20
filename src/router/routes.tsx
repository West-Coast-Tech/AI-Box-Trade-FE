import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Finance = lazy(() => import('../pages/Finance'));
const Crypto = lazy(() => import('../pages/Crypto'));

const Profile = lazy(() => import('../pages/Users/Profile'));
const ContactUsBoxed = lazy(() => import('../pages/Pages/ContactUsBoxed'));
const Faq = lazy(() => import('../pages/Pages/Faq'));

const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const Maintenence = lazy(() => import('../pages/Pages/Maintenence'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));
const ForgotPassword = lazy(() => import('../pages/Authentication/ForgotPassword'));
const ChangePassword = lazy(() => import('../pages/Authentication/ChangePassword'));
const Error = lazy(() => import('../components/Error'));
const Gainers = lazy(() => import('../pages/Screeners/Gainers'));
const Losers = lazy(() => import('../pages/Screeners/Losers'));
const NewsPage = lazy(() => import('../pages/Screeners/NewsPage'));
const NewsList = lazy(() => import('../pages/Screeners/NewsList'));
const DividendCalendar = lazy(() => import('../pages/Screeners/DividendCalender'));
const EcoEventCalendar = lazy(() => import('../pages/Screeners/EcoEventsCalendar'));
const EarningsCalendar = lazy(() => import('../pages/Screeners/EarningsCalendar'));
const StockPage = lazy(() => import('../pages/StockPage/StockPage'));
const WatchListPage = lazy(() => import('../pages/Portfolio/WatchList/WatchListPage'));
const UserHoldingsPage = lazy(() => import('../pages/Portfolio/Holdings.ts/UserHoldingsPage'));
const SevenBoxRulePage = lazy(() => import('../pages/Portfolio/SeverBoxRule/SevenBoxRulePage'));
const TopSectorPicks = lazy(() => import('../pages/SectorWisePB/TopSectorPicks/TopSectorPicks'));
const StockAnalystRating = lazy(() => import('../pages/SectorWisePB/AnalystRatings/StockAnalystRating'));
const StocksFilterPage = lazy(() => import('../pages/AdvancedSearch/StocksFilterPage'));
const Education = lazy(() => import('../pages/Education/Education'));
const DesignPortfolioPage = lazy(() => import('../pages/Portfolio/DesignPortfolio/DesignPortfolioPage'));

//Homepage
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
//Stripe
const TrialSuccess = lazy(() => import('../pages/Stripe/TrialSuccess'));
const SubscriptionSuccess = lazy(() => import('../pages/Stripe/SubscriptionSuccess'));
const AccountSetting = lazy(() => import('../pages/Users/AccountSetting'));
import {
    HighVolumeTable,
    HotStocksTable,
    TopUnderTenTable,
    DividendTable,
    TopFundamentalsTable,
    TopTechTable,
    JPatternTable,
    GoldenCrossTable,
    DeathCrossTable,
    ConsolidationTable,
    RsiOverboughtTable,
    RsiOversoldTable,
    FiftyTwoWeekTopPicksTable,
    PennyGapTable,
    DefensiveStockTable,
    IncomeGrowthTable,
    BuyLongtermTable,
} from '../pages/Screeners/Screeners';
import RuleStockPage from '../pages/Portfolio/SeverBoxRule/RuleStockPage';
import TermsAndConditions from '../pages/Pages/TermsAndConditions';
import TrialCancel from '../pages/Stripe/TrialCancel';
import SubscriptionCancel from '../pages/Stripe/SubscriptionCancel';
import PrivacyPolicy from '../pages/Pages/PrivacyPolicy';
import RefundPolicy from '../pages/Pages/RefundPoilicy';
import RiskWarning from '../pages/Pages/RiskWarning';

const routes = [
    //Home Page
    {
        path: '/',
        element: <HomePage />,
        protected: false,
    },
    {
        path: '/dashboard',
        element: <Finance />,
        protected: false,
    },

    //Footer Pages
    {
        path: '/faq',
        element: <Faq />,
        protected: false,
    },
    {
        path: '/contact-us',
        element: <ContactUsBoxed />,

        protected: false,
    },
    {
        path: '/terms-conditions',
        element: <TermsAndConditions />,
        protected: false,
    },

    {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
        protected: false,
    },
    {
        path: '/refund-policy',
        element: <RefundPolicy />,
        protected: false,
    },
    {
        path: '/risk-warning',
        element: <RiskWarning />,
        protected: false,
    },
    //dashboard
    {
        path: '/dashboard',
        element: <Index />,
        protected: false,
    },
    {
        path: '/users/profile',
        element: <Profile />,
        protected: true,
    },
    {
        path: '/users/settings',
        element: <AccountSetting />,
        protected: true,
    },
    // Calendar pages
    {
        path: '/dividend-calendar',
        element: <DividendCalendar />,
        protected: true,
    },
    {
        path: '/economic-calendar',
        element: <EcoEventCalendar />,
        protected: true,
    },
    {
        path: '/earnings-calendar',
        element: <EarningsCalendar />,
        protected: true,
    },

    // Stripe Success/Fail Pages
    {
        path: '/trial-success',
        element: <TrialSuccess />,
        protected: true,
    },
    {
        path: '/subscription-success',
        element: <SubscriptionSuccess />,
        protected: true,
    },
    {
        path: '/trial-cancel',
        element: <TrialCancel />,
        protected: true,
    },
    {
        path: '/subscription-cancel',
        element: <SubscriptionCancel />,
        protected: true,
    },
    //Sceeners Pages
    {
        path: '/gainers',
        element: <Gainers />,
        protected: true,
    },
    {
        path: '/losers',
        element: <Losers />,
        protected: true,
    },

    {
        path: '/screeners/high_volume',
        element: <HighVolumeTable />,
        protected: false,
    },
    {
        path: '/screeners/hot_stocks',
        element: <HotStocksTable />,
        protected: false,
    },
    {
        path: '/screeners/top_under_10',
        element: <TopUnderTenTable />,
        protected: false,
    },
    {
        path: '/screeners/dividend',
        element: <DividendTable />,
        protected: false,
    },
    {
        path: '/screeners/top_fundamentals',
        element: <TopFundamentalsTable />,
        protected: true,
    },
    {
        path: '/screeners/top_tech',
        element: <TopTechTable />,
        protected: true,
    },
    {
        path: '/screeners/j_pattern',
        element: <JPatternTable />,
        protected: true,
    },
    {
        path: '/screeners/golden_cross',
        element: <GoldenCrossTable />,
        protected: true,
    },
    {
        path: '/screeners/death_cross',
        element: <DeathCrossTable />,
        protected: true,
    },
    {
        path: '/screeners/consolidation',
        element: <ConsolidationTable />,
        protected: true,
    },
    {
        path: '/screeners/rsi_overbought',
        element: <RsiOverboughtTable />,
        protected: true,
    },
    {
        path: '/screeners/rsi_oversold',
        element: <RsiOversoldTable />,
        protected: true,
    },
    {
        path: '/screeners/52wk_toppicks',
        element: <FiftyTwoWeekTopPicksTable />,
        protected: true,
    },
    {
        path: '/screeners/penny_gap',
        element: <PennyGapTable />,
        protected: true,
    },
    {
        path: '/screeners/defensive_stock',
        element: <DefensiveStockTable />,
        protected: true,
    },
    {
        path: '/screeners/income_growth',
        element: <IncomeGrowthTable />,
        protected: true,
    },
    {
        path: '/screeners/buy_longterm',
        element: <BuyLongtermTable />,
        protected: true,
    },
    //Portfolio Pages
    {
        path: '/portfolio/watch-list',
        element: <WatchListPage />,
        protected: true,
    },
    {
        path: '/portfolio/user-holdings',
        element: <UserHoldingsPage />,
        protected: true,
    },
    {
        path: '/portfolio/seven-box-rule',
        element: <SevenBoxRulePage />,
        protected: false,
    },
    {
        path: '/portfolio/seven-box-rule/stocks',
        element: <RuleStockPage />,
        protected: true,
    },
    {
        path: '/portfolio/design',
        element: <DesignPortfolioPage />,
        protected: true,
    },
    //Sector wise stocks
    {
        path: '/portfolio/sector-stocks',
        element: <TopSectorPicks />,
        protected: false,
    },
    {
        path: '/portfolio/analyst-ratings',
        element: <StockAnalystRating />,
        protected: true,
    },
    //Stocks Page
    {
        path: '/stocks/:symbol',
        element: <StockPage />,
        protected: false,
    },
    //Advance Search Stocks
    {
        path: '/stocks/advance-search',
        element: <StocksFilterPage />,
        protected: true,
    },
    //News Page
    {
        path: '/news',
        element: <NewsPage />,
        protected: false,
    },
    {
        path: '/newslist',
        element: <NewsList />,
    },

    // finance page
    {
        path: '/finance',
        element: <Finance />,
        protected: false,
    },
    {
        path: '/education',
        element: <Education />,
        protected: true,
    },
    // crypto page
    {
        path: '/crypto',
        element: <Crypto />,
        protected: true,
    },

    {
        path: '/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },
    {
        path: '/maintenence',
        element: <Maintenence />,
        layout: 'blank',
    },
    //Authentication

    {
        path: '/auth/cover-login',
        element: <LoginCover />,
        protected: false,
    },
    {
        path: '/auth/cover-register',
        element: <RegisterCover />,
        protected: false,
    },

    {
        path: '/auth/cover-forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/auth/cover-change-password',
        element: <ChangePassword />,
    },

    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
