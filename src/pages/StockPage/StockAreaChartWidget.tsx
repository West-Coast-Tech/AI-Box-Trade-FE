import React, { useEffect, useRef, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import API from '../../utils/API';
import Dropdown2 from '../../components/Dropdown2';
import IconCaretDown from '../../components/Icon/IconCaretDown';

interface StockChartWidgetProps {
    symbol: string;
}

interface DataPoint {
    year: number;
    value: number;
}

const formatNumber = (value: number): string => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(2);
};

const ratiosAndFundamentals = [
    { title: 'P/E Ratio', url: 'peRatio' },
    { title: 'Ev Revenue', url: 'evRevenue' },
    { title: 'ROIC', url: 'roic' },
    { title: 'Price to Free Cash Flow', url: 'priceToFreeCashFlow' },
    { title: 'Revenue Growth', url: 'revenueGrowth' },
    { title: 'Net Income Growth', url: 'netIncomeGrowth' },
    { title: 'Long Term Liabilites', url: 'longTermLiabilities' },
    { title: 'Free Cash Flow', url: 'freeCashFlow' },
];

const StockChartWidget: React.FC<StockChartWidgetProps> = ({ symbol }) => {
    const [dataPoints, setDataPoints] = useState<number[]>([0]);
    const [data, setData] = useState<DataPoint[]>([]);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [selectedAreaChart, setSelectedAreaChart] = useState(ratiosAndFundamentals[0]);
    const [years, setYears] = useState<number[]>([]);
    const [growth, setGrowth] = useState<{ oneYear: number; twoYear: number; threeYear: number }>({
        oneYear: 0,
        twoYear: 0,
        threeYear: 0,
    });

    const totalOrders: any = {
        series: [
            {
                name: selectedAreaChart.title,
                data: dataPoints,
            },
        ],
        options: {
            chart: {
                animations: {
                    enabled: false,
                },
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            labels: years,
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 80,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: true,
                },
                y: {
                    formatter: (value: number) => formatNumber(value), // Apply formatting to tooltip values
                },
            },
            dataLabels: {
                enabled: true,
                offsetY: -7,
                formatter: (value: number) => formatNumber(value), // Apply formatting to data labels
                style: {
                    fontSize: '10px',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 'bold',
                    colors: ['#008bf4'],
                },
                background: {
                    enabled: true,
                    foreColor: '#000',
                    borderRadius: 3,
                    padding: 4,
                    opacity: 0.5,
                    borderWidth: 0,
                    dropShadow: {
                        enabled: true,
                        top: 1,
                        left: 1,
                        blur: 3,
                        color: 'rgba(0, 0, 0, 0.25)',
                        opacity: 0.7,
                    },
                },
            },
            markers: {
                size: 3,
                colors: ['blue'],
                strokeWidth: 2,
                strokeColors: '#0d6efd',
                hover: {
                    size: 3,
                },
            },
        },
    };
    const calculateGrowth = (data: DataPoint[]) => {
        if (data.length === 0) return { oneYear: 0, twoYear: 0, threeYear: 0 };

        const currentValue = data[data.length - 1].value;

        // 1 Year Growth
        const oneYearAgo = data.length >= 2 ? data[data.length - 2].value : currentValue;
        const oneYearGrowth = ((currentValue - oneYearAgo) / oneYearAgo) * 100;

        // 3 Year Growth
        const twoYearsAgo = data.length >= 3 ? data[data.length - 3].value : currentValue;
        const twoYearGrowth = ((currentValue - twoYearsAgo) / twoYearsAgo) * 100;

        // 5 Year Growth
        const threeYearsAgo = data.length >= 4 ? data[0].value : currentValue;
        const threeYearGrowth = ((currentValue - threeYearsAgo) / threeYearsAgo) * 100;

        return {
            oneYear: oneYearGrowth || 0,
            twoYear: twoYearGrowth || 0,
            threeYear: threeYearGrowth || 0,
        };
    };

    const fetchData = async () => {
        try {
            if (!symbol || !selectedAreaChart.url) return;
            const response = await API.getStockChartWidget(symbol, selectedAreaChart.url);
            const fetchedData = response.data;

            setData(fetchedData);
            setDataPoints(fetchedData.map((item: any) => Number(item.value)));
            setYears(fetchedData.map((item: any) => String(item.year)));

            // Calculate growth percentages
            const growthData = calculateGrowth(fetchedData);
            setGrowth(growthData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // if (!componentRef.current) return;

        // const observer = new IntersectionObserver((entries) => {
        //     if (entries[0].isIntersecting) {
        //         fetchData();
        //     }
        // });

        // observer.observe(componentRef.current);

        // return () => {
        //     if (componentRef.current) {
        //         observer.unobserve(componentRef.current);
        //     }
        // };
        fetchData();
    }, [symbol, selectedAreaChart]);

    return (
        <div ref={componentRef} className="flex rounded-lg ">
            {/* Dropdown Replacing the Static Title */}
            <div className="absolute top-5 left-5 z-10 w-[14rem]">
                <Dropdown2
                    placement="bottom-end"
                    btnClassName="btn btn-outline-info btn-md dropdown-toggle w-full "
                    button={
                        <>
                            {selectedAreaChart.title}
                            <span>
                                <IconCaretDown className="ltr:ml-1 rtl:mr-1 inline-block" />
                            </span>
                        </>
                    }
                >
                    <ul className="w-[14rem] shadow-xl dark:shadow-gray-800 rounded p-2 dark:bg-black bg-white ">
                        {ratiosAndFundamentals.map((item) => (
                            <li key={item.url} className="hover:dark:bg-gray-800 hover:bg-gray-200 rounded cursor-pointer transition-colors ">
                                <button
                                    type="button"
                                    className="block w-full text-left px-4 py-2 focus:outline-none"
                                    onClick={() => {
                                        setSelectedAreaChart(item);
                                    }}
                                >
                                    {item.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Dropdown2>
            </div>
            <div className="flex flex-col w-full">
                <ReactApexChart series={totalOrders?.series} options={totalOrders?.options} type="area" height={380} />
                <div className="flex justify-around mt-4">
                    <div className="flex flex-col items-center">
                        <small>1 Year Change</small>
                        <span className={`${growth.oneYear <= 0 ? 'text-danger' : 'text-success'}`}>{growth.oneYear.toFixed(2)}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <small>2 Year Change</small>
                        <span className={`${growth.twoYear <= 0 ? 'text-danger' : 'text-success'}`}>{growth.twoYear.toFixed(2)}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <small>3 Year Change</small>
                        <span className={`${growth.threeYear <= 0 ? 'text-danger' : 'text-success'}`}>{growth.threeYear.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockChartWidget;
