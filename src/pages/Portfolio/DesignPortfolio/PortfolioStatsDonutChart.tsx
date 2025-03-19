import { ApexOptions } from 'apexcharts';
import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../redux/store';
import ReactApexChart from 'react-apexcharts';

interface PortfolioStatsDonutChartProps {
    series?: any[];
    labels?: any[];
    title?: string;
    type?: 'donut' | 'pie';
}

export const PortfolioStatsDonutChart: React.FC<PortfolioStatsDonutChartProps> = ({ series, labels, title = 'Donut Chart', type = 'donut' }) => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    const DonutOptions: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Nunito, sans-serif',
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px', // Reduced font size for data labels
                colors: [isDark ? '#bfc9d4' : '#000000'],
            },
            // Uncomment to truncate long data labels
            // formatter: function (val, opts) {
            //     const label = opts.w.globals.labels[opts.seriesIndex];
            //     return label.length > 10 ? label.substring(0, 10) + '...' : label;
            // },
        },
        stroke: {
            show: true,
            width: 7,
            colors: isDark ? ['#0e1726'] : ['#fff'],
        },
        legend: {
            position: 'bottom', // Moved legend to bottom
            horizontalAlign: 'center', // Center align
            fontSize: '13px', // Smaller font size
            markers: {
                strokeWidth: 0, // Smaller markers
                offsetX: -2,
            },
            itemMargin: {
                horizontal: 5, // Spacing between legend items
                vertical: 3,
            },
            // Uncomment to truncate long legend labels
            // formatter: function(legendName) {
            //     return legendName.length > 15 ? legendName.substring(0, 15) + '...' : legendName;
            // },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: type == 'donut' ? '58%' : '0%',
                    background: 'transparent',
                    labels: {
                        show: false,
                        name: {
                            show: true,
                            fontSize: '29px',
                            offsetY: -10,
                        },
                        value: {
                            show: true,
                            fontSize: '26px',
                            color: isDark ? '#bfc9d4' : undefined,
                            offsetY: 16,
                            formatter: (val: string) => val.toString(),
                        },
                    },
                },
            },
        },
        labels: labels,
        states: {
            hover: {
                filter: {
                    type: 'none',
                },
            },
            active: {
                filter: {
                    type: 'none',
                },
            },
        },
    };

    const donutData = {
        series: series,
        options: DonutOptions,
    };

    return (
        <div>
            {series && labels && (
                <div className="dark:bg-black rounded-md py-4">
                    <div className="flex items-center mb-1">
                        <h5 className="font-bold text-center w-full text-xl dark:text-white-light pt-3">{title}</h5>
                    </div>
                    <div className="bg-white dark:bg-black rounded-lg   items-center justify-center min-h-[50vh] ">
                        {/* Removed fixed width for responsiveness */}
                        <ReactApexChart series={donutData.series} options={donutData.options} type="donut" width="100%" height="100%" />
                    </div>
                </div>
            )}
        </div>
    );
};
