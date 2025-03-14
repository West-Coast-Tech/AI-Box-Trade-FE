import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../redux/features/themeConfigSlice';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { useEffect } from 'react';
import NewsList from './Screeners/NewsList';
import GainersTable from './Screeners/Gainers';
import LosersTable from './Screeners/Losers';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import ScreenerList from './Screeners/ScreenerList';
import IncrementalChart from '../components/AmChart/IncrementalChart';
import { AppState } from '../redux/types';
import TradingViewWidget from '../components/TradingView/TradingViewWidget';
import SymbolBar from '../components/SymbolBar';
const selectCurrentSymbol = (state: AppState) => state.symbols?.selectedSymbol;
const Finance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentSymbol = useSelector(selectCurrentSymbol);

    useEffect(() => {
        dispatch(setPageTitle('Finance'));
    });

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Finance</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className=" grid grid-cols-1 md:grid-cols-6 gap-6">
                    <PerfectScrollbar className="overflow-auto h-[36rem] hidden lg:grid">
                        <ScreenerList />
                    </PerfectScrollbar>
                    <div className="panel cols-span-1 md:col-span-5">
                        <div className=" md:flex items-center flex-wrap p-4 border-b border-[#ebedf2] dark:border-[#191e3a]">
                            <div className="flex-1 flex items-start ltr:pr-4 rtl:pl-4">
                                <div className="flex flex-col md:flex-row w-full justify-between ">
                                    <div className="flex items-center">
                                        <div
                                            className="ltr:mr-1 rtl:ml-1 flex items-center underline-animation text-lg font-semibold  cursor-pointer  hover:scale-[1.02] transition-all duration-700"
                                            onClick={() => {
                                                navigate(`/pages/stocks/${currentSymbol?.symbol}`);
                                            }}
                                        >
                                            <img width={40} src={currentSymbol?.iconUrl} className="p-1 mr-2 rounded-3xl" />
                                            {currentSymbol?.name} ({currentSymbol?.symbol})
                                        </div>
                                        {/* <IconArrowLeft className={`mb-px ml-3 ${true ? '-rotate-90 text-success' : 'rotate-90 text-danger'}`} /> */}
                                        {/* <div className={`font-medium text-sm mb-px ${true ? ' text-success' : ' text-danger'}`}>+3.39%</div> */}
                                        <SymbolBar />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[85%]">
                            <TradingViewWidget /> {/* <IncrementalChart /> */}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GainersTable />
                    <LosersTable />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mt-10">
                    <NewsList />
                </div>
            </div>
        </div>
    );
};

export default Finance;
