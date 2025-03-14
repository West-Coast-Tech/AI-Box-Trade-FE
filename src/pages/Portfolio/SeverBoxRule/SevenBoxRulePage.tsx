import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assuming we'll use axios for the API call
import IconPlus from '../../../components/Icon/IconPlus';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import { Link, useNavigate } from 'react-router-dom';
import IconArrowLeft from '../../../components/Icon/IconArrowLeft';
import NewsList from '../../Screeners/NewsList';
import { ISevenBoxSymbolsData } from '../../../redux/types';
import { SevenBoxSymbols } from './SevenBoxSymbols';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';

const SevenBoxRulePage = () => {
    const navigate = useNavigate();

    // Default recommended rules
    const [defaultSelectedRules, setDefaultSelectedRules] = useState(['freeCashFlow', 'peRatio', 'roic', 'netIncomeGrowth', 'revenueGrowth', 'priceToFreeCashFlow', 'longTermLiabilities']);
    // User-selected rules for custom selection
    const [userSelectedRules, setUserSelectedRules] = useState<string[]>([]);
    const [selectedMarketCap, setSelectedMarketCap] = useState<string>('');

    // Symbols and Data for recommended rules
    const [symbols, setSymbols] = useState<string[]>([]);
    const [symbolsData, setSymbolsData] = useState<ISevenBoxSymbolsData[]>([]);
    const [isLoadingSymbols, setIsLoadingSymbols] = useState<boolean>(false);
    const [symbolsError, setSymbolsError] = useState<string>('');

    // Symbols and Data for custom rules
    const [customRuleSymbols, setCustomRuleSymbols] = useState<string[]>([]);
    const [customRuleSymbolsData, setCustomRuleSymbolsData] = useState<ISevenBoxSymbolsData[]>([]);
    const [isLoadingCustomSymbols, setIsLoadingCustomSymbols] = useState<boolean>(false);
    const [customSymbolsError, setCustomSymbolsError] = useState<string>('');

    // Define all possible rules
    const sevenBoxRules: { [key: string]: string } = {
        peRatio: 'P/E Ratio',
        roic: 'ROIC',
        evrevenue: 'EV Revenue',
        revenueGrowth: 'Revenue Growth',
        netIncomeGrowth: 'Net Income Growth',
        longTermLiabilities: 'Long Term Liabilities',
        freeCashFlow: 'Free Cash Flow',
        freeCashFlowGrowth: 'Free Cash Flow Growth',
        priceToFreeCashFlow: 'Price to Free Cash Flow',
    };

    const handleRuleClick = (rule: string) => {
        if (!userSelectedRules.includes(rule)) {
            setUserSelectedRules([...userSelectedRules, rule]);
        } else {
            setUserSelectedRules(userSelectedRules.filter((selectedRule) => selectedRule !== rule));
        }
    };

    const handleGoClick = async () => {
        try {
            const payload = {
                selectedRules: [...defaultSelectedRules, ...userSelectedRules],
            };
            await axios.post('/api/submit-rules', payload);
            alert('Rules sent successfully!');
        } catch (error) {
            console.error('Error sending rules:', error);
            alert('There was an error sending the rules.');
        }
    };

    useEffect(() => {
        const getSymbolsData = async () => {
            if (!symbols || symbols.length === 0) {
                setSymbolsData([]);
                return;
            }

            try {
                const token = localStorage.getItem('token') || '';
                const response = await PortfolioApi.getSevenBoxSymbolsData(token, symbols);
                setSymbolsData(response.data);
            } catch (error) {
                console.error('Error fetching data for symbols in seven box rule:', error);
            }
        };
        getSymbolsData();
    }, [symbols]);

    useEffect(() => {
        const getCustomRuleSymbolsData = async () => {
            if (!customRuleSymbols || customRuleSymbols.length === 0) {
                setCustomRuleSymbolsData([]);
                return;
            }

            try {
                const token = localStorage.getItem('token') || '';
                const response = await PortfolioApi.getSevenBoxSymbolsData(token, customRuleSymbols);
                setCustomRuleSymbolsData(response.data);
            } catch (error: any) {
                if (error?.response?.status === 404) {
                    navigate('/login');
                }
                console.error('Error fetching data for symbols in custom box rule:', error);
            }
        };
        getCustomRuleSymbolsData();
    }, [customRuleSymbols, navigate]);

    const handleCustomRulesSubmit = async () => {
        setIsLoadingCustomSymbols(true);
        setCustomSymbolsError('');
        setCustomRuleSymbols([]);
        setCustomRuleSymbolsData([]);
        try {
            const token = localStorage.getItem('token') || '';
            const fields = userSelectedRules;
            const marketCapType = selectedMarketCap;
            const response = await PortfolioApi.getCustomBoxRuleSymbols(token, fields, marketCapType);
            setCustomRuleSymbols(response.data);

            if (response.data.length === 0) {
                setCustomSymbolsError('No symbols found matching the criteria.');
            }
        } catch (error) {
            console.error('Error fetching symbols:', error);
            if (customRuleSymbols.length === 0) {
                setCustomSymbolsError('No symbols found matching the criteria.');
            } else {
                setCustomSymbolsError('Error fetching symbols. Please try again later.');
            }
        } finally {
            setIsLoadingCustomSymbols(false);
        }
    };

    const handleRulesSubmit = async () => {
        setIsLoadingSymbols(true);
        setSymbolsError('');
        setSymbols([]);
        setSymbolsData([]);
        try {
            const token = localStorage.getItem('token') || '';
            const fields = defaultSelectedRules;
            const response = await PortfolioApi.getSevenBoxRuleSymbols(token, fields);
            setSymbols(response.data);

            if (response.data.length === 0) {
                setSymbolsError('No symbols found matching the criteria.');
            }
        } catch (error) {
            console.error('Error fetching symbols:', error);
            setSymbolsError('Error fetching symbols. Please try again later.');
        } finally {
            setIsLoadingSymbols(false);
        }
    };

    return (
        <div className="flex gap-6">
            {/* <div className="md:flex hidden w-[20rem]">
                <NewsList />
            </div> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommendations Column */}
                <div className="col-span-1">
                    <h2 className="font-bold text-xl mb-4">7 Pillar Box</h2>
                    <div className="flex flex-wrap">
                        <ul className="flex flex-wrap gap-x-4 gap-y-2 w-full">
                            {defaultSelectedRules.map((rule: any, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer text-md py-3 px-5 rounded-3xl mb-4 text-white w-44 sm:w-full md:w-1/2 lg:w-1/3 max-w-56
                                        ${defaultSelectedRules.includes(rule) ? 'bg-success' : 'bg-gray-700 hover:bg-gray-900'} `}
                                >
                                    <div className="flex flex-row justify-between">
                                        {sevenBoxRules[rule]} {defaultSelectedRules.includes(rule) ? <IconCircleCheck /> : <IconPlus className="text-white" />}{' '}
                                    </div>
                                </li>
                            ))}
                            <button type="button" className="btn w-44 sm:w-full md:w-1/2 lg:w-1/3 max-w-56  h-12 btn-info rounded-full text-md active:scale-95" onClick={handleRulesSubmit}>
                                Go
                                <IconArrowLeft className="size-5 ltr:ml-1.5 rtl:mr-1.5 shrink-0" />
                            </button>
                        </ul>
                    </div>

                    {/* Symbols Data with loading/error handling */}
                    {isLoadingSymbols && <div className="text-blue-500 my-4">Loading symbols...</div>}
                    {symbolsError && <div className="text-red-500 my-4">{symbolsError}</div>}
                    {!isLoadingSymbols && !symbolsError && symbolsData.length > 0 && <SevenBoxSymbols symbolsData={symbolsData} />}
                </div>

                {/* Make Your Own Column */}
                <div className="col-span-1">
                    <h2 className="font-bold text-xl mb-4">Make Your Own</h2>
                    <h3 className="text-lg">
                        Select a <strong>Market Cap </strong>range:
                    </h3>
                    <div className="mt-2">
                        <ul className="flex flex-wrap gap-5 text-white w-full">
                            <li
                                className={`cursor-pointer text-md py-3 px-5 rounded-3xl w-32 ${selectedMarketCap === 'small' ? 'bg-success' : 'bg-gray-500'}`}
                                onClick={() => setSelectedMarketCap('small')}
                            >
                                Small
                            </li>
                            <li
                                className={`cursor-pointer text-md py-3 px-5 rounded-3xl w-32 ${selectedMarketCap === 'mid' ? 'bg-success' : 'bg-gray-500'}`}
                                onClick={() => setSelectedMarketCap('mid')}
                            >
                                Medium
                            </li>
                            <li
                                className={`cursor-pointer text-md py-3 px-5 rounded-3xl w-32 ${selectedMarketCap === 'large' ? 'bg-success' : 'bg-gray-500'}`}
                                onClick={() => setSelectedMarketCap('large')}
                            >
                                Large
                            </li>
                            <li
                                className={`cursor-pointer text-md py-3 px-5 rounded-3xl w-32 ${selectedMarketCap === 'any' ? 'bg-success' : 'bg-gray-500'}`}
                                onClick={() => setSelectedMarketCap('any')}
                            >
                                Any
                            </li>
                        </ul>
                    </div>

                    {selectedMarketCap && (
                        <div className="mt-6">
                            <h3 className="text-lg">Select at least 5 custom rules:</h3>
                            <ul className="flex flex-wrap gap-x-4 gap-y-2 mt-4 w-full">
                                {Object.keys(sevenBoxRules).map((ruleKey) => (
                                    <li
                                        key={ruleKey}
                                        onClick={() => handleRuleClick(ruleKey)}
                                        className={`cursor-pointer text-md py-3 px-5 rounded-3xl mb-4 text-white w-44 sm:w-full md:w-1/2 lg:w-1/3 max-w-56
                                            ${userSelectedRules.includes(ruleKey) ? 'bg-success' : 'bg-gray-700 hover:bg-gray-900'}`}
                                    >
                                        <div className="flex flex-row items-center justify-between">
                                            {sevenBoxRules[ruleKey]}
                                            {userSelectedRules.includes(ruleKey) ? <IconCircleCheck /> : <IconPlus className="text-white" />}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                disabled={userSelectedRules?.length < 5}
                                className={`btn w-34 h-12 mt-2 btn-info rounded-full text-md active:scale-95`}
                                onClick={handleCustomRulesSubmit}
                            >
                                Go
                                <IconArrowLeft className="size-5 ltr:ml-1.5 rtl:mr-1.5 shrink-0" />
                            </button>
                        </div>
                    )}

                    {/* Custom symbols data with loading/error handling */}
                    {isLoadingCustomSymbols && <div className="text-blue-500 my-4">Loading symbols...</div>}
                    {customSymbolsError && <div className="text-red-500 my-4">{customSymbolsError}</div>}
                    {!isLoadingCustomSymbols && !customSymbolsError && customRuleSymbolsData.length > 0 && <SevenBoxSymbols symbolsData={customRuleSymbolsData} />}
                </div>
            </div>
        </div>
    );
};

export default SevenBoxRulePage;
