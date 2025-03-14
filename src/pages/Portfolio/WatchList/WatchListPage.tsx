import React, { useEffect, useState } from 'react';
import WatchListTable from './WatchListTable';
import { IWatchLists } from '../../../redux/types';
import PortfolioApi from '../../../utils/APIs/PortfolioApi';
const WatchListPage = () => {
    return (
        <div>
            <div className="panel w-full min-h-screen">
                <div>
                    <h1 className="font-bold text-2xl">Watch List</h1>
                </div>
                {/* Watch List table */}
                <div>
                    <WatchListTable />
                </div>
            </div>
        </div>
    );
};

export default WatchListPage;
