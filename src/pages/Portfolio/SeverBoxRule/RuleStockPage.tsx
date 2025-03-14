import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';

const RuleStockPage = () => {
    const location = useLocation();
    const userSelectedRules = location.state || {};
    console.log(userSelectedRules);
    useEffect(() => {
        const getSevenBoxRuleSymbols = async () => {
            const token = localStorage.getItem('token') || '';
            const fields = userSelectedRules;
            const response = await PortfolioApi.getSevenBoxRuleSymbols(token, userSelectedRules);
            console.log(response.data);
        };
        getSevenBoxRuleSymbols();
    }, []);
    return <div>RuleStockPage</div>;
};

export default RuleStockPage;
