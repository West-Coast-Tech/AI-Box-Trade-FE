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
const RecoverIdCover = lazy(() => import('../pages/Authentication/RecoverIdCover'));
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
        path: '/page/faq',
        element: <Faq />,
        protected: false,
    },
    {
        path: '/page/contact-us',
        element: <ContactUsBoxed />,

        protected: false,
    },
    {
        path: '/page/terms-conditions',
        element: <TermsAndConditions />,
        protected: false,
    },

    {
        path: '/page/privacy-policy',
        element: <PrivacyPolicy />,
        protected: false,
    },
    {
        path: '/page/refund-policy',
        element: <RefundPolicy />,
        protected: false,
    },
    {
        path: '/page/risk-warning',
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

    // Calendar pages
    {
        path: '/pages/dividend-calendar',
        element: <DividendCalendar />,
        protected: true,
    },
    {
        path: '/pages/economic-calendar',
        element: <EcoEventCalendar />,
        protected: true,
    },
    {
        path: '/pages/earnings-calendar',
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
        path: '/pages/gainers',
        element: <Gainers />,
        protected: true,
    },
    {
        path: '/pages/losers',
        element: <Losers />,
        protected: true,
    },

    {
        path: '/pages/screeners/high_volume',
        element: <HighVolumeTable />,
        protected: false,
    },
    {
        path: '/pages/screeners/hot_stocks',
        element: <HotStocksTable />,
        protected: false,
    },
    {
        path: '/pages/screeners/top_under_10',
        element: <TopUnderTenTable />,
        protected: false,
    },
    {
        path: '/pages/screeners/dividend',
        element: <DividendTable />,
        protected: false,
    },
    {
        path: '/pages/screeners/top_fundamentals',
        element: <TopFundamentalsTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/top_tech',
        element: <TopTechTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/j_pattern',
        element: <JPatternTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/golden_cross',
        element: <GoldenCrossTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/death_cross',
        element: <DeathCrossTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/consolidation',
        element: <ConsolidationTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/rsi_overbought',
        element: <RsiOverboughtTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/rsi_oversold',
        element: <RsiOversoldTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/52wk_toppicks',
        element: <FiftyTwoWeekTopPicksTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/penny_gap',
        element: <PennyGapTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/defensive_stock',
        element: <DefensiveStockTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/income_growth',
        element: <IncomeGrowthTable />,
        protected: true,
    },
    {
        path: '/pages/screeners/buy_longterm',
        element: <BuyLongtermTable />,
        protected: true,
    },
    //Portfolio Pages
    {
        path: '/pages/portfolio/watch-list',
        element: <WatchListPage />,
        protected: true,
    },
    {
        path: '/pages/portfolio/user-holdings',
        element: <UserHoldingsPage />,
        protected: true,
    },
    {
        path: '/pages/portfolio/seven-box-rule',
        element: <SevenBoxRulePage />,
        protected: false,
    },
    {
        path: '/pages/portfolio/seven-box-rule/stocks',
        element: <RuleStockPage />,
        protected: true,
    },
    {
        path: '/pages/portfolio/design',
        element: <DesignPortfolioPage />,
        protected: true,
    },
    //Sector wise stocks
    {
        path: '/pages/portfolio/sector-stocks',
        element: <TopSectorPicks />,
        protected: false,
    },
    {
        path: '/pages/portfolio/analyst-ratings',
        element: <StockAnalystRating />,
        protected: true,
    },
    //Stocks Page
    {
        path: '/pages/stocks/:symbol',
        element: <StockPage />,
        protected: false,
    },
    //Advance Search Stocks
    {
        path: '/pages/stocks/advance-search',
        element: <StocksFilterPage />,
        protected: true,
    },
    //News Page
    {
        path: '/pages/news',
        element: <NewsPage />,
        protected: false,
    },
    {
        path: '/pages/newslist',
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
        path: '/pages/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/pages/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/pages/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },
    {
        path: '/pages/maintenence',
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
        path: '/auth/cover-password-reset',
        element: <RecoverIdCover />,
    },

    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
