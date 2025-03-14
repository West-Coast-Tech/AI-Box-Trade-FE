import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
import axios from 'axios';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5stock from '@amcharts/amcharts5/stock';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome CSS
// import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import ContextMenu from './ContextMenu'; // Import your ContextMenu component
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import { TimeUnit } from '@amcharts/amcharts5/.internal/core/util/Time';
// import { fetchTrades } from '../../actions/tradeActions';
// import { useTheme } from '../ThemeContext'; // Import the custom hook
// import { toggleTheme } from '../../redux/features/themeConfigSlice';
// import { getAccounts } from '../../actions/accountActions';
import { DrawingTools } from '@amcharts/amcharts5/.internal/charts/stock/toolbar/DrawingToolControl';
import { IRootState } from '../../redux/store';
import SymbolBar from '../SymbolBar';
import { marketOpeningTime } from '../MarketCountdownTimer';
const SERVER_IP = import.meta.env.VITE_SERVER_IP || 'localhost';
const WebSocketProtocol = import.meta.env.VITE_WEBSOCKET_PROTOCOL || 'ws';
const HttpProtocol = import.meta.env.VITE_HTTP_PROTOCOL || 'http';
const selectSymbols = (state: AppState) => state.symbols.selectedSymbol;
// const selectTrades = (state: AppState) => state.trades.allTrades;
interface IncrementalChartProps {
    showSymbolBar?: boolean;
}

//Setting config for Dark Theme
const LabelColor = am5.color('rgb(0,255,255)'); //white
const GridColor = am5.color('rgb(60,60,150)'); //white
const PositiveColor = am5.color('rgb(0,0,255,0.7)'); //Positive Candle
// const NegativeColor = am5.color('rgb(255,0,255)'); //Negative Candle
const BackGroundColor = am5.color('rgb(10, 20, 45)');

