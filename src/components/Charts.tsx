import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5stock from '@amcharts/amcharts5/stock';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';

const Chart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<am5.Root | null>(null); // Use ref to persist root

    useEffect(() => {
        // Create root element
        let root = am5.Root.new(chartRef.current!);
        root._logo?.dispose();
        rootRef.current = root;

        // Apply themes
        root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);

        // Create stock chart
        let stockChart = root.container.children.push(am5stock.StockChart.new(root, {}));

        // Create main stock panel (chart area)
        let mainPanel = stockChart.panels.push(
            am5stock.StockPanel.new(root, {
                wheelY: 'zoomX',
                panX: true,
                panY: true,
            })
        );

        // Create axes
        let valueAxis = mainPanel.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                    pan: 'zoom',
                }),
                tooltip: am5.Tooltip.new(root, {}),
                numberFormat: '#,###.####',
                extraTooltipPrecision: 1,
            })
        );

        let dateAxis = mainPanel.xAxes.push(
            am5xy.DateAxis.new(root, {
                baseInterval: { timeUnit: 'day', count: 1 },
                renderer: am5xy.AxisRendererX.new(root, {
                    pan: 'zoom',
                    minGridDistance: 60,
                }),
                tooltip: am5.Tooltip.new(root, {}),
            })
        );

        // Generate data
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        let value = 100;

        function generateData() {
            value = Math.round(Math.random() * 10 - 5 + value);
            am5.time.add(date, 'day', 1);
            return { date: date.getTime(), value: value };
        }

        function generateDatas(count: number) {
            let data = [];
            for (let i = 0; i < count; ++i) {
                data.push(generateData());
            }
            return data;
        }

        let data = generateDatas(1200);

        // Create series
        let series = mainPanel.series.push(
            am5xy.LineSeries.new(root, {
                name: 'Series',
                xAxis: dateAxis,
                yAxis: valueAxis,
                valueYField: 'value',
                valueXField: 'date',
                tooltip: am5.Tooltip.new(root, {
                    labelText: '{valueY}',
                }),
            })
        );

        // Set data
        series.data.setAll(data);
        dateAxis.data.setAll(data);

        // Set as stock series
        stockChart.set('stockSeries', series);

        // Add cursor
        let cursor = mainPanel.set(
            'cursor',
            am5xy.XYCursor.new(root, {
                behavior: 'none',
                xAxis: dateAxis,
            })
        );
        cursor.lineY.set('visible', false);

        // Add legend
        let legend = mainPanel.plotContainer.children.push(
            am5.Legend.new(root, {
                useDefaultMarker: true,
            })
        );

        legend.data.setAll([series]);

        // Add toolbar
        const toolbar = am5stock.StockToolbar.new(root, {
            container: document.getElementById('chartcontrols')!,
            stockChart: stockChart,
            controls: [
                // am5stock.IndicatorControl.new(root, {
                //     stockChart: stockChart,
                // }),
                // am5stock.DateRangeSelector.new(root, {
                //     stockChart: stockChart,
                // }),
                // am5stock.PeriodSelector.new(root, {
                //     stockChart: stockChart,
                // }),
                am5stock.SeriesTypeControl.new(root, {
                    stockChart: stockChart,
                }),
                // am5stock.SettingsControl.new(root, {
                //     stockChart: stockChart,
                // }),
            ],
        });

        // Make stuff animate on load
        series.appear(1000);
        mainPanel.appear(1000, 100);

        return () => {
            root.dispose(); // Clean up chart on unmount
        };
    }, []);

    return (
        <div>
            <div id="chartcontrols"></div>
            <div id="chartdiv" ref={chartRef} className="w-full h-[25rem]" />
        </div>
    );
};

export default Chart;
