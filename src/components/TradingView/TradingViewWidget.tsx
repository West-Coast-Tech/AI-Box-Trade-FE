import React, { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { AppState } from '../../redux/types';
const TradingViewWidget: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentSymbol = useSelector((state: AppState) => state.symbols.selectedSymbol);
    // A flag to ensure we only load the widget once.
    const widgetLoadedRef = useRef<boolean>(false);
    const isDark = useSelector((state: IRootState) => state.themeConfig.isDarkMode);
    useEffect(() => {
        // If the widget is already loaded, do nothing.
        if (widgetLoadedRef.current) return;
        if (!containerRef.current) return;

        // Clear any existing content to avoid duplicates.
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;
        // Using JSON.stringify ensures valid JSON configuration.
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: currentSymbol ? currentSymbol.symbol : 'AMD',
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: isDark ? 'dark' : 'light',
            backgroundColor: isDark ? 'rgba(14, 23, 38, 1)' : '',
            style: '1',
            locale: 'en',
            allow_symbol_change: false,
            calendar: true,
            support_host: 'https://www.tradingview.com',
        });

        containerRef.current.appendChild(script);
        widgetLoadedRef.current = true;

        // Cleanup on unmount: clear the container and reset the flag.
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            widgetLoadedRef.current = false;
        };
    }, [currentSymbol, isDark]);

    return <div className="tradingview-widget-container pl-5" ref={containerRef} style={{ height: '100%', width: '100%' }} />;
};

export default memo(TradingViewWidget);