const IncrementalChart: React.FC<IncrementalChartProps> = ({ showSymbolBar = true }) => {
    console.log('MARKET OPENING TIME', marketOpeningTime);
    // const trades = useSelector(selectTrades);
    // const tradeSeriesMapRef = useRef<{ [ticketNo: string]: am5xy.LineSeries }>({});
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    // const { theme, toggleTheme } = useTheme(); // Access the current theme and toggle function
    // const themeFileName = themeConfig.theme === 'dark' ? 'dark' : 'chart';
    const chartRef = useRef<HTMLDivElement | null>(null);
    const stockChartRef = useRef<am5stock.StockPanel | null>(null);
    const rootRef = useRef<am5.Root | null>(null); // Use ref to persist root
    const dateAxisRef = useRef<am5xy.GaplessDateAxis<am5xy.AxisRenderer> | null>(null);
    const valueAxisRef = useRef<am5xy.ValueAxis<am5xy.AxisRenderer> | null>(null);

    const [activeTool, setActiveTool] = useState<am5stock.DrawingControl | null>(null);
    const [drawingSelection, setDrawingSelection] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedDrawing, setSelectedDrawing] = useState<any>(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const [currentInterval, setCurrentInterval] = useState<any>({
        timeUnit: 'day',
        count: 1,
    });
    const [selectedSeriesType, setSelectedSeriesType] = useState<string>('candlestick'); // default series type

    const currentLinkRef = useRef<HTMLLinkElement | null>(null);

    //variables for live data chart
    const [prices, setPrices] = useState<number | null>();
    const socketUrl = `${WebSocketProtocol}://${SERVER_IP}`;
    const [lastCandleTime, setLastCandleTime] = useState(0);
    const currentLabelRef = useRef<am5xy.AxisLabel | null>(null);
    const currentValueDataItemRef = useRef<am5.DataItem<am5xy.IValueAxisDataItem> | null>(null);

    // const dispatch = useDispatch<any>();

    const currentSymbol = useSelector(selectSymbols);

    const drawingTools = [
        { type: 'Average', icon: 'fa fa-chart-line' },
        { type: 'Callout', icon: 'fa fa-comment' },
        { type: 'Doodle', icon: 'fa fa-pen' },
        { type: 'Ellipse', icon: 'fa-regular fa-circle' },
        { type: 'Fibonacci', icon: 'fa fa-chart-bar' },
        { type: 'Fibonacci Timezone', icon: 'fa fa-clock' },
        { type: 'Horizontal Line', icon: 'fa fa-minus' },
        { type: 'Horizontal Ray', icon: 'fa fa-arrow-right' },
        { type: 'Label', icon: 'fa fa-tag' },
        { type: 'Line', icon: 'fa fa-line' },
        { type: 'Measure', icon: 'fa fa-ruler' },
        { type: 'Parallel Channel', icon: 'fa fa-arrows-alt-h' },
        { type: 'Polyline', icon: 'fa fa-draw-polygon' },
        { type: 'Quadrant Line', icon: 'fa fa-chart-pie' },
        { type: 'Rectangle', icon: 'fa fa-square' },
        { type: 'Regression', icon: 'fa fa-chart-line' },
        { type: 'Trend Line', icon: 'fa fa-chart-line' },
        { type: 'Vertical Line', icon: 'fa-solid fa-grip-lines-vertical' },
        { type: 'Eraser', icon: 'fa-solid fa-eraser' },
        { type: 'Select', icon: 'fa-solid fa-mouse-pointer' },
    ];

    useEffect(() => {
        // if (isDarkMode) {
        // } else {
        //   changeTheme("white");
        // }b
        const themeFileName = themeConfig.theme === 'dark' ? 'dark' : 'chart';

        // Remove the previous CSS if it exists
        if (currentLinkRef.current) {
            document.head.removeChild(currentLinkRef.current);
        }

        // Create a new link element
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = new URL(`./${themeFileName}.css`, import.meta.url).toString();
        linkElement.type = 'text/css';

        // Append the new link element to the document head
        document.head.appendChild(linkElement);

        // Update the reference to the current link element
        currentLinkRef.current = linkElement;

        // Cleanup on unmount or theme change
        return () => {
            if (currentLinkRef.current) {
                document.head.removeChild(currentLinkRef.current);
                currentLinkRef.current = null;
            }
        };
    }, [themeConfig.theme]);

    useEffect(() => {
        setDrawingSelection(stockChart?.get('drawingSelectionEnabled' as keyof am5.ISpriteSettings));
    }, [drawingSelection]);

    //creating web socket connection

    useEffect(() => {
        const ws = new WebSocket(socketUrl);
        const resetPriceData = () => {
            setPrices(null); // Reset the price state before setting up the new WebSocket
        };
        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    action: 'subscribe',
                    symbol: currentSymbol?.symbol || 'BUFF',
                })
            );
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            //

            if (data.symbol && data.price) {
                setPrices(data.price);
            }

            // if (data.type == 'TRADE_COMPLETED') {
            //     dispatch(fe());
            //     dispatch(getAccounts());
            // }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {};

        return () => {
            ws.close();
            resetPriceData();
        };
    }, [currentSymbol]);

    //Creating Chart in Layout Effect Hook
    useLayoutEffect(() => {
        const root = am5.Root.new(chartRef.current!);

        rootRef.current = root;
        const dark = am5themes_Dark.new(root);

        // dark.rule("Label").setAll({
        //   fill: LabelColor,
        //   // fontSize:"1.5em"
        // })
        dark.rule('InterfaceColors').setAll({
            grid: GridColor,
            // positive: PositiveColor,
            // negative: NegativeColor,
            // alternativeBackground: BackGroundColor,
            // primaryButton: PositiveColor,
            // disabled: PositiveColor,
            background: BackGroundColor,
        });
        const myTheme = am5.Theme.new(root);
        // myTheme.rule("Label").setAll({
        //   fill: LabelColor,
        //   // fontSize:"1.5em"
        // })
        myTheme.rule('InterfaceColors').setAll({
            background: am5.color('#f7f7f7'),
        });
        if (themeConfig.theme == 'dark') {
            root.setThemes([dark]); // Set dark theme
            // loadCSS("./dark.css"); // Load dark CSS
        } else {
            root.setThemes([myTheme]); // Set light theme (example)
            // loadCSS("./chart.css"); // Load light CSS (if needed)
        }
        const stockChart = root.container.children.push(am5stock.StockChart.new(root, {}));
        // Set global number format
        root.numberFormatter.set('numberFormat', '#,###.######');
        root._logo?.dispose();
        // Create a main stock panel (chart)
        const chart = stockChart.panels.push(
            am5stock.StockPanel.new(root, {
                wheelY: 'zoomX',
                panX: true,
                panY: true,
            })
        );
        stockChartRef.current = chart;
        chart.panelControls.set('forceHidden', true);
        // chart.get('colors')?.set('step', 2);

        const valueAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                    pan: 'zoom',
                }),
                tooltip: am5.Tooltip.new(root, {}),
                numberFormat: '#,###.####',
                extraTooltipPrecision: 1,
            })
        );
        valueAxisRef.current = valueAxis;

        valueAxis.get('renderer')?.labels.template.setAll({
            centerY: am5.percent(100),
            maxPosition: 0.98,
        });

        const volumeAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                numberFormat: '#a',
                forceHidden: true,
                visible: false,
            })
        );

        volumeAxis.get('renderer')?.labels.template.setAll({
            maxPosition: 0.98,
            forceHidden: true,
            visible: false,
        });

        const dateAxis = chart.xAxes.push(
            am5xy.GaplessDateAxis.new(root, {
                groupData: true,
                groupCount: 10000,
                baseInterval: { timeUnit: currentInterval.timeUnit, count: 1 },
                groupIntervals: [
                    { timeUnit: 'day', count: 1 },
                    { timeUnit: 'day', count: 7 },
                    { timeUnit: 'day', count: 14 },
                    { timeUnit: 'day', count: 30 },
                ],

                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {}),
                extraMax: 0.3,
                maxDeviation: 1,
                //   maxZoomCount:200
            })
        );
        dateAxisRef.current = dateAxis;

        const color = root.interfaceColors.get('background');

        const candleStickSettings = {
            fill: color,
            clustered: false,
            calculateAggregates: false,
            stroke: color,
            name: currentSymbol?.symbol || 'BUFF',
            xAxis: dateAxis,
            yAxis: valueAxis,
            valueYField: 'close',
            openValueYField: 'open',
            lowValueYField: 'low',
            highValueYField: 'high',
            valueXField: 'date',
            lowValueYGrouped: 'low',
            highValueYGrouped: 'high',
            openValueYGrouped: 'open',
            valueYGrouped: 'close',
            legendValueText: 'open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}',
            legendRangeValueText: '{valueYClose}',
        } as am5xy.ICandlestickSeriesSettings;

        let valueSeries: am5xy.XYSeries | undefined;

        switch (selectedSeriesType) {
            case 'candlestick':
            case 'procandlestick':
                valueSeries = chart.series.push(am5xy.CandlestickSeries.new(root, candleStickSettings));
                if (selectedSeriesType === 'procandlestick') {
                    (valueSeries as am5xy.CandlestickSeries).columns.template.get('themeTags')?.push('pro');
                }
                break;
            case 'line':
                valueSeries = chart.series.push(
                    am5xy.LineSeries.new(root, {
                        valueYField: 'close',
                        valueXField: 'date',
                        xAxis: dateAxis,
                        yAxis: valueAxis,
                    })
                );
                valueSeries.set('stroke', LabelColor);
                valueSeries.set('fill', PositiveColor);
                break;
            case 'ohlc':
                valueSeries = chart.series.push(am5xy.OHLCSeries.new(root, candleStickSettings));
                break;
        }

        stockChart.set('stockSeries', valueSeries);

        const volumePanel = stockChart.panels.push(
            am5stock.StockPanel.new(root, {
                forceHidden: true,
                visible: false,
            })
        );
        // volumePanel.hide()
        // volumePanel.setAll({
        //   visible:false
        // })
        //
        const volumeSeries = volumePanel.series.push(
            am5xy.ColumnSeries.new(root, {
                name: 'Volume',
                clustered: false,
                valueYField: 'volume',
                valueXField: 'date',
                xAxis: dateAxis,
                yAxis: volumeAxis,
                legendValueText: '{valueY}',
                forceHidden: true,
                visible: false,
            })
        );
        stockChart.set('volumeSeries', volumeSeries);

        const valueLegend = chart.plotContainer.children.push(
            am5stock.StockLegend.new(root, {
                stockChart: stockChart,
            })
        );
        valueLegend.data.setAll([valueSeries]);

        const volumeLegend = volumePanel.plotContainer.children.push(
            am5stock.StockLegend.new(root, {
                stockChart: stockChart,
                forceHidden: true,
                visible: false,
            })
        );

        volumeLegend.data.setAll([volumeSeries]);

        chart.rightAxesContainer.set('layout', root.verticalLayout);

        chart.set(
            'cursor',
            am5xy.XYCursor.new(root, {
                yAxis: valueAxis,
                xAxis: dateAxis,
                // snapToSeries: [valueSeries],
                // snapToSeriesBy: 'y!',
            })
        );

        //Creating current label and tooltip to update on live data feed
        let currentValueDataItem = valueAxis.createAxisRange(valueAxis.makeDataItem({ value: 0 }));
        if (currentValueDataItem) currentValueDataItemRef.current = currentValueDataItem;

        let currentLabel = currentValueDataItem.get('label');
        if (currentLabel) {
            currentLabel.setAll({
                fill: am5.color(0xffffff),
                background: am5.Rectangle.new(root, { fill: am5.color(0x000000) }),
            });
            currentLabelRef.current = currentLabel;
        }

        let currentGrid = currentValueDataItem.get('grid');
        if (currentGrid) {
            currentGrid.setAll({ strokeOpacity: 0.5, strokeDasharray: [2, 5] });
        }

        //series switcher control
        const seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
            stockChart: stockChart,
            name: '',
        });

        seriesSwitcher.events.on('selected', (ev) => {
            setSeriesType((ev.item as am5stock.IDropdownListItem).id as string);
        });

        // Get settings for a new series
        function getNewSettings(series: am5xy.XYSeries): Record<string, any> {
            const newSettings: Record<string, any> = {};
            ['name', 'valueYField', 'highValueYField', 'lowValueYField', 'openValueYField', 'calculateAggregates', 'valueXField', 'xAxis', 'yAxis', 'legendValueText', 'stroke', 'fill'].forEach(
                (setting) => {
                    newSettings[setting] = series.get(setting as keyof am5.ISpriteSettings);
                }
            );
            return newSettings;
        }

        // Set series type based on user selection
        function setSeriesType(seriesType: string): void {
            // Get current series and its settings
            const currentSeries = stockChart.get('stockSeries') as am5xy.XYSeries;
            const newSettings = getNewSettings(currentSeries);
            if (seriesType === 'line') {
                delete newSettings.openValueYField; // Remove openValueYField for line series
            } else {
                newSettings.openValueYField = 'open'; // Restore openValueYField for other series types
            }
            // Remove previous series
            const data = currentSeries.data.values;
            chart.series.removeValue(currentSeries);

            // Create new series
            let series: am5xy.XYSeries | undefined;
            switch (seriesType) {
                case 'line':
                    series = chart.series.push(am5xy.LineSeries.new(root, newSettings as am5xy.ILineSeriesSettings));
                    series.set('stroke', LabelColor);
                    series.set('fill', PositiveColor);

                    (series as any).strokes.template.setAll({
                        strokeWidth: 1,
                    });

                    (series as any).fills.template.setAll({
                        fillOpacity: 0.1,
                        visible: true,
                    });
                    break;
                case 'candlestick':
                case 'procandlestick':
                    newSettings.clustered = false;
                    series = chart.series.push(am5xy.CandlestickSeries.new(root, newSettings as am5xy.ICandlestickSeriesSettings));
                    if (seriesType === 'procandlestick') {
                        // @ts-ignore
                        series.columns.template.get('themeTags').push('pro');
                    }
                    break;
                case 'ohlc':
                    newSettings.clustered = false;
                    series = chart.series.push(am5xy.OHLCSeries.new(root, newSettings as am5xy.ICandlestickSeriesSettings));
                    break;
            }

            if (series) {
                // Set the new series as the stock series
                series.data.setAll(data);
                stockChart.set('stockSeries', series);
                setSelectedSeriesType(seriesType); // save the selected series type to state

                valueSeries = series; // Update the reference to valueSeries

                // Reattach cursor to the new series
                // const cursor = chart.get("cursor") as am5xy.XYCursor;
                // if (cursor) {
                //   cursor.set('snapToSeries', [series]);
                // }

                // Update the legend with the new series
                valueLegend.data.removeValue(currentSeries);
                valueLegend.data.insertIndex(0, series);

                // Clear any existing pan and wheel events
                chart.events.off('panended');
                chart.events.off('wheelended');

                // Reattach data loading events
                chart.events.on('panended', () => {
                    loadSomeData(); // Log to ensure this is called
                });

                chart.events.on('wheelended', () => {
                    if (wheelTimeout) {
                        wheelTimeout.dispose();
                    }

                    wheelTimeout = chart.setTimeout(() => {
                        loadSomeData(); // Log to ensure this is called
                    }, 50);
                });

                // Redraw chart
                //   chart.invalidateData();
                chart.appear(1000, 100);
            }
        }

        const loadData = async (interval: string, count: number, min: number, max: number, side: string) => {
            try {
                // Round the `min` to the nearest interval and adjust it
                min = am5.time.round(new Date(min), interval as TimeUnit, 1).getTime();

                const url = `${HttpProtocol}://${SERVER_IP}/tradingData`;
                const params = {
                    symbol: currentSymbol?.symbol || 'BUFF',
                    interval: interval,
                    count,
                    min: min,
                    max: max,
                };

                // Axios request with params
                const response = await axios.get(url, { params });

                const data = response.data; // Axios automatically parses JSON

                const processor = am5.DataProcessor.new(root, {
                    numericFields: ['date', 'open', 'high', 'low', 'close', 'volume'],
                });

                processor.processMany(data); // Process the data

                const start = dateAxis.get('start') as number;
                const end = dateAxis.get('end') as number;

                if (side === 'none') {
                    if (data.length > 0) {
                        if (dateAxis.get('baseInterval')?.timeUnit !== currentInterval.timeUnit) {
                            dateAxis.set('baseInterval', {
                                timeUnit: currentInterval.timeUnit,
                                count: 1,
                            });
                            dateAxis.set('groupInterval', {
                                timeUnit: currentInterval.timeUnit,
                                count: currentInterval.count,
                            });
                        }
                        dateAxis.set('min', min);
                        dateAxis.set('max', max);
                        dateAxis.setPrivate('min', min);
                        dateAxis.setPrivate('max', max);

                        valueSeries?.data.setAll(data);

                        volumeSeries.data.setAll(data);
                        dateAxis.set('groupInterval', {
                            timeUnit: currentInterval.timeUnit,
                            count: currentInterval.count,
                        });
                        dateAxis.setAll({
                            groupIntervals: [
                                { timeUnit: 'day', count: 1 },
                                { timeUnit: 'day', count: 7 },
                                { timeUnit: 'day', count: 14 },
                                { timeUnit: 'day', count: 30 },
                            ],
                        });
                    }
                } else if (side === 'left') {
                    // Set group intervals
                    dateAxis.setAll({
                        groupIntervals: [
                            { timeUnit: 'day', count: 1 },
                            { timeUnit: 'day', count: 7 },
                            { timeUnit: 'day', count: 14 },
                            { timeUnit: 'day', count: 30 },
                        ],
                    });

                    if (valueSeries) {
                        const seriesFirst: Record<string, number> = {};
                        seriesFirst[valueSeries.uid] = (valueSeries.data.getIndex(0) as any)?.date as number;
                        seriesFirst[volumeSeries.uid] = (volumeSeries.data.getIndex(0) as any)?.date as number;

                        for (let i = data.length - 1; i >= 0; i--) {
                            const date = data[i].date;
                            if (seriesFirst[valueSeries.uid] > date) {
                                valueSeries.data.unshift(data[i]);
                            }
                            if (seriesFirst[volumeSeries.uid] > date) {
                                volumeSeries.data.unshift(data[i]);
                            }
                        }

                        const data2 = valueSeries;

                        valueSeries.data.setAll(data2.data.values);
                        volumeSeries.data.setAll(data2.data.values);

                        const currentSeries = stockChart.get('stockSeries') as am5xy.XYSeries;
                        currentSeries.data = valueSeries.data;
                    }
                    min = Math.max(min, absoluteMin);
                    dateAxis.set('min', min);
                    dateAxis.setPrivate('min', min);
                    dateAxis.set('start', 0);
                    dateAxis.set('end', (end - start) / (1 - start));
                } else if (side === 'right') {
                    // const seriesLast: Record<string, number> = {};
                    // seriesLast[valueSeries.uid] = valueSeries.data.getIndex(
                    //   valueSeries.data.length - 1
                    // )?.date as number;
                    // seriesLast[volumeSeries.uid] = volumeSeries.data.getIndex(
                    //   volumeSeries.data.length - 1
                    // )?.date as number;
                    // for (let i = 0; i < data.length; i++) {
                    //   const date = data[i].date;
                    //   if (seriesLast[valueSeries.uid] < date) {
                    //     valueSeries.data.push(data[i]);
                    //   }
                    //   if (seriesLast[volumeSeries.uid] < date) {
                    //     volumeSeries.data.push(data[i]);
                    //   }
                    // }
                    // max = Math.min(max, absoluteMax);
                    // dateAxis.set("max", max);
                    // dateAxis.setPrivate("max", max);
                    // dateAxis.set("start", start / end);
                    // dateAxis.set("end", 1);
                }
            } catch (error) {
                console.error('Error fetching or processing data:', error);
            }
        };

        const loadSomeData = () => {
            const start = dateAxis.get('start') as number;
            const end = dateAxis.get('end') as number;
            const selectionMin = Math.max(dateAxis.getPrivate('selectionMin') as number, absoluteMin);
            const selectionMax = Math.min(dateAxis.getPrivate('selectionMax') as number, absoluteMax);

            const min = dateAxis.getPrivate('min') as number;
            const max = dateAxis.getPrivate('max') as number;

            if (start < 0) {
                loadData(currentInterval.timeUnit, currentInterval.count, selectionMin, min, 'left');
            }
            if (end > 1) {
                loadData(currentInterval.timeUnit, currentInterval.count, max, selectionMax, 'right');
            }
        };

        const currentDate = new Date();
        const min = currentDate.getTime() - am5.time.getDuration(currentInterval.timeUnit, currentInterval.count * 36);
        const max = currentDate.getTime();

        const absoluteMax = max;
        const absoluteMin = new Date(2000, 0, 1).getTime();

        chart.events.on('panended', () => {
            loadSomeData();
        });

        let wheelTimeout: any;
        chart.events.on('wheelended', () => {
            if (wheelTimeout) {
                wheelTimeout.dispose();
            }

            wheelTimeout = chart.setTimeout(() => {
                loadSomeData();
            }, 50);
        });
        loadData(currentInterval.timeUnit, currentInterval.count, absoluteMin, max, 'none');

        chart.appear(1000, 500);

        let periodSelector = am5stock.PeriodSelector.new(root, {
            stockChart: stockChart,
            periods: [
                { timeUnit: 'minute', count: 10, name: '10 Minutes' },
                { timeUnit: 'minute', count: 20, name: '20 Minutes' },
                { timeUnit: 'minute', count: 40, name: '40 Minutes' },
            ],
        });
        // Set default period after data is validated
        valueSeries?.events.once('datavalidated', function () {
            periodSelector.selectPeriod({
                timeUnit: currentInterval.timeUnit,
                count: currentInterval.count * 120,
            });
        });

        //Interval Switcher control

        const intervalSwitcher = am5stock.IntervalControl.new(root, {
            stockChart: stockChart,
            // icon: createTimeIcon(),
            name: `${currentInterval.count} ${currentInterval.timeUnit}`,
            items: [
                {
                    id: '5 Min',
                    label: '5 Mins',
                    interval: { timeUnit: 'minute', count: 5 },
                },
                {
                    id: '15 Min',
                    label: '15 Mins',
                    interval: { timeUnit: 'minute', count: 15 },
                },
                {
                    id: '30 Min',
                    label: '30 Mins',
                    interval: { timeUnit: 'minute', count: 30 },
                },
                {
                    id: '1 Hour',
                    label: '1 Hour',
                    interval: { timeUnit: 'hour', count: 1 },
                },
                {
                    id: '2 Hour',
                    label: '2 Hour',
                    interval: { timeUnit: 'hour', count: 2 },
                },
                {
                    id: '4 Hour',
                    label: '4 Hour',
                    interval: { timeUnit: 'hour', count: 4 },
                },
                {
                    id: '1 Day',
                    label: '1 Day',
                    interval: { timeUnit: 'day', count: 1 },
                },
                {
                    id: '1 Week',
                    label: '1 Week',
                    interval: { timeUnit: 'week', count: 1 },
                },

                {
                    id: '1 Month',
                    label: '1 Month',
                    interval: { timeUnit: 'month', count: 1 },
                },
            ],
        });
        intervalSwitcher.events.on('selected', (ev: any) => {
            const newInterval = ev.item.interval;

            setCurrentInterval(newInterval);
            dateAxis.setAll({
                groupIntervals: [
                    { timeUnit: 'day', count: 1 },
                    { timeUnit: 'day', count: 7 },
                    { timeUnit: 'day', count: 14 },
                    { timeUnit: 'day', count: 30 },
                ],
            });
        });

        const toolbar = am5stock.StockToolbar.new(root, {
            container: document.getElementById('chartcontrols')!,
            stockChart: stockChart,
            controls: [
                am5stock.IndicatorControl.new(root, {
                    stockChart: stockChart,
                    legend: valueLegend,
                    name: '',
                    // icon: createIndicatorIcon()
                }),
                intervalSwitcher,
                seriesSwitcher,
                //  drawingControl,

                am5stock.SettingsControl.new(root, {
                    stockChart: stockChart,
                }),
            ],
        });

        const toggleFullscreen = () => {
            const chartDiv = document.getElementById('chartdiv');

            if (chartDiv && !document.fullscreenElement) {
                chartDiv.requestFullscreen().catch((err) => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        };
        const fullscreenButton = document.getElementById('fullscreen-toggle');
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', toggleFullscreen);
        }
        stockChart.events.on('drawingadded', (ev) => {
            ev.series.events.on('pointerover', (ev) => {});

            ev.series.events.on('pointerout', (ev) => {});

            ev.series.events.on('rightclick', (ev) => {
                // ev.event.preventDefault();  // Prevent the default browser context menu

                setMenuVisible(true);
                setMenuPosition({
                    x: ev.originalEvent.clientX - 330,
                    y: ev.originalEvent.clientY - 190,
                });
                setSelectedDrawing(ev.target);
                stockChart.set('drawingSelectionEnabled', true);
                setDrawingSelection(true);
                stockChart.events.on('click', (ev) => {
                    setMenuVisible(false);
                    const drawControlSettings = document.getElementById('drawControlSettings');

                    if (drawControlSettings) drawControlSettings.style.display = 'none';
                });
            });
            ev.series.events.on('dblclick', (ev) => {
                stockChart.set('drawingSelectionEnabled', true);
                setDrawingSelection(true);
            });
            if (activeTool) {
                activeTool.set('active', false);
                setActiveTool(null);
            }
        });

        stockChart.events.on('drawingselected', (ev) => {
            setMenuVisible(true);
            setMenuPosition({ x: 400, y: 100 });
            setSelectedDrawing(ev.target);
        });

        const handleClickOutside = (event: MouseEvent) => {
            const drawingToolsElement = document.getElementById('drawing-tools');
            if (drawingToolsElement && !drawingToolsElement.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        root.addDisposer(
            am5.utils.addEventListener(root.dom, 'contextmenu', function (ev) {
                ev.preventDefault();
            })
        );

        return () => {
            if (rootRef.current) {
                rootRef.current.dispose();
                rootRef.current = null;
            }
            if (fullscreenButton) {
                fullscreenButton.removeEventListener('click', toggleFullscreen);
            }
        };
    }, [themeConfig.theme, currentInterval, currentSymbol]);

    // //UseEffect hook to create new trade event series
    // useEffect(() => {
    //     const chart = stockChartRef.current;
    //     const dateAxis = dateAxisRef.current;
    //     const valueAxis = valueAxisRef.current;
    //     const root = rootRef.current;
    //     const tradeSeriesMap = tradeSeriesMapRef.current;

    //     if (!root || !chart || !dateAxis || !valueAxis) return;

    //     const activeTicketNos = new Set<string>();

    //     // Filter trades for the current symbol
    //     const filteredTrades = trades.filter((trade) => trade.symbol === currentSymbol?.name);
    //
    //     // Iterate over the filtered trades
    //     filteredTrades.forEach((trade) => {
    //         const openingTime = new Date(trade.openingTime).getTime();
    //         const closingTime = trade.closingTime ? new Date(trade.closingTime).getTime() : null;

    //         if (!closingTime) {
    //             console.warn(`Trade ${trade.ticketNo} has an invalid closingTime.`);
    //             return;
    //         }

    //         const existingSeries = tradeSeriesMap[trade.ticketNo];

    //         if (trade.isComplete) {
    //             // Trade is complete, remove its series if it exists
    //             if (existingSeries) {
    //                 chart.series.removeValue(existingSeries);
    //                 existingSeries.dispose();
    //                 delete tradeSeriesMap[trade.ticketNo];
    //             }
    //         } else {
    //             // Trade is not complete
    //             activeTicketNos.add(trade.ticketNo);

    //             const eventData = [
    //                 { date: openingTime, value: trade.openingPrice },
    //                 { date: closingTime, value: trade.openingPrice }, // Flat line at openingPrice
    //             ];

    //             if (!existingSeries) {
    //                 // No existing series, create one
    //                 const eventSeries = chart.series.push(
    //                     am5xy.LineSeries.new(root, {
    //                         xAxis: dateAxis,
    //                         yAxis: valueAxis,
    //                         valueXField: 'date',
    //                         valueYField: 'value',
    //                         name: `Trade ${trade.ticketNo}`,
    //                         stroke: trade.tradeDirection === 'up' ? am5.color(0x00ff00) : am5.color(0xff0000),
    //                     })
    //                 );

    //                 // Set the data for the event series
    //                 eventSeries.data.setAll(eventData);

    //                 // Add bullets (markers) to the event series
    //                 eventSeries.bullets.push(() => {
    //                     const container = am5.Container.new(root, {});

    //                     const circle = container.children.push(
    //                         am5.Circle.new(root, {
    //                             radius: 7,
    //                             stroke: trade.tradeDirection === 'up' ? am5.color(0x00ff00) : am5.color(0xff0000),
    //                             fill: trade.tradeDirection === 'up' ? am5.color(0x005500) : am5.color(0x550000),
    //                             tooltipText: `${trade.openingPrice} $`,
    //                             tooltipY: 0,
    //                         })
    //                     );

    //                     return am5.Bullet.new(root, {
    //                         sprite: container,
    //                     });
    //                 });

    //                 // Customize the line appearance
    //                 eventSeries.strokes.template.setAll({
    //                     strokeWidth: 2,
    //                 });

    //                 // Store the event series in the mapping
    //                 tradeSeriesMap[trade.ticketNo] = eventSeries;
    //             } else {
    //                 // Existing series, update data
    //                 existingSeries.data.setAll(eventData);
    //             }
    //         }
    //     });

    //     // Remove event series for trades that are no longer active or not part of filtered trades
    //     Object.keys(tradeSeriesMap).forEach((ticketNo) => {
    //         if (!activeTicketNos.has(ticketNo)) {
    //             const eventSeries = tradeSeriesMap[ticketNo];
    //             chart.series.removeValue(eventSeries);
    //             eventSeries.dispose();
    //             delete tradeSeriesMap[ticketNo];
    //         }
    //     });
    // }, [trades, currentSymbol]);

    //UseEffect for live Data feed
    useEffect(() => {
        let interval: any;
        const currentValueDataItem = currentValueDataItemRef.current;
        const currentLabel = currentLabelRef.current;
        const updateChart = () => {
            const date = Date.now();
            const root = rootRef.current;
            if (!root) return;

            const stockChart = root?.container.children.getIndex(0);
            const stockSeries = 'stockSeries' as keyof am5.ISpriteSettings;
            const valueSeries = stockChart?.get('stockSeries' as keyof am5.ISpriteSettings);
            const livePrice = prices;
            if (!livePrice) return;
            // Update the current value label
            currentValueDataItem?.animate({
                key: 'value',
                to: livePrice,
                duration: 200,
                easing: am5.ease.out(am5.ease.cubic),
            });
            currentLabel?.set('text', stockChart?.getNumberFormatter().format(livePrice));

            let open = livePrice; // Default value for open price

            if (valueSeries && livePrice) {
                let lastDataObject = valueSeries.data.getIndex(valueSeries.data.length - 1);

                let high = livePrice;
                let low = livePrice;

                if (lastDataObject) {
                    const previousDate = lastDataObject.date;
                    open = lastDataObject.open;
                    high = Math.max(lastDataObject.high, livePrice);
                    low = Math.min(lastDataObject.low, livePrice);
                    let baseInterval = 5000;
                    switch (currentInterval.timeUnit) {
                        case 'second':
                            baseInterval = 5000;
                            break;
                        case 'minute':
                            baseInterval = 60000;
                            break;
                        case 'hour':
                            baseInterval = 3600000;
                            break;
                        case 'day':
                            baseInterval = 86400000;
                            break;
                        default:
                            baseInterval = 5000;
                            break;
                    }

                    if (date - lastCandleTime >= baseInterval) {
                        // Add a new candlestick
                        const newCandle = {
                            date: date,
                            close: livePrice,
                            open: livePrice,
                            low: livePrice,
                            high: livePrice,
                        };
                        valueSeries.data.push(newCandle);
                        setLastCandleTime(date);
                    } else {
                        // Update the existing candlestick
                        const updatedCandle = {
                            date: previousDate,
                            close: livePrice,
                            open: open,
                            low: low,
                            high: high,
                        };
                        valueSeries.data.setIndex(valueSeries.data.length - 1, updatedCandle);
                    }
                } else {
                    // First data point (if no previous candle exists)
                    const newCandle = {
                        date: date,
                        close: livePrice,
                        open: livePrice,
                        low: livePrice,
                        high: livePrice,
                    };
                    valueSeries.data.push(newCandle);
                }

                // Update current value

                if (currentLabel) {
                    currentValueDataItem?.animate({
                        key: 'value',
                        to: livePrice,
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic),
                    });
                    currentLabel.set('text', stockChart?.getNumberFormatter().format(livePrice));
                    let bg = currentLabel.get('background');
                    if (bg) {
                        if (livePrice < open) {
                            bg.set('fill', root.interfaceColors.get('negative'));
                        } else {
                            bg.set('fill', root.interfaceColors.get('positive'));
                        }
                    }
                }
            }
        };

        updateChart();

        return () => {
            clearInterval(interval);
        };
    }, [prices]); // Re-run effect if prices change

    const root = rootRef.current;
    const stockChart = root?.container.children.getIndex(0);

    stockChart?.events.on('drawingadded' as keyof am5.ISpriteEvents, (ev) => {
        if (activeTool) {
            const currentDrawing = activeTool.serializeDrawings('object');
            activeTool.set('active', false);
            // setActiveTool(null);
            const drawControlSettings = document.getElementById('drawControlSettings');

            if (drawControlSettings) {
                drawControlSettings.style.display = 'none';
            }
        }
    });

    const activateDrawingTool = (toolType: string) => {
        const root = rootRef.current;
        const stockChart = root?.container.children.getIndex(0) as any;

        const drawControlSettings = document.getElementById('drawControlSettings');
        if (!drawControlSettings) return;
        if (!root || root.isDisposed() || !stockChart) {
            console.error('Root or stockChart is not available or disposed.');
            return;
        }

        let drawingTool = am5stock.DrawingControl.new(root, {
            stockChart: stockChart,
        });

        // Deactivate the previously active tool if it exists
        if (activeTool) {
            activeTool.set('active', false);
            setActiveTool(null);
        }

        stockChart.set('drawingSelectionEnabled' as keyof am5.ISpriteSettings, true);
        setDrawingSelection(true);

        // Reset and activate the selected drawing tool
        drawingTool.setAll({
            tool: toolType as DrawingTools,
            active: true,
        });

        // Handle eraser and selection cases separately
        if (toolType === 'Eraser') {
            drawingTool.set('active', false);
            drawingTool.setEraser(true);
            stockChart.set('drawingSelectionEnabled' as keyof am5.ISpriteSettings, false);
            setDrawingSelection(false);
            drawControlSettings.style.display = 'none';
        } else if (toolType === 'Select') {
            stockChart.set('drawingSelectionEnabled' as keyof am5.ISpriteSettings, false);
            stockChart.set('drawingSelectionEnabled' as keyof am5.ISpriteSettings, true);
            drawControlSettings.style.display = 'none';
        } else {
            setActiveTool(drawingTool);
            drawControlSettings.style.display = 'block';

            const lineWidthInput = document.getElementById('lineWidth') as HTMLInputElement;
            const lineColorInput = document.getElementById('lineColor') as HTMLInputElement;

            if (lineWidthInput) {
                lineWidthInput.value = '2';
                lineWidthInput.addEventListener('input', () => {
                    if (drawingTool) {
                        drawingTool.setAll({
                            strokeWidth: parseInt(lineWidthInput.value, 10),
                        });
                    }
                });
            }

            if (lineColorInput) {
                lineColorInput.value = '#000000';
                lineColorInput.addEventListener('input', () => {
                    if (drawingTool) {
                        drawingTool.setAll({
                            strokeColor: am5.color(lineColorInput.value),
                        });
                    }
                });
            }
        }
    };

    const handleSelect = () => {
        // Handle selection logic
        setMenuVisible(false);
    };
    const handleEdit = () => {
        if (selectedDrawing) {
        }
        const drawControlSettings = document.getElementById('drawControlSettings');

        if (drawControlSettings) drawControlSettings.style.display = 'block';

        setMenuVisible(false);
    };

    const handleRemove = () => {
        // Handle remove logic
        if (selectedDrawing) {
            selectedDrawing.dispose();
        }
        setMenuVisible(false);
    };
    const toggleDrawingTools = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <div id="incremental-chart">
            <ContextMenu x={menuPosition.x} y={menuPosition.y} visible={menuVisible} onRemove={handleRemove} />

            <div className="flex relative">
                <div className="flex-grow">
                    <div className="flex md:w-full items-center justify-start pl-5 pt-[1.5vh] h-[3vh]">
                        {/* Chart Controls */}
                        {showSymbolBar && <SymbolBar />}
                        <div id="chartcontrols"></div>

                        {/* Drawing Tools Toggle Button */}
                        <div id="drawing-tools-toggle" className="relative">
                            <button onClick={toggleDrawingTools} className="p-2 pt-3 bg-inherit text-[#848e9c] rounded cursor-pointer transition duration-300">
                                <i className="fa fa-pencil text-[1rem]"></i>
                            </button>

                            {/* Drawing Tools Dropdown */}
                            {isDropdownOpen && (
                                <div id="drawing-tools" className="absolute left-0 bg-gray-900 shadow-lg z-10">
                                    <ul className="flex flex-col list-none pl-0 my-0">
                                        {drawingTools.map((tool) => (
                                            <li key={tool.type} className="p-2 hover:bg-gray-700 cursor-pointer">
                                                <button onClick={() => activateDrawingTool(tool.type)}>
                                                    <i className={tool.icon}></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div id="drawControlSettings" className="hidden">
                            <label>
                                Line Width:
                                <input type="range" id="lineWidth" min="1" max="10" />
                            </label>
                            <label>
                                Line Color:
                                <input type="color" value="#43da86" id="lineColor" />
                            </label>
                        </div>
                        {/* Fullscreen Button */}
                        <button id="fullscreen-toggle" className="ml-auto relative right-0 top-0 mr-6 mt-0 border-none bg-transparent cursor-pointer text-tBase">
                            <i className="fas fa-expand-arrows-alt"></i>
                        </button>
                        {/* <button onClick={toggleTheme} className="relative mr-5 cursor-pointer mt-4 border-none h-[1.2rem] text-tBase bg-transparent">
                            <i className={`fas fa-moon`}></i>
                        </button> */}
                    </div>

                    <div id="chartdiv" ref={chartRef}></div>
                </div>

                {/* Fullscreen button outside of chart controls */}
            </div>
        </div>
    );
};

export default IncrementalChart;
