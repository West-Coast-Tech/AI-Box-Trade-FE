import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import './TradingViewWidget.css';

const TradingViewWidget: React.FC = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.isDarkMode);
    const themeParam = isDark ? 'dark' : 'light';
    const iframeSrc = `http://localhost:8081/tradingView-proxy?theme=${themeParam}`;

    return (
        <div className="w-full h-full">
            <iframe className="w-full h-full" src={iframeSrc} title="TradingView Widget"></iframe>
        </div>
    );
};

export default memo(TradingViewWidget);
