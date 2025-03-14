import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from '../../utils/helper';
interface StockBarChartWidgetProps {
    leftBar?: { name: string; series: any[] };
    rightBar?: { name: string; series: any[] };
    years: any;
    colors?: string[];
}
export const StockBarChartWidget: React.FC<StockBarChartWidgetProps> = ({ leftBar, rightBar, years, colors = ['#ffbb44', '#5c1ac3'] }) => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    // Reverse the years and series data
    const reversedYears = years ? [...years]?.reverse() : [];
    const reversedLeftBarSeries = leftBar?.series ? [...leftBar.series]?.reverse() : [];
    const reversedRightBarSeries = rightBar?.series ? [...rightBar.series]?.reverse() : [];
    const barChart: any = {
        series: [
            {
                name: leftBar?.name,
                data: reversedLeftBarSeries,
            },
            {
                name: rightBar?.name,
                data: reversedRightBarSeries,
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: true,
                offsetY: -30,
                formatter: (val: number) => formatNumber(val), // Format values in data labels
                style: {
                    colors: isDark ? ['#ffffff'] : ['#000000'],
                },
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: colors,
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '32%',
                    borderRadius: 4,
                    borderRadiusApplication: 'end',
                    dataLabels: {
                        position: 'top', // Ensures the labels are positioned at the top of the bar
                    },
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },

            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: reversedYears,
                reverseCategories: true,
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: true,
                labels: {
                    formatter: (value: number) => formatNumber(value), // Format y-axis labels
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    formatter: (value: number) => formatNumber(value), // Format tooltip values
                },
            },
        },
    };
    return (
        <div>
            {' '}
            <ReactApexChart options={barChart.options} series={barChart.series} type="bar" height={360} className="overflow-hidden" />
        </div>
    );
};
