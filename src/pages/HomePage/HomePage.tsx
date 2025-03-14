import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../redux/features/themeConfigSlice';
import Hero from './Hero';
import InstitutionalCharting from './InstitutionalCharting';
import Indicators from './Indicators';
import HomePageNews from './HomePageNews';
import { PricingTable } from './PricingTable';

const HomePage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Home Page'));
    });
    return (
        <div className="flex items-start justify-center">
            <div className="w-[90%] ">
                <Hero />
                <InstitutionalCharting />
                <Indicators />
                <HomePageNews />
                <div id="pricingTable">
                    <PricingTable />
                </div>
            </div>
        </div>
    );
};
export default HomePage;
